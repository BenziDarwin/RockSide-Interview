import { StyleSheet, View, Text, TextInput, Button, TouchableNativeFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as yup from "yup";
import { Formik } from 'formik';
import { useState } from "react";
import FirebaseAuth from "../services/FirebaseAuth";
import { useNavigation } from '@react-navigation/native';

const loginSchema = yup.object({
    email: yup.string().email("Invalid email address!").required("Email is required!"),
    password: yup.string().required("Password is required!").min(4,"Password is too short!").max(16,"Password is too long!")
  })

export default function Login() {
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigation()

    return (
    <SafeAreaView style={[styles.container]}>
        <Text style={styles.title}>RockSide Interview</Text>
        <Text style={styles.subtitle}>Login</Text>
        <Formik
        initialValues={{email:"", password: "", passwordConfirm: ""}}
        validationSchema={loginSchema}
        onSubmit={async (values, actions) => {
          setIsLoading(true)
            try{
                result = await FirebaseAuth.signIn(values.email, values.password);
                console.log(result)
                if(result.code == 0) {
                  console.log("Signed In!")
                  navigate.navigate("Form")
                }
                else {
                  console.log(result.message)
                }
              }catch(e) {
                console.log(e)
              }  
              setIsLoading(false)
        }}
        >
            {(props) => 
            <View>
                <Text style={styles.heading}>Email:</Text>
                <TextInput onChangeText={props.handleChange("email")} value={props.values.email} style={styles.input} placeholder='Enter Email...'/>
                <Text style={styles.error}>{props.errors.email}</Text>
                <Text style={styles.heading}>Password:</Text>
                <TextInput  secureTextEntry={true} onChangeText={props.handleChange("password")} value={props.values.password} style={styles.input} placeholder='Enter Password...'/>
                <Text style={styles.error}>{props.errors.password}</Text>
                <View style={styles.button}>
                <Button onPress={props.handleSubmit} disabled={isLoading ? true : false} title={isLoading ? "Loading" : "Submit"} color="#1573FE"/>
                <TouchableNativeFeedback onPress={() => navigate.navigate("Register")}>
                <Text style={styles.nav}>Don't have an account? Click here to register.</Text>
                </TouchableNativeFeedback>
                </View>
            </View>
            }
        </Formik>
    </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignContent: "center"
    },

    title:{
        alignSelf:"center",
        color: "black",
        fontSize:30,
        marginTop: 20
    },

    subtitle: {
        alignSelf:"center",
        color: "black",
        fontSize:30,
        fontWeight:"bold",
        marginTop: 30
    },
    input: {
        height: 40,
        width: 250,
        padding: 10,
        backgroundColor: "white",
        borderRadius: 5,
        borderWidth:1,
        alignSelf: "center",
        marginLeft: -30,
      },
    error: {
      color: "red",
      alignSelf: "center",
      fontSize: 15,
      fontWeight: "bold",
      width: 200,
      marginLeft: -80,
    },
    heading: {
        alignSelf: "center",
        marginTop: 30,
        marginBottom: 10,
        fontSize: 20,
        fontWeight: "bold",
        width: 200,
        marginLeft: -80,
      },

      button: {
        padding: 10,
        marginTop: 20,
        marginHorizontal: 100,
        alignContent: "center",
        textAlign: "center" 
    },
    nav: {
        alignSelf: "center",
        textAlign: "center",
        marginTop: 10,
        marginBottom: 10,
        fontSize: 18,
        fontWeight: "bold",
        width: 300,
      },
})