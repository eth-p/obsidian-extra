# obsidian-extra
[![support Obsidian versions](https://img.shields.io/badge/Obsidian-1.1.0_--_1.1.9-blue?logo=obsidian)](https://obsidian.md/) [![total downloads](https://img.shields.io/npm/dt/obsidian-extra?label=Total&logo=npm)](https://www.npmjs.com/package/obsidian-extra)

Utilities for working with Obsidian's [undocumented API](https://github.com/eth-p/obsidian-undocumented) in a version-agnostic manner.

## Installation
Use `npm` or `yarn` to install type definitions for undocumented Obsidian APIs:

```bash
npm install obsidian-extra
```

## Usage
Import the desired function(s) and use them!

```typescript
import { getEnabledPluginIDs, getPluginInstance } from "obsidian-extra";

// Inside your Plugin class:
const enabledPluginInstances = getEnabledPluginIDs(this.app)
	.map((id) => getPluginInstance(this.app, id));
```

Certain functions are deemed "unsafe", as they have the ability to easily break Obsidian or interfere with the operation of other plugins. These functions are only available in the `obsidian-extra/unsafe` import.

## Design Goals
- **Tree-shakeable.**  
  Using functions from `obsidian-extra` should only bring in exactly what they need.

- **Safety first.**  
  Functions should not have the ability to break Obsidian just by themselves, unless exported through the "unsafe" import.

- **Simple abstraction.**  
  No complicated classes and designs. A function does exactly what you need, only abstracting away the parts that could be accidentally misused.


## Features

### Workspace

- [Get secondary window DOMs](./src/functions/getFloatingWindowRoots.ts)

### Plugins

- [List installed plugins](./src/functions/getInstalledPluginIDs.ts)
- [List enabled plugins](./src/functions/getEnabledPluginIDs.ts)
- [Get plugin instances](./src/functions/getPluginInstance.ts)
- [Get plugin manifests](./src/functions/getPluginManifest.ts)
- [Enable plugins](./src/functions/enablePlugin.ts) (unsafe)
- [Disable plugins](./src/functions/disablePlugin.ts) (unsafe)
- [Reload plugins](./src/functions/reloadPlugin.ts) (unsafe)

### CSS

- [List installed snippets](./src/functions/getInstalledSnippetIDs.ts)
- [List enabled snippets](./src/functions/getEnabledSnippetIDs.ts)
- [Check if snippet is installed](./src/functions/isSnippetInstalled.ts)
- [Check if snippet is enabled](./src/functions/isSnippetEnabled.ts)
- [Get style element of snippet](./src/functions/getSnippetStyleElement.ts)
- [Get style elements of all snippets](./src/functions/getSnippetStyleElements.ts)
- [List installed themes](./src/functions/getInstalledThemeIDs.ts)
- [Get current theme ID](./src/functions/getCurrentThemeID.ts)
- [Get theme manifest](./src/functions/getThemeManifest.ts)
- [Get theme style element](./src/functions/getThemeStyleElement.ts)
- [Check if theme is installed](./src/functions/isThemeInstalled.ts)

### View Registry

- [Get registered view types](./src/functions/getRegisteredViewTypes.ts)
- [Get registered file extensions](./src/functions/getRegisteredFileExtensions.ts)
