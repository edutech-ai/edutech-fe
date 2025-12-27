"use client";

import { useState } from "react";
import { FolderCard } from "./FolderCard";
import { FileCard } from "./FileCard";

interface FileManagerProps {
  viewMode: "grid" | "list";
  currentPath: string[];
  onNavigate: (path: string[]) => void;
}

// Mock data
const mockFolders = [
  {
    id: "1",
    name: "Đề thi Toán",
    itemCount: 12,
    createdAt: "2025-01-15",
    color: "blue",
  },
  {
    id: "2",
    name: "Đề thi Văn",
    itemCount: 8,
    createdAt: "2025-01-10",
    color: "green",
  },
  {
    id: "3",
    name: "Giáo án Lớp 9",
    itemCount: 24,
    createdAt: "2025-01-05",
    color: "purple",
  },
  {
    id: "4",
    name: "Tài liệu tham khảo",
    itemCount: 15,
    createdAt: "2024-12-20",
    color: "yellow",
  },
];

const mockFiles = [
  {
    id: "1",
    name: "Đề kiểm tra học kì I - Toán 9.pdf",
    type: "pdf",
    size: "2.4 MB",
    createdAt: "2025-01-20",
  },
  {
    id: "2",
    name: "Đề thi thử THPT - Toán.docx",
    type: "docx",
    size: "1.8 MB",
    createdAt: "2025-01-18",
  },
  {
    id: "3",
    name: "Ma trận đề thi.xlsx",
    type: "xlsx",
    size: "856 KB",
    createdAt: "2025-01-15",
  },
  {
    id: "4",
    name: "Bài giảng hình học.pptx",
    type: "pptx",
    size: "5.2 MB",
    createdAt: "2025-01-12",
  },
];

export function FileManager({
  viewMode,
  currentPath,
  onNavigate,
}: FileManagerProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleFolderClick = (folderName: string) => {
    onNavigate([...currentPath, folderName]);
  };

  const toggleSelection = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  if (viewMode === "grid") {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Folders */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Thư mục</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
            {mockFolders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                isSelected={selectedItems.includes(folder.id)}
                onClick={() => handleFolderClick(folder.name)}
                onSelect={() => toggleSelection(folder.id)}
              />
            ))}
          </div>
        </div>

        {/* Files */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Tệp tin</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {mockFiles.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                isSelected={selectedItems.includes(file.id)}
                onClick={() => {}}
                onSelect={() => toggleSelection(file.id)}
              />
            ))}
          </div>
        </div>

        {/* Empty State */}
        {mockFolders.length === 0 && mockFiles.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-2">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Thư mục trống
            </h3>
            <p className="text-gray-500">
              Tạo thư mục mới hoặc tải tệp lên để bắt đầu
            </p>
          </div>
        )}
      </div>
    );
  }

  // List view
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <table className="w-full">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
              Tên
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
              Kích thước
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
              Ngày tạo
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
              Loại
            </th>
          </tr>
        </thead>
        <tbody>
          {mockFolders.map((folder) => (
            <tr
              key={folder.id}
              className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
            >
              <td
                className="py-3 px-4 flex items-center gap-3"
                onClick={() => handleFolderClick(folder.name)}
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                </div>
                <span className="font-medium text-gray-900">{folder.name}</span>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {folder.itemCount} mục
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {folder.createdAt}
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">Thư mục</td>
            </tr>
          ))}
          {mockFiles.map((file) => (
            <tr
              key={file.id}
              className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
            >
              <td className="py-3 px-4 flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="text-gray-900">{file.name}</span>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">{file.size}</td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {file.createdAt}
              </td>
              <td className="py-3 px-4 text-sm text-gray-600 uppercase">
                {file.type}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
