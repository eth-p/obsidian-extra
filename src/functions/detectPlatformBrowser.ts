import { App as ObsidianApp, Platform as ObsidianPlatform } from 'obsidian';
import { Latest, Version } from 'obsidian-undocumented';

import { Global } from '../internal/types/electron';
import { parseUserAgent } from '../internal/utils/parseUserAgent';

/**
 * An identifier for the type of web browser that Obsidian uses to render its UI.
 */
export type BrowserName = 'chrome' | 'safari';

/**
 * Browser information.
 */
export type BrowserInfo = {
	/**
	 * The browser being used to render Obsidian's UI.
	 */
	readonly name: BrowserName;

	/**
	 * The browser version.
	 * This will be null if it cannot be detected.
	 */
	readonly version: string | null;
};

let cache: BrowserInfo | null = null;

/**
 * Returns extended information about browser rendering Obsidian's UI.
 *
 * @param app The Obsidian app.
 *
 * @returns The browser information.
 */
export default async function getPlatformBrowser<V extends Version = Latest>(app: ObsidianApp): Promise<BrowserInfo> {
	if (cache !== null) return cache;

	// Best case: use the exposed `process` module.
	try {
		const process = (globalThis as Global).process ?? (globalThis as Global).require?.('process');
		const version = process?.versions.chrome;
		if (version != null) {
			return (cache = {
				name: 'chrome', // The only Electron frontend is Chromium.
				version,
			});
		}
	} catch (ex) {
		console.warn(`[obsidian-extra]: Could not get browser info: ${ex}`);
	}

	// Worst case: parse the user agent.
	return (cache = Object.freeze({
		name: ObsidianPlatform.isSafari ? 'safari' : 'chrome',
		version:
			parseUserAgent(navigator.userAgent).get(ObsidianPlatform.isSafari ? 'safari' : 'chrome')?.version ?? null,
	}));
}
