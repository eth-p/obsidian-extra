/**
 * @internal
 *
 * Minimal type definitions for the Electron environment which Obsidian runs under.
 *
 * This has some serious potential to break Obsidian and affect other vaults than the current one, and for that reason
 * is kept strictly to as-needed type definitions.
 */
export interface Electron {
	ipcRenderer: {

		/**
		 * Asks the main process for Obsidian's verison string.
		 *
		 * @param event The literal string `version`.
		 * @returns The current version.
		 */
		sendSync(event: 'version'): string;

		/**
		 * Asks the main process for the path to Obsidian's asar archive.
		 *
		 * @param event The literal string `resources`.
		 * @returns The path to the asar archive.
		 */
		sendSync(event: 'resources'): string;

	};
}

declare global {
	export var electron: Electron | undefined;
}
