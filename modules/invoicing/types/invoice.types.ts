/**
 * Invoice Types
 */

import { InvoiceStatus } from '../constants';

export interface InvoiceItem {
  id?: number;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number;
  discount?: number;
  total: number;
  productId?: number; // If linked to inventory module
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  customerId: number;
  customerName?: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount?: number;
  total: number;
  currency: string;
  dueDate: string | Date;
  issueDate: string | Date;
  paidDate?: string | Date;
  paymentMethod?: string;
  notes?: string;
  terms?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  createdBy?: number;
  updatedBy?: number;
}

export interface CreateInvoiceDTO {
  customerId: number;
  items: Omit<InvoiceItem, 'id' | 'total'>[];
  dueDate: string | Date;
  issueDate?: string | Date;
  currency?: string;
  taxRate?: number;
  discount?: number;
  notes?: string;
  terms?: string;
}

export interface UpdateInvoiceDTO {
  customerId?: number;
  items?: Omit<InvoiceItem, 'id' | 'total'>[];
  status?: InvoiceStatus;
  dueDate?: string | Date;
  notes?: string;
  terms?: string;
}

export interface InvoicePayment {
  invoiceId: number;
  amount: number;
  paymentDate: string | Date;
  paymentMethod: string;
  transactionId?: string;
  notes?: string;
}

export interface InvoiceFilters {
  status?: InvoiceStatus;
  customerId?: number;
  dateFrom?: string | Date;
  dateTo?: string | Date;
  search?: string;
}

