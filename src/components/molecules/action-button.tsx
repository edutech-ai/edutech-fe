import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

interface ActionButtonProps {
  href?: string;
  label?: string;
  isBack?: boolean;
}

export function ActionButton({
  href,
  label,
  isBack = false,
}: ActionButtonProps) {
  return (
    <>
      <Link href={href || "/dashboard/quiz"}>
        <Button
          variant="ghost"
          className="gap-2 text-primary-text font-bold hover:text-primary-text/80 pr-2 pl-0"
        >
          <Image
            src={isBack ? "/images/util/back2.svg" : "/images/util/home.svg"}
            alt={isBack ? "Back Icon" : "Home Icon"}
            width={20}
            height={20}
          />
          {label || (isBack ? "Quay lại" : "Về trang chủ")}
        </Button>
      </Link>
    </>
  );
}
