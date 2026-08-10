import chalk from "chalk";
import util from "util";

class Logger {
  // Never log in production builds. `process.env.NODE_ENV` is statically inlined
  // by the bundler to "production" for both client and server bundles, so this
  // guard is reliable in every context (no NEXT_PUBLIC env var needed).
  static isProduction = process.env.NODE_ENV === "production";

  // Enhanced color system with background colors
  static colors = {
    reset: "\x1b[0m",
    // Standard colors
    gray: "\x1b[90m",
    black: "\x1b[30m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    green: "\x1b[32m",
    cyan: "\x1b[36m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    white: "\x1b[37m",
    // Background colors
    bgBlack: "\x1b[40m",
    bgRed: "\x1b[41m",
    bgGreen: "\x1b[42m",
    bgYellow: "\x1b[43m",
    bgBlue: "\x1b[44m",
    bgMagenta: "\x1b[45m",
    bgCyan: "\x1b[46m",
    bgWhite: "\x1b[47m",
    // Bright background colors
    bgBrightBlack: "\x1b[100m",
    bgBrightRed: "\x1b[101m",
    bgBrightGreen: "\x1b[102m",
    bgBrightYellow: "\x1b[103m",
    bgBrightBlue: "\x1b[104m",
    bgBrightMagenta: "\x1b[105m",
    bgBrightCyan: "\x1b[106m",
    bgBrightWhite: "\x1b[107m",
  };

  static getFormattedTime() {
    const now = new Date();
    const options = {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Dhaka", // Use your local time zone here
    };

    const formatter = new Intl.DateTimeFormat("en-US", options);
    return formatter.format(now);
  }

  static formatValue(value) {
    const type = typeof value;

    if (value === null) return chalk.gray("null");

    if (Array.isArray(value) || type === "object") {
      return chalk.yellowBright(
        util.inspect(value, {
          colors: true,
          depth: null,
          compact: false,
          breakLength: 80,
          indent: 2,
        }),
      );
    }

    if (type === "string") return chalk.greenBright(`"${value}"`);
    if (type === "number") return chalk.blueBright(value);
    if (type === "boolean") return chalk.magentaBright(value);

    return chalk.whiteBright(value);
  }

  static colorKey(label) {
    return `${chalk.bold.hex("#4FD6BE")(`→ ${label.padEnd(10)}:`)}`;
  }

  static colorLevel(level) {
    const colorMap = {
      SUCCESS: { bg: Logger.colors.bgGreen, fg: Logger.colors.black },
      ERROR: { bg: Logger.colors.bgRed, fg: Logger.colors.white },
      DEBUG: { bg: Logger.colors.bgBlue, fg: Logger.colors.white },
      WARN: { bg: Logger.colors.bgYellow, fg: Logger.colors.black },
      INFO: { bg: Logger.colors.bgCyan, fg: Logger.colors.black },
      TRACE: { bg: Logger.colors.bgMagenta, fg: Logger.colors.white },
      IMPORTANT: { bg: Logger.colors.bgWhite, fg: Logger.colors.black },
      CRITICAL: { bg: Logger.colors.bgBrightRed, fg: Logger.colors.white },
    };

    const { bg, fg } = colorMap[level] || {
      bg: Logger.colors.bgWhite,
      fg: Logger.colors.black,
    };

    const styledLevel = `${bg}${fg}${level} ${Logger.colors.reset}`;

    return { styledLevel, bg, fg };
  }

  // STEP 2: color the LOGGER: label using the same color
  static colorLoggerLabel(bg, fg) {
    return `${bg}${fg} LOGGER: ${Logger.colors.reset}`;
  }

  static print(level, message, data) {
    // Early return if in production to avoid any logging
    if (Logger.isProduction) return;

    const timeOnly = Logger.getFormattedTime();
    const timestampGray = `${Logger.colors.gray}[${timeOnly}]${Logger.colors.reset}`;

    // Get styled level and raw color info
    const { styledLevel, bg, fg } = Logger.colorLevel(level);

    // Color the LOGGER label with same background/foreground
    const loggerLabel = Logger.colorLoggerLabel(bg, fg);

    const keyLabel = `${Logger.colors.cyan}→ Message   :${Logger.colors.reset}`;
    const valueLabel = `${Logger.colors.cyan}→ Data      :${Logger.colors.reset}`;

    const hasData = data !== undefined && data !== null;
    const isPrimitive =
      typeof data === "string" ||
      typeof data === "number" ||
      typeof data === "boolean" ||
      data === null;

    const formattedData = hasData
      ? Logger.formatValue(data)
      : `${Logger.colors.gray}null${Logger.colors.reset}`;

    console.log("\n");
    console.log(`${timestampGray} ${loggerLabel}${styledLevel}`);
    console.log(`${keyLabel} ${Logger.colors.yellow}${message}${Logger.colors.reset}`);

    if (hasData && isPrimitive) {
      console.log(`${valueLabel} ${formattedData}`);
      console.log("\n");
    } else if (hasData) {
      console.log(`${valueLabel}`);
      console.log("");
      console.log(formattedData);
      console.log("\n");
    } else {
      console.log(`${valueLabel} ${Logger.colors.gray}null${Logger.colors.reset}`);
      console.log("\n");
    }
  }

  // Shorthand log levels
  static success(data, msg = "Success") {
    Logger.print("SUCCESS", msg, data);
  }

  static error(data, msg = "Error") {
    Logger.print("ERROR", msg, data);
  }

  static warn(data, msg = "Warning") {
    Logger.print("WARN", msg, data);
  }

  static info(data, msg = "Info") {
    Logger.print("INFO", msg, data);
  }

  static debug(data, msg = "Debug") {
    Logger.print("DEBUG", msg, data);
  }

  static trace(data, msg = "Trace") {
    Logger.print("TRACE", msg, data);
  }

  static important(data, msg = "Important") {
    Logger.print("IMPORTANT", msg, data);
  }

  static critical(data, msg = "Critical") {
    Logger.print("CRITICAL", msg, data);
  }
}

export default Logger;
