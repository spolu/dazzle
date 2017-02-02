'use strict';

import * as actions from '../actions'
import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  WebView
} from 'react-native';
import { connect } from 'react-redux'


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
        <WebView
          ref={WEBVIEW_REF}
          automaticallyAdjustContentInsets={false}
          bounces={false}
          style={styles.webView}
          source={{uri: this.state.url}}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          decelerationRate="normal"
          onNavigationStateChange={this.onNavigationStateChange}
          onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
          startInLoadingState={true}
          scalesPageToFit={true}
        />
      </View>
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.url != nextProps.url && nextProps.url != this.state.url) {
      this.setState({
        url: nextProps.url,
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
    this.props.newNavigationState(navState);
  };
}

FullWebView.propTypes = {
  url: PropTypes.string.isRequired,
  newNavigationState: PropTypes.func.isRequired,
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 6,
    overflow: 'hidden',
  },
  webView: {
    flex: 1,
  },
});

export default connect(
  (state, props) => ({
    url: state.url,
  }),
  (dispatch) => ({
    newNavigationState: (navState) => dispatch(actions.navigationState(navState)),
  })
)(FullWebView)

