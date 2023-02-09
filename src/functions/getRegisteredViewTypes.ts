import { App as ObsidianApp } from 'obsidian';
import { App, Latest, Version } from 'obsidian-undocumented';

/**
 * Returns a list of all the view types currently registered.
 * This includes the built-in view types and any added by plugins.
 *
 * @param app The Obsidian app.
 * @returns An array of view types.
 */
export default function getRegisteredViewTypes<V extends Version = Latest>(app: ObsidianApp): string[] {
	return Object.keys((app as App<V>).viewRegistry.viewByType);
}
