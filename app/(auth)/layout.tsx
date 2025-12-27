import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen relative">
      {/* Background cho desktop */}
      <div className="hidden lg:block w-full">
        <div className="absolute z-0 top-8 left-8 h-[calc(100vh-4rem)] w-[calc(100vw-4rem)] rounded-3xl overflow-hidden">
          <Image
            src="/images/background/bg-auth2.jpg"
            alt="Authentication background"
            fill
            priority
            className="object-cover object-bottom-right"
          />
        </div>
      </div>

      {/* Logo button - absolute positioned, high z-index */}
      <Link
        href="/"
        className="hidden lg:block absolute bottom-8 right-8 bg-white rounded-tl-3xl px-12 pt-8 pb-8 z-50 cursor-pointer"
      >
        <div className="flex gap-4 items-center">
          <div className="relative w-20 h-20">
            <Image
              src="/images/logo/logo.svg"
              alt="EduTech Logo"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900">EduTech</h3>
            <h3 className="text-lg text-gray-600">©Copyright EduTech 2025</h3>
          </div>
        </div>
      </Link>

      {/* Main Content */}
      <div className="absolute h-full flex items-center justify-center lg:justify-start lg:pl-16 gap-28 w-full z-10">
        {/* Form Container - Always on LEFT */}
        <div className="min-h-fit flex items-center justify-center z-10 lg:order-1">
          <div className="bg-white px-6 py-10 rounded-md shadow-lg relative">
            {children}
          </div>
        </div>

        {/* Right Side Text - Desktop only */}
        <div className="hidden lg:flex text-white lg:order-2">
          <div className="flex flex-col justify-center items-center gap-3 -translate-x-12 -translate-y-16">
            <div className="relative w-20 h-20">
              <Image
                src="/images/logo/logo.svg"
                alt="EduTech Logo"
                fill
                className="object-contain"
              />
            </div>
            <div className="w-px h-72 bg-white opacity-40"></div>
          </div>
          <div className="flex flex-col justify-center items-start gap-7">
            <h1 className="text-6xl leading-tight font-bold">
              Chào mừng đến <br />
              EduTech.
            </h1>
            <p className="w-96 text-justify -translate-x-12 text-sm leading-6 opacity-90">
              Hãy bắt đầu bằng việc đăng nhập vào tài khoản, sau đó bạn có thể
              sử dụng các công cụ AI để tạo đề thi, giáo án và học liệu một cách
              nhanh chóng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
