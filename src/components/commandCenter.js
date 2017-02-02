'use strict'

import React, { Component, PropTypes } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux'

import * as constants from '../constants.js'
import * as actions from '../actions'

class CommandCenter extends Component {
  state = {
    input: '',
  }

  render() {
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
          this.props.mode == constants.MODE_NAVIGATION &&
          styles.urlTextNavigation,
          this.props.mode == constants.MODE_COMMAND &&
          styles.urlTextCommand,
        ]}>{this.props.domain}</Text>
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
        input: nextProps.url,
      })
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
  url: PropTypes.string.isRequired,
  safe: PropTypes.bool.isRequired,
  onCommandPress: PropTypes.func.isRequired,
  onCommandInput: PropTypes.func.isRequired,
  onCommandSubmit: PropTypes.func.isRequired,
}

var styles = StyleSheet.create({
  addressBar: {
    backgroundColor: '#000'
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
    color: 'white',
    fontSize: 15,
    paddingTop: 5,
    fontWeight: '600',
  },
  urlTextNavigation: {
  },
  urlTextCommand: {
    opacity: 0,
    height: 0,
  },
  textInput: {
    height: constants.HEIGHT_CC_COMMAND-10,
    backgroundColor: '#000',
    paddingLeft: 10,
    color: 'white',
    fontSize: 15,
  },
  textInputNavigation: {
    opacity: 0,
  },
  textInputCommand: {
    opacity: 1,
  }
})

export default connect(
  (state, props) => ({
    mode: state.mode,
    domain: state.domain,
    safe: state.safe,
    url: state.url,
  }),
  (dispatch) => ({
    onCommandPress: () => dispatch(actions.commandShow()),
    onCommandInput: (input) => dispatch(actions.commandInput(input)),
    onCommandSubmit: () => dispatch(actions.commandSelect(0)),
  })
)(CommandCenter)
