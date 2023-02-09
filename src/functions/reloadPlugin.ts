import { App as ObsidianApp } from 'obsidian';
import { App, Latest, Version } from 'obsidian-undocumented/unsafe';

import isPluginEnabled from './isPluginEnabled';

isPluginEnabled;

/**
 * Reloads a community plugin.
 * If the plugin is disabled, it will not be reloaded.
 *
 * @param app The Obsidian app.
 * @param pluginID The ID of the plugin to reload.
 *
 * @returns True if the plugin was reloaded.
 */
export default async function reloadPlugin<V extends Version = Latest>(
	app: ObsidianApp,
	pluginID: string,
): Promise<boolean> {
	if (!isPluginEnabled<V>(app, pluginID)) {
		return false;
	}

	const pm = (app as App<V>).plugins;

	await pm.disablePlugin(pluginID);
	await pm.enablePlugin(pluginID);

	return true;
}
