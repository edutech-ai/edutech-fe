import DOMPurify from "dompurify";
import katex from "katex";

// LaTeX pattern detection - checks if text contains LaTeX syntax
const LATEX_PATTERNS = [
  /\\[a-zA-Z]+/, // LaTeX commands like \pi, \frac, \sqrt
  /\^{[^}]+}/, // Superscript with braces: ^{2}
  /\^\d+/, // Simple superscript: ^2, ^3
  /\^[a-zA-Z]/, // Variable superscript: ^n, ^x
  /_{[^}]+}/, // Subscript with braces: _{i}
  /_\d+/, // Simple subscript: _1, _2
  /_[a-zA-Z]/, // Variable subscript: _i, _n
  /\\frac\{/, // Fractions
  /\\sqrt/, // Square root
  /\\sum/, // Sum
  /\\int/, // Integral
  /\\lim/, // Limit
  /\\infty/, // Infinity
  /\\alpha|\\beta|\\gamma|\\delta|\\theta|\\pi/, // Greek letters
  /\\leq|\\geq|\\neq|\\approx/, // Comparison operators
  /\\times|\\div|\\pm/, // Math operators
];

function containsLatex(text: string): boolean {
  return LATEX_PATTERNS.some((pattern) => pattern.test(text));
}

/**
 * Check if content is pure LaTeX (no mixed regular text)
 * Pure LaTeX typically only contains math symbols, numbers, and LaTeX commands
 */
function isPureLatex(text: string): boolean {
  // If text contains Vietnamese characters or common sentence patterns, it's mixed content
  const vietnamesePattern =
    /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
  if (vietnamesePattern.test(text)) return false;

  // If text has common words or long sequences of regular letters, it's likely mixed
  const hasCommonWords = /[a-zA-Z]{4,}/.test(text.replace(/\\[a-zA-Z]+/g, "")); // Ignore LaTeX commands
  if (hasCommonWords) return false;

  return true;
}

/**
 * Sanitize HTML content and render LaTeX formulas
 */
export function sanitizeAndRenderLatex(html: string): string {
  if (!html) return "";

  // First pass: sanitize the HTML
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "s",
      "sub",
      "sup",
      "span",
      "div",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "a",
      "img",
      "blockquote",
      "pre",
      "code",
    ],
    ALLOWED_ATTR: [
      "class",
      "href",
      "src",
      "alt",
      "target",
      "rel",
      "data-value",
      "style",
    ],
    ALLOW_DATA_ATTR: true,
  });

  let rendered = sanitized;

  // Pattern 1: Match <span class="ql-formula" data-value="...">...</span>
  const formulaRegex =
    /<span[^>]*class="[^"]*ql-formula[^"]*"[^>]*data-value="([^"]*)"[^>]*>.*?<\/span>/gi;

  rendered = rendered.replace(formulaRegex, (match, formula) => {
    try {
      const decoded = decodeHTMLEntities(formula);
      const prepared = prepareForKatex(decoded);
      const renderedFormula = katex.renderToString(prepared, {
        throwOnError: false,
        displayMode: false,
        output: "html",
      });
      return `<span class="latex-formula">${renderedFormula}</span>`;
    } catch (error) {
      console.error("LaTeX render error:", error);
      return `<span class="latex-error" title="Invalid formula">${formula}</span>`;
    }
  });

  // Pattern 2: Handle inline LaTeX delimiters \( ... \) and \[ ... \]
  // This handles mixed content like "Text \( formula \) more text"
  const inlineLatexRegex = /\\\((.+?)\\\)/g;
  const displayLatexRegex = /\\\[(.+?)\\\]/g;

  rendered = rendered.replace(inlineLatexRegex, (match, formula) => {
    try {
      const decoded = decodeHTMLEntities(formula.trim());
      const prepared = prepareForKatex(decoded);
      const renderedFormula = katex.renderToString(prepared, {
        throwOnError: false,
        displayMode: false,
        output: "html",
      });
      return `<span class="latex-formula">${renderedFormula}</span>`;
    } catch (error) {
      console.error("LaTeX render error:", error);
      return `<span class="latex-error" title="Invalid formula">${formula}</span>`;
    }
  });

  rendered = rendered.replace(displayLatexRegex, (match, formula) => {
    try {
      const decoded = decodeHTMLEntities(formula.trim());
      const prepared = prepareForKatex(decoded);
      const renderedFormula = katex.renderToString(prepared, {
        throwOnError: false,
        displayMode: true,
        output: "html",
      });
      return `<div class="latex-formula latex-display">${renderedFormula}</div>`;
    } catch (error) {
      console.error("LaTeX render error:", error);
      return `<span class="latex-error" title="Invalid formula">${formula}</span>`;
    }
  });

  // Pattern 3: Match plain <span>content</span> (from backend data)
  // Only render as full LaTeX if NO delimiters and content looks like pure LaTeX
  const plainSpanRegex = /<span>([^<]*)<\/span>/gi;

  rendered = rendered.replace(plainSpanRegex, (match, content) => {
    if (!content || content.trim() === "") return match;

    const decoded = decodeHTMLEntities(content);

    // Skip if already processed (contains rendered latex spans) or has delimiters
    if (decoded.includes("\\(") || decoded.includes("\\[")) {
      return match;
    }

    // Check if content looks like pure LaTeX (no Vietnamese/regular text mixed in)
    if (containsLatex(decoded) && isPureLatex(decoded)) {
      try {
        const prepared = prepareForKatex(decoded);
        const renderedFormula = katex.renderToString(prepared, {
          throwOnError: false,
          displayMode: false,
          output: "html",
        });
        return `<span class="latex-formula">${renderedFormula}</span>`;
      } catch (error) {
        console.error("LaTeX render error:", error);
        return `<span class="latex-error" title="Invalid formula">${decoded}</span>`;
      }
    }

    // Not LaTeX, return original
    return match;
  });

  return rendered;
}

