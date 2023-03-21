import { App as ObsidianApp, apiVersion } from 'obsidian';
import { Latest, Version } from 'obsidian-undocumented';

import { Electron, Global } from '../internal/types/electron';
import { versionCompare } from '../internal/utils/versionCompare';

/**
 * Fetches the contents of the stylesheet(s) used by Obsidian.
 * If this fails (e.g. unsupported environment), an error will be thrown.
 *
 * @param app The Obsidian app.
 * @returns The CSS stylesheet contents.
 */
export default async function fetchObsidianStyles<V extends Version = Latest>(app: ObsidianApp): Promise<string> {
	try {
		return await (await fetch("/app.css")).text();
	} catch (_ex) {}

	// Fallback: Use Electron APIs.
	if (versionCompare(apiVersion, '1.1.15') > 0) {
		throw new Error(`[obsidian-extra]: Obsidian ${apiVersion} has not been tested with this function`);
	}

	try {
		const require = (globalThis as Global).require;

		// We need "electron" to get the path to the Obsidian asar, and we need "fs" to read the asar.
		// Note: "fs" was patched by Electron to be able to read asars.
		const electron: Electron | undefined = (globalThis as Global).electron ?? require?.('electron');
		if (electron == null) {
			throw new Error('Unable to get electron module from web renderer process');
		}

		const fs = require?.('fs/promises');
		if (fs?.readFile == null) {
			throw new Error('Unable to get fs/promises module from web renderer process');
		}

		// Get the path to the Obsidian asar.
		// SAFETY: If there is no listener on the main process side, THIS WILL HANG THE WEB VIEW.
		const resources = electron.ipcRenderer.sendSync('resources');

		// Get the contents of the `app.css` resource.
		return await fs.readFile(`${resources}/app.css`, 'utf8');
	} catch (ex) {
		throw new Error(`[obsidian-extra]: Could not get Obsidian styles: ${ex}`);
	}
}
