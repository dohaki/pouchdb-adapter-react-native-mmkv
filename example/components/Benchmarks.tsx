import React from 'react';
import {Button, View, TextInput, Text} from 'react-native';

import {AsyncStoragePouchDB, MMKVPouchDB} from '../pouchdb';

const mmkvPouchDB = new MMKVPouchDB('benchmarks', {adapter: 'mmkv'});

const asyncStoragePouchDB = new AsyncStoragePouchDB('benchmarks', {
  adapter: 'asyncstorage',
});

export default function Benchmarks() {
  const [numOfDocs, setNumOfDocs] = React.useState('1000');
  const [numOfAllDocs, setNumOfAllDocs] = React.useState(0);

  const [asyncStorageBenchmarks, setAsyncStorageBenchmarks] = React.useState({
    allDocs: 0,
    query: 0,
  });
  const [mmkvBenchmarks, setMMKVBenchmarks] = React.useState({
    allDocs: 0,
    query: 0,
  });

  React.useEffect(() => {
    mmkvPouchDB
      .allDocs({
        include_docs: true,
        attachments: true,
      })
      .then((docs: any) => {
        setNumOfAllDocs(docs.rows.length);
      })
      .catch((error: any) => {
        console.error('mmkvPouchDB', error);
      });
  }, []);

  async function runBenchmarks() {
    let startTime: number, endTime: number;

    try {
      startTime = Date.now();
      await mmkvPouchDB.allDocs({
        include_docs: true,
        attachments: true,
      });
      endTime = Date.now();
      setMMKVBenchmarks(prev => ({
        ...prev,
        allDocs: endTime - startTime,
      }));

      startTime = Date.now();
      await asyncStoragePouchDB.allDocs({
        include_docs: true,
        attachments: true,
      });
      endTime = Date.now();
      setAsyncStorageBenchmarks(prev => ({
        ...prev,
        allDocs: endTime - startTime,
      }));
    } catch (error) {
      console.error(error);
    }
  }

  async function createDocs() {
    try {
      const docsToPost = Array(Number(numOfDocs)).fill({
        string: 'string',
        num: 123456789,
        timestamp: Date.now(),
        json: {
          nestedKey: 'nestedValue',
        },
        array: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      });

      await Promise.all([
        asyncStoragePouchDB.bulkDocs(docsToPost),
        mmkvPouchDB.bulkDocs(docsToPost),
      ]);

      const {rows} = await mmkvPouchDB.allDocs({
        include_docs: true,
        attachments: true,
      });

      setNumOfAllDocs(rows.length);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={{borderWidth: 1, padding: 16}}>
      <Text style={{marginBottom: 16, textAlign: 'center', fontWeight: 'bold'}}>
        Benchmarks
      </Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text>Num. of docs in each "benchmarks" DB</Text>
        <Text>{numOfAllDocs}</Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text>Num. of docs to create:</Text>
        <TextInput
          value={numOfDocs}
          onChangeText={changedText => setNumOfDocs(changedText)}
        />
        <Button title="Create" onPress={createDocs} />
      </View>

      <View>
        <Button title="Run benchmarks" onPress={runBenchmarks} />
        <View>
          <Text style={{textAlign: 'center'}}>AsyncStorage:</Text>
          <Text>{JSON.stringify(asyncStorageBenchmarks, null, 2)}</Text>
        </View>
        <View>
          <Text style={{textAlign: 'center'}}>MMKV:</Text>
          <Text>{JSON.stringify(mmkvBenchmarks, null, 2)}</Text>
        </View>
      </View>
    </View>
  );
}
