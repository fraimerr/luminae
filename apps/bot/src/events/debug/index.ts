import { Logger } from "@zcro/shared/utils/logger";

export default function (message: string) {
	Logger.customLog("DEBUG", message);
}
