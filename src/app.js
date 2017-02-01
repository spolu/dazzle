'use strict'

import React, { Component } from 'react';
import { StyleSheet, View, Platform, StatusBar } from 'react-native';

import LayoutManager from './components/layoutManager';

import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import reducer from './reducer';

const store = applyMiddleware(thunk)(createStore)(reducer);

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
            backgroundColor="#000"
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

