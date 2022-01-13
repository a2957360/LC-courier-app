//react
import React, { useState, useEffect } from "react";

//react-native components
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";

//packages
import i18n from "i18n-js";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import DashedLine from "react-native-dashed-line";
import { getDistance } from "geolib";
import * as Location from "expo-location";

//translation data
import { languageData } from "../../i18n/i18n";

//styles
import { Colors, CustomDimensions } from "../../styles";

//redux
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { SERVER_URL } from "../../config/settings";

//components
import LoadingScreen from "../../components/LoadingScreen";

const MapList = () => {
  const isFocused = useIsFocused();
  i18n.translations = languageData;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [clickedMarker, setClickedMarker] = useState(null);
  const [currentLocation, setCurrentLocation] = useState();
  const [distance, setDistance] = useState();

  const [orders, setOrders] = useState();

  const { driverOrderList } = useSelector((state) => state.orderData);
  const { userInfo } = useSelector((state) => state.accountData);

  const [driveringOrderList, setDriveringOrderList] = useState([]);
  const MAP_LIST_DATA = [
    {
      couponCode: "",
      courierId: "0",
      createTime: "2021-07-29 13:09:40",
      deliverType: "Regular",
      itemList: [
        {
          barcodeImage:
            "http://lc.finestudiotest.com/include/pic/21072901022504",
          itemBarcode: 652292492,
          itemIncubator: "1",
          itemIncubatorPrice: 10,
          itemInsurance: "Basic",
          itemInsurancePrice: 10,
          itemNote: "flowers for mike",
          itemPrice: 10,
          itemSize: "Small",
          itemSizePrice: 10,
          itemState: "0",
          itemType: "flower",
          itemWeight: "60",
        },
        {
          barcodeImage:
            "http://lc.finestudiotest.com/include/pic/21072901091300",
          itemBarcode: 576608264,
          itemIncubator: "0",
          itemIncubatorPrice: 0,
          itemInsurance: "Regular",
          itemInsurancePrice: 10,
          itemNote: "chicken dinner",
          itemPrice: 10,
          itemSize: "Large",
          itemSizePrice: 10,
          itemState: "0",
          itemType: "food",
          itemWeight: "100",
        },
      ],
      orderDeliverFee: "80",
      orderDiscount: "0",
      orderId: "14",
      orderInsurance: "20",
      orderNo: "LC21072913094014",
      orderState: "0",
      orderTax: "13.65",
      orderTip: "25",
      orderTotal: "118.65",
      paymentMethod: "",
      paymentNo: "",
      recipientAddress: {
        city: "Markham",
        lat: 43.8551454,
        lng: -79.3615159,
        postal: "L3R 5L9",
        province: "Ontario",
        street: "25 Valleywood Drive",
        unit: null,
      },
      recipientEmail: "mike@mail.com",
      recipientName: "Mike Townly",
      recipientPhone: "6478855996",
      senderAddress: {
        city: "Markham",
        lat: "",
        lng: "",
        postal: "L3T 5T1",
        province: "Ontario",
        street: "48 Aileen Road",
        unit: "",
      },
      senderEmail: "channing@mail.com",
      senderName: "Channing Wang",
      senderPhone: "6478886666",
      userId: "36",
    },
    {
      couponCode: "",
      courierId: "0",
      createTime: "2021-07-29 17:25:34",
      deliverType: "Regular",
      itemList: [
        {
          barcodeImage:
            "http://lc.finestudiotest.com/include/pic/21072905174201",
          itemBarcode: 968417964,
          itemIncubator: "1",
          itemIncubatorPrice: 10,
          itemInsurance: "Regular",
          itemInsurancePrice: 10,
          itemNote: "small package for my bro",
          itemPrice: 10,
          itemSize: "Small",
          itemSizePrice: 10,
          itemState: "0",
          itemType: "flower",
          itemWeight: "5",
        },
      ],
      orderDeliverFee: "50",
      orderDiscount: "0",
      orderId: "15",
      orderInsurance: "10",
      orderNo: "LC21072917253415",
      orderState: "0",
      orderTax: "10.4",
      orderTip: "30",
      orderTotal: "90.4",
      paymentMethod: "",
      paymentNo: "",
      recipientAddress: {
        city: "Markham",
        lat: 43.8222414,
        lng: -79.3264171,
        postal: "L3R 4N3",
        province: "Ontario",
        street: "7070 Warden Avenue",
        unit: null,
      },
      recipientEmail: "datonghua@mail.com",
      recipientName: "da tong hua",
      recipientPhone: "8886669999",
      senderAddress: {
        city: "Markham",
        lat: 43.8498531,
        lng: -79.34767219999999,
        postal: "L3R 3P3",
        province: "Ontario",
        street: "3255 Highway 7",
        unit: "120",
      },
      senderEmail: "luke@mail.com",
      senderName: "Luke Dunphy",
      senderPhone: "6475556688",
      userId: "36",
    },
  ];
  // useEffect(() => {
  //   console.log(2, isFocused);
  //   if (isFocused && userInfo) {
  //     const data = {
  //       courierId: userInfo.courierId,
  //     };

  //     axios
  //       .post(SERVER_URL + "order/getCourierOrderList.php", data, {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       })
  //       .then((res) => {
  //         if (res.data.message === "success") {
  //           const result = res.data.data.filter((order) =>
  //             ["4", "5", "6", "7"].includes(order.orderState)
  //           );

  //           setOrders(result);
  //         }
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   }
  // }, [isFocused]);
  useEffect(() => {
    const OrderList = driverOrderList?.filter((item) => {
      return item.orderState === "4" || item.orderState === "5"
    }) ?? []
    setDriveringOrderList(OrderList);
  }, [driverOrderList])
  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied")
        alert("Permission to access location was denied");
        // return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const result = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      console.log("current location", result);
      setCurrentLocation(result);
    })();
  }, []);

  function regionFrom(lat, lon, distance) {
    distance = distance / 2;
    const circumference = 40075;
    const oneDegreeOfLatitudeInMeters = 111.32 * 1000;
    const angularDistance = distance / circumference;

    const latitudeDelta = distance / oneDegreeOfLatitudeInMeters;
    const longitudeDelta = Math.abs(
      Math.atan2(
        Math.sin(angularDistance) * Math.cos(lat),
        Math.cos(angularDistance) - Math.sin(lat) * Math.sin(lat)
      )
    );

    return {
      latitude: lat,
      longitude: lon,
      latitudeDelta,
      longitudeDelta,
    };
  }

  const res = regionFrom(43.823181, -79.389427, CustomDimensions.deviceHeight);

  const MARKER_LIST = [
    {
      latlng: {
        latitude: 43.820702,
        longitude: -79.388443,
      },
      title: "pizza hut marker",
      description: "this is the first marker",
    },
    {
      latlng: {
        latitude: 43.81971,
        longitude: -79.39832,
      },
      title: "shopper drug store marker",
      description: "this is the second marker",
    },
    {
      latlng: {
        latitude: 43.82218,
        longitude: -79.32618,
      },
      title: "t&t supermarket marker",
      description: "this is the third marker",
    },
  ];

  useEffect(() => {
    if (currentLocation && clickedMarker) {
      const latlng = {
        latitude: clickedMarker.recipientAddress.lat,
        longitude: clickedMarker.recipientAddress.lng,
      };
      setDistance(getDistance(currentLocation, latlng));
    }
  }, [clickedMarker, currentLocation]);
