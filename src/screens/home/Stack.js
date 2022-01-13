//react
import React, { useState, useEffect } from "react";

//react-native components
import { StyleSheet, Text, TextInput, View } from "react-native";

//packages
import i18n from "i18n-js";

//translation data
import { languageData } from "../../i18n/i18n";

const Stack = () => {
  i18n.translations = languageData;

  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <View style={styles.button}>
          <Text style={styles.buttonText}>{i18n.t("home")}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Stack;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  button: {
    borderRadius: 8,
    marginLeft: 25,
    marginRight: 25,
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: "#f01d71",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 16,
    textAlign: "center",
  },
});
