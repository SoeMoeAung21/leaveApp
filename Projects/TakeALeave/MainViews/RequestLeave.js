/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, ScrollView, View, TouchableHighlight, Dimensions, TextInput, Switch, AsyncStorage, Alert} from 'react-native';
import _isEmpty from 'lodash/isEmpty'
import { Scene, Router, Actions } from 'react-native-router-flux';
import moment from 'moment';
import {Calendar} from 'react-native-calendars';

var device = Dimensions.get('window');
var leaveTypes = [
                  {
                    leave_id: 1,
                    leave_type: "Earned"
                  },
                  {
                    leave_id: 2,
                    leave_type: "Casual"
                  },
                  {
                    leave_id: 3,
                    leave_type: "Medical"
                  },
                  {
                    leave_id: 4,
                    leave_type: "Maternity"
                  }
                ]

  const format = 'YYYY-MM-DD'
  const today = moment().format(format)

export default class RequestLeave extends Component<Props> {

  initialState = {
  }

  constructor(props){
    super(props);

    this.state={
      selectedLeaveID: 1,
      start: {},
      end: {},
      period: {},
      checked: false,
      startDaySwitchOn: false,
      endDaySwitchOn: false,
      post: [],
      reasonText : null,
    }
  }

  componentDidMount(){
    Actions.refresh({onRight : () => this.pressRequestLeaveButton()})

  }

  render() {
    return (
      <ScrollView>
      <Calendar
        onDayPress={(day)=>this.setDay(day)}
        markingType='period'
        markedDates={this.state.period}
      />

      <View>
        <View style={{flexDirection: 'row', marginTop: 20,  alignItems: 'center', marginLeft: 30}}>
          <Text>{this.state.start.dateString}</Text>
            { this.state.start.dateString ?
                <View style={{flexDirection: 'row', marginLeft : 60, alignItems: 'center'}}>
                  <Switch onValueChange={()=>this.getStartDayHalfDayOff(this.state.start.dateString)} value={this.state.startDaySwitchOn} /><Text style={{marginLeft: 20}}>Get HalfDay Off?</Text>
                </View>
              : null
            }
        </View>
        <View style={{flexDirection: 'row', marginTop: 20,  alignItems: 'center', marginLeft: 30, marginBottom: 20}}>
          <Text>{this.state.end.dateString}</Text>
          { this.state.end.dateString ?
              <View style={{flexDirection: 'row', marginLeft : 60, alignItems: 'center'}}>
                <Switch onValueChange={(value)=>this.getEndDayHalfDayOff()} value={this.state.endDaySwitchOn} /><Text style={{marginLeft: 20}}>Get HalfDay Off?</Text>
              </View>
            : null
          }
        </View>
      </View>

        <Text style={{marginLeft: 10, fontSize: 20, fontWeight: 'bold'}}>Leave Type</Text>
        <View style={{flexDirection: 'row', marginTop: 10, alignSelf: 'center'}}>
          {this.pickLabel()}
        </View>
        <View>
          <TextInput
            style={{
              height: 100,
              width: device.width - 50,alignSelf: 'center',
              backgroundColor: 'white',
              borderRadius: 10,
              marginTop: 10,
              marginBottom: 10}}
            multiline = {true}
            numberOfLines = {4}
            onChangeText={(reasonText) => this.setState({reasonText})}
            value={this.state.reasonText}
            placeholder= 'Reason'
          />
        </View>

        <TouchableHighlight onPress={()=>this.pressRequestLeaveButton()} underlayColor= 'transparent' style={{marginBottom: 30}}>
        <View style={{alignSelf: 'center', borderColor:'white', borderWidth: 1, borderRadius: 10, width: 180, alignItems: 'center', height: 30, justifyContent: 'center', shadowOffset:{  width: 5,  height: 5}, shadowColor: '#555555', shadowOpacity: 0.45, backgroundColor: 'orange'}}>
          <Text style={{color: 'white'}} >Request Leave/s</Text>
        </View>
        </TouchableHighlight>
      </ScrollView>
    );
  }

  getStartDayHalfDayOff(){
    if (this.state.startDaySwitchOn === true){
      this.setState({
        startDaySwitchOn : false,
      })
    }else{
      this.setState({
        startDaySwitchOn : true,
      })
    }
  }

  getEndDayHalfDayOff(value){
    if (this.state.endDaySwitchOn === true){
      this.setState({
        endDaySwitchOn : false,
      })
    }else{
      this.setState({
        endDaySwitchOn : true,
      })
    }
  }

  pickLabel(){
    return leaveTypes.map((item)=>{
      return (
        <TouchableHighlight onPress={()=>this.pressingLabel(item)} underlayColor= 'transparent'>
        <View style={this.getLabelViewStyle(item.leave_id)}>
          <Text style={this.getLabelTextStyle(item.leave_id)}>{item.leave_type}</Text>
        </View>
        </TouchableHighlight>
      )
    })
  }

  getDateString(timestamp) {
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    let dateString = `${year}-`
    if (month < 10) {
      dateString += `0${month}-`
    } else {
      dateString += `${month}-`
    }
    if (day < 10) {
      dateString += `0${day}`
    } else {
      dateString += day
    }

    return dateString
  }

  getPeriod(startTimestamp, endTimestamp) {
    const period = {}
    let currentTimestamp = startTimestamp
    while (currentTimestamp < endTimestamp) {
      const dateString = this.getDateString(currentTimestamp)
      period[dateString] = {
        color: 'green',
        startingDay: currentTimestamp === startTimestamp,
      }
      currentTimestamp += 24 * 60 * 60 * 1000
    }
    const dateString = this.getDateString(endTimestamp)
    period[dateString] = {
      color: 'green',
      endingDay: true,
    }
    return period
  }

