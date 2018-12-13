/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { Scene, Router, Actions } from 'react-native-router-flux';

import Leaves from './MainViews/Leaves';
import RequestLeave from './MainViews/RequestLeave';

export default class App extends Component<Props> {
  render() {
    return (
      <Router>
        <Scene key ='root'>
          <Scene key ='leaves'  component={Leaves} initial={true} title='Leaves' onRight={()=>{this.takeALeave()}} rightTitle='Request' />
          <Scene key ='requestLeave'  component={RequestLeave} title='Request Leave/s' />
        </Scene>
      </Router>
    );
  }

  takeALeave(){
    Actions.requestLeave()
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
