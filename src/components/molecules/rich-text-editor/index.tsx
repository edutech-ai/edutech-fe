"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamic import to avoid SSR issues with Quill
const RichTextEditorCore = dynamic(
  () => import("./RichTextEditorCore").then((mod) => mod.RichTextEditorCore),
  {
    ssr: false,
    loading: () => <EditorSkeleton />,
  }
);

function EditorSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-10 w-full rounded-t-lg" />
      <Skeleton className="h-24 w-full rounded-b-lg" />
    </div>
  );
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  variant?: "default" | "minimal";
  className?: string;
  id?: string;
}

export function RichTextEditor(props: RichTextEditorProps) {
  return <RichTextEditorCore {...props} />;
}

export default RichTextEditor;

// Re-export components
export { FormulaModal } from "./FormulaModal";
