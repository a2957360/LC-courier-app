//react
import React, { useState, useEffect } from "react";

//react-native components
import { StyleSheet, Text, View, TouchableOpacity, Image, Button, Alert } from "react-native";

//packages
import i18n from "i18n-js";
import { useNavigation } from "@react-navigation/native";

//translation data
import { languageData } from "../../../i18n/i18n";

//styles
import { Colors } from "../../../styles";

//constants
import { ORDER_STATUS, SERVER_URL } from "../../../config/settings";
import OrderDetail from "../OrderDetail";

//redux
import axios from "axios";

const OrderCard = ({ recipientAddress,senderName, orderNo, orderState, isDropable, deliverNo, onFresh, orderNote, sameAddress, userInfo, orderId }) => {
  i18n.translations = languageData;
  const navigation = useNavigation();

  const imageObj = {
    0: require("../../../assets/images/Pending.png"),
    1: require("../../../assets/images/Processing.png"),
    2: require("../../../assets/images/Finished.png"),
  };

  const handleButtonPress = async () => {
    Alert.alert(
      i18n.t("Confirm"),
      `${i18n.t("Confirm Collect")} ${orderNo}？`,
      [
        {
          text: i18n.t("Cancel"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: i18n.t("Confirm"), onPress: () => collectRequest()
        }
      ]
    );
  }
  const collectRequest = async () => {
    const payload = {
      courierId: userInfo.courierId,
      orderId: orderId,
    };
        console.log(payload);
        const result = await axios.post(
          SERVER_URL + "order/courierPickup.php",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        // console.log(result.data.message)
        // console.log('success')
        if (result.data.message === "success") {
          Alert.alert(
            i18n.t("success"),
            i18n.t("You have successfully start delivering this order!"),
            [{ text: "OK", onPress: () => console.log("clicked") }]
          );
          onFresh();
        } else {
          Alert.alert(
            i18n.t("Change Order Status Failed"),
            i18n.t("Collect failed, please try again later"),
            [{ text: "OK", onPress: () => console.log("clicked") }]
          );
        }
  }

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() =>
        navigation.navigate("OrderDetail", {
          orderNo: orderNo,
          update: () => onFresh()
        })
      }
      style={styles.container}
    >
      {/* 内容文字 */}
      <View style={styles.contentContainer}>
        <Text style={styles.orderNumberText}>
          {i18n.t("Order#")}: {orderNo}
        </Text>
        <Text style={styles.createTimeText}>
          {i18n.t("recipient Address")}: {recipientAddress}
        </Text>
        {sameAddress === '1' && <Text style={styles.sameAddressText}>
          {i18n.t("sameAddress")}
        </Text>}
        <Text style={styles.createTimeText}>
          {i18n.t("Note")}: {orderNote}
        </Text>
        <Text style={styles.createTimeText}>
          {i18n.t("senderName")}: {senderName}
        </Text>
        <Text style={styles.createTimeText}>
        {i18n.t("isDropable")}: {isDropable==="0"?i18n.t("UnDropable"):i18n.t("Dropable")}
        </Text>
        <Text style={styles.createTimeText}>
          {i18n.t("DeliverNo")}: {deliverNo}
        </Text>
        <View style={styles.statusContainer}>
          <Image
            // source={ORDER_STATUS["4"].color}
            source={ORDER_STATUS[orderState].color}
            style={{ height: 10, width: 10, marginRight: "3%" }}
          />
          <Text style={styles.statusText}>
            {i18n.t(ORDER_STATUS[orderState].title)}
          </Text>
        </View>
      </View>

      {/* 状态图片 */}
      <View style={styles.imageContainer}>
        <Image
          // source={ORDER_STATUS["4"].image}
          source={ORDER_STATUS[orderState].image}
          style={{ width: 60, height: 60 }}
        />
        {orderState === "4" && <TouchableOpacity
          onPress={handleButtonPress}
          style={styles.collectContainer}
        >
          <Text style={{ color: Colors.white, fontSize: 14 }}>{i18n.t("Collect")}</Text>
        </TouchableOpacity>
        }
      </View>
    </TouchableOpacity>
  );
};

export default OrderCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginVertical: "2%",
    marginHorizontal: "3%",
    padding: "4%",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    width: '85%'
  },
  orderNumberText: {
    fontSize: 16,
    color: "#96989A",
    marginBottom: "5%",
  },
  createTimeText: {
    fontSize: 12,
    color: "#96989A",
    marginBottom: "5%",
    
  },
  sameAddressText: {
    fontSize: 12,
    color: "red",
    marginBottom: "5%",
  },
  statusContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 12,
    color: "#96989A",
  },
  collectContainer: {
    backgroundColor: Colors.primary,
    textAlign: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 8,
    borderRadius: 8
  },
});