console.log(driverOrderList);
console.log(currentLocation);
console.log("11111=====================")
  if (!driverOrderList || !currentLocation) {
    return <LoadingScreen />;
  }
  return (
    <View style={styles.container}>
      {
        // driveringOrderList[0] &&
        <MapView
          showsUserLocation={true}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: driveringOrderList[0]?.recipientAddress.lat??currentLocation?.latitude,
            longitude: driveringOrderList[0]?.recipientAddress.lng??currentLocation?.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          // initialRegion={{
          //   latitude: 43.823181,
          //   longitude: -79.389427,
          //   latitudeDelta: 0.0922,
          //   longitudeDelta: 0.0421,
          // }}

          style={styles.map}
        >
          {driveringOrderList.map((marker, index) => {
            const latlng = {
              latitude: marker.recipientAddress.lat,
              longitude: marker.recipientAddress.lng,
            };
            return (
              <Marker
                key={index}
                coordinate={latlng}
                // coordinate={marker.latlng}
                // title={marker.title}
                // description={marker.description}
                image={
                  clickedMarker?.orderId === marker.orderId
                    ? require("../../assets/images/Pin_0.png")
                    : require("../../assets/images/Pin_1.png")
                }
                onPress={() => setClickedMarker(marker)}
              />
            );
          })}
        </MapView>
      }
      {/* overlay card */}
      {clickedMarker ? (
        distance ? (
          <TouchableOpacity
            onPress={() => {
              console.log(clickedMarker.orderNo);
              navigation.navigate("OrderDetail", {
                orderNo: clickedMarker.orderNo,
              });
            }}
            activeOpacity={1}
            style={styles.overlayContainer}
          >
            {/* order number & status section */}
            <View style={styles.twoContentRow}>
              {/* order# */}
              <View style={styles.flexRow}>
                <Text style={styles.title}>{i18n.t("Order#")}:</Text>
                <Text style={styles.textData}>{clickedMarker.orderNo}</Text>
              </View>

              {/* order status */}
              <View style={styles.flexRow}>
                <Image
                  source={require("../../assets/images/Status1.png")}
                  style={{ height: 10, width: 10, marginRight: 8 }}
                />
                <Text style={styles.textData}>{clickedMarker.orderState === "4" ? i18n.t("Pending") : clickedMarker.orderState === "5" ? i18n.t("Delivering") : ""}</Text>
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
                <Text>{i18n.t("Deliver")}:</Text>
              </View>

              <View>
                <View style={styles.mb2}>
                  <Text style={styles.textData}>
                    {(clickedMarker.recipientAddress.unit
                      ? `${clickedMarker.recipientAddress.unit}/${clickedMarker.recipientAddress.street}`
                      : clickedMarker.recipientAddress.street) +
                      `, ${clickedMarker.recipientAddress.city}, ${clickedMarker.recipientAddress.province}, ${clickedMarker.recipientAddress.postal}`}
                  </Text>
                </View>
                <Text style={{ ...styles.textData, ...styles.mb2 }}>
                  {clickedMarker.recipientName}, {clickedMarker.recipientPhone}
                </Text>
              </View>
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
              <Text style={styles.textData}>{clickedMarker.senderName}</Text>
            </View>
            <DashedLine
              dashLength={3}
              dashGap={5}
              dashColor={Colors.lineDash}
              style={{ marginVertical: 10 }}
            />
            {/* orderNote */}
            <View style={styles.flexRow}>
              <Text style={styles.title}>{i18n.t("Note")}:</Text>
              <Text style={styles.textData}>{clickedMarker.orderNote}</Text>
            </View>
            <DashedLine
              dashLength={3}
              dashGap={5}
              dashColor={Colors.lineDash}
              style={{ marginVertical: 10 }}
            />
            {/* distance */}
            <View style={styles.flexRow}>
              <Text style={styles.title}>{i18n.t("Distance")}:</Text>
              <Text style={styles.textData}>{distance / 1000}km</Text>
            </View>
          </TouchableOpacity>
        ) : (
            <TouchableOpacity activeOpacity={1} style={styles.overlayContainer}>
              <LoadingScreen />
            </TouchableOpacity>
          )
      ) : null}
    </View>
  );
};

export default MapList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  overlayContainer: {
    width: "94%",
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignSelf: "center",
    position: "absolute",
    bottom: 15,
    backgroundColor: Colors.white,
    borderRadius: 12,
  },
  twoContentRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  },
  addressContainer: {
    display: "flex",
    flexDirection: "row",
    width: "65%",
  },
  mb2: {
    marginBottom: 10,
  },
});
