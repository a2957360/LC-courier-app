//react
import React, { useState, useEffect } from "react";

//react-native components
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";

//packages
import i18n from "i18n-js";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

//translation data
import { languageData } from "../../i18n/i18n";

//styles
import { Colors, CustomDimensions } from "../../styles";

//components
import Buttons from "../../components/Buttons";

//redux
import axios from "axios";
import { useSelector } from "react-redux";
import { SERVER_URL } from "../../config/settings";

const ImageUpload = (props) => {
  const navigation = useNavigation();
  const [uploadedImage, setUploadedImage] = useState(props.route.params?.image);

  const { userInfo } = useSelector((state) => state.accountData);

  async function takePhoto() {
    const { status: cameraPerm } =
      await ImagePicker.requestCameraPermissionsAsync();

    // only if user allows permission
    if (cameraPerm === "granted") {
      try {
        let pickerResult = await ImagePicker.launchCameraAsync({
          allowsEditing: false,
          aspect: [4, 3],
          quality: 0,
        });
        if (!pickerResult.cancelled) {
          // const imageArr = [];
          // if(Array.isArray(uploadedImage)) {
          //   imageArr = uploadedImage;
          // }else {
          //   imageArr.push(uploadedImage);
          // }
          setUploadedImage([...uploadedImage, pickerResult.uri]);
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
  async function takeImage() {
    const { status: medicalPerm } =
      await ImagePicker.getMediaLibraryPermissionsAsync();
    // only if user allows permission
    // console.log(medicalPerm)
    if (medicalPerm) {
      try {
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: false,
          aspect: [4, 3],
          quality: 0,
        });
        if (!pickerResult.cancelled) {
          setUploadedImage([...uploadedImage, pickerResult.uri]);
          console.log([...uploadedImage, pickerResult.uri]);
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

  const handleUploadPic = async () => {
    //上传图片到server
    if (uploadedImage) {
      const formData = new FormData();
      uploadedImage?.forEach((element, index) => {
        formData.append("uploadImages["+index+"]", {
          uri: element,
          type: "image/jpeg",
          name: `deliveredItemImages.${element.split(".")[1]}`,
        });
      });
      
      formData.append("isUploadImage", "1");
      const uploadImageResult = await axios.post(
        `${SERVER_URL}imageModule.php`,
        formData
      );
      console.log(uploadImageResult)
      // 上传图片成功
      if (uploadImageResult.data.message === "success") {
        //更改订单状态为已送达
        const payload = {
          courierId: userInfo.courierId,
          orderId: props.route.params.orderId,
          orderState: "6",
          deliverImage: uploadImageResult.data.data,
          unDeliverReason: "",
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
      //   // console.log("changeOrderStateResult", changeOrderStateResult.data);
      //   //更改状态成功
        if (changeOrderStateResult.data.message === "success") {
          Alert.alert(
            i18n.t("Congratulations"),
            i18n.t("You have completed this order"),
            [
              {
                text: i18n.t("Confirm"),
                onPress: () => {
                  navigation.goBack();
                  // navigation.navigate("OrderDetail", {
                  //   orderNo: props.route.params.orderNo,
                  // })
                },
              },
            ]
          );
        } else {
          Alert.alert(
            i18n.t("Error"),
            i18n.t("Could not complete this order, pleas try again later"),
            [
              {
                text: i18n.t("Confirm"),
                onPress: console.log("change order state failed"),
              },
            ]
          );
        }
      }
      //更改订单状态失败
      else {
        Alert.alert(
          i18n.t("Error"),
          i18n.t("Upload picture failed, please try again later"),
          [
            {
              text: i18n.t("Confirm"),
              onPress: console.log("upload image failed"),
            },
          ]
        );
      }
    }
    //上传图片失败
    else {
      Alert.alert(
        i18n.t("Error"),
        i18n.t("Please take a picture before you complete this order"),
        [{ text: i18n.t("Confirm"), onPress: takePhoto() }]
      );
    }
  };
  const deleteUploadImage =(index) => {
    console.log("dedededeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
    uploadedImage.splice(index, 1);
    setUploadedImage(uploadedImage);
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {Array.isArray(uploadedImage) ? uploadedImage.map((element, index) => {
            return (
              <View style={styles.imageContainer} key={index}>
                <Image
                  source={{ uri: element }}
                  style={{ height: "100%", width: "100%", resizeMode: "stretch" }}
                />
                <TouchableOpacity style={styles.imageDelete} onPress={() => deleteUploadImage(index)}>
                  <Image
                    source={require("../../assets/images/cancel.png")}
                  />
                </TouchableOpacity>
              </View>
            );
          }): <View style={styles.imageContainer}>
            <Image
              source={{ uri: uploadedImage }}
              style={{ height: "100%", width: "100%", resizeMode: "stretch" }}
            />
            <TouchableOpacity style={styles.imageDelete} onPress={() => deleteUploadImage(0)}>
              <Image
                source={require("../../assets/images/cancel.png")}
              />
            </TouchableOpacity>
          </View> 
        }
        <TouchableOpacity activeOpacity={1} onPress={takeImage}>
          <Text style={styles.reuploadText}>{i18n.t("AddUpload")}</Text>
        </TouchableOpacity>

        {/* button */}
        <View
          style={{ alignItems: "center", marginTop: "35%", marginBottom: 20 }}
        >
          <Buttons
            handleButtonPress={handleUploadPic}
            type={"green"}
            title={i18n.t("Upload")}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default ImageUpload;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  scrollView: {
    paddingTop: 30,
  },
  imageContainer: {
    width: CustomDimensions.deviceWidth * 0.85,
    height: CustomDimensions.deviceWidth * 0.85,
    marginBottom: "10%",
  },
  imageDelete: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 999
  },
  reuploadText: {
    color: Colors.primary,
    fontSize: 14,
    textDecorationLine: "underline",
    textAlign: "center",
  },
  buttonTitle: {
    backgroundColor: Colors.green,
    width: "50%",
    borderRadius: 30,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});

