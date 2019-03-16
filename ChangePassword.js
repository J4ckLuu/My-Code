import React, { Component } from "react";
import { View, Alert, AsyncStorage } from "react-native";
import {
  Container,
  Header,
  Content,
  Input,
  Item,
  Text,
  Button,
  Root
} from "native-base";
import { Font, AppLoading } from "expo";

export default class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      userToken: "",
      current_password: null,
      new_password: null,
      confirm_password: null
    };
  }

  getToken = async () => {
    try {
      const value = await AsyncStorage.getItem("token");
      this.setState({ userToken: value });
    } catch (error) {
      console.log("Error retrieving data" + error);
    }
  };

  componentWillMount() {
    this.getToken();
  }

  changePassword(userToken, currentPassword, newPassword, confirmPassword) {
    if (
      this.state.current_password != null ||
      this.state.new_password != null ||
      this.state.confirm_password != null
    ) {
      const formBody1 = "token=";
      const formBody2 = userToken;
      const formBody3 = "&current_password=";
      const formBody4 = currentPassword;
      const formBody5 = "&new_password=";
      const formBody6 = newPassword;
      const formBody7 = "&confirm_password=";
      const formBody8 = confirmPassword;
      const formBody = formBody1.concat(
        "",
        formBody2,
        formBody3,
        formBody4,
        formBody5,
        formBody6,
        formBody7,
        formBody8
      );
      fetch(
        "https://deployattendancemanagement.herokuapp.com/api/user/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: formBody
        }
      )
        .then(response => response.json())
        .then(res => {
          if (typeof res.message != "undefined") {
            console.log(res.message);
          } else {
            console.log("Success");
            Alert.alert(
              "Success",
              "You have successfully changed your password",
              [
                {
                  text: "OK",
                  onPress: () => console.log(res.message),
                  style: "cancel"
                }
              ],
              { cancelable: false }
            );
          }
        })
        .catch(error => {
          console.error(error);
        })
        .done();
    } else {
      Alert.alert(
        " Error !",
        " Please fill in the form fully. ",
        [
          {
            text: "OK",
            onPress: () => console.log("Cancel"),
            style: "cancel"
          }
        ],
        { cancelable: false }
      );
    }
  }

  updateValue(text, field) {
    if (field == "currentPassword") {
      this.setState({ current_password: text });
    } else if (field == "newPassword") {
      this.setState({ new_password: text });
    } else if (field == "confirmPassword") {
      this.setState({ confirm_password: text });
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <Root>
          <AppLoading />
        </Root>
      );
    }

    return (
      <Container>
        <Content>
          <View style={{ padding: 10 }}>
            <Item regular>
              <Input
                placeholder="current_password"
                onChangeText={text => this.updateValue(text, "currentPassword")}
              />
            </Item>
          </View>

          <View style={{ padding: 10 }}>
            <Item regular>
              <Input
                placeholder="new_password"
                onChangeText={text => this.updateValue(text, "newPassword")}
              />
            </Item>
          </View>

          <View style={{ padding: 10 }}>
            <Item regular>
              <Input
                placeholder="confirm_password"
                onChangeText={text => this.updateValue(text, "confirmPassword")}
              />
            </Item>
          </View>

          <View style={{ padding: 10 }}>
            <Button
              full
              onPress={() =>
                this.changePassword(
                  this.state.userToken,
                  this.state.current_password,
                  this.state.new_password,
                  this.state.confirm_password
                )
              }
            >
              <Text> Change password </Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}
