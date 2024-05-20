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

import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const firebaseApp = require("../firebase.js");

const auth = firebaseApp.FIREBASE_AUTH;

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Email or Password is empty");
    } else {
      try {
        const response = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log(response.user.uid);
        console.log(response.user.email)
        saveUserId(response.user.uid,response.user.email );

        // Đăng nhập thành công, chuyển đến màn hình HomeScreen
        navigation.navigate("Home");
      } catch (error) {
        console.log(error);
        // Đăng nhập thất bại, hiển thị thông báo lỗi
        if (error.code === "auth/invalid-credential") {
          alert("Invalid password");
        } else if (error.code === "auth/invalid-email") {
          alert("Email not found");
        } else {
          alert("Login failed");
        }
      }
    }
  };
  // Lưu id vào AsyncStorage
  const saveUserId = async (id,email) => {
    try {
      await AsyncStorage.setItem("userId", id.toString());
      await AsyncStorage.setItem("userEmail", email.toString());
      console.log("Id người dùng đã được lưu thành công.");
    } catch (error) {
      console.log("Lỗi khi lưu id người dùng:", error);
    }
  };
  // Lấy id từ AsyncStorage
  const getUserId = async () => {
    try {
      const id = await AsyncStorage.getItem("userId");

      if (id !== null) {
        console.log("Id người dùng:", id);
        return id;
      } else {
        console.log("Không tìm thấy id người dùng.");
      }
    } catch (error) {
      console.log("Lỗi khi lấy id người dùng:", error);
    }
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
          <Text style={styles.title}>Login</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={COLORS.dark
                
              }
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
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Signup", navigation)}
          >
            <Text style={styles.naviBtn}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} onPress={handleLogin}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>Login</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

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
    color: COLORS.white,
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
  naviBtn: {
    paddingVertical: 20,
    justifyContent: "flex-end",
    color: COLORS.light,
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
