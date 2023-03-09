export interface DeviceInfo {
	name: string;
	model: string;
	platform: 'ios' | 'android' | 'web';
	osVersion: string;
}

/** https://capacitorjs.com/docs/apis/device#deviceinfo */
export function getInfo(): Promise<DeviceInfo>;
