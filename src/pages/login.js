import React, { Component } from 'react';

import { View, Text, TextInput, StyleSheet, ScrollView,TouchableHighlight, ActivityIndicator } from 'react-native';
import { withApollo } from '@apollo/client/react/hoc';
import {MainContext} from '../util/maincontext';
import { Auth, Hub, API, graphqlOperation } from 'aws-amplify';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import gql from 'graphql-tag';
import { getUser as GetUser, createUser } from '../graphql';
//import Cookie from "js-cookie";
var md5 = require('md5');

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'grey',
    padding:30,
    margin:20,
    textAlign:'center'    
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
  image: {
    margin: 20
  },
  pageTitle: {
    textAlign:'center',
    fontSize:20,
    fontWeight:'bold'
  },
  pageConfirmationcode: {
    marginTop: 0,
    textAlign:'left',
    padding:10,
    fontSize:16,
    fontWeight:'bold',
    color:'#000000',
    width:250
  },
  textField: {
    margin: 10
  },
  button: {
    marginTop: 20,
    position: 'relative',
    marginRight: 20
  },
  customError: {
    color: 'red',
    //fontSize: '1.0rem',
    marginTop: 10,
  },
  customWarning: {
    color: 'green',
    //fontSize: '1.0rem',
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

class login extends Component {

  static contextType = MainContext;

  _isMounted = false;
  state = {
    iemail: '',
    password: null,
    passwordreset: null,
    confirmationCode:null,
    passwordresetconfirm:null,
    confirmationCodepasswordreset:null,
    errors: {},
    warnings: {},
    newUser: { userstatus : ''},
    iccaptcha: true,
    loading: false,
    statusBarStyle: 'dark-content',
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted){    
    //this.facebooksignin();
    const { navigation } = this.props;
    //this.focusListener = navigation.addListener("focus", () => { 
      this.setState({
        iemail: '',
        password: null,
        passwordreset: null,
        confirmationCode:null,
        passwordresetconfirm:null,
        confirmationCodepasswordreset:null,
        errors: {},
        warnings: {},
        newUser: { userstatus : ''},
        iccaptcha: true,
        loading: false,
        statusBarStyle: 'dark-content',
      });
  }

  }

  loginUser = async(userData, customusername, navigation, useravatar)  => {
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
          userdetails = {id:user.data.getUsermadras.id,username:user.data.getUsermadras.username,useravatar:user.data.getUsermadras.useravatar,bio:user.data.getUsermadras.bio,location:user.data.getUsermadras.location,website:user.data.getUsermadras.website}
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
        console.log('Error in creating  user', e);
    }
  }

  async userSignin(iemail,password) {
    //console.log(iemail+password);
    try {
      this.context.setLoading(true);
      this.setState({
        loading: true,
        warnings: { general: 'Please wait...login in progress' },
        errors: {}
      });

      await Auth.signIn(iemail, password);

      //console.log('icuserInfo1');

      const icuserInfo = await Auth.currentUserInfo();
      //await AsyncStorage.setItem("ICuserinfo", JSON.stringify(icuserInfo));

      //console.log(icuserInfo);

      if (!icuserInfo.iemail_verified) {
        //this.setState({newUser:user});
        this.renderConfirmationForm();
      }


     const userData = {
      id:icuserInfo.id,
      username:icuserInfo.username,
      customusername:icuserInfo.attributes['custom:username'],
      email: iemail
    };
    let emailhash = md5(iemail);
    let gravataruserimage = "https://www.gravatar.com/avatar/"+emailhash
    this.loginUser(userData, icuserInfo.attributes['custom:username'],this.props.navigation,gravataruserimage);

      //await this.checkIfUserExists(icuserInfo.attributes['custom:username']);
      //history.push("/");
    } catch (e) {
      console.log('login error signing up:', e.code, e.message, e);
      let errormsg = 'Login error: '+e.message
      if (e.code === 'UserNotConfirmedException'){
        this.setState({newUser:{userstatus:'UserNotConfirmedException'},loading:false});
        this.context.setLoading(false);
        //this.renderConfirmationForm();
      }
      else
      {
        //console.log('error signing up:', e.code);
        if (e.code === 'PasswordResetRequiredException'){
          console.log('error signing up:', e.code);
          this.setState({newUser:{userstatus:'PasswordResetRequiredException'},loading:false});
          this.context.setLoading(false);
          //this.passwordresetConfirmationForm();
        }
        else
        {
          this.setState({loading: false, errors : {general:errormsg},loading:false, warnings: {}});
          this.context.setLoading(false);
        }
      }
    }

  }

  facebooksignin = async() => {
    this.context.setLoading(true);

    try {
      await Auth.federatedSignIn()
        // Listen for federated sign-in and redirect to account page to complete the process
        //console.log('loginuser0');
        Hub.listen('auth', async({ payload: { event, data } }) => {
          if (event === 'signIn') {
            const user = await Auth.currentAuthenticatedUser();
            //await AsyncStorage.setItem("ICuserinfo", JSON.stringify(user));
            //console.log(user)
            let username = user.attributes['email'].match(/^([^@]*)@/)[1];
            username = username.replace(".", "-");
            const userData = {
              id:user.id,
              username:user.username,
              customusername:username,
              email: user.attributes['email']
            };
            //console.log('loginuser');
            let emailhash = md5(user.attributes['email']);
            let gravataruserimage = "https://www.gravatar.com/avatar/"+emailhash            
            this.loginUser(userData, username,this.props.navigation,gravataruserimage);
            //this.setState({loading:false});
    
          }
          else
          {
            
            if (event === 'signIn_failure') {
              this.setState({loading:false});
              this.context.setLoading(false);
              alert('Facebook signin failed');
            }
          }
      });

    }  catch (err) {
      alert('Error in login using FaceBook Provider - '+err);
    }
  }

 
  handleSubmit = (event) => {
    event.preventDefault();
    //this.setState({iccaptcha: true})
    if (this.state.iccaptcha) {
      this.setState({
        loading: true,
      });
      this.context.setLoading(true);
      //console.log('icuserInfo0');

      if (this.state.iemail === '' || this.state.iemail === null){
        //console.log('invalid iemail');
        this.setState( {errors: {general:'invalid email'},loading:false });
        this.context.setLoading(false);
      }
      else
      {
        if (this.state.password === '' || this.state.password === null){
          //console.log('password');
          this.setState( {errors: {general:'invalid password'},loading:false });
          this.context.setLoading(false);
        }
        else
        {
          //console.log('user signin');
          this.userSignin(this.state.iemail,this.state.password);
        }
      }
      
    }
    else
    {
      this.setState({loading: false, errors : {general:'invalid captcha'}, warnings: {}});
      this.context.setLoading(false);
    }
  };

  handleChange = (key,val) => {
    this.setState({
      [key]: val
    });
  };


  async confirmSignin(confirmationCode,iemail,password,username) {

    try {
      this.context.setLoading(true);
        this.setState({
          loading: true,
          warnings: { general: 'Please wait...signing in progress' },
          errors: {}
        });

      await Auth.confirmSignUp(iemail, confirmationCode);
      await Auth.signIn(iemail, password);

      const icuserInfo = await Auth.currentUserInfo();
      //await AsyncStorage.setItem("ICuserinfo", JSON.stringify(icuserInfo));

      //await this.checkIfUserExists(icuserInfo.attributes['custom:username']);

      const userData = {
        id:icuserInfo.id,
        username:icuserInfo.username,
        customusername:icuserInfo.attributes['custom:username'],
        email: iemail
      };

  

      this.loginUser(userData, icuserInfo.attributes['custom:username'],this.props.navigation);
      //history.push("/");
    } catch (e) {
      console.log('error signing up:', e);
      let errormsg = 'Confirming code/sign in error: '+e.message
      this.setState({loading: false, errors : {general:errormsg}, warnings: {}});
      this.context.setLoading(false);
      //onError(e);
      //setIsLoading(false);
    }

  }


 
  async confirmSigninpasswordreset(confirmationCode,iemail,password) {

    try {
      this.context.setLoading(true);
        this.setState({
          loading: true,
          warnings: { general: 'Please wait...password reset in progress' },
          errors: {}
        });

      await Auth.forgotPasswordSubmit(iemail,confirmationCode,password);

      await Auth.signIn(iemail, password);

      const icuserInfo = await Auth.currentUserInfo();
      //await AsyncStorage.setItem("ICuserinfo", JSON.stringify(icuserInfo));
      
      const userData = {
        id:icuserInfo.id,
        username:icuserInfo.username,
        customusername:icuserInfo.attributes['custom:username'],
        email: iemail
      };

      this.loginUser(userData, icuserInfo.attributes['custom:username'],this.props.navigation);      

      //await this.checkIfUserExists(icuserInfo.attributes['custom:username']);

    } catch (e) {
      console.log('error signing up:', e);
      let errormsg = 'Error in Password reset : '+e.message
      this.setState({loading: false, errors : {general:errormsg}, warnings: {}});
      this.context.setLoading(false);
      //onError(e);
      //setIsLoading(false);
    }

  }

  handleConfirmationSubmit = (event) => {
    event.preventDefault();
    this.confirmSignin(this.state.confirmationCode,this.state.iemail,this.state.password);
    this.context.setLoading(true);
    this.setState({loading:true});
  }

  handlepasswordresetConfirmationSubmit = (event) => {
    event.preventDefault();
    this.context.setLoading(true);
    this.setState({loading:true});
    if (this.state.passwordreset !== this.state.passwordresetconfirm && this.state.passwordreset !== '' && this.state.passwordresetconfirm !== null)
    {
      this.setState( {errors: {general:'Password and confirm password must match'} ,loading:false});
      this.context.setLoading(false);
    }
    else
    {
      if (this.state.confirmationCodepasswordreset === '' || this.state.confirmationCodepasswordreset === null){
        this.setState( {errors: {general:'invalid confirmation code'} ,loading:false});
        this.context.setLoading(false);
      }
      else
      {
        this.confirmSigninpasswordreset(this.state.confirmationCodepasswordreset,this.state.iemail,this.state.passwordreset);
        this.setState({loading:true});
        this.context.setLoading(true);
      }
      
    }
  }

  validateConfirmationForm = () => {
    return this.state.confirmationCode.length > 0;
  }

  verifyCaptcha = (capvalue) => {
    if (capvalue && capvalue !== null) {
        this.setState({iccaptcha: true});
    }
  }

  passwordresetroutine = (event) => {
    event.preventDefault();
    this.setState({loading:true});
    if (this.state.iemail === '' || this.state.iemail === null){
      this.setState( {errors: {general:'Please enter email and press forgot password button'},loading:false });
    }
    else
    {
      //console.log('passwordreset');
      this.setState({loading:true});
      this.context.setLoading(true);
      this.handlepasswordresetSendCodeClick(this.state.iemail);
    }
    //this.passwordresetConfirmationForm();
  }

  async handlepasswordresetSendCodeClick(iemail) {
    this.setState({loading:true});
    this.context.setLoading(true);
    try {
      await Auth.forgotPassword(iemail);
      this.setState({newUser:{userstatus:'PasswordResetRequiredException'},loading:false});
      this.context.setLoading(false);
    } catch (e) {
      console.log('error password reset confirmation code:', e);
      let errormsg = 'Error in sending Password reset confirmation code to your email id: '+e.message
      this.setState({loading: false, errors : {general:errormsg}, warnings: {},loading:false});    }
      this.context.setLoading(false);
  }

  passwordresetConfirmationForm = () => {
    return (
      <ScrollView style={{backgroundColor:'#ffffff',backgroundImage:'none'}}>
      {!this.context.loading ? (<View style={styles.container}>
        <View style={{alignItems:'center',textAlign:'center'}}>
          <Text style={styles.pageConfirmationcode}>
            Password reset, Please enter confirmation code sent to your email id
          </Text>          
          {/*<form noValidate onSubmit={this.handlepasswordresetConfirmationSubmit}>*/}
            <TextInput
              name="confirmationCodepasswordreset"
              placeholder="Confirmation code"
              autoCompleteType="off"
              style={styles.input}
              multiline={true}
              onChangeText={(val) => this.handleChange('confirmationCodepasswordreset',val)}
            />
            <TextInput
              name="passwordreset"
              placeholder="New Password"
              autoCompleteType="off"
              style={styles.input}
              secureTextEntry={true}
              onChangeText={(val) => this.handleChange('passwordreset',val)}
            />
            <TextInput
              name="passwordresetconfirm"
              placeholder="Confirm again new password"
              style={styles.input}
              secureTextEntry={true}
              onChangeText={(val) => this.handleChange('passwordresetconfirm',val)}
            /> 
          {/*this.state.errors.general && (
              <Typography variant="h6" className={this.props.classes.customError}>
                {this.state.errors.general}
              </Typography>
          )*/}
          {this.context.loading && (<View style={{width:200}}>
            <ActivityIndicator color="#0000ff" size="large" />
          </View>)}
          {this.state.errors.general && (
            <Text style={{color:'red',fontSize:16}}>
                {this.state.errors.general}
            </Text>
          )}
          <View style={{width:250,margin:5}}>
            <TouchableHighlight
              style={styles.formButton}
              onPress={this.handlepasswordresetConfirmationSubmit}
            >
              <Text style={styles.textStyle}>Confirm and Reset password</Text>
            </TouchableHighlight>            
          </View>
          <View style={{width:250,margin:30}}>
          <TouchableHighlight
              style={styles.formButton}
              onPress={this.passwordresetroutine}
            >
              <Text style={styles.textStyle}>Resend Confirmation code</Text>
          </TouchableHighlight>             
        </View>
        </View>
      </View>):(<View style={{alignItems:'center',textAlign:'center'}}>
          <View style={{ borderRadius: 10, backgroundColor: 'yellow', padding: 25, height:350 }}>
            <Text style={{ fontSize: 20, fontWeight: '200', marginTop:100, color:'#0000ff' }}>Please wait...processing...</Text>
            <ActivityIndicator color="#0000ff" size="large" />
          </View>
        </View>)} 
      </ScrollView>
    );
  }

  renderConfirmationForm = () => {
    return (
      <ScrollView style={{backgroundColor:'#ffffff',backgroundImage:'none'}}>
      {!this.context.loading ? (<View style={styles.container}>
        <View style={{alignItems:'center',textAlign:'center'}}>
          <Text style={styles.pageConfirmationcode}>
            Your email id is not verified yet, Please enter confirmation code sent to your email
          </Text>          
          <TextInput
            name="confirmationCode"
            label="Confirmation code"
            placeholder="Confirmation code"
            style={styles.input}
            multiline={true}
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
          <TouchableHighlight
              style={styles.formButton}
              onPress={this.handleConfirmationSubmit}
              
            >
              <Text style={styles.textStyle}>Verify one time passcode</Text>
          </TouchableHighlight>                  
        </View>
      </View>):(<View style={{alignItems:'center',textAlign:'center'}}>
          <View style={{ borderRadius: 10, backgroundColor: 'yellow', padding: 25, height:350 }}>
            <Text style={{ fontSize: 20, fontWeight: '200', marginTop:100, color:'#0000ff' }}>Please wait...processing...</Text>
            <ActivityIndicator color="#0000ff" size="large" />
          </View>
        </View>)}
      </ScrollView>
    );
  }

  renderNormallogin = (navigation) => {
    //const {authenticated} = this.props.user;
    return (
      <ScrollView style={{backgroundColor:'#ffffff',backgroundImage:'none'}}>
        {!this.context.loading ? (<View style={styles.container}>
          {<View style={{width:200}}>
          <TouchableHighlight
              style={styles.formButton}
              onPress={this.facebooksignin}
              
            >
              <Text style={styles.textStyle}>Sign in with Facebook</Text>
          </TouchableHighlight>            
        </View>}
          <View style={{alignItems:'center',textAlign:'center'}}>
            {<Text style={{alignSelf:'center'}}>
              (or)
            </Text>}           
            <Text style={styles.pageTitle}>
              Login with email
            </Text>
          </View>
          <TextInput
            name="iemail"
            placeholder="email"
            label="iemail"
            style={styles.input}
            multiline={true}
            secureTextEntry={false}
            underlineColorAndroid='transparent'
            onChangeText={(val) => this.handleChange('iemail',val)}
          />
          <TextInput
            name="password"
            placeholder="Password"
            label="Password"
            style={styles.input}
            secureTextEntry={true}
            onChangeText={(val) => this.handleChange('password',val)}
          />
          {this.state.errors.general && (
            <Text style={{color:'red',fontSize:16}}>
                {this.state.errors.general}
            </Text>
          )}
          <View style={{width:200}}>
          <TouchableHighlight
              style={styles.formButton}
              onPress={this.handleSubmit}
            >
              <Text style={styles.textStyle}>Login</Text>
          </TouchableHighlight>            
          </View>
        <Text style={{marginTop:30,alignSelf:'center'}}>
          Don't have an account ? Sign up here
        </Text>
        <View style={{width:200}}>
        <TouchableHighlight
              style={styles.formButton}
              onPress={() => {
                {this.props.navigation.navigate('Signup')}
              }}
            >
              <Text style={styles.textStyle}>New User Signup</Text>
          </TouchableHighlight>          
        </View>          
        <Text style={{marginTop:30}}>Have you forgot password</Text>
        <View style={{width:250}}>
          <TouchableHighlight
              style={styles.formButton}
              onPress={this.passwordresetroutine}
            >
              <Text style={styles.textStyle}>Reset Password</Text>
          </TouchableHighlight>          
        </View>
        </View>):(<View style={{alignItems:'center',textAlign:'center'}}>
          <View style={{ borderRadius: 10, backgroundColor: 'yellow', padding: 25, height:350 }}>
            <Text style={{ fontSize: 20, fontWeight: '200', marginTop:100, color:'#0000ff' }}>Please wait...processing...</Text>
            <ActivityIndicator color="#0000ff" size="large" />
          </View>
        </View>)}
      </ScrollView>
);
  }
  
  render() {
    const { navigation } = this.props;
    return (
      <View>
        {this.state.newUser.userstatus === 'UserNotConfirmedException' ? (this.renderConfirmationForm()) : ( this.state.newUser.userstatus === 'PasswordResetRequiredException' ? (this.passwordresetConfirmationForm()) : (this.renderNormallogin(navigation)))}
      </View>
    );
  }
}

export default withApollo(login);
