import { App as ObsidianApp } from 'obsidian';
import { App, Latest, PluginID, Version } from 'obsidian-undocumented';

/**
 * Returns the IDs of all enabled community plugins.
 *
 * @param app The Obsidian app.
 *
 * @returns The plugin IDs.
 */
export default function getEnabledPluginIDs<V extends Version = Latest>(app: ObsidianApp): PluginID[] {
	return Array.from((app as App<V>).plugins.enabledPlugins.values());
}
