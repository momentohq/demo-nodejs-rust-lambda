import {initializeEnvVars, initializeLogging} from './lib/utils';

export const handler = () => {
  const envVars = initializeEnvVars();

  const logger = initializeLogging({
    level: envVars.LOG_LEVEL,
    colorize: false,
  });

  logger.info('Hello, world!');
  logger.debug('Here is a debug message!');

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: '{}',
  };
};
