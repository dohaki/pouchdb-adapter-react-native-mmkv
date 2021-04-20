/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Button,
  View,
  TextInput,
  Text,
} from 'react-native';

import {AsyncStoragePouchDB, MMKVPouchDB} from './pouchdb';

const mmkvPouchDB = new MMKVPouchDB('mydb', {adapter: 'mmkv'});
const asyncStoragePouchDB = new AsyncStoragePouchDB('mydb', {
  adapter: 'asyncstorage',
});

function App() {
  const [numOfDocs, setNumOfDocs] = React.useState('100');
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
      .catch((error: any) => console.error(error));
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

  return (
    <SafeAreaView>
      <ScrollView
        style={{padding: 16}}
        contentInsetAdjustmentBehavior="automatic">
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>Num. of all docs in each DB</Text>
          <Text>{numOfAllDocs}</Text>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>Num. of docs to create:</Text>
          <TextInput
            value={numOfDocs}
            onChangeText={changedText => setNumOfDocs(changedText)}
          />
          <Button
            title="POST"
            onPress={async () => {
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
                  await asyncStoragePouchDB.bulkDocs(docsToPost),
                  await mmkvPouchDB.bulkDocs(docsToPost),
                ]);
              } catch (error) {
                console.error(error);
              }
            }}
          />
        </View>

        <View>
          <Button title="Run benchmarks" onPress={() => runBenchmarks()} />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text>AsyncStorage:</Text>
            <Text>{JSON.stringify(asyncStorageBenchmarks)}</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text>MMKV:</Text>
            <Text>{JSON.stringify(mmkvBenchmarks)}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
