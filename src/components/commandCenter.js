'use strict'

import React, { Component, PropTypes } from 'react';
import {
  Animated, Easing, Dimensions, Image, StyleSheet, Text, TextInput,
  TouchableOpacity, View,
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
            this.props.mode == constants.MODE_COMMAND &&
            styles.addressBarCommand,
          ]}
          onClick={this.onClick}
        >
          <View
            style={[
              styles.urlTextContainer,
              this.props.mode == constants.MODE_COMMAND &&
              styles.urlTextContainerCommand,
            ]}
          >
            <Text
              style={[
                styles.urlText
              ]}
            >
              {this.props.domain}
            </Text>
          </View>

          <View
            style={[
              styles.urlBarContainer,
              this.props.mode == constants.MODE_COMMAND &&
              styles.urlBarContainerCommand,
            ]}
          >
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
              blurOnSubmit={false}
              style={[
                styles.textInput,
              ]}
            />
            <TouchableOpacity
              style={[styles.cancelTouchable]}
              onPress={this.props.onCommandCancel}
              activeOpacity={0.8}
            >
              <Image
                source={require('../../images/search/cross.png')}
                style={[styles.cancelImage]}
                resizeMode={'cover'}
              />
            </TouchableOpacity>
          </View>

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
      if (nextProps.isLoading) {
        Animated.sequence([
          Animated.timing(this.state.progress, {
            easing: Easing.inOut(Easing.ease),
            duration: 200,
            toValue: 0.1 + 0.9 * nextProps.loadingProgress,
          }),
        ]).start();
      }
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
      } else {
        Animated.sequence([
          Animated.timing(this.state.progress, {
            easing: Easing.inOut(Easing.ease),
            duration: 100,
            toValue: 0.1,
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
    height: constants.HEIGHT_CC_NAVIGATION,
  },
  addressBarCommand: {
    height: constants.HEIGHT_CC_COMMAND,
  },

  urlTextContainer: {
    alignItems: 'center',
    height: constants.HEIGHT_CC_NAVIGATION,
  },
  urlTextContainerCommand: {
    height: 0,
  },
  urlText: {
    height: constants.HEIGHT_CC_NAVIGATION,
    color: constants.WHITE,
    fontSize: constants.FONT_SIZE,
    paddingTop: 4,
  },

  urlBarContainer: {
    flexDirection: 'row',
    height: 0,
  },
  urlBarContainerCommand: {
    height: constants.HEIGHT_CC_COMMAND,
  },
  textInput: {
    height: constants.HEIGHT_CC_COMMAND,
    backgroundColor: constants.BLACK,
    paddingLeft: 10,
    color: constants.WHITE,
    flex: 1,
  },

  cancelTouchable: {
    width: 32,
    height: constants.HEIGHT_CC_COMMAND,
    paddingTop: 12,
    paddingLeft: 3,
    backgroundColor: constants.BLACK,
  },
  cancelImage: {
    width: 22,
    height: 22,
  },

  progressBar: {
    position: 'absolute',
    bottom: 0,
    height: 0,
    height: 1,
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
    onCommandCancel: () => dispatch(actions.commandCancel()),
  })
)(CommandCenter)
