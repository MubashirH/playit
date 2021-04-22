import React from 'react';
import { Image, View, Text } from 'react-native';



function HeaderContainer() {
    return (
        <View style={{display:'flex',flexDirection:'row', paddingLeft:20}}>
            <Image
              style={{ width: 30, height: 30 }}
              source={require('../assets/icon.png')}
            />
            <Text style={{color:'white', fontSize:23, marginLeft:10}}>
                Uplay
            </Text>
        </View>
    )
  }

export default HeaderContainer