"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCheckPayment } from "@/services/paymentService";

type PaymentStatus = "loading" | "success" | "failed" | "pending";

function CheckoutResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("orderCode") || "";
  const status = searchParams.get("status");

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("loading");

  // Check payment status from API
  const {
    data: checkData,
    isLoading,
    refetch,
  } = useCheckPayment(orderCode, !!orderCode && paymentStatus !== "success");

  useEffect(() => {
    if (status === "CANCELLED") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPaymentStatus("failed");
      return;
    }

    if (!orderCode) {
      setPaymentStatus("failed");
      return;
    }

    if (checkData) {
      if (checkData.paid) {
        setPaymentStatus("success");
      } else {
        setPaymentStatus("pending");
      }
    }
  }, [orderCode, status, checkData]);

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  const handleGoToPricing = () => {
    router.push("/pricing");
  };

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading || paymentStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-gray-50 to-white">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Đang xác nhận thanh toán...
          </h2>
          <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-green-50 to-white">
        <div className="max-w-lg w-full mx-4">
          <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <CheckCircle2 className="h-14 w-14 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Thanh toán thành công!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Cảm ơn bạn đã nâng cấp tài khoản. Gói dịch vụ đã được kích hoạt và
              sẵn sàng sử dụng.
            </p>

            <div className="bg-green-50 rounded-xl p-4 mb-8">
              <p className="text-sm text-green-800">
                Mã đơn hàng:{" "}
                <span className="font-mono font-bold">{orderCode}</span>
              </p>
            </div>

            <Button
              onClick={handleGoToDashboard}
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Home className="h-5 w-5 mr-2" />
              Bắt đầu sử dụng
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-yellow-50 to-white">
        <div className="max-w-lg w-full mx-4">
          <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <Loader2 className="h-14 w-14 text-yellow-600 animate-spin" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Đang chờ xác nhận
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Thanh toán của bạn đang được xử lý. Hệ thống sẽ tự động cập nhật
              khi nhận được xác nhận từ ngân hàng.
            </p>

            <div className="bg-yellow-50 rounded-xl p-4 mb-8">
              <p className="text-sm text-yellow-800">
                Mã đơn hàng:{" "}
                <span className="font-mono font-bold">{orderCode}</span>
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleRefresh}
                size="lg"
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Kiểm tra lại
              </Button>
              <Button
                onClick={handleGoToDashboard}
                size="lg"
                variant="ghost"
                className="w-full"
              >
                <Home className="h-5 w-5 mr-2" />
                Về trang Dashboard
              </Button>
            </div>

            <p className="text-xs text-gray-400 mt-6">
              Thông thường mất 1-5 phút để xác nhận thanh toán
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Failed status
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-red-50 to-white">
      <div className="max-w-lg w-full mx-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <XCircle className="h-14 w-14 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Thanh toán không thành công
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Đã có lỗi xảy ra trong quá trình thanh toán hoặc đơn hàng đã bị hủy.
            Vui lòng thử lại.
          </p>

          <div className="space-y-3">
            <Button
              onClick={handleGoToPricing}
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Thử lại
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={handleGoToDashboard}
              className="w-full"
            >
              Về trang Dashboard
            </Button>
          </div>

          <p className="text-xs text-gray-400 mt-6">
            Nếu bạn đã chuyển khoản nhưng không nhận được xác nhận, vui lòng
            liên hệ hỗ trợ.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-gray-50 to-white">
          <div className="text-center">
            <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Đang tải...
            </h2>
          </div>
        </div>
      }
    >
      <CheckoutResultContent />
    </Suspense>
  );
}
