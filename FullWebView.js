'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  WebView
} = ReactNative;

var WEBVIEW_REF = 'webview';
var DEFAULT_URL = 'https://stripe.com';

class FullWebView extends React.Component {
  state = {
    url: DEFAULT_URL,
    status: 'NOOP',
    loading: true,
    scalesPageToFit: true,
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
          scalesPageToFit={this.state.scalesPageToFit}
        />
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
      status: navState.title,
      loading: navState.loading,
      scalesPageToFit: true
    });
  };
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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

export default FullWebView;
