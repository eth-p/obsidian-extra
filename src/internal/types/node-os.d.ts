export type Architecture = 'x64' | 'arm' | 'arm64';
export type Platform = 'darwin' | 'linux' | 'win32';

/** https://nodejs.org/api/os.html#osmachine */
export const machine: () => Architecture;

/** https://nodejs.org/api/os.html#osplatform */
export const platform: () => Platform;

/** https://nodejs.org/api/os.html#osversion */
export const version: () => string;

/** https://nodejs.org/api/os.html#osrelease */
export const release: () => string;
