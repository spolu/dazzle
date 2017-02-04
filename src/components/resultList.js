'use strict'

import React, { Component, PropTypes } from 'react';
import {
  StyleSheet, ListView, View, Text, TouchableHighlight
} from 'react-native';
import { connect } from 'react-redux'
import InvertibleScrollView from 'react-native-invertible-scroll-view';

import * as constants from '../constants.js'
import * as actions from '../actions'

class ResultList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: this._rowHasChanged,
      }),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.results !== this.props.results) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.results)
      })
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.expander} />
        <View style={styles.wrapper}>
          <ListView
            renderScrollComponent={
              props => <InvertibleScrollView {...props} inverted />
            }
            style={styles.listView}
            enableEmptySections={true}
            dataSource={this.state.dataSource}
            renderRow={this._renderRow}
          />
        </View>
      </View>
    );
  }

  _onResultPress = (rowID, result) => {
    this.props.onCommandSelect(rowID);
  }

  _renderRow = (result, sectionID, rowID) => {
    return(
      <TouchableHighlight
        underlayColor={'#ccc'}
        onPress={() => this._onResultPress(rowID, result)}
      >
        <View>
          <View>
            <Text>{result.type}</Text>
            <Text>{result.url}</Text>
            <Text>{result.title}</Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  _rowHasChanged = (r1, r2) => {
    return r1 !== r2;
  }
}

ResultList.propTypes = {
  results: PropTypes.array.isRequired,
  onCommandSelect: PropTypes.func.isRequired,
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  expander: {
    flex: 1,
  },
  wrapper: {
    flex: 0,
  },
  listView: {
    backgroundColor: 'transparent',
  },
})

export default connect(
  (state, props) => ({
    results: state.results,
  }),
  (dispatch) => ({
    onCommandSelect: (idx) => dispatch(actions.commandSelect(idx)),
  })
)(ResultList)

