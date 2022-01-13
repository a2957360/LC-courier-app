//react
import React, { useState, useEffect } from "react";

//react-native components
import { StyleSheet, Text, View, Image, Alert } from "react-native";

//packages
import i18n from "i18n-js";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { CustomDimensions } from "../../styles";

//redux
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { SERVER_URL } from "../../config/settings";

//styles
import { Colors } from "../../styles";
import LoadingScreen from "../../components/LoadingScreen";

const Scan = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);
  const [scannedBarcodeList, setScannedBarcodeList] = useState([]);
  const [orders, setOrders] = useState();

  const { userInfo } = useSelector((state) => state.accountData);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    const payload = {
      courierId: userInfo.courierId,
      itemBarcode: Number(data),
      orderId: "",
      itemState: "1",
    };
    const res = await axios.post(
      SERVER_URL + "order/courierScanBarcode.php",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("res", res.data);
    //扫描成功
    if (res.data.message === "success") {
      //已扫完全部包裹，开始配送
      if (res.data.data.unScanNum === "0") {
        Alert.alert(
          "Scan Success",
          `Item ${data} has been scanned! You are now delivering this order!`,
          [{ text: "Finish", onPress: () => setScanned(false) }]
        );
      }
      //还有包裹未扫
      else {
        Alert.alert(
          "Scan Success",
          `Item ${data} has been scanned! You have ${res.data.data.unScanNum} items remaining to be scaned for this order.`,
          [{ text: "Continue", onPress: () => setScanned(false) }]
        );
      }
    } else if (res.data.message === "already scan") {
      Alert.alert("Scan Error", `Item ${data} has already been scanned!`, [
        { text: "OK", onPress: () => setScanned(false) },
      ]);
    }
    //扫描失败
    else {
      Alert.alert("Scan Error", "Please try again later!", [
        { text: "OK", onPress: () => setScanned(false) },
      ]);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      >
        <Image
          source={require("../../assets/images/Scan3.png")}
          style={styles.scanBox}
        />
      </BarCodeScanner>
    </View>
  );
};

export default Scan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scanBox: {
    width: CustomDimensions.deviceWidth * 0.8,
    height: CustomDimensions.deviceWidth * 0.65,
    resizeMode: "stretch",
    position: "absolute",
    top: CustomDimensions.deviceHeight * 0.25,
    left: CustomDimensions.deviceWidth * 0.1,
  },
  barcodeQuantity: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
  },
});
