import React from "react";
import {
  FlatList,
  ActivityIndicator,
  StyleSheet,
  View,
  AsyncStorage,
  TouchableOpacity
} from "react-native";
import { Thumbnail, Text, Button } from "native-base";
import { Header, Left, Body, Right, Icon } from "native-base";
import Dialog from "react-native-dialog";


export default class Profile extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {
      userRoleID: "",
      ufirstN: "",
      ulastN: "",
      uphone: "",
      uemail: "",
      uavatar: "http://i.imgur.com/FTa2JWD.png",
      isLoading: true,
      userToken: "",
      current_password: null,
      new_password: null,
      confirm_password: null,
      dialogVisible: false
    };
  }

  showDialog = () => {
    this.setState({ dialogVisible: true });
  };

  componentWillMount() {
    this.getRoleID();
    this.getAvatar();
    this.getFirstN();
    this.getLastN();
    this.getPhone();
    this.getEmail();
    this.getToken();
  }
  getRoleID = async () => {
    try {
      const value = await AsyncStorage.getItem("roleID");
      this.setState({ userRoleID: JSON.stringify(value) });
    } catch (error) {
      console.log("Error retrieving role ID" + error);
    }
  };
  getToken = async () => {
    try {
      const value = await AsyncStorage.getItem("token");
      this.setState({ userToken: value });
    } catch (error) {
      console.log("Error retrieving data" + error);
    }
  };
  getFirstN = async () => {
    try {
      const value = await AsyncStorage.getItem("firstN");
      this.setState({ ufirstN: JSON.parse(value) });
    } catch (error) {
      console.log("Error retrieving 1stN" + error);
    }
  };
  getLastN = async () => {
    try {
      const value = await AsyncStorage.getItem("lastN");
      this.setState({ ulastN: JSON.parse(value) });
    } catch (error) {
      console.log("Error retrieving lN" + error);
    }
  };
  getAvatar = async () => {
    try {
      const value = await AsyncStorage.getItem("avatar");
      this.setState({ uavatar: JSON.parse(value) });
    } catch (error) {
      console.log("Error retrieving ava" + error);
    }
  };
  getPhone = async () => {
    try {
      const value = await AsyncStorage.getItem("phone");
      this.setState({ uphone: JSON.parse(value) });
    } catch (error) {
      console.log("Error retrieving ava" + error);
    }
  };
  getEmail = async () => {
    try {
      const value = await AsyncStorage.getItem("email");
      this.setState({ uemail: JSON.parse(value) });
    } catch (error) {
      console.log("Error retrieving ava" + error);
    }
  };
  changePassword(userToken, currentPassword, newPassword, confirmPassword) {
    if (
      (this.state.current_password != null &&
        this.state.new_password != null &&
        this.state.confirm_password != null) ||
      this.state.currentPassword == this.state.newPassword
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
          if (typeof res.success != "undefined") {
            console.log(res.message);
          } else {
            console.log("Success");
            alert("You have successfully changed your password");
          }
        })
        .catch(error => {
          console.error(error);
        })
        .done();
    } else {
      alert(
        " Please fill in the form fully and please check if current password is equal to new password. "
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
    return (
      <View style={styles.container}>
        <Header
          style={{
            height: 70,
            alignItems: "flex-end",
            justifyContent: "flex-start",
            backgroundColor: "dodgerblue"
          }}
        >
          <Left style={{ alignSelf: "flex-end", marginBottom: 10 }}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => this.props.navigation.goBack()}
            >
              <Icon name="arrow-back" />
            </TouchableOpacity>
          </Left>
          <Body
            style={{
              alignSelf: "flex-end",
              justifyContent: "center",
              marginBottom: 12
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Profile</Text>
          </Body>
          <Right />
        </Header>

        <View style={styles.thumbnail}>
          <Thumbnail large source={{ uri: this.state.uavatar }} />
        </View>

        <FlatList
          data={[
            {
              firstName: this.state.ufirstN,
              lastName: this.state.ulastN,
              email: this.state.uemail,
              phoneNo: this.state.uphone
            }
          ]}
          keyExtractor={item => item.email}
          renderItem={({ item }) => (
            <View>
              <Text style={{ padding: 10, color: "gray" }}>First name</Text>
              <Text style={{ padding: 10 }}>{item.firstName}</Text>
              <Text style={{ padding: 10, color: "gray" }}>Last name</Text>
              <Text style={{ padding: 10 }}>{item.lastName}</Text>
              <Text style={{ padding: 10, color: "gray" }}>Email</Text>
              <Text style={{ padding: 10 }}>{item.email}</Text>
              <Text style={{ padding: 10, color: "gray" }}>PhoneNumber</Text>
              <Text style={{ padding: 10 }}>{item.phoneNo}</Text>
              <View style={{ padding: 10 }}>
                <TouchableOpacity onPress={this.showDialog}>
                  <Text>Show Dialog</Text>
                </TouchableOpacity>
                <Dialog.Container visible={this.state.dialogVisible}>
                  <Dialog.Title>Change password</Dialog.Title>
                  <Dialog.Input
                    onChangeText={text =>
                      this.updateValue(text, "currentPassword")
                    }
                  />

                  <Dialog.Input
                    onChangeText={text => this.updateValue(text, "newPassword")}
                  />

                  <Dialog.Input
                    onChangeText={text =>
                      this.updateValue(text, "confirmPassword")
                    }
                  />
                  <Dialog.Button
                    label="ChangePassword"
                    onPress={() =>
                      this.changePassword(
                        this.state.userToken,
                        this.state.current_password,
                        this.state.new_password,
                        this.state.confirm_password
                      )
                    }
                  />
                </Dialog.Container>
              </View>
            </View>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f2f2",
    flex: 1,
    justifyContent: "center"
  },
  thumbnail: {
    alignItems: "center",
    backgroundColor: "skyblue",
    padding: 10
  }
});
