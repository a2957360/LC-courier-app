import React from "react";

import { StyleSheet, View, ActivityIndicator } from "react-native";

//等待数据加载时的loading screen，用户可以进行操作（如后退，切换tab等）。
//样式： ios为菊花，android为圆圈
export default function LoadingScreen() {
  return (
    <View style={styles.spinnerContainer}>
      <ActivityIndicator size="large" color="black" />
    </View>
  );
}

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
