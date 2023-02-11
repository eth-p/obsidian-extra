import { App as ObsidianApp } from 'obsidian';
import { App, Latest, ThemeID, ThemeManifest, Version } from 'obsidian-undocumented';

/**
 * Gets the manifest of an installed theme.
 *
 * @param app The Obsidian app.
 * @param themeID The ID of the theme to get.
 *
 * @returns The theme manifest, or null if the theme is not installed.
 */
export default function getThemeManifest<V extends Version = Latest>(
	app: ObsidianApp,
	themeID: ThemeID,
): ThemeManifest | null {
	const manifests = (app as App<V>).customCss.themes;
	if (!Object.prototype.hasOwnProperty.call(manifests, themeID)) {
		return null;
	}

	return manifests[themeID];
}
