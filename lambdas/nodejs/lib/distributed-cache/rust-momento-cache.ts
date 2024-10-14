import {DistributedCache} from './distributed-cache';
import {NapiRsMomentoCache} from 'napi_rs_momento_cache';

export class RustMomentoCache implements DistributedCache {
  private readonly cache: NapiRsMomentoCache;

  constructor(logLevel: string, momentoApiKey: string, cacheName: string) {
    this.cache = NapiRsMomentoCache.create(logLevel, momentoApiKey, cacheName);
  }

  store(key: string, value: string): Promise<void> {
    return this.cache.store(key, value);
  }

  async retrieve(key: string): Promise<string | undefined> {
    const result = await this.cache.retrieve(key);
    return result === null ? undefined : result;
  }

  flush(): Promise<void> {
    throw new Error('Flush not yet implemented for NapiMomentoCache');
  }

  async close(): Promise<void> {
    // nothing to do
  }
}
