"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { toast } from "sonner";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteFriendModal({ isOpen, onClose }: PricingModalProps) {
  const appUrl =
    process.env.NEXT_PUBLIC_HOST_URL || "http://go-edutech.vercel.app";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl flex flex-col md:flex-row items-start md:items-center gap-2">
        <div>
          <DialogHeader>
            <DialogTitle className="text-3xl">
              Mời bạn bè tham gia{" "}
              <strong className="text-primary">Edutech</strong>
            </DialogTitle>
            <DialogDescription>
              Chia sẻ Edutech với bạn bè, thầy cô và đồng nghiệp khác!
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div className="mt-4">
              <div className="flex items-start md:items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${appUrl}/register`}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${appUrl}/invite`);
                    toast.success("Đã sao chép liên kết!");
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Sao chép
                </button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Image
            src="/images/banner/invite-friend.svg"
            width={400}
            height={800}
            alt="Invite Friends Illustration"
            className="mt-6 mx-auto"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
