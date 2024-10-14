import {getConfigFromEnvVars, initializeEnvVars, initializeLogging} from './lib/utils';
import {cacheWeatherData} from './lib/weather-cacher';
import {RustMomentoCache} from './lib/distributed-cache/rust-momento-cache';

async function main() {
  initializeEnvVars();
  const envVars = getConfigFromEnvVars();

  const logger = initializeLogging({
    level: envVars.LOG_LEVEL,
    colorize: true,
  });

  const cache = new RustMomentoCache(envVars.LOG_LEVEL, envVars.MOMENTO_API_KEY, envVars.MOMENTO_CACHE_NAME,);
  await cacheWeatherData(logger, cache);
}

main().catch(e => {
  console.error(e);
  throw e;
});
