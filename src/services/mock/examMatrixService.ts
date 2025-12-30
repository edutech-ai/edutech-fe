import type { ExamMatrix } from "@/types";

// Mock data
const mockMatrices: ExamMatrix[] = [
  {
    id: "matrix-1",
    name: "Ma trận Toán 10 - Học kỳ 1",
    description: "Ma trận đề thi học kỳ 1 môn Toán lớp 10",
    subject: "Toán",
    grade: 10,
    chapters: [
      {
        id: "ch-1",
        chapterNumber: 1,
        chapterName: "Mệnh đề, tập hợp",
        distribution: {
          recognition: { count: 2, points: 1 },
          comprehension: { count: 1, points: 1.5 },
          application: { count: 1, points: 2 },
          highApplication: { count: 0, points: 0 },
        },
      },
      {
        id: "ch-2",
        chapterNumber: 2,
        chapterName: "Hàm số bậc nhất và bậc hai",
        distribution: {
          recognition: { count: 2, points: 1 },
          comprehension: { count: 2, points: 1.5 },
          application: { count: 1, points: 2 },
          highApplication: { count: 1, points: 2.5 },
        },
      },
    ],
    totalQuestions: 10,
    totalPoints: 10,
    createdBy: "user-1",
    createdAt: "2024-12-20T10:00:00Z",
    updatedAt: "2024-12-20T10:00:00Z",
  },
  {
    id: "matrix-2",
    name: "Ma trận Tiếng Anh 11 - Giữa kỳ",
    description: "Ma trận đề thi giữa kỳ môn Tiếng Anh lớp 11",
    subject: "Tiếng Anh",
    grade: 11,
    chapters: [
      {
        id: "ch-3",
        chapterNumber: 1,
        chapterName: "Friendship",
        distribution: {
          recognition: { count: 3, points: 0.5 },
          comprehension: { count: 2, points: 1 },
          application: { count: 1, points: 1.5 },
          highApplication: { count: 0, points: 0 },
        },
      },
      {
        id: "ch-4",
        chapterNumber: 2,
        chapterName: "Cultural Diversity",
        distribution: {
          recognition: { count: 3, points: 0.5 },
          comprehension: { count: 3, points: 1 },
          application: { count: 2, points: 1.5 },
          highApplication: { count: 1, points: 2 },
        },
      },
    ],
    totalQuestions: 15,
    totalPoints: 10,
    createdBy: "user-1",
    createdAt: "2024-12-18T14:00:00Z",
    updatedAt: "2024-12-18T14:00:00Z",
  },
];

class ExamMatrixMockService {
  private matrices: ExamMatrix[] = [...mockMatrices];

  async getAll(filters?: {
    subject?: string;
    grade?: number;
  }): Promise<ExamMatrix[]> {
    await this.delay(300);

    let filtered = [...this.matrices];

    if (filters?.subject) {
      filtered = filtered.filter((m) => m.subject === filters.subject);
    }

    if (filters?.grade) {
      filtered = filtered.filter((m) => m.grade === filters.grade);
    }

    return filtered.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getById(id: string): Promise<ExamMatrix | null> {
    await this.delay(200);
    return this.matrices.find((m) => m.id === id) || null;
  }

  async create(
    data: Omit<ExamMatrix, "id" | "createdAt" | "updatedAt">
  ): Promise<ExamMatrix> {
    await this.delay(500);

    const newMatrix: ExamMatrix = {
      ...data,
      id: `matrix-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.matrices.push(newMatrix);
    return newMatrix;
  }

  async update(id: string, data: Partial<ExamMatrix>): Promise<ExamMatrix> {
    await this.delay(500);

    const index = this.matrices.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new Error("Matrix not found");
    }

    this.matrices[index] = {
      ...this.matrices[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return this.matrices[index];
  }

  async delete(id: string): Promise<void> {
    await this.delay(300);

    const index = this.matrices.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new Error("Matrix not found");
    }

    this.matrices.splice(index, 1);
  }

  async duplicate(id: string): Promise<ExamMatrix> {
    await this.delay(500);

    const original = await this.getById(id);
    if (!original) {
      throw new Error("Matrix not found");
    }

    const duplicated: ExamMatrix = {
      ...original,
      id: `matrix-${Date.now()}`,
      name: `${original.name} (Sao chép)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.matrices.push(duplicated);
    return duplicated;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const examMatrixMockService = new ExamMatrixMockService();
