export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  status: "paid" | "pending" | "overdue" | "cancelled";
  issuedDate: string;
  dueDate: string;
  paidDate?: string;
  description: string;
}

export const mockInvoices: Invoice[] = [
  {
    id: "inv-001",
    invoiceNumber: "INV-2025-001",
    customerId: "cust-001",
    customerName: "THCS Nguyễn Du",
    amount: 99,
    status: "paid",
    issuedDate: "2025-01-01",
    dueDate: "2025-01-15",
    paidDate: "2025-01-10",
    description: "School Plan - January 2025",
  },
  {
    id: "inv-002",
    invoiceNumber: "INV-2025-002",
    customerId: "cust-002",
    customerName: "THPT Lê Lợi",
    amount: 299,
    status: "paid",
    issuedDate: "2025-01-01",
    dueDate: "2025-01-15",
    paidDate: "2025-01-12",
    description: "District Plan - January 2025",
  },
  {
    id: "inv-003",
    invoiceNumber: "INV-2025-003",
    customerId: "cust-003",
    customerName: "THCS Trần Hưng Đạo",
    amount: 99,
    status: "paid",
    issuedDate: "2025-01-01",
    dueDate: "2025-01-15",
    paidDate: "2025-01-14",
    description: "School Plan - January 2025",
  },
  {
    id: "inv-004",
    invoiceNumber: "INV-2025-004",
    customerId: "cust-004",
    customerName: "Sở GD&ĐT Hà Nội",
    amount: 999,
    status: "pending",
    issuedDate: "2025-01-01",
    dueDate: "2025-01-31",
    description: "District Plan - January 2025",
  },
  {
    id: "inv-005",
    invoiceNumber: "INV-2025-005",
    customerId: "cust-006",
    customerName: "THCS Chu Văn An",
    amount: 99,
    status: "paid",
    issuedDate: "2025-01-01",
    dueDate: "2025-01-15",
    paidDate: "2025-01-08",
    description: "School Plan - January 2025",
  },
  {
    id: "inv-006",
    invoiceNumber: "INV-2024-098",
    customerId: "cust-007",
    customerName: "THPT Phan Bội Châu",
    amount: 99,
    status: "overdue",
    issuedDate: "2024-12-01",
    dueDate: "2024-12-15",
    description: "School Plan - December 2024",
  },
];

export const getInvoiceById = (id: string): Invoice | undefined => {
  return mockInvoices.find((invoice) => invoice.id === id);
};

export const getInvoicesByCustomerId = (customerId: string): Invoice[] => {
  return mockInvoices.filter((invoice) => invoice.customerId === customerId);
};

export const getInvoiceStats = () => {
  const total = mockInvoices.length;
  const paid = mockInvoices.filter((i) => i.status === "paid").length;
  const pending = mockInvoices.filter((i) => i.status === "pending").length;
  const overdue = mockInvoices.filter((i) => i.status === "overdue").length;
  const totalRevenue = mockInvoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.amount, 0);

  return {
    total,
    paid,
    pending,
    overdue,
    totalRevenue,
  };
};
