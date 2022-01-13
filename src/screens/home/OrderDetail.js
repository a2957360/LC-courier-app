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
  TouchableOpacity
} from "react-native";

//packages
import i18n from "i18n-js";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import DashedLine from "react-native-dashed-line";
import * as ImagePicker from "expo-image-picker";
import * as Linking from "expo-linking";
import * as Clipboard from "expo-clipboard";

//translation data
import { languageData } from "../../i18n/i18n";

//styles
import { Colors, CustomDimensions } from "../../styles";

//constants
import { ORDER_STATUS, SERVER_URL } from "../../config/settings";

//redux
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { searchDriverOrder } from "../../actions/order";

//components
import Buttons from "../../components/Buttons";
import LoadingScreen from "../../components/LoadingScreen";
import EnterModal from "../../components/EnterModal";

const OrderDetail = ({ route }) => {
  i18n.translations = languageData;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const { orderDetail } = useSelector((state) => state.orderData);
  const { userInfo } = useSelector((state) => state.accountData);
  const [modalVisible, setModalVisible] = useState(false);
  console.log(orderDetail);
  useEffect(() => {
    if (isFocused && route.params.orderNo && userInfo) {
      console.log(route.params.orderNo, userInfo);
      const data = {
        courierId: userInfo.courierId,
        orderNoList: [route.params.orderNo],
      };
      dispatch(searchDriverOrder(data));
    }
  }, [isFocused]);

  const handleUndeliver = () => {
    navigation.navigate("UndeliverReason", {
      orderId: orderDetail.orderId,
      orderNo: orderDetail.orderNo,
    });
  };
  const createTwoButtonModal = async() => {
    const str = await Clipboard.getStringAsync();
    console.log(str,"copy");
    setModalVisible(!modalVisible);
  }
  const returnDistribution = async() => {
    const payload = {
      courierId: userInfo.courierId,//骑手Id
      orderId: orderDetail.orderId,//修改的订单Id
      orderState: "5"//固定为5
    }
    console.log(payload);
    const result = await axios.post(
      SERVER_URL + "order/courierChangeOrder.php",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (result.data.message === "success") {
      Alert.alert(
        i18n.t("Return Distribution"),
        i18n.t("You have successfully return distribution this order!"),
        [{ text: "OK", onPress: () => console.log("clicked") }]
      );
      // 返回订单列表刷新
      navigation.navigate();
      route.params.update();
    } else {
      Alert.alert(
        i18n.t("Change Order Status Failed"),
        i18n.t("Could not return to distribution, please try again later!"),
        [{ text: "OK", onPress: () => console.log("clicked") }]
      );
    }
  }
  // 上传图片
  const getOpenPicker = async () => {
    const { status: medicalPerm } =
      await ImagePicker.getMediaLibraryPermissionsAsync();
    // only if user allows permission
    console.log(medicalPerm)
    if (medicalPerm) {
      try {
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: false,
          aspect: [4, 3],
          quality: 0,
        });
        if (!pickerResult.cancelled) {
          navigation.navigate("ImageUpload", {
            image: [pickerResult.uri],
            orderId: orderDetail.orderId,
            orderNo: orderDetail.orderNo,
          });
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
  const confirmModal = async(value) => {
    setModalVisible(false);
    const payload = {
      courierId: userInfo.courierId,
      itemBarcode: value,
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
    //提交成功
    if (res.data.message === "success") {
      //已扫完全部包裹，开始配送,
      if (res.data.data.unScanNum === "0") {
        Alert.alert(
          i18n.t("Delivery Success"),
          `${i18n.t("Item")} ${value} ${i18n.t("has been scanned!")} ${i18n.t(
            "You are now delivering this order!"
          )}`,
          [
            {
              text: i18n.t("Finish"),
              onPress: () => {
                setModalVisible(false);
                navigation.goBack();
                route.params.update();
              },
            },
          ]
        );
      }
      //还有包裹未扫
      else {
        Alert.alert(
          i18n.t("Delivery Success"),
          `${i18n.t("Item")} ${value} ${i18n.t("has been scanned!")} ${i18n.t(
            "You have"
          )} ${res.data.data.unScanNum} ${i18n.t(
            "items remaining to be scaned for this order."
          )}`,
          [{ text: "Continue", onPress: () => setModalVisible(true) }]
        );
      }
    } else if (res.data.message === "already scan") {
      Alert.alert(
        i18n.t("Error"),
        `${i18n.t("Item")} ${value} ${i18n.t("has already been scanned!")}`,
        [{ text: i18n.t("Confirm"), onPress: () => setModalVisible(false) }]
      );
    }
    //扫描失败
    else {
      Alert.alert(i18n.t("Error"), i18n.t("Please try again later!"), [
        { text: i18n.t("Confirm"), onPress: () => setModalVisible(false) },
      ]);
    }
  }

  const cancelModal = () => {
    setModalVisible(false);
  }

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
          navigation.navigate("ImageUpload", {
            image: [pickerResult.uri],
            orderId: orderDetail.orderId,
            orderNo: orderDetail.orderNo,
          });
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
  /** copy */
  const handleCopy = (index) => {
    Clipboard.setString(orderDetail.itemList[index].itemBarcode);
  }

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
        keyboardShouldPersistTaps="handled"
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

        {/** Recipient Name */}
        <View style={styles.RecipientContainer}>
          <Text style={styles.title}>{i18n.t("Recipient Name")}:</Text>
          <Text style={styles.textData}>{orderDetail.recipientName}</Text>
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

        {/* Create Time */}
        <View style={styles.flexRow}>
          <Text style={styles.title}>{i18n.t("Create Time")}:</Text>
          <Text style={styles.textData}>{orderDetail.createTime}</Text>
        </View>

        <DashedLine
          dashLength={3}
          dashGap={5}
          dashColor={Colors.lineDash}
          style={{ marginVertical: 10 }}
        />
        {/** Scan Time */}
        <View style={styles.flexRow}>
          <Text style={styles.title}>{i18n.t("pickupDate")}:</Text>
          <Text style={styles.textData}>{orderDetail.pickupDate}</Text>
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

        {/* isDropable */}
        <View style={styles.flexRow}>
          <Text style={styles.title}>{i18n.t("isDropable")}:</Text>
          <Text style={styles.textData}>{orderDetail.isDropable==="0"?i18n.t("UnDropable"):i18n.t("Dropable")}</Text>
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
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={styles.itemBarCode}>{element.itemBarcode}</Text>
                <TouchableOpacity style={styles.ItemCodeButton} onPress={() => handleCopy(index)}>
                  <Text style={{ color: Colors.primary, fontSize: 14 }}>
                    {i18n.t("copy")}
                  </Text>
                </TouchableOpacity>
              </View>
              <DashedLine
                dashLength={3}
                dashGap={5}
                dashColor={Colors.lineDash}
                style={{ marginVertical: 10 }}
              />

              {/* item state */}
              <View style={styles.flexRow}>
                <Text style={styles.title}>{i18n.t("Scan State")}:</Text>
                <Text style={styles.textData}>
                  {element.itemState == "1"
                    ? i18n.t("UnScaned")
                    : i18n.t("Scaned")}
                </Text>
              </View>

              <DashedLine
                dashLength={3}
                dashGap={5}
                dashColor={Colors.lineDash}
                style={{ marginVertical: 10 }}
              />
              {/* senderName */}
              <View style={styles.flexRow}>
                <Text style={styles.title}>{i18n.t("senderName")}:</Text>
                <Text style={styles.textData}>{orderDetail?.senderName}</Text>
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
                <Text style={styles.textData}>{orderDetail?.orderNote}</Text>
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

        {/* 已送达图片 */}
        {orderDetail.orderState === "6" && orderDetail.deliverImage !== "" && (
          <View>
            {Array.isArray(orderDetail?.deliverImage)?orderDetail?.deliverImage?.map((element, index) => {
              return (
                <View style={styles.imageContainer} key={index}>
                  <Image
                    source={{ uri: element }}
                    style={{ height: "100%", width: "100%", resizeMode: "stretch" }}
                  />
                </View>
              );
            }): orderDetail?.deliverImage &&
              <View style={styles.imageContainer} >
                <Image
                  source={{ uri: orderDetail?.deliverImage }}
                  style={{ height: "100%", width: "100%", resizeMode: "stretch" }}
                />
              </View>
            }
            {/* <View style={styles.imageContainer}>
              <Image
                // source={{
                //   uri: "https://media.istockphoto.com/photos/red-apple-picture-id184276818?s=612x612",
                // }}
                // source={{ uri: orderDetail?.deliverImage }}
                style={{ height: "100%", width: "100%", resizeMode: "stretch" }}
              />
            </View> */}
            <View style={styles.twoButtonsContainer}>
              <View
                style={{
                  backgroundColor: Colors.buttonGrey,
                  width: "45%",
                  borderRadius: 30,
                  paddingVertical: 8,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Text style={{ color: Colors.white, fontSize: 14 }}>
                  Order Completed
                </Text>
              </View>
              <Buttons
                type={"blue"}
                title={i18n.t("Return Distribution")}
                handleButtonPress={returnDistribution}
              />
            </View>
          </View>
        )}

        {/* 未送达原因 */}
        {orderDetail.orderState === "7" && orderDetail.unDeliverReason !== "" && (
          <View style={styles.flexRow}>
            <Text style={styles.title}>{i18n.t("Undeliver Reason")}:</Text>

            <View style={styles.button}>
              <Text style={{ color: Colors.orange, fontSize: 14 }}>
                {orderDetail.unDeliverReason}
              </Text>
            </View>
          </View>
        )}

        {/* 开始配送 */}
        {orderDetail.orderState === "4" && (
          <View style={styles.marginBottomContainer}>
            <View style={styles.twoButtonsContainer}>
              <Buttons
                type={"green"}
                title={i18n.t("Start Delivering")}
                handleButtonPress={() =>
                  navigation.navigate("ScanOrderDetail", {
                    barcodeList: orderDetail.itemList?.map(
                      (order) => order.itemBarcode
                    ),
                    orderId: orderDetail.orderId,
                    orderNo: orderDetail.orderNo,
                  })
                }
              />
              <Buttons
                type={"blue"}
                title={i18n.t("Enter Delivering Code")}
                handleButtonPress={createTwoButtonModal}
              />
            </View>
          </View>
        )}
        
        {/* 无法送达 和 拍照确认 */}
        {orderDetail.orderState === "5" && (
          <View style={styles.marginBottomContainer}>
            <View style={styles.twoButtonsContainer}>
              <Buttons
                type={"blue"}
                title={i18n.t("Mobile upload")}
                handleButtonPress={getOpenPicker}
              />
              <Buttons
                type={"green"}
                title={i18n.t("Take Picture")}
                handleButtonPress={takePhoto}
              />
              {/* <Buttons
                type={"grey"}
                title={i18n.t("Can not deliver")}
                handleButtonPress={handleUndeliver}
              /> */}
            </View>
            <View style={styles.ButtonContainer}>
              <Buttons
                type={"grey"}
                title={i18n.t("Can not deliver")}
                handleButtonPress={handleUndeliver}
              />
            </View>
          </View>
        )}
        <EnterModal modalVisible={modalVisible} confirmModal={confirmModal} cancelModal={cancelModal}/>
        {/* <Modal isVisible={modalVisible}>
          <View>
            <Text>Hello!</Text>
            <Button title="Hide modal" onPress={toggleModal}>关闭</Button>
          </View>
        </Modal> */}
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
  itemBarCode: {
    marginLeft: 90,
    marginTop: 15,
    marginRight: 30
  },
  title: {
    color: Colors.textBlack,
    fontSize: 14,
    marginRight: 8,
  },
  textData: {
    color: Colors.textDataGrey,
    fontSize: 14,
  },
  RecipientContainer: {
    display: "flex",
    flexDirection: "row",
    width: "65%",
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

  ItemCodeButton: {
    height: 24,
    borderColor: Colors.primary,
    borderWidth: 1,
    color: Colors.primary,
    paddingHorizontal: 10,
    // paddingVertical: 4,
    borderRadius: 5,
    marginTop: 10,
    paddingTop: 3
  },

  mb2: {
    marginBottom: 10,
  },

  oneButtonContainer: {
    alignItems: "center",
    marginBottom: 100,
  },

  ButtonContainer: {
    marginTop: 20,
  },

  twoButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    // marginBottom: 100,
  },
  marginBottomContainer: {
    marginBottom: 100,
  },

  linkingContainer: {
    fontSize: 10,
    color: "white",
    backgroundColor: Colors.primary,
  },

  imageContainer: {
    width: CustomDimensions.deviceWidth * 0.85,
    height: CustomDimensions.deviceWidth * 0.85,
    marginBottom: "10%",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  collectContainer: {
    color: Colors.primary,
    borderColor: Colors.primary,
    borderWidth: 1,
    // textAlign: 'center',
    // alignItems: 'center',
    marginLeft: 30,
    // paddingLeft: 10, 
    // paddingRight: 10
  },
});
