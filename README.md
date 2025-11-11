# prettier-plugin-svelte-isort

A Prettier plugin **dedicated to sorting imports in Svelte files**. This plugin was built from the ground up specifically for Svelte, providing reliable and clean import sorting for both `<script>` and `<script context="module">` blocks.

## Why This Plugin?

While there are other import sorting plugins available, they often have issues with Svelte files:
- Over-complicated logic as they handle for other frameworks leading to formatting issues
- Incorrect handling of `<script context="module">` blocks

This plugin focuses **exclusively on Svelte** to provide the best possible experience.

## Features

✅ **Svelte-First Design** - Built specifically for Svelte files  
✅ **Module Context Support** - Properly handles both `<script>` and `<script context="module">`  
✅ **Comment Preservation** - Keeps your import comments intact  
✅ **TypeScript Support** - Works with TypeScript in Svelte files  
✅ **Configurable Grouping** - Define custom import order with regex patterns  
✅ **Specifier Sorting** - Optionally sort named imports alphabetically  
✅ **Clean Output** - No extra newlines or formatting issues

## Installation

```bash
# Using npm
npm install -D prettier-plugin-svelte-isort prettier-plugin-svelte

# Using yarn
yarn add -D prettier-plugin-svelte-isort prettier-plugin-svelte

# Using pnpm
pnpm add -D prettier-plugin-svelte-isort prettier-plugin-svelte
```

**Note:** This plugin requires `prettier-plugin-svelte` as a peer dependency.

**Important:** Make sure `prettier-plugin-svelte` is listed **before** `prettier-plugin-svelte-isort` in the `plugins` array, as this plugin extends the Svelte parser.

Read the [installation doc](./INSTALLATION.md) for detailed configuration options.

## Configuration

Add the plugin to your `.prettierrc`:

### JSON Configuration (`.prettierrc`)

```json
{
  "plugins": ["prettier-plugin-svelte", "prettier-plugin-svelte-isort"],
  "importOrder": [
    "^svelte",
    "^@sveltejs/(.*)$",
    "^[a-z]",
    "^@core/(.*)$",
    "^@ui/(.*)$",
    "^[./]"
  ],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true,
  "overrides": [
    {
      "files": "*.svelte",
      "options": {
        "parser": "svelte"
      }
    }
  ]
}
```

Check [Editor settings](./INSTALLATION.md) to configure your IDE (VSCode, Cursor, Sublime Text)

## Configuration Options

### `importOrder` (array of strings)

The `importOrder` array uses regex patterns to group imports:

| Pattern | Matches | Example |
|---------|---------|---------|
| `^svelte` | Svelte core | `import { onMount } from 'svelte'` |
| `^@sveltejs/` | SvelteKit | `import { page } from '@sveltejs/kit'` |
| `^[a-z]` | npm packages | `import axios from 'axios'` |
| `^@/` | Absolute imports | `import { utils } from '@/lib/utils'` |
| `^[./]` | Relative imports | `import './styles.css'` |


**Default:** `['^[./]']` (all imports)

**Example:**
```json
{
  "importOrder": [
    "^svelte",           // Svelte core imports
    "^@sveltejs/",       // SvelteKit imports
    "^[a-z]",            // Third-party packages
    "^@/",               // Absolute imports with @
    "^[./]"              // Relative imports
  ]
}
```

### `importOrderSeparation` (boolean)

Add blank lines between import groups.

**Default:** `false`

**Example:**
```typescript
// With importOrderSeparation: true
import { onMount } from 'svelte';

import axios from 'axios';

import { Button } from '@ui/button';

import Component from './Component.svelte';

// With importOrderSeparation: false
import { onMount } from 'svelte';
import axios from 'axios';
import { Button } from '@ui/button';
import Component from './Component.svelte';
```

### `importOrderCaseInsensitive` (boolean)

Sort imports case-insensitively.

**Default:** `false`

### `importOrderSortSpecifiers` (boolean)

Sort named imports alphabetically within curly braces.

**Default:** `false`

**Example:**
```typescript
// Before
import { z, a, m, b } from 'somewhere';

// After (with importOrderSortSpecifiers: true)
import { a, b, m, z } from 'somewhere';
```

### `importOrderGroupNamespaceSpecifiers` (boolean)

Group namespace imports (`import * as`) at the top of their group.

**Default:** `false`

### `importOrderParserPlugins` (array of strings)

Parser plugins for special syntax (e.g., TypeScript, JSX).

**Default:** `['typescript', 'jsx']`

### `importOrderExclude` (array of strings)

File patterns to exclude from import sorting.

**Default:** `[]`

**Example:**
```json
{
  "importOrderExclude": ["**/generated/**", "**/*.spec.svelte"]
}
```

## Usage Examples

### Basic Example

**Before:**
```svelte
<script>
  import Component from './Component.svelte';
  import { writable } from 'svelte/store';
  import axios from 'axios';
  import { onMount } from 'svelte';
  import { Button } from '@ui/button';
</script>
```

**After:**
```svelte
<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  import axios from 'axios';

  import { Button } from '@ui/button';

  import Component from './Component.svelte';
</script>
```

### With Module Context

**Before:**
```svelte
<script context="module">
  import { browser } from '$app/environment';
  import axios from 'axios';
  import { API_URL } from '@core/constants';
</script>

<script>
  import Header from './Header.svelte';
  import { onMount } from 'svelte';
  import { Button } from '@ui/components';
</script>
```

**After:**
```svelte
<script context="module">
  import axios from 'axios';

  import { API_URL } from '@core/constants';
  
  import { browser } from '$app/environment';
</script>

<script>
  import { onMount } from 'svelte';

  import { Button } from '@ui/components';

  import Header from './Header.svelte';
</script>
```

### TypeScript Support

```svelte
<script lang="ts">
  import type { PageData } from './$types';
  import { onMount } from 'svelte';
  import type { Writable } from 'svelte/store';
  import { writable } from 'svelte/store';
  
  // Types and values are sorted together
</script>
```

## Running Prettier

```bash
# Format all Svelte files
npx prettier --write "**/*.svelte"

# Format specific file
npx prettier --write src/App.svelte

# Check formatting without writing
npx prettier --check "**/*.svelte"
```

## Troubleshooting

### Plugin not found error

Make sure you've installed both this plugin and `prettier-plugin-svelte`:

```bash
npm install -D prettier-plugin-svelte-sort-imports prettier-plugin-svelte
```

### Imports not being sorted

1. Check that your `.prettierrc` includes the plugin
2. Verify that you have the `parser: "svelte"` override for `.svelte` files
3. Make sure you've built the plugin: `npm run build`

### Formatting issues with comments

This plugin tries to preserve comments, but if you encounter issues, please report them with a minimal reproduction example.

## Development

```bash
# Install dependencies
npm install

# Build the plugin
npm run build

# Test with examples
npm test

# Format the source code
npm run format
```

## Contribution Guidelines

1. Focus on Svelte use cases
2. Keep dependencies minimal
3. Prioritize simplicity over features
4. Maintain backward compatibility
5. Add examples for new features

## License

MIT - See LICENSE file

## Credits

- Inspired by [@trivago/prettier-plugin-sort-imports](https://github.com/trivago/prettier-plugin-sort-imports)
- Built with ❤️ by [@raviojhax](https://x.com/raviojhax) for Svelte community

## Contact

For issues, questions, or contributions, please open an issue on GitHub.
