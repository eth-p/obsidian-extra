import { App as ObsidianApp, Plugin as ObsidianPlugin } from 'obsidian';
import { App, Latest, PluginID, Version } from 'obsidian-undocumented';

/**
 * Opens the settings for a plugin.
 *
 * @param app The Obsidian app.
 * @param plugin The plugin that should have its settings opened.
 */
export default function openPluginSettings<V extends Version = Latest>(
	app: ObsidianApp,
	plugin: ObsidianPlugin | PluginID,
): void {
	const settingManager = (app as App<V>).setting;
	const pluginId = typeof plugin === 'string' ? plugin : plugin.manifest.id;

	// If the active tab is not the plugin's setting tab, close the active tab to prevent unnecessary rendering.
	// The string `''` is useful for this.
	if (settingManager.activeTab?.id !== pluginId) {
		settingManager.openTabById('');
	}

	// Ensure the setting modal is open.
	settingManager.open();

	// Open the plugin's setting tab if it's not already open.
	if (settingManager.activeTab?.id !== pluginId) {
		settingManager.openTabById(pluginId);
	}
}
