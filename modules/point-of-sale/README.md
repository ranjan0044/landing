# Point of Sale (POS) Module

Point of Sale system for retail and restaurants.

## Features

- POS Interface
- Cart Management
- Payment Processing
- Receipt Printing
- Sales Reports

## Dependencies

- `inventory` (required) - For stock management
- `accounting` (required) - For invoice generation

## Usage

```typescript
import { POSInterface, processPayment } from '@/modules/point-of-sale';

// Use components
<POSInterface />

// Use services
const receipt = await processPayment(cartData, paymentMethod);
```

## Structure

```
point-of-sale/
├── components/      # POSInterface, Cart, Payment, Receipt, etc.
├── services/        # orderService, paymentService, etc.
├── types/           # Order, Payment, Cart types
├── hooks/           # useCart, usePayment hooks
├── utils/           # Price calculations, tax calculations
├── constants/       # Payment methods, order statuses
├── config/          # Routes, permissions
├── dependencies.ts  # Module dependencies
└── index.ts         # Main exports
```

