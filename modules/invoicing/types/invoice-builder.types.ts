/**
 * Invoice Builder Types
 * Types for the online invoice builder
 */

export interface BusinessInfo {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;

  /**
   * Tax invoice (GST) fields
   * - gstin: GST Identification Number
   * - pan: Permanent Account Number (India)
   */
  gstin?: string;
  pan?: string;

  // Optional fields for future expansion
  website?: string;
  logo?: string;
}

export interface ClientInfo {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;

  /**
   * Tax invoice (GST) fields
   */
  gstin?: string;
  pan?: string;
}

export interface InvoiceItemInput {
  id: string;
  description: string;
  /**
   * Tax invoice (GST) field
   */
  hsnSac?: string;
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

export interface CustomField {
  id: string;
  label: string;
  value: string;
}

export type InvoiceType = 'tax' | 'non_tax';

export interface InvoiceBuilderData {
  invoiceType: InvoiceType;
  documentTitle: string; // Editable title (Invoice, Quotation, etc.)
  business: BusinessInfo;
  client: ClientInfo;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  validTillDate?: string; // For quotations
  items: InvoiceItemInput[];
  taxRate: number;
  discount: number;
  currency: string;
  notes?: string;
  terms?: string;
  template: string;
  customFields?: CustomField[]; // Custom fields array
}

