import {getConfigFromEnvVars, initializeLogging} from './lib/utils';
import {cacheWeatherData} from './lib/weather-cacher';
import {PureNodejsMomentoCache} from './lib/distributed-cache/pure-nodejs-momento-cache';

export const handler = async () => {
  const envVars = getConfigFromEnvVars();

  const logger = initializeLogging({
    level: envVars.LOG_LEVEL,
    colorize: false,
  });

  const cache = new PureNodejsMomentoCache(logger, envVars.MOMENTO_API_KEY, envVars.MOMENTO_CACHE_NAME);
  await cacheWeatherData(logger, cache);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: '{}',
  };
};
