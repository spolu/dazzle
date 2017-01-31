/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  WebView
} from 'react-native';
import Drawer from 'react-native-drawer';
import FullWebView from './FullWebView';
import Control from './Control';

const CustomStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar backgroundColor={backgroundColor} {...props} />
  </View>
);

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  content: {
    flex: 1,
    backgroundColor: '#33373B',
  },
});

class Slingshot extends React.Component {
  render() {
    return(
      <View style={styles.container}>
        <CustomStatusBar
          backgroundColor="#000"
          barStyle="light-content"
        />
        <Drawer
          type="overlay"
          content={<Control />}
          openDrawerOffset={0}
          closedDrawerOffset={0}
          panCloseMask={0.3}
          panOpenMask={0.3}
          negotiatePan={true}
          styles={drawerStyles}
        >
          <FullWebView />
        </Drawer>
      </View>
    );
  }
}

const drawerStyles = {
    drawer: {},
    main: {},
}


AppRegistry.registerComponent('Slingshot', () => Slingshot);
