import { App as ObsidianApp } from 'obsidian';
import { Latest, SnippetID, Version } from 'obsidian-undocumented';

import getSnippetStyleElements from './getSnippetStyleElements';

/**
 * Gets the `<style>` element that holds the contents of a snippet.
 * If there is no enabled snippet with the provided ID, null will be returned.
 *
 * @param app The Obsidian app.
 * @param snippetID The ID of the snippet.
 *
 * @returns The theme style element.
 */
export default function getSnippetStyleElement<V extends Version = Latest>(
	app: ObsidianApp,
	snippetID: SnippetID,
): HTMLStyleElement | null {
	return getSnippetStyleElements(app).get(snippetID) ?? null;
}
