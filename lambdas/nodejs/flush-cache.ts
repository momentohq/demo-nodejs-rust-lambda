import {getConfigFromEnvVars, initializeEnvVars, initializeLogging} from './lib/utils';
import {PureNodejsMomentoCache} from './lib/distributed-cache/pure-nodejs-momento-cache';

async function main() {
  initializeEnvVars();
  const envVars = getConfigFromEnvVars();

  const logger = initializeLogging({
    level: envVars.LOG_LEVEL,
    colorize: true,
  });
  const cache = new PureNodejsMomentoCache(logger, envVars.MOMENTO_FLUSH_API_KEY, envVars.MOMENTO_CACHE_NAME);
  await cache.flush();
  await cache.close();
}

main().catch(e => {
  console.error(e);
  throw e;
});
