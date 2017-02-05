'use strict';

import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import WKWebView from 'react-native-wkwebview-reborn';

import * as actions from '../actions'
import * as constants from '../constants'

const WEBVIEW_REF = 'webview';
const DEFAULT_URL = 'https://stripe.com';

class FullWebView extends React.Component {
  state = {
    url: DEFAULT_URL,
    loading: true,
  };

  render() {
    return(
      <View style={[styles.container]}>
        <WKWebView
          ref={WEBVIEW_REF}
          automaticallyAdjustContentInsets={false}
          bounces={false}
          source={{uri: this.state.url}}
          decelerationRate="normal"
          onNavigationStateChange={this.onNavigationStateChange}
          onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
          scalesPageToFit={true}
          openNewWindowInWebView={true}
          allowsBackForwardNavigationGestures={true}
          style={styles.webView}
          onLoadEnd={this.onLoadEnd}
          onLoadStart={this.onLoadStart}
          onProgress={this.onProgress}
        />
      </View>
    );
  }

  componentWillReceiveProps(nextProps) {
    // Navigate when we see targetURL change.
    if (this.props.targetURL != nextProps.targetURL &&
      nextProps.targetURL != '') {
      this.setState({
        url: nextProps.targetURL,
      })
    }
  }

  onShouldStartLoadWithRequest = (event) => {
    // Implement any custom loading logic here, don't forget to return!
    return true;
  };

  onNavigationStateChange = (navState) => {
    this.setState({
      url: navState.url,
      loading: navState.loading,
    });
  };

  onLoadEnd = (event) => {
    this.props.loadEnd(event.nativeEvent);
  };

  onLoadStart = (event) => {
    this.props.loadStart(event.nativeEvent);
  };

  onProgress = (progress) => {
    this.props.loadProgress(progress);
  };
}

FullWebView.propTypes = {
  currentURL: PropTypes.string.isRequired,
  targetURL: PropTypes.string.isRequired,
  loadStart: PropTypes.func.isRequired,
  loadEnd: PropTypes.func.isRequired,
  loadProgress: PropTypes.func.isRequired,
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: constants.BLACK,
    overflow: 'hidden',
  },
  webView: {
    flex: 1,
  },
});

export default connect(
  (state, props) => ({
    targetURL: state.targetURL,
    currentURL: state.currentURL,
  }),
  (dispatch) => ({
    loadStart: (navState) => dispatch(actions.loadStart(navState)),
    loadEnd: (navState) => dispatch(actions.loadEnd(navState)),
    loadProgress: (progress) => dispatch(actions.loadProgress(progress)),
  })
)(FullWebView)
