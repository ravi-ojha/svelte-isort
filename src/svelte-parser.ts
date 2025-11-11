import type { SortImportsOptions, ScriptBlock } from './types.js';
import { sortImports } from './sort-imports.js';

/**
 * Extract script blocks from Svelte file
 * Handles both <script> and <script context="module">
 */
export function extractScriptBlocks(code: string): ScriptBlock[] {
  const blocks: ScriptBlock[] = [];
  
  // Match all script tags
  const scriptRegex = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
  let match;
  
  while ((match = scriptRegex.exec(code)) !== null) {
    const attributes = match[1] || '';
    const content = match[2] || '';
    const start = match.index + match[0].indexOf('>') + 1;
    const end = start + content.length;
    
    // Determine if it's module or instance context
    const isModule = /context\s*=\s*["']module["']/i.test(attributes);
    
    blocks.push({
      content,
      start,
      end,
      type: isModule ? 'module' : 'instance',
      attributes: attributes.trim(),
    });
  }
  
  return blocks;
}

/**
 * Process a Svelte file and sort imports in all script blocks
 */
export function processSvelteFile(code: string, options: SortImportsOptions): string {
  const blocks = extractScriptBlocks(code);
  
  if (blocks.length === 0) {
    return code;
  }
  
  // Sort blocks from last to first to maintain correct string indices
  blocks.sort((a, b) => b.start - a.start);
  
  let result = code;
  
  for (const block of blocks) {
    const originalContent = block.content;
    const sortedContent = sortImports(originalContent, options);
    
    // Only replace if content changed
    if (sortedContent !== originalContent) {
      // Preserve indentation - check if content starts with newline
      let processedContent = sortedContent;
      
      // Match indentation style of original content
      const firstLineMatch = originalContent.match(/^(\s*)/);
      const lastLineMatch = originalContent.match(/(\s*)$/);
      
      if (firstLineMatch && firstLineMatch[1]) {
        // Original starts with whitespace/newline
        if (originalContent.startsWith('\n')) {
          processedContent = '\n' + processedContent;
        }
      }
      
      if (lastLineMatch && lastLineMatch[1]) {
        // Original ends with whitespace/newline
        if (originalContent.endsWith('\n')) {
          processedContent = processedContent + '\n';
        }
      }
      
      // Replace content in the result
      result = result.slice(0, block.start) + processedContent + result.slice(block.end);
    }
  }
  
  return result;
}

/**
 * Check if a file is a Svelte file
 */
export function isSvelteFile(filepath?: string): boolean {
  return filepath?.endsWith('.svelte') ?? false;
}

