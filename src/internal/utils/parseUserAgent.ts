/**
 * Parses a user agent string.
 *
 * @param ua The user agent string to parse.
 * @returns A map of user agent identifiers and their version.
 */
export function parseUserAgent(ua: string): Map<string, { version: string; details: string | null }> {
	const REGEX = /([A-Z0-9]+)\/([A-Z0-9_\.\-]+)(?: \(([^)]+)\))? */gi;
	const results = new Map();

	for (let matches; (matches = REGEX.exec(ua)) !== null; ) {
		results.set(matches[1].toLowerCase(), {
			version: matches[2],
			details: matches[3] ?? null,
		});
	}

	return results;
}
