import html2pdf from "html2pdf.js";
import katex from "katex";

let _katexInlineCSS: string | null = null;
async function getKatexInlineCSS(): Promise<string> {
  if (_katexInlineCSS !== null) return _katexInlineCSS;
  try {
    const res = await fetch(
      "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
    );
    const css = await res.text();
    // Rewrite relative font paths → absolute CDN URLs
    _katexInlineCSS = css.replace(
      /url\(fonts\//g,
      "url(https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/fonts/"
    );
  } catch {
    _katexInlineCSS = ".latex-formula { display: inline; }";
  }
  return _katexInlineCSS;
}

// After the element is in the DOM and fonts are loaded, replace all em-based
// inline style values with their computed px equivalents.
// html2canvas miscalculates em units for deeply nested elements (e.g. KaTeX
// superscripts inside inline-table cells), so we let the browser do the
// em→px conversion first, then hand html2canvas plain px numbers.
function pxifyKatexStyles(container: HTMLElement): void {
  const EM_PROPS = [
    "top",
    "bottom",
    "left",
    "right",
    "height",
    "minHeight",
    "width",
    "marginTop",
    "marginRight",
    "marginBottom",
    "marginLeft",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "verticalAlign",
    "fontSize",
  ] as const;

  container.querySelectorAll<HTMLElement>("[style]").forEach((el) => {
    const computed = window.getComputedStyle(el);
    for (const prop of EM_PROPS) {
      const val = el.style[prop];
      if (val && val.includes("em")) {
        const px = computed[prop];
        if (px && px !== "auto" && px !== "normal" && px !== "") {
          el.style[prop] = px;
        }
      }
    }
  });
}

// LaTeX pattern detection
const LATEX_PATTERNS = [
  /\\[a-zA-Z]+/, // LaTeX commands like \pi, \frac, \sqrt
  /\^{[^}]+}/, // Superscript with braces: ^{2}
  /\^\d+/, // Simple superscript: ^2, ^3
  /\^[a-zA-Z]/, // Variable superscript: ^n, ^x
  /_{[^}]+}/, // Subscript with braces: _{i}
  /_\d+/, // Simple subscript: _1, _2
  /_[a-zA-Z]/, // Variable subscript: _i, _n
];

function containsLatex(text: string): boolean {
  return LATEX_PATTERNS.some((pattern) => pattern.test(text));
}

function decodeHTMLEntities(text: string): string {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ");
}

function renderKatex(formula: string, display = false): string {
  return katex.renderToString(formula.trim(), {
    throwOnError: false,
    displayMode: display,
    output: "html",
  });
}

// Returns true if `formula` looks like it contains an HTML tag (e.g. <b>, </p>)
// Used to avoid matching $...$ across HTML markup.
// "< x <" or "< 3" does NOT trigger this (space or digit after <, not a letter).
function looksLikeHTML(formula: string): boolean {
  return /<\/?[a-zA-Z][a-zA-Z0-9]*/.test(formula);
}

// Render LaTeX formulas in HTML content
function renderLatexInContent(html: string): string {
  if (!html) return "";

  let result = html;

  // Step 1: $$...$$ display math (before $...$)
  result = result.replace(/\$\$([\s\S]+?)\$\$/g, (match, formula) => {
    if (looksLikeHTML(formula)) return match;
    try {
      return `<span class="latex-formula">${renderKatex(decodeHTMLEntities(formula), true)}</span>`;
    } catch {
      return match;
    }
  });

  // Step 2: $...$ inline math
  // Allow < and > in formulas (needed for inequalities like $0 < x < 10$).
  // Guard against accidentally matching across HTML tags.
  result = result.replace(/\$([^$\n]{1,300}?)\$/g, (match, formula) => {
    if (looksLikeHTML(formula)) return match;
    try {
      return `<span class="latex-formula">${renderKatex(decodeHTMLEntities(formula))}</span>`;
    } catch {
      return match;
    }
  });

  // Step 3: <span class="ql-formula" data-value="..."> (from Quill editor)
  const formulaRegex =
    /<span[^>]*class="[^"]*ql-formula[^"]*"[^>]*data-value="([^"]*)"[^>]*>.*?<\/span>/gi;
  result = result.replace(formulaRegex, (match, formula) => {
    try {
      const decoded = decodeHTMLEntities(formula);
      return `<span class="latex-formula">${renderKatex(decoded)}</span>`;
    } catch {
      return formula;
    }
  });

  // Step 4: plain <span> containing LaTeX commands (Quill fallback)
  result = result.replace(/<span>([^<]+)<\/span>/gi, (original, content) => {
    const decoded = decodeHTMLEntities(content);
    if (containsLatex(decoded)) {
      try {
        return `<span class="latex-formula">${renderKatex(decoded)}</span>`;
      } catch {
        return decoded;
      }
    }
    return original;
  });

  return result;
}

