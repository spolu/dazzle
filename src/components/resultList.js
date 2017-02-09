'use strict'

import React, { Component, PropTypes } from 'react';
import {
  StyleSheet, Image, ListView, View, Text, TouchableHighlight
} from 'react-native';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import { connect } from 'react-redux';

import * as constants from '../constants.js';
import * as actions from '../actions';

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
      <View style={styles.container} >
        <View style={styles.expander} />
        <View style={styles.wrapper}>
          <ListView
            renderScrollComponent={
              props => <InvertibleScrollView {...props} inverted />
            }
            keyboardShouldPersistTaps={'handled'}
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

  _renderType = (result) => {
    switch (result.type) {
      case constants.RESULT_TYPE_URL:
        break;
      case constants.RESULT_TYPE_HISTORY:
        return(
          <Image
            style={styles.type}
            source={{uri: 'http://' + result.domain + '/favicon.ico'}}
          />
        )
      case constants.RESULT_TYPE_SEARCH:
        return(
          <View
            style={styles.type}
          >
          </View>
        )
    }
  }

  _renderRow = (result, sectionID, rowID) => {
    return(
      <TouchableHighlight
        underlayColor={'#ccc'}
        onPress={() => this._onResultPress(rowID, result)}
      >
        <View style={styles.row}>
          {this._renderType(result)}
          <Text
            numberOfLines={1}
            style={styles.url}
          >
            {result.url}
          </Text>
          <Text
            numberOfLines={1}
            style={styles.title}
          >
            {result.title}
          </Text>
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

  row: {
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderTopColor: constants.BLACK_TRANSPARENT,
    height: 44,
    paddingLeft: 15,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  type: {
    width: 16,
    height: 16,
    marginRight: 15,
  },
  url: {
    fontSize: constants.FONT_SIZE,
    color: constants.BLUE,
    marginRight: 5,
  },
  title: {
    fontSize: constants.FONT_SIZE,
    color: constants.WHITE,
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
