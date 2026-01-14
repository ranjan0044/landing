'use client';

import InvoiceBuilder from '@/modules/invoicing/components/InvoiceBuilder';

export default function InvoicingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', padding: '2rem 0' }}>
      <div className="container-wide" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
            Create Your Invoice
          </h1>
          <p style={{ color: '#6B7280', fontSize: '1.125rem' }}>
            Fill in the details below and create a professional invoice in seconds
          </p>
        </div>
        <InvoiceBuilder />
      </div>
    </div>
  );
}

