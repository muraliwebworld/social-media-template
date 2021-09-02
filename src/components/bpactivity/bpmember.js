import React, { Component } from 'react';
import { View, Share, Text,  Image, TouchableHighlight, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign:'center',
    backgroundColor: '#ecf0f1',
    borderWidth: 0,
    borderColor: 'grey',
    padding:10,
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


class bpmember extends Component {


  state = { validImage: true}

  imagerror = () => {
    this.setState({validImage: false})
    console.log('false')
  }
  onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'india cities forum android app',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  render() {
    const {
      bpmember: {
        //id,name,slug,avatar_urls
        id,
        username,
        useravatar,
        bio,
        website,
        location
      },
    } = this.props;
    const regex = /(<([^>]+)>)/ig;
    var useravatar2 = useravatar;
    if (useravatar.includes("www.gravatar.com")){
      var useravatar1 = "https:"+useravatar;
      useravatar2 = useravatar1.replace("#038;","");
    }
    return (
          <TouchableHighlight
          activeOpacity={0.8} 
          underlayColor={'#aaaaaa'}
          style={{ height:120,flex:1, resizeMode: 'cover'}}          
          onPress={() => {  
            this.props.navigation.navigate('UserActivities', {
              userid: id,
              username: username,
              userimage:useravatar2,
              bio:bio,
              website:website,
              location:location              
            });
          }}>
            <View  style={styles.container}>
              <Image source={{uri:useravatar2}} style={{ width:60,height:60,resizeMode: 'cover',margin:5}} />
              <Text style={{fontSize:12,fontWeight:'normal',margin:5,textAlign:'center'}}>
                {username.replace(regex, '').substring(0,23)}
              </Text>
            </View>
          </TouchableHighlight>
    );
  }
}

export default  (bpmember);
