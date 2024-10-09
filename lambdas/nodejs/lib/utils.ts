import * as process from 'node:process';
import * as winston from 'winston';

export type LogLevel = 'info' | 'debug';

export interface RequiredEnvVars {
  LOG_LEVEL: LogLevel;
}

export function initializeEnvVars(): RequiredEnvVars {
  const logLevel = getRequiredEnvVar('LOG_LEVEL');
  return {
    LOG_LEVEL: logLevel as LogLevel,
  };
}

function getRequiredEnvVar(envVarName: string): string {
  const envVar = process.env[envVarName];
  if (!envVar) {
    throw new Error(`${envVarName} environment variable is required`);
  }
  return envVar;
}

export interface LoggerProps {
  level: LogLevel;
  colorize: boolean;
}

export function initializeLogging(loggerProps: LoggerProps): winston.Logger {
  const loggerFormat = winston.format.combine(
    loggerProps.colorize ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.timestamp(),
    // winston.format.align(),
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    winston.format.printf(logEntry => `${logEntry.timestamp} ${logEntry.level}: ${logEntry.message}`)
  );
  return winston.createLogger({
    level: loggerProps.level,
    format: loggerFormat,
    transports: [new winston.transports.Console()],
  });
}
