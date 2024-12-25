import {
    StyleSheet,
    View,
    Image,
    TextInput,
    Pressable
  } from 'react-native';

export default function SearchBar ({search, setSearch, handleAPIRequest1}) {
    return (
        <View style={styles.searchContainer}>
          <TextInput style={styles.searchBar} placeholder='Search city name (e.g Toronto)' onChangeText={setSearch} value={search} onSubmitEditing={function () {handleAPIRequest1(search)}}/>
          <Pressable onPress={function () {handleAPIRequest1(search)}}>
            <View style={styles.searchButton}>
              <Image source={require("./assets/MiscAssets/search.png")} style={styles.searchImage}></Image>
            </View>
          </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    searchContainer: {
      backgroundColor: "whitesmoke",
      paddingVertical: "1%",
      borderRadius: 25,
      paddingLeft: 15,
      paddingRight: 7.5,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    },
    searchBar :{
      height: "100%",
      flex: 1,
      fontSize: 16
    },
    searchButton: {
      backgroundColor: "#62c3f7",
      height: 40,
      width: 40,
      borderRadius: 25,
      justifyContent: "center",
      alignItems: "center"
    },
    searchImage: {
      height: 25,
      width: 25
    }
  });
  