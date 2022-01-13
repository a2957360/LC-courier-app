//react
import React, { useState, useEffect } from "react";

//react-native components
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Alert,
  TouchableOpacity,
  Keyboard,
} from "react-native";

//translation data
import i18n from "i18n-js";
import { languageData } from "../../../i18n/i18n";

//packages
import { BarCodeScanner } from "expo-barcode-scanner";
import { useNavigation } from "@react-navigation/native";
import { CustomDimensions } from "../../../styles";

//redux
import axios from "axios";
import { useSelector } from "react-redux";
import { SERVER_URL } from "../../../config/settings";

//styles
import { Colors } from "../../../styles";

const UndeliverReason = (props) => {
  i18n.translations = languageData;
  const navigation = useNavigation();

  const [inputReason, setInputReason] = useState();
  const { userInfo } = useSelector((state) => state.accountData);

  const handleSubmit = async () => {
    if (inputReason) {
      const payload = {
        courierId: userInfo.courierId,
        orderId: props.route.params.orderId,
        orderState: "7",
        deliverImage: "",
        unDeliverReason: inputReason,
      };
      console.log("this is payload", payload);

      const changeOrderStateResult = await axios.post(
        SERVER_URL + "order/courierChangeOrder.php",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("changeOrderStateResult", changeOrderStateResult.data);
      //更改状态成功
      if (changeOrderStateResult.data.message === "success") {
        Alert.alert(
          i18n.t("success"),
          i18n.t("This order has canceled by you"),
          [
            {
              text: i18n.t("Confirm"),
              onPress: () => {
                navigation.goBack();
              },
            },
          ]
        );
      } else {
        Alert.alert(
          i18n.t("Error"),
          i18n.t("Cancel order failed, please try again later"),
          [
            {
              text: i18n.t("Confirm"),
              onPress: console.log("change order state failed"),
            },
          ]
        );
      }
    } else {
      Alert.alert(i18n.t("Error"), i18n.t("Please enter your cancel reasons"), [
        { text: i18n.t("Confirm"), onPress: console.log("reason are empty") },
      ]);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => Keyboard.dismiss()}
      activeOpacity={1}
      style={styles.container}
    >
      <View
        style={{
          height: CustomDimensions.deviceHeight * 0.18,
          width: CustomDimensions.deviceWidth * 0.8,
          backgroundColor: Colors.background,
          padding: "5%",
          marginTop: CustomDimensions.deviceHeight * 0.02,
          borderRadius: "10%",
          marginBottom: CustomDimensions.deviceHeight * 0.4,
        }}
      >
        <Text style={{ color: Colors.buttonGrey, fontSize: 16 }}>
          {i18n.t("Input your reason")}
        </Text>
        <TextInput
          value={inputReason}
          onChangeText={(e) => setInputReason(e)}
          style={{ color: Colors.buttonGrey, fontSize: 16 }}
          maxLength={120}
          multiline
          style={{ width: "100%", height: "100%" }}
        />
      </View>

      {/* grey button */}
      <TouchableOpacity
        onPress={handleSubmit}
        activeOpacity={1}
        style={{
          backgroundColor: Colors.primary,
          width: "40%",
          borderRadius: 30,
          paddingVertical: 8,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Text style={{ color: Colors.white, fontSize: 14 }}>
          {i18n.t("Confirm Submit")}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default UndeliverReason;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },

  oneButtonContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: 100,
  },
});
