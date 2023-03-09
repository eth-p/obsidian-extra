type ProcessArchitecture = 'x64' | 'arm' | 'arm64';
type ProcessPlatform = 'darwin' | 'linux' | 'win32';
type NodeVersion = string;


/** https://nodejs.org/api/process.html#processarch */
export const arch: ProcessArchitecture;

/** https://nodejs.org/api/process.html#processplatform */
export const platform: ProcessPlatform;

/** https://nodejs.org/api/process.html#processversion */
export const version: NodeVersion;

/** https://nodejs.org/api/process.html#processversions */
export const versions: Record<string, string> & {
	node: string;
}
