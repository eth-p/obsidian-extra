import type * as FS_Promises from "./node-fs-promises";
import type * as OS from "./node-os";
import type * as Process from "./node-process";

declare type NodeObsidian = {
	"fs/promises": typeof FS_Promises,
	"process": typeof Process,
	"os": typeof OS,
}

export default NodeObsidian;
