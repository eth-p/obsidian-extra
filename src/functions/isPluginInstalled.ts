import { App as ObsidianApp } from 'obsidian';
import { Latest, PluginID, Version } from 'obsidian-undocumented';

import getPluginManifest from './getPluginManifest';

/**
 * Checks if a community plugin with the given ID is installed.
 *
 * @param app The Obsidian app.
 * @param pluginID The ID of the plugin to check.
 *
 * @returns True if the plugin is installed.
 */
export default function isPluginInstalled<V extends Version = Latest>(app: ObsidianApp, pluginID: PluginID): boolean {
	return getPluginManifest<V>(app, pluginID) !== null;
}
