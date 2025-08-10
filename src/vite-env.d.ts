/**
 * vite-env.d.ts - Vite Environment Type Declarations
 * 
 * This file provides TypeScript type definitions for Vite-specific features and
 * environment variables used in the Goalify application. It enables TypeScript
 * to understand Vite's built-in features and provides IntelliSense support.
 * 
 * Key Features:
 * - Enables TypeScript support for Vite's import.meta.env variables
 * - Provides type safety for environment variables
 * - Enables IntelliSense for Vite-specific features
 * - Required for proper TypeScript compilation with Vite
 */

/**
 * Vite Client Type Reference
 * 
 * This triple-slash directive tells TypeScript to include Vite's client type
 * definitions, which provide type information for:
 * - import.meta.env (environment variables)
 * - import.meta.glob (glob imports)
 * - Hot Module Replacement (HMR) APIs
 * - Other Vite-specific features
 */
/// <reference types="vite/client" />

/**
 * Environment Variable Type Definitions
 * 
 * These interfaces extend the default ImportMetaEnv to provide type safety
 * for custom environment variables used in the application.
 */
interface ImportMetaEnv {
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
  readonly VITE_API_URL?: string;
  readonly VITE_APP_TITLE?: string;
  readonly VITE_APP_VERSION?: string;
}

/**
 * ImportMeta Interface Extension
 * 
 * Extends the default ImportMeta interface to include our custom environment
 * variable definitions.
 */
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * Static Asset Import Types
 * These enable TypeScript to understand various static asset imports.
 */
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

declare module '*.woff' {
  const content: string;
  export default content;
}

declare module '*.woff2' {
  const content: string;
  export default content;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.json' {
  const value: Record<string, unknown>;
  export default value;
}
