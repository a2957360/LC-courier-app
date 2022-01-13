//react
import React, { useState, useEffect, useLayoutEffect } from "react";

//react-native components
import { StyleSheet, Text, TextInput, View, SafeAreaView } from "react-native";

//packages
import i18n from "i18n-js";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

//translation data
import { languageData } from "../../i18n/i18n";

//styles
import { Colors } from "../../styles";

//redux
import { useDispatch, useSelector } from "react-redux";
import { getDriverInfo } from "../../actions/account";

//components
import Header from "./Header";
import OrderList from "./OrderList";
import MapList from "./MapList";
import LoadingScreen from "../../components/LoadingScreen";

const Home = () => {
  i18n.translations = languageData;

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { userInfo } = useSelector((state) => state.accountData);

  const [isMapClicked, setIsMapClicked] = useState(false);

  useEffect(() => {
    const getDriverData = async () => {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        dispatch(getDriverInfo(userId));
      }
    };
    getDriverData();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => {
        return (
          <SafeAreaView style={styles.headerWrapper}>
            <Header
              isMapClicked={isMapClicked}
              setIsMapClicked={setIsMapClicked}
            />
          </SafeAreaView>
        );
      },
    });
  });

  if (!userInfo) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      {isMapClicked ? <MapList /> : <OrderList />}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  headerWrapper: {
    height: 88,
    backgroundColor: Colors.primary,
  },
});
