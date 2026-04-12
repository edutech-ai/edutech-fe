"use client";

import Image from "next/image";

export function MobileSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-linear-to-br from-slate-900 via-blue-950 to-slate-900">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-125 h-125 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
      </div>

      <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-[0.04] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-8 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-blue-200 text-sm font-medium backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
              </span>
              Ứng dụng di động
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-[1.15]">
                Dạy học thông minh
                <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-300 to-cyan-300">
                  mọi lúc, mọi nơi.
                </span>
              </h2>
              <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                Tải EduTech AI — tạo đề thi, quản lý lớp học ngay trên điện
                thoại.
              </p>
            </div>

            {/* Google Play download button — styled as store badge */}
            <a
              href="https://drive.google.com/file/d/1Qi8hC6RxcxOyXvyP5Drltl1crqB0zp0t/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 bg-primary text-white px-6 py-2 rounded-2xl font-medium shadow-xl hover:shadow-2xl hover:bg-primary/90 hover:-translate-y-1 transition-all duration-200 active:scale-95 w-fit"
            >
              <Image
                src="/images/google-play-download-icon.png"
                alt="Google Play"
                width={32}
                height={32}
                className="shrink-0"
              />
              <div className="flex flex-col leading-tight">
                <span className="text-xs text-white font-normal">Có trên</span>
                <span className="text-base font-bold tracking-tight">
                  CH Play
                </span>
              </div>
            </a>
          </div>

          {/* Right — Phone mockup */}
          <div className="relative flex items-center justify-center lg:justify-end -my-12">
            {/* Glow behind phone */}
            <div className="absolute w-96 h-96 bg-primary/30 rounded-full blur-3xl" />

            {/* Floating ring decoration */}
            <div className="absolute w-120 h-120 rounded-full border border-white/10" />
            <div className="absolute w-140 h-140 rounded-full border border-white/5" />

            <div className="relative z-10 drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
              <Image
                src="/images/phone.svg"
                alt="EduTech AI trên di động"
                width={720}
                height={1320}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
