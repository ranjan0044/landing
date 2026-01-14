# Invoicing Module

Invoicing and billing management module for creating, managing, and tracking invoices.

## Features

- Invoice Creation & Management
- Invoice Templates
- Invoice Status Tracking
- Payment Processing
- Invoice History & Audit Trail
- Recurring Invoices
- Invoice Reminders
- Multi-currency Support
- Tax Calculations
- Invoice PDF Generation

## Dependencies

- `accounting` (required) - For financial records and journal entries
- `inventory` (optional) - For product-based invoices

## Usage

### Using Components

```typescript
import { InvoiceList, InvoiceForm, InvoiceDetail } from '@/modules/invoicing/components';

// Display invoice list
<InvoiceList />

// Create new invoice
<InvoiceForm />

// View invoice details
<InvoiceDetail invoiceId={123} />
```

### Using Services

```typescript
import { 
  createInvoice, 
  getInvoice, 
  updateInvoice, 
  deleteInvoice,
  sendInvoice,
  markAsPaid 
} from '@/modules/invoicing/services';

// Create a new invoice
const invoice = await createInvoice({
  customerId: 1,
  items: [...],
  dueDate: '2024-12-31',
  taxRate: 0.15
});

// Get invoice details
const invoice = await getInvoice(invoiceId);

// Update invoice
await updateInvoice(invoiceId, { status: 'sent' });

// Send invoice to customer
await sendInvoice(invoiceId, recipientEmail);

// Mark invoice as paid
await markAsPaid(invoiceId, paymentData);
```

### Using Hooks

```typescript
import { useInvoice, useInvoiceList, useInvoiceStatus } from '@/modules/invoicing/hooks';

// Get single invoice
const { invoice, loading, error } = useInvoice(invoiceId);

// Get invoice list
const { invoices, loading, refetch } = useInvoiceList({ status: 'pending' });

// Update invoice status
const { updateStatus } = useInvoiceStatus();
await updateStatus(invoiceId, 'paid');
```

### Using Types

```typescript
import type { Invoice, InvoiceItem, InvoiceStatus } from '@/modules/invoicing/types';

const invoice: Invoice = {
  id: 1,
  invoiceNumber: 'INV-2024-001',
  customerId: 1,
  status: 'draft',
  items: [...],
  subtotal: 1000,
  tax: 150,
  total: 1150,
  dueDate: '2024-12-31',
  createdAt: new Date(),
};
```

## Module Structure

```
invoicing/
├── components/          # React components
│   ├── InvoiceList.tsx         # List of invoices
│   ├── InvoiceForm.tsx         # Create/edit invoice form
│   ├── InvoiceDetail.tsx       # Invoice detail view
│   ├── InvoicePreview.tsx      # Invoice preview/PDF view
│   ├── InvoiceStatus.tsx       # Invoice status badge/indicator
│   ├── InvoiceItems.tsx        # Invoice items table
│   ├── InvoiceActions.tsx      # Invoice action buttons (send, pay, etc.)
│   ├── RecurringInvoice.tsx    # Recurring invoice setup
│   └── index.ts                # Component exports
│
├── services/            # API services and business logic
│   ├── invoiceService.ts       # Invoice CRUD operations
│   ├── invoicePdfService.ts    # PDF generation
│   ├── invoiceEmailService.ts  # Email sending
│   ├── invoicePaymentService.ts # Payment processing
│   └── index.ts                # Service exports
│
├── types/               # TypeScript types/interfaces
│   ├── invoice.types.ts        # Invoice, InvoiceItem types
│   ├── invoice-status.types.ts # Invoice status enums
│   ├── invoice-template.types.ts # Invoice template types
│   └── index.ts                # Type exports
│
├── hooks/               # Custom React hooks
│   ├── useInvoice.ts           # Single invoice hook
│   ├── useInvoiceList.ts       # Invoice list hook
│   ├── useInvoiceForm.ts       # Invoice form hook
│   ├── useInvoiceStatus.ts     # Invoice status hook
│   └── index.ts                # Hook exports
│
├── utils/               # Module utilities
│   ├── invoiceCalculations.ts  # Tax, total calculations
│   ├── invoiceNumbering.ts     # Invoice number generation
│   ├── invoiceFormatters.ts    # Formatting utilities
│   └── invoiceValidators.ts    # Validation utilities
│
├── constants/           # Module constants
│   ├── invoiceStatus.ts        # Invoice status constants
│   ├── invoiceTypes.ts         # Invoice type constants
│   └── index.ts                # Constant exports
│
├── config/              # Configuration files
│   ├── routes.ts               # Route definitions
│   ├── permissions.ts          # Permission definitions
│   └── invoiceTemplates.ts     # Invoice templates
│
├── dependencies.ts      # Module dependencies
└── index.ts             # Main export file
```

## Invoice Status Flow

```
draft → sent → viewed → paid
            ↓
         overdue
            ↓
         cancelled
```

## Invoice Statuses

- `draft` - Invoice is being created/edited
- `sent` - Invoice has been sent to customer
- `viewed` - Customer has viewed the invoice
- `paid` - Invoice has been paid
- `overdue` - Invoice is past due date
- `cancelled` - Invoice has been cancelled
- `refunded` - Invoice has been refunded

## Integration with Other Modules

### Accounting Module
- Creates journal entries for invoices
- Links to chart of accounts
- Generates financial reports

### Inventory Module (Optional)
- Pulls product information for invoice items
- Updates stock when invoice is paid
- Links to product catalog

### CRM Module (Optional)
- Links invoices to customer records
- Tracks customer payment history
- Generates customer statements

## API Endpoints

- `GET /api/modules/invoicing/invoices` - List invoices
- `GET /api/modules/invoicing/invoices/:id` - Get invoice
- `POST /api/modules/invoicing/invoices` - Create invoice
- `PUT /api/modules/invoicing/invoices/:id` - Update invoice
- `DELETE /api/modules/invoicing/invoices/:id` - Delete invoice
- `POST /api/modules/invoicing/invoices/:id/send` - Send invoice
- `POST /api/modules/invoicing/invoices/:id/pay` - Mark as paid
- `GET /api/modules/invoicing/invoices/:id/pdf` - Generate PDF

## Permissions

- `invoicing.view` - View invoices
- `invoicing.create` - Create invoices
- `invoicing.edit` - Edit invoices
- `invoicing.delete` - Delete invoices
- `invoicing.send` - Send invoices
- `invoicing.approve` - Approve invoices
- `invoicing.export` - Export invoices

## Future Enhancements

- [ ] Multi-language invoice templates
- [ ] Advanced payment gateway integration
- [ ] Automated payment reminders
- [ ] Invoice discount/coupon system
- [ ] Partial payment support
- [ ] Invoice aging reports
- [ ] Batch invoice operations
- [ ] Invoice approval workflow

