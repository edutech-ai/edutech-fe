import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen relative">
      <div className="hidden lg:block w-full">
        <div className="absolute z-0 top-6 left-8 h-[calc(100vh-3rem)] w-[calc(100vw-4rem)] rounded-3xl overflow-hidden">
          <Image
            src="/images/background/bg-auth2.png"
            alt="Authentication background"
            fill
            priority
            className="object-cover object-left"
          />
        </div>
      </div>

      <div className="lg:hidden w-full h-full absolute z-0">
        <Image
          src="/images/background/bg-auth-mb2.png"
          alt="Authentication background"
          fill
          priority
          className="object-cover"
        />
      </div>

      <Link
        href="/"
        className="hidden lg:block absolute rounded-tl-3xl px-12 pt-8 pb-8 z-50 cursor-pointer"
      >
        <div className="flex items-center">
          <div className="relative w-24 h-24">
            <Image
              src="/images/logo/logo.svg"
              alt="EduTech Logo"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h3 className="text-4xl font-bold text-primary-logo">EduTech</h3>
          </div>
        </div>
      </Link>

      <div className="absolute h-full flex items-center justify-center lg:justify-between lg:pl-16 lg:pr-16 w-full z-10">
        <div className="hidden lg:flex text-white lg:order-1 lg:ml-12">
          <div className="flex flex-col justify-center items-center gap-3 -translate-x-12 -translate-y-16">
            <div className="relative w-20 h-20">
              <Image
                src="/images/logo/logo.svg"
                alt="EduTech Logo"
                fill
                className="object-contain"
              />
            </div>
            <div className="w-px h-72 bg-white opacity-40" />
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

        <div className="min-h-fit flex items-center justify-center z-10 lg:order-2 px-4 sm:px-6 lg:px-8 w-full max-w-lg min-w-md">
          <div className="bg-white px-6 py-10 rounded-md shadow-lg relative">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
