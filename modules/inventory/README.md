# Inventory Module

Inventory and Warehouse Management module.

## Features

- Stock Management
- Warehouse Management
- Product Movements
- Stock Valuation
- Inventory Reports

## Dependencies

- `accounting` (optional) - For inventory valuation and accounting integration

## Usage

```typescript
import { StockLevel, updateStock } from '@/modules/inventory';

// Use components
<StockLevel productId={123} />

// Use services
await updateStock(productId, quantity, movementType);
```

## Structure

```
inventory/
├── components/      # StockLevel, WarehouseList, ProductMovement, etc.
├── services/        # stockService, warehouseService, etc.
├── types/           # Stock, Warehouse, Movement types
├── hooks/           # useStock, useWarehouse hooks
├── utils/           # Stock calculations, validations
├── constants/       # Movement types, stock statuses
├── config/          # Routes, permissions
├── dependencies.ts  # Module dependencies
└── index.ts         # Main exports
```

