# Yantras Module Structure Guide

This document outlines the recommended folder structure for organizing modules/products in the Yantras platform, similar to Odoo's modular architecture.

## Recommended Folder Structure

```
yantras/
├── app/                          # Next.js App Router (Frontend Routes)
│   ├── (auth)/                  # Authentication routes
│   ├── (dashboard)/             # Dashboard routes
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── modules/             # Module-specific routes
│   │       ├── accounting/
│   │       ├── inventory/
│   │       ├── point-of-sale/
│   │       └── ...
│   ├── api/                     # API Routes
│   │   └── modules/             # Module-specific API endpoints
│   │       ├── accounting/
│   │       ├── inventory/
│   │       └── ...
│   └── ...
│
├── modules/                      # 📦 MODULES FOLDER (Main Module Directory)
│   │
│   ├── core/                    # Core/Base module (if needed)
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   │
│   ├── accounting/              # Accounting Module
│   │   ├── components/          # Module-specific components
│   │   │   ├── InvoiceList.tsx
│   │   │   ├── InvoiceForm.tsx
│   │   │   ├── JournalEntry.tsx
│   │   │   └── index.ts
│   │   ├── services/            # API services, business logic
│   │   │   ├── invoiceService.ts
│   │   │   ├── journalService.ts
│   │   │   └── index.ts
│   │   ├── types/               # TypeScript types/interfaces
│   │   │   ├── invoice.types.ts
│   │   │   ├── journal.types.ts
│   │   │   └── index.ts
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useInvoice.ts
│   │   │   └── index.ts
│   │   ├── utils/               # Module utilities
│   │   │   ├── calculations.ts
│   │   │   └── formatters.ts
│   │   ├── constants/           # Module constants
│   │   │   └── index.ts
│   │   ├── config/              # Module configuration
│   │   │   ├── routes.ts        # Route definitions
│   │   │   └── permissions.ts
│   │   ├── dependencies.ts      # Module dependencies (which modules it depends on)
│   │   └── index.ts             # Main export file
│   │
│   ├── inventory/               # Inventory Module
│   │   ├── components/
│   │   │   ├── StockLevel.tsx
│   │   │   ├── WarehouseList.tsx
│   │   │   ├── ProductMovement.tsx
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── stockService.ts
│   │   │   ├── warehouseService.ts
│   │   │   └── index.ts
│   │   ├── types/
│   │   │   ├── stock.types.ts
│   │   │   ├── warehouse.types.ts
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useStock.ts
│   │   │   └── index.ts
│   │   ├── utils/
│   │   ├── constants/
│   │   ├── config/
│   │   ├── dependencies.ts      # e.g., depends on: ['accounting']
│   │   └── index.ts
│   │
│   ├── point-of-sale/           # Point of Sale Module
│   │   ├── components/
│   │   │   ├── POSInterface.tsx
│   │   │   ├── Cart.tsx
│   │   │   ├── Payment.tsx
│   │   │   └── index.ts
│   │   ├── services/
│   │   ├── types/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── constants/
│   │   ├── config/
│   │   ├── dependencies.ts      # e.g., depends on: ['inventory', 'accounting']
│   │   └── index.ts
│   │
│   ├── crm/                     # CRM Module
│   │   └── ... (same structure)
│   │
│   ├── hr/                      # HR Module
│   │   └── ... (same structure)
│   │
│   └── index.ts                 # Export all modules
│
├── lib/                         # Shared utilities and helpers
│   ├── api/                     # API client, interceptors
│   ├── auth/                    # Authentication utilities
│   ├── database/                # Database utilities (if using)
│   └── utils/                   # General utilities
│
├── components/                  # Shared/Global components
│   ├── ui/                      # UI components (already exists)
│   ├── layouts/                 # Layout components
│   └── sections/                # Landing page sections (already exists)
│
├── types/                       # Global TypeScript types
│   ├── module.types.ts          # Module system types
│   ├── api.types.ts
│   └── index.ts
│
└── public/                      # Static assets
```

## Module Structure Details

Each module should follow this structure:

```
module-name/
├── components/          # React components specific to this module
├── services/            # API calls, business logic
├── types/               # TypeScript interfaces/types
├── hooks/               # Custom React hooks
├── utils/               # Module-specific utilities
├── constants/           # Module constants
├── config/              # Configuration files (routes, permissions, etc.)
├── dependencies.ts      # Declares which other modules this depends on
└── index.ts             # Main export file
```

## Module Linking/Integration

Modules can link to each other through:

1. **Dependencies Declaration** (`dependencies.ts`):
   ```typescript
   // modules/inventory/dependencies.ts
   export const dependencies = ['accounting'];
   ```

2. **Shared Types/Interfaces**:
   ```typescript
   // modules/inventory/types/stock.types.ts
   import { Invoice } from '@/modules/accounting/types';
   
   export interface StockMovement {
     invoice?: Invoice;
     // ...
   }
   ```

3. **Service Integration**:
   ```typescript
   // modules/point-of-sale/services/orderService.ts
   import { createInvoice } from '@/modules/accounting/services/invoiceService';
   import { updateStock } from '@/modules/inventory/services/stockService';
   ```

4. **Component Integration**:
   ```typescript
   // modules/point-of-sale/components/OrderForm.tsx
   import { InvoiceList } from '@/modules/accounting/components';
   import { StockLevel } from '@/modules/inventory/components';
   ```

## Module Registration

Create a module registry system:

```typescript
// modules/index.ts
export const modules = {
  accounting: () => import('./accounting'),
  inventory: () => import('./inventory'),
  'point-of-sale': () => import('./point-of-sale'),
  // ...
};
```

## Example: Creating a New Module

1. Create folder: `modules/your-module-name/`
2. Create subfolders: `components/`, `services/`, `types/`, etc.
3. Create `dependencies.ts` to declare dependencies
4. Create `index.ts` to export module
5. Register module in `modules/index.ts`
6. Create routes in `app/(dashboard)/modules/your-module-name/`
7. Create API routes in `app/api/modules/your-module-name/`

## Benefits of This Structure

✅ **Modularity**: Each module is self-contained
✅ **Scalability**: Easy to add new modules
✅ **Maintainability**: Clear separation of concerns
✅ **Reusability**: Modules can share components/services
✅ **Dependency Management**: Clear dependency declarations
✅ **Type Safety**: TypeScript types per module
✅ **Testability**: Easy to test modules independently

## Next Steps

1. Create the `modules/` folder
2. Set up a base module structure template
3. Create module registry system
4. Create dependency resolution system
5. Set up module routing system
