# Publishing to npm

This guide explains how to publish `prettier-plugin-svelte-isort` to npm.

## Publishing Updates

When publishing a new version:

1. Update the version number in `package.json`:
   ```bash
   # Patch version (1.0.0 -> 1.0.1)
   npm version patch
   
   # Minor version (1.0.0 -> 1.1.0)
   npm version minor
   
   # Major version (1.0.0 -> 2.0.0)
   npm version major
   ```

2. The `npm version` command will:
   - Update `package.json`
   - Create a git commit
   - Create a git tag
   
3. Push changes and tags:
   ```bash
   git push origin master && git push --tags
   ```

4. Publish to npm:
   ```bash
   npm publish
   ```
