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
  TouchableOpacity,
} from "react-native";

//packages
import i18n from "i18n-js";
import { useNavigation } from "@react-navigation/native";
import DashedLine from "react-native-dashed-line";
import * as Updates from "expo-updates";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";

//translation data
import { languageData } from "../../i18n/i18n";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  setLanguageCode,
  clearLoginMessage,
  getDriverInfo,
} from "../../actions/account";
//styles
import { Colors, CustomDimensions } from "../../styles";
//components
import LoadingScreen from "../../components/LoadingScreen";

//components

const User = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { language } = useSelector((state) => state.accountData);
  const { userInfo } = useSelector((state) => state.accountData);

  useEffect(() => {
    const getDriverData = async () => {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        dispatch(getDriverInfo(userId));
      }
    };
    getDriverData();
  }, []);

  // const handleLanguageSwitch = () => {

  // }

  // const setToEnglish = async () => {
  //   await AsyncStorage.setItem("language", "en");
  //   await Updates.reloadAsync();
  // };

  // const setToChinese = async () => {
  //   await AsyncStorage.setItem("language", "zh");
  //   await Updates.reloadAsync();
  // };

  const setLanguage = async () => {
    const newLanguage = language.toLowerCase().includes("en") ? "zh" : "en";
    await AsyncStorage.setItem("language", newLanguage);
    await Updates.reloadAsync();
    dispatch(setLanguageCode(newLanguage));
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userId");
    dispatch(clearLoginMessage());
    navigation.reset({
      index: 0,
      routes: [{ name: "Auth" }],
      key: null,
    });
  };

  if (!userInfo) {
    return <LoadingScreen />;
  }

  console.log("userInfo", userInfo);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      {/* avatar container */}
      <View style={styles.avatarContainer}>
        <Image source={{ uri: userInfo.courierImage }} style={styles.avatar} />

        <View style={styles.nameContainer}>
          <Text style={styles.name}>{userInfo.courierName}</Text>

          {/* <TouchableOpacity
            onPress={() => navigation.navigate("ChangeNameAvatar")}
            activeOpacity={1}
          >
            <Image
              source={require("../../assets/images/Edit.png")}
              style={styles.edit}
            />
          </TouchableOpacity> */}
        </View>
      </View>

      {/* content container */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          {/* statistic container */}
          <View style={styles.staContainer}>
            <View style={styles.staFirstContainer}>
              <View style={styles.eachSta}>
                <Text style={{ ...styles.greyText, ...styles.mb1 }}>
                  {i18n.t("Total")}
                </Text>
                <Text style={styles.number}>{userInfo.allNum}</Text>
              </View>

              <View style={styles.eachSta}>
                <Text style={{ ...styles.greyText, ...styles.mb1 }}>
                  {i18n.t("today")}
                </Text>
                <Text style={styles.number}>{userInfo.todayOrder}</Text>
              </View>

              <View style={styles.eachSta}>
                <Text style={{ ...styles.greyText, ...styles.mb1 }}>
                  {i18n.t("Month")}
                </Text>
                <Text style={styles.number}>{userInfo.monthOrder}</Text>
              </View>
            </View>
            <DashedLine
              dashLength={3}
              dashGap={5}
              dashColor={Colors.lineDash}
              style={{ marginVertical: 10 }}
            />
            <View style={styles.staSecondContainer}>
              <View style={styles.eachSta}>
                <Text style={{ ...styles.greyText, ...styles.mb1 }}>
                  {i18n.t("UnfinishNum")}
                </Text>
                <Text style={styles.number}>{userInfo.unfinishNum}</Text>
              </View>

              <View style={styles.eachSta}>
                <Text style={{ ...styles.greyText, ...styles.mb1 }}>
                  {i18n.t("FinishNum")}
                </Text>
                <Text style={styles.number}>{userInfo.finishOrder}</Text>
              </View>

              {/* <View style={styles.eachSta}>
                <Text style={{ ...styles.greyText, ...styles.mb1 }}>
                  {i18n.t("Total by Region")}
                </Text>
                <Text style={styles.number}>{userInfo.monthOrder}</Text>
              </View> */}
            </View>
          </View>
          {/* areaInfo container */}
          <View style={styles.staContainer}>
            <View style={styles.areaInfoContainer}>
              {
                userInfo.areaInfo.map((item) => {
                  return (
                    <View style={styles.eachSta}>
                      <Text style={{ ...styles.greyText, ...styles.mb1 }}>
                        {item.name}
                      </Text>
                      <Text style={styles.number}>{item.value}</Text>
                    </View>
                  )
                })
              }
            </View>
          </View>
          {/* edit info container */}
          <View View style={styles.editInfoContainer}>
            {/* email */}
            <View
            // style={styles.editRow}
            >
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.editTitle}>{i18n.t("Email")}:</Text>
                <Text style={styles.greyText}>{userInfo.courierEmail}</Text>
              </View>
              {/* <Text
                onPress={() => navigation.navigate("ChangeEmail")}
                style={styles.editAction}
              >
                {i18n.t("editEmail")}
              </Text> */}
            </View>

            <DashedLine
              dashLength={3}
              dashGap={5}
              dashColor={Colors.lineDash}
              style={{ marginVertical: 10 }}
            />

            {/* phone */}
            <View
            // style={styles.editRow}
            >
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.editTitle}>{i18n.t("Phone")}:</Text>
                <Text style={styles.greyText}>{userInfo.courierPhone}</Text>
              </View>
              {/* <Text
                onPress={() => navigation.navigate("ChangePhone")}
                style={styles.editAction}
              >
                {i18n.t("editPhone")}
              </Text> */}
            </View>
            <DashedLine
              dashLength={3}
              dashGap={5}
              dashColor={Colors.lineDash}
              style={{ marginVertical: 10 }}
            />

            {/* password */}

            {/* team */}
            <View style={styles.editRow}>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.editTitle}>{i18n.t("Team")}:</Text>
                <Text style={styles.greyText}>6476131852</Text>
              </View>
              <Text
                onPress={() => Linking.openURL("tel: 6476131852")}
                style={styles.editAction}
              >
                {i18n.t("Call")}
              </Text>
            </View>
            <DashedLine
              dashLength={3}
              dashGap={5}
              dashColor={Colors.lineDash}
              style={{ marginVertical: 10 }}
            />

            {/* language */}
            <View style={styles.editRow}>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.editTitle}>{i18n.t("Language")}:</Text>
                {/* <Text style={styles.greyText}>3045966688</Text> */}
              </View>
              <Text onPress={setLanguage} style={styles.editAction}>
                {language.toLowerCase().includes("en") ? "中文" : "English"}
              </Text>
            </View>
          </View>

          {/* logout container */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => handleLogout()}
            style={styles.editInfoContainer}
          >
            <View style={styles.editRow}>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.editTitle}>{i18n.t("Logout")}</Text>
              </View>
              <Image
                source={require("../../assets/images/Quit.png")}
                style={{ width: 25, height: 25 }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default User;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  safeAreaView: {
    flex: 1,
    // backgroundColor: Colors.primary,
    
  },

  scrollView: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  avatarContainer: {
    height: CustomDimensions.deviceHeight * 0.23,
    width: CustomDimensions.deviceWidth,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  contentContainer: {
    // height: "100%",
    // height: CustomDimensions.deviceHeight * 0.63,
    width: CustomDimensions.deviceWidth,
    backgroundColor: Colors.background,
    padding: 15,
    marginBottom: 20,
  },

  avatar: {
    width: CustomDimensions.deviceWidth * 0.3,
    height: CustomDimensions.deviceWidth * 0.3,
    borderRadius: (CustomDimensions.deviceWidth * 0.3) / 2,
    borderWidth: 6,
    borderColor: Colors.white,
    marginBottom: 10,
    resizeMode: "stretch",
  },

  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  name: {
    fontSize: 16,
    color: Colors.white,
  },

  edit: {
    width: 23,
    height: 23,
    resizeMode: "contain",
  },

  staContainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingVertical: 20,
    marginBottom: 15,
    paddingLeft: 15,
    paddingRight: 15
  },

  staFirstContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  areaInfoContainer: {
    flexDirection: "row",
    flexWrap:'wrap',
    justifyContent: "flex-start",
  },

  staSecondContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },

  eachSta: {
    alignItems: "center",
    width: '33%'
  },

  greyText: {
    fontSize: 14,
    color: Colors.textDataGrey,
  },

  number: {
    fontSize: 20,
    color: Colors.textBlack,
  },

  mb1: {
    marginBottom: 5,
  },

  editInfoContainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 25,
    marginBottom: 15,
  },

  editRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  editTitle: {
    fontSize: 14,
    color: Colors.textBlack,
    marginRight: 5,
  },

  editAction: {
    fontSize: 14,
    color: Colors.primary,
    textDecorationLine: "underline",
  },
});

// {/* <View
// // style={styles.editRow}
// >
//   <View style={{ flexDirection: "row" }}>
//     <Text style={styles.editTitle}>{i18n.t("Password")}:</Text>
//     <Text style={styles.greyText}>3045966688</Text>
//   </View>
//   {/* <Text
//     onPress={() => navigation.navigate("ChangePassword")}
//     style={styles.editAction}
//   >
//     {i18n.t("editPassword")}
//   </Text> */}
// </View>
// <DashedLine
//   dashLength={3}
//   dashGap={5}
//   dashColor={Colors.lineDash}
//   style={{ marginVertical: 10 }}
// /> */}
