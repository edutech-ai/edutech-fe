"use client";

import {
  DollarSign,
  Users,
  Building2,
  TrendingUp,
  FileText,
  AlertCircle,
} from "lucide-react";
import { MetricCard } from "@/components/admin/MetricCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockCustomers, getCustomerStats } from "@/data/admin/mockCustomers";
import { mockInvoices } from "@/data/admin/mockInvoices";
import Link from "next/link";

export default function AdminDashboard() {
  const customerStats = getCustomerStats();

  // Calculate some metrics
  const avgRevenuePerCustomer =
    customerStats.active > 0
      ? Math.round(customerStats.totalMRR / customerStats.active)
      : 0;

  const totalExamsCreated = mockCustomers.reduce(
    (sum, c) => sum + c.examsCreated,
    0
  );

  // Recent customers
  const recentCustomers = [...mockCustomers]
    .sort(
      (a, b) =>
        new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()
    )
    .slice(0, 5);

  // Pending invoices
  const pendingInvoices = mockInvoices.filter(
    (inv) => inv.status === "pending" || inv.status === "overdue"
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600">
          Welcome back! Here&apos;s what&apos;s happening with your platform.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Monthly Recurring Revenue"
          value={`$${customerStats.totalMRR.toLocaleString()}`}
          change={12.5}
          trend="up"
          icon={DollarSign}
          iconColor="text-green-600"
        />
        <MetricCard
          title="Active Customers"
          value={customerStats.active}
          change={8.3}
          trend="up"
          icon={Building2}
          iconColor="text-blue-600"
        />
        <MetricCard
          title="Total Users"
          value={customerStats.totalUsers}
          change={15.2}
          trend="up"
          icon={Users}
          iconColor="text-purple-600"
        />
        <MetricCard
          title="Avg Revenue per Customer"
          value={`$${avgRevenuePerCustomer}`}
          change={-2.1}
          trend="down"
          icon={TrendingUp}
          iconColor="text-orange-600"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Trial Users</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {customerStats.trial}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Potential ${customerStats.trial * 99}/mo
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
              <p className="text-sm font-medium text-gray-600">Exams Created</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {totalExamsCreated.toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-gray-500">Across all schools</p>
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
                Pending Invoices
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {pendingInvoices.length}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                $
                {pendingInvoices
                  .reduce((sum, inv) => sum + inv.amount, 0)
                  .toLocaleString()}{" "}
                outstanding
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-50">
              <DollarSign className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Customers */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Customers
            </h3>
            <Link href="/admin/customers">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {recentCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{customer.name}</p>
                  <p className="text-sm text-gray-500">
                    {customer.type === "school" ? "School" : "District"} •{" "}
                    {customer.users} users
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${customer.mrr}/mo
                  </p>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      customer.status === "active"
                        ? "bg-green-50 text-green-700"
                        : customer.status === "trial"
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    {customer.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Pending Actions */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Pending Actions
            </h3>
          </div>
          <div className="space-y-3">
            {pendingInvoices.slice(0, 5).map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-start gap-3 rounded-lg border border-red-100 bg-red-50 p-3"
              >
                <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {invoice.status === "overdue"
                      ? "Overdue Invoice"
                      : "Pending Payment"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {invoice.customerName} - ${invoice.amount}
                  </p>
                </div>
                <Link href="/admin/billing">
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </Link>
              </div>
            ))}

            {customerStats.trial > 0 && (
              <div className="flex items-start gap-3 rounded-lg border border-yellow-100 bg-yellow-50 p-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Trial Expiring Soon
                  </p>
                  <p className="text-sm text-gray-600">
                    {customerStats.trial} trial{" "}
                    {customerStats.trial > 1 ? "users" : "user"} to follow up
                  </p>
                </div>
                <Link href="/admin/customers">
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Revenue Chart Placeholder */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Revenue Overview
        </h3>
        <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
          <p className="text-gray-500">
            Chart placeholder - Revenue trend over time
          </p>
        </div>
      </Card>
    </div>
  );
}
