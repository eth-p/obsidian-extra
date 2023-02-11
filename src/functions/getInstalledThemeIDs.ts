import { App as ObsidianApp } from 'obsidian';
import { App, Latest, ThemeID, Version } from 'obsidian-undocumented';

/**
 * Returns the IDs of all installed themes.
 *
 * @param app The Obsidian app.
 *
 * @returns The theme IDs.
 */
export default function getInstalledThemeIDs<V extends Version = Latest>(app: ObsidianApp): ThemeID[] {
	const manifests = (app as App<V>).customCss.themes;
	return Object.keys(manifests);
}
