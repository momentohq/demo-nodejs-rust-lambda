/* tslint:disable */
/* eslint-disable */

/* auto-generated by NAPI-RS */

export declare class NapiRsMomentoCache {
  static create(logLevel: string, cacheName: string, momentoApiKey: string): NapiRsMomentoCache
  store(key: string, value: string): Promise<void>
  retrieve(key: string): Promise<string | null>
}