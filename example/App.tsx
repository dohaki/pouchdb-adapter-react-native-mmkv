import React from 'react';
import {SafeAreaView, ScrollView} from 'react-native';

import Benchmarks from './components/Benchmarks';
import PouchDBExample from './components/PouchDBExample';

function App() {
  return (
    <SafeAreaView>
      <ScrollView
        style={{padding: 16}}
        contentInsetAdjustmentBehavior="automatic">
        <Benchmarks />
        <PouchDBExample />
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
