import type { FolderColor } from "@/components/atoms/FolderIcon";

export type { FolderColor };

export interface Folder {
  id: string;
  name: string;
  itemCount: number;
  createdAt: string;
  color: FolderColor;
  parentId: string | null;
}

export interface File {
  id: string;
  name: string;
  type: string;
  size: string;
  createdAt: string;
  folderId: string | null;
}

export const mockFolders: Folder[] = [
  {
    id: "f1",
    name: "Toán học",
    itemCount: 5,
    createdAt: "2024-12-15T10:00:00",
    color: "blue",
    parentId: null,
  },
  {
    id: "f2",
    name: "Ngữ văn",
    itemCount: 3,
    createdAt: "2024-12-14T14:30:00",
    color: "green",
    parentId: null,
  },
  {
    id: "f3",
    name: "Hóa học",
    itemCount: 8,
    createdAt: "2024-12-13T09:15:00",
    color: "purple",
    parentId: null,
  },
  {
    id: "f4",
    name: "Lớp 10",
    itemCount: 12,
    createdAt: "2024-12-12T11:20:00",
    color: "yellow",
    parentId: "f1",
  },
  {
    id: "f5",
    name: "Lớp 11",
    itemCount: 8,
    createdAt: "2024-12-11T16:45:00",
    color: "orange",
    parentId: "f1",
  },
];

export const mockFiles: File[] = [
  {
    id: "file1",
    name: "Kiểm tra giữa kỳ I - Toán 10.pdf",
    type: "pdf",
    size: "2.5 MB",
    createdAt: "2024-12-15T10:00:00",
    folderId: "f4",
  },
  {
    id: "file2",
    name: "Đề thi học kỳ II - Toán 11.docx",
    type: "docx",
    size: "1.8 MB",
    createdAt: "2024-12-14T14:30:00",
    folderId: "f5",
  },
  {
    id: "file3",
    name: "Bài tập nâng cao - Văn 12.pdf",
    type: "pdf",
    size: "3.2 MB",
    createdAt: "2024-12-13T09:15:00",
    folderId: "f2",
  },
];
