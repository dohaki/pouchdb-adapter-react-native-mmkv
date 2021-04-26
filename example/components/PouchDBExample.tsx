import React from 'react';
import {Button, View, Text} from 'react-native';

import {MMKVPouchDB} from '../pouchdb';

const mmkvPouchDB = new MMKVPouchDB('test', {adapter: 'mmkv'});

export default function PouchDBExample() {
  const [createdDB, setCreatedDB] = React.useState<null | any>(null);
  const [apiResponse, setAPIResponse] = React.useState<any>();

  React.useEffect(() => {
    mmkvPouchDB.put({
      _id: 'existingDoc',
      testKey: 'testValue',
    });
  }, []);

  async function createDatabase() {
    const newDB = new MMKVPouchDB('other', {adapter: 'mmkv'});
    setCreatedDB(newDB);
    setAPIResponse('Successfully created db');
  }

  async function deleteDatabase() {
    if (createdDB !== null) {
      const response = await createdDB.destroy();
      setAPIResponse(response);
    }
  }

  async function fetchExistingDoc() {
    const existingDoc = await mmkvPouchDB.get('existingDoc');
    setAPIResponse(existingDoc);
  }

  async function createNewDoc() {
    const response = await mmkvPouchDB.put({
      _id: String(Date.now()),
      testKey: 'testValue',
    });
    setAPIResponse(response);
  }

  async function updateExistingDoc() {
    const existingDoc = await mmkvPouchDB.get('existingDoc');
    const response = await mmkvPouchDB.put({
      _id: 'existingDoc',
      _rev: existingDoc._rev,
      updatedKey: Date.now(),
    });
    setAPIResponse(response);
  }

  async function createNewDocWithPost() {
    const response = await mmkvPouchDB.post({
      testKey: 'testValue',
    });
    setAPIResponse(response);
  }

  async function createNewDocAndDelete() {
    const createResponse = await mmkvPouchDB.post({
      testKey: 'testValue',
    });
    const deleteResponse = await mmkvPouchDB.remove(
      createResponse.id,
      createResponse.rev,
    );
    setAPIResponse(deleteResponse);
  }

  async function batchCreateDocs() {
    const id1 = String(Date.now());
    const id2 = String(Date.now() + 1000);

    const response = await mmkvPouchDB.bulkDocs([
      {
        _id: id1,
        testKey: 'testValue1',
      },
      {
        _id: id2,
        testKey: 'testValue2',
      },
    ]);

    setAPIResponse(response);
  }

  async function batchFetchDocs() {
    const response = await mmkvPouchDB.allDocs({
      include_docs: true,
      attachments: true,
    });

    setAPIResponse(response);
  }

  async function getInfo() {
    const response = await mmkvPouchDB.info();

    setAPIResponse(response);
  }

  return (
    <View style={{borderWidth: 1, padding: 16, marginTop: 16}}>
      <Text style={{marginBottom: 16, textAlign: 'center', fontWeight: 'bold'}}>
        PouchDB API
      </Text>
      <View>
        <Text>Last API Response:</Text>
        <View style={{}}>
          <Text>{JSON.stringify(apiResponse, null, 2)}</Text>
        </View>
      </View>
      <Button title="Create new db" onPress={createDatabase} />
      <Button title="Delete created db" onPress={deleteDatabase} />
      <Button title="Fetch existing doc" onPress={fetchExistingDoc} />
      <Button title="Create new doc with db.put()" onPress={createNewDoc} />
      <Button
        title="Update existing doc with db.put()"
        onPress={updateExistingDoc}
      />
      <Button
        title="Create new doc with db.post()"
        onPress={createNewDocWithPost}
      />
      <Button title="Delete doc" onPress={createNewDocAndDelete} />
      <Button title="Batch create" onPress={batchCreateDocs} />
      <Button title="Batch fetch" onPress={batchFetchDocs} />
      <Button title="DB info" onPress={getInfo} />
    </View>
  );
}
