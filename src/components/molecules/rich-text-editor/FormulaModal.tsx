/* eslint-disable react-hooks/set-state-in-render */
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import katex from "katex";

interface FormulaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (formula: string) => void;
  initialValue?: string;
}

const FORMULA_TEMPLATES = [
  { label: "Phân số", value: "\\frac{a}{b}" },
  { label: "Căn bậc hai", value: "\\sqrt{x}" },
  { label: "Căn bậc n", value: "\\sqrt[n]{x}" },
  { label: "Lũy thừa", value: "x^{2}" },
  { label: "Chỉ số dưới", value: "x_{i}" },
  { label: "Tổng", value: "\\sum_{i=1}^{n}" },
  { label: "Tích phân", value: "\\int_{a}^{b}" },
  { label: "Giới hạn", value: "\\lim_{x \\to \\infty}" },
  { label: "Vô cực", value: "\\infty" },
  { label: "Pi", value: "\\pi" },
  { label: "Alpha", value: "\\alpha" },
  { label: "Beta", value: "\\beta" },
  { label: "Theta", value: "\\theta" },
  { label: "Delta", value: "\\Delta" },
  { label: "Bằng", value: "=" },
  { label: "Không bằng", value: "\\neq" },
  { label: "Nhỏ hơn hoặc bằng", value: "\\leq" },
  { label: "Lớn hơn hoặc bằng", value: "\\geq" },
  { label: "Xấp xỉ", value: "\\approx" },
  { label: "Thuộc", value: "\\in" },
  { label: "Phép nhân", value: "\\times" },
  { label: "Phép chia", value: "\\div" },
  { label: "Cộng trừ", value: "\\pm" },
];

export function FormulaModal({
  open,
  onOpenChange,
  onInsert,
  initialValue = "",
}: FormulaModalProps) {
  const [formula, setFormula] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setFormula(initialValue);
      setError(null);
    }
  }, [open, initialValue]);

  const preview = useMemo(() => {
    if (!formula.trim()) {
      return '<span class="text-gray-400">Nhập công thức để xem trước</span>';
    }

    try {
      const rendered = katex.renderToString(formula, {
        throwOnError: true,
        displayMode: true,
        output: "html",
      });
      setError(null);
      return rendered;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Công thức không hợp lệ";
      setError(errorMessage);
      return `<span class="text-red-500">Lỗi: ${errorMessage}</span>`;
    }
  }, [formula]);

  const handleInsert = () => {
    if (formula.trim() && !error) {
      onInsert(formula.trim());
      onOpenChange(false);
    }
  };

  const handleInsertTemplate = (template: string) => {
    setFormula((prev) => prev + template);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chèn công thức toán học</DialogTitle>
          <DialogDescription>
            Nhập công thức LaTeX. Sử dụng các mẫu bên dưới hoặc tự viết.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Quick Templates */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Mẫu nhanh</Label>
            <div className="flex flex-wrap gap-1.5">
              {FORMULA_TEMPLATES.map((template) => (
                <Button
                  key={template.value}
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => handleInsertTemplate(template.value)}
                >
                  {template.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Formula Input */}
          <div className="space-y-2">
            <Label htmlFor="formula">Công thức LaTeX</Label>
            <Textarea
              id="formula"
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              placeholder="Ví dụ: \frac{a+b}{c-d} hoặc x^2 + y^2 = z^2"
              rows={3}
              className="font-mono text-sm"
            />
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Xem trước</Label>
            <div
              className="formula-preview"
              dangerouslySetInnerHTML={{ __html: preview }}
            />
          </div>

          {/* Common Examples */}
          <div className="text-xs text-gray-500 space-y-1">
            <p className="font-medium">Ví dụ:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>
                Phân số:{" "}
                <code className="bg-gray-100 px-1">\frac{"{a}{b}"}</code>
              </li>
              <li>
                Căn thức: <code className="bg-gray-100 px-1">\sqrt{"{x}"}</code>
              </li>
              <li>
                Lũy thừa: <code className="bg-gray-100 px-1">x^{"{2}"}</code>
              </li>
              <li>
                Tổng:{" "}
                <code className="bg-gray-100 px-1">\sum_i=1^{"{n}"} i</code>
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleInsert} disabled={!formula.trim() || !!error}>
            Chèn công thức
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default FormulaModal;
