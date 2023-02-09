import { App as ObsidianApp } from 'obsidian';
import { App, Latest, Version } from 'obsidian-undocumented';

/**
 * Checks if a community plugin is enabled.
 *
 * @param app The Obsidian app.
 * @param pluginID The ID of the plugin to check.
 *
 * @returns True if the plugin is installed and enabled.
 */
export default function isPluginEnabled<V extends Version = Latest>(app: ObsidianApp, pluginID: string): boolean {
	return (app as App<V>).plugins.enabledPlugins.has(pluginID);
}
