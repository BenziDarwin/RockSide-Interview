import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import Login from './src/authentication/Login';
import Form from './src/screens/Form';
import { auth } from './src/services/FirebaseConfig';

export default function App() {
  const [user, setUser] = useState("dfbdfb");
  useEffect(() => {
      auth.onAuthStateChanged(e => {
        setUser(e)
      })
  },[user])
  
  if(user == null) {
    return (
      <View style={styles.container}> 
        <Login/> 
      </View>
    );
  } else if (user != null) {
    return (
        <Form/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dddd ',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
