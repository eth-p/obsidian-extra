import { App as ObsidianApp } from 'obsidian';
import { App, Latest, SnippetID, Version } from 'obsidian-undocumented';

/**
 * Checks if a custom CSS snippet is enabled.
 *
 * @param app The Obsidian app.
 * @param snippetID The ID of the snippet to check.
 *
 * @returns True if the plugin is installed and enabled.
 */
export default function isSnippetEnabled<V extends Version = Latest>(app: ObsidianApp, snippetID: SnippetID): boolean {
	return (app as App<V>).customCss.enabledSnippets.has(snippetID);
}
