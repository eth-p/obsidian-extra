import { App as ObsidianApp, Platform as ObsidianPlatform } from 'obsidian';
import { Latest, Version } from 'obsidian-undocumented';

import { Global as CapacitorGlobal } from '../internal/types/capacitor';
import { Global as ElectronGlobal } from '../internal/types/electron';
import { parseUserAgent } from '../internal/utils/parseUserAgent';
import { versionCompare } from '../internal/utils/versionCompare';

/**
 * An identifier for the type of operating system that is running Obsidian.
 */
export type OperatingSystemName = 'macos' | 'windows' | 'linux' | 'android' | 'ios' | 'unknown';

/**
 * Operating system information.
 */
export type OperatingSystemInfo = {
	/**
	 * An identifier for the kind of operating system that Obsidian is running under.
	 * Possible values:
	 *
	 *  - `macos`
	 *  - `windows`
	 *  - `linux`
	 *  - `android`
	 *  - `ios`
	 *  - `unknown` (if the OS cannot be detected)
	 */
	readonly name: OperatingSystemName;

	/**
	 * The operating system version.
	 * This will be null if it cannot be detected.
	 */
	readonly version: string | null;

	readonly isWindows10: () => boolean;
	readonly isWindows11: () => boolean;
};

let cache: OperatingSystemInfo | null = null;

/**
 * Returns extended information about platform running Obsidian.
 *
 * @param app The Obsidian app.
 *
 * @returns The operating system information.
 */
export default async function detectPlatformOperatingSystem<V extends Version = Latest>(
	app: ObsidianApp,
): Promise<OperatingSystemInfo> {
	if (cache !== null) return cache;

	const [os, osVersion] = await detectOperatingSystemNameAndVersion();
	const osVersionOrEmpty = osVersion ?? '';
	return (cache = Object.freeze({
		name: os,
		version: osVersion,

		isWindows10: () =>
			os === 'windows' &&
			versionCompare(osVersionOrEmpty, '10.0.0') >= 0 &&
			versionCompare(osVersionOrEmpty, '10.0.22000') < 0,

		isWindows11: () => os === 'windows' && versionCompare(osVersionOrEmpty, '10.0.22000') >= 0,
	}));
}

async function detectOperatingSystemNameAndVersion(): Promise<[OperatingSystemName, string | null]> {
	const exceptions = [];

	// Best case: use the Electron API to find out the host system.
	try {
		const process = (globalThis as ElectronGlobal).process ?? (globalThis as ElectronGlobal).require?.('process');
		if (process != null) {
			let osVersion = null;

			try {
				osVersion = (globalThis as ElectronGlobal).require?.('os')?.release?.() ?? null;
			} catch (ex) {
				console.warn(`[obsidian-extra]: Unable to determine operating system version via os module.`, ex);
			}

			switch (process.platform) {
				case 'linux':
					return ['linux', osVersion];

				case 'win32':
					return ['windows', osVersion];

				case 'darwin':
					return ['macos', osVersion];

				case undefined:
					break;

				default:
					return ['unknown', osVersion];
			}
		}
	} catch (ex) {
		exceptions.push(ex);
	}

	// Best case: use the Capacitor API to find out the host system.
	try {
		const Device = (globalThis as CapacitorGlobal).Capacitor!.Plugins.Device;
		const { platform, osVersion } = await Device.getInfo();

		switch (platform) {
			case 'android':
				return ['android', osVersion];

			case 'ios':
				return ['ios', osVersion];
		}
	} catch (ex) {
		exceptions.push(ex);
	}

	// Neutral case: use Obsidian's API.
	if (ObsidianPlatform.isAndroidApp) return ['android', null];
	if (ObsidianPlatform.isIosApp) return ['ios', null];
	if (ObsidianPlatform.isDesktopApp && ObsidianPlatform.isMacOS) return ['macos', null];

	// Worst case: try to parse the user agent.
	const ua = parseUserAgent(navigator.userAgent);
	const system = ua.get('mozilla')?.details?.toLowerCase();

	if (system == null) {
		return ['unknown', null];
	}

	if (system.contains('macintosh')) return ['macos', null];
	if (system.contains('windows')) return ['windows', /nt ([0-9.]+)/i.exec(system)?.[1] ?? null];
	if (system.contains('linux')) return ['linux', null];

	// No options left to find out.
	return ['unknown', null];
}
