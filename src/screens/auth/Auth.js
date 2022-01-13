//react
import React, { useState, useEffect } from "react";

//react-native components
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

//packages
import i18n from "i18n-js";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";

//translation data
import { languageData } from "../../i18n/i18n";

//styles
import { Colors, CustomDimensions } from "../../styles";
import { TextInput } from "react-native-gesture-handler";

//redux
import { useSelector, useDispatch } from "react-redux";
import { loginUser, getDriverInfo } from "../../actions/account";

//components

const Auth = () => {
  i18n.translations = languageData;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [loginFlag, setLoginFlag] = useState(false);
  const [signUpFlag, setSignUpFlag] = useState(false);
  const [signupNext, setSignupNext] = useState(false);
  const [loginInput, setLoginInput] = useState({
    phone: "",
    password: "",
  });
  const [signupInput, setSignupInput] = useState({
    phone: "",
    email: "",
    password: "",
    secondPassword: "",
  });

  const errorCodeObj = {
    101: "密码两次不一致",
    102: "邮件发送错误",
    103: i18n.t("Not Activicated"),
    104: i18n.t("Incorrect Password"),
    105: i18n.t("No User"),
    106: "电话已经存在",
    107: i18n.t("Activation URL is wrong"),
    108: i18n.t("Verification code wrong"),
    109: "邮箱已被使用",
    110: "新邮箱和旧邮箱相同",
    111: "邮箱已注册",
    112: "信息填写不全",
  };

  const { errorCode, loginMessage } = useSelector((state) => state.accountData);

  useEffect(() => {
    const autoLogin = async () => {
      const userId = await AsyncStorage.getItem("userId");
      if (userId && userId !== null) {
        navigation.replace("Home");
      }
    };
    autoLogin();
  }, []);

  const handleSignup = () => {
    const { phone, email, password, secondPassword } = signupInput;
    if (phone === "" || !phone) {
      alert(i18n.t("Please enter your phone"));
      return;
    } else if (email === "" || !email) {
      alert(i18n.t("Please enter your email"));
      return;
    } else if (
      password === "" ||
      !password ||
      secondPassword === "" ||
      !secondPassword
    ) {
      alert(i18n.t("Please enter your password"));
      return;
    }
    setSignupNext(true);
    setSignUpFlag(false);
  };

  const handleLogin = () => {
    if (!loginInput.phone || !loginInput.password) {
      alert(
        !loginInput.phone
          ? i18n.t("Please enter your phone")
          : i18n.t("Please enter your password")
      );
    } else {
      const data = {
        courierPhone: loginInput.phone,
        courierPassword: loginInput.password,
      };
      dispatch(loginUser(data));
    }
  };

  useEffect(() => {
    if (loginMessage) {
      if (loginMessage !== "success") {
        alert(errorCodeObj[errorCode]);
      } else {
        navigation.replace("Home");
      }
    }
  }, [loginMessage, errorCode]);

  return (
    // <SafeAreaView style={styles.container}>
    // <KeyboardAvoidingView
    //   behavior={Platform.OS === "ios" ? "padding" : null}
    //   style={{ flex: 1 }}
    // >
    <KeyboardAwareScrollView
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={styles.container}
      scrollEnabled={false}
    >
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            {/* <Text style={styles.header}>Header</Text> */}
            <View style={{ height: CustomDimensions.deviceHeight * 0.75 }}>
              <Image
                source={require("../../assets/images/LogoLarge.png")}
                style={styles.logo}
              />
              {loginFlag && (
                <>
                  <View
                    style={{
                      ...styles.input,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text>+1</Text>
                    <TextInput
                      onChangeText={(value) =>
                        setLoginInput({
                          ...loginInput,
                          phone: value,
                        })
                      }
                      keyboardType={"phone-pad"}
                      placeholder=" Phone"
                      style={{ width: "100%" }}
                    />
                  </View>
                  <TextInput
                    secureTextEntry={true}
                    onChangeText={(value) =>
                      setLoginInput({
                        ...loginInput,
                        password: value,
                      })
                    }
                    placeholder="Password"
                    style={styles.input}
                  />
                </>
              )}

              {signUpFlag && (
                <>
                  {/* <TextInput placeholder="Phone" style={styles.input} />
                   */}
                  <View
                    style={{
                      ...styles.input,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text>+1</Text>
                    <TextInput
                      onChangeText={(value) =>
                        setSignupInput({
                          ...signupInput,
                          phone: value,
                        })
                      }
                      keyboardType={"phone-pad"}
                      placeholder=" Phone"
                      style={{ width: "100%" }}
                    />
                  </View>
                  <TextInput
                    onChangeText={(value) =>
                      setSignupInput({
                        ...signupInput,
                        email: value,
                      })
                    }
                    placeholder="Email"
                    style={styles.input}
                  />
                  <TextInput
                    onChangeText={(value) =>
                      setSignupInput({
                        ...signupInput,
                        password: value,
                      })
                    }
                    placeholder="Password"
                    style={styles.input}
                  />
                  <TextInput
                    onChangeText={(value) =>
                      setSignupInput({
                        ...signupInput,
                        secondPassword: value,
                      })
                    }
                    placeholder="Repeat Password"
                    style={styles.input}
                  />
                </>
              )}

              {signupNext && (
                <>
                  <View style={{ display: "flex", alignItems: "center" }}>
                    <Text style={styles.congradulation}>
                      {i18n.t("Congratulation")}
                    </Text>
                    <Text style={{ fontSize: 16, color: Colors.white }}>
                      {i18n.t(
                        "You have successfully submitted the request, please wait for approval"
                      )}
                    </Text>
                  </View>
                </>
              )}
            </View>

            {!loginFlag && !signUpFlag ? (
              signupNext ? (
                <TouchableOpacity
                  onPress={() => {
                    setSignupNext(false);
                  }}
                  style={styles.loginButton}
                  activeOpacity={1}
                >
                  <Text style={{ fontSize: 16, color: Colors.buttonGrey }}>
                    {i18n.t("Return")}
                  </Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() => setLoginFlag(true)}
                    style={styles.loginButton}
                    activeOpacity={1}
                  >
                    <Text style={{ fontSize: 16, color: Colors.buttonGrey }}>
                      {i18n.t("Login")}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setSignUpFlag(true)}
                    style={styles.registerButton}
                    activeOpacity={1}
                  >
                    <Text style={{ fontSize: 16, color: Colors.white }}>
                      {i18n.t("Signup")}
                    </Text>
                  </TouchableOpacity>
                </>
              )
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => {
                    if (signUpFlag) {
                      handleSignup();
                    } else if (loginFlag) {
                      handleLogin();
                    }
                  }}
                  style={styles.loginButton}
                  activeOpacity={1}
                >
                  <Text style={{ fontSize: 16, color: Colors.buttonGrey }}>
                    {i18n.t("Next")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.registerButton}
                  activeOpacity={1}
                  onPress={() => {
                    setSignUpFlag(false);
                    setLoginFlag(false);
                  }}
                >
                  <Text style={{ fontSize: 16, color: Colors.white }}>
                    {i18n.t("Back")}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* <View style={{ flex: 1 }} /> */}
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </KeyboardAwareScrollView>

    // </KeyboardAvoidingView>
    // </SafeAreaView>
  );
};

export default Auth;

const styles = StyleSheet.create({
  //     container: {
  //       flex: 1,
  //       backgroundColor: Colors.primary,
  //     },

  //     inner: {
  //       flex: 1,
  //     },

  //     upper: {
  //       height: CustomDimensions.deviceHeight * 0.75,
  //       paddingHorizontal: "5%",
  //     },

  //     lower: {
  //       height: CustomDimensions.deviceHeight * 0.25,
  //       paddingHorizontal: "5%",
  //     },

  loginButton: {
    width: "100%",
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: Colors.white,
  },

  registerButton: {
    width: "100%",
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    height: CustomDimensions.deviceWidth * 0.2,
    width: CustomDimensions.deviceWidth * 0.6,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: CustomDimensions.deviceWidth * 0.1,
    marginBottom: 60,
  },

  //   inputContainer: {
  //     width: "100%",
  //     backgroundColor: Colors.white,
  //     padding: 15,
  //     borderRadius: 15,
  //     marginBottom: 25,
  //   },

  //     placeholder: {
  //       width: "100%",
  //       fontSize: 16,
  //     },

  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "flex-end",
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },
  input: {
    height: 45,
    paddingHorizontal: 10,
    marginBottom: 36,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: Colors.white,
  },
  loginContainer: {
    marginTop: 12,

    height: 45,
    paddingHorizontal: 10,
    // marginBottom: 36,
    borderRadius: 10,
    fontSize: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
  },

  signUpContainer: {
    paddingHorizontal: 10,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: Colors.primary,
  },

  congradulation: {
    fontSize: 16,
    color: Colors.white,
    marginBottom: 5,
  },
});
