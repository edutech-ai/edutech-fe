"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Loader2,
  Copy,
  Check,
  RefreshCw,
  ArrowLeft,
  Clock,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useCreatePayment,
  useCheckPayment,
  usePlanByCode,
  formatPrice,
  type PaymentCreateResponse,
} from "@/services/paymentService";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planCode = searchParams.get("planCode") || "";

  const [paymentData, setPaymentData] = useState<PaymentCreateResponse | null>(
    null
  );
  const [copied, setCopied] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const [isPolling, setIsPolling] = useState(false);

  // Get plan details
  const { data: planResponse, isLoading: isLoadingPlan } =
    usePlanByCode(planCode);
  const plan = planResponse?.data;

  // Create payment mutation
  const createPaymentMutation = useCreatePayment();

  // Check payment status with polling
  const { data: checkData } = useCheckPayment(
    paymentData?.orderCode || "",
    isPolling
  );

  // Create payment when plan is loaded — guarded by ref to prevent re-fire on StrictMode double-mount
  const hasFiredRef = useRef(false);

  useEffect(() => {
    if (
      !plan ||
      paymentData ||
      createPaymentMutation.isPending ||
      hasFiredRef.current
    )
      return;
    hasFiredRef.current = true;

    createPaymentMutation.mutate(
      { planCode: plan.code },
      {
        onSuccess: (response) => {
          setPaymentData(response.data);
          setIsPolling(true);
          const expiresAt = new Date(response.data.expiresAt).getTime();
          const now = Date.now();
          setCountdown(Math.max(0, Math.floor((expiresAt - now) / 1000)));
        },
        onError: (error) => {
          hasFiredRef.current = false; // allow retry on error
          const message =
            error.response?.data?.message || "Không thể tạo thanh toán";
          toast.error(message);
          router.push("/pricing");
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan]);

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

  // Handle payment success - redirect to result page
  useEffect(() => {
    if (checkData?.paid && paymentData) {
      setIsPolling(false);
      router.push(
        `/checkout/result?orderCode=${paymentData.orderCode}&status=SUCCESS`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkData?.paid, paymentData]);

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

  const handleCancel = () => {
    setIsPolling(false);
    router.push("/pricing");
  };

  // Loading state
  if (isLoadingPlan || createPaymentMutation.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Đang tạo đơn thanh toán...
          </h2>
          <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  // No plan found
  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Không tìm thấy gói dịch vụ
          </h2>
          <p className="text-gray-600 mb-4">
            Vui lòng chọn lại gói từ trang bảng giá
          </p>
          <Button onClick={() => router.push("/pricing")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại bảng giá
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={handleCancel} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
          <p className="text-gray-600 mt-2">
            Hoàn tất thanh toán để kích hoạt gói {plan.name}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Payment Info - Left Column */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              {paymentData ? (
                <div className="space-y-6">
                  {/* Countdown */}
                  {countdown > 0 && (
                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-orange-600" />
                        <span className="text-orange-800">
                          Thời gian còn lại
                        </span>
                      </div>
                      <span className="text-2xl font-bold text-orange-600">
                        {formatCountdown(countdown)}
                      </span>
                    </div>
                  )}

                  {countdown === 0 && (
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-center">
                      <p className="text-red-800 font-medium">
                        Đơn hàng đã hết hạn. Vui lòng tạo đơn mới.
                      </p>
                      <Button
                        variant="outline"
                        className="mt-3"
                        onClick={() => {
                          setPaymentData(null);
                          setCountdown(0);
                          setIsPolling(false);
                          createPaymentMutation.reset();
                          hasFiredRef.current = false;
                        }}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Tạo đơn mới
                      </Button>
                    </div>
                  )}

                  {/* QR Code */}
                  {paymentData.bankInfo.qrCode && countdown > 0 && (
                    <div className="flex flex-col items-center">
                      <p className="text-sm text-gray-600 mb-4">
                        Quét mã QR để thanh toán
                      </p>
                      <div className="rounded-xl border-2 border-gray-200 p-4 bg-white">
                        <Image
                          src={paymentData.bankInfo.qrCode}
                          alt="QR Code thanh toán"
                          width={240}
                          height={240}
                          className="mx-auto"
                        />
                      </div>
                    </div>
                  )}

                  {/* Bank Info */}
                  {countdown > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">
                        Hoặc chuyển khoản thủ công
                      </h3>

                      <div className="space-y-3 rounded-xl bg-gray-50 p-4">
                        <div className="flex items-center justify-between py-2 border-b border-gray-200">
                          <span className="text-gray-600">Ngân hàng</span>
                          <span className="font-medium">
                            {paymentData.bankInfo.bankName}
                          </span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-gray-200">
                          <span className="text-gray-600">Số tài khoản</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-medium">
                              {paymentData.bankInfo.accountNumber}
                            </span>
                            <button
                              onClick={() =>
                                handleCopy(
                                  paymentData.bankInfo.accountNumber,
                                  "account"
                                )
                              }
                              className="p-1.5 hover:bg-gray-200 rounded-lg transition"
                            >
                              {copied === "account" ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-gray-200">
                          <span className="text-gray-600">Chủ tài khoản</span>
                          <span className="font-medium">
                            {paymentData.bankInfo.accountName}
                          </span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-gray-200">
                          <span className="text-gray-600">Số tiền</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg text-blue-600">
                              {formatPrice(paymentData.amount)}
                            </span>
                            <button
                              onClick={() =>
                                handleCopy(
                                  paymentData.amount.toString(),
                                  "amount"
                                )
                              }
                              className="p-1.5 hover:bg-gray-200 rounded-lg transition"
                            >
                              {copied === "amount" ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between py-2">
                          <span className="text-gray-600">Nội dung CK</span>
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
                              className="p-1.5 hover:bg-gray-200 rounded-lg transition"
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

                      {paymentData.note && (
                        <p className="text-sm text-gray-500 text-center">
                          {paymentData.note}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Polling Status */}
                  {isPolling && countdown > 0 && (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Đang chờ xác nhận thanh toán...</span>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          {/* Order Summary - Right Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4">
                Thông tin đơn hàng
              </h3>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <h4 className="font-bold text-lg text-gray-900">
                    {plan.name}
                  </h4>
                  {plan.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {plan.description}
                    </p>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thời hạn</span>
                    <span className="font-medium">
                      {plan.durationDays} ngày
                    </span>
                  </div>
                  {plan.maxClasses && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số lớp học</span>
                      <span className="font-medium">{plan.maxClasses} lớp</span>
                    </div>
                  )}
                  {plan.maxQuizzesPerMonth && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Đề thi/tháng</span>
                      <span className="font-medium">
                        {plan.maxQuizzesPerMonth} đề
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 font-semibold">
                      Tổng cộng
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(plan.price)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 pt-2">
                  <Shield className="h-4 w-4" />
                  <span>Thanh toán an toàn & bảo mật</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Đang tải...
            </h2>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
