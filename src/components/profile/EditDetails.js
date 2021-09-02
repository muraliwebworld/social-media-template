import React, { Component } from 'react';
import { View, Text, TextInput, Modal,StyleSheet, TouchableHighlight, ScrollView } from 'react-native';
import { updateUser } from '../../graphql';
import {MainContext} from '../../util/maincontext';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { withApollo } from '@apollo/client/react/hoc';


const styles = StyleSheet.create({
  modalView: {
    flex:1,
    flexDirection:'column',
    maxHeight:450,
    marginTop: 130,
    marginHorizontal:20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  inputbio: {
    width: 270,
    height:150,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
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
  openButton: {
    flex:1,
    backgroundColor: "#2196f3",
    borderRadius: 20,
    padding: 10,
    marginLeft:10,
    elevation: 2,
    alignSelf:'flex-start'
  },
  cancelButton: {
    flex:1,
    backgroundColor: "#2196f3",
    borderRadius: 20,
    padding: 10,
    marginLeft:10,
    elevation: 2,
    alignSelf:'flex-end'
  },  
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

class EditDetails extends Component {
  static contextType = MainContext;
  state = {
    id:"",
    username:"",
    useravatar:"",
    bio: '',
    website: '',
    location: '',
    open: false,
    modalVisible: false,
    errormsg: ''
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  componentDidMount() {
    const { profile } = this.context;
    const {id,username,useravatar, bio, website, location} = this.props;
    //console.log(this.props)
    this.setState({
      id:id,
      username:username,
      useravatar:useravatar, 
      bio: decodeURIComponent(bio),
      website: decodeURIComponent(website),
      location: decodeURIComponent(location)
    });
  }

  /*selectImagepicker = async() => {
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
        const formData = new FormData();
        let localUri = result.uri;
        let filename = localUri.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        formData.append('uploaded_file', { uri: localUri, name: filename, type },filename);           
        this.props.uploadImage(formData);
      }
      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };*/

  /*validatebiotext = (bio) => {
    if (bio.length > 200){
      this.setState({errormsg:"Maximum characters 200 reached. Please enter biodata less than 200 characters"})
    }
    else
    {
      this.setState({ bio })
    }
  }*/

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  editUserDetails = async(getUser,navigation)  => {
    try {
        await API.graphql(graphqlOperation(updateUser, {id:getUser.id,username:getUser.username, useravatar:getUser.useravatar,bio:getUser.bio,website:getUser.website,location:getUser.location}))
        let userdetails = {id:getUser.id,username:getUser.username, useravatar:getUser.useravatar,bio:getUser.bio,website:getUser.website,location:getUser.location};
        await AsyncStorage.setItem("ICgetuserinfo",JSON.stringify(userdetails));
        this.context.setProfile(userdetails);
        navigation.navigate("Myprofile");      
  
    } catch (e) {
        console.log('Error in update user', e);
    }  
  }

  handleSubmit = () => {
    const userDetails = {
      id: this.state.id,
      username:this.state.username,
      useravatar:this.state.useravatar,
      bio: this.state.bio,
      website: this.state.website,
      location: this.state.location
    };
    this.setModalVisible(false);
    //this.setState({setModalVisible:false});
    this.editUserDetails(userDetails,this.props.navigation,this.props.client);
    
  };
  render() {
    const { modalVisible } = this.state;
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
        >
          <ScrollView>
            <View  style={styles.modalView}>
              <Text style={{fontSize:18,fontWeight:'bold'}}>Edit Profile</Text>
              {this.state.errormsg ? (
                <Text style={{color:'red',fontSize:16}}>
                  {this.state.errormsg}
                </Text>
              ):null}
              <Text style={{marginTop:10}}>About yourself (200 characters max)</Text>              
              <TextInput
                  name="bio"
                  maxLength={200}
                  multiline
                  numberOfLines={7}
                  autoCompleteType="off"
                  placeholder="A short bio about yourself (maximum 200 characters)"
                  style={styles.inputbio}
                  value={this.state.bio}
                  onChangeText={(bio) => this.setState({bio})}
              />
              <Text>Website</Text>
              <TextInput
                  name="website"
                  autoCompleteType="off"
                  placeholder="Your website link"
                  style={styles.input}
                  value={this.state.website}
                  onChangeText={(website) => this.setState({ website })}
              />
              <Text>Location</Text>
              <TextInput
                  name="location"
                  autoCompleteType="off"
                  placeholder="Where you live..."
                  style={styles.input}
                  value={this.state.location}
                  onChangeText={(location) => this.setState({ location })}
              />
              <View style={{width:'100%',flexDirection:'row'}}>
                  <TouchableHighlight
                    style={styles.openButton}
                    onPress={() => {
                      this.handleSubmit()
                    }}                    
                  >
                    <Text style={styles.textStyle}>Save</Text>
                  </TouchableHighlight>                  
                  <TouchableHighlight
                    style={{ ...styles.cancelButton, backgroundColor: "#2196F3" }}
                    onPress={() => {
                      this.setModalVisible(!modalVisible);
                    }}
                  >
                    <Text style={styles.textStyle}>Cancel</Text>
                  </TouchableHighlight>
              </View>
              </View>
          </ScrollView>
        </Modal>
        <TouchableHighlight
          style={styles.editprofileButton}
          onPress={() => {
            this.setModalVisible(true);
          }}
        >
          <Text style={styles.textStyle}>Edit profile details</Text>
        </TouchableHighlight>
        </View>    
    );
  }
}


export default withApollo(EditDetails);
