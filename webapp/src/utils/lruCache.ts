import * as log from './electronLogger';
import Cache from 'lru-cache';
class LruCache {
  private readonly cache;

  constructor() {
    // setting ttl to 2 min
    this.cache = new Cache({
      max: 50000,
      ttl: 1000 * 60 * 2,
    });
  }

  /**
   * @param key {string} of item with 'network' prefixed
   * @return {string | null}
   */
  public get(key: string): any {
    return this.cache.get(key);
  }

  /**
   * @param key {string} of item with 'network' prefixed
   * @param value {any} to set
   * @param ttl {number} TTL
   */
  put(key: string, value: any, ttl?: number): void {
    this.cache.set(key, value, { ttl });
  }

  public clear(): void {
    log.info(`Clearing local cache!`);
    this.cache.reset();
  }
}

export default new LruCache();
