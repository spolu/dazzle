'use strict'

import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux'
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { BlurView, VibrancyView } from 'react-native-blur';

import * as constants from '../constants.js'

import FullWebView from './fullWebView';
import CommandCenter from './commandCenter';
import ResultList from './resultList';

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
        <BlurView
          style={[
            styles.vibrancyContainer,
            this.props.mode == constants.MODE_COMMAND &&
              styles.vibrancyContainerCommand,
          ]}
          blurType={"dark"}
          blurAmount={20}
        >
          <View
            style={[
              styles.listContainer,
              this.props.mode == constants.MODE_COMMAND &&
                styles.listContainerCommand,
            ]}
          >
            <ResultList />
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
        </BlurView>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: constants.BLACK,
  },

  overlayView: {
    flex: 1,
  },
  overlayViewCommand: {
    flex: 0,
  },

  vibrancyContainer: {
    flex: 0,
    height: constants.HEIGHT_CC_NAVIGATION,
  },
  vibrancyContainerCommand: {
    flex: 1,
  },

  listContainer: {
    height: 0,
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
    backgroundColor: constants.BLACK,
  },
});

export default connect(
  (state, props) => ({
    mode: state.mode,
  }),
  (dispatch) => ({
  })
)(LayoutManager)
