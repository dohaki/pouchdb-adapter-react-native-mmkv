import { safeJsonParse, safeJsonStringify } from "pouchdb-json";

function createPrefix(dbName: string) {
  return dbName.replace(/!/g, "!!") + "!"; // escape bangs in dbName
}

function prepareKey(key: string, prefix: string) {
  return (
    prefix +
    key
      .replace(/\u0002/g, "\u0002\u0002")
      .replace(/\u0001/g, "\u0001\u0002")
      .replace(/\u0000/g, "\u0001\u0001")
  );
}

function stringifyValue(value: any) {
  if (value === null || value === undefined) {
    return "";
  }

  return safeJsonStringify(value);
}

function parseValue(value: any) {
  if (typeof value === "string") {
    return safeJsonParse(value);
  }

  return null;
}

export default class MMKVCore {
  private _prefix: string;
  private _mmkv: any;

  constructor(dbName: string, mmkv: any) {
    this._prefix = createPrefix(dbName);
    this._mmkv = mmkv;
  }

  public getKeys(callback: (error: Error | null, keys: string[]) => any) {
    const keys: string[] = [];
    const prefix = this._prefix;
    const prefixLen = prefix.length;

    const allKeys = this._mmkv.getAllKeys();

    for (const fullKey of allKeys) {
      if (fullKey.slice(0, prefixLen) === prefix) {
        keys.push(
          fullKey
            .slice(prefixLen)
            .replace(/\u0001\u0001/g, "\u0000")
            .replace(/\u0001\u0002/g, "\u0001")
            .replace(/\u0002\u0002/g, "\u0002")
        );
      }
    }
    keys.sort();

    callback(null, keys);
  }

  public put(key: string, value: any, callback: (error: Error | null) => any) {
    key = prepareKey(key, this._prefix);

    this._mmkv.set(key, stringifyValue(value));

    callback(null);
  }

  public multiPut(
    pairs: [key: string, value: any][],
    callback: (error: Error | null) => any
  ) {
    pairs = pairs.map(([key, value]) => [
      prepareKey(key, this._prefix),
      stringifyValue(value),
    ]);

    for (const [key, value] of pairs) {
      this._mmkv.set(key, value);
    }

    callback(null);
  }

  public get(key: string, callback: (error: Error | null, value: any) => any) {
    key = prepareKey(key, this._prefix);

    const stringValue = this._mmkv.getString(key);

    callback(null, parseValue(stringValue));
  }

  public multiGet(
    keys: string[],
    callback: (error: Error | null, value: any) => any
  ) {
    keys = keys.map((key) => prepareKey(key, this._prefix));

    const pairs: [key: string, value: any][] = keys.map((key) => [
      key,
      parseValue(this._mmkv.getString(key)),
    ]);

    callback(
      null,
      pairs.map((pair) => pair[1])
    );
  }

  public remove(key: string, callback: (error: Error | null) => any) {
    key = prepareKey(key, this._prefix);
    this._mmkv.delete(key);

    callback(null);
  }

  public multiRemove(keys: string[], callback: (error: Error | null) => any) {
    keys = keys.map((key) => prepareKey(key, this._prefix));

    for (const key of keys) {
      this._mmkv.delete(key);
    }

    callback(null);
  }

  destroy(dbName: string, callback: (error: Error | null) => any) {
    const prefix = createPrefix(dbName);
    const prefixLen = prefix.length;

    const allKeys = this._mmkv.getAllKeys();
    const relevantKeys = allKeys.filter(
      (key) => key.slice(0, prefixLen) === prefix
    );

    for (const key of relevantKeys) {
      this._mmkv.delete(key);
    }

    callback(null);
  }
}
