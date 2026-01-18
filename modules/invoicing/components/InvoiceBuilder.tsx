'use client';

import { useState, useEffect } from 'react';
import InvoiceInlineEditor from './InvoiceInlineEditor';
import { InvoiceBuilderData } from '../types/invoice-builder.types';
import { generateInvoiceNumber } from '../utils/invoiceCalculations';

const initialData: InvoiceBuilderData = {
  invoiceType: 'non_tax',
  documentTitle: 'Invoice', // Editable document title
  business: {
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    email: '',
    phone: '',
    website: '',
    gstin: '',
    pan: '',
  },
  client: {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    gstin: '',
    pan: '',
  },
  // Leave invoiceNumber empty for SSR to avoid hydration mismatch;
  // we'll generate a client-only value after mount.
  invoiceNumber: '',
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  validTillDate: (() => {
    const issueDate = new Date();
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + 15); // Invoice date + 15 days
    return dueDate.toISOString().split('T')[0];
  })(), // Due date open by default (invoice date + 15 days)
  items: [
    {
      id: '1',
      description: '',
      hsnSac: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: 0,
      discount: 0,
    },
  ],
  taxRate: 0,
  discount: 0,
  currency: 'USD',
  notes: '',
  terms: '',
  template: 'modern',
  customFields: [],
};

export default function InvoiceBuilder() {
  const [invoiceData, setInvoiceData] = useState<InvoiceBuilderData>(initialData);

  // Generate invoice number on the client only, after initial render,
  // so server and client markup match during hydration.
  useEffect(() => {
    setInvoiceData((prev) => {
      if (prev.invoiceNumber) return prev;
      return { ...prev, invoiceNumber: generateInvoiceNumber() };
    });
  }, []);

  const updateInvoiceData = (updates: Partial<InvoiceBuilderData>) => {
    setInvoiceData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#F9FAFB',
      padding: '2rem 0',
    }}>
      <InvoiceInlineEditor data={invoiceData} onUpdate={updateInvoiceData} />
    </div>
  );
}

