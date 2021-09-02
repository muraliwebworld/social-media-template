import React, { Component } from 'react';
import Routes from './src/Routes/Routetabstack';
import { gql } from '@apollo/client';
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
    /* setGroupprofile = (groupprofile) => {
      this.setState({ groupprofile });
    };
    setStaticprofile = (staticprofile) => {
     this.setState({ staticprofile });
    };*/  

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

  /*setGroups = (groups) => {
    this.setState({ groups });
  };

  setMembers = (members) => {
    this.setState({ members });
  };

  setImageactivities = (imageactivities) => {
    this.setState({ imageactivities });
  };

  setGroupactivities = (groupactivities) => {
    this.setState({ groupactivities });
  };

  setUseractivities = (useractivities) => {
    this.setState({ useractivities });
  };*/
    
  
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
    /*staticprofile:null,
    groupprofile:null,
    groups:{},
    members:{},
    imageactivities:{},
    groupactivities:{},
    useractivities:{},
    setGroupprofile: this.setGroupprofile,
    setStaticprofile:this.setStaticprofile,
    setGroups: this.setGroups,
    setMembers: this.setMembers,
    setImageactivities: this.setImageactivities,
    setGroupactivities: this.setGroupactivities,
    setUseractivities: this.setUseractivities,*/
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

        /*this.props.client.clientpublic.watchQuery({
          variables: { limit:5,sortDirection: "DESC", sorTid: "activity",filter: {
            and: [{contentLowercase: { contains:'' }}]
          }},
          query: gql( `
          query OrderbyupdatedID(
            $sorTid: ID
            $limit: Int
            $filter: ModelActivityFilterInput
            $sortDirection: ModelSortDirection
          ) {
            orderbyupdatedID(
              sorTid: $sorTid
              limit: $limit
              filter:$filter
              sortDirection: $sortDirection
              ) {
              items {
                id
                sorTid
                slug
                title
                content
                contentLowercase
                groupID
                likeids
                authorId
                authorName
                authorImage
                activityImage
                createdAt
                updatedAt
                userdetails {
                  id
                  username
                  useravatar
                  bio
                  website
                  location
                  activityidlikes
                  createdAt
                  updatedAt
                }
             
              }

              nextToken
            }
          }
          `
          ),
          fetchPolicy: 'cache-and-network'
        }).subscribe((result)=> {
          if (result.data && result.data.orderbyupdatedID) {
            this.setState({activities:result.data.orderbyupdatedID.items})
          }          
        })  */             

        /*this.props.client.clientpublic.query({
          variables: { limit:5,sortDirection: "DESC", sorTid: "activity",filter: {
            and: [{contentLowercase: { contains:'' }}]
          }},
          query: gql( `
          query OrderbyupdatedID(
            $sorTid: ID
            $limit: Int
            $filter: ModelActivityFilterInput
            $sortDirection: ModelSortDirection
          ) {
            orderbyupdatedID(
              sorTid: $sorTid
              limit: $limit
              filter:$filter
              sortDirection: $sortDirection
              ) {
              items {
                id
                sorTid
                slug
                title
                content
                contentLowercase
                groupID
                likeids
                authorId
                authorName
                authorImage
                activityImage
                createdAt
                updatedAt
                userdetails {
                  id
                  username
                  useravatar
                  bio
                  website
                  location
                  activityidlikes
                  createdAt
                  updatedAt
                }
             
              }

              nextToken
            }
          }
          `
          ),
        }).then(async(result) => {
         
          result.data.orderbyupdatedID.items.map((bpactivity) => {console.log(bpactivity.content.substring(0,50))})
       
        })
        .catch(async (err) => {
          console.log('Get activities ',err);    
        });  */      

        /*this.props.client.clientpublic.query({
          variables: { filter: {
            and: [{username: { contains:'' }}]
          } },
          query: gql `
            query listUsers(
              $filter: ModelUserFilterInput
              $limit: Int
              $nextToken: String
            ) {
              listUsers(
              filter: $filter
              limit: $limit
              nextToken: $nextToken
            ) {
              items {
                id
                username
                useravatar
                bio
                website
                location
                createdAt
                updatedAt
              }
              nextToken
            }
          }
        `,fetchPolicy: 'network-only'
        }).then(async(result) => {
          if (result.data.listUsers.nextToken === null){
            result.data.listUsers.nextToken = '';
          }
          await AsyncStorage.setItem("ICnextTokenusers", result.data.listUsers.nextToken);
          await store.dispatch({
           icuserlistpagenumber: 1,
            type: SET_MEMBERS,
            payload: result
          });
          await store.dispatch({ type: CLEAR_ERRORS });        
        })
        .catch(async (err) => {
          console.log('error:',err); 
        });
    
    
    
    
        this.props.client.clientpublic.query({
          variables: { limit: 100, sortDirection: "DESC", sorTid: "activity",filter: {
            and: [{activityImage: { contains:'indiacities.in' }}]
          } },
          query: gql `
            query orderbyupdatedId(
              $sorTid: ID
              $limit: Int
              $sortDirection: ModelSortDirection
              $filter: ModelActivityFilterInput
            ) {
              orderbyupdatedID(
                sorTid: $sorTid
                limit: $limit
                sortDirection: $sortDirection
                filter: $filter
                ) {
                items {
                  id
                  sorTid
                  title
                  slug
                  content
                  groupID
                  likeids
                  authorId
                  authorName
                  authorImage
                  activityImage
                  createdAt
                  updatedAt
                }
                nextToken
              }
            }      
            `,fetchPolicy: 'network-only'
          }).then(async(result) => {
            //console.log(result);
            //Cookie.set("ICnextToken", result.data.orderbyupdatedID.nextToken);
            if (result.data.orderbyupdatedID.nextToken === null){
              result.data.orderbyupdatedID.nextToken = '';
            }        
            await AsyncStorage.setItem("ICnextTokenimages", result.data.orderbyupdatedID.nextToken);
            await store.dispatch({
              icpagenumber: 1,
              type: SET_BPDYNDBIMAGEACTIVITIES,
              payload: result
            });
            await store.dispatch({ type: CLEAR_ERRORS });
          })
          .catch(async (err) => {
            console.log('error:',err);   
          });    
    
    
         this.props.client.clientpublic.query({
            query: gql `
              query listGroups(
              $filter: ModelGroupFilterInput
              $limit: Int
              $nextToken: String
            ) {
              listGroups(
                filter: $filter
                limit: $limit
                nextToken: $nextToken
                ) {
                items {
                  id
                  name
                  groupslug
                  description
                  groupImage
                }
                nextToken
            }
          }
          `,fetchPolicy: 'network-only'
        }).then(async(result) => {
           await store.dispatch({
            type: SET_BPDYNDBGROUPS,
            payload: result
          });
          await store.dispatch({ type: CLEAR_ERRORS });          
        })
        .catch(async (err) => {
          console.log('error:',err);    
        }); */
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
