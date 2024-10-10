import {LineReader} from './line-reader/line-reader';
import {GzippedUrlLineReader} from './line-reader/gzipped-url-line-reader';
import * as winston from 'winston';
import {DistributedCache} from './distributed-cache/distributed-cache';

async function cacheWeatherDataPoint(logger: winston.Logger, cache: DistributedCache, line: string): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const dataPoint = JSON.parse(line);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
  const city = dataPoint.city.name as string;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
  const minTemp = dataPoint.main.temp_min as number;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
  const maxTemp = dataPoint.main.temp_max as number;
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  logger.debug(`Caching weather data for ${city}: min=${minTemp}, max=${maxTemp}`);
  await cache.store(city, JSON.stringify({minTemp, maxTemp}));
}

function startWorkers(
  logger: winston.Logger,
  cache: DistributedCache,
  numWorkers: number,
  getLine: () => Promise<string | undefined>
): Promise<number>[] {
  return Array.from({length: numWorkers}, async (_, i) => {
    let lineCount = 0;
    let line = await getLine();
    while (line !== undefined) {
      if (line !== '') {
        await cacheWeatherDataPoint(logger, cache, line);
        lineCount++;
      }
      line = await getLine();
    }
    logger.info(`Worker ${i} finished`);
    return lineCount;
  });
}

export async function cacheWeatherData(logger: winston.Logger, cache: DistributedCache): Promise<void> {
  logger.info('Initializing weather data reader');
  const weatherDataReader: LineReader = await GzippedUrlLineReader.create(
    logger,
    'https://napi-rs-demo.s3.us-west-2.amazonaws.com/weather_16.json.gz'
  );
  logger.info('Weather data reader initialized');

  const numWorkers = 1000;

  const getLine = () => weatherDataReader.readLine();

  logger.info(`Starting ${numWorkers} workers`);
  const workerPromises = startWorkers(logger, cache, numWorkers, getLine);

  logger.info('Waiting for all workers to complete');
  const workerResults = await Promise.all(workerPromises);
  logger.info('All workers completed');

  await weatherDataReader.close();
  logger.info('Weather data reader closed');

  const numWeatherData = workerResults.reduce((acc, count) => acc + count, 0);

  logger.info(`Cached ${numWeatherData} weather data points`);
}
