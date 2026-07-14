const IS_DEV = process.env.NODE_ENV === "development";

function getTimestamp(): string {
  return new Date().toISOString();
}

export const logger = {
  info(message: string, meta?: Record<string, any>) {
    const logObj = {
      level: "INFO",
      timestamp: getTimestamp(),
      message,
      ...meta,
    };
    if (IS_DEV) {
      console.log(`[INFO] [${logObj.timestamp}] ${message}`, meta ? JSON.stringify(meta) : "");
    } else {
      console.log(JSON.stringify(logObj));
    }
  },

  warn(message: string, meta?: Record<string, any>) {
    const logObj = {
      level: "WARN",
      timestamp: getTimestamp(),
      message,
      ...meta,
    };
    if (IS_DEV) {
      console.warn(`[WARN] [${logObj.timestamp}] ${message}`, meta ? JSON.stringify(meta) : "");
    } else {
      console.warn(JSON.stringify(logObj));
    }
  },

  error(message: string, error?: any, meta?: Record<string, any>) {
    const logObj = {
      level: "ERROR",
      timestamp: getTimestamp(),
      message,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      ...meta,
    };
    if (IS_DEV) {
      console.error(`[ERROR] [${logObj.timestamp}] ${message}`, error, meta ? JSON.stringify(meta) : "");
    } else {
      console.error(JSON.stringify(logObj));
    }
  },
};
