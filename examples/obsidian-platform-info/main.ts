import { Plugin, PluginSettingTab, Setting } from 'obsidian';
import {
	BrowserInfo,
	OperatingSystemInfo,
	RuntimeInfo,
	detectPlatformBrowser,
	detectPlatformOperatingSystem,
	detectPlatformRuntime,
} from 'obsidian-extra';

export default class ExamplePlugin extends Plugin {
	public osInfo!: OperatingSystemInfo;
	public browserInfo!: BrowserInfo;
	public runtimeInfo!: RuntimeInfo;

	async onload() {
		const { app } = this;

		this.osInfo = await detectPlatformOperatingSystem(app);
		this.browserInfo = await detectPlatformBrowser(app);
		this.runtimeInfo = await detectPlatformRuntime(app);

		this.addSettingTab(new ExamplePluginSettingTab(this));
	}
}

class ExamplePluginSettingTab extends PluginSettingTab {
	public readonly plugin: ExamplePlugin;

	constructor(plugin: ExamplePlugin) {
		super(plugin.app, plugin);
	}

	display() {
		const { containerEl, plugin } = this;
		containerEl.classList.add('obsidian-platform-info');
		containerEl.empty();

		// OS Info
		containerEl.createEl('h2', { text: 'Operating System' });
		new Setting(containerEl).setName('Name').setDesc(plugin.osInfo.name);
		new Setting(containerEl).setName('Version').setDesc(plugin.osInfo.version ?? '(null)');

		containerEl.createEl('h3', { text: 'Extended Info' });
		new Setting(containerEl).setName('Is Windows 10').setDesc(plugin.osInfo.isWindows10() ? "Yes" : "No");
		new Setting(containerEl).setName('Is Windows 11').setDesc(plugin.osInfo.isWindows11() ? "Yes" : "No");

		// Runtime Info
		containerEl.createEl('h2', { text: 'Runtime' });
		new Setting(containerEl).setName('Type').setDesc(plugin.runtimeInfo.name);
		new Setting(containerEl).setName('Version').setDesc(plugin.runtimeInfo.version ?? '(null)');

		// Browser Info
		containerEl.createEl('h2', { text: 'Browser' });
		new Setting(containerEl).setName('Browser').setDesc(plugin.browserInfo.name);
		new Setting(containerEl).setName('Version').setDesc(plugin.browserInfo.version ?? '(null)');
	}
}
