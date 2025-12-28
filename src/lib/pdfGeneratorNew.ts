import html2pdf from "html2pdf.js";

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

function generateExamHTML(
  examInfo: ExamInfo,
  questions: Question[],
  includeAnswers = false
): string {
  const currentDate = new Date().toLocaleDateString("vi-VN");

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

    body {
      font-family: 'Roboto', 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
      border-bottom: 2px solid #333;
      padding-bottom: 15px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      text-transform: uppercase;
    }
    .header h2 {
      margin: 10px 0;
      font-size: 18px;
      font-weight: normal;
    }
    .exam-info {
      text-align: center;
      margin-bottom: 15px;
      font-size: 12px;
    }
    .instructions {
      font-style: italic;
      margin: 15px 0;
      padding: 10px;
      background: #f5f5f5;
      border-left: 3px solid #666;
      font-size: 11px;
    }
    .student-info {
      display: flex;
      justify-content: space-between;
      margin: 20px 0;
      font-size: 12px;
    }
    .student-info div {
      flex: 1;
    }
    .questions-title {
      font-weight: bold;
      font-size: 14px;
      margin: 20px 0 10px 0;
      text-transform: uppercase;
    }
    .question {
      margin-bottom: 25px;
      page-break-inside: avoid;
    }
    .question-header {
      font-weight: bold;
      margin-bottom: 8px;
      font-size: 12px;
    }
    .question-content {
      margin-bottom: 10px;
      font-size: 12px;
    }
    .answer {
      margin: 5px 0;
      padding: 5px 10px;
      border: 1px solid #ddd;
      border-radius: 3px;
      font-size: 11px;
    }
    .answer.correct {
      background: #d4edda;
      border-color: #28a745;
      font-weight: bold;
      color: #155724;
    }
    .answer-space {
      margin: 10px 0;
      font-size: 11px;
    }
    .essay-lines {
      margin-top: 10px;
    }
    .essay-line {
      border-bottom: 1px solid #ccc;
      height: 25px;
      margin: 5px 0;
    }
    .footer {
      margin-top: 30px;
      text-align: center;
      font-size: 10px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${examInfo.subject}</h1>
    <h2>${examInfo.name}</h2>
  </div>

  <div class="exam-info">
    <strong>Lớp:</strong> ${examInfo.grade} |
    <strong>Thời gian:</strong> ${examInfo.durationMinutes} phút |
    <strong>Tổng điểm:</strong> ${examInfo.totalScore}
  </div>

  ${
    examInfo.instructions
      ? `
  <div class="instructions">
    <strong>Hướng dẫn:</strong> ${examInfo.instructions}
  </div>
  `
      : ""
  }

  <div class="student-info">
    <div>Họ và tên: _______________________________</div>
    <div>Lớp: ___________</div>
  </div>
  <div class="student-info">
    <div>Mã học sinh: ___________________________</div>
    <div>Ngày thi: ${currentDate}</div>
  </div>

  <div class="questions-title">Câu hỏi</div>

  ${questions
    .map((question, index) => {
      const questionHtml = `
    <div class="question">
      <div class="question-header">
        Câu ${index + 1} (${question.points} điểm)
      </div>
      <div class="question-content">
        ${question.content}
      </div>
      ${
        question.answers && question.answers.length > 0
          ? `
        <div class="answers">
          ${question.answers
            .map((answer, ansIndex) => {
              const letter = String.fromCharCode(65 + ansIndex);
              const isCorrect =
                includeAnswers && ansIndex === question.correctAnswer;
              return `
            <div class="answer ${isCorrect ? "correct" : ""}">
              ${letter}. ${answer}${isCorrect ? " ✓" : ""}
            </div>
          `;
            })
            .join("")}
        </div>
        ${
          !includeAnswers
            ? `
        <div class="answer-space">
          <strong>Đáp án của bạn:</strong> _____
        </div>
        `
            : ""
        }
      `
          : `
        <div class="essay-lines">
          <strong>Trả lời:</strong>
          <div class="essay-line"></div>
          <div class="essay-line"></div>
          <div class="essay-line"></div>
          <div class="essay-line"></div>
          <div class="essay-line"></div>
        </div>
      `
      }
    </div>
  `;
      return questionHtml;
    })
    .join("")}

  <div class="footer">
    --- Hết ---
  </div>
</body>
</html>
  `;
}

export async function generateExamPDF(
  examInfo: ExamInfo,
  questions: Question[],
  includeAnswers = false
): Promise<Blob> {
  const htmlContent = generateExamHTML(examInfo, questions, includeAnswers);

  const element = document.createElement("div");
  element.innerHTML = htmlContent;

  const opt = {
    margin: 10,
    filename: `${examInfo.subject}_${examInfo.name}_${new Date().toISOString().split("T")[0]}.pdf`,
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: {
      unit: "mm" as const,
      format: "a4" as const,
      orientation: "portrait" as const,
    },
  };

  return await html2pdf().from(element).set(opt).output("blob");
}

export async function downloadExamPDF(
  examInfo: ExamInfo,
  questions: Question[],
  includeAnswers = false
): Promise<void> {
  const htmlContent = generateExamHTML(examInfo, questions, includeAnswers);

  const element = document.createElement("div");
  element.innerHTML = htmlContent;
  document.body.appendChild(element);

  const fileName = `${examInfo.subject}_${examInfo.name}_${includeAnswers ? "DapAn" : "DeThi"}_${new Date().toISOString().split("T")[0]}.pdf`;

  await html2pdf()
    .from(element)
    .set({
      margin: 10,
      filename: fileName,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: {
        unit: "mm" as const,
        format: "a4" as const,
        orientation: "portrait" as const,
      },
    })
    .save();

  document.body.removeChild(element);
}

export async function previewExamPDF(
  examInfo: ExamInfo,
  questions: Question[]
): Promise<string> {
  const blob = await generateExamPDF(examInfo, questions, false);
  return URL.createObjectURL(blob);
}
