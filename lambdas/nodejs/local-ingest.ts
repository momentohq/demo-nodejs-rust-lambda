import {getConfigFromEnvVars, initializeEnvVars, initializeLogging} from './lib/utils';
import {cacheWeatherData} from './lib/weather-cacher';
import {PureNodejsMomentoCache} from './lib/distributed-cache/pure-nodejs-momento-cache';

async function main() {
  initializeEnvVars();
  const envVars = getConfigFromEnvVars();

  const logger = initializeLogging({
    level: envVars.LOG_LEVEL,
    colorize: true,
  });

  const cache = new PureNodejsMomentoCache(logger, envVars.MOMENTO_API_KEY, envVars.MOMENTO_CACHE_NAME);
  await cacheWeatherData(logger, cache);
}

main().catch(e => {
  console.error(e);
  throw e;
});
