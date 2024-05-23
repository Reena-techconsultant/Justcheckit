
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Dashboard from './src/screens/Dashboard'
import { store } from './src/redux/store';
import { Provider } from 'react-redux';
import StackNavigation from './src/navigation/StackNavigation';
const App = () => {
  return (
    <Provider store={store}>
      <StackNavigation />
    </Provider>
  )
}

export default App
