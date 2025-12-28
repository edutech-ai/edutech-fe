import { jsPDF } from "jspdf";

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

export function generateExamPDF(
  examInfo: ExamInfo,
  questions: Question[],
  includeAnswers = false
): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper function to check if we need a new page
  const checkNewPage = (neededHeight: number) => {
    if (yPosition + neededHeight > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Helper function to wrap text
  const wrapText = (text: string, maxWidth: number): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = doc.getTextWidth(testLine);

      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  };

  // Header
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(examInfo.subject.toUpperCase(), pageWidth / 2, yPosition, {
    align: "center",
  });
  yPosition += 10;

  doc.setFontSize(14);
  doc.text(examInfo.name, pageWidth / 2, yPosition, { align: "center" });
  yPosition += 12;

  // Exam Info
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const infoText = `Grade: ${examInfo.grade} | Duration: ${examInfo.durationMinutes} minutes | Total Score: ${examInfo.totalScore} points`;
  doc.text(infoText, pageWidth / 2, yPosition, { align: "center" });
  yPosition += 8;

  // Divider line
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Instructions
  if (examInfo.instructions) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    const instructionLines = wrapText(
      `Instructions: ${examInfo.instructions}`,
      contentWidth
    );
    instructionLines.forEach((line) => {
      checkNewPage(6);
      doc.text(line, margin, yPosition);
      yPosition += 5;
    });
    yPosition += 5;
  }

  // Student Info Section
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  checkNewPage(20);
  doc.text("Student Name: _________________________", margin, yPosition);
  doc.text("Class: _________", pageWidth - margin - 60, yPosition);
  yPosition += 6;
  doc.text("Student ID: _________________________", margin, yPosition);
  doc.text(
    `Date: ${new Date().toLocaleDateString()}`,
    pageWidth - margin - 60,
    yPosition
  );
  yPosition += 12;

  // Questions
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  checkNewPage(8);
  doc.text("QUESTIONS", margin, yPosition);
  yPosition += 10;

  questions.forEach((question, index) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    // Check if we need a new page for this question
    const estimatedHeight = 30 + (question.answers?.length || 0) * 6;
    checkNewPage(estimatedHeight);

    // Question number and content
    doc.setFont("helvetica", "bold");
    const questionHeader = `Question ${index + 1} (${question.points} ${question.points === 1 ? "point" : "points"})`;
    doc.text(questionHeader, margin, yPosition);
    yPosition += 6;

    doc.setFont("helvetica", "normal");
    const contentLines = wrapText(question.content, contentWidth);
    contentLines.forEach((line) => {
      checkNewPage(6);
      doc.text(line, margin, yPosition);
      yPosition += 5;
    });
    yPosition += 3;

    // Multiple choice answers
    if (question.answers && question.answers.length > 0) {
      question.answers.forEach((answer, ansIndex) => {
        checkNewPage(6);
        const letter = String.fromCharCode(65 + ansIndex); // A, B, C, D
        const isCorrect = includeAnswers && ansIndex === question.correctAnswer;

        // Set color for correct answer
        if (isCorrect) {
          doc.setTextColor(34, 139, 34); // Green color for correct answer
          doc.setFont("helvetica", "bold");
        }

        const answerLines = wrapText(
          `${letter}. ${answer}${isCorrect ? " ✓" : ""}`,
          contentWidth - 10
        );
        answerLines.forEach((line, lineIndex) => {
          checkNewPage(6);
          if (lineIndex === 0) {
            doc.text(line, margin + 5, yPosition);
          } else {
            doc.text(line, margin + 10, yPosition);
          }
          yPosition += 5;
        });

        // Reset color and font
        if (isCorrect) {
          doc.setTextColor(0, 0, 0);
          doc.setFont("helvetica", "normal");
        }
      });
      yPosition += 5;

      // Answer space if not including answers
      if (!includeAnswers) {
        doc.text("Your answer: _____", margin + 5, yPosition);
        yPosition += 8;
      }
    } else {
      // Essay question - provide space for answer
      doc.text("Answer:", margin, yPosition);
      yPosition += 6;
      doc.setDrawColor(200, 200, 200);
      for (let i = 0; i < 5; i++) {
        checkNewPage(6);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 6;
      }
      yPosition += 5;
    }

    yPosition += 5;
  });

  // Footer on each page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, {
      align: "center",
    });
  }

  return doc;
}

export function downloadExamPDF(
  examInfo: ExamInfo,
  questions: Question[],
  includeAnswers = false
): void {
  const doc = generateExamPDF(examInfo, questions, includeAnswers);
  const fileName = `${examInfo.subject}_${examInfo.name}_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
}

export function previewExamPDF(
  examInfo: ExamInfo,
  questions: Question[]
): string {
  const doc = generateExamPDF(examInfo, questions, false);
  const blob = doc.output("blob");
  return URL.createObjectURL(blob);
}