/**
 * Decode HTML entities and prepare for KaTeX
 */
function decodeHTMLEntities(text: string): string {
  // First, manually decode common HTML entities
  let decoded = text
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Use textarea for any remaining entities (client-side only)
  if (typeof document !== "undefined") {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = decoded;
    decoded = textarea.value;
  }

  return decoded;
}

/**
 * Prepare LaTeX string for KaTeX rendering
 * - Convert comparison operators to LaTeX equivalents
 */
function prepareForKatex(latex: string): string {
  return latex
    .replace(/</g, "\\lt ")
    .replace(/>/g, "\\gt ")
    .replace(/≤/g, "\\leq ")
    .replace(/≥/g, "\\geq ")
    .replace(/≠/g, "\\neq ");
}

/**
 * Extract plain text from HTML (for search/preview purposes)
 */
export function extractPlainText(html: string): string {
  if (!html) return "";

  // Remove HTML tags
  const text = html.replace(/<[^>]+>/g, " ");

  // Decode HTML entities
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;

  // Clean up whitespace
  return textarea.value.replace(/\s+/g, " ").trim();
}

/**
 * Check if content contains LaTeX formulas
 */
export function hasLatexFormulas(html: string): boolean {
  if (!html) return false;

  // Check for ql-formula class (from Quill editor)
  if (html.includes("ql-formula") || html.includes("data-value=")) {
    return true;
  }

  // Check for plain spans with LaTeX content
  const plainSpanRegex = /<span>([^<]+)<\/span>/gi;
  let match;
  while ((match = plainSpanRegex.exec(html)) !== null) {
    if (containsLatex(match[1])) {
      return true;
    }
  }

  return false;
}

/**
 * Render LaTeX formula to HTML string
 */
export function renderLatexFormula(
  latex: string,
  displayMode: boolean = false
): string {
  try {
    const prepared = prepareForKatex(latex);
    return katex.renderToString(prepared, {
      throwOnError: false,
      displayMode,
      output: "html",
    });
  } catch (error) {
    console.error("LaTeX render error:", error);
    return `<span class="latex-error">${latex}</span>`;
  }
}
