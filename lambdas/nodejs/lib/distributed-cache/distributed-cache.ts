export interface DistributedCache {
  store: (key: string, value: string) => Promise<void>;
  retrieve: (key: string) => Promise<string | undefined>;
  flush: () => Promise<void>;
  close: () => Promise<void>;
}
