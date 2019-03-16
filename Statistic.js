import React from "react";
import { FlatList, ActivityIndicator, AsyncStorage, View } from "react-native";
import {
  Container,
  Content,
  Button,
  Card,
  CardItem,
  Text,
  Body
} from "native-base";

export default class FetchExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userToken: "",
      userID: ""
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

  fetch(userToken, userID) {
    const formBody1 = "token=";
    const formBody2 = userToken;
    const formBody3 = "&student_id=";
    const formBody4 = userID;
    const formBody = formBody1.concat("", formBody2, formBody3, formBody4);
    fetch(
      "http://deployattendancemanagement.herokuapp.com/api/attendance/list-by-student",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formBody
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        if (typeof responseJson.message != "undefined") {
          console.log("Error", "Error: " + responseJson.message);
        } else {
          console.log("Hello");
          this.setState(
            {
              isLoading: false,
              dataSource: responseJson.attendance_list_by_student
            },
            function() {}
          );
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
  render() {
    return (
      <Container>
        <Content>
          <View style={{ flex: 1, paddingTop: 20 }}>
            <Card>
              <CardItem>
                <Body>
                  <FlatList
                    data={this.state.dataSource}
                    renderItem={({ item }) => (
                      <Text>
                        {item.code}
                        {item.name}
                      </Text>
                    )}
                    keyExtractor={({ id }, index) => id}
                  />
                </Body>
              </CardItem>
            </Card>
          </View>
          <View style={{ flex: 1, paddingTop: 20 }}>
            <Button
              full
              onPress={() =>
                this.fetch(this.state.userToken, this.state.userID)
              }
            >
              <Text>Primary</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}
