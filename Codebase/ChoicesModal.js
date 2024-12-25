import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  Modal
} from 'react-native';
import { useEffect } from 'react';

export default function ChoicesModal({cities_needed, setCities, cities_data, handleAPIRequest2}) {
  return (
    <Modal animationType="slide" presentationStyle="fullScreen" visible={cities_needed} onRequestClose={function () {setCities({needed:false, data:[]})}}>
      <View style={styles.choiceModalView}>
        <Text style={styles.choicesText}>Multiple results found, please pick:</Text>
        <View style={styles.choiceListContainer}>
          <FlatList
            data = {cities_data}
            renderItem={function ({item}) {
              return (
                <Pressable onPress={function () {handleAPIRequest2(item)}}>
                    <View style={{padding:"5%", backgroundColor:"rgba(0,0,255,0.1)", borderRadius:25}}>
                      <Text style={{fontSize:18, textAlign:"center"}}>{item.name + ", " + ("state" in item ? item["state"]+", " : " ") +  item.country}</Text>
                    </View>
                </Pressable>
              )
            }}
            ItemSeparatorComponent={<View style={{height:5}}></View>}
            showsVerticalScrollIndicator = {true}
          />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  choiceModalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    paddingHorizontal:"7.5%",
    backgroundColor: "lightblue"
  },
  choicesText: {
    fontSize: 30,
    textAlign: "center",
    marginBottom:"10%"
  },
  choiceListContainer: {
    height: "30%",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 25,
    padding: "1%"
  }
});
