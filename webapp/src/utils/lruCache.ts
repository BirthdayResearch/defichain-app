export default class LruCache {
  private static values: Map<string, any> = new Map<string, any>();
  private static maxEntries: number = 2000;

  public static get(key: string): any {
    const hasKey = LruCache.values.has(key);
    let entry: any = null;
    if (hasKey) {
      // peek the entry, re-insert for LRU strategy
      entry = LruCache.values.get(key);
      LruCache.values.delete(key);
      LruCache.values.set(key, entry);
    }

    return entry;
  }

  public static put(key: string, value: any) {
    if (LruCache.values.size >= LruCache.maxEntries) {
      // delete least recently used key from cache
      const keyToDelete = LruCache.values.keys().next().value;

      LruCache.values.delete(keyToDelete);
    }

    LruCache.values.set(key, value);
  }
}
