import { App as ObsidianApp } from 'obsidian';
import { App, Latest, ThemeID, Version } from 'obsidian-undocumented';

/**
 * Gets the current color scheme.
 *
 * @param app The Obsidian app.
 *
 * @returns The current color scheme.
 */
export default function getCurrentThemeID<V extends Version = Latest>(app: ObsidianApp): 'dark' | 'light' {
	const { body } = (app as App<V>).workspace.containerEl.doc;
	return body.classList.contains('theme-dark') ? 'dark' : 'light';
}
