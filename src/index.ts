import type { Plugin, Parser } from 'prettier';
import type { SortImportsOptions } from './types.js';
import { processSvelteFile, isSvelteFile } from './svelte-parser.js';

// Import prettier-plugin-svelte dynamically
let sveltePlugin: Plugin | undefined;

try {
  const imported = await import('prettier-plugin-svelte');
  sveltePlugin = (imported.default || imported) as Plugin;
} catch (err) {
  console.warn('prettier-plugin-svelte not found. Svelte formatting will be limited.');
}

/**
 * Preprocess function that sorts imports before prettier formats the file
 */
function preprocessSvelte(code: string, options: any): string {
  // Only process Svelte files
  if (!isSvelteFile(options.filepath)) {
    return code;
  }
  
  // Sort imports in the Svelte file
  const sortedCode = processSvelteFile(code, options as SortImportsOptions);
  
  // If prettier-plugin-svelte is available, use its preprocess too
  if (sveltePlugin?.parsers?.svelte?.preprocess) {
    return sveltePlugin.parsers.svelte.preprocess(sortedCode, options);
  }
  
  return sortedCode;
}

/**
 * Create the Svelte parser with import sorting
 */
function createSvelteParser(): Parser {
  // Create a lazy parser that checks for sveltePlugin at parse time
  const baseSvelteParser = sveltePlugin?.parsers?.svelte;
  
  if (!baseSvelteParser) {
    // Return a minimal parser that will error at runtime if used
    return {
      parse: () => {
        throw new Error(
          'prettier-plugin-svelte is required but not found. Please install it: npm install -D prettier-plugin-svelte'
        );
      },
      astFormat: 'svelte-ast',
      locStart: () => 0,
      locEnd: () => 0,
      preprocess: preprocessSvelte,
    } as Parser;
  }
  
  return {
    ...baseSvelteParser,
    preprocess: preprocessSvelte,
  };
}

/**
 * Plugin options for import sorting
 */
const options: Plugin['options'] = {
  importOrder: {
    type: 'path',
    category: 'Global',
    array: true,
    default: [{ value: [] }],
    description:
      'Provide an order to sort imports. Use regex patterns to match import paths.',
  },
  importOrderSeparation: {
    type: 'boolean',
    category: 'Global',
    default: false,
    description: 'Should imports be separated by blank lines between groups?',
  },
  importOrderCaseInsensitive: {
    type: 'boolean',
    category: 'Global',
    default: false,
    description: 'Should import sorting be case insensitive?',
  },
  importOrderSortSpecifiers: {
    type: 'boolean',
    category: 'Global',
    default: false,
    description: 'Should import specifiers be sorted alphabetically?',
  },
  importOrderGroupNamespaceSpecifiers: {
    type: 'boolean',
    category: 'Global',
    default: false,
    description: 'Should namespace imports (import * as) be grouped at the top?',
  },
  importOrderParserPlugins: {
    type: 'path',
    category: 'Global',
    array: true,
    default: [{ value: ['typescript', 'jsx'] }],
    description: 'Parser plugins for special syntax (e.g., typescript, jsx)',
  },
  importOrderExclude: {
    type: 'path',
    category: 'Global',
    array: true,
    default: [{ value: [] }],
    description: 'File patterns to exclude from import sorting',
  },
};

/**
 * Export the Prettier plugin
 */
const plugin: Plugin = {
  parsers: {
    svelte: createSvelteParser(),
  },
  options,
};

export default plugin;

