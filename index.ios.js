/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  WebView
} from 'react-native';

import FullWebView from './FullWebView';

const CustomStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar backgroundColor={backgroundColor} {...props} />
  </View>
);

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  content: {
    flex: 1,
    backgroundColor: '#33373B',
  },
});

class Slingshot extends React.Component {
  render() {
    return(
      <View style={styles.container}>
        <CustomStatusBar
          backgroundColor="#000"
          barStyle="light-content"
        />
        <View style={styles.content}>
          <FullWebView />
        </View>
      </View>
    );
  }
}


AppRegistry.registerComponent('Slingshot', () => Slingshot);
