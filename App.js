import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/authentication/Login';
import Form from './src/screens/Form';
import { auth } from './src/services/FirebaseConfig';
import Register from './src/authentication/Register';

const Stack = createNativeStackNavigator()

export default function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
      auth.onAuthStateChanged(e => {
        if(e != null) {
          setUser(e)
        }
        setUser(auth.currentUser)
      })
  },[user])
  
  if(user == null) {
    return (
      <NavigationContainer>
      <Stack.Navigator  screenOptions={() => ({
          headerShown: false,
          animation: "none"
      })}>
          <Stack.Screen name='Login' component={Login}/>
          <Stack.Screen name='Register' component={Register}/>
          <Stack.Screen name='Form' component={Form}/>
      </Stack.Navigator>
  </NavigationContainer>
    );
  } else if (user != null) {
    return (
      <NavigationContainer>
      <Stack.Navigator  screenOptions={() => ({
          headerShown: false,
          animation: "none"
      })}>
        <Stack.Screen name='Form' component={Form}/>
          <Stack.Screen name='Login' component={Login}/>
          <Stack.Screen name='Register' component={Register}/>
      </Stack.Navigator>
  </NavigationContainer>
    );
  }
}
