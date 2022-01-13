//react
import React, { useState, useEffect } from "react";

//react-native components
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  RefreshControl,
} from "react-native";

//packages
import i18n from "i18n-js";
import { useNavigation, useIsFocused } from "@react-navigation/native";

//translation data
import { languageData } from "../../i18n/i18n";

//styles
import { Colors } from "../../styles";

//redux
import { useSelector, useDispatch } from "react-redux";
import { getDriverOrderList } from "../../actions/order";

//components
import OrderCard from "./components/OrderCard";
import LoadingScreen from "../../components/LoadingScreen";

const OrderList = () => {
  i18n.translations = languageData;
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const [tab, setTab] = useState(0);
  const [localOrderList, setLocalOrderList] = useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [pendingList, setPendingList] = useState([]);
  const [finishList, setFinishList] = useState([]);
  const { driverOrderList } = useSelector((state) => state.orderData);
  const { userInfo } = useSelector((state) => state.accountData);

  useEffect(() => {
    if (isFocused && userInfo) {
      const data = {
        courierId: userInfo.courierId,
      };

      dispatch(getDriverOrderList(data));
    }
  }, [isFocused]);

  useEffect(() => {
    if (driverOrderList) {
      setRefreshing(false);
      changeOrderList(tab);
      const pending = driverOrderList.filter((order) => order.orderState < "6");
      setPendingList(pending);
      setFinishList(driverOrderList.filter((order) => order.orderState >= "6"));
      console.log(tab)
      if(tab === 0) {
        setLocalOrderList(pending);
      }
    }
  }, [driverOrderList]);

  const handleTabSelect = (id) => {
    changeOrderList(id);
    setTab(id);
    Keyboard.dismiss();
  };

  const changeOrderList = (id) => {
    if (id === 1) {
      setLocalOrderList(finishList);
    } else {
      setLocalOrderList(pendingList);
    }
  };

  // const onRefresh = React.useCallback(() => {
  //   setRefreshing(true);
  //   wait(2000).then(() => setRefreshing(false));
  // }, []);

  const onRefresh = () => {
    setRefreshing(true);
    const data = {
      courierId: userInfo.courierId,
    };

    dispatch(getDriverOrderList(data));
  };

  const tabMenu = [
    {
      id: 0,
      title: i18n.t("Ongoing"),
    },
    {
      id: 1,
      title: i18n.t("finished"),
    },
  ];

  if (!localOrderList) {
    return <LoadingScreen />;
  }

  return (
    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* tab menu */}
        <View style={styles.tabContainer}>
          {tabMenu.map((element) => {
            return (
              <TouchableOpacity
                key={element.id}
                onPress={() => handleTabSelect(element.id)}
                style={
                  tab === element.id ? styles.activeTab : styles.unActiveTab
                }
              >
                <Text style={styles.tabText}>{`${element.title}(${element.id===0?pendingList.length:finishList.length})`}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* order list */}
        <View style={styles.orderlistContainer}>
          <FlatList
            data={localOrderList}
            renderItem={({ item, index }) => (
              <OrderCard
                key={index}
                recipientAddress={
                  item.recipientAddress.street+","+
                  item.recipientAddress.city+","+
                  item.recipientAddress.province+","+
                  item.recipientArea+","+item.recipientAddress.postal
                }
                orderNo={item.orderNo}
                orderState={item.orderState}
                isDropable={item.isDropable}
                deliverNo={item.deliverNo}
                senderName={item.senderName}
                orderNote={item.orderNote}
                sameAddress={item.sameAddress}
                userInfo={userInfo}
                orderId={item.orderId}
                onFresh={onRefresh}
              />
            )}
            keyExtractor={(item) => item.orderNo}
            // onScrollEndDrag={() => console.log("end")}
            // onScrollBeginDrag={() => console.log("start")}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default OrderList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabContainer: {
    flex: 0.5,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: Colors.primary,
  },
  activeTab: {
    borderBottomWidth: 4,
    borderBottomColor: "#FFFFFF",
    paddingVertical: "2%",
    paddingHorizontal: "4%",
  },
  unActiveTab: {
    borderBottomWidth: 4,
    borderBottomColor: Colors.primary,
    paddingVertical: "2%",
    paddingHorizontal: "4%",
  },
  tabText: {
    fontSize: 16,
    color: "white",
  },

  orderlistContainer: {
    flex: 5.5,
  },
});
