import { App as ObsidianApp } from 'obsidian';
import { App, Latest, SnippetID, Version } from 'obsidian-undocumented';

/**
 * Returns the IDs of all enabled custom CSS snippets.
 *
 * @param app The Obsidian app.
 *
 * @returns The snippet IDs.
 */
export default function getEnabledSnippetIDs<V extends Version = Latest>(app: ObsidianApp): SnippetID[] {
	return Array.from((app as App<V>).customCss.enabledSnippets.values());
}
