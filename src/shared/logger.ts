/* src/shared/logger.ts */
type LogLevel = "debug" | "info" | "warn" | "error";

// type LogMeta = Record<string, unknown>;

interface LogOptions {
  level?: LogLevel;
  context?: string; // ex: "CreateAccountUseCase"
  meta?: LogMeta;
}

// const LEVELS: LogLevel[] = ["debug", "info", "warn", "error"];

// const env = {
//   nodeEnv: process.env.NODE_ENV ?? "development",
//   logLevel: (process.env.LOG_LEVEL as LogLevel) ?? "info",
// };

// function levelToNumber(level: LogLevel): number {
//   return LEVELS.indexOf(level);
// }

// function shouldLog(level: LogLevel): boolean {
//   return levelToNumber(level) >= levelToNumber(env.logLevel);
// }

// function formatError(err: unknown) {
//   if (err instanceof Error) {
//     return {
//       name: err.name,
//       message: err.message,
//       stack: err.stack,
//     };
//   }
//   return { message: String(err) };
// }

// function nowISO(): string {
//   return new Date().toISOString();
// }

// function toJSONPayload(level: LogLevel, msg: string, options?: LogOptions, err?: unknown) {
//   const base = {
//     timestamp: nowISO(),
//     level,
//     message: msg,
//     context: options?.context,
//     ...((options?.meta ?? {}) as object),
//   };

//   if (err !== undefined) {
//     return { ...base, error: formatError(err) };
//   }
//   return base;
// }

// function colorize(level: LogLevel, text: string) {
//   // ANSI colors
//   const colors: Record<LogLevel, string> = {
//     debug: "\x1b[36m", // cyan
//     info: "\x1b[32m", // green
//     warn: "\x1b[33m", // yellow
//     error: "\x1b[31m", // red
//   };
//   const reset = "\x1b[0m";
//   return `${colors[level]}${text}${reset}`;
// }

// function devFormat(level: LogLevel, msg: string, options?: LogOptions, err?: unknown) {
//   const time = nowISO();
//   const ctx = options?.context ? ` [${options.context}]` : "";
//   const meta = options?.meta ? ` ${JSON.stringify(options.meta)}` : "";
//   const errPart = err !== undefined ? ` ${JSON.stringify(formatError(err))}` : "";

//   const line = `${time} ${level.toUpperCase()}${ctx}: ${msg}${meta}${errPart}`;
//   return colorize(level, line);
// }

// function prodFormat(level: LogLevel, msg: string, options?: LogOptions, err?: unknown) {
//   return JSON.stringify(toJSONPayload(level, msg, options, err));
// }

// function emit(level: LogLevel, msg: string, options?: LogOptions, err?: unknown) {
//   if (!shouldLog(level)) return;

//   const line = env.nodeEnv === "production" ? prodFormat(level, msg, options, err) : devFormat(level, msg, options, err);

//   // Transport padrão: console (stdout/stderr)
//   // Você pode trocar/duplicar por um arquivo/HTTP/Datadog/etc.
//   if (level === "error") {
//     console.error(line);
//   } else if (level === "warn") {
//     console.warn(line);
//   } else {
//     console.log(line);
//   }
// }

// API pública
interface LogMeta {
  [key: string]: unknown;
}

interface LogOptions {
  context?: string;
  meta?: LogMeta;
}

export interface ILogger {
  debug: (message: string, options?: LogOptions) => void;
  info: (message: string, options?: LogOptions) => void;
  warn: (message: string, options?: LogOptions) => void;
  error: (message: string, options?: LogOptions & { error?: unknown }) => void;
}

// Função genérica de emissão — imagine que envia o log para console, file, ou sistema externo
function emit(level: "debug" | "info" | "warn" | "error", message: string, options?: LogOptions) {
  const payload = {
    level,
    message,
    context: options?.context ?? "Global",
    meta: options?.meta ?? {},
    ...(level === "error" && "error" in (options ?? {}) ? { error: (options as { error?: unknown }).error } : {}),
    timestamp: new Date().toISOString(),
  };
  if (process.env.NODE_ENV !== "production") {
    switch (level) {
      case "debug":
        console.debug(payload);
        break;
      case "info":
        console.info(payload);
        break;
      case "warn":
        console.warn(payload);
        break;
      case "error":
        console.error(payload);
        break;
      default:
        console.log(payload);
        break;
    }
  }
}

export class Logger {
  static withContext(context: string): ILogger {
    return {
      debug: (message, options) => emit("debug", message, { ...options, context }),
      info: (message, options) => emit("info", message, { ...options, context }),
      warn: (message, options) => emit("warn", message, { ...options, context }),
      error: (message, options) => emit("error", message, { ...options, context }),
    };
  }
}

// export const logger = {
//   setLevel(level: LogLevel) {
//     // permite mudar em runtime se necessário
//     (env as { logLevel: LogLevel }).logLevel = level;
//   },

//   debug(message: string, options?: LogOptions) {
//     emit("debug", message, options);
//   },

//   info(message: string, options?: LogOptions) {
//     emit("info", message, options);
//   },

//   warn(message: string, options?: LogOptions) {
//     emit("warn", message, options);
//   },

//   error(message: string, options?: LogOptions & { error?: unknown }) {
//     emit("error", message, options, options?.error);
//   },

//   // Atalho para logar erro com stack diretamente
//   catch(context: string, err: unknown, meta?: LogMeta) {
//     emit("error", "Unhandled error", { context, meta }, err);
//   },

//   // Cria um logger com contexto fixo
//   withContext(context: string) {
//     return {
//       debug: (message: string, meta?: LogMeta) => emit("debug", message, { context, meta }),
//       info: (message: string, meta?: LogMeta) => emit("info", message, { context, meta }),
//       warn: (message: string, meta?: LogMeta) => emit("warn", message, { context, meta }),
//       error: (message: string, meta?: LogMeta, error?: unknown) => emit("error", message, { context, meta }, error),
//     };
//   },
// };
