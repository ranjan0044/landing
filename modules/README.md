# Yantras Modules

This directory contains all Yantras modules/products.

## Module Structure

Each module follows this structure:
- `components/` - React components
- `services/` - API services and business logic
- `types/` - TypeScript types/interfaces
- `hooks/` - Custom React hooks
- `utils/` - Module utilities
- `constants/` - Module constants
- `config/` - Configuration files
- `dependencies.ts` - Module dependencies
- `index.ts` - Main export file

## Available Modules

- `accounting/` - Accounting and Finance
- `inventory/` - Inventory Management
- `point-of-sale/` - Point of Sale System
- `invoicing/` - Invoicing and Billing Management
- `crm/` - Customer Relationship Management
- `hr/` - Human Resources
- ... (more modules)

## Creating a New Module

1. Create a new folder: `modules/your-module-name/`
2. Follow the standard module structure
3. Define dependencies in `dependencies.ts`
4. Export from `index.ts`
5. Register in `modules/index.ts`

See MODULE_STRUCTURE.md for detailed guidelines.

