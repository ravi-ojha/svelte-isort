import type { SortImportsOptions, ImportNode } from './types.js';
import {
  matchImportOrder,
  isTypeImport,
  isSideEffectImport,
  extractImportPath,
  sortImportSpecifiers,
  naturalCompare,
} from './utils/import-matcher.js';
import { separateTopComments } from './utils/comment-handler.js';

/**
 * Parse imports from JavaScript/TypeScript code
 */
export function parseImports(code: string): { imports: ImportNode[]; firstImportStart: number; lastImportEnd: number } {
  const imports: ImportNode[] = [];
  let firstImportStart = -1;
  let lastImportEnd = 0;
  
  // Use regex to find all import statements
  const importRegex = /^\s*import\s+(?:(?:type\s+)?(?:\{[^}]*\}|[\w*]+(?:\s*,\s*\{[^}]*\})?|\*\s+as\s+\w+)\s+from\s+)?['"][^'"]+['"];?/gm;
  let match;
  
  while ((match = importRegex.exec(code)) !== null) {
    const importText = match[0];
    const start = match.index;
    const end = start + importText.length;
    
    if (firstImportStart === -1) {
      firstImportStart = start;
    }
    lastImportEnd = end;
    
    imports.push({
      start,
      end,
      text: importText.trim(),
      order: -1,
      isTypeImport: isTypeImport(importText),
      hasSpecifiers: !isSideEffectImport(importText),
      leadingComments: '',
      trailingComments: '',
    });
  }
  
  return { imports, firstImportStart, lastImportEnd };
}

/**
 * Sort imports according to the import order configuration
 */
export function sortImports(code: string, options: SortImportsOptions): string {
  // Separate top-level comments from the rest
  const { comments, rest } = separateTopComments(code);
  
  // Parse imports
  const { imports, firstImportStart, lastImportEnd } = parseImports(rest);
  
  if (imports.length === 0) {
    return code;
  }
  
  // Get options with defaults
  const importOrder = options.importOrder || ['^[./]'];
  const importOrderSeparation = options.importOrderSeparation ?? false;
  const importOrderCaseInsensitive = options.importOrderCaseInsensitive ?? false;
  const importOrderSortSpecifiers = options.importOrderSortSpecifiers ?? false;
  
  // Assign order to each import based on patterns
  imports.forEach(imp => {
    const path = extractImportPath(imp.text);
    imp.order = matchImportOrder(path, importOrder);
  });
  
  // Sort imports by order, then alphabetically within each group
  imports.sort((a, b) => {
    // First by order group
    if (a.order !== b.order) {
      return a.order - b.order;
    }
    
    // Then by import path
    const pathA = extractImportPath(a.text);
    const pathB = extractImportPath(b.text);
    
    return naturalCompare(pathA, pathB, importOrderCaseInsensitive);
  });
  
  // Sort specifiers within imports if requested
  if (importOrderSortSpecifiers) {
    imports.forEach(imp => {
      imp.text = sortImportSpecifiers(imp.text, importOrderCaseInsensitive);
    });
  }
  
  // Build the sorted import block
  const sortedImports: string[] = [];
  let lastOrder = -1;
  
  imports.forEach(imp => {
    // Add blank line between groups if separation is enabled
    if (importOrderSeparation && lastOrder !== -1 && imp.order !== lastOrder) {
      sortedImports.push('');
    }
    
    sortedImports.push(imp.text);
    lastOrder = imp.order;
  });
  
  // Get the code before and after the imports
  const beforeImports = rest.slice(0, firstImportStart);
  const afterImports = rest.slice(lastImportEnd).trim();
  
  // Reconstruct the code
  const sortedImportBlock = sortedImports.join('\n');
  
  let result = '';
  if (comments.trim()) {
    result += comments + (comments.endsWith('\n') ? '' : '\n');
  }
  result += beforeImports + sortedImportBlock;
  if (afterImports) {
    result += '\n\n' + afterImports;
  }
  
  return result;
}

