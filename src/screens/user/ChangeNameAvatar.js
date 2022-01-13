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
import * as ImagePicker from "expo-image-picker";

//translation data
import { languageData } from "../../i18n/i18n";

//styles
import { Colors, CustomDimensions } from "../../styles";

//components

const ChangeNameAvatar = () => {
  const [image, setImage] = useState(null);

  async function takePhoto() {
    const { status: cameraRollPerm } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    // only if user allows permission
    if (cameraRollPerm === "granted") {
      try {
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: false,
          aspect: [4, 3],
          quality: 1,
        });
        if (!pickerResult.cancelled) {
          setImage(pickerResult.uri);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      Alert.alert(
        "Oops...we need access to your camera and gallery to take photos."
      );
    }
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 3, alignItems: "center" }}>
        <Image
          source={
            image
              ? { uri: image }
              : require("../../assets/images/dogImage.jpeg")
          }
          style={styles.avatar}
        />

        <Text onPress={takePhoto} style={styles.reupload}>
          重新上传
        </Text>

        <TextInput placeholder="用户名" style={styles.input} />
      </View>

      <View style={{ flex: 1 }}>
        <TouchableOpacity activeOpacity={1} style={styles.button}>
          <Text style={{ color: Colors.white, fontSize: 14 }}>确定修改</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChangeNameAvatar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.white,
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

  button: {
    backgroundColor: Colors.primary,
    width: CustomDimensions.deviceWidth * 0.45,
    borderRadius: 30,
    paddingVertical: 13,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  avatar: {
    marginVertical: 15,
    width: CustomDimensions.deviceWidth * 0.5,
    height: CustomDimensions.deviceWidth * 0.5,
    borderRadius: (CustomDimensions.deviceWidth * 0.5) / 2,
  },

  reupload: {
    fontSize: 14,
    marginBottom: 15,
    color: Colors.primary,
    textDecorationLine: "underline",
  },
});
