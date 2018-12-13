/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, AsyncStorage, Dimensions} from 'react-native';
import { Scene, Router, Actions } from 'react-native-router-flux';


var device = Dimensions.get('window');
export default class Leaves extends Component<Props> {

  constructor(props){
  super(props);
    this.state={
      data: []
    }
  }

  componentDidMount(){
    Actions.refresh({onRight: ()=> this.takeALeave()})
    this.retrieveLeaveData()

  }

  render() {
    return (
      <FlatList
        data={this.state.data}
        renderItem={({item})=>this.renderListItem(item)}
        keyExtractor={(item, index) => index}
      />
    );
  }


  renderListItem(item){
    return(
      <View style ={
                    {padding: 5,
                      marginTop: 5,
                      marginBottom: 5,
                      backgroundColor: 'orange',
                      borderRadius: 15,
                      width: device.width - 40,
                      alignSelf:'center',
                      shadowOffset:{  width: 10,  height: 5},
                      shadowColor: '#555555',
                      shadowOpacity: 0.45,
                      flexDirection: 'row'}
                    }>
        <View>
          <Text>User ID : </Text>
          <Text>Start Date : </Text>
          <Text>End Date :</Text>
          <Text>Total Leave Day : </Text>
          <Text>Reason of Leave : </Text>
        </View>
        <View>
          <Text>{item.id}</Text>
          <Text>{item.data.start_date}</Text>
          <Text>{item.data.end_date ? item.data.end_date : null}</Text>
          <Text>{item.data.count}</Text>
          <Text>{item.data.reason}</Text>
        </View>
      </View>
    )
  }

  retrieveLeaveData(){
    var tempArray = [];
    var service = this
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (err, stores) => {
        stores.map((result, i, store)=>{
          var key = store[i][0];
          var value = JSON.parse(store[i][1])
          tempArray.push(value)
        })


        service.setState({
          data : tempArray.slice()
        })

      })
    })


  }

  refreshData(){

    this.setState({
      data: []
    })

    this.retrieveLeaveData()
  }

  takeALeave(){
    Actions.requestLeave({refreshData: ()=> this.refreshData()})
  }


}
