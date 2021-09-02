import React, { Component } from 'react';
import Routes from './src/Routes/Routetabstack';
import { withApollo } from '@apollo/client/react/hoc';
import NetInfo from "@react-native-community/netinfo";
import { getDeepLink } from './utilities';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from './src/util/maincontext';



class App extends Component {

  _isMounted = false;

    //This is the method to set the context data.
    setAuthenticated = (authenticated) => {
      this.setState({ authenticated });
    };

    setErrors = (errormessage) => {
      this.setState({errormessage});
    }

    //This is the method to set the context data.
    setProfile = (profile) => {
    this.setState({ profile,loading:false,mutateloading:false,mutateid:'' });
    };


    //This is the method to set the context data.
    setActivities = (activities) => {
      this.setState({ activities,loading:false,mutateloading:false,mutateid:'' });
    };

    setLoading = (loading) => {
      this.setState({ loading });
    };

    setMutateloading = (mutateloading) => {
      this.setState({ mutateloading });
    };

    setMutateid = (mutateid) => {
      this.setState({ mutateid });
    };


    
  
  //Let's declare our main state here, it would be global, and can be shared!
  state = {
    authenticated:false,
    profile: null,
    activities:[],
    loading:false,
    mutateloading:false,
    mutateid:'',
    errormessage: {errors: '', errortype:''},
    setErrors: this.setErrors,
    setAuthenticated: this.setAuthenticated,
    setProfile: this.setProfile,
    setActivities: this.setActivities,
    setLoading: this.setLoading,
    setMutateid: this.setMutateid,
    setMutateloading: this.setMutateloading

  }

  componentDidMount() {
    this._isMounted = true;
      
    if (this._isMounted){
      this.initialstateFunction();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }


  
  initialstateFunction = async() => {

    NetInfo.fetch().then(async(networkState) => {
      // if network available, fetch initial set of queries for activities,images,groups,members list for offline mode
      if (networkState.isConnected){


        let icuserinfo = await AsyncStorage.getItem("ICgetuserinfo");

        if (icuserinfo && icuserinfo !== null) {

          this.setState({authenticated:true,profile: await JSON.parse(icuserinfo)});
          
        }
        else
        {
          this.setState({authenticated:false})
        }
      }  
      else
      {
        this.setState({authenticated:false})
      }      
    
      });   
 

  }
  
  render() {
   
    return (
      <MainContext.Provider value={this.state}>
        <Routes uriPrefix={getDeepLink()}/>
      </MainContext.Provider>
      
    )
  }

}

export default withApollo(App);
