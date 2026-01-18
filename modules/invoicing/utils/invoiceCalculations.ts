/**
 * Invoice Calculation Utilities
 */

import { InvoiceItemInput } from '../types/invoice-builder.types';

export interface InvoiceTotals {
  subtotal: number;
  totalTax: number;
  totalDiscount: number;
  total: number;
  totalInWords?: string;
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

/**
 * Convert number to words (basic implementation)
 */
function numberToWords(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero';

  function convertHundreds(n: number): string {
    let result = '';
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n >= 10) {
      result += teens[n - 10] + ' ';
      n = 0;
    }
    if (n > 0) {
      result += ones[n] + ' ';
    }
    return result.trim();
  }

  if (num >= 10000000) {
    const crores = Math.floor(num / 10000000);
    const remainder = num % 10000000;
    return convertHundreds(crores) + ' Crore ' + (remainder > 0 ? convertHundreds(remainder) : '');
  }
  if (num >= 100000) {
    const lakhs = Math.floor(num / 100000);
    const remainder = num % 100000;
    return convertHundreds(lakhs) + ' Lakh ' + (remainder > 0 ? convertHundreds(remainder) : '');
  }
  if (num >= 1000) {
    const thousands = Math.floor(num / 1000);
    const remainder = num % 1000;
    return convertHundreds(thousands) + ' Thousand ' + (remainder > 0 ? convertHundreds(remainder) : '');
  }
  return convertHundreds(num);
}

/**
 * Convert amount to words with currency
 */
export function amountToWords(amount: number, currency: string = 'INR'): string {
  const wholePart = Math.floor(amount);
  const decimalPart = Math.round((amount - wholePart) * 100);

  let words = numberToWords(wholePart);
  
  if (currency === 'INR') {
    words += ' Rupees';
    if (decimalPart > 0) {
      words += ' ' + numberToWords(decimalPart) + ' Paise';
    }
    words += ' Only';
  } else {
    words += ' ' + currency;
    if (decimalPart > 0) {
      words += ' and ' + numberToWords(decimalPart) + ' Cents';
    }
  }  return words;
}