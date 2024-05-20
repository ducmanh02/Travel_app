import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
const COLORS = {
  white: "#FFF",
  dark: "#000",
  primary: "#04555c",
  secondary: "#e1e8e9",
  light: "#f9f9f9",
  grey: "#dddedd",
  red: "red",
  orange: "#f5a623",
};

import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Icon from "react-native-vector-icons/MaterialIcons";
const firebaseApp = require("../firebase.js");

const auth = firebaseApp.FIREBASE_AUTH;

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (!email || !password) {
      alert("Email or Password is empty");
    }
    if (password !== confirmPassword) {
      alert("Password and Confirm Password is different");
    } else {
      try {
        console.log(email+"/"+ password);
        const response = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        
        alert("Sign Up Successfully");
        // Đăng nhập thành công, chuyển đến màn hình LoginScreen
        navigation.navigate("Login");
      } catch (error) {
        console.log(error);
        // Đăng nhập thất bại, hiển thị thông báo lỗi
        if (error.code === "auth/invalid-credential") {
          alert("Invalid password");
        } else if (error.code === "auth/invalid-email") {
          alert("Email not found");
        } else {
          alert("Signup failed");
        }
      }
    }

    // Thực hiện xử lý đăng ký ở đây
  };
  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="rgba(0,0,0,0)" />
      <ImageBackground
        style={{ flex: 1 }}
        source={require("../assets/images/carousel/pic1.jpg")}
      >
        <View style={styles.header}>
          <Icon
            name="arrow-back-ios"
            size={28}
            color={COLORS.black}
            onPress={navigation.goBack}
          />
         
        </View>
        <View style={styles.container}>
          <Text style={styles.title}>Sign Up</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={COLORS.dark}
              value={email}
              onChangeText={(text) => {
                setEmail(text.trim());
                
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={COLORS.dark}
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => {
                setPassword(text.trim());
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor={COLORS.dark}
              secureTextEntry={true}
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text.trim())}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Login", navigation)}
          >
            <Text style={styles.naviBtn}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} onPress={handleRegister}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>Sign Up</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  header: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",

    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: COLORS.white,
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  btn: {
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    fontWeight: "bold",
  },
  errorText: {
    color: COLORS.red,
    marginBottom: 10,
  },
  naviBtn:{
    paddingVertical:20,
    justifyContent:"flex-end",    
    color: COLORS.light,
    textDecorationLine: "underline",
  }
});
