//react
import React, { useState, useEffect } from "react";

//react-native components
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";

//packages
import i18n from "i18n-js";
import { useNavigation } from "@react-navigation/native";

//translation data
import { languageData } from "../i18n/i18n";

//styles
import { Colors } from "../styles";

const Buttons = ({ type, title, handleButtonPress }) => {
  const navigation = useNavigation();

  const colorObj = {
    grey: {
      color: "buttonGrey",
      icon: require("../assets/images/Close.png"),
    },
    green: {
      color: "buttonGreen",
      icon: require("../assets/images/Finish.png"),
    },
    blue: {
      color: "buttonBlueArticle",
      icon: require("../assets/images/Edit.png"),
    },
  };

  return (
    <TouchableOpacity
      onPress={handleButtonPress}
      style={styles[colorObj[type].color]}
    >
      <Image source={colorObj[type].icon} style={styles.btnIcon} />
      <Text style={{ color: Colors.white, fontSize: 14 }}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Buttons;

const styles = StyleSheet.create({
  buttonBlue: {
    backgroundColor: Colors.primary,
    width: "45%",
    borderRadius: 15,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  buttonBlueArticle: {
    backgroundColor: Colors.primary,
    width: "45%",
    borderRadius: 30,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  buttonGrey: {
    backgroundColor: Colors.buttonGrey,
    width: "45%",
    borderRadius: 30,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  buttonGreen: {
    backgroundColor: Colors.green,
    width: "45%",
    borderRadius: 30,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  twoButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 10,
    marginBottom: 100,
  },

  btnIcon: {
    width: 30,
    height: 30,
  },
});
