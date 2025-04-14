import log4js from "log4js";
import env from "./env";
const logger = log4js.getLogger();
logger.level = env.LoggerLevel!;
export default logger;
