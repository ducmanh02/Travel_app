import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Button,
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import Geocoding from "react-native-geocoding";
import { Linking } from "react-native";
import Geolocation from "react-native-geolocation-service";

import { getDatabase, ref, onValue, get,set } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
const firebaseApp = require("../firebase");

const database = getDatabase(firebaseApp.FIREBASE_APP);

// Thiết lập khóa API của bạn
Geocoding.init("AIzaSyB9jG7ROCL115gTV3Z1boznnkxN4lTM-wc");

import Icon from "react-native-vector-icons/MaterialIcons";

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

const DetailsScreen = ({ navigation, route }) => {
  const place = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [liked, setLiked] = useState(false);
  const [favoritePlaces, setFavoritePlaces] = useState({});



  const searchLocation = async () => {
    try {
      const response = await Geocoding.from(place.address);
      console.log("place");
      console.log("search address: " + response.plus_code);
      const { results } = response;
      if (results.length > 0) {
        const { geometry } = results[0];
        const { location } = geometry;
        setLocation(location);
        console.log(location);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm địa điểm:", error);
    }
  };


  const openGoogleMapsDirections = () => {
    const endLocation = `${location.lat},${location.lng}`;

    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${endLocation}`;

    Linking.openURL(googleMapsUrl).catch((error) => {
      console.error("Lỗi khi mở Google Maps:", error);
    });
  };


  const handleLike = async () => {
    addToFavorites();
    setLiked(!liked);
  };

  const addToFavorites = async () => {
    const userId = await AsyncStorage.getItem("userId");
    if(userId == null){
      setLiked(false);
      navigation.navigate("Login");
    }
    const databaseRef = ref(database, "users/" + userId + "/favoritePlaces/" + place.id);
    try {
      if (liked) {
        // Xóa địa điểm yêu thích
        await set(databaseRef, null);
        
      } else {
        // Thêm địa điểm yêu thích
        await set(databaseRef, true);
        
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật danh sách yêu thích:", error);
    }
  };

  const getFavorite = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (userId !== null) {
        console.log("Id người dùng:", userId);
        const FavoritePlacesRef = ref(database, `users/${userId}/favoritePlaces`);
        const snapshot = await get(FavoritePlacesRef);
        const data = snapshot.val();
        setFavoritePlaces(data || {});
        return data;
      } else {
        console.log("Không tìm thấy id người dùng.");
        return null;
      }
    } catch (error) {
      console.log("Lỗi khi lấy id người dùng:", error);
      return null;
    }
  };
  
  const checkLiked = async () => {
    const data = await getFavorite();
    if (data !== null) {
      const isFavorite = place.id in data;
      setLiked(isFavorite);
    } else {
      setLiked(false);
    }
  };
  useEffect(() => {
    
    checkLiked();
  }, []);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
        onShow={searchLocation}
      >
        <View style={style.centeredView}>
          <View style={style.modalView}>
            <MapView
              style={style.map}
              provider={PROVIDER_GOOGLE}
              region={{
                latitude: location?.lat || 0,
                longitude: location?.lng || 0,
                latitudeDelta: 0.022,
                longitudeDelta: 0.021,
              }}
            >
              {location && (
                <Marker
                  coordinate={{
                    latitude: location.lat,
                    longitude: location.lng,
                  }}
                />
              )}
            </MapView>

            <View style={[style.btnContainer]}>
              <View>
                <Pressable
                  style={[style.button, style.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={style.textStyle}>Đóng</Text>
                </Pressable>
              </View>
              <View>
                <Pressable
                  style={[style.button, style.buttonClose]}
                  onPress={openGoogleMapsDirections}
                >
                  <Text style={style.textStyle}>Dẫn đường</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      
      <ImageBackground style={{ flex: 0.7 }} src={place.imageUrls[0]}>
        <View style={style.header}>
          <Icon
            name="arrow-back-ios"
            size={28}
            color={COLORS.white}
            onPress={navigation.goBack}
          />
          
        </View>
        <View style={style.imageDetails}>
          <Text
            style={{
              width: "70%",
              fontSize: 30,
              fontWeight: "bold",
              color: COLORS.white,
              marginBottom: 20,
            }}
          >
            {place.name}
          </Text>
        </View>
      </ImageBackground>
      <View style={style.detailsContainer}>
        <View style={style.iconContainer}>
          <Pressable onPress={handleLike}>
            <Icon
              name="favorite"
              style={{ color: liked ? COLORS.red : COLORS.grey }}
              size={30}
            />
          </Pressable>
        </View>
        <ScrollView style={{ Height: 600 }}>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Icon name="place" size={28} color={COLORS.primary} />
            <Text
              style={{
                marginLeft: 5,
                fontSize: 20,
                fontWeight: "bold",
                color: COLORS.primary,
              }}
            >
              {place.address}
            </Text>
          </View>
          <Text style={{ marginTop: 20, fontWeight: "bold", fontSize: 20 }}>
            About the trip
          </Text>

          <Text style={{ marginTop: 20, lineHeight: 22 }}>
            {place.description}
          </Text>
        </ScrollView>
      </View>
      <View style={style.footer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: COLORS.white,
            }}
          >
            Đi ngay
          </Text>
        </View>
        <View style={style.bookNowBtn}>
          <Pressable style={style.bookNowBtn} onPress={()=>setModalVisible(true)}>
            <Text
              style={{
                color: COLORS.primary,
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Đường Đi
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  bookNowBtn: {
    height: 50,
    width: 150,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  iconContainer: {
    height: 60,
    width: 60,
    position: "absolute",
    top: -30,
    backgroundColor: COLORS.white,
    borderRadius: 30,
    right: 20,
    elevation: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  detailsContainer: {
    top: -60,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
    paddingBottom: 0,
    marginBottom: 0,
    paddingHorizontal: 25,
    backgroundColor: COLORS.white,
    flex: 0.4,
  },
  header: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  imageDetails: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    position: "absolute",
    bottom: 30,
  },
  footer: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    height: 70,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  map: {
    width: 300,
    height: 300,
  },
  btnContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    width: 200,
    marginTop: 10,
  },
});

export default DetailsScreen;
