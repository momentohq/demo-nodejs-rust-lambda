import {initializeEnvVars, initializeLogging} from './lib/utils';
import {LineReader} from './lib/line-reader';
import {GzippedUrlLineReader} from './lib/gzipped-url-line-reader';

async function main() {
  const envVars = initializeEnvVars();
  const logger = initializeLogging({
    level: envVars.LOG_LEVEL,
    colorize: true,
  });

  logger.info('Initializing weather data reader');
  const weatherDataReader: LineReader = await GzippedUrlLineReader.create(
    logger,
    'https://napi-rs-demo.s3.us-west-2.amazonaws.com/weather_16.json.gz'
  );
  logger.info('Weather data reader initialized');

  await weatherDataReader.close();
  logger.info('Weather data reader closed');
}

main().catch(e => {
  console.error(e);
  throw e;
});
