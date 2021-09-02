import React, { Component } from 'react';
import { Image, View, Text, TextInput, StyleSheet, ScrollView, ActivityIndicator, TouchableHighlight } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { withApollo } from '@apollo/client/react/hoc';
import * as ImagePicker from 'expo-image-picker';
import { Storage } from "aws-amplify";
import 'react-native-get-random-values';
import 'react-native-get-random-values';
import uuidv4 from 'uuidv4';
import {createActivity, orderbyupdatedID} from '../graphql';
import {MainContext} from '../util/maincontext';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent:'flex-start',
    backgroundColor: '#ecf0f1',
    borderWidth: 1,
    borderColor: 'grey',
    padding:20,
    margin:10
  },
  innerElement: {
    flex: 1,
    alignItems:'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: '#ecf0f1',
    borderWidth: 0,
    padding:20,
    margin:10,
    textAlign:'left'
  },  
  input: {
    textAlignVertical: 'top',
    padding: 10,
    width:270,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
    backgroundColor:'#ffffff',

  },
  image: {
    margin: 20
  },
  pageTitle: {
    textAlign:'center',
    fontSize:26,
    fontWeight:'bold',
    marginBottom:10
  },
  textStyle: {
    color: "white",
    fontWeight: "normal",
    textAlign: "center",
    fontSize:16
  },
  formButton: {
    backgroundColor: "#2196f3",
    borderRadius: 0,
    padding: 10,
    elevation: 2,
    alignSelf:'center'
  },     
});

class Postbpactivity extends Component {

  static contextType = MainContext;

