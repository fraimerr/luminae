import { Logger } from "@parallel/shared/utils/logger";

export default function (message: string) {
	Logger.customLog("DEBUG", message);
}
