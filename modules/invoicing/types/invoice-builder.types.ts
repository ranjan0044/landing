/**
 * Invoice Builder Types
 * Types for the online invoice builder
 */

export interface BusinessInfo {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  email?: string;
  phone?: string;
  website?: string;
  taxId?: string;
  logo?: string;
}

export interface ClientInfo {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  taxId?: string;
}

export interface InvoiceItemInput {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  discount: number;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
}

export interface InvoiceBuilderData {
  business: BusinessInfo;
  client: ClientInfo;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItemInput[];
  taxRate: number;
  discount: number;
  currency: string;
  notes?: string;
  terms?: string;
  template: string;
}

