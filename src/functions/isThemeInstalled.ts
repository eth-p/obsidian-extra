import { App as ObsidianApp } from 'obsidian';
import { Latest, ThemeID, Version } from 'obsidian-undocumented';

import getThemeManifest from './getThemeManifest';

/**
 * Checks if a theme with the given ID is installed.
 *
 * @param app The Obsidian app.
 * @param themeID The ID of the theme to check.
 *
 * @returns True if the theme is installed.
 */
export default function isThemeInstalled<V extends Version = Latest>(app: ObsidianApp, themeID: ThemeID): boolean {
	return getThemeManifest<V>(app, themeID) !== null;
}