interface ExamInfo {
  name: string;
  subject: string;
  grade: number;
  durationMinutes: number;
  totalScore: number;
  instructions?: string;
}

interface Question {
  id: string;
  order: number;
  content: string;
  type: string;
  answers?: string[];
  correctAnswer?: number | string;
  points: number;
}

function getOptionsLayout(answers: string[]): "grid2" | "stack" {
  // Measure visible text length (strip HTML tags and $...$ delimiters)
  const visibleLen = (s: string) =>
    s
      .replace(/<[^>]+>/g, "")
      .replace(/\$\$?/g, "")
      .trim().length;
  const avgLen =
    answers.reduce((sum, a) => sum + visibleLen(a), 0) / answers.length;
  if (avgLen <= 45) return "grid2";
  return "stack";
}

function renderMCQOptions(
  answers: string[],
  correctAnswer: number | string | undefined,
  includeAnswers: boolean
): string {
  const layout = getOptionsLayout(answers);
  const cols = layout === "grid2" ? 2 : 1;

  const optionItems = answers
    .map((answer, i) => {
      const letter = String.fromCharCode(65 + i);
      const isCorrect = includeAnswers && i === correctAnswer;
      const rendered = renderLatexInContent(answer);
      return `<div class="opt${isCorrect ? " correct" : ""}">${letter}. ${rendered}</div>`;
    })
    .join("");

  return `<div class="options cols-${cols}">${optionItems}</div>`;
}

function generateExamHTML(
  examInfo: ExamInfo,
  questions: Question[],
  includeAnswers = false,
  katexCSS = ".latex-formula { display: inline; }"
): string {
  // Separate MCQ and essay questions for answer key table
  const mcqQuestions = questions.filter(
    (q) => q.answers && q.answers.length > 0
  );

  const answerKeyTable =
    includeAnswers && mcqQuestions.length > 0
      ? `
  <div class="answer-key">
    <div class="answer-key-title">ĐÁP ÁN</div>
    <table class="answer-key-table">
      <tr>
        ${mcqQuestions.map((q) => `<th>Câu ${q.order}</th>`).join("")}
      </tr>
      <tr>
        ${mcqQuestions
          .map((q) => {
            const idx =
              typeof q.correctAnswer === "number" ? q.correctAnswer : -1;
            const letter =
              idx >= 0 && q.answers ? String.fromCharCode(65 + idx) : "—";
            return `<td>${letter}</td>`;
          })
          .join("")}
      </tr>
    </table>
  </div>`
      : "";

  // Return a self-contained fragment (no html/head/body wrappers)
  // so it works correctly when set as innerHTML of a div element
  return `
<style>
  .exam-wrapper *, .exam-wrapper *::before, .exam-wrapper *::after {
    box-sizing: border-box;
  }
  .exam-wrapper {
    font-family: 'Times New Roman', Times, serif;
    font-size: 13pt;
    line-height: 1.55;
    color: #000;
    background: #fff;
    padding: 20mm 20mm 15mm 25mm;
    width: 210mm;
  }
  .exam-wrapper .header { text-align: center; margin-bottom: 6px; }
  .exam-wrapper .exam-title {
    font-size: 15pt;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .exam-wrapper .exam-meta { font-size: 12pt; margin: 3px 0; }
  .exam-wrapper .divider {
    border: none;
    border-top: 1.5px solid #000;
    margin: 8px 0 14px;
  }
  .exam-wrapper .instructions {
    font-style: italic;
    font-size: 12pt;
    margin-bottom: 12px;
  }
  .exam-wrapper .question {
    margin-bottom: 18px;
    page-break-inside: avoid;
  }
  .exam-wrapper .question-text { font-size: 13pt; margin-bottom: 6px; }
  .exam-wrapper .question-text b { font-weight: bold; }
  .exam-wrapper .question-text p { margin: 0; display: inline; }
  .exam-wrapper .question-text p + p::before { content: " "; }
  .exam-wrapper .options {
    display: grid;
    gap: 2px 8px;
    font-size: 12pt;
    margin-top: 4px;
    padding-left: 16px;
  }
  .exam-wrapper .options.cols-2 { grid-template-columns: repeat(2, 1fr); }
  .exam-wrapper .options.cols-1 { grid-template-columns: 1fr; }
  .exam-wrapper .opt { padding: 0; }
  .exam-wrapper .opt.correct { font-weight: bold; text-decoration: underline; }
  .exam-wrapper .essay-lines { margin-top: 6px; }
  .exam-wrapper .essay-line {
    border-bottom: 1px solid #888;
    height: 24px;
    margin: 3px 0;
  }
  .exam-wrapper .footer {
    margin-top: 28px;
    text-align: center;
    font-size: 11pt;
  }
  .exam-wrapper .answer-key {
    margin-top: 24px;
    border-top: 1px solid #000;
    padding-top: 10px;
  }
  .exam-wrapper .answer-key-title {
    font-weight: bold;
    font-size: 13pt;
    text-align: center;
    margin-bottom: 8px;
  }
  .exam-wrapper .answer-key-table { width: 100%; border-collapse: collapse; font-size: 11pt; }
  .exam-wrapper .answer-key-table th,
  .exam-wrapper .answer-key-table td {
    border: 1px solid #333;
    padding: 4px 6px;
    text-align: center;
    min-width: 36px;
  }
  .latex-formula { display: inline; }
  ${katexCSS}
</style>

<div class="exam-wrapper">
  <div class="header">
    <div class="exam-title">${examInfo.name}</div>
    <div class="exam-meta">Môn: ${examInfo.subject}${examInfo.grade ? ` &nbsp;|&nbsp; Lớp ${examInfo.grade}` : ""}</div>
    <div class="exam-meta">Thời gian: ${examInfo.durationMinutes} phút (không kể thời gian giao đề)</div>
  </div>

  <hr class="divider">

  ${examInfo.instructions ? `<div class="instructions"><strong>Lưu ý:</strong> ${examInfo.instructions}</div>` : ""}

  ${questions
    .map((question, index) => {
      const renderedContent = renderLatexInContent(question.content);
      const hasOptions = question.answers && question.answers.length > 0;

      return `
  <div class="question">
    <div class="question-text">
      <b>Câu ${index + 1}</b>${question.points ? ` (${question.points} điểm)` : ""}. ${renderedContent}
    </div>
    ${
      hasOptions
        ? renderMCQOptions(
            question.answers!,
            question.correctAnswer,
            includeAnswers
          )
        : `<div class="essay-lines">
            <div class="essay-line"></div>
            <div class="essay-line"></div>
            <div class="essay-line"></div>
            <div class="essay-line"></div>
          </div>`
    }
  </div>`;
    })
    .join("")}

  <div class="footer">— Hết —</div>

  ${answerKeyTable}
</div>`;
}

