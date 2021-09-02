import React, { Fragment } from 'react';
import dayjs from 'dayjs';
import { View, Text, StyleSheet, Image} from 'react-native';
import { Icon } from 'react-native-elements';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    borderWidth: 1,
    borderColor: 'grey',
    paddingLeft:5,
    margin:5,
    paddingBottom:10,
    maxHeight:200
  },
  input: {
    width: 270,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },  
  form: {
    textAlign: 'center'
  },
  image: {
    margin: 20
  },
  pageTitle: {
    textAlign:'center',
    fontSize:26,
    fontWeight:'bold'
  },
  textField: {
    margin: 5
  },
  button: {
    marginTop: 20,
    position: 'relative'
  },  
});

const StaticProfile = (props) => {
  const {
     profile: { username, useravatar, bio, website, location }

  } = props;
  //console.log(props);
  var useravatar2 = useravatar;
  if (useravatar && useravatar !== null && useravatar.includes("www.gravatar.com")){
    var useravatar1 = "https:"+useravatar;
    useravatar2 = useravatar1.replace("#038;","");
  }
  const regex = /(<([^>]+)>)/ig;
  return (
    <View  style={styles.container}>
      <View style={{flex:4,flexDirection:"row",marginTop:5}}>
      {useravatar ? (<View style={{flex:1}}><Image source={{uri:useravatar2}} style={{ borderRadius: 50,resizeMode: 'cover',flex:1,maxWidth:50,maxHeight:50}} /></View>):null}
        {username ? (<View style={{flex:3,textAlign:'left'}}><Text style={{fontSize:14,fontWeight:'bold',margin:10}}>
          @{username}
        </Text></View>):<Text>Member name:</Text>}
      </View>
        {(bio && bio !== '') ? (
          <View style={{flex:2,flexDirection:"row",marginTop:5,maxHeight:80,alignItems:'center'}}>
            <Text style={{flex:2}}>{decodeURIComponent(bio).replace(regex, '').substring(0,180)}</Text>
          </View>):(<View style={{flex:1,flexDirection:"row",marginTop:5,alignItems:'center'}}>
            <Text style={{flex:2}}>User description</Text>
          </View>)}
        {location && location !== '' ? (
          <View style={{flex:2,flexDirection:"row",marginTop:20,maxHeight:80,alignItems:'center'}}>
            <Icon
              name='location-on'
              type='material'
              style={{flex:1,marginTop:10}}
            />            
            <Text style={{flex:1,marginTop:10}}>{decodeURIComponent(location)}</Text>
          </View>):(<View style={{flex:2,flexDirection:"row",marginTop:5,height:80,alignItems:'center'}}>
          <Icon
              name='location-on'
              type='material'
              style={{flex:1,marginTop:10}}
            />             
            <Text style={{flex:1}}>Location of user: </Text>
          </View>)}
        {website && website !== '' ? (
          <View style={{flex:2,flexDirection:"row",marginTop:5,maxHeight:80,alignItems:'center'}}>
            <Icon
              name='link'
              type='material'
              style={{flex:1,marginTop:10}}
            />            
            <Text style={{flex:1,marginTop:10}}>{decodeURIComponent(website)}</Text>
          </View>):(<View style={{flex:2,flexDirection:"row",marginTop:5,height:80,alignItems:'center'}}>
            <Icon
              name='link'
              type='material'
              style={{flex:1,marginTop:10}}
            />            
            <Text style={{flex:1}}>Website:</Text>
          </View>)}
      </View>
  );
};

export default StaticProfile;
