import { App as ObsidianApp, Platform as ObsidianPlatform } from 'obsidian';
import { Latest, Version } from 'obsidian-undocumented';

import { Global as ElectronGlobal } from '../internal/types/electron';
import { Global as CapacitorGlobal } from '../internal/types/capacitor';
import { parseUserAgent } from '../internal/utils/parseUserAgent';

/**
 * An identifier for the runtime that Obsidian is running under.
 *
 * The desktop app uses `electron`, while the mobile apps use `capacitor`.
 */
export type RuntimeName = 'electron' | 'capacitor';

/**
 * Runtime information.
 */
export type RuntimeInfo = {
	/**
	 * The runtime being used by Obsidian.
	 */
	readonly name: RuntimeName;

	/**
	 * The runtime version.
	 */
	readonly version: string | null;
} & (ElectronRuntime | CapacitorRuntime);

interface ElectronRuntime {
	readonly name: 'electron';
	readonly version: string | null;
	readonly nodeVersion: string | null;
}

interface CapacitorRuntime {
	readonly name: 'capacitor';
	readonly version: null;
}

let cache: RuntimeInfo | null = null;

/**
 * Returns extended information about Obsidian's runtime environment.
 *
 * @param app The Obsidian app.
 *
 * @returns The runtime information.
 */
export default async function detectPlatformRuntime<V extends Version = Latest>(app: ObsidianApp): Promise<RuntimeInfo> {
	if (cache !== null) return cache;

	const name = await getPlatformRuntimeName();
	switch (name) {
		case 'electron':
			return (cache = Object.freeze({
				name,
				version: getElectronVersion(),
				nodeVersion: getNodeVersion(),
			}));

		case 'capacitor':
			return (cache = Object.freeze({
				name,
				version: null,
			}));
	}
}

/**
 * Returns extended information about Obsidian's runtime environment.
 *
 * - Since both the desktop and mobile apps use Capacitor, this first tries to detect if running under Electron.
 * - If all attempts to detect Electron failed, try to detect the Capacitor global object.
 * - If that fails, try to guess based on what Obsidian's Platform object returns.
 * - And if that fails, assume Capacitor.
 *
 * @param app The Obsidian app.
 *
 * @returns The runtime information.
 */
async function getPlatformRuntimeName(): Promise<RuntimeName> {
	const exceptions = [];

	// First, try to use an Electron require.
	try {
		(globalThis as ElectronGlobal).electron ?? (globalThis as ElectronGlobal).require?.('electron');
		return 'electron';
	} catch (ex) {
		exceptions.push(ex);
	}

	// Try to parse the user agent.
	const ua = parseUserAgent(navigator.userAgent);
	if (ua.has('electron')) return 'electron';

	// Check for Capacitor plugins.
	// The Desktop app also uses Capacitor, but it runs under Electron.
	if ((globalThis as CapacitorGlobal).Capacitor?.Plugins != null) {
		return 'capacitor';
	}

	// Guess based on whether running in the mobile app.
	if (ObsidianPlatform.isDesktopApp) return 'electron';
	if (ObsidianPlatform.isAndroidApp || ObsidianPlatform.isIosApp) return 'capacitor';

	// At this point, it could be anything.
	// Assume capacitor, since it supports a web runtime.
	console.warn(`[obsidian-extra]: Unable to determine platform runtime.`, exceptions);
	return 'capacitor';
}

function getElectronVersion(): string | null {
	// Try to use the process module.
	try {
		const process = (globalThis as ElectronGlobal).process ?? (globalThis as ElectronGlobal).require?.('process');
		if (process?.versions.electron != null) return process.versions.electron;
	} catch (ex) {
		console.warn(`[obsidian-extra]: Unable to determine electron version via process module.`, ex);
	}

	// Try to parse the user agent.
	const ua = parseUserAgent(navigator.userAgent);
	return ua.get('electron')?.version ?? null;
}

function getNodeVersion(): string | null {
	// Try to use the process module.
	try {
		const process = (globalThis as ElectronGlobal).process ?? (globalThis as ElectronGlobal).require?.('process');
		if (process?.versions.node != null) return process.versions.node;
		if (process?.version != null) return process.version.replace(/^v/i, '');
	} catch (ex) {
		console.warn(`[obsidian-extra]: Unable to determine Node version via process module.`, ex);
	}

	// No way to get the Node version.
	return null;
}
