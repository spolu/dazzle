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
      <View style={styles.container}>
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
    );
  }

  _onResultPress = (rowID, result) => {
    this.props.onCommandSelect(rowID);
  }

  _renderType = (result) => {
    switch (result.type) {
      case constants.RESULT_TYPE_URL:
        return (
          <Image
            source={require('../../images/search/url_result.png')}
            style={styles.type, styles.typeIcon}
          />
        )
      case constants.RESULT_TYPE_HISTORY:
        return (
          <Image
            style={styles.type}
            source={{uri: 'http://' + result.domain + '/favicon.ico'}}
            defaultSource={require('../../images/search/url_result.png')}
          />
        )
      case constants.RESULT_TYPE_SEARCH:
        return (
          <Image
            source={require('../../images/search/search.png')}
            style={styles.type, styles.typeIcon}
          />
        )
    }
  }

  _renderRow = (result, sectionID, rowID) => {
    return (
      <TouchableHighlight
        underlayColor={constants.BLACK_TRANSPARENT}
        onPress={() => this._onResultPress(rowID, result)}
      >
        <View style={styles.row}>
          {this._renderType(result)}
          <View style={styles.result}>
            {this._renderResult(result.title, result.url)}
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  _rowHasChanged = (r1, r2) => {
    return r1 !== r2;
  }

  _maybeRenderUrl = (url) => {
    if (url.length > 0) {
      return (
        <Text
          numberOfLines={1}
          style={styles.url}
        >
          {url}
        </Text>
      );
    }
  }

  _maybeRenderTitle = (title) => {
    if (title.length > 0) {
      return (
        <Text
          numberOfLines={1}
          style={styles.title}
        >
          {title}
        </Text>
      );
    }
  }

  _renderResult = (title, url) => {
    const titleExists = title.length > 0;
    const urlExists = url.length > 0;

    return (
      <View>
        <Text
          numberOfLines={1}
          style={[
            styles.title,
            !titleExists && styles.noTitle,
          ]}
        >
          {title}
        </Text>
        <Text
          numberOfLines={1}
          style={[
            styles.url,
            !urlExists && styles.noUrl,
            (!titleExists && urlExists) && styles.urlOnly
          ]}
        >
          {url}
        </Text>
      </View>
    );
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

  listView: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  row: {
    borderTopWidth: 0.5,
    borderStyle: 'solid',
    borderTopColor: constants.BLACK_TRANSPARENT,
    height: constants.HEIGHT_CC_COMMAND,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  type: {
    width: 16,
    height: 16,
    margin: 12,
  },
  typeIcon: {
    width: 24,
    height: 24,
    margin: 8,
  },
  result: {
    flexDirection: 'column',
  },

  url: {
    fontSize: constants.FONT_SIZE - 4,
    color: constants.BLUE,
    marginRight: 10,
    marginBottom: 2,
  },
  noUrl: {
    height: 0,
    marginBottom: 0,
  },
  urlOnly: {
    fontSize: constants.FONT_SIZE,
    marginBottom: 0,
  },

  title: {
    fontSize: constants.FONT_SIZE,
    color: constants.WHITE,
  },
  noTitle: {
    height: 0,
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
