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
  Alert,
} from "react-native";

//packages
import i18n from "i18n-js";
import { useNavigation } from "@react-navigation/native";
import DashedLine from "react-native-dashed-line";
import * as ImagePicker from "expo-image-picker";
import * as Linking from "expo-linking";

//translation data
import { languageData } from "../../i18n/i18n";

//styles
import { Colors } from "../../styles";

//constants
import { ORDER_STATUS } from "../../config/settings";

//redux
import { useSelector, useDispatch } from "react-redux";
import { searchDriverOrder } from "../../actions/order";

//components
import Buttons from "../../components/Buttons";
import LoadingScreen from "../../components/LoadingScreen";

const OrderDetail = ({ route }) => {
  i18n.translations = languageData;
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { orderDetail } = useSelector((state) => state.orderData);
  const { userInfo } = useSelector((state) => state.accountData);
  console.log("orderDetail", orderDetail);

  useEffect(() => {
    const data = {
      courierId: userInfo.courierId,
      orderNoList: [route.params.orderNo],
    };
    dispatch(searchDriverOrder(data));
  }, []);

  const logStatement = () => {
    console.log("button pressed");
  };

  if (!orderDetail) {
    return <LoadingScreen />;
  }

  const { street, unit, city, province, postal } = orderDetail.recipientAddress;
  const address =
    (unit ? `${unit}/${street}` : street) + `, ${city}, ${province}, ${postal}`;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.orderNumberContainer}>
          {/* order# */}
          <View style={styles.flexRow}>
            <Text style={styles.title}>{i18n.t("Order#")}:</Text>
            <Text style={styles.textData}>{orderDetail.orderNo}</Text>
          </View>

          {/* order status */}
          <View style={styles.flexRow}>
            <Image
              source={ORDER_STATUS[orderDetail.orderState].color}
              style={{ height: 10, width: 10, marginRight: 8 }}
            />
            <Text style={styles.textData}>
              {i18n.t(ORDER_STATUS[orderDetail.orderState].title)}
              {/* {orderDetail.orderState} */}
            </Text>
          </View>
        </View>

        <DashedLine
          dashLength={3}
          dashGap={5}
          dashColor={Colors.lineDash}
          style={{ marginVertical: 10 }}
        />

        {/* delivery address */}
        <View style={styles.addressContainer}>
          <View style={styles.title}>
            <Text>{i18n.t("Delivery Address")}:</Text>
          </View>

          <View>
            <View style={styles.mb2}>
              <Text
                selectable
                onPress={() =>
                  Linking.openURL(`https://maps.google.com/?daddr=${address}`)
                }
                style={styles.textData}
              >
                {address}
                {/* <Image
                  source={require("../../assets/images/Pin_1.png")}
                  style={{ width: 30, height: 30 }}
                /> */}
                {/* <Text style={styles.linkingContainer}>导航</Text> */}
              </Text>
            </View>
            <Text
              onPress={() =>
                Linking.openURL(`tel: ${orderDetail.recipientPhone}`)
              }
              style={{ ...styles.textData, ...styles.mb2 }}
            >
              {orderDetail.recipientName}, {orderDetail.recipientPhone}
              {/* <Text style={styles.linkingContainer}>接通</Text> */}
            </Text>
            <Text
              onPress={() =>
                Linking.openURL(`mailto: ${orderDetail.recipientEmail}`)
              }
              style={styles.textData}
            >
              {orderDetail.recipientEmail}
              {/* <Text style={styles.linkingContainer}>写邮件</Text> */}
            </Text>
          </View>
        </View>

        <DashedLine
          dashLength={3}
          dashGap={5}
          dashColor={Colors.lineDash}
          style={{ marginVertical: 10 }}
        />

        {/* create time */}
        <View style={styles.flexRow}>
          <Text style={styles.title}>{i18n.t("recipient Address")}:</Text>
          <Text style={styles.textData}>{orderDetail.recipientAddress}</Text>
        </View>

        <DashedLine
          dashLength={3}
          dashGap={5}
          dashColor={Colors.lineDash}
          style={{ marginVertical: 10 }}
        />

        {/* delivery type */}
        <View style={styles.flexRow}>
          <Text style={styles.title}>{i18n.t("Delivery Type")}:</Text>

          <View style={styles.button}>
            <Text style={{ color: Colors.white, fontSize: 14 }}>
              {orderDetail.deliverType}
            </Text>
          </View>
        </View>

        <DashedLine
          dashLength={3}
          dashGap={5}
          dashColor={Colors.lineDash}
          style={{ marginVertical: 10 }}
        />

        {/* item list */}
        {orderDetail.itemList.map((element, index) => {
          return (
            <View style={{ marginBottom: 20 }} key={index}>
              {/* barcode */}
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text
                  style={{
                    color: Colors.textBlack,
                    fontSize: 14,
                    marginRight: 25,
                  }}
                >
                  {i18n.t("Item")} {index + 1}:
                </Text>
                <Image
                  source={{ uri: element.barcodeImage }}
                  style={{ width: "50%", height: 120, resizeMode: "stretch" }}
                />
              </View>

              <DashedLine
                dashLength={3}
                dashGap={5}
                dashColor={Colors.lineDash}
                style={{ marginVertical: 10 }}
              />

              {/* note */}
              <View style={styles.flexRow}>
                <Text style={styles.title}>{i18n.t("Note")}:</Text>
                <Text style={styles.textData}>{element?.itemNote}</Text>
              </View>

              <DashedLine
                dashLength={3}
                dashGap={5}
                dashColor={Colors.lineDash}
                style={{ marginVertical: 10 }}
              />

              <View style={styles.flexRow}>
                <Text style={styles.title}>{i18n.t("Item Type")}:</Text>
                <Text style={styles.textData}>{element.itemType}</Text>
              </View>

              <DashedLine
                dashLength={3}
                dashGap={5}
                dashColor={Colors.lineDash}
                style={{ marginVertical: 10 }}
              />

              <View style={styles.flexRow}>
                <Text style={styles.title}>{i18n.t("Item Size")}:</Text>
                <Text style={styles.textData}>{element.itemSize}</Text>
              </View>

              <DashedLine
                dashLength={3}
                dashGap={5}
                dashColor={Colors.lineDash}
                style={{ marginVertical: 10 }}
              />

              <View style={styles.flexRow}>
                <Text style={styles.title}>{i18n.t("Item Weight")}:</Text>
                <Text style={styles.textData}>{element.itemWeight} lb</Text>
              </View>

              <DashedLine
                dashLength={3}
                dashGap={5}
                dashColor={Colors.lineDash}
                style={{ marginVertical: 10 }}
              />

              <View style={styles.flexRow}>
                <Text style={styles.title}>{i18n.t("Item Insurance")}:</Text>
                <Text style={styles.textData}>{element.itemInsurance}</Text>
              </View>

              <DashedLine
                dashLength={3}
                dashGap={5}
                dashColor={Colors.lineDash}
                style={{ marginVertical: 10 }}
              />

              <View style={styles.flexRow}>
                <Text style={styles.title}>{i18n.t("Item Incubator")}:</Text>
                <Text style={styles.textData}>
                  {element.itemIncubator === "1" ? i18n.t("yes") : i18n.t("no")}
                </Text>
              </View>

              <DashedLine
                dashLength={3}
                dashGap={5}
                dashColor={Colors.lineDash}
                style={{ marginVertical: 10 }}
              />
            </View>
          );
        })}

        {/* 包裹已送达 */}

        <View style={styles.oneButtonContainer}>
          <Text>包裹已送达</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    paddingHorizontal: "5%",
  },
  orderNumberContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "5%",
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    color: Colors.textBlack,
    fontSize: 14,
    marginRight: 8,
  },
  textData: {
    color: Colors.textDataGrey,
    fontSize: 14,
    width: '80%',
    
  },
  addressContainer: {
    display: "flex",
    flexDirection: "row",
    width: "65%",
  },

  button: {
    backgroundColor: Colors.primary,
    color: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
  },

  mb2: {
    marginBottom: 10,
  },

  oneButtonContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 100,
  },

  twoButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 10,
    marginBottom: 100,
  },

  linkingContainer: {
    fontSize: 10,
    color: "white",

    backgroundColor: Colors.primary,
  },
});
