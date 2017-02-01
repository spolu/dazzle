'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  StyleSheet,
  TextInput,
  View,
} = ReactNative;

var TEXT_INPUT_REF = 'urlInput';

class Control extends React.Component {
  state = {
    url: 'FOO',
  }

  inputText = '';

  render() {
    this.inputText = this.state.url;

    return (
      <View style={[styles.container]}>
        <View style={[styles.addressBarRow]}>
          <TextInput
            ref={TEXT_INPUT_REF}
            autoCapitalize="none"
            defaultValue={this.state.url}
            onSubmitEditing={this.onSubmitEditing}
            onChange={this.handleTextInputChange}
            clearButtonMode="while-editing"
            style={styles.addressBarTextInput}
          />
        </View>
      </View>
    );
  }

  onSubmitEditing = (event) => {
  };

  handleTextInputChange = (event) => {
  };
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addressBarRow: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#000000',
  },
  addressBarTextInput: {
    backgroundColor: '#333',
    borderColor: 'transparent',
    borderRadius: 3,
    borderWidth: 1,
    height: 24,
    paddingLeft: 10,
    paddingTop: 3,
    paddingBottom: 3,
    flex: 1,
    fontSize: 14,
  },
});

export default Control;
