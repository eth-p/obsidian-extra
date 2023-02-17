import { App as ObsidianApp } from 'obsidian';
import { App, Latest, Version } from 'obsidian-undocumented';

/**
 * Returns a {@link Window} object for each of the secondary Obsidian windows in the workspace.
 *
 * @param app The Obsidian app.
 * @returns An array of {@link Window}s.
 */
export default function getFloatingWindows<V extends Version = Latest>(app: ObsidianApp): Window[] {
	return (app as App<V>)?.workspace?.floatingSplit?.children?.map((split) => split.win) ?? [];
}
