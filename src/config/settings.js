//server address
export const SERVER_URL = "http://lc.finestudiotest.com/api/";

//order status
// 4待配送，5配送中，6配送完成，7配送失败
export const ORDER_STATUS = {
  4: {
    title: "Pending",
    color: require("../assets/images/Status1.png"),
    image: require("../assets/images/Pending.png"),
  },
  5: {
    title: "Delivering",
    color: require("../assets/images/Status2.png"),
    image: require("../assets/images/Processing.png"),
  },
  6: {
    title: "Completed",
    color: require("../assets/images/Status3.png"),
    image: require("../assets/images/Finished.png"),
  },
  7: {
    title: "Failed",
    color: require("../assets/images/Status4.png"),
    image: require("../assets/images/Failed.png"),
  },
};
