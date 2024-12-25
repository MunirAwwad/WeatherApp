import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
  FlatList,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useState } from 'react';
import { capitalizeTitle, chooseImage, getCurrentTime, getDate } from "./Auxilliary_Functions";
import ChoicesModal from "./ChoicesModal";
import Attribution from './Attribution';
import SearchBar from './SearchBar';

export default function App() {
  let [search, setSearch] = useState("");
  let [cities, setCities] = useState({needed:false, data:[]});
  let [response, setResponse] = useState({ready:false, data:{}, futureData:{}});
  let [isLoading, setIsLoading] = useState(false)

  function handleAPIRequest1(cityName){
    if (cityName == "") {
      Alert.alert("No city name entered","Please enter a city name")
      return
    }

    let URL = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=XXXX_API_KEY_HERE"
    console.log("Making API call")
    fetch(URL)
      .then((res)=>res.json())
      .then((data) => {
        console.log(data)
        if (data.length == 1) {
          handleAPIRequest2(data[0])
        } else if (data.length > 1) {
          setCities({needed:true, data:data})
        } else {
          Alert.alert("Invalid city name", "Please try again") //ADD OPTION FOR LONGITUDE AND LATITUDE MAYBE
        }
      })
      .catch((error) => Alert.alert("Something went wrong", "Please try again later, error: " + error))
  }

  function handleAPIRequest2 (cityData) {
    if (cities.needed) {setCities({needed:false, data:[]})}
    if (response.ready) {setResponse({ready:false, data:{}, futureData:{}})}
    setIsLoading(true)
    //console.log(cityData.lat + ", " + cityData.lon)
    let URL1 = "https://api.openweathermap.org/data/2.5/weather?lat="+cityData.lat+"&lon="+cityData.lon+"&appid=XXXX_API_KEY_HERE"
    let URL2 = "https://api.openweathermap.org/data/2.5/forecast?lat="+cityData.lat+"&lon="+cityData.lon+"&appid=XXXX_API_KEY_HERE"
    console.log("Making API call")
    fetch(URL1)
      .then((res1)=>res1.json())
      .then((data1)=>{
        console.log("Making API call")
        fetch(URL2)
          .then((res2) => res2.json())
          .then((data2) => {
            console.log(data1)
            // console.log(data2)
            // console.log(cityData)
            setResponse({ready:true, data:data1, futureData:data2, geoData:cityData})
            setIsLoading(false)
          })
          .catch((error) => {
            Alert.alert("Something went wrong", "Please try again later, error: " + error)
            setIsLoading(false)
          })
      })
      .catch((error) => {
        Alert.alert("Something went wrong", "Please try again later, error: " + error)
        setIsLoading(false)
      })
  }

  /*SafeAreaView for IOS only, we handle the padding manually in Android in the styles section*/
  /*Background Colour of status bar for Android only, always transparent in IOS*/
  return (
    <SafeAreaView style={styles.container}>
      <ChoicesModal cities_needed={cities.needed} setCities={setCities} cities_data={cities.data} handleAPIRequest2={handleAPIRequest2}/>
      <StatusBar backgroundColor="lightblue" barStyle="dark-content"/>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContentContainer} showsVerticalScrollIndicator={false}>
        <SearchBar search={search} setSearch={setSearch} handleAPIRequest1={handleAPIRequest1}/>
        <View style={(response.ready || isLoading) ? {display: "none"} : styles.introContainer}>
          <Text style={styles.introText}>Please search for a city to display weather information</Text>
        </View>
        <View style={isLoading ? styles.loadingContainer : {display: "none"}}>
          <ActivityIndicator color="blue" size={75} animating={true}></ActivityIndicator>
        </View>
        <View style={[styles.forecastContainer, {display: response.ready ? "flex" : "none"}]}>
          <Text style={styles.locationText}>{
            response.ready ? "Showing result for " + response.geoData["name"] + ", " + response.geoData["country"] + " at " + getCurrentTime(new Date((response.data.dt + response.data.timezone)*1000)) + " on " + getDate(new Date((response.data.dt + response.data.timezone)*1000), true) + " locally" : ""
          }</Text>
          <View style={styles.weatherContainer}>
            <Image style={styles.weatherIcon} source={
                response.ready ? chooseImage(response.data.weather[0].icon, [response.data.dt, response.data.sys["sunrise"], response.data.sys["sunset"]]) : ""
            }/>
            <View style={styles.tempContainer}>
              <Text style={styles.temperatureTextMain}>{
                response.ready ? Math.round(response.data.main.temp - 273.15) + "°C":""
              }</Text>
              <Text style={styles.temperatureTextSub}>{
                response.ready ? "Feels like " + Math.round(response.data.main.feels_like - 273.15) + "°C":""
              }</Text>
            </View>
          </View>
          <Text style={styles.detailedConditionText}>
            {response.ready ? capitalizeTitle(response.data.weather[0].description): ""}
          </Text>
          <View style={styles.infoContainer}>
            <View>
              <Text style={styles.infoText}>{response.ready ? "Max: " + Math.round(response.data.main.temp_max-273.15) + "°C" : ""}</Text>
              <Text style={styles.infoText}>{response.ready ? "Min: " + Math.round(response.data.main.temp_min-273.15) + "°C" : ""}</Text>
              <Text style={styles.infoText}>{response.ready ? "Hum: " + Math.round(response.data.main.humidity) + "%" : ""}</Text>
            </View>
            <View>
              <Text style={styles.infoText}>{response.ready ? "Wind: " + response.data.wind.speed + " m/s" : ""}</Text>
              <Text style={styles.infoText}>{response.ready ? "Pres: " + response.data.main.pressure + " hPa" : ""}</Text>
            </View>
          </View>
          <View style={styles.futureListContainer}>
            <FlatList style={styles.futureList}
              horizontal={true}
              data={response.ready ? response.futureData.list : []}
              renderItem={function ({item}) {
                return (
                  <View style={{justifyContent: "center", alignItems:"center"}}>
                    <Text style={{fontSize:16, marginBottom:"5%", fontWeight:"bold"}}>{
                      getDate(new Date((item.dt + response.data.timezone)*1000),false)
                    }</Text>
                    <Text style={{fontSize:16, marginBottom:"5%", fontWeight:"bold"}}>{
                      getCurrentTime(new Date((item.dt + response.data.timezone)*1000))
                    }</Text>
                    <Text style={{fontSize:16, marginBottom:"5%"}}>{Math.round(item.main.temp-273.15) + "°C"}</Text>
                    <Image style={{width:30,height:30,marginBottom:"5%"}} source={
                      chooseImage(item.weather[0].icon, [item.dt, response.data.sys["sunrise"], response.data.sys["sunset"]])
                    }/>
                  </View>
                )
              }}
              ItemSeparatorComponent={<View style={{width:25}}></View>}
              showsHorizontalScrollIndicator = {false}
            />
          </View>
        </View>
       <Attribution/>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightblue",
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingHorizontal:"10%",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, /*PaddingTop for Android only, SafeAreaView Handles that in IOS*/
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    minHeight: "100%"
  },
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
  },
  introContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  introText: {
    fontSize: 25,
    color: "rgba(100,100,100,0.5)",
    textAlign: "center",
    marginTop: -1*StatusBar.currentHeight
  },
  forecastContainer : {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop:"10%"
  },
  locationText: {
    fontSize: 20,
    textAlign: "center"
  },
  weatherContainer:{
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 25,
    marginVertical:"7.5%",
    flexWrap: "wrap"
  },
  weatherIcon: {
    height: 120,
    width: 120,
    resizeMode: "contain",
  },
  tempContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 150
  },
  temperatureTextMain:{
    fontSize: 40,
    textAlign: "center"
  },
  temperatureTextSub:{
    fontSize: 20,
    textAlign: "center",
    flexWrap: "wrap",
    marginBottom: "5%"
  },
  detailedConditionText:{
    fontSize: 20,
    textAlign: "center",
    flexWrap: "wrap",
    marginBottom: "5%"
  },
  infoContainer:{
    width: "100%",
    paddingVertical: "5%",
    marginBottom: "5%",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexWrap: "wrap",
  },
  infoText: {
    fontSize: 18,
    textAlign:"left",
  },
  futureListContainer: {
    width: "100%",
    paddingVertical: "5%",
    paddingHorizontal: "7.5%",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 25
  },
  futureList: {

  },
});