export async function generateExamPDF(
  examInfo: ExamInfo,
  questions: Question[],
  includeAnswers = false
): Promise<Blob> {
  const katexCSS = await getKatexInlineCSS();
  const htmlContent = generateExamHTML(
    examInfo,
    questions,
    includeAnswers,
    katexCSS
  );

  const element = document.createElement("div");
  element.style.cssText =
    "position:absolute;top:0;left:0;z-index:-9999;pointer-events:none;";
  element.innerHTML = htmlContent;
  document.body.appendChild(element);

  // Wait for KaTeX CDN fonts to fully load, then replace em-based inline
  // style values with computed px so html2canvas gets accurate positions.
  await document.fonts.ready;
  pxifyKatexStyles(element);

  const pdfElement =
    (element.querySelector(".exam-wrapper") as HTMLElement) ?? element;

  const opt = {
    margin: 0,
    filename: `${examInfo.subject}_${examInfo.name}_${new Date().toISOString().split("T")[0]}.pdf`,
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: {
      unit: "mm" as const,
      format: "a4" as const,
      orientation: "portrait" as const,
    },
  };

  try {
    return await html2pdf().from(pdfElement).set(opt).output("blob");
  } finally {
    document.body.removeChild(element);
  }
}

export async function downloadExamPDF(
  examInfo: ExamInfo,
  questions: Question[],
  includeAnswers = false
): Promise<void> {
  const katexCSS = await getKatexInlineCSS();
  const htmlContent = generateExamHTML(
    examInfo,
    questions,
    includeAnswers,
    katexCSS
  );

  const element = document.createElement("div");
  element.style.cssText =
    "position:absolute;top:0;left:0;z-index:-9999;pointer-events:none;";
  element.innerHTML = htmlContent;
  document.body.appendChild(element);

  await document.fonts.ready;
  pxifyKatexStyles(element);

  const pdfElement =
    (element.querySelector(".exam-wrapper") as HTMLElement) ?? element;
  const fileName = `${examInfo.subject}_${examInfo.name}_${includeAnswers ? "DapAn" : "DeThi"}_${new Date().toISOString().split("T")[0]}.pdf`;

  try {
    await html2pdf()
      .from(pdfElement)
      .set({
        margin: 0,
        filename: fileName,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: {
          unit: "mm" as const,
          format: "a4" as const,
          orientation: "portrait" as const,
        },
      })
      .save();
  } finally {
    document.body.removeChild(element);
  }
}

export async function previewExamPDF(
  examInfo: ExamInfo,
  questions: Question[]
): Promise<string> {
  const blob = await generateExamPDF(examInfo, questions, false);
  return URL.createObjectURL(blob);
}
