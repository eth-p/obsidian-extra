import { Buffer } from './node-buffer';

declare type ReadFileEncoding = 'utf-8' | 'utf8' | null;

declare interface ReadFileOptionsCommon {
	flag?: string;
	signal?: unknown;
}

declare interface ReadFileOptionsReturnsString extends ReadFileOptionsCommon {
	encoding: Exclude<ReadFileEncoding, null>;
}

declare interface ReadFileOptionsReturnsBuffer extends ReadFileOptionsCommon {
	encoding?: null;
}

/** https://nodejs.org/api/fs.html#fspromisesreadfilepath-options */
export declare function readFile(path: string): Promise<Buffer>;
export declare function readFile(path: string, encoding: null): Promise<Buffer>;
export declare function readFile(path: string, encoding: Exclude<ReadFileEncoding, null>): Promise<string>;
export declare function readFile(path: string, options: ReadFileOptionsReturnsString): Promise<string>;
export declare function readFile(path: string, options: ReadFileOptionsReturnsBuffer): Promise<Buffer>;
