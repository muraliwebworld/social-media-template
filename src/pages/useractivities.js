import React, { PureComponent } from 'react';
import { View, ToastAndroid, Text, FlatList,InteractionManager} from 'react-native';
import StaticProfile from '../components/profile/StaticProfile';
import { withApollo } from '@apollo/client/react/hoc';
import { orderbyupdatedID, listUsers} from '../graphql';
import {MainContext} from '../util/maincontext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Bpactivity from '../components/bpactivity/bpactivity';
import NetInfo from "@react-native-community/netinfo";
import { Icon } from 'react-native-elements';
import 'react-native-get-random-values';
import uuidv4 from 'uuidv4';

const VIEWABILITY_CONFIG = {
  //minimumViewTime: 100,
  waitForInteraction: true,
  // At least one of the viewAreaCoveragePercentThreshold or itemVisiblePercentThreshold is required.
  viewAreaCoveragePercentThreshold: 25,
  itemVisiblePercentThreshold: 25
}

const yourItemHeight = 0;

class useractivities extends PureComponent {

  static contextType = MainContext;

  _isMounted = false;
  _clientsubscribe = '';
  constructor(args) {
    super(args);
    this.state = {
      searchParm: '',
      useractivities:[],
      loadingactivities: false,
      bpinitial: [],
      is_initiated: false,
      nonetworknodata: false,
      userprofile: {}
    };

    this.position = 1;
    this.onEndReachedCalledDuringMomentum = true;
    
  }



  _getItemLayout(data, index) {
      return { length: yourItemHeight, offset: yourItemHeight * index, index }
  }

  getUser = async(icpagenumber=1,username="",loadingstatus=false,authenticated=false,clientquery,refresh=false) => {
    await this.props.client.clientpublic.watchQuery({
      variables: { limit: 5000,filter: {
        username: { contains:username }
      }},
      query: listUsers,
      fetchPolicy: 'cache-and-network'
    }).subscribe({     
      next: ({ data }) => { 
        if (data && data.listUsermadrass.items.length > 0) {
          //console.log(data.listUsermadrass)
          //console.log(username)
          this.setState({userprofile:data.listUsermadrass.items[0]});
        }
        this.context.setLoading(false);        
  
    },
      error: (e) => {
        console.error(e);
        this.context.setErrors({errors:'user not available', errortype:'getuser'});
        this.context.setLoading(false);
      }
    })
    
  }  

  getActivitys = async(icpagenumber=1,username="",loadingstatus=false,authenticated=false,clientquery,refresh=false,fetchmore=false) => {
    const ICnextToken = await AsyncStorage.getItem("ICunextToken");
    this._clientsubscribe = await this.props.client.clientpublic.watchQuery({
      variables: { limit:500,nextToken:ICnextToken,sortDirection: "DESC", sorTid: "activity",filter: {
        authorName: { eq:username }
      }},
      query: orderbyupdatedID,
      fetchPolicy: 'cache-and-network'
    }).subscribe({     
      next: async({ data }) => { 
        if (data && data.orderbyupdatedIDmadras) {
          if (fetchmore){
            if (data.orderbyupdatedIDmadras.nextToken && data.orderbyupdatedIDmadras.nextToken !== null){
              await AsyncStorage.setItem("ICunextToken", data.orderbyupdatedIDmadras.nextToken);
            }
            else
            {
              await AsyncStorage.setItem("ICunextToken", '');
            }
            let appenditems = [...this.context.activities, ...data.orderbyupdatedIDmadras.items]
            //this.setState({useractivities:appenditems});
            this.context.setActivities(appenditems)
          }
          else
          {
            //this.setState({useractivities:data.orderbyupdatedID.items});
            if (data.orderbyupdatedIDmadras.nextToken  && data.orderbyupdatedIDmadras.nextToken !== null){
              await AsyncStorage.setItem("ICunextToken", data.orderbyupdatedIDmadras.nextToken);            
            }
            else
            {
              await AsyncStorage.setItem("ICunextToken", '');
            }
            this.context.setActivities(data.orderbyupdatedIDmadras.items);
          }
        }
        this.context.setLoading(false);        
  
    },
      error: async(e) => {
        console.error(e);
        this.context.setErrors({errors:'Offline user listings will only be displayed after first time in online mode', errortype:'getuseractivities'});
        this.context.setLoading(false);
      }
    })
    
  }


  fetchMoreData = async() => {
    const ICnextToken = await AsyncStorage.getItem("ICunextToken");
    if (ICnextToken !== null && ICnextToken !== 'null' && ICnextToken !== undefined){
      let searchstring = this.props.route.params ? this.props.route.params.searchString:"";
      this.position = this.position + 1;
      let clientquery = this.props.client;
      if (this.position > 1){
        this.context.setLoading(true)
        await this.getActivitys(this.position,this.props.route.params.username,false,this.context.authenticated,clientquery,false,true);
      }
    }

  };


