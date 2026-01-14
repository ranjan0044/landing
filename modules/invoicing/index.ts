/**
 * Invoicing Module
 * 
 * Main export file for the invoicing module
 */

// Export components
export * from './components';

// Export services
export * from './services';

// Export types
export * from './types';

// Export hooks
export * from './hooks';

// Export utils
export * from './utils';

// Export constants
export * from './constants';

// Export config
export * from './config';

// Export dependencies
export { default as dependencies } from './dependencies';

// Module configuration
export const moduleConfig = {
  name: 'invoicing',
  displayName: 'Invoicing',
  version: '1.0.0',
  description: 'Invoice creation, management, and billing system',
  dependencies: {
    required: ['accounting'],
    optional: ['inventory'],
  },
};

