//react
import React, { useState } from "react";

//react-native components
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

//packages
import i18n from "i18n-js";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "../../styles";
import { useNavigation } from "@react-navigation/native";

//translation data
import { languageData } from "../../i18n/i18n";

const Header = ({ isMapClicked, setIsMapClicked }) => {
  i18n.translations = languageData;
  const navigation = useNavigation();

  const [searchInput, setSearchInput] = useState();

  const handleSearch = () => {
    if (searchInput && searchInput !== "") {
      navigation.navigate("OrderDetail", {
        orderNo: searchInput,
      });
    }
    setSearchInput(null);
  };

  return (
    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <View style={styles.mainContainer}>
        {/* search container */}
        <View style={styles.searchContainer}>
          <AntDesign name="search1" size={16} color="white" />

          <TextInput
            value={searchInput}
            placeholder={i18n.t("search order")}
            placeholderTextColor="white"
            style={styles.searchInput}
            returnKeyType={"search"}
            onSubmitEditing={() => handleSearch()}
            onChangeText={(value) => setSearchInput(value)}
          />
        </View>

        {/* map icon */}
        <TouchableOpacity
          onPress={() => {
            setIsMapClicked(!isMapClicked);
          }}
          style={styles.mapIconContainer}
        >
          {!isMapClicked ? (
            <Image
              source={require("../../assets/images/Earth.png")}
              style={{ width: 24, height: 24 }}
            />
          ) : (
            <Image
              source={require("../../assets/images/ListIcon.png")}
              style={{ width: 24, height: 24 }}
            />
          )}
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Header;

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    alignContent: "center",
    justifyContent: "space-between",
    paddingHorizontal: "5%",
    flexDirection: "row",
  },
  searchContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: "2%",
    paddingHorizontal: "5%",
    backgroundColor: Colors.primaryDark,
    borderRadius: 20,
  },
  searchInput: {
    width: "83%",
    color: "white",
    paddingLeft: "2%",
    fontSize: 16,
  },
  mapIconContainer: {
    display: "flex",
    justifyContent: "center",
  },
});
