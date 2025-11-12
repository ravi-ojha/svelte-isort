# Installation Guide

## Prerequisites

- Node.js >= 18
- npm, yarn, or pnpm
- Prettier >= 3.x
- A Svelte project

## Step 1: Install Dependencies

Choose your package manager:

### NPM
```bash
npm install -D prettier prettier-plugin-svelte prettier-plugin-svelte-isort
```

### Yarn
```bash
yarn add -D prettier prettier-plugin-svelte prettier-plugin-svelte-isort
```

### PNPM
```bash
pnpm add -D prettier prettier-plugin-svelte prettier-plugin-svelte-isort
```

## Step 2: Configure Prettier

Create or update `.prettierrc` in your project root:

```json
{
  "plugins": ["prettier-plugin-svelte", "prettier-plugin-svelte-isort"],
  "importOrder": [
    "^svelte(/|$)",
    "^@sveltejs/",
    "^[a-z]",
    "^@/",
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

**Important:** Make sure to include `prettier-plugin-svelte` **before** `prettier-plugin-svelte-sort-imports` in the plugins array.

### Import Order Patterns

The `importOrder` array uses regex patterns to group imports:

| Pattern | Matches | Example |
|---------|---------|---------|
| `^svelte(/|$)` | Svelte core | `import { onMount } from 'svelte'` |
| `^@sveltejs/` | SvelteKit | `import { page } from '@sveltejs/kit'` |
| `^[a-z]` | npm packages | `import axios from 'axios'` |
| `^\\$app` | $app imports | `import { utils } from '$app/state'` |
| `^\\$lib` | $lib imports | `import { utils } from '$lib/components'` |
| `^[./]` | Relative imports | `import './styles.css'` |


### SvelteKit Project

```json
{
  "importOrder": [
    "^svelte(/|$)",
    "^@sveltejs/",
    "^[a-z]",
    "^\\$app/",
    "^\\$lib/",
    "^[./]"
  ]
}
```

### Monorepo with Workspace Packages

```json
{
  "importOrder": [
    "^svelte(/|$)",
    "^@sveltejs/",
    "^@workspace/",
    "^@/",
    "^[a-z]",
    "^[./]"
  ]
}
```

### `importOrderSeparation`

Add blank lines between groups (default: `false`)

### `importOrderSortSpecifiers`

Sort named imports (default: `false`)
```typescript
// Before
import { z, a } from 'lib';
// After
import { a, z } from 'lib';
```

### `importOrderCaseInsensitive`

Case-insensitive sorting (default: `false`)


### Separate Type Imports

To keep type imports separate, configure your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "verbatimModuleSyntax": true
  }
}
```

Then your imports will be:

```typescript
import type { User } from './types';
import { getUser } from './api';
```

## Step 3: Add Scripts to package.json

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.svelte\"",
    "format:check": "prettier --check \"src/**/*.svelte\""
  }
}
```

## Step 4: Test It

Run the formatter on your Svelte files:

```bash
npm run format
```

Your imports should now be sorted! 🎉

## Step 5 (Optional): Editor Integration

### VS Code

1. Install the [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

2. Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[svelte]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### WebStorm/IntelliJ IDEA

1. Go to **Settings** → **Languages & Frameworks** → **JavaScript** → **Prettier**
2. Set **Prettier package**: `<project>/node_modules/prettier`
3. Check:
   - ✅ **On save**
   - ✅ **On code reformat**
4. Set **Run for files**: `{**/*,*}.{svelte,js,ts}`

### Neovim

Using `null-ls.nvim`:

```lua
local null_ls = require("null-ls")

null_ls.setup({
  sources = {
    null_ls.builtins.formatting.prettier.with({
      filetypes = { "svelte", "typescript", "javascript" },
    }),
  },
})
```

### Sublime Text

1. Install [JsPrettier](https://packagecontrol.io/packages/JsPrettier) via Package Control
2. Configure in **Preferences** → **Package Settings** → **JsPrettier** → **Settings - User**:

```json
{
  "auto_format_on_save": true,
  "prettier_cli_path": "node_modules/.bin/prettier"
}
```

## Troubleshooting

### "Cannot find module 'prettier-plugin-svelte'" 

Make sure you've installed both plugins:
```bash
npm install -D prettier-plugin-svelte prettier-plugin-svelte-sort-imports
```

### Imports not being sorted

1. Check your `.prettierrc` has both plugins in the correct order
2. Verify the `overrides` section includes `*.svelte` files
3. Try clearing Prettier cache: `rm -rf node_modules/.cache`

### Plugin conflicts

If you have other Prettier plugins that also modify imports, you may need to disable them for Svelte files or configure their interaction.

### "Parser 'svelte' not found"

This means `prettier-plugin-svelte` isn't loaded. Check:
1. It's installed: `npm list prettier-plugin-svelte`
2. It's in the plugins array in `.prettierrc`
3. Your Prettier version is compatible (3.x)

## Verification

To verify the plugin is working:

1. Create a test file `test.svelte`:

```svelte
<script>
  import Component from './Component.svelte';
  import { onMount } from 'svelte';
  import axios from 'axios';
</script>
```

2. Run Prettier:

```bash
npx prettier --write test.svelte
```

3. The imports should be reordered:

```svelte
<script>
  import { onMount } from 'svelte';

  import axios from 'axios';

  import Component from './Component.svelte';
</script>
```

## Next Steps

- Read the [README](./README.md) for configuration options
- Check [QUICKSTART.md](./QUICKSTART.md) for common patterns
- See [examples/](./examples/) for more examples

## Getting Help

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Read the [README](./README.md) documentation
3. Search existing GitHub issues
4. Open a new issue with a minimal reproduction

Happy formatting! 🚀

