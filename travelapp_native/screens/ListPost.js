import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  ImageBackground,
  FlatList,
  TextInput,
} from "react-native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons/faLeftLong";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons/faLocationDot";
const SLIDER_WIDTH = Dimensions.get("window").width;
const data = [
  {
    id: 1,
    title: "Hồ Gươm",
    date: "Mong 2 thang gieng",
    location: "Quận Hoàn Kiếm",
    src: require("../assets/images/carousel/pic1.jpg"),
  },
  {
    id: 2,
    title: "Văn Miếu Quốc Tử Giám",
    src: require("../assets/images/carousel/pic2.jpg"),
    date: "Mong 2 thang gieng",
    location: "Quận Đống Đa",
  },
  {
    id: 3,
    title: "Lăng Bác",
    src: require("../assets/images/carousel/pic3.jpg"),
    date: "Mong 6 thang gieng",
    location: "Quận Ba Đình",
  },
  {
    id: 4,
    title: "Chùa Trấn Quốc",
    src: require("../assets/images/carousel/pic4.jpg"),
    date: "Mong 9 thang gieng",
    location: "Quận Tây Hồ",
  },
  // Add more items as needed
];

const Item = ({ item, navigation }) => (
  <View style={styles.itemContainer}>
    <ImageBackground source={item.src} resizeMode="cover" style={styles.image}>
      <TouchableOpacity
        style={styles.homeBtn}
        onPress={() => navigation.navigate("Detail")}
      >
        <View style={styles.buttonContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.location}>
              <FontAwesomeIcon icon={faLocationDot} color="white" />
              {item.location}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </ImageBackground>
  </View>
);
export default function PTTT1({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <FontAwesomeIcon icon={faLeftLong} size={25} />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.logo}>Danh Sách</Text>
        </View>
        <View></View>
      </View>
      <View style={styles.search}>
      <FontAwesomeIcon icon={faMagnifyingGlass}  size={26} />
        <TextInput placeholder="Search place" style={{ color: 'grey' }} />
      </View>

      <ScrollView style={styles.scrollView}>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <Item item={item} navigation={navigation} />
          )}
          keyExtractor={(item) => item.id}
        />
      </ScrollView>
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
  search: {
    display: 'flex',
    flexDirection: "row",
    // margin: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 7,
    height: 80,
    alignItems: 'center',
    gap: 10,
  },
  input: {
    // height: 60,
    // width: '100%',
    // backgroundColor: 'white',
    // borderRadius: 10,
    // position: 'absolute',
    // top: 90,
    // flexDirection: 'row',
    // paddingHorizontal: 20,
    // alignItems: 'center',
    // elevation: 40,
  },
 
  scrollView: {
    marginHorizontal: 0,
  },
  text: {
    fontSize: 42,
  },
  itemContainer: {
    height: 200,
    marginTop: 20,
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
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
