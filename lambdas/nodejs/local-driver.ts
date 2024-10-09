import {initializeEnvVars, initializeLogging} from './lib/utils';

function main() {
  const envVars = initializeEnvVars();
  const logger = initializeLogging({
    level: envVars.LOG_LEVEL,
    colorize: true,
  });
  logger.info('Hello world!');
  logger.debug('Here is a debug message!');
}

main();
