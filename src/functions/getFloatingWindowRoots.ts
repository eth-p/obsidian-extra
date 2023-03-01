import { App as ObsidianApp } from 'obsidian';
import { App, Latest, Version } from 'obsidian-undocumented';

/**
 * Get all the workspace root nodes for the secondary Obsidian windows in the workspace.
 *
 * @param app The Obsidian app.
 * @returns The workspace roots.
 */
export default function getFloatingWindowRoots<V extends Version = Latest>(app: ObsidianApp): HTMLDivElement[] {
	return (app as App<V>).workspace.floatingSplit?.children?.map((split) => split.rootEl) ?? [];
}
