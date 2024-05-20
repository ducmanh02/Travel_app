import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import Icon from "react-native-vector-icons/MaterialIcons";
const firebaseApp = require("../firebase.js");
const auth = firebaseApp.FIREBASE_AUTH;

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
  
const UserScreen = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập
  const [email, setEmail] = useState(""); 
  useEffect(() => {
    checkLoginStatus(); // Kiểm tra trạng thái đăng nhập khi màn hình được tạo
  }, []);

  // Kiểm tra trạng thái đăng nhập
  const checkLoginStatus = async () => {
    const id = await getUserId();
    const email = await getUserEmail();
    setEmail(email);
    setIsLoggedIn(!!id); // Cập nhật trạng thái đăng nhập dựa trên sự tồn tại của id
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
  // lấy email
  const getUserEmail = async () => {
    try {
      const email = await AsyncStorage.getItem("userEmail");

      if (email !== null) {
        console.log("Email người dùng:", email);
        return email;
      } else {
        console.log("Không tìm thấy email người dùng.");
      }
    } catch (error) {
      console.log("Lỗi khi lấy email người dùng:", error);
    }
};

  // Đăng xuất
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userId");
      await AsyncStorage.removeItem("userEmail"); // Xóa id từ AsyncStorage
      setEmail("");
      setIsLoggedIn(false); // Cập nhật trạng thái đăng nhập thành false
      console.log("Đăng xuất thành công.");
    } catch (error) {
      console.log("Lỗi khi đăng xuất:", error);
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
        <Text style={styles.title}>User:{email} </Text>
        

        {isLoggedIn ? ( // Nếu đã đăng nhập, hiển thị nút Logout
          <TouchableOpacity activeOpacity={0.8} onPress={logout}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>Logout</Text>
            </View>
          </TouchableOpacity>
        ) : ( // Nếu chưa đăng nhập, hiển thị nút Đăng ký và Đăng nhập
          <>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate("Signup")}
            >
              <View style={styles.btn}>
                <Text style={styles.btnText}>Sign Up</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate("Login")}
            >
              <View style={styles.btn}>
                <Text style={styles.btnText}>Login</Text>
              </View>
            </TouchableOpacity>
          </>
        )}
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
  },
});

export default UserScreen;
