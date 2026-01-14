# Accounting Module

Accounting and Finance management module.

## Features

- Invoice Management
- Journal Entries
- Chart of Accounts
- Financial Reports
- Payment Processing

## Dependencies

- None (base module)

## Usage

```typescript
import { InvoiceList, createInvoice } from '@/modules/accounting';

// Use components
<InvoiceList />

// Use services
const invoice = await createInvoice(data);
```

## Structure

```
accounting/
├── components/      # InvoiceList, InvoiceForm, JournalEntry, etc.
├── services/        # invoiceService, journalService, etc.
├── types/           # Invoice, JournalEntry types
├── hooks/           # useInvoice, useJournal hooks
├── utils/           # Accounting calculations, formatters
├── constants/       # Account types, invoice statuses
├── config/          # Routes, permissions
├── dependencies.ts  # Module dependencies
└── index.ts         # Main exports
```

