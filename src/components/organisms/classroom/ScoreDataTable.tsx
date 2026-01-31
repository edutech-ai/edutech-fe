"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScoreBadge } from "@/components/atoms/ScoreBadge";
import { ExamTypeBadge } from "@/components/atoms/ExamTypeBadge";
import { StudentInitials } from "@/components/atoms/StudentInitials";
import type { ScoreBackend, ExamType } from "@/types/classroom";
import {
  Search,
  ChevronUp,
  ChevronDown,
  Plus,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Calendar,
} from "lucide-react";

export interface ScoreDataTableProps {
  scores: ScoreBackend[];
  isLoading?: boolean;
  onAddScore?: () => void;
  onEditScore?: (score: ScoreBackend) => void;
  onDeleteScore?: (score: ScoreBackend) => void;
  onScoreClick?: (score: ScoreBackend) => void;
  className?: string;
}

type SortField = "student_name" | "score" | "exam_date" | "exam_type";
type SortDirection = "asc" | "desc";

const ITEMS_PER_PAGE = 10;

const EXAM_TYPE_OPTIONS: { value: ExamType | "all"; label: string }[] = [
  { value: "all", label: "Tất cả loại" },
  { value: "quiz", label: "Quiz" },
  { value: "test", label: "Kiểm tra" },
  { value: "midterm", label: "Giữa kỳ" },
  { value: "final", label: "Cuối kỳ" },
  { value: "assignment", label: "Bài tập" },
  { value: "other", label: "Khác" },
];

const SortIcon = ({
  field,
  sortField,
  sortDirection,
}: {
  field: SortField;
  sortField: SortField;
  sortDirection: SortDirection;
}) => {
  if (sortField !== field) return null;
  return sortDirection === "asc" ? (
    <ChevronUp className="h-4 w-4" />
  ) : (
    <ChevronDown className="h-4 w-4" />
  );
};

export function ScoreDataTable({
  scores,
  isLoading,
  onAddScore,
  onEditScore,
  onDeleteScore,
  onScoreClick,
  className,
}: ScoreDataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [examTypeFilter, setExamTypeFilter] = useState<ExamType | "all">("all");
  const [sortField, setSortField] = useState<SortField>("exam_date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const filteredAndSortedScores = useMemo(() => {
    let result = [...scores];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (s) =>
          s.student?.full_name?.toLowerCase().includes(term) ||
          s.exam_name?.toLowerCase().includes(term) ||
          s.subject?.toLowerCase().includes(term)
      );
    }

    // Filter by exam type
    if (examTypeFilter !== "all") {
      result = result.filter((s) => s.exam_type === examTypeFilter);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "student_name":
          comparison = (a?.full_name || "").localeCompare(
            b?.full_name || "",
            "vi"
          );
          break;
        case "score":
          comparison = a.score - b.score;
          break;
        case "exam_date":
          comparison =
            new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime();
          break;
        case "exam_type":
          comparison = a.exam_type.localeCompare(b.exam_type);
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [scores, searchTerm, examTypeFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedScores.length / ITEMS_PER_PAGE);
  const paginatedScores = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedScores.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredAndSortedScores, currentPage]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Card className={cn("bg-white", className)}>
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Loại bài
              </label>
              <Select
                value={examTypeFilter}
                onValueChange={(v) => {
                  setExamTypeFilter(v as ExamType | "all");
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-35">
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  {EXAM_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Tìm kiếm
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Tìm theo tên, bài kiểm tra..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-70 pl-10"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-500">
              Hiển thị {paginatedScores.length} /{" "}
              {filteredAndSortedScores.length} điểm
            </p>
            {onAddScore && (
              <Button onClick={onAddScore} size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Thêm điểm
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("student_name")}
                >
                  <div className="flex items-center gap-1">
                    Học sinh
                    <SortIcon
                      field="student_name"
                      sortField={sortField}
                      sortDirection={sortDirection}
                    />
                  </div>
                </TableHead>
                <TableHead>Bài kiểm tra</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("exam_type")}
                >
                  <div className="flex items-center gap-1">
                    Loại
                    <SortIcon
                      field="exam_type"
                      sortField={sortField}
                      sortDirection={sortDirection}
                    />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer text-center hover:bg-gray-100"
                  onClick={() => handleSort("score")}
                >
                  <div className="flex items-center justify-center gap-1">
                    Điểm
                    <SortIcon
                      field="score"
                      sortField={sortField}
                      sortDirection={sortDirection}
                    />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("exam_date")}
                >
                  <div className="flex items-center gap-1">
                    Ngày
                    <SortIcon
                      field="exam_date"
                      sortField={sortField}
                      sortDirection={sortDirection}
                    />
                  </div>
                </TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-gray-400"
                  >
                    Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              ) : paginatedScores.length > 0 ? (
                paginatedScores.map((score) => (
                  <TableRow
                    key={score.id}
                    className={cn(
                      "hover:bg-blue-50",
                      onScoreClick && "cursor-pointer"
                    )}
                    onClick={() => onScoreClick?.(score)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <StudentInitials
                          name={score?.full_name || "?"}
                          size="sm"
                        />
                        <div>
                          <span className="font-medium text-gray-800">
                            {score?.full_name || "Không rõ"}
                          </span>
                          {score?.student_code && (
                            <p className="text-xs text-gray-500">
                              {score?.student_code}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="text-gray-800">
                          {score.exam_name || "-"}
                        </span>
                        {score.subject && (
                          <p className="text-xs text-gray-500">
                            {score.subject}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <ExamTypeBadge type={score.exam_type} />
                    </TableCell>
                    <TableCell className="text-center">
                      <ScoreBadge
                        score={score.score}
                        maxScore={score.max_score}
                        showMax
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Calendar className="h-3 w-3" />
                        <span className="text-sm">
                          {formatDate(score.exam_date)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {onEditScore && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditScore(score);
                            }}
                          >
                            <Pencil className="h-4 w-4 text-gray-500" />
                          </Button>
                        )}
                        {onDeleteScore && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteScore(score);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-gray-400"
                  >
                    Chưa có điểm nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Pagination */}
      {totalPages > 1 && (
        <CardFooter className="flex items-center justify-between border-t px-6 py-4">
          <p className="text-sm text-gray-500">
            Trang {currentPage} / {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Trước
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Sau
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
