import { InvoiceBuilderData } from '../types/invoice-builder.types';

interface InvoiceFormProps {
  data: InvoiceBuilderData;
  onUpdate: (updates: Partial<InvoiceBuilderData>) => void;
}

export default function InvoiceForm({ data, onUpdate }: InvoiceFormProps) {
  const setInvoiceType = (invoiceType: InvoiceBuilderData['invoiceType']) => {
    const nextCurrency = invoiceType === 'tax' ? 'INR' : data.currency || 'USD';

    // When switching to tax invoices, default GST rate to 18% if currently 0
    // so the preview/table looks immediately correct.
    const nextItems =
      invoiceType === 'tax'
        ? data.items.map((it) => ({
            ...it,
            taxRate: it.taxRate || 18,
            hsnSac: it.hsnSac ?? '',
          }))
        : data.items.map((it) => ({
            ...it,
            taxRate: 0,
          }));

    onUpdate({ invoiceType, currency: nextCurrency, items: nextItems });
  };

  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      description: '',
      hsnSac: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: data.invoiceType === 'tax' ? 18 : 0,
      discount: 0,
    };
    onUpdate({ items: [...data.items, newItem] });
  };

  const removeItem = (id: string) => {
    onUpdate({ items: data.items.filter((item) => item.id !== id) });
  };

  const updateItem = (id: string, updates: Partial<InvoiceBuilderData['items'][0]>) => {
    onUpdate({
      items: data.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    });
  };

  return (
    <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem', color: '#111827' }}>
        Invoice Details
      </h2>

      {/* Invoice Type Selection (replaces Invoice Template) */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>
          Invoice Type
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setInvoiceType('tax')}
            style={{
              padding: '0.75rem',
              border: data.invoiceType === 'tax' ? '2px solid #8B5CF6' : '2px solid #E5E7EB',
              borderRadius: '8px',
              background: data.invoiceType === 'tax' ? '#F5F3FF' : 'white',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }}>Tax Invoice</div>
            <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>GST fields + CGST/SGST breakdown</div>
          </button>

          <button
            type="button"
            onClick={() => setInvoiceType('non_tax')}
            style={{
              padding: '0.75rem',
              border: data.invoiceType === 'non_tax' ? '2px solid #8B5CF6' : '2px solid #E5E7EB',
              borderRadius: '8px',
              background: data.invoiceType === 'non_tax' ? '#F5F3FF' : 'white',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }}>Non‑Tax Invoice</div>
            <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>Basic details only (name/phone/email)</div>
          </button>
        </div>
      </div>

      {/* Business Information */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: '#374151' }}>
          Your Business Information
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="text"
            placeholder="Business Name *"
            value={data.business.name}
            onChange={(e) => onUpdate({ business: { ...data.business, name: e.target.value } })}
            style={{
              padding: '0.75rem',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '0.9375rem',
            }}
            required
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <input
              type="email"
              placeholder="Email"
              value={data.business.email}
              onChange={(e) => onUpdate({ business: { ...data.business, email: e.target.value } })}
              style={{
                padding: '0.75rem',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '0.9375rem',
              }}
            />
            <input
              type="tel"
              placeholder="Phone"
              value={data.business.phone}
              onChange={(e) => onUpdate({ business: { ...data.business, phone: e.target.value } })}
              style={{
                padding: '0.75rem',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '0.9375rem',
              }}
            />
          </div>

          {data.invoiceType === 'tax' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="GSTIN (optional)"
                  value={data.business.gstin || ''}
                  onChange={(e) => onUpdate({ business: { ...data.business, gstin: e.target.value } })}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '0.9375rem',
                  }}
                />
                <input
                  type="text"
                  placeholder="PAN (optional)"
                  value={data.business.pan || ''}
                  onChange={(e) => onUpdate({ business: { ...data.business, pan: e.target.value } })}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '0.9375rem',
                  }}
                />
              </div>

              <input
                type="text"
                placeholder="Address (optional)"
                value={data.business.address || ''}
                onChange={(e) => onUpdate({ business: { ...data.business, address: e.target.value } })}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '0.9375rem',
                }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="City (optional)"
                  value={data.business.city || ''}
                  onChange={(e) => onUpdate({ business: { ...data.business, city: e.target.value } })}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '0.9375rem',
                  }}
                />
                <input
                  type="text"
                  placeholder="State (optional)"
                  value={data.business.state || ''}
                  onChange={(e) => onUpdate({ business: { ...data.business, state: e.target.value } })}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '0.9375rem',
                  }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="Postal Code / ZIP (optional)"
                  value={data.business.zipCode || ''}
                  onChange={(e) => onUpdate({ business: { ...data.business, zipCode: e.target.value } })}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '0.9375rem',
                  }}
                />
                <input
                  type="text"
                  placeholder="Country (optional)"
                  value={data.business.country || ''}
                  onChange={(e) => onUpdate({ business: { ...data.business, country: e.target.value } })}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '0.9375rem',
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Client Information */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: '#374151' }}>
          Client Information
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="text"
            placeholder="Client Name *"
            value={data.client.name}
            onChange={(e) => onUpdate({ client: { ...data.client, name: e.target.value } })}
            style={{
              padding: '0.75rem',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '0.9375rem',
            }}
            required
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <input
              type="email"
              placeholder="Email"
              value={data.client.email}
              onChange={(e) => onUpdate({ client: { ...data.client, email: e.target.value } })}
              style={{
                padding: '0.75rem',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '0.9375rem',
              }}
            />
            <input
              type="tel"
              placeholder="Phone"
              value={data.client.phone}
              onChange={(e) => onUpdate({ client: { ...data.client, phone: e.target.value } })}
              style={{
                padding: '0.75rem',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '0.9375rem',
              }}
            />
          </div>

          {data.invoiceType === 'tax' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="Client GSTIN (optional)"
                  value={data.client.gstin || ''}
                  onChange={(e) => onUpdate({ client: { ...data.client, gstin: e.target.value } })}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '0.9375rem',
                  }}
                />
                <input
                  type="text"
                  placeholder="Client PAN (optional)"
                  value={data.client.pan || ''}
                  onChange={(e) => onUpdate({ client: { ...data.client, pan: e.target.value } })}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '0.9375rem',
                  }}
                />
              </div>

              <input
                type="text"
                placeholder="Client Address (optional)"
                value={data.client.address || ''}
                onChange={(e) => onUpdate({ client: { ...data.client, address: e.target.value } })}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '0.9375rem',
                }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="City (optional)"
                  value={data.client.city || ''}
                  onChange={(e) => onUpdate({ client: { ...data.client, city: e.target.value } })}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '0.9375rem',
                  }}
                />
                <input
                  type="text"
                  placeholder="State (optional)"
                  value={data.client.state || ''}
                  onChange={(e) => onUpdate({ client: { ...data.client, state: e.target.value } })}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '0.9375rem',
                  }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="Postal Code / ZIP (optional)"
                  value={data.client.zipCode || ''}
                  onChange={(e) => onUpdate({ client: { ...data.client, zipCode: e.target.value } })}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '0.9375rem',
                  }}
                />
                <input
                  type="text"
                  placeholder="Country (optional)"
                  value={data.client.country || ''}
                  onChange={(e) => onUpdate({ client: { ...data.client, country: e.target.value } })}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '0.9375rem',
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Invoice Details */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: '#374151' }}>
          Invoice Details
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#6B7280' }}>
              Invoice #
            </label>
            <input
              type="text"
              value={data.invoiceNumber}
              onChange={(e) => onUpdate({ invoiceNumber: e.target.value })}
              style={{
                padding: '0.75rem',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '0.9375rem',
                width: '100%',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#6B7280' }}>
              Issue Date
            </label>
            <input
              type="date"
              value={data.issueDate}
              onChange={(e) => onUpdate({ issueDate: e.target.value })}
              style={{
                padding: '0.75rem',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '0.9375rem',
                width: '100%',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#6B7280' }}>
              Due Date
            </label>
            <input
              type="date"
              value={data.dueDate}
              onChange={(e) => onUpdate({ dueDate: e.target.value })}
              style={{
                padding: '0.75rem',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '0.9375rem',
                width: '100%',
              }}
            />
          </div>
        </div>
      </div>

      {/* Invoice Items */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#374151' }}>
            Invoice Items
          </h3>
          <button
            onClick={addItem}
            style={{
              padding: '0.5rem 1rem',
              background: '#8B5CF6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            + Add Item
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {data.items.map((item, index) => (
            <div
              key={item.id}
              style={{
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '1rem',
                background: '#F9FAFB',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 600, color: '#374151' }}>Item {index + 1}</span>
                {data.items.length > 1 && (
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      background: '#EF4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input
                  type="text"
                  placeholder={data.invoiceType === 'tax' ? 'Item Name / Description *' : 'Item Description *'}
                  value={item.description}
                  onChange={(e) => updateItem(item.id, { description: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '0.9375rem',
                    background: 'white',
                  }}
                  required
                />

                {data.invoiceType === 'tax' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <input
                      type="text"
                      placeholder="HSN/SAC (optional)"
                      value={item.hsnSac || ''}
                      onChange={(e) => updateItem(item.id, { hsnSac: e.target.value })}
                      style={{
                        padding: '0.75rem',
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                        fontSize: '0.9375rem',
                        background: 'white',
                      }}
                    />
                    <input
                      type="number"
                      placeholder="GST Rate %"
                      value={item.taxRate}
                      onChange={(e) => updateItem(item.id, { taxRate: parseFloat(e.target.value) || 0 })}
                      style={{
                        padding: '0.75rem',
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                        fontSize: '0.9375rem',
                        background: 'white',
                      }}
                      min="0"
                      step="0.01"
                    />
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                    style={{
                      padding: '0.75rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '0.9375rem',
                      background: 'white',
                    }}
                    min="0"
                    step="0.01"
                  />
                  <input
                    type="number"
                    placeholder="Unit Price"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                    style={{
                      padding: '0.75rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '0.9375rem',
                      background: 'white',
                    }}
                    min="0"
                    step="0.01"
                  />
                  <input
                    type="number"
                    placeholder="Discount %"
                    value={item.discount}
                    onChange={(e) => updateItem(item.id, { discount: parseFloat(e.target.value) || 0 })}
                    style={{
                      padding: '0.75rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '0.9375rem',
                      background: 'white',
                    }}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Fields */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: '#374151' }}>
          Additional Information
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <textarea
            placeholder="Notes (optional)"
            value={data.notes}
            onChange={(e) => onUpdate({ notes: e.target.value })}
            rows={3}
            style={{
              padding: '0.75rem',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '0.9375rem',
              resize: 'vertical',
            }}
          />
          <textarea
            placeholder="Terms & Conditions (optional)"
            value={data.terms}
            onChange={(e) => onUpdate({ terms: e.target.value })}
            rows={3}
            style={{
              padding: '0.75rem',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '0.9375rem',
              resize: 'vertical',
            }}
          />
        </div>
      </div>
    </div>
  );
}

