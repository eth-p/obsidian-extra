import { App as ObsidianApp, Platform, apiVersion } from 'obsidian';
import { Latest, Version } from 'obsidian-undocumented';

import { Electron, Global } from '../internal/types/electron';
import { versionCompare } from '../internal/utils/versionCompare';

/**
 * The Obsidian `app.css` stylesheet.
 */
export interface ObsidianStyleSheet {
	/**
	 * The method used to fetch the contents of the style sheet.
	 */
	method: 'fetch' | 'electron' | 'dom';

	/**
	 * The CSS text of the style sheet.
	 * This is what will be parsed by the browser.
	 */
	cssText: string;
}

/**
 * Fetches the contents of the stylesheet(s) used by Obsidian.
 * If this fails (e.g. unsupported environment), an error will be thrown.
 *
 * @param app The Obsidian app.
 * @returns The CSS stylesheet contents.
 */
export default async function fetchObsidianStyleSheet<V extends Version = Latest>(
	app: ObsidianApp,
): Promise<ObsidianStyleSheet> {
	let errors: unknown[] = [];
	const orElse = (cb: () => ObsidianStyleSheet | Promise<ObsidianStyleSheet>) => (ex: unknown) => {
		errors.push(ex);
		return cb();
	};

	// Attempt to fetch the Obsidian style sheet.
	// This will sequentially try every known method, eventually falling back on using the DOM API.
	const result = await viaElectron('app.css')
		.catch(orElse(() => viaFetch('app.css')))
		.catch(orElse(() => viaDom('app.css')));

	// Add `_errors` field for debugging purposes.
	(result as ObsidianStyleSheet & { _errors: unknown[] })._errors = errors;
	return result;
}

/**
 * Try to fetch the styles with a fetch request to `/app.css`.
 * This does not work for the Electron-based desktop app.
 */
async function viaFetch(path: string): Promise<ObsidianStyleSheet> {
	if (Platform.isDesktopApp) {
		// If we know it doesn't work, we might as well preemptively stop it
		// so we don't spam the console with fetch error messages.
		throw new Error('Obsidian styles via fetch() does not work under Electron.');
	}

	return fetch(`/${path}`)
		.then((r) => r.text())
		.then((t) => ({
			method: 'fetch',
			cssText: t,
		}));
}

/**
 * Try to fetch the styles using the Electron APIs.
 *
 * This must be checked for every version, as `sendSync` may hang the web process if the IPC call
 * doesn't return anything. It also doesn't work for the mobile apps.
 */
async function viaElectron(path: string): Promise<ObsidianStyleSheet> {
	if (versionCompare(apiVersion, '1.1.16') > 0) {
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
	return fs.readFile(`${resources}/${path}`, 'utf8').then((t) => ({
		method: 'electron',
		cssText: t,
	}));
}

/**
 * Try to reconstruct the stylesheet using DOM APIs.
 * This works under any environment, but we lose formatting and comments.
 */
function viaDom(path: string): ObsidianStyleSheet {
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

	if (!found) {
		throw new Error("Unable to find <link> element for Obsidian's stylesheet");
	}

	return {
		method: 'dom',
		cssText: lines.join('\n'),
	};
}
