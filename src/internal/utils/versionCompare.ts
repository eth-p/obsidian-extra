/**
 * Compares two version strings.
 *
 * @param a The first version string.
 * @param b The second version string.
 *
 * @returns -1 if `a<b`, 0 if `a=b`, 1 if `a>b`
 */
export function versionCompare(a: string, b: string): -1 | 0 | 1 {
	const aParts = a.split('.').map((n) => parseInt(n, 10));
	const bParts = b.split('.').map((n) => parseInt(n, 10));

	// Ensure the arrays are the same size.
	const partsSize = Math.max(aParts.length, bParts.length);
	arrayPadEnd(aParts, partsSize, 0);
	arrayPadEnd(bParts, partsSize, 0);

	// Compare each segment.
	for (let i = 0; i < partsSize; i++) {
		if (aParts[i] < bParts[i]) return -1;
		if (aParts[i] > bParts[i]) return 1;
	}

	return 0;
}

function arrayPadEnd<T>(arr: Array<T>, length: number, fill: T) {
	const missing = length - arr.length;
	if (missing > 0) {
		arr.push(...new Array(missing).fill(fill));
	}
}
