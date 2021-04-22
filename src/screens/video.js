import React from 'react';

import YoutubePlayer from 'react-native-youtube-iframe';
import { LinearGradient } from "expo-linear-gradient";
import AndroidPip from 'react-native-android-pip';
import { View, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';

const goHome = (navigation) => {
    navigation.navigate('Home')
}


function VideoPlayer({route:{params}}) {

    const navigation = useNavigation()
    
    let temp = params.id.thumbnail_url.split('i/')
    let code = temp[1].split('/')
    
    // AndroidPip.enterPictureInPictureMode()
    return (
        <View>
            <View style={styles.videoHeader}>
                <Text style={{color:'#fff', fontSize:15, width:'80%'}}>{params.id.title}</Text>
                <View style={{marginRight:20}}>
                    <Icon 
                        name='times-circle'
                        color='#E43838'
                        type='font-awesome'
                        onPress = {()=>goHome(navigation)}
                    />
                </View>
            </View>
            <View style={{display:'flex', justifyContent:'center', height:'90%', backgroundColor:'black'}} >
                <YoutubePlayer
                    height={300}
                    play={true}
                    videoId={code[0]}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    videoHeader: {
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between', 
        backgroundColor:'black',
        paddingLeft:20,
        paddingTop:40,
        height:'10%'
    }
})

export default VideoPlayer;