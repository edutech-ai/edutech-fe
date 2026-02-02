"use client";

import { useState } from "react";
import {
  DollarSign,
  Users,
  Building2,
  TrendingUp,
  FileText,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { MetricCard } from "@/components/admin/MetricCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  useGetDashboardSummary,
  useGetRevenueChart,
  useGetUserGrowthChart,
} from "@/services/adminService";
import Link from "next/link";

type ChartPeriod = "7days" | "30days" | "3months";

const periodLabels: Record<ChartPeriod, string> = {
  "7days": "Tuần",
  "30days": "Tháng",
  "3months": "Quý",
};

// Format VND currency without decimals
const formatCurrency = (value: number) => {
  return `${value.toLocaleString("vi-VN")}đ`;
};

// Format date for chart
const formatChartDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

// Custom tooltip for revenue chart
const RevenueTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (active && payload && payload.length && label) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="text-sm text-gray-600 mb-1">{formatChartDate(label)}</p>
        <p className="text-sm font-semibold text-green-600">
          Doanh thu: {formatCurrency(payload[0].value)}
        </p>
        {payload[1] && (
          <p className="text-sm text-gray-500">Giao dịch: {payload[1].value}</p>
        )}
      </div>
    );
  }
  return null;
};

// Custom tooltip for user growth chart
const UserGrowthTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (active && payload && payload.length && label) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="text-sm text-gray-600 mb-1">{formatChartDate(label)}</p>
        <p className="text-sm font-semibold text-blue-600">
          Người dùng mới: {payload[0].value}
        </p>
        {payload[1] && (
          <p className="text-sm text-purple-600">Tổng: {payload[1].value}</p>
        )}
      </div>
    );
  }
  return null;
};

// Period selector component
const PeriodSelector = ({
  value,
  onChange,
}: {
  value: ChartPeriod;
  onChange: (period: ChartPeriod) => void;
}) => (
  <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
    {(Object.keys(periodLabels) as ChartPeriod[]).map((period) => (
      <Button
        key={period}
        variant="ghost"
        size="sm"
        onClick={() => onChange(period)}
        className={value === period ? "bg-white shadow-sm" : "hover:bg-gray-50"}
      >
        {periodLabels[period]}
      </Button>
    ))}
  </div>
);

