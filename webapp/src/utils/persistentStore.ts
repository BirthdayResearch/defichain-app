export default class PersistentStore {
  static get(key: string) {
    return localStorage.getItem(key);
  }

  static set(key: string, value: any) {
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
    return value;
  }
}
