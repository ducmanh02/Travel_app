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
import Icon from "react-native-vector-icons/MaterialIcons";

const SLIDER_WIDTH = Dimensions.get("window").width;

const Item = ({ item, navigation }) => (
  <View style={styles.itemContainer}>
    <ImageBackground source={{ uri: item.imageUrls[0] }} resizeMode="cover" style={styles.image}>
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

  useEffect(() => {
    // Load favorite locations from storage or API
    const favorites = [
      {
        id: 1,
        name: "Disneyland",
        address: "1313 Disneyland Dr, Anaheim, CA 92802",
        imageUrls: ["https://example.com/disneyland.jpg"],
      },
      {
        id: 2,
        name: "Eiffel Tower",
        address: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France",
        imageUrls: ["https://example.com/eiffel-tower.jpg"],
      },
      // Add more favorite locations here
    ];
    setFavoritesData(favorites);
  }, []);

  return (
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
          <Text style={styles.logo}>Favorite Locations</Text>
        </View>
        <View></View>
      </View>

      <FlatList
        data={favoritesData}
        renderItem={({ item }) => (
          <Item item={item} navigation={navigation} />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Reuse styles from ListPost.js
  // ...
});