import type { ParserOptions } from 'prettier';

export interface SortImportsOptions extends Partial<ParserOptions> {
  // Import order patterns (regex strings)
  importOrder?: string[];
  
  // Add blank lines between import groups
  importOrderSeparation?: boolean;
  
  // Sort imports within each group case-insensitively
  importOrderCaseInsensitive?: boolean;
  
  // Sort specifiers within imports (e.g., {b, a} -> {a, b})
  importOrderSortSpecifiers?: boolean;
  
  // Group namespace imports (import * as) at the top
  importOrderGroupNamespaceSpecifiers?: boolean;
  
  // Parser plugins for special syntax
  importOrderParserPlugins?: string[];
  
  // Path patterns to exclude from sorting
  importOrderExclude?: string[];
  
  // Current file path
  filepath?: string;
}

export interface ImportNode {
  start: number;
  end: number;
  text: string;
  order: number;
  isTypeImport: boolean;
  hasSpecifiers: boolean;
  leadingComments: string;
  trailingComments: string;
}

export interface ScriptBlock {
  content: string;
  start: number;
  end: number;
  type: 'instance' | 'module';
  attributes: string;
}

export interface SortedResult {
  code: string;
  changed: boolean;
}