  componentDidMount() {
    this._isMounted = true;
    const { navigation } = this.props;
    if (this._isMounted){
      InteractionManager.runAfterInteractions(() => {
     //this.focusListener = navigation.addListener("focus", async() => {
        this.context.setLoading(true)
        let searchstring = this.props.route.params ? this.props.route.params.searchString:"";
        let clientquery = this.props.client;
        
        NetInfo.fetch().then(async(networkState) => {
          await AsyncStorage.setItem("ICunextToken", '');
          if (!networkState.isConnected){        
              this.setState({nonetworknodata:true});
              let cachecheck = await AsyncStorage.getItem("getinitialpublic:appsync", "");
              if (cachecheck) {
                this.context.setLoading(true)
                await this.getUser(this.position,this.props.route.params.username,false,this.context.authenticated,clientquery);
                this.getActivitys(1,this.props.route.params.username,true,this.context.authenticated,clientquery);
              }
              else
              {
                this.context.setLoading(false)
              }
          }
          else
          {
            this.context.setLoading(true)
            this.setState({nonetworknodata:false})
            await this.getUser(this.position,this.props.route.params.username,false,this.context.authenticated,clientquery);
            this.getActivitys(1,this.props.route.params.username,true,this.context.authenticated,clientquery);
            //this.context.setLoading(false);
          }  
        });
        setTimeout(() => {
          this.setState({'is_initiated': true });
        }, 0);
      });
    }    
  }



  componentDidUpdate = async(prevProps) => {
    //const { authenticated } = this.props.user;
    if((this.props.route.params !== prevProps.route.params && this.props.route.params !== undefined) ) {
      // fetch the new product based and set it to the state of the component
      //console.log("update");
      this._isMounted = true;
      
      if (this._isMounted){
        const { navigation } = this.props;
        this.context.setLoading(true)
        //console.log("update");
        let searchstring = this.props.route.params ? this.props.route.params.searchString:"";
        await AsyncStorage.setItem("ICunextToken", "");
        let clientquery = this.props.client;
        await this.getUser(this.position,this.props.route.params.username,false,this.context.authenticated,clientquery);
        this.getActivitys(1,this.props.route.params.username,true,this.context.authenticated,clientquery);

      }
    }
  }


  componentWillUnmount() {
    this._clientsubscribe.unsubscribe();
    this._isMounted = false;
  }


  onListrefresh = () => {
    //console.log('refresh')
    ToastAndroid.showWithGravityAndOffset(
      'Refreshing',
      ToastAndroid.LONG,
      ToastAndroid.TOP,
      25,
      50
    );
    
    NetInfo.fetch().then(async(networkState) => {
      if (!networkState.isConnected){        
          this.setState({nonetworknodata:true})
          if (await AsyncStorage.getItem("getinitialpublic:appsync", "")) {
            this.context.setLoading(true)
            this.getActivitys(1,this.props.route.params.username,true,this.context.authenticated,this.props.client,false);
          }
          else
          {
            this.context.setLoading(false)
          }          
          
      }
      else
      {
        this.context.setLoading(true)
        this.setState({nonetworknodata:false})
        this.getActivitys(1,this.props.route.params.username,true,this.context.authenticated,this.props.client,true);
      }
    });     
    
  }
  
  handleListEnd = () => {
    this.fetchMoreData(); 
  }

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


    //const { bpdynbactivities, loading } = this.props.data;
    const { navigation } = this.props;
    //const { errors, errortype} = this.props.ui;

    const { loading, errors, errortype } = this.context

    let loadinglist = false;
    if (loading || this.context.activities.length === 0){
      loadinglist = true;
    }

    var ichasmore = false;
    if (this.context.activities.length > 0){
      ichasmore = true;
    }
    
    if (errors && (errortype === 'useractivities' || errortype === 'getuser'|| errortype === 'deleteactivity' || errortype === 'likeactivity')) {
      this.showToastWithGravityAndOffset(errors);
    }


    const footerLoading = (this.context.activities.length === 0) && (<View style={{ backgroundColor:'#ffffff',marginTop:1, marginBottom:2,alignItems:'center' }}><Text style={{textAlign:'center',fontSize:16,fontWeight:'bold',marginLeft:5}}>Loading...Please wait...</Text></View>)
    const recentbpactivitiesMarkup = ({ item }) => { 
      return (
        <Bpactivity bpactivity={item} user={this.context.profile} navigation={navigation} />
      )
    }
    return (
      <View style={{ fontSize: '16px', fontWeight:'bold', flex:1,paddingBottom:0, marginBottom:0, paddingLeft:0, paddingRight:0,backgroundColor:'#999FD3' }}>
        {(this.state.userprofile) ? <StaticProfile profile={this.state.userprofile} /> : null}
        <FlatList
          style={{flex:1}}
          data={this.context.activities}
          keyExtractor={(item) => item ? (item.id.toString()):uuidv4()}
          renderItem={recentbpactivitiesMarkup}
          extraData={this.context.activities}
          removeClippedSubviews={true}
          getItemLayout={this._getItemLayout}
          viewabilityConfig={VIEWABILITY_CONFIG}
          onRefresh={this.onListrefresh}
          refreshing={loading}
          onMomentumScrollBegin = {() => {this.onEndReachedCalledDuringMomentum = false;}}
          onEndReached={() => {
            if (!this.onEndReachedCalledDuringMomentum) {
              this.fetchMoreData();    // LOAD MORE DATA
              this.onEndReachedCalledDuringMomentum = true;
            }
          }}
          onEndReachedThreshold={0.5}
          initialNumToRender={30}
          ListFooterComponent={footerLoading}
        />
        { this.state.nonetworknodata && !loading  && (<View style={{ backgroundColor:'#ffffff',marginTop:50, marginBottom:2,alignItems:'center' }}>
          <Text style={{textAlign:'center',fontSize:16,fontWeight:'bold',marginLeft:5}}>
            No offline data available. Connect to internet atleast for one time to store pages for offline mode
          </Text></View>)}
	  </View>
    );
 
  }
}

export default withApollo(useractivities);
