import { App as ObsidianApp, Platform, apiVersion } from 'obsidian';
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
	const orElse = (cb: () => string | Promise<string>) => (_ex: unknown) => {
		// console.debug(
		// 	'[obsidian-extra]: One method used to fetch Obsidian styles failed. This is OK, there are more.\n',
		// 	ex,
		// );
		return cb();
	};

	return fetchObsidianStylesViaElectron('app.css')
		.catch(orElse(() => fetchObsidianStylesViaFetch('app.css')))
		.catch(orElse(() => fetchObsidianStylesViaReconstruction('app.css')));
}

/**
 * Try to fetch the styles with a fetch request to `/app.css`.
 * This does not work for the Electron-based desktop app.
 */
async function fetchObsidianStylesViaFetch(path: string): Promise<string> {
	if (Platform.isDesktopApp) {
		// If we know it doesn't work, we might as well preemptively stop it
		// so we don't spam the console with fetch error messages.
		throw new Error('Obsidian styles via fetch() does not work under Electron.');
	}

	return fetch(`/${path}`).then((r) => r.text());
}

/**
 * Try to fetch the styles using the Electron APIs.
 *
 * This must be checked for every version, as `sendSync` may hang the web process if the IPC call
 * doesn't return anything. It also doesn't work for the mobile apps.
 */
async function fetchObsidianStylesViaElectron(path: string): Promise<string> {
	if (versionCompare(apiVersion, '1.1.15') > 0) {
		throw new Error(`Obsidian ${apiVersion} has not been tested with this function`);
	}

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
	return fs.readFile(`${resources}/${path}`, 'utf8');
}

/**
 * Try to reconstruct the stylesheet using DOM APIs.
 * This works, but we lose formatting and comments.
 */
function fetchObsidianStylesViaReconstruction(path: string): string {
	let found = false;
	const lines = [];

	for (const styleSheet of Array.from(document.styleSheets)) {
		// Try to find the <link> element for the obsidian `app.css` stylesheet.
		if (!(styleSheet.ownerNode instanceof HTMLLinkElement)) continue;
		const href = styleSheet.ownerNode.getAttribute('href');
		if (href !== path && href !== `/${path}`) continue;

		// Add all the CSS rules to an array.
		found = true;
		for (const rule of Array.from(styleSheet.cssRules)) {
			lines.push(rule.cssText);
		}
	}

	if (!found) throw new Error("Unable to find <link> element for Obsidian's stylesheet");
	return lines.join('\n');
}
