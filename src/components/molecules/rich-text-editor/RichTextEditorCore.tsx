"use client";

import { useRef, useState, useMemo, useCallback } from "react";
import ReactQuill from "react-quill-new";
import katex from "katex";
import { FormulaModal } from "./FormulaModal";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Register KaTeX for formula rendering
if (typeof window !== "undefined") {
  (window as unknown as { katex: typeof katex }).katex = katex;
}

interface RichTextEditorCoreProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  variant?: "default" | "minimal";
  className?: string;
  id?: string;
}

// Custom toolbar modules
const TOOLBAR_DEFAULT = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ align: [] }],
  ["link", "image", "formula"],
  ["clean"],
];

const TOOLBAR_MINIMAL = [
  ["bold", "italic", "underline"],
  [{ script: "sub" }, { script: "super" }],
  ["formula"],
  ["clean"],
];

export function RichTextEditorCore({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  variant = "default",
  className,
  id,
}: RichTextEditorCoreProps) {
  const quillRef = useRef<ReactQuill>(null);
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  // Image upload handler
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ảnh không được vượt quá 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file ảnh");
        return;
      }

      try {
        toast.loading("Đang tải ảnh lên...", { id: "image-upload" });

        const result = await uploadToCloudinary(file);
        const quill = quillRef.current?.getEditor();

        if (quill) {
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, "image", result.secure_url);
          quill.setSelection(range.index + 1);
        }

        toast.success("Đã tải ảnh lên", { id: "image-upload" });
      } catch (error) {
        console.error("Image upload error:", error);
        toast.error("Không thể tải ảnh lên. Vui lòng thử lại.", {
          id: "image-upload",
        });
      }
    };
  }, []);

  // Formula handler
  const formulaHandler = useCallback(() => {
    setShowFormulaModal(true);
  }, []);

  // Insert formula into editor
  const handleInsertFormula = useCallback((formula: string) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection(true);
      quill.insertEmbed(range.index, "formula", formula);
      quill.setSelection(range.index + 1);
    }
  }, []);

  // Quill modules configuration
  const modules = useMemo(
    () => ({
      toolbar: {
        container: variant === "minimal" ? TOOLBAR_MINIMAL : TOOLBAR_DEFAULT,
        handlers: {
          image: imageHandler,
          formula: formulaHandler,
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    [variant, imageHandler, formulaHandler]
  );

  // Quill formats
  const formats = useMemo(
    () => [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "color",
      "background",
      "script",
      "list",
      "align",
      "link",
      "image",
      "formula",
    ],
    []
  );

  const handleChange = useCallback(
    (newValue: string, _delta: unknown, source: string) => {
      if (source === "user") {
        onChange(newValue);
      }
    },
    [onChange]
  );

  return (
    <div className={cn(variant === "minimal" && "quill-minimal", className)}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        id={id}
      />

      <FormulaModal
        open={showFormulaModal}
        onOpenChange={setShowFormulaModal}
        onInsert={handleInsertFormula}
      />
    </div>
  );
}

export default RichTextEditorCore;
