import { App as ObsidianApp, PluginManifest } from 'obsidian';
import { App, Latest, PluginID, Version } from 'obsidian-undocumented';

/**
 * Returns the IDs of all installed community plugins.
 *
 * @param app The Obsidian app.
 *
 * @returns The plugin IDs.
 */
export default function getInstalledPluginIDs<V extends Version = Latest>(app: ObsidianApp): PluginID[] {
	const manifests = (app as App<V>).plugins.manifests;
	return Object.keys(manifests);
}
