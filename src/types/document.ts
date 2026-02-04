// ==================== DOCUMENT TYPES ====================

// Supported document types
export type DocumentType =
  | "pdf"
  | "doc"
  | "docx"
  | "xls"
  | "xlsx"
  | "ppt"
  | "pptx"
  | "txt"
  | "csv"
  | "image"
  | "other";

// ==================== DOCUMENT MODEL ====================
export interface Document {
  id: string;
  teacher_id: string;
  name: string;
  original_name: string;
  type: DocumentType;
  file_url: string;
  file_size: number; // in bytes
  mime_type: string;
  folder_id: string | null;
  is_public: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
}

// ==================== REQUEST TYPES ====================
export interface UploadDocumentRequest {
  file: File;
  name?: string;
  description?: string;
  folder_id?: string | null;
}

export interface UpdateDocumentRequest {
  name?: string;
  description?: string;
}

export interface MoveDocumentRequest {
  folder_id: string | null;
}

export interface ShareDocumentRequest {
  is_public: boolean;
}

// ==================== RESPONSE TYPES ====================
export interface DocumentResponse {
  success: boolean;
  data: Document;
}

export interface DocumentListResponse {
  success: boolean;
  data: Document[];
}

// ==================== QUERY PARAMS ====================
export interface DocumentQueryParams {
  folder_id?: string | null;
  type?: DocumentType;
  search?: string;
}

// ==================== HELPER FUNCTIONS ====================
export const getDocumentTypeFromMimeType = (mimeType: string): DocumentType => {
  if (mimeType === "application/pdf") return "pdf";
  if (
    mimeType === "application/msword" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return "docx";
  if (
    mimeType === "application/vnd.ms-excel" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  )
    return "xlsx";
  if (
    mimeType === "application/vnd.ms-powerpoint" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  )
    return "pptx";
  if (mimeType === "text/plain") return "txt";
  if (mimeType === "text/csv") return "csv";
  if (mimeType.startsWith("image/")) return "image";
  return "other";
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

// Allowed file types for upload
export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export const ALLOWED_FILE_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".txt",
  ".csv",
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
];

// Max file size: 50MB
export const MAX_FILE_SIZE = 50 * 1024 * 1024;
