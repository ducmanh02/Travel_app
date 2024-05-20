import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Dimensions,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons/faAngleLeft";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons/faLocationDot";
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

export default function ListPost({ navigation, route }) {
  const { historyData } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(historyData);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = historyData.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(historyData);
    }
  };

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
          <Text style={styles.logo}>Thông tin di tích</Text>
        </View>
        <View></View>
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.inner}>
          <View style={styles.search} pointerEvents="none">
            <Icon size={25} name="search" />
          </View>
          <TextInput
            style={styles.field}
            placeholder="Search"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <View style={styles.filter}>
            <Icon size={25} name="sort" onPress={() => {}} />
          </View>
        </View>
      </View>

      <FlatList
        data={filteredData}
        renderItem={({ item }) => (
          <Item item={item} navigation={navigation} />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
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
    position: 'relative',
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    borderWidth: 2,
    borderColor: "#ccc",
    overflow: 'hidden',
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
    flexDirection: 'row',
  },
  search: {
    position: 'absolute',
    top: 15,
    left: 10,
    zIndex: 1,
  },
  field: {
    backgroundColor: 'white',
    paddingLeft: 48,
    paddingRight: 18,
    paddingVertical: 18,
    borderRadius: 16,
    height: 54,
    flex: 1,
    shadowColor: 'black',
    shadowRadius: 4,
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  filter: {
    position: 'absolute',
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
});