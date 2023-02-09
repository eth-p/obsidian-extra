import { App as ObsidianApp } from 'obsidian';
import { App, Latest, Version } from 'obsidian-undocumented/unsafe';

import isPluginEnabled from './isPluginEnabled';
import isPluginInstalled from './isPluginInstalled';

/**
 * Enables a community plugin.
 *
 * @param app The Obsidian app.
 * @param pluginID The ID of the plugin to disable.
 *
 * @returns True if the plugin was enabled as a result of calling this function.
 * @throws {@link Error} If the plugin was not installed.
 */
export default async function enablePlugin<V extends Version = Latest>(
	app: ObsidianApp,
	pluginID: string,
): Promise<boolean> {
	if (!isPluginInstalled<V>(app, pluginID)) {
		throw new Error(`unknown plugin: ${pluginID}`);
	}

	if (isPluginEnabled<V>(app, pluginID)) {
		return false;
	}

	const pm = (app as App<V>).plugins;

	await pm.enablePlugin(pluginID);
	return true;
}
