import * as CapacitorPluginDevice from "./capacitor-device";

/**
 * @internal
 *
 * Minimal type definitions for the Capacitor environment which Obsidian's mobile apps runs under.
 */
export interface Capacitor {
	Plugins: {
		Device: typeof CapacitorPluginDevice;
	}
}

declare interface CapacitorWebProcessGlobals {
	Capacitor?: Capacitor;
}

export type Global = typeof globalThis & CapacitorWebProcessGlobals;
