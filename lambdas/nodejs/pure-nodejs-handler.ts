import {initializeEnvVars, initializeLogging} from './lib/utils';
import {LineReader} from './lib/line-reader';
import {GzippedUrlLineReader} from './lib/gzipped-url-line-reader';

export const handler = async () => {
  const envVars = initializeEnvVars();

  const logger = initializeLogging({
    level: envVars.LOG_LEVEL,
    colorize: false,
  });

  logger.info('Initializing weather data reader');
  const weatherDataReader: LineReader = await GzippedUrlLineReader.create(
    logger,
    'https://napi-rs-demo.s3.us-west-2.amazonaws.com/weather_16.json.gz'
  );
  logger.info('Weather data reader initialized');

  await weatherDataReader.close();
  logger.info('Weather data reader closed');

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: '{}',
  };
};
