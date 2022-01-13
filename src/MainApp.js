//react
import React, { useState, useEffect } from "react";

//react-native components
import {
  StyleSheet,
  Text,
  TextInput,
  Image,
  View,
  TouchableOpacity,
} from "react-native";

//react navigation
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

//packages
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18n from "i18n-js";

//components
import LoadingScreen from "./components/LoadingScreen";

//redux
import { useDispatch } from "react-redux";
import { setLanguageCode } from "./actions/account";
import ImageUpload from "./screens/home/ImageUpload";

//styles
import { Colors } from "./styles";

//translation data
import { languageData } from "./i18n/i18n";

//screens
import Home from "./screens/home/Home";
import StackScreen from "./screens/home/Stack";
import Scan from "./screens/scan/Scan";
import User from "./screens/user/User";
import OrderDetail from "./screens/home/OrderDetail";
import Auth from "./screens/auth/Auth";
import ChangeEmail from "./screens/user/ChangeEmail";
import ChangePhone from "./screens/user/ChangePhone";
import ChangePassword from "./screens/user/ChangePassword";
import ChangeNameAvatar from "./screens/user/ChangeNameAvatar";
import ScanOrderDetail from "./screens/home/components/ScanOrderDetail";
import OrderDetailCompleted from "./screens/home/OrderDetailCompleted";
import UndeliverReason from "./screens/home/components/UndeliverReason";

//disable text&testinput setting of system
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

//define stack and tabs
const Stack = createStackNavigator();
const BottomTabs = createBottomTabNavigator();

export default function MainApp() {
  i18n.translations = languageData;
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getAppSetting() {
      await setLoading(true);
      await getLanguage();
      await setLoading(false);
    }

    // clearLocalStorage();
    getAppSetting();
  }, []);

  const getLanguage = async () => {
    //get language code from local storage
    const languageCode = await AsyncStorage.getItem("language");
    console.log(languageCode);

    if (languageCode !== null) {
      //set language code equal to localstorage value if code exist
      i18n.locale = languageCode;
      if (languageCode.toLowerCase().includes("zh")) {
        dispatch(setLanguageCode("Zh"));
      } else {
        dispatch(setLanguageCode("En"));
      }
    } else {
      //set language code equal to localization value if code does not exist
      i18n.locale = Localization.locale;
      await AsyncStorage.setItem("language", Localization.locale);
      if (Localization.locale.includes("zh")) {
        dispatch(setLanguageCode("Zh"));
      } else {
        dispatch(setLanguageCode("En"));
      }
    }

    // When a value is missing from a language it'll fallback to another language with the key present.
    i18n.fallbacks = true;
  };

  const customeHeaderLeft = (navigation) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Image
          source={require("./assets/images/Back.png")}
          style={{ height: 25, width: 25, marginLeft: 10 }}
        />
      </TouchableOpacity>
    );
  };

  const MainStack = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerBackground: () => (
            <View style={{ flex: 1, backgroundColor: Colors.primary }} />
          ),
          headerTitleStyle: { color: Colors.white, fontSize: 16 },
        }}
      >
        <Stack.Screen
          name="Auth"
          component={AuthStack}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Home"
          component={MainBottomTabs}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="OrderDetail"
          component={OrderDetail}
          options={({ navigation }) => ({
            title: i18n.t("Order Detail"),
            headerLeft: () => customeHeaderLeft(navigation),
          })}
        />

        <Stack.Screen
          name="ScanOrderDetail"
          component={ScanOrderDetail}
          options={({ navigation }) => ({
            title: i18n.t("scan"),
            headerLeft: () => customeHeaderLeft(navigation),
          })}
        />

        <Stack.Screen
          name="ImageUpload"
          component={ImageUpload}
          options={({ navigation }) => ({
            title: i18n.t("Order Detail"),
            headerLeft: () => customeHeaderLeft(navigation),
          })}
        />

        <Stack.Screen
          name="ChangeEmail"
          component={ChangeEmail}
          options={({ navigation }) => ({
            title: i18n.t("Change Email"),
            headerLeft: () => customeHeaderLeft(navigation),
          })}
        />

        <Stack.Screen
          name="ChangePhone"
          component={ChangePhone}
          options={({ navigation }) => ({
            title: i18n.t("Change Phone"),
            headerLeft: () => customeHeaderLeft(navigation),
          })}
        />

        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={({ navigation }) => ({
            title: i18n.t("Change Password"),
            headerLeft: () => customeHeaderLeft(navigation),
          })}
        />

        <Stack.Screen
          name="ChangeNameAvatar"
          component={ChangeNameAvatar}
          options={({ navigation }) => ({
            title: i18n.t("Change Account"),
            headerLeft: () => customeHeaderLeft(navigation),
          })}
        />

        <Stack.Screen
          name="OrderDetailCompleted"
          component={OrderDetailCompleted}
          options={({ navigation }) => ({
            title: i18n.t("Order Detail"),
            headerLeft: () => customeHeaderLeft(navigation),
          })}
        />

        <Stack.Screen
          name="UndeliverReason"
          component={UndeliverReason}
          options={({ navigation }) => ({
            title: i18n.t("Undeliver Reason"),
            headerLeft: () => customeHeaderLeft(navigation),
          })}
        />
      </Stack.Navigator>
    );
  };

  const AuthStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    );
  };

  const MainBottomTabs = () => {
    return (
      <BottomTabs.Navigator
        tabBarOptions={{
          activeTintColor: Colors.bottomTabActiveColor,
          inactiveTintColor: Colors.bottomTabUnActiveColor,
          style: {
            paddingVertical: 5,
            height: 80,
          },
          tabStyle: {
            height: 50,
          },
          labelStyle: {
            fontSize: 12,
          },
        }}
        headerStyle={null}
      >
        <BottomTabs.Screen
          name="Home"
          component={HomeStack}
          options={{
            title: i18n.t("order"),
            tabBarIcon: ({ focused }) => {
              return (
                <Image
                  style={{ width: 30, height: 30 }}
                  source={
                    focused
                      ? require("./assets/images/Home_1.png")
                      : require("./assets/images/Home_0.png")
                  }
                />
              );
            },
          }}
        />

        <BottomTabs.Screen
          name="Scan"
          component={ScanStack}
          options={{
            title: i18n.t("scan"),
            tabBarIcon: () => (
              <Image
                style={{ width: 30, height: 30 }}
                source={require("./assets/images/Scan.png")}
              />
            ),
          }}
        />

        <BottomTabs.Screen
          name="User"
          component={UserStack}
          options={{
            title: i18n.t("user"),
            tabBarIcon: ({ focused }) => (
              <Image
                style={{ width: 30, height: 30 }}
                source={
                  focused
                    ? require("./assets/images/Me_1.png")
                    : require("./assets/images/Me_0.png")
                }
              />
            ),
          }}
        />
      </BottomTabs.Navigator>
    );
  };

  const HomeStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: i18n.t("order"),
          }}
        />
      </Stack.Navigator>
    );
  };

  const ScanStack = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerBackground: () => (
            <View style={{ flex: 1, backgroundColor: Colors.primary }} />
          ),
          headerTitleStyle: { color: Colors.white, fontSize: 16 },
        }}
      >
        <Stack.Screen
          name="Scan"
          component={Scan}
          options={({ navigation }) => ({
            title: i18n.t("scan"),
          })}
        />
      </Stack.Navigator>
    );
  };

  const UserStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="User"
          component={User}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    );
  };

  if (loading === true) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <>{MainStack()}</>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
