/**
 * Modules Index
 * 
 * Central registry for all Yantras modules
 * Each module is lazy-loaded to optimize bundle size
 */

import type { ModuleRegistry } from '@/types/module.types';

/**
 * Module Registry
 * 
 * Register all modules here. They are lazy-loaded to reduce initial bundle size.
 */
export const modules: ModuleRegistry = {
  // Example modules (uncomment when created):
  // 'accounting': () => import('./accounting'),
  // 'inventory': () => import('./inventory'),
  // 'point-of-sale': () => import('./point-of-sale'),
  // 'crm': () => import('./crm'),
  // 'hr': () => import('./hr'),
  // 'invoicing': () => import('./invoicing'),
};

/**
 * Get a module by name
 */
export async function getModule(moduleName: string) {
  const moduleLoader = modules[moduleName];
  if (!moduleLoader) {
    throw new Error(`Module "${moduleName}" not found`);
  }
  return await moduleLoader();
}

/**
 * Get all registered module names
 */
export function getModuleNames(): string[] {
  return Object.keys(modules);
}

/**
 * Check if a module exists
 */
export function hasModule(moduleName: string): boolean {
  return moduleName in modules;
}

