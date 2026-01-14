/**
 * Invoice Templates
 */

import { InvoiceTemplate } from '../types/invoice-builder.types';

export const invoiceTemplates: InvoiceTemplate[] = [
  {
    id: 'modern',
    name: 'Modern',
    preview: 'Clean and professional design',
    colors: {
      primary: '#8B5CF6',
      secondary: '#FBBF24',
      background: '#FFFFFF',
    },
  },
  {
    id: 'classic',
    name: 'Classic',
    preview: 'Traditional business style',
    colors: {
      primary: '#1F2937',
      secondary: '#6B7280',
      background: '#FFFFFF',
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    preview: 'Simple and elegant',
    colors: {
      primary: '#111827',
      secondary: '#9CA3AF',
      background: '#FFFFFF',
    },
  },
  {
    id: 'colorful',
    name: 'Colorful',
    preview: 'Vibrant and eye-catching',
    colors: {
      primary: '#EC4899',
      secondary: '#FBBF24',
      background: '#FFFFFF',
    },
  },
];

export default invoiceTemplates;

