'use strict'

import React, { Component, PropTypes } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux'

import * as constants from '../constants.js'
import * as actions from '../actions'

const TEXTINPUT_REF = 'urlInput';

class CommandCenter extends Component {
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
        ]}>Test</Text>
        <TextInput
          ref={TEXTINPUT_REF}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="web-search"
          defaultValue={''}
          onSubmitEditing={this.onSubmitEditing}
          onChange={this.handleTextInputChange}
          clearButtonMode="while-editing"
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

  onSubmitEditing = (event) => {
    this.props.onInputSubmit();
  };

  handleTextInputChange = (event) => {
    console.log('!!!! EVENT', event)
  };
}

CommandCenter.propTypes = {
  mode: PropTypes.string.isRequired,
  onCommandPress: PropTypes.func.isRequired,
}

var styles = StyleSheet.create({
  addressBar: {
  },
  addressBarNavigation: {
    height: 22,
    alignItems: 'center',
  },
  addressBarCommand: {
  },
  urlText: {
    height: 22,
    color: 'white',
    fontSize: 13,
    paddingTop: 2,
  },
  urlTextNavigation: {
  },
  urlTextCommand: {
    height: 0,
  },
  textInput: {
    backgroundColor: '#444',
    color: 'white',
    fontSize: 13,
  },
  textInputNavigation: {
    height: 22,
    opacity: 0,
    backgroundColor: 'transparent',
  },
  textInputCommand: {
    height: 30,
    opacity: 1,
  }
})

export default connect(
  (state, props) => ({
    mode: state.mode,
  }),
  (dispatch) => ({
    onCommandPress: () => dispatch(actions.commandShow()),
    onComandInput: (input) => dispatch(actions.commandInput(input)),
    onInputSubmit: () => dispatch(actions.commandSelect(0)),
  })
)(CommandCenter)
