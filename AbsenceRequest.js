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
import CalendarPicker from "react-native-calendar-picker";

export default class AbsenceRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      userToken: "",
      userID: "",
      reason: null,
      selectedStartDate: null,
      selectedEndDate: null
    };
    this.onDateChange = this.onDateChange.bind(this);
  }

  onDateChange(date, type) {
    if (type === "END_DATE") {
      this.setState({
        selectedEndDate: date
      });
    } else {
      this.setState({
        selectedStartDate: date,
        selectedEndDate: null
      });
    }
  }

  componentWillMount() {
    this.getToken();
    this.getUserID();
  }

  getUserID = async () => {
    try {
      const value = await AsyncStorage.getItem("userID");
      this.setState({ userID: value });
    } catch (error) {
      console.log("Error retrieving data" + error);
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

  dateFormat(date) {
    var str = date.toString().slice(4, 14);
    var array = str.split(' ');
    if(array[0] == "Jun") { array[0] = "01"; }
    else if (array[0] == "Feb") { array[0] = "02"; }
    else if (array[0] == "Mar") { array[0] = "03"; }
    else if (array[0] == "Apr") { array[0] = "04"; }
    else if (array[0] == "May") { array[0] = "05"; }
    else if (array[0] == "Jun") { array[0] = "06"; }
    else if (array[0] == "Jul") { array[0] = "07"; }
    else if (array[0] == "Aug") { array[0] = "08"; }
    else if (array[0] == "Sep") { array[0] = "09"; }
    else if (array[0] == "Oct") { array[0] = "10"; }
    else if (array[0] == "Nov") { array[0] = "11"; }
    else if (array[0] == "Dec") { array[0] = "12"; }
    var d = array.join("/");
    return d;
  };

  submit(userToken, userID, reason, selectedStartDate, selectedEndDate) {
    if (this.state.reason != null) {
      const formBody1 = "token=";
      const formBody2 = userToken;
      const formBody3 = "&id=";
      const formBody4 = userID;
      const formBody5 = "&reason=";
      const formBody6 = reason;
      const formBody7 = "&start_date=";
      var formBody8 = this.dateFormat(selectedStartDate);
      console.log(formBody8);
      const formBody9 = "&end_date=";
      var formBody10 = this.dateFormat(selectedEndDate);
      console.log(formBody10);
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
        "https://deployattendancemanagement.herokuapp.com/api/absence-request/create",
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
            console.log("Error", "Error: " + res.message);
          } else {
            Alert.alert(
              "Yay !",
              "Success",
              [
                {
                  text: "OK",
                  onPress: () => console.log("Absence request sent."),
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
        "Error !",
        "Please enter fully in the form!",
        [
          {
            text: "OK",
            onPress: () => console.log("Absence request not sent."),
            style: "cancel"
          }
        ],
        { cancelable: false }
      );
    }
  }
  updateValue(text, field) {
    if (field == "reason") {
      this.setState({ reason: text });
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

    const { selectedStartDate, selectedEndDate } = this.state;
    const minDate = new Date(); // Today
    const maxDate = new Date(2020, 1, 1);

    return (
      <Container>
        <Content>
          <Form>
            <Title>Absence request Form</Title>

            <Item floatingLabel>
              <Label>Reason: </Label>
              <Input onChangeText={text => this.updateValue(text, "reason")} />
            </Item>

            <View style={{ padding: 20 }}>
              <Text>Please select start date and end date:</Text>
            </View>

            <CalendarPicker
              style={{ padding: 20 }}
              startFromMonday={true}
              allowRangeSelection={true}
              minDate={minDate}
              maxDate={maxDate}
              todayBackgroundColor="#f2e6ff"
              selectedDayColor="#7300e6"
              selectedDayTextColor="#FFFFFF"
              onDateChange={this.onDateChange}
            />

            <View style={{ padding: 20 }}>
              <Button
                full
                onPress={() =>
                  this.submit(
                    this.state.userToken,
                    this.state.userID,
                    this.state.reason,
                    this.state.selectedStartDate,
                    this.state.selectedEndDate
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
