/**
 * Invoice Calculation Utilities
 */

import { InvoiceItemInput } from '../types/invoice-builder.types';

export interface InvoiceTotals {
  subtotal: number;
  totalTax: number;
  totalDiscount: number;
  total: number;
}

/**
 * Calculate totals for invoice items
 */
export function calculateItemTotal(item: InvoiceItemInput): number {
  const lineTotal = item.quantity * item.unitPrice;
  const discountAmount = (lineTotal * item.discount) / 100;
  const afterDiscount = lineTotal - discountAmount;
  const taxAmount = (afterDiscount * item.taxRate) / 100;
  return afterDiscount + taxAmount;
}

/**
 * Calculate invoice totals
 */
export function calculateInvoiceTotals(
  items: InvoiceItemInput[],
  globalTaxRate: number = 0,
  globalDiscount: number = 0
): InvoiceTotals {
  // Calculate subtotal (sum of all line items before tax and discount)
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPrice);
  }, 0);

  // Calculate total discount
  const totalDiscount = items.reduce((sum, item) => {
    const lineTotal = item.quantity * item.unitPrice;
    const itemDiscount = (lineTotal * item.discount) / 100;
    return sum + itemDiscount;
  }, 0) + (subtotal * globalDiscount) / 100;

  // Calculate total after discount
  const afterDiscount = subtotal - totalDiscount;

  // Calculate total tax
  const totalTax = items.reduce((sum, item) => {
    const lineTotal = item.quantity * item.unitPrice;
    const itemDiscount = (lineTotal * item.discount) / 100;
    const afterItemDiscount = lineTotal - itemDiscount;
    const itemTax = (afterItemDiscount * item.taxRate) / 100;
    return sum + itemTax;
  }, 0) + (afterDiscount * globalTaxRate) / 100;

  // Calculate final total
  const total = afterDiscount + totalTax;

  return {
    subtotal,
    totalTax,
    totalDiscount,
    total,
  };
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Generate invoice number
 */
export function generateInvoiceNumber(prefix: string = 'INV'): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}-${timestamp.toString().slice(-6)}-${random.toString().padStart(3, '0')}`;
}

