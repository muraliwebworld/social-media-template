import React from 'react';
import dayjs from 'dayjs';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
//import { Icon } from 'react-native-elements';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign:'center',
    backgroundColor: '#ecf0f1',
    borderWidth: 1,
    borderColor: 'grey',
    padding:5,
    margin:5,
    height:150
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
    margin: 10
  },
  button: {
    marginTop: 20,
    position: 'relative'
  },  
});

const StaticGroupProfile = (props) => {
  const {
    profile: { groupImage,groupname,groupdescription }
  } = props;
  const regex = /(<([^>]+)>)/ig;
  return (
      <View style={styles.container}>
        <View style={{marginTop:5,width:'100%',flexDirection:'row'}}>
        <View style={{width:'20%'}}><Image source={{uri:groupImage}} style={{ width:70,height:70,borderRadius: 50,resizeMode: 'cover'}}/></View>
          <View style={{width:'80%',textAlign:'left'}}><Text style={{fontSize:20,fontWeight:'bold',margin:5,width:'100%'}}>
            {groupname} Group
          </Text></View>
        </View>
        {groupdescription && (<View style={{width:'100%'}}><Text style={{margin:5}}>{groupdescription.replace(regex, '').substring(0,200)+'...'}</Text></View>)}
      </View>
  );
};


export default StaticGroupProfile;
