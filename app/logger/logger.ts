import { createLogger, transports, format } from "winston";
import * as dotenv from "dotenv";
dotenv.config();

const LOGGER_LEVEL = process.env.LOGGER_LEVEL || "debug";

const logger = createLogger({
    level: LOGGER_LEVEL,
    transports: [new transports.Console()],
    format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ timestamp, level, message, metadata }) => {
            return `[${timestamp}] ${level}: ${message}. ${JSON.stringify(
                metadata
            )}`;
        })
    ),
    defaultMeta: {
        service: "dega-api",
    },
});

export { logger };