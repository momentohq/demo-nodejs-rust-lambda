import {DistributedCache} from './distributed-cache';
import * as winston from 'winston';
import {
  CacheClient,
  CacheGetResponse,
  CacheSetResponse,
  Configurations,
  CredentialProvider,
  FlushCacheResponse,
  ICacheClient,
} from '@gomomento/sdk';

export class PureNodejsMomentoCache implements DistributedCache {
  private readonly logger: winston.Logger;
  private readonly cacheClient: ICacheClient;
  private readonly cacheName: string;

  constructor(logger: winston.Logger, momentoApiKey: string, cacheName: string) {
    logger.info('Instantiating Momento CacheClient');
    this.logger = logger;
    this.cacheClient = new CacheClient({
      configuration: Configurations.InRegion.Default.latest().withNumConnections(10),
      defaultTtlSeconds: 60 * 5,
      credentialProvider: CredentialProvider.fromString(momentoApiKey),
    });
    this.cacheName = cacheName;
  }

  async store(key: string, value: string): Promise<void> {
    this.logger.debug("Caching key '%s' with value '%s'", key, value);
    const response = await this.cacheClient.set(this.cacheName, key, value);
    switch (response.type) {
      case CacheSetResponse.Success:
        return;
      case CacheSetResponse.Error:
        throw response.innerException();
    }
  }

  async retrieve(key: string): Promise<string | undefined> {
    const response = await this.cacheClient.get(this.cacheName, key);
    switch (response.type) {
      case CacheGetResponse.Miss:
        return undefined;
      case CacheGetResponse.Hit:
        return response.value();
      case CacheGetResponse.Error:
        throw response.innerException();
    }
  }

  async flush(): Promise<void> {
    const response = await this.cacheClient.flushCache(this.cacheName);
    switch (response.type) {
      case FlushCacheResponse.Success:
        this.logger.info('Cache flushed');
        return;
      case FlushCacheResponse.Error:
        throw response.innerException();
    }
  }

  close(): Promise<void> {
    this.cacheClient.close();
    this.logger.info('PureNodeJsMomentoCache closed');
    return Promise.resolve();
  }
}