  _isMounted = false;
  state = {
    titleactivity: '',
    body: '',
    errors: {},
    activityImage: false,
    image: '',
    imagePreview: null,
    loadaddpost: false,
    groupid: 9,
    selectedValue:"9",
    imageSource:null,
    imageDisplay:null,
    activitylistrefresh: false
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted){
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("focus", () => {
      //console.log('post');      
      this.setState({
        titleactivity:'', 
        body: '',
        errors: {},
        activityImage: false,
        image: '',
        imagePreview: null,
        loadaddpost: false,
        groupid: 9,
        selectedValue:"9",
        imageSource:null,
        imageDisplay:null        
      })
    });
    }
      
  }

  selectImagepicker = async() => {
    this._isMounted = true;
    if (this._isMounted){
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

      }
      //console.log(result);
    } catch (E) {
      console.log(E);
    }
  }
  };

  handleSubmit = async(navigation) => {
    //event.preventDefault();
    this.setState({errors: {}});
    this.setState({loadaddpost: true});
    if (this.state.body !== null && this.state.body !== ''){
      if (this.state.imageSource){
          ///const formData = new FormData();
          let localUri = this.state.imageSource.uri;
          let filename = localUri.split('/').pop();
          //let match = /\.(\w+)$/.exec(filename);
          //let type = match ? `image/${match[1]}` : `image`;          
          try {
            const response = await fetch(localUri);
            const blob = await response.blob();
            let s3result = await Storage.put(filename, blob,
              {
                level: 'public',
                contentType: 'image/jpeg',
               }
              )
            .then(async(result) =>
            {
              if (result.key) {
                //console.log(result.key)
                this.activityuploadImage(this.state.titleactivity,this.state.body,this.state.selectedValue,result.key,navigation,this.context.profile.id,this.context.profile.username,this.context.profile.useravatar,this.context.profile,this.props.client);
              }
              else
              {
                console.log('S3 bad response - no key found - Error uploading file');
              }
            });
          } catch (err) {
            console.log('Error uploading file:', err);
          }
      }
      else
      {
        this.setState({loadaddpost: true});
        let uuitemid = uuidv4();
        const createActivityInput = { 
            id: uuitemid,
            title:this.state.titleactivity,
            slug:'Activity '+uuitemid,
            content:this.state.body,
            contentLowercase:this.state.body.toLowerCase(),
            groupID:this.state.groupid,
            authorId:this.context.profile.id,
            sorTid:'activity',
            likeids:[],
            authorName:this.context.profile.username,
            authorImage:this.context.profile.useravatar,
            activityImage:'null',
            createdAt:Date.now(),
            updatedAt:Date.now(),
            userdetails: { 
              id: this.context.profile.id, username:this.context.profile.username,
              useravatar:this.context.profile.useravatar,bio:this.context.profile.bio,website:this.context.profile.website,
              location:this.context.profile.location,activityidlikes:[],createdAt:Date.now(),updatedAt:Date.now(),__typename: 'User'},
            __typename: 'Activity'
        }

        const createActivityInput1 = { 
          id: uuitemid,
          title:this.state.titleactivity,
          slug:'Activity '+uuitemid,
          content:this.state.body,
          contentLowercase:this.state.body.toLowerCase(),
          groupID:this.state.groupid,
          authorId:this.context.profile.id,
          sorTid:'activity',
          likeids:[],
          authorName:this.context.profile.username,
          authorImage:this.context.profile.useravatar,
          activityImage:'null',
      } 
      //console.log(createActivityInput)       
        this.createdyndbActivity(createActivityInput,navigation,createActivityInput1,this.context.profile,this.props.client);
        this.setState({
          title:'',
          body: '',
          errors: {},
          activityImage: false,
          image: '',
          imagePreview: null,
          groupid: 9,
          selectedValue:"9",
          imageSource:null,
          imageDisplay:null        
        })
        //this.props.navigation.navigate("Discuss", {
        //  searchString: "",icpagenumber:1
        //});       
      }
    }
    else
    {
      this.setState({loadaddpost: false,loading: false, errors : {general:'Please fill required content'}})
    }
  }

  handletitleactivity = (text) => {
    this.setState({ titleactivity: text })
  }  

  handleBody = (bodytext) => {
    this.setState({ body: bodytext })
  }

  createdyndbActivity = async(inputData,navigation,inputData1,user,clientquery) => {
    this.context.setLoading(true)
    await clientquery.clientprivate.mutate({
      variables: { input: inputData1 },
      mutation: createActivity,
      optimisticResponse: () => ({
        createActivitymadras: { ...inputData }
      }),
      /*update: async(datacache, { data: { createActivitymadras } }) => {
        const query = orderbyupdatedID
        // Read query from cache
        const data = await datacache.readQuery({ query,
          variables: { limit:30,sortDirection: "DESC", sorTid: "activity",filter: {
            contentLowercase: { contains:'' }
          }}, 
        });
        if (data.orderbyupdatedIDmadras.items && createActivitymadras.id){
          //
          data.orderbyupdatedIDmadras.items = [
            createActivitymadras, ...data.orderbyupdatedIDmadras.items.filter(item => item.id !== createActivitymadras.id)
          
          ];

          orderBy(data.orderbyupdatedIDmadras.items,['sorTid','updatedAt'],['desc','desc']);
          datacache.writeQuery({ query, data });

        }
          
      }*/

   }).then(async(result) => {
        let newActivity = [];
        newActivity.push(inputData1);
        this.context.setActivities([...newActivity, ...this.context.activities]);
        this.context.setLoading(false);
        navigation.navigate("Discuss", {
          searchString: "",icpagenumber:1
        });
    })
    .catch(async (err) => {
      console.log('err');
      console.log(err);
      console.log('Error in creating activity....Please try again!!!');
      this.context.setLoading(false);
    });
  }  

  // Activity image upload
  activityuploadImage = async(
    bpactivitytitle,
    bpactivitycontent,
    groupid,
    imageFilename,
    navigation,
    userid,
    username,
    useravatar,
    userdet={},
    clientquery)  => {

    let uuitemid = uuidv4();

    this.context.setLoading(true)

    const createActivityimageInput = { 
      id: uuitemid,
      title:bpactivitytitle,
      slug:'Activity '+uuitemid,
      content:bpactivitycontent,
      contentLowercase:bpactivitycontent.toLowerCase(),
      groupID:groupid,
      authorId:userid,
      sorTid:'activity',
      likeids:[],
      authorName:username,
      authorImage:useravatar,
      activityImage:"https://pictures.indiacities.in/public/"+imageFilename
    }

    const createActivityimageInput1 = { 
      id: uuitemid,
      title:bpactivitytitle,
      slug:'Activity '+uuitemid,
      content:bpactivitycontent,
      contentLowercase:bpactivitycontent.toLowerCase(),
      groupID:groupid,
      authorId:userid,
      sorTid:'activity',
      likeids:[],
      authorName:username,
      authorImage:useravatar,
      activityImage:"https://pictures.indiacities.in/public/"+imageFilename,
      createdAt:Date.now(),
      updatedAt:Date.now(),
      userdetails: { 
        id: userdet.id, username:userdet.username,
        useravatar:userdet.useravatar,bio:userdet.bio,website:userdet.website,
        location:userdet.location,activityidlikes:[],createdAt:Date.now(),updatedAt:Date.now(),__typename: 'User'},
      __typename: 'Activity'      
    }    

    await clientquery.clientprivate.mutate({
      variables: { input: createActivityimageInput },
      mutation: createActivity,
      optimisticResponse: () => ({
        createActivitymadras: { ...createActivityimageInput1 }
      }),
      /*update: async(datacache, { data: { createActivitymadras } }) => {
        const query = orderbyupdatedID
        if (data.orderbyupdatedIDmadras.items && createActivitymadras.id){
          //
          data.orderbyupdatedID.items = [
            createActivitymadras, ...data.orderbyupdatedIDmadras.items.filter(item => item.id !== createActivitymadras.id)
          
          ];

          orderBy(data.orderbyupdatedIDmadras.items,['sorTid','updatedAt'],['desc','desc']);
          datacache.writeQuery({ query, data });

        }
      }*/      

    }).then(async(result) => {
      //await clientquery.clientpublic.resetStore().then(async() => {
        let newActivity = [];
        newActivity.push(createActivityimageInput);
        this.context.setActivities([...newActivity, ...this.context.activities]);
        this.context.setLoading(false);
        navigation.navigate("Discuss", {
          searchString: "",icpagenumber:1
        });
        
      //});
    })
    .catch(async (err) => {
      console.log('err');
      console.log(err);
      console.log('Error in creating activity with image...');
      this.context.setLoading(false);
    });

};

  showToastWithGravityAndOffset = async(message) => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
  };


  render() {
    const {
      authenticated,
      profile  
    } = this.context;
    //const { errors, errortype} = this.props.ui;

    //if (errors && (errortype === 'createactivity' || errortype === 'createactivityimage')) {
    //  this.showToastWithGravityAndOffset(errors);
    //}
    //console.log(this.state.imageDisplay)
    return (
        <ScrollView style={{backgroundColor:'#ffffff',backgroundImage:'none'}}>
          <View style={styles.container}>
            {authenticated ? (<View style={{alignItems:'center',textAlign:'center'}}> 
                    <Text style={styles.pageTitle}>
                        Add activity
                    </Text>
                    {/*<form onSubmit={this.handleSubmit} style={{borderBottom:"1px solid #ccc", borderTop:"1px solid #ccc",padding:'10px', minHeight:'250px'}}>*/}
                    <TextInput
                        name="titleactivity"
                        placeholder="Title"
                        maxLength={200}
                        style={styles.input}
                        value={this.state.titleactivity}
                        onChangeText={this.handletitleactivity}
                    />                    
                    <TextInput
                        name="body"
                        placeholder="Content..."
                        maxLength={200}
                        multiline
                        numberOfLines={7}
                        style={styles.input}
                        value={this.state.body}
                        onChangeText={this.handleBody}
                    />
                    {this.state.loadaddpost && (<View style={{width:200}}>
                        <ActivityIndicator color="#0000ff" size="large" />
                    </View>)}                    
                    {this.state.errors.general && (<View style={{width:200}}>
                    <Text style={{color:'red',fontSize:16}}>
                        {this.state.errors.general}
                    </Text></View>
                    )}                    
                    <View style={{width:150,margin:10}}>
                      <TouchableHighlight
                        style={styles.formButton}
                          onPress={this.selectImagepicker}
                          
                      >
                        <Text style={styles.textStyle}>Select Image</Text>
                      </TouchableHighlight>                      
                    </View>
                    <View style={{alignItems:'flex-start',justifyContent:'flex-start',width:270,marginTop:10}}>
                      <Text style={{textAlign:'left',fontSize:18,fontWeight:'bold'}}>Select category</Text>
                    </View>
                    <View style={{alignItems:'flex-start',justifyContent:'flex-start',width:270,marginBottom:10,borderWidth:1,borderColor:'grey'}}>
                        <Picker
                            selectedValue={this.state.selectedValue}
                            style={{ width: 230,height:40 }}
                            onValueChange={(itemValue, itemIndex) => this.setState({selectedValue:itemValue})}
                        >
                            <Picker.Item label="General" value="9" />
                            <Picker.Item label="Travel" value="1" />
                            <Picker.Item label="Jobs" value="2" />
                            <Picker.Item label="Buy and Sell" value="3" />
                            <Picker.Item label="Real Estate" value="4" />
                            <Picker.Item label="Health Care" value="5" />
                            <Picker.Item label="Electronics" value="6" />
                            <Picker.Item label="Software" value="7" />
                            <Picker.Item label="Education" value="8" />
                            <Picker.Item label="Entertainment" value="10" />                                                                                                                
                        </Picker>
                    </View>
                    {this.state.imageDisplay && (
                        <View style={{width:100,margin:5}}>
                        <Image 
                          source={{uri:this.state.imageDisplay}} alt="" style={{ height:70,resizeMode: 'cover'}}
                        />
                        </View>
                    )}
                    <View style={{width:250,margin:30}}>
                    {!this.state.loadaddpost && (
                        <TouchableHighlight
                          style={styles.formButton}
                          onPress={() => {
                            {this.handleSubmit(this.props.navigation)}
                          }}
                        >
                          <Text style={styles.textStyle}>Submit to publish post</Text>
                      </TouchableHighlight>                      
                    )}</View>
              </View>
                ):(
                    <View style={styles.container}>
                      <TouchableHighlight
                        style={styles.formButton}
                        onPress={() => {
                          {this.props.navigation.navigate('Login')}
                        }}
                      >
                          <Text style={styles.textStyle}>Login to add activity</Text>
                        </TouchableHighlight>                      
                    </View>                   
                )}
            </View>
        </ScrollView>
    );
  }
}

export default withApollo(Postbpactivity);
