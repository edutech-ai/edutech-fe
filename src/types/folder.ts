// ==================== FOLDER TYPES ====================

// Backend supported colors (6 colors)
export type FolderColorBackend =
  | "blue"
  | "green"
  | "yellow"
  | "orange"
  | "purple"
  | "red";

// ==================== FOLDER MODEL ====================
export interface Folder {
  id: string;
  teacher_id: string;
  name: string;
  color: FolderColorBackend;
  parent_id: string | null;
  depth: number; // 0-3, max 3 levels nested
  item_count: number;
  created_at: string;
  updated_at: string;
}

export interface FolderPath {
  id: string;
  name: string;
}

// ==================== REQUEST TYPES ====================
export interface CreateFolderRequest {
  name: string;
  color?: FolderColorBackend;
  parent_id?: string | null;
}

export interface UpdateFolderRequest {
  name?: string;
  color?: FolderColorBackend;
}

export interface MoveFolderRequest {
  new_parent_id: string | null;
}

// ==================== RESPONSE TYPES ====================
export interface FolderListResponse {
  success: boolean;
  data: Folder[];
}

export interface FolderResponse {
  success: boolean;
  data: Folder;
}

export interface FolderPathResponse {
  success: boolean;
  data: FolderPath[];
}

export interface FolderItemsResponse {
  success: boolean;
  data: {
    folders: Folder[];
    // documents: Document[]; // TODO: Add when documents API is ready
  };
}

// ==================== QUERY PARAMS ====================
export interface FolderQueryParams {
  parent_id?: string | null;
}
