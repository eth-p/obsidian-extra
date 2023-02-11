import { App as ObsidianApp } from 'obsidian';
import { App, Latest, SnippetID, Version } from 'obsidian-undocumented';

/**
 * Returns the IDs of all installed custom CSS snippets.
 *
 * @param app The Obsidian app.
 *
 * @returns The snippets IDs.
 */
export default function getInstalledSnippetIDs<V extends Version = Latest>(app: ObsidianApp): Readonly<SnippetID[]> {
	return (app as App<V>).customCss.snippets;
}