  setDay(dayObj) {
    const { start, end } = this.state
    const {
      dateString, day, month, year,
    } = dayObj
    // timestamp returned by dayObj is in 12:00AM UTC 0, want local 12:00AM
    const timestamp = new Date(year, month - 1, day).getTime()
    const newDayObj = { ...dayObj, timestamp }
    // if there is no start day, add start. or if there is already a end and start date, restart
    const startIsEmpty = _isEmpty(start)
    if (startIsEmpty || !startIsEmpty && !_isEmpty(end)) {
      const period = {
        [dateString]: {
          color: 'green',
          endingDay: true,
          startingDay: true,
        },
      }
      this.setState({ start: newDayObj, period, end: {} })
    } else {
      // if end date is older than start date switch
      const { timestamp: savedTimestamp } = start
      if (savedTimestamp > timestamp) {
        const period = this.getPeriod(timestamp, savedTimestamp)
        this.setState({ start: newDayObj, end: start, period })
      } else {
        const period = this.getPeriod(savedTimestamp, timestamp)
        this.setState({ end: newDayObj, start, period })
      }
    }
  }

  getLabelViewStyle(key){
  var tempWidth= (device.width/4) - 10;
  var tempHeight= 40;
  var tempBGC = 'gray';

  if (this.state.selectedLeaveID === key){
    tempWidth= (device.width/4),
    tempHeight= 45,
    tempBGC= '#2B0079'
  }
  return(
    {
      backgroundColor: tempBGC,
      width: tempWidth,
      height: tempHeight,
      justifyContent:'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'white',
      borderRadius: 10,
      shadowOffset:{  width: 5,  height: 5},
      shadowColor: '#555555',
      shadowOpacity: 0.45,
    }
  )
}

getLabelTextStyle(key){
  var tempColor = 'white';
  var tempFontSize = 20

  if (this.state.selectedLeaveID === key){
    tempColor = 'white',
    tempFontSize = 22
  }
  return(
    {
      fontWeight: 'bold',
      fontFamily: 'Cochin',
      color: tempColor,
      fontSize: tempFontSize,
    }
  )
}

pressingLabel(item){
    this.setState({
      selectedLeaveID : item.leave_id
    })
    if(item.leave_id === 1){
      this.setState({
        selectedLeaveID : item.leave_id
      })
    }else if(item.leave_id === 2){
      this.setState({
        selectedLeaveID : item.leave_id
      })
    }else if (item.leave_id === 3 ) {
      this.setState({
        selectedLeaveID : item.leave_id
      })
    }else {
      this.setState({
        selectedLeaveID : item.leave_id
      })
    }

  }

  pressRequestLeaveButton(){
    if(!this.state.reasonText || !this.state.start.dateString){
      alert('Please complete the form to request leave/s.')
    }else{
      let totalLeaveDays = null
      if (this.state.start.dateString && this.state.end.dateString){

        totalLeaveDays = moment(this.state.end.dateString).diff(this.state.start.dateString, 'days');
        totalLeaveDays++;
        this.setState({
          totalLeaveCount: totalLeaveDays
        })
        console.log(totalLeaveDays);
      }
      else{
        totalLeaveDays = 1
        this.setState({
          totalLeaveCount: totalLeaveDays
        })
        console.log('-----no end date-----');
        console.log(totalLeaveDays);
      }
      //total count between date

      let halfDayLeaves = []
      if(this.state.startDaySwitchOn){
        halfDayLeaves.push(this.state.start.dateString)
        totalLeaveDays = totalLeaveDays - 0.5
      }
      if(this.state.endDaySwitchOn){
        halfDayLeaves.push(this.state.end.dateString)
        totalLeaveDays = totalLeaveDays - 0.5
      }

      this.sendingRequest(totalLeaveDays, halfDayLeaves)
    }
  }

    sendingRequest(totalLeaveDays, halfDayLeaves){
      console.log('*******Sending Request**********');
      console.log(totalLeaveDays);
      console.log(halfDayLeaves);
      console.log('*****************');

        fetch('http://163.44.158.66:9705/xan-poc/rest/leaveRequest', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "leave_id": this.state.selectedLeaveID,
            "start_date": this.state.start.dateString,
            "end_date": this.state.end.dateString ? this.state.end.dateString : this.state.start.dateString,
            "reason": this.state.reasonText,
            "count":  totalLeaveDays,
            "half_day": halfDayLeaves
          }),
        }).then((response) => response.json())
          .then((responseJson) => {
          console.log("$$$$$$$$$$$$$$");
          console.log(responseJson.data);
          console.log("$$$$$$$$$$$$$$");
          if(responseJson.status === 'SUCCESS'){
            this.saveData(responseJson)
          }else{
            alert(responseJson.message)
          }
      });
    }

  saveData(responseJson){
    var leaveData = {}
    var date = new Date().valueOf();
    leaveData.id = 'id' + date
    leaveData.data = responseJson.data

    AsyncStorage.setItem(leaveData.id, JSON.stringify(leaveData), () => {
        Alert.alert(
          'Notice!',
          'Success Leave Request',
          [
            {text: 'Okay', onPress: ()=>{ Actions.pop(); }}
          ],
          {cancelable: false}
        )
      }
    )
  }

}//end of class



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
