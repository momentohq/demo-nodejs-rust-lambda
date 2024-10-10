import {getConfigFromEnvVars, initializeEnvVars, initializeLogging} from './lib/utils';
import {PureNodejsMomentoCache} from './lib/distributed-cache/pure-nodejs-momento-cache';
import * as winston from 'winston';
import {DistributedCache} from './lib/distributed-cache/distributed-cache';

async function logWeatherData(logger: winston.Logger, cache: DistributedCache, city: string) {
  const weather = await cache.retrieve(city);
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  logger.info(`${city} weather: ${weather}`);
}

async function main() {
  initializeEnvVars();
  const envVars = getConfigFromEnvVars();

  const logger = initializeLogging({
    level: envVars.LOG_LEVEL,
    colorize: true,
  });
  const cache = new PureNodejsMomentoCache(logger, envVars.MOMENTO_API_KEY, envVars.MOMENTO_CACHE_NAME);
  await logWeatherData(logger, cache, 'San Francisco');
  await logWeatherData(logger, cache, 'Seattle');
  await logWeatherData(logger, cache, 'Portland');
  await logWeatherData(logger, cache, 'Austin');

  await cache.close();
}

main().catch(e => {
  console.error(e);
  throw e;
});
