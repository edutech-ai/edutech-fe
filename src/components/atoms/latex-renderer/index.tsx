"use client";

import { useMemo } from "react";
import { sanitizeAndRenderLatex } from "@/lib/html-sanitizer";
import { cn } from "@/lib/utils";

interface LaTeXRendererProps {
  content: string;
  className?: string;
  as?: "div" | "span" | "p";
}

export function LaTeXRenderer({
  content,
  className,
  as: Component = "div",
}: LaTeXRendererProps) {
  const renderedContent = useMemo(() => {
    if (!content) return "";

    return sanitizeAndRenderLatex(content);
  }, [content]);

  if (!content) {
    return null;
  }

  const isHtml = /<[^>]+>/.test(renderedContent);

  if (isHtml) {
    return (
      <Component
        className={cn("rich-text-content latex-content", className)}
        dangerouslySetInnerHTML={{ __html: renderedContent }}
      />
    );
  }

  return <Component className={className}>{content}</Component>;
}

export default LaTeXRenderer;
