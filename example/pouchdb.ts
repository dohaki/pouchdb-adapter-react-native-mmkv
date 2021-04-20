import PouchDB from '@craftzdog/pouchdb-core-react-native';
import HttpPouch from 'pouchdb-adapter-http';
import replication from 'pouchdb-replication';
import mapreduce from 'pouchdb-mapreduce';

import AsyncStorageAdapter from 'pouchdb-adapter-asyncstorage';
import {MMKV} from 'react-native-mmkv';
import MMKVAdapterFactory from './dist/index';

const MMKVAdapter = MMKVAdapterFactory(MMKV);

export const MMKVPouchDB = PouchDB.plugin(HttpPouch)
  .plugin(replication)
  .plugin(mapreduce)
  .plugin(MMKVAdapter);

export const AsyncStoragePouchDB = PouchDB.plugin(AsyncStorageAdapter);
