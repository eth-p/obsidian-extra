import { App as ObsidianApp } from 'obsidian';
import { App, Latest, SnippetID, Version } from 'obsidian-undocumented';

import getInstalledSnippetIDs from './getInstalledSnippetIDs';
import isSnippetEnabled from './isSnippetEnabled';

/**
 * Gets a map of snippets to their container `<style>` elements.
 *
 * @param app The Obsidian app.
 *
 * @returns A map of snippet style elements, keyed by the snippe tID.
 */
export default function getSnippetStyleElements<V extends Version = Latest>(
	app: ObsidianApp,
): Map<SnippetID, HTMLStyleElement> {
	const styleManager = (app as App<V>).customCss;
	const snippets = getInstalledSnippetIDs(app);
	const map = new Map<SnippetID, HTMLStyleElement>();

	// VERSION 1.0.0:
	//   The `extraStyleEls` property is populated like so:
	//   |  snippets.filter(id => isEnabled(id))
	//   |          .map(id => createElement("style", text: snippetContent[id]))
	for (let i = 0, elI = 0; i < snippets.length; i++) {
		const snippetID = styleManager.snippets[i];
		if (isSnippetEnabled(app, snippetID)) {
			map.set(snippetID, styleManager.extraStyleEls[elI]);
			elI++;
		}
	}

	return map;
}
