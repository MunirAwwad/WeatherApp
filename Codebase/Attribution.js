import {
    StyleSheet,
    View,
    Text,
    Image,
    Pressable,
    Linking
} from 'react-native';

export default function Attribution(){
    return (
        <View style={styles.attribution}>
        <View style={styles.attributionText}>
          <Text>Weather data provided by OpenWeather</Text>
          <Pressable onPress={function () {Linking.openURL("https://openweathermap.org/")}}>
            <Text style={{textDecorationLine:"underline", color:"blue"}}>https://openweathermap.org/</Text>
          </Pressable>
        </View>
        <Image source={require("./assets/MiscAssets/OpenWeatherLogo.png")} style={styles.attributionImage}></Image>
      </View>
    )
}

const styles = StyleSheet.create({
    attribution: {
      flexDirection:"row",
      alignContent: "flex-end",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      marginVertical: "5%",
      flexWrap: "wrap"
    },
    attributionText: {
      flex:1,
      justifyContent: "center"
    },
    attributionImage: {
      height: 90,
      width: 110,
      resizeMode: "contain"
    }
  });
  