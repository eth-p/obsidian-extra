import { App as ObsidianApp, Plugin as ObsidianPlugin } from 'obsidian';
import { App, Latest, PluginID, Version } from 'obsidian-undocumented';

/**
 * Closes the settings modal.
 *
 * @param app The Obsidian app.
 */
export default function closeSettings<V extends Version = Latest>(app: ObsidianApp): void {
	const settingManager = (app as App<V>).setting;
	settingManager.close();
}
