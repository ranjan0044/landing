/**
 * Module System Types
 * 
 * Types for the modular architecture system
 */

export interface ModuleDependencies {
  required?: string[];
  optional?: string[];
}

export interface ModuleConfig {
  name: string;
  displayName: string;
  version: string;
  description?: string;
  dependencies?: ModuleDependencies;
  routes?: ModuleRoute[];
  permissions?: ModulePermission[];
}

export interface ModuleRoute {
  path: string;
  component: string;
  label: string;
  icon?: string;
  permissions?: string[];
}

export interface ModulePermission {
  id: string;
  name: string;
  description?: string;
}

export interface ModuleExport {
  components?: Record<string, any>;
  services?: Record<string, any>;
  types?: Record<string, any>;
  hooks?: Record<string, any>;
  utils?: Record<string, any>;
  config: ModuleConfig;
}

/**
 * Module Registry Type
 */
export type ModuleRegistry = Record<string, () => Promise<ModuleExport>>;

