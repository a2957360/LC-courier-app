//react
import React, { useState, useEffect } from "react";

//react-native components
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

//packages
import i18n from "i18n-js";
import { useNavigation } from "@react-navigation/native";
import DashedLine from "react-native-dashed-line";

//translation data
import { languageData } from "../../i18n/i18n";

//styles
import { Colors, CustomDimensions } from "../../styles";

//components

const ChangeEmail = () => {
  const [flag, setFlag] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={{ flex: 3 }}>
          <TextInput
            placeholder="输入新的邮箱"
            style={{ ...styles.input, ...styles.mt2 }}
          />
          {flag && (
            <TextInput placeholder="输入新的邮箱" style={styles.input} />
          )}
        </View>

        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => setFlag(true)}
            activeOpacity={1}
            style={styles.button}
          >
            <Text style={{ color: Colors.white, fontSize: 14 }}>确定修改</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ChangeEmail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
  },

  input: {
    height: 45,
    width: CustomDimensions.deviceWidth * 0.85,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: "#F7F7F7",
  },

  mt2: {
    marginTop: 20,
  },

  button: {
    backgroundColor: Colors.primary,
    width: CustomDimensions.deviceWidth * 0.45,
    borderRadius: 30,
    paddingVertical: 13,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});
