'use strict'

import React, { Component, PropTypes } from 'react';
import {
  Animated, Easing, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux'

import * as constants from '../constants'
import * as actions from '../actions'

class CommandCenter extends Component {
  state = {
    input: '',
    progress: new Animated.Value(0),
  }

  render() {
    var {height, width} = Dimensions.get('window');
    var progressWidth = this.state.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1 * width],
    });

    return (
      <TouchableOpacity
        onPress={this.props.onCommandPress}
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.addressBar,
            this.props.mode == constants.MODE_NAVIGATION &&
            styles.addressBarNavigation,
            this.props.mode == constants.MODE_COMMAND &&
            styles.addressBarCommand,
          ]}
          onClick={this.onClick}
        >
          <Text style={[
            styles.urlText,
            this.props.mode == constants.MODE_COMMAND &&
            styles.urlTextCommand,
          ]}>{this.props.domain}</Text>
          <Animated.View
            style={[
              styles.progressBar,
              {width: progressWidth},
              this.props.isLoading &&
              styles.progressBarLoading,
              this.props.mode == constants.MODE_COMMAND &&
              styles.progressBarCommand,
            ]}
          />
          <TextInput
            ref={'urlInput'}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="web-search"
            value={this.state.input}
            onSubmitEditing={this.onSubmitEditing}
            onChange={this.handleTextInputChange}
            selectTextOnFocus={true}
            clearButtonMode="never"
            keyboardAppearance="dark"
            style={[
              styles.textInput,
              this.props.mode == constants.MODE_NAVIGATION &&
              styles.textInputNavigation,
              this.props.mode == constants.MODE_COMMAND &&
              styles.textInputCommand,
            ]}
          />
        </View>
      </TouchableOpacity>
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.mode != nextProps.mode) {
      switch (nextProps.mode) {
        case constants.MODE_NAVIGATION:
          this.refs.urlInput.blur();
          break;
        case constants.MODE_COMMAND:
          this.refs.urlInput.focus();
          break;
      }
    }
    // Update the urlInput value if we're in NAVIGATION mode (it will set it to
    // the current URL right before switching to COMMAND mode).
    if (this.props.mode == constants.MODE_NAVIGATION) {
      this.setState({
        input: nextProps.currentURL,
      })
    }

    if (this.props.loadingProgress != nextProps.loadingProgress) {
      Animated.sequence([
        Animated.timing(this.state.progress, {
          easing: Easing.inOut(Easing.ease),
          duration: 200,
          toValue: nextProps.loadingProgress,
        }),
      ]).start();
    }
    if (this.props.isLoading != nextProps.isLoading) {
      if (!nextProps.isLoading) {
        Animated.sequence([
          Animated.delay(300),
          Animated.timing(this.state.progress, {
            easing: Easing.inOut(Easing.ease),
            duration: 0,
            toValue: 0,
          }),
        ]).start();
      }
    }
  }

  onSubmitEditing = (event) => {
    this.props.onCommandSubmit();
  };

  handleTextInputChange = (event) => {
    this.setState({
      input: event.nativeEvent.text,
    })
    this.props.onCommandInput(event.nativeEvent.text);
  };
}

CommandCenter.propTypes = {
  mode: PropTypes.string.isRequired,
  domain: PropTypes.string.isRequired,
  currentURL: PropTypes.string.isRequired,
  isSafe: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  loadingProgress: PropTypes.number.isRequired,
  onCommandPress: PropTypes.func.isRequired,
  onCommandInput: PropTypes.func.isRequired,
  onCommandSubmit: PropTypes.func.isRequired,
}

var styles = StyleSheet.create({
  addressBar: {
    backgroundColor: constants.BLACK,
  },
  addressBarNavigation: {
    height: constants.HEIGHT_CC_NAVIGATION,
    alignItems: 'center',
  },
  addressBarCommand: {
    height: constants.HEIGHT_CC_COMMAND,
  },
  urlText: {
    height: constants.HEIGHT_CC_NAVIGATION,
    paddingTop: 5,
    color: constants.WHITE,
    fontSize: constants.FONT_SIZE,
  },
  urlTextCommand: {
    opacity: 0,
    height: 0,
  },
  textInput: {
    paddingLeft: 10,
    height: constants.HEIGHT_CC_COMMAND - 10,
    backgroundColor: constants.BLACK,
    color: constants.WHITE,
  },
  textInputNavigation: {
    opacity: 0,
  },
  textInputCommand: {
    opacity: 1,
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    height: 0,
    height: 2,
    left: 0,
    backgroundColor: constants.RED,
  },
  progressBarCommand: {
    height: 0,
  },
})

export default connect(
  (state, props) => ({
    mode: state.mode,
    domain: state.domain,
    isSafe: state.isSafe,
    isLoading: state.isLoading,
    loadingProgress: state.loadingProgress,
    currentURL: state.currentURL,
  }),
  (dispatch) => ({
    onCommandPress: () => dispatch(actions.commandShow()),
    onCommandInput: (input) => dispatch(actions.commandInput(input)),
    onCommandSubmit: () => dispatch(actions.commandSelect(0)),
  })
)(CommandCenter)
