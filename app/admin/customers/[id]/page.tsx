"use client";

import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  FileText,
  DollarSign,
  AlertCircle,
  Edit,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getCustomerById } from "@/data/admin/mockCustomers";
import { getInvoicesByCustomerId } from "@/data/admin/mockInvoices";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CustomerDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const customer = getCustomerById(id);
  const invoices = getInvoicesByCustomerId(id);

  if (!customer) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">
            Customer not found
          </p>
          <Link href="/admin/customers">
            <Button className="mt-4">Back to Customers</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (
    status: "active" | "trial" | "suspended" | "cancelled"
  ) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700 border-green-200";
      case "trial":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "suspended":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/customers">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {customer.name}
            </h2>
            <p className="text-gray-600">Customer Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Customer
          </Button>
          <Button>
            <CreditCard className="mr-2 h-4 w-4" />
            Manage Billing
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                ${customer.mrr}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {customer.users} / {customer.maxUsers}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Exams Created</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {customer.examsCreated}
              </p>
            </div>
            <FileText className="h-8 w-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span
                className={cn(
                  "mt-2 inline-flex rounded-full border px-3 py-1 text-sm font-medium capitalize",
                  getStatusColor(customer.status)
                )}
              >
                {customer.status}
              </span>
            </div>
            <Building2 className="h-8 w-8 text-gray-600" />
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Customer Info */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Customer Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Building2 className="mt-1 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Organization Type</p>
                  <p className="font-medium capitalize text-gray-900">
                    {customer.type}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Contact Email</p>
                  <p className="font-medium text-gray-900">
                    {customer.contactEmail}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">
                    {customer.contactPhone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium text-gray-900">
                    {customer.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="mt-1 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Joined Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(customer.joinedDate).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>

              {customer.trialEndsAt && (
                <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                  <AlertCircle className="mt-1 h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">
                      Trial Ends
                    </p>
                    <p className="text-sm text-yellow-700">
                      {new Date(customer.trialEndsAt).toLocaleDateString(
                        "vi-VN"
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Subscription
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Current Plan</p>
                <p className="text-lg font-bold capitalize text-gray-900">
                  {customer.plan}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Cost</p>
                <p className="text-lg font-bold text-gray-900">
                  ${customer.mrr}
                </p>
              </div>
              <Button variant="outline" className="w-full">
                Change Plan
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column - Activity & Invoices */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="invoices" className="w-full">
            <TabsList>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="invoices" className="mt-6">
              <Card>
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-gray-900">
                    Billing History
                  </h3>
                </div>
                <div className="divide-y">
                  {invoices.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                      No invoices yet
                    </div>
                  ) : (
                    invoices.map((invoice) => (
                      <div
                        key={invoice.id}
                        className="flex items-center justify-between p-4 hover:bg-gray-50"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {invoice.invoiceNumber}
                          </p>
                          <p className="text-sm text-gray-500">
                            {invoice.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            Issued:{" "}
                            {new Date(invoice.issuedDate).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ${invoice.amount}
                          </p>
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2 py-1 text-xs font-medium capitalize",
                              getInvoiceStatusColor(invoice.status)
                            )}
                          >
                            {invoice.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="mt-6">
              <Card className="p-12">
                <p className="text-center text-gray-500">
                  User management coming soon
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <Card className="p-12">
                <p className="text-center text-gray-500">
                  Activity log coming soon
                </p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
