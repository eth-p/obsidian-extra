import { App as ObsidianApp } from 'obsidian';
import { App, Latest, Version } from 'obsidian-undocumented';

/**
 * Returns a list of all the file extensions currently supported by Obsidian.
 * This includes the built-in file extensions and any added by plugins.
 *
 * @param app The Obsidian app.
 * @returns An array of file extensions as lower-case strings without leading `.`s.
 */
export default function getRegisteredFileExtensions<V extends Version = Latest>(app: ObsidianApp): string[] {
	return Object.keys((app as App<V>).viewRegistry.typeByExtension);
}
