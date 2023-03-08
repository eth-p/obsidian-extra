type BufferToStringEncoding = 'utf8' | 'utf-8' | 'hex' | 'base64';

/**
 * https://nodejs.org/api/buffer.html#class-buffer
 */
export declare class Buffer {
	public toString(encoding?: BufferToStringEncoding, start?: number, end?: number): string;
}
