"use client";

import { Crown, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface UpgradeBannerProps {
  onUpgradeClick: () => void;
}

export function UpgradeBanner({ onUpgradeClick }: UpgradeBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-primary rounded-lg p-6 mb-6">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-1 right-2 text-red-400 hover:text-red-500 hover:bg-red-400/30 p-2 rounded-sm transition"
        aria-label="Đóng"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg mb-1">
            Nâng cấp tài khoản để mở khóa đầy đủ tính năng
          </h3>
          <p className="text-white/90 text-sm mb-4">
            Truy cập không giới hạn AI tạo đề thi, giáo án và nhiều tính năng
            khác
          </p>
          <button
            onClick={onUpgradeClick}
            className="flex items-center gap-3 bg-white text-blue-600 px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition shrink-0"
          >
            <Crown className="w-6 h-6 text-yellow-300" />
            <span>Mua ngay</span>
          </button>
        </div>
        <Image
          src="/images/banner/working-img.svg"
          width={130}
          height={100}
          alt="working illustration"
          className="hidden md:block"
        />
      </div>
    </div>
  );
}
