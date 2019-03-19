import React, { Component } from "react";
import {
  ActivityIndicator,
  Button,
  Clipboard,
  Image,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AsyncStorage,
  Alert
} from "react-native";
import Dialog from "react-native-dialog";
import { Constants, ImagePicker, Permissions, Camera } from "expo";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userToken: "",
      userID: "",
      userFirstName: "",
      userLastName: "",
      userEmail: "",
      userPhone: "",
      image: "http://i.imgur.com/FTa2JWD.png",
      uploading: false
    };
  }
  componentWillMount() {
    this.getToken();
    this.getUserID();
    this.getFirstN();
    this.getLastN();
    this.getEmail();
    this.getPhone();
    this.getAvatar();
  }
  getToken = async () => {
    try {
      const value = await AsyncStorage.getItem("token");
      this.setState({ userToken: value });
    } catch (error) {
      console.log("Error retrieving data" + error);
    }
  };

  getUserID = async () => {
    try {
      const value = await AsyncStorage.getItem("userID");
      this.setState({ userID: value });
    } catch (error) {
      console.log("Error retrieving data" + error);
    }
  };
  getFirstN = async () => {
    try {
      const value = await AsyncStorage.getItem("firstN");
      this.setState({ userFirstName: JSON.parse(value) });
    } catch (error) {
      console.log("Error retrieving 1stN" + error);
    }
  };
  getLastN = async () => {
    try {
      const value = await AsyncStorage.getItem("lastN");
      this.setState({ userLastName: JSON.parse(value) });
    } catch (error) {
      console.log("Error retrieving lN" + error);
    }
  };
  getEmail = async () => {
    try {
      const value = await AsyncStorage.getItem("email");
      this.setState({ userEmail: JSON.parse(value) });
    } catch (error) {
      console.log("Error retrieving ava" + error);
    }
  };
  getPhone = async () => {
    try {
      const value = await AsyncStorage.getItem("phone");
      this.setState({ userPhone: JSON.parse(value) });
    } catch (error) {
      console.log("Error retrieving ava" + error);
    }
  };
  getAvatar = async () => {
    try {
      const value = await AsyncStorage.getItem("avatar");
      this.setState({ image: JSON.parse(value) });
    } catch (error) {
      console.log("Error retrieving ava" + error);
    }
  };
  render() {
    let { image } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="default" />
        <Button
          onPress={this._pickImage}
          title="Pick an image from camera roll"
        />
        <Button onPress={this._takePhoto} title="Take a photo" />
        {this._maybeRenderImage()}
        {this._maybeRenderUploadingOverlay()}
      </View>
    );
  }
  _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View style={[StyleSheet.absoluteFill, styles.maybeRenderUploading]}>
          <ActivityIndicator color="#fff" size="large" />
        </View>
      );
    }
  };
  _maybeRenderImage = () => {
    let { image } = this.state;

    if (!image) {
      return;
    }

    return (
      <View style={styles.maybeRenderContainer}>
        <View style={styles.maybeRenderImageContainer}>
          <Image source={{ uri: image }} style={styles.maybeRenderImage} />
        </View>

        <Text style={styles.maybeRenderImageText}>{image}</Text>
      </View>
    );
  };
  _takePhoto = async () => {
    const { status: cameraPerm } = await Permissions.askAsync(
      Permissions.CAMERA
    );

    const { status: cameraRollPerm } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    if (cameraPerm === "granted" && cameraRollPerm === "granted") {
      let pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3]
      });

      this._handleImagePicked(pickerResult);
    }
  };
  _pickImage = async () => {
    const { status: cameraRollPerm } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    if (cameraRollPerm === "granted") {
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3]
      });

      this._handleImagePicked(pickerResult);
    }
  };
  _handleImagePicked = async pickerResult => {
    let uploadResponse;

    try {
      this.setState({
        uploading: true
      });

      if (!pickerResult.cancelled) {
        uploadResponse = await uploadImageAsync(
          this.state.userToken,
          this.state.userID,
          this.state.userFirstName,
          this.state.userLastName,
          this.state.userEmail,
          this.state.userPhone,
          pickerResult.uri
        );

        this.setState({
          image: pickerResult.uri
        });
      }
    } catch (e) {
      console.log({ uploadResponse });
      console.log({ e });
      alert("Upload failed, sorry :(");
    } finally {
      this.setState({
        uploading: false
      });
    }
  };
}
async function uploadImageAsync(
  userToken,
  userID,
  userFirstName,
  userLastName,
  userEmail,
  userPhone,
  image
) {
  let apiUrl =
    "https://deployattendancemanagement.herokuapp.com/api/student/update";
  const formBody1 = "token=";
  const formBody2 = userToken;
  const formBody3 = "&id=";
  const formBody4 = userID;
  const formBody5 = "&name=";
  const firstName = userFirstName;
  const lastName = userLastName;
  const formBody6 = firstName.concat(" ", lastName);
  const formBody7 = "&email=";
  const formBody8 = userEmail;
  const formBody9 = "&phone=";
  const formBody10 = userPhone;
  const formBody11 = "&avatar=";
  const formBody12 = image;
  const formBody = formBody1.concat(
    "",
    formBody2,
    formBody3,
    formBody4,
    formBody5,
    formBody6,
    formBody7,
    formBody8,
    formBody9,
    formBody10,
    formBody11,
    formBody12
  );
  let options = {
    method: "PUT",
    body: formBody,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };

  return fetch(apiUrl, options)
    .then(response => response.json())
    .then(res => {
      if (typeof res.success != "undefined") {
        console.log("Error!", "Error: " + res.message);
      } else {
        console.log("Success");
      }
    })
    .catch(error => {
      console.error(error);
    });
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  },
  exampleText: {
    fontSize: 20,
    marginBottom: 20,
    marginHorizontal: 15,
    textAlign: "center"
  },
  maybeRenderUploading: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center"
  },
  maybeRenderContainer: {
    borderRadius: 3,
    elevation: 2,
    marginTop: 30,
    shadowColor: "rgba(0,0,0,1)",
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 4,
      width: 4
    },
    shadowRadius: 5,
    width: 250
  },
  maybeRenderImageContainer: {
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    overflow: "hidden"
  },
  maybeRenderImage: {
    height: 250,
    width: 250
  },
  maybeRenderImageText: {
    paddingHorizontal: 10,
    paddingVertical: 10
  }
});
