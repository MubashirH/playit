import React from 'react';
import { StyleSheet, View} from 'react-native';


import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/home';
import VideoPlayer from './src/screens/video';
import HeaderContainer from './src/header';



const Stack = createStackNavigator();




const App = () => { 
    return (
      <View style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Home"
          >
            <Stack.Screen name='Home' component={HomeScreen} options={{headerShown: false}}/>
            <Stack.Screen name='Video' component={VideoPlayer} options={{headerShown: false}}/>
          </Stack.Navigator>
        </NavigationContainer>
        
      </View>
    )
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  }
});
