import { App as ObsidianApp, Plugin } from 'obsidian';
import { App, Latest, PluginID, Version } from 'obsidian-undocumented';

/**
 * Gets the instance of a loaded and intialized community plugin.
 *
 * @param app The Obsidian app.
 * @param pluginID The ID of the plugin to get.
 *
 * @returns The plugin instance, or null if the plugin is not installed, loaded, or enabled.
 */
export default function getPluginInstance<V extends Version = Latest>(
	app: ObsidianApp,
	pluginID: PluginID,
): Plugin | null {
	return (app as App<V>).plugins.getPlugin(pluginID);
}
