import type * as FS_Promises from "./node-fs-promises";

declare type NodeObsidian = {
	"fs/promises": typeof FS_Promises,
}

export default NodeObsidian;
