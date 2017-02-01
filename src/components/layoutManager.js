'use strict'

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux'

import FullWebView from './fullWebView';
import CommandCenter from './commandCenter';

class LayoutManager extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.listContainer}/>
        <View style={styles.webViewContainer}>
          <FullWebView />
        </View>
        <View style={styles.commandCenterContainer}>
          <CommandCenter />
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  listContainer: {
    height: 0,
  },
  webViewContainer: {
    flex: 1,
  },
  commandCenterContainer: {
    height: 22,
  },
});

export default connect(
  (state, props) => ({
  }),
  (dispatch) => ({
  })
)(LayoutManager)
