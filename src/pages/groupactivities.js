import React, { PureComponent } from 'react';
import { View, ToastAndroid, Text, FlatList,InteractionManager} from 'react-native';
import StaticGroupProfile from '../components/profile/StaticGroupProfile';
import { withApollo } from '@apollo/client/react/hoc';
import { orderbyupdatedID} from '../graphql';
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

class groupactivities extends PureComponent {

  static contextType = MainContext;

  _isMounted = false;
  _clientsubscribe = '';
  constructor(args) {
    super(args);
    this.state = {
      searchParm: '',
      groupactivities:[],
      loadingactivities: false,
      bpinitial: [],
      is_initiated: false,
      nonetworknodata: false,
      groupprofile: {}
    };

    this.position = 1;
    this.onEndReachedCalledDuringMomentum = true;
    
  }



  _getItemLayout(data, index) {
      return { length: yourItemHeight, offset: yourItemHeight * index, index }
  }



  getActivitys = async(icpagenumber=1,groupid="",groupname='',authenticated=false,clientquery,refresh=false,fetchmore=false) => {
    const ICnextToken = await AsyncStorage.getItem("ICgnextToken");
    this._clientsubscribe = await this.props.client.clientpublic.watchQuery({
      variables: { limit:500,nextToken:ICnextToken,sortDirection: "DESC", sorTid: "activity",filter: {
        or: [{groupID: { eq:this.props.route.params.groupid }},{contentLowercase: {contains:this.props.route.params.groupname.toLowerCase()}}]
      }},
      query: orderbyupdatedID,
      fetchPolicy: 'cache-and-network'
    }).subscribe({     
      next: async({ data }) => {
        await AsyncStorage.setItem("ICgnextToken", '');
        if (data && data.orderbyupdatedIDmadras) {
          if (fetchmore){
            if (data.orderbyupdatedIDmadras.nextToken && data.orderbyupdatedIDmadras.nextToken !== null){
              await AsyncStorage.setItem("ICgnextToken", data.orderbyupdatedIDmadras.nextToken);
            }
            let appenditems = [...this.context.activities, ...data.orderbyupdatedIDmadras.items]
            //this.setState({groupactivities:appenditems});
            this.context.setActivities(appenditems)
          }
          else
          {
            //this.setState({groupactivities:data.orderbyupdatedID.items});
            if (data.orderbyupdatedIDmadras.nextToken && data.orderbyupdatedIDmadras.nextToken !== null){
              await AsyncStorage.setItem("ICgnextToken", data.orderbyupdatedIDmadras.nextToken);
            }
            this.context.setActivities(data.orderbyupdatedIDmadras.items);
          }
        }
        this.context.setLoading(false);        
  
    },
      error: async(e) => {
        console.error(e);
        this.context.setErrors({errors:'Offline group listings will only be displayed after first time in online mode', errortype:'getgroupactivities'});
        this.context.setLoading(false);
      }
    })
    
  }


  fetchMoreData = async() => {
    const ICnextToken = await AsyncStorage.getItem("ICgnextToken");
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
     InteractionManager.runAfterInteractions(async() => {
     //this.focusListener = navigation.addListener("focus", async() => {
        this.context.setLoading(true)
        this.setState({
          groupprofile: { groupImage: this.props.route.params.groupImage,
            groupname:this.props.route.params.groupname,
            groupid:this.props.route.params.groupid,
            groupslug:this.props.route.params.groupslug,
            groupdescription:this.props.route.params.groupdescription }
        });        
        let searchstring = this.props.route.params ? this.props.route.params.searchString:"";
        let clientquery = this.props.client;
        
        NetInfo.fetch().then(async(networkState) => {
          await AsyncStorage.setItem("ICgnextToken", '');
          if (!networkState.isConnected){        
              this.setState({nonetworknodata:true});
              let cachecheck = await AsyncStorage.getItem("getinitialpublic:appsync", "");
              if (cachecheck) {
                this.context.setLoading(true)
                this.getActivitys(1,this.props.route.params.groupid,true,this.context.authenticated,clientquery);
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
            this.getActivitys(1,this.props.route.params.groupid,true,this.context.authenticated,clientquery);
            //this.context.setLoading(false);
          }  
        });
        //setTimeout(() => {
        //  this.setState({'is_initiated': true });
        //}, 0);
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
        await AsyncStorage.setItem("ICgnextToken", "");
        let clientquery = this.props.client;
        this.getActivitys(1,this.props.route.params.groupid,true,this.context.authenticated,clientquery);

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
            this.getActivitys(1,this.props.route.params.groupid,true,this.context.authenticated,this.props.client,false);
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
        this.getActivitys(1,this.props.route.params.groupid,true,this.context.authenticated,this.props.client,true);
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
    
    if (errors && (errortype === 'getgroupactivities')) {
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
        <StaticGroupProfile profile={this.state.groupprofile} />
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
          refreshing={loadinglist}
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

export default withApollo(groupactivities);
