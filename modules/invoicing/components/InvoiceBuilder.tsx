'use client';

import { useState, useEffect } from 'react';
import InvoiceForm from './InvoiceForm';
import InvoicePreview from './InvoicePreview';
import { InvoiceBuilderData } from '../types/invoice-builder.types';
import { generateInvoiceNumber } from '../utils/invoiceCalculations';

const initialData: InvoiceBuilderData = {
  invoiceType: 'non_tax',
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
      display: 'grid', 
      gridTemplateColumns: '1fr', 
      gap: '2rem' 
    }}>
      <style jsx>{`
        @media (min-width: 1024px) {
          .invoice-builder-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
      <div className="invoice-builder-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr', 
        gap: '2rem' 
      }}>
        {/* Left Side - Form */}
        <div>
          <InvoiceForm data={invoiceData} onUpdate={updateInvoiceData} />
        </div>

        {/* Right Side - Preview */}
        <div style={{ 
          position: 'sticky', 
          top: '2rem', 
          alignSelf: 'start',
          maxHeight: 'calc(100vh - 4rem)',
          overflowY: 'auto'
        }}>
          <InvoicePreview data={invoiceData} />
        </div>
      </div>
    </div>
  );
}

