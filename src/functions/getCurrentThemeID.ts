import { App as ObsidianApp } from 'obsidian';
import { App, Latest, ThemeID, Version } from 'obsidian-undocumented';

/**
 * Gets the ID of the currently-used theme.
 *
 * @param app The Obsidian app.
 *
 * @returns The theme ID, or null if the default theme is used.
 */
export default function getCurrentThemeID<V extends Version = Latest>(app: ObsidianApp): ThemeID | null {
	const theme = (app as App<V>).customCss.theme;
	return theme === '' ? null : theme;
}