export default function AdminDashboard() {
  const [revenuePeriod, setRevenuePeriod] = useState<ChartPeriod>("30days");
  const [userGrowthPeriod, setUserGrowthPeriod] =
    useState<ChartPeriod>("30days");

  const { data: summary, isLoading, error } = useGetDashboardSummary();
  const { data: revenueChart, isLoading: revenueLoading } =
    useGetRevenueChart(revenuePeriod);
  const { data: userGrowthChart, isLoading: userGrowthLoading } =
    useGetUserGrowthChart(userGrowthPeriod);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <AlertCircle className="h-12 w-12 mb-4" />
        <p>Không thể tải dữ liệu dashboard</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Thử lại
        </Button>
      </div>
    );
  }

  const {
    revenue,
    activeCustomers,
    totalUsers,
    avgRevenuePerCustomer,
    trialUsers,
    examsCreated,
  } = summary;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Tổng quan Dashboard
        </h2>
        <p className="text-gray-600">Chào mừng trở lại!</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Doanh thu tháng này"
          value={formatCurrency(revenue.currentMonth.revenue)}
          change={revenue.changePercent}
          trend={revenue.changePercent >= 0 ? "up" : "down"}
          icon={DollarSign}
          iconColor="text-green-600"
        />
        <MetricCard
          title="Khách hàng trả phí"
          value={activeCustomers.activeCount}
          change={activeCustomers.changePercent}
          trend={activeCustomers.changePercent >= 0 ? "up" : "down"}
          icon={Building2}
          iconColor="text-blue-600"
        />
        <MetricCard
          title="Tổng người dùng"
          value={totalUsers.totalUsers}
          change={totalUsers.changePercent}
          trend={totalUsers.changePercent >= 0 ? "up" : "down"}
          icon={Users}
          iconColor="text-purple-600"
        />
        <MetricCard
          title="Doanh thu TB/khách hàng"
          value={formatCurrency(avgRevenuePerCustomer.avgRevenue)}
          change={avgRevenuePerCustomer.changePercent}
          trend={avgRevenuePerCustomer.changePercent >= 0 ? "up" : "down"}
          icon={TrendingUp}
          iconColor="text-orange-600"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Biểu đồ doanh thu
              </h3>
              {revenueChart && (
                <p className="text-sm text-gray-500">
                  Tổng: {formatCurrency(revenueChart.total)} | TB:{" "}
                  {formatCurrency(revenueChart.average)}/ngày
                </p>
              )}
            </div>
            <PeriodSelector value={revenuePeriod} onChange={setRevenuePeriod} />
          </div>
          <div className="h-72">
            {revenueLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : revenueChart && revenueChart.data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChart.data}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatChartDate}
                    tick={{ fontSize: 12 }}
                    stroke="#9CA3AF"
                  />
                  <YAxis
                    tickFormatter={(value) =>
                      value >= 1000000
                        ? `${(value / 1000000).toFixed(1)}M`
                        : value >= 1000
                          ? `${(value / 1000).toFixed(0)}K`
                          : value
                    }
                    tick={{ fontSize: 12 }}
                    stroke="#9CA3AF"
                  />
                  <Tooltip content={<RevenueTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    strokeWidth={2}
                    fill="url(#colorRevenue)"
                    name="Doanh thu"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Chưa có dữ liệu doanh thu
              </div>
            )}
          </div>
        </Card>

        {/* User Growth Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Tăng trưởng người dùng
              </h3>
              {userGrowthChart && (
                <p className="text-sm text-gray-500">
                  Mới: {userGrowthChart.summary.totalNewUsers} | TB:{" "}
                  {userGrowthChart.summary.avgNewUsersPerDay}/ngày
                </p>
              )}
            </div>
            <PeriodSelector
              value={userGrowthPeriod}
              onChange={setUserGrowthPeriod}
            />
          </div>
          <div className="h-72">
            {userGrowthLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : userGrowthChart && userGrowthChart.data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthChart.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatChartDate}
                    tick={{ fontSize: 12 }}
                    stroke="#9CA3AF"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                  <Tooltip content={<UserGrowthTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: "12px" }}
                    formatter={(value) =>
                      value === "newUsers"
                        ? "Người dùng mới"
                        : "Tổng người dùng"
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="newUsers"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                    name="newUsers"
                  />
                  <Line
                    type="monotone"
                    dataKey="totalUsers"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                    name="totalUsers"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Chưa có dữ liệu người dùng
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Người dùng dùng thử
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {trialUsers.trialCount}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Tiềm năng {formatCurrency(trialUsers.potentialRevenue)}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-50">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Bài kiểm tra đã tạo
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {examsCreated.totalExams.toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Tổng trên toàn hệ thống
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50">
              <FileText className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Phân loại người dùng
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {totalUsers.breakdown.teachers} GV
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {totalUsers.breakdown.students} học sinh
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Trial Users List */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Người dùng dùng thử sắp hết hạn
            </h3>
          </div>
          <div className="space-y-4">
            {trialUsers.users.length === 0 ? (
              <p className="text-center py-8 text-gray-500">
                Không có người dùng dùng thử
              </p>
            ) : (
              trialUsers.users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{user.email}</p>
                    <p className="text-sm text-gray-500">
                      Hết hạn:{" "}
                      {new Date(user.trialEndsAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(user.potentialRevenue)}
                    </p>
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-yellow-50 text-yellow-700">
                      Dùng thử
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Exam Statistics */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Thống kê bài kiểm tra
            </h3>
          </div>
          <div className="space-y-4">
            {/* Status breakdown */}
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(examsCreated.breakdown).map(([status, count]) => (
                <div
                  key={status}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm text-gray-600 capitalize">
                    {status === "draft"
                      ? "Bản nháp"
                      : status === "published"
                        ? "Đã xuất bản"
                        : status === "archived"
                          ? "Đã lưu trữ"
                          : status}
                  </span>
                  <span className="font-semibold text-gray-900">{count}</span>
                </div>
              ))}
            </div>

            {/* Recent months */}
            <div className="pt-4 border-t">
              <p className="text-sm font-medium text-gray-600 mb-3">
                Số bài tạo gần đây
              </p>
              <div className="space-y-2">
                {examsCreated.byMonth.slice(0, 3).map((item) => (
                  <div
                    key={item.month}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-500">{item.month}</span>
                    <span className="font-medium text-gray-900">
                      {item.count} bài
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-4">
        <Link href="/admin/customers">
          <Card className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Quản lý khách hàng</span>
            </div>
          </Card>
        </Link>
        <Link href="/admin/subscriptions">
          <Card className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="font-medium">Gói đăng ký</span>
            </div>
          </Card>
        </Link>
        <Link href="/admin/billing">
          <Card className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-orange-600" />
              <span className="font-medium">Hóa đơn</span>
            </div>
          </Card>
        </Link>
        <Link href="/admin/users">
          <Card className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-purple-600" />
              <span className="font-medium">Người dùng</span>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
