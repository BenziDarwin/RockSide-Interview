import { View, StyleSheet, Text, Button, TextInput, Image,  } from "react-native";
import {Picker} from '@react-native-picker/picker';
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import { ScrollView } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import MapView, {Marker} from 'react-native-maps';
import * as SQLite from "expo-sqlite";
import { auth } from "../services/FirebaseConfig";

const db = SQLite.openDatabase("user.db");

export default function Form() {
    const [consent, setConsent] = useState(false)
    const [date, setDate] = useState(new Date(1598051730000));
    const [image, setImage] = useState(null);
    const [location, setLocation] = useState({});
    const [markers, setMarkers] = useState([]);
    const [area, setArea] = useState(null);
    const [shape, setShape] = useState(0);
    const [name, setName] = useState("");
    const [comment, setComment] = useState("");

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setDate(currentDate);
      };

    const showMode = () => {
        DateTimePickerAndroid.open({
          value: date,
          onChange,
          mode: "date",
          is24Hour: true,
        });
      };

      const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.canceled) {
          setImage(result.assets[0].uri);
        }
      };

      const areaHandler = () => {
        if(markers.length > 2) {
            if (markers.length == 3) {
              a = getLength(markers[0].position, markers[1].position)
              b = getLength(markers[0].position, markers[2].position)
              c = getLength(markers[1].position, markers[2].position)
              s = (a+b+c)/2
            let calculatedArea = Math.sqrt(s*(s-a)*(s-b)*(s-c)).toFixed(4)
            setArea(calculatedArea)
            return;
            }

            else if(markers.length == 4) {
              a = getLength(markers[0].position, markers[1].position)
              b = getLength(markers[1].position, markers[2].position)
              c = getLength(markers[2].position, markers[3].position)
              d = getLength(markers[0].position, markers[3].position)
              e = getLength(markers[0].position, markers[2].position)
              s1 = (a+b+e)/2
              s2 = (d+c+e)/2
              let calculatedArea = (Math.sqrt(s1*(s1-a)*(s1-b)*(s1-e)) + Math.sqrt(s2*(s2-d)*(s2-c)*(s2-e))).toFixed(4)
              setArea(calculatedArea)
              return;
            }
        }
        setArea(null)
        return;
      }

      const getLength = (pos1, pos2) => {
        return Math.sqrt((pos1.x -pos2.x)**2 + (pos1.y - pos2.y)**2);
      }
      const markerHandler = (e) => {
        let marker = {
            coordinate: e.nativeEvent.coordinate,
            position: e.nativeEvent.position,
            color:'red',
        }
        setMarkers((markers) => [marker, ...markers])
      }

      const shapeHandler = () => {
        if (markers.length <= 2) {
            setShape("Not a valid Shape")
        } else if(markers.length == 3) {
            setShape("Triangle")
        } else if(markers.length == 4) {
            setShape("Quadrilateral")
        } else if(markers.length == 5) {
            setShape("Pentagon")
        } else if(marker.length == 6) {
            setShape("Hexagon")
        }
      }

      const submitHandler =  async () => {
        query = `insert into user (${auth.currentUser.email}, ${consent}, ${date}, ${name}, ${JSON.stringify(location)}, ${shape}, ${area}, ${comment})`
        await new Promise(() => {
        try {
          db.transaction(tx => {
            tx.executeSql(query)})
        } catch (error) {
          console.log(error)
        }
      })
    }

      useEffect(() => {
        async function initDatabase() {
          await new Promise(() => {
            try {
              db.transaction(tx => {
                tx.executeSql(
                  'create table if not exists user (email TEXT NOT NULL, consent BOOLEAN NOT NULL, date INT NOT NULL, name TEXT NOT NULL, coordinates TEXT NOT NULL, shape TEXT NOT NULL, area FLOAT NOT NULL, comment TEXT NOT NULL);'
                )
              })
            } catch (error) {
              console.log("db error creating tables"); console.log(error);
            }});
            results = await db.executeSql(`SELECT * FROM user`);
            console.log(results)
          }
        initDatabase()
        shapeHandler()
        areaHandler()
  },[markers])

    return(
        <SafeAreaView style={styles.container}>
            <ScrollView>
            <Text style={[styles.heading,{marginTop:20}]}>Do you consent to our program?</Text>
            <Picker
                selectedValue={consent}
                onValueChange={(itemValue, itemIndex) =>
                setConsent(itemValue)
            }>
            <Picker.Item label="Yes" value={true} />
            <Picker.Item label="No" value={false} />
        </Picker>
        {consent?
        <View>
            <Text style={styles.heading}>Date:</Text>
            <Text style={styles.heading}>{date.toDateString()}</Text>
            <View style={styles.button}>
            <Button onPress={showMode}  title={"Select Date"} color="#1573FE"/>
            </View>
            <Text style={styles.heading}>Name:</Text>
            <TextInput style={styles.input} onChangeText={(val) => setName(val)}  placeholder='Enter Name'/>
            <Text style={styles.heading}>Picture:</Text>
            <View style={styles.button}>
                <Image style={{alignSelf:"center", width:200, height:200, marginBottom:10}} source={image?{uri:image}:require("../../assets/placeholder.jpg")}/>
            <Button onPress={pickImage}  title={"Upload Picture"} color="#1573FE"/>
            </View>
            <Text style={styles.heading}>Location:</Text>
            <Text style={styles.heading}>Latitude: {location.latitude}{"\n\n"} Longitude: {location.latitude}</Text>
            <MapView
                style={{ alignSelf:"center", width:300, height:400}}
                initialRegion={{
                latitude: 0.13827841987386708,
                longitude: 32.579226326197386,
                latitudeDelta: 2.1580338756493753,
                longitudeDelta: 1.80445846170187,
            }}
            onPress={(event) => setLocation(event.nativeEvent.coordinate)}
            onLongPress={(event) => markerHandler(event)}
            >
                {markers.map((marker, index) => {
                    return(
                        <Marker
                        key={index}
                        coordinate={marker.coordinate}
                        pinColor={marker.color}
                      />
                    )
            })}
            </MapView>
            <Text style={styles.heading}>Area-mapping:</Text>
            <Text style={{alignSelf:"center"}}>Long press map to put marker.</Text>
            <Text style={styles.heading}>Area: {area} Km {"\n\n"} Shape: {shape}</Text>
            <Text style={styles.heading}>Comments:</Text>
            <TextInput
        editable
        multiline
        numberOfLines={4}
        maxLength={40}
        onChangeText={text => setComment(text)}
        style={{padding: 10, marginBottom:10, height: 40, width: 250,  alignSelf:"center", borderWidth:1}}
      />
       <View style={styles.button}>
            <Button onPress={() => submitHandler()}  title={"Submit"} color="#1573FE"/>
            </View>
        </View>
        :   <View>
               <Text style={styles.heading}>Area-mapping:</Text>
               <MapView
                style={{ alignSelf:"center", width:300, height:400}}
                initialRegion={{
                latitude: 0.13827841987386708,
                longitude: 32.579226326197386,
                latitudeDelta: 2.1580338756493753,
                longitudeDelta: 1.80445846170187,
            }}
            onLongPress={(event) => markerHandler(event)}
            >
              {markers.map((marker, index)=> {
                return (
                  <Marker coordinate={marker.coordinate} key={index} pinColor={marker.color}/>
                )
              })}
        </MapView>
        <Text style={styles.heading}>Area: {area} Km {"\n\n"} Shape: {shape}</Text>
                <Text style={styles.heading}>Comments:</Text>
                <TextInput
        editable
        multiline
        numberOfLines={4}
        maxLength={40}
        onChangeText={text => setComment(text)}
        style={{padding: 10, height: 40, marginBottom:10, width: 250,  alignSelf:"center", borderWidth:1}}
      />
       <View style={styles.button}>
            <Button onPress={() => submitHandler()}  title={"Submit"} color="#1573FE"/>
            </View>
            </View>
            }
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignContent:"center"
    },
    heading: {
        fontSize: 20,
        alignSelf:"center",
         marginBottom:20,
         marginTop:20
    },
    button: {
        padding: 10,
        marginHorizontal: 100,
        alignContent: "center",
        textAlign: "center" 
    },
    input: {
        height: 40,
        width: 250,
        padding: 10,
        backgroundColor: "white",
        borderRadius: 5,
        borderWidth:1,
        alignSelf: "center",
      },
})