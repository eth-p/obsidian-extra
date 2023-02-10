import { App as ObsidianApp, PluginManifest } from 'obsidian';
import { App, Latest, PluginID, Version } from 'obsidian-undocumented';

/**
 * Gets the manifest of an installed community plugin.
 *
 * @param app The Obsidian app.
 * @param pluginID The ID of the plugin to get.
 *
 * @returns The plugin manifest, or null if the plugin is not installed.
 */
export default function getPluginManifest<V extends Version = Latest>(
	app: ObsidianApp,
	pluginID: PluginID,
): PluginManifest | null {
	const manifests = (app as App<V>).plugins.manifests;
	if (!Object.prototype.hasOwnProperty.call(manifests, pluginID)) {
		return null;
	}

	return manifests[pluginID];
}
