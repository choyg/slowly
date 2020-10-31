import pino from "pino";

const options: pino.LoggerOptions & { dest: string | number } = {
  level: "debug",
  timestamp: false,
  dest: process.env.NODE_ENV === "development" ? 1 : 1,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Logger = pino(pino.destination(options as any));
