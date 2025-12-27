import Image from "next/image";

interface AILoadingProps {
  message?: string;
  submessage?: string;
  size?: number;
}

export function AILoading({
  message = "AI đang tạo câu hỏi cho bạn...",
  submessage = "Quá trình này có thể mất vài giây",
  size = 120,
}: AILoadingProps) {
  return (
    <div className="text-center py-12">
      <div className="relative inline-block mb-4">
        <Image
          src="/loading/ai_loading.gif"
          alt="AI Loading"
          width={size}
          height={size}
          unoptimized
          className="rounded-lg"
        />
      </div>
      <p className="text-gray-900 font-medium text-lg">{message}</p>
      {submessage && <p className="text-sm text-gray-500 mt-2">{submessage}</p>}
    </div>
  );
}
