import { App as ObsidianApp } from 'obsidian';
import { App, Latest, Version } from 'obsidian-undocumented';

import getCurrentThemeID from './getCurrentThemeID';
import isThemeInstalled from './isThemeInstalled';

/**
 * Gets the `<style>` element that holds the contents of the current theme.
 * If there is no active theme, null will be returned.
 *
 * @param app The Obsidian app.
 *
 * @returns The theme style element.
 */
export default function getThemeStyleElement<V extends Version = Latest>(app: ObsidianApp): HTMLStyleElement | null {
	const currentTheme = getCurrentThemeID(app);
	if (currentTheme == null || !isThemeInstalled(app, currentTheme)) {
		return null;
	}

	return (app as App<V>).customCss.styleEl;
}
