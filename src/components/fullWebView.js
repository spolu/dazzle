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


var WEBVIEW_REF = 'webview';
var DEFAULT_URL = 'https://stripe.com';

class FullWebView extends React.Component {
  state = {
    url: DEFAULT_URL,
    loading: true,
    scalesPageToFit: true,
  };

  render() {

    return(
      <View style={[styles.container]}>
        <View style={[styles.borderContainer]}>
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
            scalesPageToFit={this.state.scalesPageToFit}
          />
        </View>
        <View style={styles.urlBar}>
          <Text style={styles.urlBarText}>{this.state.url}</Text>
        </View>
      </View>
    );
  }

  onShouldStartLoadWithRequest = (event) => {
    // Implement any custom loading logic here, don't forget to return!
    return true;
  };

  onNavigationStateChange = (navState) => {
    this.setState({
      url: navState.url,
      loading: navState.loading,
      scalesPageToFit: true,
    });
    this.props.newNavigationState(navState);
  };
}

FullWebView.propTypes = {
    newNavigationState: PropTypes.func.isRequired,
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  borderContainer: {
    flex: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  webView: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    height: 350,
  },
  urlBar: {
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
    height: 22,
  },
  urlBarText: {
    color: 'white',
    fontSize: 13,
  },
});

export default connect(
  (state, props) => ({
  }),
  (dispatch) => ({
    newNavigationState: (navState) => dispatch(actions.navigationState(navState)),
  })
)(FullWebView)

