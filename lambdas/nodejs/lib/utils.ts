import * as process from 'node:process';
import * as winston from 'winston';
import * as dotenv from 'dotenv';
import * as path from 'node:path';
import * as fs from 'node:fs';

export type LogLevel = 'info' | 'debug';

export interface RequiredEnvVars {
  LOG_LEVEL: LogLevel;
  MOMENTO_API_KEY: string;
  MOMENTO_FLUSH_API_KEY: string;
  MOMENTO_CACHE_NAME: string;
}

export function initializeEnvVars(): void {
  const envFilePath = path.join(__dirname, '..', '..', '..', '..', '.env');
  if (!fs.existsSync(envFilePath)) {
    throw new Error(
      `.env file not found at ${envFilePath}; try copying .env.EXAMPLE to .env and editing it to contain the correct values`
    );
  }
  dotenv.config({path: envFilePath});
}

export function getConfigFromEnvVars(): RequiredEnvVars {
  const logLevel = getRequiredEnvVar('LOG_LEVEL');
  return {
    LOG_LEVEL: logLevel as LogLevel,
    MOMENTO_API_KEY: getRequiredEnvVar('MOMENTO_API_KEY'),
    MOMENTO_FLUSH_API_KEY: getRequiredEnvVar('MOMENTO_FLUSH_API_KEY'),
    MOMENTO_CACHE_NAME: getRequiredEnvVar('MOMENTO_CACHE_NAME'),
  };
}

function getRequiredEnvVar(envVarName: string): string {
  const envVar = process.env[envVarName];
  if (!envVar) {
    throw new Error(`${envVarName} environment variable is required; `);
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
    winston.format.splat(),
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
