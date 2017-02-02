'use strict'

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux'
import KeyboardSpacer from 'react-native-keyboard-spacer';

import * as constants from '../constants.js'

import FullWebView from './fullWebView';
import CommandCenter from './commandCenter';

class LayoutManager extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.webViewContainer,
            this.props.mode == constants.MODE_NAVIGATION &&
            styles.webViewContainerNavigation,
            this.props.mode == constants.MODE_COMMAND &&
            styles.webViewContainerCommand,
          ]}
        >
          <FullWebView />
        </View>
        <View
          style={[
            styles.listContainer,
            this.props.mode == constants.MODE_NAVIGATION &&
            styles.listContainerNavigation,
            this.props.mode == constants.MODE_COMMAND &&
            styles.listContainerCommand,
          ]}
        >
        </View>
        <View
          style={[
            styles.commandCenterContainer,
            this.props.mode == constants.MODE_NAVIGATION &&
            styles.commandCenterContainerNavigation,
            this.props.mode == constants.MODE_COMMAND &&
            styles.commandCenterContainerCommand,
          ]}
        >
          <CommandCenter />
        </View>
        <KeyboardSpacer/>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  listContainer: {
    flex: 0,
    backgroundColor: '#000',
    opacity: 0.5,
  },
  listContainerCommand: {
    flex: 1,
  },

  webViewContainer: {
    flex: 1,
  },
  webViewContainerCommand: {
    position: 'absolute',
    top: 0,
    bottom: 22,
    left: 0,
    right: 0,
  },

  commandCenterContainer: {
    height: 22,
  },
  commandCenterContainerCommand: {
    height: 30,
  },
});

export default connect(
  (state, props) => ({
    mode: state.mode,
  }),
  (dispatch) => ({
  })
)(LayoutManager)
