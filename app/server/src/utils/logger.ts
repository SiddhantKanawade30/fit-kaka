enum LogLevel {
    DEBUG = "DEBUG",
    INFO = "INFO",
    WARN = "WARN",
    ERROR = "ERROR",
}

class Logger {
    private isDev = process.env.NODE_ENV !== "production";

    private log(level: LogLevel, message: string, data?: any) {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${level}]`;

        if (data) {
            console.log(`${prefix} ${message}`, data);
        } else {
            console.log(`${prefix} ${message}`);
        }
    }

    debug(message: string, data?: any) {
        if (this.isDev) {
            this.log(LogLevel.DEBUG, message, data);
        }
    }

    info(message: string, data?: any) {
        this.log(LogLevel.INFO, message, data);
    }

    warn(message: string, data?: any) {
        this.log(LogLevel.WARN, message, data);
    }

    error(message: string, error?: any) {
        this.log(LogLevel.ERROR, message, error?.message || error);
    }
}

export default new Logger();