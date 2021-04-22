import React, { useEffect, useState } from "react";
import { StyleSheet, View, TextInput, Clipboard, ScrollView, Alert, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { BottomSheet, Button, Text, Icon, ListItem, Divider } from 'react-native-elements';
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage';



const playingVideo = (link, navigation, setIsVisible, setPlaylist, playlistData) => {
    let videoId = link.split('e/').pop()
    let url = 'https://www.youtube.com/oembed?url='+link+'&format=json'
    fetch(url, {
        "credentials": 'include',
        "method": "GET",
        "headers": {'Content-Type': 'text/plain'}})
        .then((response) => {
            if ( response.status == 200 ) {
                return response.json()
            } else {
                throw new Error('Something went wrong')
            }
        })
        .then( async (res) => {
            // console.log(res)
            try {
                await AsyncStorage.setItem(res.thumbnail_url, JSON.stringify(res))
                setIsVisible(false)
                navigation.navigate('Video',{id: res})
                if(playlistData) {
                    let find = playlistData.filter( (data) => {  return data.thumbnail_url == res.thumbnail_url  })
                    find.length > 0 ? null : setPlaylist((prev)=>[...prev,res])
                } else { setPlaylist((prev) => [...prev, res]) }
            } catch(e) { console.log(e) }
        })
        .catch((error) => {
            Alert.alert(
                'Error',
                'Please provide valid url'
            )
        })
}

const playSelectedVideo = (data, navigation) => {
    navigation.navigate('Video',{id: data})
    // console.log(code[0])
}

const copyTextfromInput = () => {
    console.log('clicked')
}

const fetchCopiedText = async (setVideoLink) => {
    const text = await Clipboard.getString()
    setVideoLink(text)
}

const deleteVideo = async(link, setPlaylist,data) => {
    console.log('deleting')
    try {
        await AsyncStorage.removeItem(link)
        // await AsyncStorage.getAllKeys().then( async(keys) => {
        //     await AsyncStorage.multiGet(keys).then( (res) => {
        //         res.forEach(data => {
        //             const jsondata = JSON.parse(data[1])
        //             setPlaylist((prev) => {[...prev ,jsondata]})
        //         })
        //     })
        // })
        setPlaylist(data.filter((res) => res.thumbnail_url != link))
    } catch(e) { console.log(e)}
}


const  PlayListScreen = () => {    
    
    const navigation = useNavigation()

    const [isVisible, setIsVisible] = useState(false);
    const [videoLink, setVideoLink] = useState('');
    const [playlistData, setPlaylist] = useState([])
    let count = 0
    const getList = async() => {
        await AsyncStorage.getAllKeys().then(async keys => {
            await AsyncStorage.multiGet(keys).then( key => {
                key.forEach(data => {
                    const jsondata = JSON.parse(data[1])
                    setPlaylist((prev) => [...prev, jsondata])
                    console.log(count++)
                    // playlistData.push(jsondata)
                })
            })
        })
    }
    useEffect( () => {
        getList()
    }, [])
    
    return (
      <View style={styles.playlistWrapper}>
          <LinearGradient 
              colors={['#1a2737d6','#1A2737' ]}            
              start={{ y: 0.0, x: 0.0 }} end={{ y: 1.5, x: 1.5 }}
            >
                <View style={{display:'flex',flexDirection:'row', paddingLeft:20,paddingTop:40, height:'10%'}}>
                    <Image
                    style={{ width: 30, height: 30 }}
                    source={require('../../assets/icon.png')}
                    />
                    <Text style={{color:'white', fontSize:23, marginLeft:10}}>
                        Uplay
                    </Text>
                </View>
                <Text 
                    style={{fontSize:18,marginLeft:20,color:'white',marginBottom:10, marginTop:10}}
                >Your Videos</Text>
                <Divider style={{backgroundColor:'#0E4D95',marginLeft:10,marginBottom:10, height:2}}/>
              <ScrollView style={{height:'83.1%'}}>
                  {    
                    playlistData.map((res, index) => (
                            <View key={index} style={{padding:10}}>
                                <View style={{borderRadius:10, overflow:'hidden'}}>
                                    <Image 
                                        style={styles.playlistImg}
                                        source={{uri: res.thumbnail_url}}
                                    />
                                    <View style={styles.playlistTitle}>
                                        <Text style={{width: '80%', color:'white', fontSize:15}} onPress={() => playSelectedVideo(res, navigation)}>{res.title}</Text>
                                        <View style={styles.deleteBtn}>
                                            <Icon 
                                                name='trash'
                                                color='#E43838'
                                                type='font-awesome'
                                                style={{fontSize:1}}
                                                onPress = {()=>deleteVideo(res.thumbnail_url,setPlaylist,playlistData)}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                    ))
                  }
              </ScrollView>
              <LinearGradient
                colors={['#197CF3','#0E4D95']}
                start={{x:0,y:0}} end={{x:1.5,y:1.5}}
                style={styles.playlistBtn}
              >
                <View style={{margin:8}}>
                    <Icon 
                        name='plus-circle'
                        color='white'
                        type='font-awesome'
                        onPress = {()=>copyTextfromInput()}
                    />
                </View>                
                <Button 
                    title="Add Video"
                    type="clear"
                    titleStyle={{color:"white",fontSize:15}}
                    onPress = {() => {setIsVisible(!isVisible), setVideoLink('')}}
                />
              </LinearGradient>
          </LinearGradient>
          <View>
              <LinearGradient 
                colors={['#2B3743','#1C2630' ]} 
                start={{ y: 1.5, x: 1.5 }} end={{ y: 0, x: 0 }}
              
              >
                  <BottomSheet
                      isVisible = {isVisible}>
                      <View style={styles.bottomSheetWrapper}>
                          <View style={styles.inputWrapper}>
                              <Icon 
                                  name='clone'
                                  color='#197CF3'
                                  type='font-awesome'
                                  onPress = {()=>copyTextfromInput()}
                              />
                              <TextInput 
                                  placeholder="Paste Your Youtube Link Here"
                                  placeholderTextColor="#197CF3"
                                  onChangeText={(value) => setVideoLink(value)}
                                  value={videoLink} 
                                  style={styles.input}/>
                              <LinearGradient
                                        colors={['#197CF3','#0E4D95']}
                                        start={{ y: 0.0, x: 0.0 }} end={{ y: 1.5, x: 1.5 }}
                                        style={{borderRadius:15,width:'23%',paddingTop:5,paddingBottom:5}}
                                >
                                    <Button 
                                        title="Paste"
                                        type="clear"
                                        titleStyle={{fontSize:15,color:'white'}}
                                        onPress = {() => fetchCopiedText(setVideoLink)}
                                    />
                                </LinearGradient>
                          </View>
                          <LinearGradient
                                    colors={['#01E3A0','#009467']}
                                    start={{ y: 0.0, x: 0.0 }} end={{ y: 1.5, x: 1.5 }}
                                    style={{borderRadius:10,width:'55%',display:'flex',flexDirection:'row',justifyContent:'center'}}
                            >                    
                                <Button 
                                    type='clear'
                                    title="Play Video" 
                                    titleStyle={{color:'white',fontSize:21.6149}}
                                    style={{paddingTop:15,paddingBottom:15}}
                                    onPress = {() => playingVideo(videoLink, navigation,  setIsVisible, setPlaylist, playlistData)}
                                />
                                <Icon 
                                    name='play-circle'
                                    color='white'
                                    type='font-awesome'
                                    style={{marginTop:12}}
                                />
                            </LinearGradient>
                      </View>
                  </BottomSheet>
              </LinearGradient>
          </View>
      </View>
    )
  }

const HomeScreen = () => {
    
    const navigation = useNavigation()

  const [isVisible, setIsVisible] = useState(false);
  const [videoLink, setVideoLink] = useState('');
  const [copiedText, setCopiedText] = useState('');

        return (
            <View style={styles.containerWrapper}>
                <LinearGradient 
                    colors={['#172c43','#191c1f' ]}
                    style={{}}>
                        <View style={{display:'flex',flexDirection:'row', paddingLeft:20, paddingTop:40, height:'10%'}}>
                            <Image
                            style={{ width: 30, height: 30 }}
                            source={require('../../assets/icon.png')}
                            />
                            <Text style={{color:'white', fontSize:23, marginLeft:10}}>
                                Uplay
                            </Text>
                        </View>
                        <View style={styles.container}>
                            <LinearGradient
                                colors={['#197CF3','#0E4D95']}
                                start={{ y: 0.0, x: 0.0 }} end={{ y: 2.0, x: 2.0 }}
                                style={styles.homeBtn}
                            >   
                                <Icon 
                                    name='plus-circle'
                                    color='#fff'
                                    type='font-awesome'
                                    style={{marginTop:15,marginRight:10}}
                                />
                                <Button
                                    type='clear'
                                    title="Add your first Video"
                                    onPress = {() => {setIsVisible(!isVisible), setVideoLink('')}}
                                    titleStyle={{color:'white',fontSize:18,marginTop:5,marginBottom:5}}
                                />
                            </LinearGradient>
                        <Text style={{color:'#FFF',padding:20,fontSize:20,textAlign:'center'}}>Click here to paste the youtube video link and add your first video.</Text>
                        </View>
                </LinearGradient>
                <View>
                    <LinearGradient colors={['#2B3743','#1C2630' ]} >
                        <BottomSheet
                            isVisible = {isVisible}>
                            <View style={styles.bottomSheetWrapper}>
                                <View style={styles.inputWrapper}>
                                    <Icon 
                                        name='clone'
                                        color='#197CF3'
                                        type='font-awesome'
                                        onPress = {()=>copyTextfromInput()}
                                    />
                                    <TextInput 
                                        placeholder="Paste Your Youtube Link Here"
                                        placeholderTextColor="#197CF3"
                                        onChangeText={(value) => setVideoLink(value)}
                                        value={videoLink} 
                                        style={styles.input}/>
                                    <LinearGradient
                                        colors={['#197CF3','#0E4D95']}
                                        start={{ y: 0.0, x: 0.0 }} end={{ y: 1.5, x: 1.5 }}
                                        style={{borderRadius:15,width:'23%',paddingTop:5,paddingBottom:5}}
                                    >
                                        <Button 
                                            title="Paste"
                                            type="clear"
                                            titleStyle={{fontSize:15,color:'white'}}
                                            onPress = {() => fetchCopiedText(setVideoLink)}
                                        />
                                    </LinearGradient>
                                </View>
                                <LinearGradient
                                    colors={['#01E3A0','#009467']}
                                    start={{ y: 0.0, x: 0.0 }} end={{ y: 1.5, x: 1.5 }}
                                    style={{borderRadius:10,width:'55%',display:'flex',flexDirection:'row',justifyContent:'center'}}
                                >
                                    <Button 
                                        type='clear'
                                        title="Play Video" 
                                        titleStyle={{color:'white',fontSize:21.6149}}
                                        style={{paddingTop:15,paddingBottom:15}}
                                        onPress = {() => playingVideo(videoLink, navigation, setIsVisible)}
                                    />
                                    <Icon 
                                        name='play-circle'
                                        color='white'
                                        type='font-awesome'
                                        style={{marginTop:12}}
                                    />
                                </LinearGradient>
                            </View>
                        </BottomSheet>
                    </LinearGradient>
                </View>
            </View>
        )
};

function exportScreen() {
    const [keys, setKeys] = useState()

    const getData = async() => {
        try {
            const key = await AsyncStorage.getAllKeys()
            setKeys(key )
        } catch(e) { console.log(e)}
    }

    useEffect( () => {
        getData()
    },[keys])
    
    if (keys != undefined ) {
        if ( keys.length > 0) {
            return <PlayListScreen/>
        } else {
            return <HomeScreen/>
        }
    } else {
        return <HomeScreen/>
    }
}

export default exportScreen;

const styles = StyleSheet.create({
    containerWrapper: { flex: 1 },
    container: {
        height:'90%',
        justifyContent: 'center',
        alignItems: 'center',
      },
      homeBtn:{
          width:'85%', 
          borderRadius:15, 
          display:'flex', 
          flexDirection:'row',
          justifyContent:'center'
        },
      btn: {
          backgroundColor: '#00000000',
          borderRadius: 15,
          width: '100%'
      },
      button: {
        width: '40%',
        borderRadius: 15
      },
      inputWrapper: {
        display: 'flex',
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems:'center',
        backgroundColor: '#162330',
        padding: 5,
        paddingLeft:10,
        paddingRight:10,
        borderColor: 'white',
        width: '98%',
        marginBottom: 20,                                                                                                                                       
        marginTop:20,
        borderRadius: 10,
      },
      input: {
        padding:5,
        width: '60%',
        color:'#FFF',
        fontSize: 15
      },
      bottomSheetWrapper: {
        backgroundColor: '#2B3743',
        height: 200,
        padding: 20,
        borderTopLeftRadius:10,
        borderTopRightRadius: 10,
        display: 'flex',
        justifyContent:'space-around',
        alignItems:'center',
      },
        playlistImg: {
            height: 200,
            width: '100%',
        },
      playlistTitle: {
          padding: 15,
          backgroundColor: '#1A2737',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
      },
      deleteBtn: {
          backgroundColor:'#ffffff1a', 
          borderRadius:30,
          marginTop:5,
          height:20,
          width:20
        },
      playlistBtn: {
          position: 'absolute',
          right: 15,
          bottom: 15,
          display:'flex',
          flexDirection:'row',
          justifyContent:'center',
          width:'40%',
          borderRadius:15,
          paddingTop:8,
          paddingBottom:8
      }
})