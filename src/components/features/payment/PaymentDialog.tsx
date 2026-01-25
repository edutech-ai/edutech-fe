"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Copy, Check, RefreshCw, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  useCreatePayment,
  useCheckPayment,
  formatPrice,
  type SubscriptionPlan,
  type PaymentCreateResponse,
} from "@/services/paymentService";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: SubscriptionPlan | null;
  onSuccess?: () => void;
}

export function PaymentDialog({
  open,
  onOpenChange,
  plan,
  onSuccess,
}: PaymentDialogProps) {
  const [paymentData, setPaymentData] = useState<PaymentCreateResponse | null>(
    null
  );
  const [copied, setCopied] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const [isPolling, setIsPolling] = useState(false);

  const createPaymentMutation = useCreatePayment();

  // Check payment status with polling
  const { data: checkData, refetch: refetchCheck } = useCheckPayment(
    paymentData?.orderCode || "",
    isPolling
  );

  // Create payment when dialog opens with a plan
  useEffect(() => {
    if (open && plan && !paymentData) {
      createPaymentMutation.mutate(
        { planCode: plan.code },
        {
          onSuccess: (response) => {
            setPaymentData(response.data);
            setIsPolling(true);
            // Calculate countdown from expiresAt
            const expiresAt = new Date(response.data.expiresAt).getTime();
            const now = Date.now();
            setCountdown(Math.max(0, Math.floor((expiresAt - now) / 1000)));
          },
          onError: (error) => {
            const message =
              error.response?.data?.message || "Không thể tạo thanh toán";
            toast.error(message);
            onOpenChange(false);
          },
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, plan]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsPolling(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Handle payment success
  useEffect(() => {
    if (checkData?.paid) {
      setIsPolling(false);
      toast.success("Thanh toán thành công!");
      onSuccess?.();
      // Close after 2 seconds
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkData?.paid]);

  const handleClose = () => {
    setPaymentData(null);
    setIsPolling(false);
    setCopied(null);
    setCountdown(0);
    onOpenChange(false);
  };

  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(field);
    toast.success("Đã sao chép!");
    setTimeout(() => setCopied(null), 2000);
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Payment success state
  if (checkData?.paid) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Thanh toán thành công!
            </h2>
            <p className="text-gray-600 text-center">
              Gói {plan?.name} đã được kích hoạt cho tài khoản của bạn.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Thanh toán gói {plan?.name}</DialogTitle>
          <DialogDescription>
            Quét mã QR hoặc chuyển khoản theo thông tin bên dưới
          </DialogDescription>
        </DialogHeader>

        {createPaymentMutation.isPending ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Đang tạo thanh toán...</span>
          </div>
        ) : paymentData ? (
          <div className="space-y-6">
            {/* Countdown */}
            {countdown > 0 && (
              <div className="text-center">
                <p className="text-sm text-gray-500">Thời gian còn lại</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCountdown(countdown)}
                </p>
              </div>
            )}

            {/* QR Code */}
            {paymentData.bankInfo.qrCode && (
              <div className="flex justify-center">
                <div className="rounded-lg border p-4 bg-white">
                  <Image
                    src={paymentData.bankInfo.qrCode}
                    alt="QR Code thanh toán"
                    width={200}
                    height={200}
                    className="mx-auto"
                  />
                </div>
              </div>
            )}

            {/* Bank Info */}
            <div className="space-y-3 rounded-lg bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Ngân hàng</span>
                <span className="font-medium">
                  {paymentData.bankInfo.bankName}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Số tài khoản</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium">
                    {paymentData.bankInfo.accountNumber}
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(paymentData.bankInfo.accountNumber, "account")
                    }
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    {copied === "account" ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Chủ tài khoản</span>
                <span className="font-medium">
                  {paymentData.bankInfo.accountName}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Số tiền</span>
                <span className="font-bold text-lg text-blue-600">
                  {formatPrice(paymentData.amount)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Nội dung CK</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-medium text-orange-600">
                    {paymentData.bankInfo.transferContent}
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(
                        paymentData.bankInfo.transferContent,
                        "content"
                      )
                    }
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    {copied === "content" ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Note */}
            {paymentData.note && (
              <p className="text-sm text-gray-500 text-center">
                {paymentData.note}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => refetchCheck()}
                disabled={!isPolling}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Kiểm tra thanh toán
              </Button>
              <Button variant="ghost" onClick={handleClose}>
                Hủy
              </Button>
            </div>

            {/* Polling indicator */}
            {isPolling && (
              <p className="text-xs text-center text-gray-400">
                Đang tự động kiểm tra thanh toán...
              </p>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
