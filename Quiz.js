import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  TextInput,
  AsyncStorage,
  Alert,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import Dialog from "react-native-dialog";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      isLoading: true,
      userToken: null,
      quizCode: null,
      userID: null,
      results: {
        title: null,
        class_has_course_id: null,
        is_started: null,
        started_at: null,
        is_randomize_answers: null,
        is_randomize_questions: null,
        required_correct_answers: null,
        code: null,
        created_by: null,
        type: null,
        participants: [],
        questions: []
      },
      options: [],
      answers: [],
      dialogVisible: false
    };
  }

  componentWillMount() {
    this.getToken();
    this.getUserID();
  }

  showDialog = () => {
    this.setState({ dialogVisible: true });
  };

  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };

  getUserID = async () => {
    try {
      const value = await AsyncStorage.getItem("userID");
      this.setState({
        userID: JSON.parse(value)
      });
    } catch (error) {
      console.log("Error retrieving data" + error);
    }
  };

  getToken = async () => {
    try {
      const value = await AsyncStorage.getItem("token");
      this.setState({ isLoading: false, userToken: value });
    } catch (error) {
      console.log("Error retrieving data" + error);
    }
  };

  join = async (userToken, quizCode) => {
    let apiUrl =
      "https://deployattendancemanagement.herokuapp.com/api/quiz/join";
    const formBody1 = "token=";
    const formBody2 = userToken;
    const formBody3 = "&code=";
    const formBody4 = quizCode;
    const formBody = formBody1.concat("", formBody2, formBody3, formBody4);
    let options = {
      method: "POST",
      body: formBody,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };
    fetch(apiUrl, options);
  };

  updated = async (userToken, quizCode) => {
    let apiUrl =
      "https://deployattendancemanagement.herokuapp.com/api/quiz/published";
    const formBody1 = "token=";
    const formBody2 = userToken;
    const formBody3 = "&quiz_code=";
    const formBody4 = quizCode;
    const formBody = formBody1.concat("", formBody2, formBody3, formBody4);
    let options = {
      method: "POST",
      body: formBody,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };
    fetch(apiUrl, options)
      .then(response => response.json())
      .then(res => {
        this.setState({
          results: res.quiz
        });
        for (var i = 0; i < this.state.results.questions.length + 1; i++) {
          this.state.answers.push({
            quiz_question_id: i,
            selected_option: null,
            answered_by: this.state.userID
          });
          console.log(this.state.results);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  save = async (token, quiz, classID) => {
    let apiUrl =
      "https://deployattendancemanagement.herokuapp.com/api/quiz/save";
    const formBody1 = "token=";
    const formBody2 = token;
    const formBody3 = "&quiz=";
    const formBody4 = quiz;
    const formBody5 = "&checked_student_list=";
    const formBody6 = classID;
    const formBody = formBody1.concat(
      "",
      formBody2,
      formBody3,
      formBody4,
      formBody5,
      formBody6
    );
    let options = {
      method: "POST",
      body: formBody,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };
    fetch(apiUrl, options);
  };

  setAns = async index => {
    for (var i = 0; i < this.state.answers.length; i++) {
      this.state.answers[i].selected_option = this.state.options[i];
    }
    let ans = this.state.results.questions[index].answers;
    ans.push(this.state.answers[index]);
  };

  setQuiz = async () => {
    for (var i = 0; i < this.state.results.questions.length; i++) {
      this.setAns(i);
    }
  };

  _handleJoinPressed = async () => {
    this.join(this.state.userToken, this.state.quizCode);
    this.updated(this.state.userToken, this.state.quizCode);
  };

  push = async option => {
    if (this.state.quizCode != null) {
      if (this.state.count < this.state.results.questions.length) {
        this.state.options.push(option);
        this.setState({
          count: this.state.count + 1
        });
      } else if (
        this.state.count != 0 &&
        this.state.count == this.state.results.questions.length
      ) {
        this.setQuiz();
        console.log(this.state.results);
        // this.save(
        //   this.state.userToken,
        //   this.state.results,
        //   this.state.results.class_has_course_id
        // );
      } else {
        alert("Push failed");
      }
    } else {
      alert("Missing quiz code, Make sure you join the quiz!");
    }
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }

    if (this.state.quizCode == null) {
      return (
        <View style={styles.container}>
          <View style={styles.view_button}>
            <TouchableOpacity onPress={this.showDialog} style={styles.button}>
              <Text>Enter quiz code: </Text>
            </TouchableOpacity>
            <Dialog.Container visible={this.state.dialogVisible}>
              <Dialog.Title>Quiz code</Dialog.Title>
              <Dialog.Input
                onChangeText={text => this.setState({ quizCode: text })}
              />
              <Dialog.Button label="Cancel" onPress={this.handleCancel} />
              <Dialog.Button
                label="Enter code"
                onPress={this._handleJoinPressed()}
              />
            </Dialog.Container>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          >
          <View style={styles.view_button}>
            <TouchableHighlight
              style={styles.button}
              onLongPress={this.push("A")}
            >
              <Text> A </Text>
            </TouchableHighlight>
          </View>
          <View style={styles.view_button}>
            <TouchableHighlight
              style={styles.button}
              onLongPress={this.push("B")}
            >
              <Text> B </Text>
            </TouchableHighlight>
          </View>
          <View style={styles.view_button}>
            <TouchableHighlight
              style={styles.button}
              onLongPress={this.push("C")}
            >
              <Text> C </Text>
            </TouchableHighlight>
          </View>
          <View style={styles.view_button}>
            <TouchableHighlight
              style={styles.button}
              onLongPress={this.push("D")}
            >
              <Text> D </Text>
            </TouchableHighlight>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10
  },
  view_button: {
    padding: 10
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  }
});
