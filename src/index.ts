// Floating windows.
export { default as getFloatingWindowRoots } from './functions/getFloatingWindowRoots';
export { default as getFloatingWindows } from './functions/getFloatingWindows';

// File extensions.
export { default as getRegisteredFileExtensions } from './functions/getRegisteredFileExtensions';

// Views.
export { default as getRegisteredViewTypes } from './functions/getRegisteredViewTypes';

// Themes.
export { default as getInstalledThemeIDs } from './functions/getInstalledThemeIDs';
export { default as getCurrentThemeID } from './functions/getCurrentThemeID';
export { default as getThemeManifest } from './functions/getThemeManifest';
export { default as getThemeStyleElement } from './functions/getThemeStyleElement';
export { default as isThemeInstalled } from './functions/isSnippetEnabled';
export { default as fetchObsidianStyles } from './functions/fetchObsidianStyles';

// Custom CSS snippets.
export { default as getInstalledSnippetIDs } from './functions/getInstalledSnippetIDs';
export { default as getEnabledSnippetIDs } from './functions/getEnabledSnippetIDs';
export { default as getSnippetStyleElements } from './functions/getSnippetStyleElements';
export { default as getSnippetStyleElement } from './functions/getSnippetStyleElement';
export { default as isSnippetEnabled } from './functions/isSnippetEnabled';
export { default as isSnippetInstalled } from './functions/isSnippetInstalled';

// Plugins.
export { default as getInstalledPluginIDs } from './functions/getInstalledPluginIDs';
export { default as getEnabledPluginIDs } from './functions/getEnabledPluginIDs';
export { default as getPluginInstance } from './functions/getPluginInstance';
export { default as getPluginManifest } from './functions/getPluginManifest';
export { default as isPluginEnabled } from './functions/isPluginEnabled';
export { default as isPluginInstalled } from './functions/isPluginInstalled';
