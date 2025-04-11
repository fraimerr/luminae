import { Logger } from "@misu/shared/utils/logger";

export default function (message: string) {
	Logger.customLog("DEBUG", message);
}
