import React, { Component } from "react";
import {
  AppRegistry,
  ListView,
  Text,
  View,
  AsyncStorage,
  Button
} from "react-native";

var REQUEST_URL =
  "http://deployattendancemanagement.herokuapp.com/api/attendance/list-by-student";

export default class WPReact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userToken: "",
      userID: "",
      results: {
        result: "",
        total_items: "",
        attendance_list_by_student: []
      }
    };
  }

  getToken = async () => {
    try {
      const value = await AsyncStorage.getItem("token");
      this.setState({ userToken: value });
    } catch (error) {
      console.log("Error retrieving token" + error);
    }
  };

  getUserID = async () => {
    try {
      const value = await AsyncStorage.getItem("userID");
      this.setState({ userID: JSON.parse(value) });
    } catch (error) {
      console.log("Error retrieving user ID" + error);
    }
  };

  componentWillMount() {
    this.getToken();
    this.getUserID();
  }

  fetchData(userToken, userID) {
    const formBody1 = "token=";
    const formBody2 = userToken;
    const formBody3 = "&student_id=";
    const formBody4 = userID;
    const formBody = formBody1.concat("", formBody2, formBody3, formBody4);
    fetch(REQUEST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formBody
    })
      .then(response => response.json())
      .then(responseData => {
        if (typeof responseData.message != "undefined") {
          console.log(responseData.message);
        } else {
          console.log(responseData);
          this.setState({
            results: responseData
          });
        }
      })
      .done();
  }

  render() {
    contents = this.state.results.attendance_list_by_student.map(item => {
      return (
        <View style={{padding:10}}>
          <Text> {item.code} </Text>
          <Text> {item.name} </Text>
          <Text> total_stu: 11 | attendance_count: {item.attendance_count} | percentage: {((item.attendance_count/11)*100).toFixed(2)} % </Text>
        </View>
      );
    });
    return (
      <View>
        <View>{contents}</View>
        <Button onPress={() => this.fetchData(this.state.userToken, this.state.userID)} title="Learn More" />
      </View>
    );
  }
}
