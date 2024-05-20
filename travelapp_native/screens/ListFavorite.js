import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  ImageBackground,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleLeft, faLocationDot } from "@fortawesome/free-solid-svg-icons";

import { getDatabase, ref, get, child } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
const firebaseApp = require("../firebase");

const database = getDatabase(firebaseApp.FIREBASE_APP);

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
const SLIDER_WIDTH = Dimensions.get("window").width;

const Item = ({ item, navigation }) => (
  <View style={styles.itemContainer}>
    <ImageBackground
      source={{ uri: item.imageUrls[0] }}
      resizeMode="cover"
      style={styles.image}
    >
      <TouchableOpacity
        style={styles.homeBtn}
        onPress={() => navigation.navigate("Detail", item)}
      >
        <View style={styles.buttonContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.location}>
              <FontAwesomeIcon icon={faLocationDot} color="white" />
              {item.address}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </ImageBackground>
  </View>
);

export default function ListFavorite({ navigation }) {
  const [favoritesData, setFavoritesData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const userId = await AsyncStorage.getItem("userId");
      console.log(userId);
      if (userId != null) {
        setIsLoggedIn(true);
        const databaseRef = ref(
          database,
          "users/" + userId + "/favoritePlaces"
        );
        const historyRef = ref(database, "history");

        try {
          const snapshot = await get(databaseRef);
          const places = snapshot.val();

          if (places) {
            const placeIds = Object.keys(places);
            const favoritePlacesData = await Promise.all(
              placeIds.map(async (placeId) => {
                const snapshot = await get(child(historyRef, placeId));

                if (snapshot.exists()) {
                  const place = snapshot.val();

                  if (place) {
                    const { name, description, address, imageUrls } = place;
                    return place;
                  } else {
                    console.log("Place not found");
                    return null;
                  }
                } else {
                  console.log("No data available");
                  return null;
                }
              })
            );

            setFavoritesData(
              favoritePlacesData.filter((place) => place !== null)
            );
            console.log(favoritesData);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchData();
  }, []);
  console.log(isLoggedIn);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.goBack()}
            >
              <FontAwesomeIcon icon={faAngleLeft} size={25} />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.logo}>Địa điểm đã yêu thích</Text>
          </View>
          <View></View>
        </View>
        {isLoggedIn ? (
          <FlatList
            data={favoritesData}
            renderItem={({ item }) => (
              <Item item={item} navigation={navigation} />
            )}
            keyExtractor={(item) => item.id}
          />
        ) : (
          // Nếu chưa đăng nhập, hiển thị nút Đăng ký và Đăng nhập

          <>
            <View>
              <Text>Bạn Chưa Đăng Nhập, Vui Lòng Đăng Nhập Trước.</Text>
            </View>
            <View style={[styles.btnContainer]}>
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
            </View>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  header: {
    paddingHorizontal: 10,
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: 20,
    fontWeight: "600",
  },
  itemContainer: {
    height: 200,
    marginTop: 20,
    shadowRadius: 4,
    borderRadius: 16,
    backgroundColor: "red",
    position: "relative",
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    borderWidth: 2,
    borderColor: "#ccc",
    overflow: "hidden",
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  searchContainer: {
    paddingHorizontal: 0,
    paddingTop: 24,
    paddingBottom: 16,
  },
  inner: {
    flexDirection: "row",
  },
  search: {
    position: "absolute",
    top: 15,
    left: 10,
    zIndex: 1,
  },
  field: {
    backgroundColor: "white",
    paddingLeft: 48,
    paddingRight: 18,
    paddingVertical: 18,
    borderRadius: 16,
    height: 54,
    flex: 1,
    shadowColor: "black",
    shadowRadius: 4,
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  filter: {
    position: "absolute",
    top: 15,
    right: 10,
    zIndex: 1,
  },
  title: {
    color: "#FFDE59",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    height: 60,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    alignItems: "center",
    padding: 10,
  },
  titleContainer: {
    color: "yellow",
  },
  location: {
    color: "white",
    fontWeight: "bold",
  },
  timeContainer: {},
  date: {
    color: "white",
  },
  btn: {
    height: 50,
    backgroundColor: COLORS.primary,
    color: COLORS.light,
    paddingVertical: 12,
    paddingHorizontal: 20,
    margin: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    fontWeight: "bold",
    color: COLORS.light,
  },
  btnContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
  },
});
