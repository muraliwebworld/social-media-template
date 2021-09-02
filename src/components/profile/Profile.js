import React, { Component } from 'react';
//import dayjs from 'dayjs';
import { View, Text, StyleSheet, ActivityIndicator, TouchableHighlight, ScrollView, Image, InteractionManager, Button } from 'react-native';
import { updateUser } from '../../graphql';
import EditDetails from './EditDetails';
import * as ImagePicker from 'expo-image-picker';
import { Icon } from 'react-native-elements';
import { Storage, Auth,API,graphqlOperation } from "aws-amplify";
import {MainContext} from '../../util/maincontext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { withApollo } from '@apollo/client/react/hoc';


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ecf0f1',
      padding:5,
      //paddingBottom:10,
      //margin:10,
      //marginBottom:5,
    },
    input: {
      width: 270,
      height: 44,
      padding: 10,
      borderWidth: 1,
      borderColor: 'black',
      marginBottom: 10,
    },
    editprofileButton: {
      backgroundColor: "#2196f3",
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      alignSelf:'center'
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
    editImagebutton: {
      top: '80%',
      left: '70%',
      position:'absolute',
    }  
});

class Profile extends Component {
  static contextType = MainContext;
  _isMounted = false;
  state = {
    body: '',
    loggedin: 'false'
  };

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted){
    InteractionManager.runAfterInteractions(() => {
      if (!this.context.authenticated){
        this.setState({loggedin: false})
        this.props.navigation.navigate("Login", {
          searchString: "",
        });
      }
      setTimeout(() => {
        this.setState({'is_initiated': true });
      }, 0);
  
    });
  }

  }

  componentWillUnmount() {
    this._isMounted = false;
  }


  componentDidUpdate= (prevProps) => {
    this._isMounted = true;
    if (this._isMounted){
    const { authenticated,profile } = this.context;
    if (profile !== prevProps.profile && prevProps.authenticated !== undefined) {
      if (authenticated){
      }
      else
      {
        this.props.navigation.navigate("Login", {
          searchString: "",
        });
      }
    }
    }
  }


  uploadImage = async(userimageUrl,getUser,navigation,clientquery) => {
    try {
      var userdetails = {}
        await API.graphql(graphqlOperation(updateUser, {id:getUser.id,username:getUser.username, useravatar:userimageUrl,bio:getUser.bio,website:getUser.website,location:getUser.location}))
        userdetails = {id:getUser.id,username:getUser.username, useravatar:userimageUrl,bio:getUser.bio,website:getUser.website,location:getUser.location};
        await AsyncStorage.setItem("ICgetuserinfo",JSON.stringify(userdetails));
        this.context.setProfile(userdetails);
        navigation.navigate("Myprofile");      
    } catch (e) {
        console.log('Error in update chat user', e);
    }  
  }

  selectImagepicker = async() => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        //this.setState({ image: result.uri });
        this.setState({
          imageSource: result,
          imageDisplay: result.uri
        });
        //const formData = new FormData();
        let localUri = result.uri;
        let filename = localUri.split('/').pop();
          try {
            const response = await fetch(localUri);
            const blob = await response.blob();
            let s3result = await Storage.put("useravatar/"+filename, blob,
              {
                level: 'public',
                contentType: 'image/jpeg',
               }
              )
            .then(async(result) =>
            {
              if (result.key) {
                //console.log(result.key)
                let imageUrl = "https://pictures.indiacities.in/public/"+result.key;
                this.uploadImage(imageUrl,this.context.profile,this.props.navigation,this.props.client);
              }
              else
              {
                console.log('S3 bad response - no key found - Error uploading file');
              }
            });
          } catch (err) {
            console.log('Error uploading file:', err);
          }        
        //let match = /\.(\w+)$/.exec(filename);
        //let type = match ? `image/${match[1]}` : `image`;
        //formData.append('uploaded_file', { uri: localUri, name: filename, type },filename);
        //console.log(formData);          
      }
      //console.log(result);
    } catch (E) {
      console.log(E);
    }
  };

  logoutUser = async(navigation) => {
    try {
          await AsyncStorage.removeItem("ICgetuserinfo");
          await this.context.setProfile({});
          await this.context.setAuthenticated(false);
          await Auth.signOut();          
          navigation.navigate("Login", {
            searchString: "",icpagenumber:1
          });          
    } catch (e) {
      console.log('error signing out:', e);
    }
  };

  handleLogout = (navigation) => {
    this.logoutUser(navigation,this.props.client);
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  
  render() {
    const {
      authenticated,
      profile: {
         id, username, useravatar, bio, website, location ,
          }
    } = this.context;
    var useravatar2 = useravatar;
    if (useravatar && useravatar !== null && useravatar.includes("www.gravatar.com")){
      var useravatar1 = "https:"+useravatar;
      useravatar2 = useravatar1.replace("#038;","");
    }    
    //console.log('profile');
    //console.log(this.props.user)
    let profileMarkup = (this.context.profile.username ) ? (
      authenticated ? (
      <View style={{flex:1,flexDirection:'column',marginBottom:5,backgroundColor:'#ffffff'}}>
        <View style={{ width:'100%',alignItems:'center', backgroundColor:'#ffffff',marginTop:2, marginBottom:2 }}>
          <Text style={{textAlign:'center',fontSize:23,fontWeight:'bold'}}>My profile</Text>
        </View>        
        <ScrollView 
          style={{backgroundColor:'#ecf0f1',backgroundImage:'none',height:300,marginBottom:10,borderWidth: 1,borderColor: 'black',margin:5}}>
          <View  style={styles.container}>
            <View style={{width:'100%',flexDirection:'row'}}>
              <View style={{width:'65%',alignSelf:'flex-end'}}>
                <Image source={{uri:useravatar2}} style={{ height:100,width:100,borderRadius: 50,resizeMode: 'cover',alignSelf:'flex-end'}} />
              </View>
              <View 
                style={{width:'35%',flexDirection:"column",alignSelf:'flex-end'}}
              >
                <Icon
                  name='add-a-photo'
                  type='material'
                  color='#2196f3'
                  onPress={() => {
                    this.selectImagepicker();
                  }} 
                />            
                <Text style={{alignSelf:'center',color:'#2196f3'}}>Change image</Text>
              </View>
            </View>
              <Text style={{fontSize:20,fontWeight:'bold',margin:10,textAlign:'center'}}>
                @{username}
              </Text>
            {bio ? (
              <View>
                <Text style={{margin:5,textAlign:'left'}}>{bio}</Text>
              </View>):null}
            {location ? (
              <View style={{flex:2,flexDirection:"row",marginTop:5,alignSelf:'center'}}>
                <Icon
                  name='location-on'
                  type='material'
                  style={{flex:1}}
                />            
                <Text style={{flex:1}}>{location}</Text>
              </View>):null}
            {website ? (
              <View style={{flex:2,flexDirection:"row",marginTop:5}}>
                <Icon
                  name='link'
                  type='material'
                  style={{flex:1}}
                />            
                <Text style={{flex:1}}>{website}</Text>
              </View>):null}
          </View>
          </ScrollView>
          <EditDetails navigation={this.props.navigation} id={id?id:""} username={username?username:""} useravatar={useravatar?useravatar:""} bio={bio?bio:""} location={location?location:""} website={website?website:""}/>
          <View style={{flex:1,flexDirection:'row',backgroundColor:'#ffffff',paddingTop:10}}>
            <TouchableHighlight
                activeOpacity={0.8} 
                underlayColor={'#aaaaaa'}
                style={{flex:1,flexDirection:'column'}}
                onPress={() => {
                  this.props.navigation.navigate('UserActivities', {
                    userid: id,
                    username:username
                  });
                }}
                >
                  <View>
                  <Icon name="home" style={{alignSelf:'center'}}
                    color='#202661'
                  type='material' />
                  <Text style={{alignSelf:'center'}}>My listings</Text>
                  </View>
            </TouchableHighlight>
            <TouchableHighlight
                activeOpacity={0.8} 
                underlayColor={'#aaaaaa'}
                style={{flex:1,flexDirection:'column'}}
                onPress={() => {
                  this.props.navigation.navigate('Images');
                }}                
              >
              <View>
              <Icon name="image" style={{alignSelf:'center'}}
                color='#202661'
                type='material' />
              <Text style={{alignSelf:'center'}}>Images</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
                activeOpacity={0.8} 
                underlayColor={'#aaaaaa'}
                style={{flex:1,flexDirection:'column'}}
                onPress={() => {
                  this.props.navigation.navigate('Membersscreen');
                }}                
              >
              <View>
              <Icon name="dashboard" style={{alignSelf:'center'}}
                color='#202661'
                type='material' />
              <Text style={{alignSelf:'center'}}>Members</Text>
              </View>
            </TouchableHighlight>             
            <TouchableHighlight
                activeOpacity={0.8} 
                underlayColor={'#aaaaaa'}
                style={{flex:1,flexDirection:'column'}}
                onPress={() => {
                  this.props.navigation.navigate('Groups');
                }}                
            >
              <View>
              <Icon name="group" style={{alignSelf:'center'}}
                color='#202661'
                type='material' />
              <Text style={{alignSelf:'center'}}>Groups</Text>
              </View>
            </TouchableHighlight>
          </View>
          <View style={{flex:1,flexDirection:'row',backgroundColor:'#ffffff',paddingTop:10}}>
          
            <TouchableHighlight
                activeOpacity={0.8} 
                underlayColor={'#aaaaaa'}
                style={{flex:1,flexDirection:'column'}}
                onPress={() => {
                  this.props.navigation.navigate('Add');
                }}                
              >
              <View>
              <Icon name="add-circle" style={{alignSelf:'center'}}
                color='#202661'
                type='material' />
              <Text style={{alignSelf:'center'}}>Add</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
                activeOpacity={0.8} 
                underlayColor={'#aaaaaa'}
                style={{flex:1,flexDirection:'column'}}
                onPress={() => {
                  this.props.navigation.navigate('Discuss');
                }}                
            >
              <View>
              <Icon name="dashboard" style={{alignSelf:'center'}}
                color='#202661'
                type='material' />
              <Text style={{alignSelf:'center'}}>All Activities</Text>
              </View>
            </TouchableHighlight>            
            <TouchableHighlight
                activeOpacity={0.8} 
                underlayColor={'#aaaaaa'}
                style={{flex:1,flexDirection:'column'}}
                onPress={() => {this.logoutUser(this.props.navigation)}}                
              >
              <View>
              <Icon name="settings-power" style={{alignSelf:'center'}}
                color='#202661'
                type='material' />
              <Text style={{alignSelf:'center'}}>Logout</Text>
              </View>
            </TouchableHighlight>
          </View>            
      </View>
      ) : (
        <ScrollView style={{backgroundColor:'#ffffff',backgroundImage:'none'}}>
          <View  style={styles.container}>
            <Text style={{fontSize:18,backgroundColor:'#202661',color:'#ffffff',margin:20}}>
              Register/Login here to view/modify your profile
            </Text>
            <View style={{width:150,margin:10}}>
              <Button
                title="Login"
                onPress={() => {
                  this.props.navigation.navigate('Login');
                }}  
              />
            </View>
            <View style={{flex:1,flexDirection:'row',backgroundColor:'#ffffff'}}>
            <TouchableHighlight
                activeOpacity={0.8} 
                underlayColor={'#aaaaaa'}
                style={{flex:1,flexDirection:'column'}}
                onPress={() => {
                  this.props.navigation.navigate('Discuss');
                }}                
              >
              <View>
              <Icon name="home" style={{alignSelf:'center'}}
                color='#202661'
                type='material' />
              <Text style={{alignSelf:'center'}}>Home</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
                activeOpacity={0.8} 
                underlayColor={'#aaaaaa'}
                style={{flex:1,flexDirection:'column'}}
                onPress={() => {
                  this.props.navigation.navigate('Groups');
                }}                
              >
              <View>
              <Icon name="group" style={{alignSelf:'center'}}
                color='#202661'
                type='material' />
              <Text style={{alignSelf:'center'}}>Groups</Text>
              </View>
            </TouchableHighlight>
          </View>
          <View style={{flex:1,flexDirection:'row',backgroundColor:'#ffffff',marginTop:10}}>
          <TouchableHighlight
                activeOpacity={0.8} 
                underlayColor={'#aaaaaa'}
                style={{flex:1,flexDirection:'column'}}
                onPress={() => {
                  this.props.navigation.navigate('Images');
                }}                
            >
              <View>
              <Icon name="image" style={{alignSelf:'center'}}
                color='#202661'
                type='material' />
              <Text style={{alignSelf:'center'}}>Images</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
                activeOpacity={0.8} 
                underlayColor={'#aaaaaa'}
                style={{flex:1,flexDirection:'column'}}
                onPress={() => {
                  this.props.navigation.navigate('Discuss');
                }}                
            >
              <View>
              <Icon name="dashboard" style={{alignSelf:'center'}}
                color='#202661'
                type='material' />
              <Text style={{alignSelf:'center'}}>All Activities</Text>
              </View>
            </TouchableHighlight>            
            <TouchableHighlight
                activeOpacity={0.8} 
                underlayColor={'#aaaaaa'}
                style={{flex:1,flexDirection:'column'}}
                onPress={() => {
                  this.props.navigation.navigate('Add');
                }}                
            >
              <View>
              <Icon name="add-circle" style={{alignSelf:'center'}}
                color='#202661'
                type='material' />
              <Text style={{alignSelf:'center'}}>Add</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
                activeOpacity={0.8} 
                underlayColor={'#aaaaaa'}
                style={{flex:1,flexDirection:'column'}}
                onPress={() => {
                  this.props.navigation.navigate('Login');
                }}                
            >
              <View>
              <Icon name="settings-power" style={{alignSelf:'center'}}
                color='#202661'
                type='material' />
              <Text style={{alignSelf:'center'}}>Login</Text>
              </View>
            </TouchableHighlight>
          </View>                      
          </View>
        </ScrollView>
      )
    ) : (
      <View style={{flex:1,flexDirection:'column',alignItems:'center',marginTop:100}}>
        <ActivityIndicator color="#0000ff" size="large" />
      </View>        
    );

    return profileMarkup;
  }
}

export default withApollo(Profile);
