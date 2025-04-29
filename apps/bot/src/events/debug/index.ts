import { Logger } from "@luminae/shared/utils/logger";

export default function (message: string) {
  Logger.customLog("DEBUG", message);
}
