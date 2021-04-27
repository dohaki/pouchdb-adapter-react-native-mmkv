# pouchdb-adapter-react-native-mmkv

## **EXPERIMENTAL: Still needs proper testing and further optimizations!!!**

## Introduction

This is an **experimental** [PouchDB](https://github.com/pouchdb/pouchdb) adapter for [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv).

## How to Use

### 1. Install `react-native-mmkv`

- https://github.com/mrousavy/react-native-mmkv

### 2. Install `pouchdb^7` compatible to react-native

For example, one of the following:

- https://github.com/craftzdog/pouchdb-react-native
- https://github.com/stockulus/pouchdb-react-native

### 3. Install `pouchdb-adapter-react-native-mmkv`

```
yarn add pouchdb-adapter-react-native-mmkv
```

### 4. Set up in your app

```js
import PouchDB from "@craftzdog/pouchdb-core-react-native";
// OR
import PouchDB from "pouchdb-react-native";

import { MMKV } from "react-native-mmkv";
import MMKVAdapterFactory from "pouchdb-adapter-react-native-mmkv";

const MMKVAdapter = MMKVAdapterFactory(MMKV);

const MMKVPouchDB = PouchDB.plugin(MMKVAdapter);

const myDB = new MMKVPouchDB("myDB", { adapter: "mmkv" });
```

## Development Setup

1. Clone repo and `cd` into it
2. Install dependencies and build lib

```bash
yarn && yarn build
```

3. Run example

```bash
cd example && yarn && react-native run-ios
```
