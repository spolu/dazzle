'use strict'

import React, { Component } from 'react';
import {
  AsyncStorage, StyleSheet, View, Platform, StatusBar,
} from 'react-native';

import LayoutManager from './components/layoutManager';

import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { persistStore, autoRehydrate } from 'redux-persist'
import thunk from 'redux-thunk'

import reducer from './reducer';
import * as constants from './constants';

const store = compose(
  applyMiddleware(thunk),
  autoRehydrate(),
)(createStore)(reducer);

// Begin periodically persisting the store.
persistStore(store, {storage: AsyncStorage});

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

const CustomStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar backgroundColor={backgroundColor} {...props} />
  </View>
);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <CustomStatusBar
            backgroundColor={constants.BLACK}
            barStyle="light-content"
          />
          <LayoutManager/>
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  container: {
    flex: 1,
  },
});

