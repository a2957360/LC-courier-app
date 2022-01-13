import React, { useState } from "react";
import {
  Text,
  StyleSheet,
//   TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Modal from "react-native-modal"

import { TextInput } from "react-native-gesture-handler";
//packages
import i18n from "i18n-js";

//styles
import { Colors } from "../styles";

const EnterModal = ({modalVisible, confirmModal, cancelModal}) => {
  const [deliverCode, setDeliverCode] = useState();
  return (
    <Modal isVisible={modalVisible} >
      <View style={styles.contentContainer}>
        <TextInput
          keyboardType={"phone-pad"}
          placeholder={i18n.t("Enter Delivering Code")}
          style={styles.textInputEnter}
          onChangeText={(value) =>
            setDeliverCode(value)
          }
        />
        <View style={styles.twoButtonsContainer}>
          <TouchableOpacity onPress={cancelModal} style={styles.ButtonContainer}>
            <View style={styles.cancelButton}>
              <Text>{i18n.t("Cancel")}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>confirmModal(deliverCode)} style={styles.ButtonContainer}>
            <View style={styles.confirmButton}>
              <Text style={{ color: Colors.white, fontSize: 14 }}>{i18n.t("Confirm")}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
export default EnterModal;

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: Colors.white,
    padding: '5%',
    borderRadius: 10,
  },
  ButtonContainer:{
    borderRadius: 30,
    width: '45%',
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    textAlign: "center",
  },
  textInputEnter: {
    borderColor: Colors.midGrey,
    borderWidth: 1,
    paddingLeft: 15,
    borderRadius: 5,
    marginTop: 20,
    paddingVertical: 10,
  },
  twoButtonsContainer:{
    display: "flex",
    justifyContent: "space-around",
    marginTop: 30,
    flexDirection: "row",
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    borderRadius: 30,
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    textAlign: "center",
  },
  
  cancelButton: {
    backgroundColor: Colors.white,
    color: Colors.lightBlack,
    width: '100%',
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderColor: Colors.darkGrey,
    borderWidth: 1,
    paddingVertical: 15,
    textAlign: "center"
  }
});
