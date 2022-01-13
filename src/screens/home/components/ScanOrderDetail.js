//react
import React, { useState, useEffect } from "react";

//react-native components
import { StyleSheet, Text, View, Button, Image, Alert } from "react-native";

//translation data
import i18n from "i18n-js";
import { languageData } from "../../../i18n/i18n";

//packages
import { BarCodeScanner } from "expo-barcode-scanner";
import { useNavigation } from "@react-navigation/native";
import { CustomDimensions } from "../../../styles";

//redux
import axios from "axios";
import { useSelector } from "react-redux";
import { SERVER_URL } from "../../../config/settings";

//styles
import { Colors } from "../../../styles";

const ScanOrderDetail = ({ route }) => {
  i18n.translations = languageData;
  const navigation = useNavigation();

  const { barcodeList, orderId, orderNo } = route.params;

  // const [quantity, setQuantity] = useState(barcodeList.length);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedBarcodeList, setScannedBarcodeList] = useState([]);

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
      //已扫完全部包裹，开始配送,跳转到订单详情页
      if (res.data.data.unScanNum === "0") {
        Alert.alert(
          i18n.t("Scan Success"),
          `${i18n.t("Item")} ${data} ${i18n.t("has been scanned!")} ${i18n.t(
            "You are now delivering this order!"
          )}`,
          [
            {
              text: i18n.t("Finish"),
              onPress: () => {
                setScanned(false);
                // navigation.replace("OrderDetail", {
                //   orderNo: orderNo,
                // });

                // navigation.reset({
                //   index: 0,
                //   routes: [
                //     { name: "OrderDetail", params: { orderNo: orderNo } },
                //   ],
                // });
                navigation.goBack();
              },
            },
          ]
        );
      }
      //还有包裹未扫
      else {
        Alert.alert(
          i18n.t("Scan Success"),
          `${i18n.t("Item")} ${data} ${i18n.t("has been scanned!")} ${i18n.t(
            "You have"
          )} ${res.data.data.unScanNum} ${i18n.t(
            "items remaining to be scaned for this order."
          )}`,
          [{ text: "Continue", onPress: () => setScanned(false) }]
        );
      }
    } else if (res.data.message === "already scan") {
      Alert.alert(
        i18n.t("Scan Error"),
        `${i18n.t("Item")} ${data} ${i18n.t("has already been scanned!")}`,
        [{ text: i18n.t("Confirm"), onPress: () => setScanned(false) }]
      );
    }
    //扫描失败
    else {
      Alert.alert(i18n.t("Scan Error"), i18n.t("Please try again later!"), [
        { text: i18n.t("Confirm"), onPress: () => setScanned(false) },
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
        {/* <Text style={styles.barcodeQuantity}>OrderNo: {orderNo}</Text>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 24, color: Colors.primary }}>
            {barcodeList.length - scannedBarcodeList.length}
          </Text>
          <Text style={{ fontSize: 16, color: "white" }}>
            {i18n.t("package remaining")}
          </Text>
        </View> */}

        <Image
          source={require("../../../assets/images/Scan3.png")}
          style={styles.scanBox}
        />
      </BarCodeScanner>
    </View>
  );
};

export default ScanOrderDetail;

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

// //扫到包裹，弹窗提醒。如果扫完所有包裹，修改订单状态，开始送件
// useEffect(() => {
//   if (scannedBarcodeList.length > 0) {
//     if (scannedBarcodeList.length === barcodeList.length) {
//       driverChangeOrderstate();
//     } else {
//       Alert.alert(
//         i18n.t("Scan Successful"),
//         `${scannedBarcodeList[scannedBarcodeList.length - 1]} ${i18n.t(
//           "has been scanned!"
//         )}, ${barcodeList.length - scannedBarcodeList.length}${i18n.t(
//           "package remaining"
//         )}`,
//         [{ text: "OK", onPress: () => setScanned(false) }]
//       );
//     }
//   }
// }, [scannedBarcodeList]);

// const handleBarCodeScanned = ({ type, data }) => {
//   setScanned(true);

//   if (!scannedBarcodeList.includes(data) && barcodeList.includes(data)) {
//     const payload = {
//       courierId: userInfo.courierId,
//       orderId: orderId,
//       itemBarcode: Number(data),
//       itemState: "1",
//     };
//     console.log("driver scan code input", payload);
//     axios
//       .post(SERVER_URL + "order/courierScanBarcode.php", payload, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//       .then((res) => {
//         console.log("driver scan code result", res.data);
//         if (res.data.message === "success") {
//           if (!scannedBarcodeList.includes(data)) {
//             setScannedBarcodeList([...scannedBarcodeList, data]);
//           }
//         } else {
//           if (res.data.message === "already scan") {
//             //已经扫过该包裹了
//             handleScanedPackages(data);
//           } else {
//             //扫描失败
//             Alert.alert(
//               i18n.t("Scan Failed"),
//               `Package ${data} scan failed!`,
//               [{ text: "OK", onPress: () => setScanned(false) }]
//             );
//           }
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   } else {
//     if (scannedBarcodeList.includes(data)) {
//       //已经扫过该包裹了
//       handleScanedPackages(data);
//     } else {
//       //扫描的包裹不属于这个订单
//       Alert.alert(
//         i18n.t(i18n.t("Scan Error")),
//         i18n.t("Please Scan the correct item from this order"),
//         [{ text: "OK", onPress: () => setScanned(false) }]
//       );
//     }
//   }
// };

// const handleScanedPackages = (barcode) => {
//   //已经扫过该包裹了
//   if (!scannedBarcodeList.includes(barcode)) {
//     setScannedBarcodeList([...scannedBarcodeList, barcode]);
//   }
// };

// //   //骑手扫描到所有包裹，改变订单状态，可以开始配送。
// const driverChangeOrderstate = async () => {
//   const payload = {
//     courierId: userInfo.courierId,
//     orderId: orderId,
//     orderState: "5",
//   };
//   const result = await axios.post(
//     SERVER_URL + "order/courierChangeOrder.php",
//     payload,
//     {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );
//   if (result.data.message === "success") {
//     Alert.alert(
//       i18n.t("Start Delivering"),
//       i18n.t("You have successfully start delivering this order!"),
//       [{ text: "OK", onPress: () => console.log("clicked") }]
//     );
//   } else {
//     Alert.alert(
//       i18n.t("Change Order Status Failed"),
//       i18n.t("Could not start your order, please try again later!"),
//       [{ text: "OK", onPress: () => console.log("clicked") }]
//     );
//   }
//   console.log("changed state result", result.data);
// };
