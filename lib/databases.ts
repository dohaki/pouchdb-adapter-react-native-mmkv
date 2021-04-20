import { changesHandler as ChangesHandler, uuid } from "pouchdb-utils";
import { forMeta, toMetaKeys } from "pouchdb-adapter-asyncstorage/src/keys";

import MMKVCore from "./mmkv-core";

// A shared list of database handles
const openDatabases = {};

export const get = (opts, mmkv) =>
  new Promise((resolve, reject) => {
    const resolveResult = (meta) => {
      const result = {
        storage,
        meta: {
          db_uuid: meta[0],
          doc_count: meta[1],
          update_seq: meta[2],
        },
        opts,
        changes: new ChangesHandler(),
      };

      openDatabases[opts.name] = result;
      resolve(result);
    };

    if (opts.name in openDatabases) {
      return resolve(openDatabases[opts.name]);
    }

    const storage = new MMKVCore(opts.name, mmkv);

    storage.multiGet(
      toMetaKeys(["_local_uuid", "_local_doc_count", "_local_last_update_seq"]),
      (error, meta = []) => {
        const [uuidKey, uuidValue] = meta[0];

        if (error) {
          return reject(error);
        }

        if (uuidValue) {
          return resolveResult(meta);
        }

        const id = uuid();
        storage.multiPut(
          [
            [forMeta("_local_uuid"), id],
            [forMeta("_local_doc_count"), 0],
            [forMeta("_local_last_update_seq"), 0],
          ],
          (error) => {
            if (error) return reject(error);

            resolveResult([id, 0, 0]);
          }
        );
      }
    );
  });

export const close = (name) => {
  delete openDatabases[name];
};
