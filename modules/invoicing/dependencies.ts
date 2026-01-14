/**
 * Invoicing Module Dependencies
 * 
 * Declares which modules this module depends on
 */

export const dependencies = {
  required: ['accounting'],  // Required for journal entries and financial records
  optional: ['inventory'],   // Optional for product-based invoices
};

export default dependencies;

