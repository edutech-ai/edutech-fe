"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockInvoices } from "@/data/admin/mockInvoices";
import { Download, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BillingPage() {
  const getInvoiceStatusColor = (
    status: "paid" | "pending" | "overdue" | "cancelled"
  ) => {
    switch (status) {
      case "paid":
        return "bg-green-50 text-green-700";
      case "pending":
        return "bg-yellow-50 text-yellow-700";
      case "overdue":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Billing & Invoices</h2>
        <p className="text-gray-600">View and manage all invoices</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Invoices</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {mockInvoices.length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Paid</p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            {mockInvoices.filter((i) => i.status === "paid").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="mt-1 text-2xl font-bold text-yellow-600">
            {mockInvoices.filter((i) => i.status === "pending").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Overdue</p>
          <p className="mt-1 text-2xl font-bold text-red-600">
            {mockInvoices.filter((i) => i.status === "overdue").length}
          </p>
        </Card>
      </div>

      {/* Invoice Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Issued
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {mockInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">
                      {invoice.invoiceNumber}
                    </p>
                    <p className="text-sm text-gray-500">
                      {invoice.description}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {invoice.customerName}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">
                      ${invoice.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {new Date(invoice.issuedDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {new Date(invoice.dueDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-1 text-xs font-medium capitalize",
                        getInvoiceStatusColor(invoice.status)
                      )}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
