"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const faqs = [
  {
    question: "EduTech AI có miễn phí không?",
    answer:
      "Có, chúng tôi cung cấp gói Free vĩnh viễn với các tính năng cơ bản giúp giáo viên quản lý lớp học, tạo sơ đồ chỗ ngồi và random học sinh công bằng. Bạn có thể bắt đầu ngay mà không cần thẻ tín dụng.",
  },
  {
    question: "Tôi có thể nâng cấp hoặc hạ cấp gói không?",
    answer:
      "Hoàn toàn được. Bạn có thể chuyển đổi giữa các gói Basic và Pro bất cứ lúc nào ngay trong phần cài đặt tài khoản. Việc nâng cấp sẽ có hiệu lực ngay lập tức, và nếu hạ cấp, gói mới sẽ áp dụng từ chu kỳ thanh toán tiếp theo.",
  },
  {
    question: "Phương thức thanh toán nào được chấp nhận?",
    answer:
      "Chúng tôi hỗ trợ thanh toán qua chuyển khoản ngân hàng nội địa với mã QR tiện lợi. Hệ thống sẽ tự động xác nhận thanh toán trong vòng 1-5 phút sau khi chuyển khoản thành công.",
  },
  {
    question: "Gói Business cho trường học hỗ trợ những gì?",
    answer:
      "Gói Business được thiết kế riêng cho quy mô trường học với các tính năng quản lý tập trung, dashboard tổng hợp dữ liệu toàn trường, phân quyền chi tiết cho từng giáo viên và được hỗ trợ triển khai (onboarding) trực tiếp 1-1.",
  },
  {
    question: "Dữ liệu học sinh có được bảo mật không?",
    answer:
      "Chúng tôi coi trọng quyền riêng tư và bảo mật dữ liệu. Mọi thông tin đều được mã hóa SSL và lưu trữ an toàn trên máy chủ tại Việt Nam, tuân thủ các quy định về bảo vệ dữ liệu giáo dục.",
  },
  {
    question: "Tôi có thể hủy gói đăng ký không?",
    answer:
      "Có, bạn có thể hủy gói đăng ký bất cứ lúc nào. Sau khi hủy, bạn vẫn tiếp tục sử dụng các tính năng trả phí cho đến hết chu kỳ thanh toán hiện tại, sau đó tài khoản sẽ tự động chuyển về gói Free.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-lime-200/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left - Title */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Câu hỏi
              <br />
              thường gặp
            </h2>

            {/* image */}
            <div className="mt-8">
              <Image
                width={200}
                height={200}
                src="/images/sticker/sticker_faq.svg"
                alt="FAQ Illustration"
                className="w-48 h-48 md:w-64 md:h-64 hidden md:block"
              />
            </div>
          </div>

          {/* Right - FAQ Items */}
          <div className="lg:col-span-3">
            <div className="divide-y divide-gray-200">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div key={index} className="py-5 first:pt-0">
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full flex items-start justify-between text-left cursor-pointer group"
                    >
                      <span
                        className={cn(
                          "md:text-lg text-base font-medium pr-4 transition-colors duration-200",
                          isOpen
                            ? "text-primary"
                            : "text-gray-700 group-hover:text-gray-900"
                        )}
                      >
                        {faq.question}
                      </span>
                      <ChevronUp
                        className={cn(
                          "w-5 h-5 shrink-0 text-gray-400 transition-transform duration-200",
                          !isOpen && "rotate-180"
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-200",
                        isOpen
                          ? "max-h-96 opacity-100 mt-3"
                          : "max-h-0 opacity-0"
                      )}
                    >
                      <p className="text-gray-600 leading-relaxed pr-8">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
