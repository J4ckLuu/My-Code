import React from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  Alert,
  AsyncStorage
} from "react-native";
import {
  Button,
  Container,
  Content,
  Form,
  Item,
  Input,
  Label,
  Title
} from "native-base";
import { Root } from "native-base";
import { Font, AppLoading } from "expo";
import { Dropdown } from "react-native-material-dropdown";

export default class SendFeedback extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeText = this.onChangeText.bind(this);
    this.receiverRef = this.updateRef.bind(this, "to_id");
    this.categoryRef = this.updateRef.bind(this, "category");
    this.state = {
      isLoading: true,
      userToken: "",
      title: null,
      content: null,
      to_id: "0",
      category: "1"
    };
  }

  onChangeText(text) {
    ["to_id", "category"]
      .map(name => ({ name, ref: this[name] }))
      .filter(({ ref }) => ref && ref.isFocused())
      .forEach(({ name, ref }) => {
        this.setState({ [name]: text });
      });
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  componentWillMount() {
    this.getToken();
  }

  getToken = async () => {
    try {
      const value = await AsyncStorage.getItem("token");
      this.setState({ userToken: value });
    } catch (error) {
      console.log("Error retrieving data" + error);
    }
  };

  postFeedback(userToken, title, content, to_id, category) {
    if (this.state.title != null && this.state.content != null) {
      const formBody1 = "token=";
      const formBody2 = userToken;
      const formBody3 = "&title=";
      const formBody4 = title;
      const formBody5 = "&content=";
      const formBody6 = content;
      const formBody7 = "&to_id=";
      const formBody8 = to_id;
      const formBody9 = "&category=";
      const formBody10 = category;
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
        formBody10
      );
      fetch(
        "https://deployattendancemanagement.herokuapp.com/api/feedback/send",
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
            Alert.alert(
              " Yay !",
              "Your feedback has been sent.",
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
    if (field == "title") {
      this.setState({ title: text });
    } else if (field == "content") {
      this.setState({ content: text });
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

    let { to_id, category } = this.state;

    return (
      <Container>
        <Content>
          <Form>
            <Title>Feedback Form</Title>
            <View style={{ padding: 20 }}>
              <Dropdown
                onChangeText={this.onChangeText}
                ref={this.receiverRef}
                label="Receiver"
                data={data1}
              />

              <Dropdown
                onChangeText={this.onChangeText}
                ref={this.categoryRef}
                label="Category"
                data={data2}
              />
            </View>

            <Item floatingLabel>
              <Label>Title</Label>
              <Input onChangeText={text => this.updateValue(text, "title")} />
            </Item>

            <Item floatingLabel>
              <Label>Content</Label>
              <Input onChangeText={text => this.updateValue(text, "content")} />
            </Item>

            <View style={{ padding: 20 }}>
              <Button
                full
                onPress={() =>
                  this.postFeedback(
                    this.state.userToken,
                    this.state.title,
                    this.state.content,
                    this.state.to_id,
                    this.state.category
                  )
                }
              >
                <Text>SUBMIT</Text>
              </Button>
            </View>
          </Form>
        </Content>
      </Container>
    );
  }
}

const data1 = [
  { value: 0, label: "Academic Affair" },
  { value: 1, label: "Lecturer T/A" }
];

const data2 = [
  { value: 1, label: "Academic" },
  { value: 2, label: "Facility" }
];
