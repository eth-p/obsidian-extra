import { App as ObsidianApp } from 'obsidian';
import { Latest, Version } from 'obsidian-undocumented';

import fetchObsidianStyleSheet from './fetchObsidianStyleSheet';

/**
 * Fetches the contents of the stylesheet(s) used by Obsidian.
 * If this fails (e.g. unsupported environment), an error will be thrown.
 *
 * @param app The Obsidian app.
 * @returns The CSS stylesheet contents.
 * 
 * @deprecated Prefer {@link fetchObsidianStyleSheet}, which can return metadata.
 */
export default async function fetchObsidianStyles<V extends Version = Latest>(app: ObsidianApp): Promise<string> {
	return fetchObsidianStyleSheet(app).then(({cssText}) => cssText);
}
