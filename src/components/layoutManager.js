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
            styles.overlayView,
            this.props.mode == constants.MODE_COMMAND &&
            styles.overlayViewCommand,
          ]}
        />
        <View
          style={[
            styles.webViewContainer
          ]}
        >
          <FullWebView />
        </View>
        <View
          style={[
            styles.listContainer,
            this.props.mode == constants.MODE_COMMAND &&
            styles.listContainerCommand,
          ]}
        >
        </View>
        <View
          style={[
            styles.commandCenterContainer,
            this.props.mode == constants.MODE_COMMAND &&
            styles.commandCenterContainerCommand,
          ]}
        >
          <CommandCenter />
        </View>
        <KeyboardSpacer
          style={[styles.keyboardSpacer]}
        />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  overlayView: {
    flex: 1,
  },
  overlayViewCommand: {
    flex: 0,
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
    position: 'absolute',
    top: 0,
    bottom: constants.HEIGHT_CC_NAVIGATION,
    left: 0,
    right: 0,
  },

  commandCenterContainer: {
    height: constants.HEIGHT_CC_NAVIGATION,
  },
  commandCenterContainerCommand: {
    height: constants.HEIGHT_CC_COMMAND,
  },

  keyboardSpacer: {
    backgroundColor: '#000',
  },
});

export default connect(
  (state, props) => ({
    mode: state.mode,
  }),
  (dispatch) => ({
  })
)(LayoutManager)
