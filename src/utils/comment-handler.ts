/**
 * Extract leading comments from a block of code before imports
 */
export function extractLeadingComments(text: string, importStart: number): string {
  if (importStart === 0) return '';
  
  const beforeImport = text.slice(0, importStart);
  const lines = beforeImport.split('\n');
  
  const commentLines: string[] = [];
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (trimmed === '' || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.endsWith('*/')) {
      commentLines.unshift(line);
    } else {
      break;
    }
  }
  
  return commentLines.join('\n');
}

/**
 * Extract inline trailing comment from an import line
 */
export function extractTrailingComment(importLine: string): { import: string; comment: string } {
  const match = importLine.match(/^(.+?)(\s*\/\/.*)$/);
  if (match) {
    return {
      import: match[1].trimEnd(),
      comment: match[2]
    };
  }
  return {
    import: importLine,
    comment: ''
  };
}

/**
 * Check if code block has leading comments that should be preserved
 */
export function hasLeadingFileComments(code: string): boolean {
  const trimmed = code.trim();
  return trimmed.startsWith('//') || trimmed.startsWith('/*');
}

/**
 * Preserve top-level file comments (before any imports)
 */
export function separateTopComments(code: string): { comments: string; rest: string } {
  const lines = code.split('\n');
  const commentLines: string[] = [];
  let foundNonComment = false;
  let restStartIdx = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (!foundNonComment) {
      if (trimmed === '' || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.includes('*/')) {
        commentLines.push(line);
      } else if (trimmed.startsWith('import ')) {
        foundNonComment = true;
        restStartIdx = i;
        break;
      } else if (trimmed !== '') {
        foundNonComment = true;
        restStartIdx = i;
        break;
      }
    }
  }
  
  return {
    comments: commentLines.join('\n'),
    rest: lines.slice(restStartIdx).join('\n')
  };
}

