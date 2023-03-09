import NodeModules from "./node";

/**
 * @internal
 *
 * Minimal type definitions for the Electron environment which Obsidian's desktop app runs under.
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

/**
 * The Node `process` module with extensions to the `versions` field to include data provided by Electron.
 */
type ElectronProcess = NodeModules["process"] & {
	versions: NodeModules["process"]["versions"] & {
		chrome?: string;
		electron?: string;
		v8?: string;
	}
}

/**
 * A subset of modules that are available underneath Obsidian's web process.
 *
 * While it would be nice to include the actual `@types/node` definitions, they would become side-effect definitions
 * that leak into the global namespace and present themselves as always available. Using `--noLib` is not a viable
 * solution, since that requires changing the `tsconfig.json` for any package consumers.
 *
 * If this issue ever gets implemented, it may solve this problem.
 * https://github.com/microsoft/TypeScript/issues/50424
 *
 * Until then, any Node modules used by `obsidian-extra` should be manually defined in this directory.
 */
type MODULES = NodeModules & {
	"electron": Electron,
	"process": ElectronProcess,
};

/**
 * Additional global variables that are exposed under Obsidian's web process.
 *
 * These are declared as a separate interface to avoid leaking into the global scope and conflicting with downstream
 * packages that include Node's type definitions.
 */
declare interface ElectronWebProcessGlobals {
	electron?: Electron;
	process?: ElectronProcess;
	require?: <M extends keyof MODULES | string>(name: M) => (M extends keyof MODULES ? MODULES[M] : unknown) | never;
}

export type Global = typeof globalThis & ElectronWebProcessGlobals;
