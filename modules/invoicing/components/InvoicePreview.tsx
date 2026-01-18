'use client';

import { useRef } from 'react';
import { InvoiceBuilderData } from '../types/invoice-builder.types';
import { calculateInvoiceTotals, formatCurrency } from '../utils/invoiceCalculations';
import invoiceTemplates from '../constants/invoiceTemplates';

interface InvoicePreviewProps {
  data: InvoiceBuilderData;
}

export default function InvoicePreview({ data }: InvoicePreviewProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const selectedTemplate = invoiceTemplates.find((t) => t.id === data.template) || invoiceTemplates[0];
  const totals = calculateInvoiceTotals(data.items, data.taxRate, data.discount, data.currency);

  const isTaxInvoice = data.invoiceType === 'tax';

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // TODO: Implement PDF download using a library like jsPDF or react-to-pdf
    alert('PDF download feature coming soon!');
  };

  return (
    <div>
      {/* Action Buttons */}
      <div className="print-hide" style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
        <button
          onClick={handlePrint}
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            background: '#8B5CF6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.9375rem',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#7C3AED'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#8B5CF6'}
        >
          Print
        </button>
        <button
          onClick={handleDownloadPDF}
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            background: '#10B981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.9375rem',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#10B981'}
        >
          Download PDF
        </button>
      </div>

      {/* Invoice Preview */}
      <div
        ref={printRef}
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '3rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '3rem', borderBottom: `3px solid ${selectedTemplate.colors.primary}`, paddingBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 700, color: selectedTemplate.colors.primary, marginBottom: '0.5rem' }}>
                {isTaxInvoice ? 'TAX INVOICE' : 'INVOICE'}
              </h1>
              {data.invoiceNumber && (
                <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                  Invoice #: {data.invoiceNumber}
                </p>
              )}
              {isTaxInvoice && (data.business.gstin || data.business.pan) && (
                <div style={{ marginTop: '0.5rem', color: '#6B7280', fontSize: '0.875rem' }}>
                  {data.business.gstin && <div>GSTIN: {data.business.gstin}</div>}
                  {data.business.pan && <div>PAN: {data.business.pan}</div>}
                </div>
              )}
            </div>
            {data.business.name && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '0.5rem', color: '#111827' }}>
                  {data.business.name}
                </div>
                {isTaxInvoice && data.business.address && <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>{data.business.address}</div>}
                {isTaxInvoice && (data.business.city || data.business.state || data.business.zipCode) && (
                  <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                    {[data.business.city, data.business.state, data.business.zipCode].filter(Boolean).join(', ')}
                  </div>
                )}
                {isTaxInvoice && data.business.country && <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>{data.business.country}</div>}
                {data.business.email && <div style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>{data.business.email}</div>}
                {data.business.phone && <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>{data.business.phone}</div>}
              </div>
            )}
          </div>
        </div>

        {/* Bill To */}
        {data.client.name && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#374151' }}>Bill To:</div>
            <div style={{ fontSize: '0.9375rem', color: '#6B7280' }}>
              <div style={{ fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>{data.client.name}</div>
              {isTaxInvoice && data.client.gstin && <div>GSTIN: {data.client.gstin}</div>}
              {isTaxInvoice && data.client.pan && <div>PAN: {data.client.pan}</div>}
              {isTaxInvoice && data.client.address && <div>{data.client.address}</div>}
              {isTaxInvoice && (data.client.city || data.client.state || data.client.zipCode) && (
                <div>{[data.client.city, data.client.state, data.client.zipCode].filter(Boolean).join(', ')}</div>
              )}
              {isTaxInvoice && data.client.country && <div>{data.client.country}</div>}
              {data.client.email && <div style={{ marginTop: '0.25rem' }}>{data.client.email}</div>}
              {data.client.phone && <div>{data.client.phone}</div>}
            </div>
          </div>
        )}

        {/* Invoice Dates */}
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', fontSize: '0.9375rem' }}>
          {data.issueDate && (
            <div>
              <span style={{ fontWeight: 600, color: '#374151' }}>Issue Date: </span>
              <span style={{ color: '#6B7280' }}>{new Date(data.issueDate).toLocaleDateString()}</span>
            </div>
          )}
          {data.dueDate && (
            <div>
              <span style={{ fontWeight: 600, color: '#374151' }}>Due Date: </span>
              <span style={{ color: '#6B7280' }}>{new Date(data.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Items Table */}
        <div style={{ marginBottom: '2rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${selectedTemplate.colors.primary}` }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Item</th>
                {isTaxInvoice && (
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>HSN/SAC</th>
                )}
                {isTaxInvoice && (
                  <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600, color: '#374151' }}>GST %</th>
                )}
                <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600, color: '#374151' }}>Qty</th>
                <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600, color: '#374151' }}>Rate</th>
                <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600, color: '#374151' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => {
                const amount = item.quantity * item.unitPrice;
                const gst = isTaxInvoice ? (amount * (item.taxRate || 0)) / 100 : 0;
                const cgst = isTaxInvoice ? gst / 2 : 0;
                const sgst = isTaxInvoice ? gst / 2 : 0;
                const lineTotal = amount + gst;
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '0.75rem', color: '#111827' }}>
                      {item.description || `Item ${index + 1}`}
                    </td>
                    {isTaxInvoice && (
                      <td style={{ padding: '0.75rem', color: '#6B7280' }}>{item.hsnSac || '-'}</td>
                    )}
                    {isTaxInvoice && (
                      <td style={{ padding: '0.75rem', textAlign: 'right', color: '#6B7280' }}>{item.taxRate || 0}</td>
                    )}
                    <td style={{ padding: '0.75rem', textAlign: 'right', color: '#6B7280' }}>{item.quantity}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right', color: '#6B7280' }}>
                      {formatCurrency(item.unitPrice, data.currency)}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right', color: '#6B7280' }}>
                      {formatCurrency(lineTotal, data.currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div style={{ marginLeft: 'auto', width: '300px', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #E5E7EB' }}>
            <span style={{ color: '#6B7280' }}>Subtotal:</span>
            <span style={{ fontWeight: 600, color: '#111827' }}>{formatCurrency(totals.subtotal, data.currency)}</span>
          </div>
          {isTaxInvoice && totals.totalTax > 0 && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #E5E7EB' }}>
                <span style={{ color: '#6B7280' }}>CGST:</span>
                <span style={{ fontWeight: 600, color: '#111827' }}>{formatCurrency(totals.totalTax / 2, data.currency)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #E5E7EB' }}>
                <span style={{ color: '#6B7280' }}>SGST:</span>
                <span style={{ fontWeight: 600, color: '#111827' }}>{formatCurrency(totals.totalTax / 2, data.currency)}</span>
              </div>
            </>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', marginTop: '0.5rem', borderTop: `2px solid ${selectedTemplate.colors.primary}`, fontSize: '1.125rem' }}>
            <span style={{ fontWeight: 700, color: '#111827' }}>Total:</span>
            <span style={{ fontWeight: 700, color: selectedTemplate.colors.primary }}>
              {formatCurrency(totals.total, data.currency)}
            </span>
          </div>
        </div>

        {/* Notes & Terms */}
        {(data.notes || data.terms) && (
          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #E5E7EB' }}>
            {data.notes && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#374151' }}>Notes:</div>
                <div style={{ color: '#6B7280', fontSize: '0.9375rem', whiteSpace: 'pre-wrap' }}>{data.notes}</div>
              </div>
            )}
            {data.terms && (
              <div>
                <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#374151' }}>Terms & Conditions:</div>
                <div style={{ color: '#6B7280', fontSize: '0.9375rem', whiteSpace: 'pre-wrap' }}>{data.terms}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-preview,
          #invoice-preview * {
            visibility: visible;
          }
          #invoice-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

