/**
 * Match import path against order patterns
 */
export function matchImportOrder(importPath: string, patterns: string[]): number {
  // Check if it matches any pattern
  for (let i = 0; i < patterns.length; i++) {
    const pattern = patterns[i];
    
    // Handle special markers
    if (pattern === '<THIRD_PARTY_MODULES>') {
      // Third party modules don't start with . or /
      if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
        return i;
      }
    } else if (pattern === '<LOCAL_MODULES>') {
      // Local modules start with . or /
      if (importPath.startsWith('.') || importPath.startsWith('/')) {
        return i;
      }
    } else {
      // Try as regex pattern
      try {
        const regex = new RegExp(pattern);
        if (regex.test(importPath)) {
          return i;
        }
      } catch (e) {
        // If regex fails, try literal match
        if (importPath.includes(pattern)) {
          return i;
        }
      }
    }
  }
  
  // If no match, put it in the last group
  return patterns.length;
}

/**
 * Determine if an import is a type-only import
 */
export function isTypeImport(importText: string): boolean {
  return /^\s*import\s+type\s+/i.test(importText);
}

/**
 * Check if import has no specifiers (side-effect import)
 */
export function isSideEffectImport(importText: string): boolean {
  // Matches: import 'module' or import './module'
  return /^\s*import\s+['"][^'"]+['"];?\s*$/i.test(importText);
}

/**
 * Extract the module path from an import statement
 */
export function extractImportPath(importText: string): string {
  // Match various import formats
  const match = importText.match(/from\s+['"]([^'"]+)['"]|import\s+['"]([^'"]+)['"]/i);
  return match ? (match[1] || match[2]) : '';
}

/**
 * Sort import specifiers alphabetically within curly braces
 */
export function sortImportSpecifiers(importText: string, caseInsensitive: boolean = false): string {
  // Match the import specifiers within curly braces
  const match = importText.match(/import\s+(\{[^}]+\})/);
  if (!match) return importText;
  
  const specifiersText = match[1];
  const specifiers = specifiersText
    .slice(1, -1) // Remove { }
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  // Sort specifiers
  specifiers.sort((a, b) => {
    const aClean = a.split(' as ')[0].trim();
    const bClean = b.split(' as ')[0].trim();
    
    if (caseInsensitive) {
      return aClean.toLowerCase().localeCompare(bClean.toLowerCase());
    }
    return aClean.localeCompare(bClean);
  });
  
  const sortedSpecifiers = `{ ${specifiers.join(', ')} }`;
  return importText.replace(/\{[^}]+\}/, sortedSpecifiers);
}

/**
 * Natural sort comparison
 */
export function naturalCompare(a: string, b: string, caseInsensitive: boolean = false): number {
  const aStr = caseInsensitive ? a.toLowerCase() : a;
  const bStr = caseInsensitive ? b.toLowerCase() : b;
  
  return aStr.localeCompare(bStr, undefined, { numeric: true, sensitivity: 'base' });
}

