import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import { View, Text, TextInput, StyleSheet, TouchableHighlight, ScrollView,ActivityIndicator } from 'react-native';
import { withApollo } from '@apollo/client/react/hoc';
import {MainContext} from '../util/maincontext';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUser as GetUser, createUser } from '../graphql';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'grey',
    padding:30,
    margin:10
  },
  input: {
    width: 270,
    height: 44,
    padding: 7,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
    color:'#000000',
    paddingVertical: 0
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
  customError: {
    color: 'red',
    //fontSize: '0.8rem',
    marginTop: 10
  },
  customWarning: {
    color: 'green',
    //fontSize: '1.5rem',
    marginTop: 10,
  },
  progress: {
    position: 'absolute'
  },
  invisibleSeparator: {
    //border: 'none',
    margin: 4
  },
  visibleSeparator: {
    width: '100%',
    marginBottom: 20
  },
  paper: {
    padding: 20
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

class signup extends Component {

  static contextType = MainContext;

  state = {
    newUser:null,
    email: 'example@sampletestuser.com',
    password: '',
    confirmPassword: '',
    handle: '',
    confirmationCode:'',
    loading: false,
    errors: {},
    warnings: {},
    iccaptcha: true
  };
  componentDidMount() {
    const { navigation } = this.props;
    //this.focusListener = navigation.addListener("focus", () => { 
      this.setState({
        newUser:null,
        email: 'example@sampletestuser.com',
        password: '',
        confirmPassword: '',
        handle: '',
        confirmationCode:'',
        loading: false,
        errors: {},
        warnings: {},
        iccaptcha: true        
      })
    //})
  }

  loginUser = async(userData, customusername, navigation, useravatar) => {
    this.context.setLoading(true);
    let id = userData.username;
    let username = customusername;
    let bio = "";
    let location = "";
    let website = "";  

    try {
      let geticuserinfo = await AsyncStorage.getItem("ICgetuserinfo");
      if (!geticuserinfo) {
        const user = await API.graphql(graphqlOperation(GetUser, {id}))
        const { getUsermadras } = user.data
        var userdetails = {}
        if (!getUsermadras) {
          await API.graphql(graphqlOperation(createUser, {id,username,useravatar,bio,location,website}))
          userdetails = {id:id,username:username,useravatar:useravatar,bio:bio,location:location,website:website}
            await AsyncStorage.setItem("ICgetuserinfo",JSON.stringify(userdetails));
            this.context.setProfile(userdetails);
            this.context.setAuthenticated(true);
            this.context.setLoading(false);
            navigation.navigate("Discuss", {
              searchString: "",icpagenumber:1
            });
        }
        else
        {
          userdetails = {id:user.data.getUsermadras.id,
            username:user.data.getUsermadras.username,
            useravatar:user.data.getUsermadras.useravatar,
            bio:user.data.getUsermadras.bio,
            location:user.data.getUsermadras.location,
            website:user.data.getUsermadras.website}
            await AsyncStorage.setItem("ICgetuserinfo",JSON.stringify(userdetails));
            this.context.setProfile(userdetails);
            this.context.setAuthenticated(true);
            this.context.setLoading(false);
            navigation.navigate("Discuss", {
              searchString: "",icpagenumber:1
            });
        }
                     
      }
      else
      {
        //let geticuserinfodetails = await JSON.parse(geticuserinfo);
        this.context.setLoading(false);
          navigation.navigate("Discuss", {
            searchString: "",icpagenumber:1
          });
      }
  
    } catch (e) {
      this.context.setLoading(false);
        console.log('Error in creating chat user', e);
    }
  }  

  async signUp(username,password,email) {
    try {
        this.setState({
          loading: true,
          warnings: { general: 'Please wait...signup in progress' },
          errors: {}
        });

        const user = await Auth.signUp({
            username:email,
            password:password,
            attributes: {
              'custom:username':username,          // optional
            }
        });
        //console.log({ user });
        this.setState({newUser:user,loading:false});
    } catch (e) {
        console.log('error signing up:', e);
        let errormsg = 'Signing up error: '+e.message
        this.setState({loading: false, errors : {general:errormsg}, warnings: {}});

    }
  }

  async confirmSignin(confirmationCode,email,password,username) {

    try {
        this.setState({
          loading: true,
          warnings: { general: 'Please wait...signing in progress' },
          errors: {}
        });

      await Auth.confirmSignUp(email, confirmationCode);
      await Auth.signIn(email, password);

      const icuserInfo = await Auth.currentUserInfo();

      const userData = {
        username:icuserInfo.attributes['custom:username'],
        email: email
      };
 

      this.loginUser(userData, icuserInfo.username,this.props.navigation);
      //history.push("/");
    } catch (e) {
      console.log('error signing up:', e);
      let errormsg = 'Confirming code/sign in error: '+e.message
      this.setState({loading: false, errors : {general:errormsg}, warnings: {}});
      //onError(e);
      //setIsLoading(false);
    }

  }

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.iccaptcha) {
      this.setState({
      loading: true
      });


      if (this.state.password !== this.state.confirmPassword && this.state.password !== '' && this.state.password !== null)
      {
        this.setState( {errors: {general:'Password and confirm password must match'},loading:false });
      }
      else
      {
        if (this.state.email === '' || this.state.email === null){
          this.setState( {errors: {general:'invalid email'},loading:false });
        }
        else
        {
          if (this.state.handle === '' || this.state.handle === null){
            this.setState( {errors: {general:'invalid displayname'},loading:false });
          }
          else
          {
            this.signUp(this.state.handle,this.state.password,this.state.email);
          }
        }
        
      }
    }
    else
    {
      this.setState({loading: false, errors : {general:'invalid captcha'}, warnings: {}});
    }
    //this.props.signupUser(newUserData, this.props.history);
  };

  handleChange = (key,val) => {
    this.setState({
      [key]: val
    });
  };

  handleConfirmationSubmit = (event) => {
    event.preventDefault();
    this.confirmSignin(this.state.confirmationCode,this.state.email,this.state.password,this.state.handle);
    this.setState({isLoading:true});
  }

  verifyCaptcha = (capvalue) => {
    if (capvalue && capvalue !== null) {
        this.setState({iccaptcha: true});
    }
  }

  validateConfirmationForm = () => {
    return this.state.confirmationCode.length > 0;
  }

  renderForm = (navigation) => {
    /*const {
      classes,
      UI: { loading }
    } = this.props;
    const { errors, warnings } = this.state;*/
    //this.state.errors.general && ( console.log(this.state.errors.general));
      return (
      <ScrollView style={{backgroundColor:'#ffffff',backgroundImage:'none'}}>
        <View style={{alignItems:'center',textAlign:'center'}}>
            <Text style={styles.pageTitle}>
              Sign Up
            </Text>
        <View>
        <View style={styles.container}>
            <TextInput
              name="email"
              placeholder="Email (as username)"
              label="Email (as username)"
              style={styles.input}
              secureTextEntry={false}
              multiline={true}
              underlineColorAndroid='transparent'
              onChangeText={(val) => this.handleChange('email',val)}
            />
            <TextInput
              name="password"
              placeholder="Password"
              label="Password"
              secureTextEntry={true}
              style={styles.input}
              onChangeText={(val) => this.handleChange('password',val)}
            />
            <TextInput
              name="confirmPassword"
              placeholder="Password"
              label="Confirm Password"
              secureTextEntry={true}
              style={styles.input}
              onChangeText={(val) => this.handleChange('confirmPassword',val)}
            />
            <TextInput
              placeholder="Display name"
              name="handle"
              label="Displayname"
              style={styles.input}
              onChangeText={(val) => this.handleChange('handle',val)}
            />
            
          {this.context.loading && (<View style={{width:200}}>
            <ActivityIndicator color="#0000ff" size="large" />
          </View>)}
          {this.state.errors.general && (
            <View>
              <Text style={{color:'red',fontSize:16}}>
                {this.state.errors.general}
              </Text>
            </View>
          )}          
            <View style={{width:200}}>
              <TouchableHighlight
                style={styles.formButton}
                onPress={this.handleSubmit}
              >
                <Text style={styles.textStyle}>Signup</Text>
              </TouchableHighlight>              
            </View>
            <Text style={{marginTop:30,alignSelf:'center'}}>
              Already have account ? Login here
            </Text>            
            <View style={{width:200}}>
              <TouchableHighlight
                style={styles.formButton}
                onPress={() => {
                  {this.props.navigation.navigate('Login')}
                }}
              >
                <Text style={styles.textStyle}>Login here</Text>
              </TouchableHighlight>              
            </View>
          </View>
        </View>
        <View style={styles.container}>
          <TouchableHighlight
              style={styles.formButton}
              onPress={() => {
                {this.props.navigation.navigate('Discuss')}
              }}
          >
            <Text style={styles.textStyle}>Back to Home</Text>
          </TouchableHighlight>          
  </View>
  </View>     
      </ScrollView>
      );
    }

  renderConfirmationForm = () => {
    const {
      classes,
      UI: { loading }
    } = this.props;
    const { errors } = this.state;
    return (
      <ScrollView style={styles.form}>
        <View style={styles.container}>
          <View style={{alignItems:'center',textAlign:'center'}}>
          <Text style={{textAlign:'center',fontSize:18,fontWeight:'bold'}}>
            Enter confirmation code sent to your email
          </Text>
          {/*<form noValidate onSubmit={this.handleConfirmationSubmit}>*/}
            <TextInput
              name="confirmationCode"
              placeholder="Confirmation code"
              label="Confirmation code"
              style={styles.input}
              onChangeText={(val) => this.handleChange('confirmationCode',val)}
            />
          {this.context.loading && (<View style={{width:200}}>
            <ActivityIndicator color="#0000ff" size="large" />
          </View>)}
          {this.state.errors.general && (
            <Text style={{color:'red',fontSize:16}}>
                {this.state.errors.general}
            </Text>
          )}              
            <View style={{width:200}}>
              <TouchableHighlight
                style={styles.formButton}
                onPress={this.handleConfirmationSubmit}
                
              >
                <Text style={styles.textStyle}>Verify one time passcode</Text>
              </TouchableHighlight>              
            </View>
          </View>
        </View>
      </ScrollView>  
    );
  }

  render() {
    /*const {
      classes,
      UI: { loading }
    } = this.props;
    const { errors } = this.state;*/
    const { navigation } = this.props;
      return (
        <View>
        {this.state.newUser === null ? this.renderForm(navigation) : this.renderConfirmationForm()}
        </View>
      );
    }
  }


export default withApollo(signup);
