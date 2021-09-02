import React from 'react';
import { View, Text, Alert,TextInput, StyleSheet,Image, TouchableHighlight, TouchableOpacity,Button, ActivityIndicator,Modal,FlatList } from 'react-native';
import { Icon } from 'react-native-elements';

//import { API, graphqlOperation } from 'aws-amplify';
import { graphql } from 'react-apollo';
import { Auth } from 'aws-amplify'

import AppSyncConfig from '../../aws-exports';
import { createAuthLink, AUTH_TYPE } from 'aws-appsync-auth-link'
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link'

import { ApolloLink } from 'apollo-link'
import {ApolloClient, InMemoryCache} from '@apollo/client'

import compose from 'lodash.flowright';

import { listComments, createComment as CreateComment, onCreateComment, deleteComment as DeleteComment, onDeleteComment} from '../graphql';
import dayjs from 'dayjs';
import 'react-native-get-random-values';
import uuidv4 from 'uuidv4';
import {MainContext} from '../util/maincontext';

class Addactivitycomments extends React.Component {

  static contextType = MainContext;

  _isMounted = false;
  state = {  
    errors: {} ,
    icposts: [],
    commentmessage: '',
    //loggedin: false,
    //modalVisible: false,
    //commentId: null
  }

  componentDidMount = async() => {
    this._isMounted = true;
    const { authenticated } = this.context;
 
    if (this._isMounted)  {

        if (authenticated){

          this.props.subscribeToNewComments();
          this.props.subscribeToDeleteComments();
    
        }
   
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    }


  deleteButtonAlert = (id) => {
  //console.log(id);  
  Alert.alert(
    "Confirm delete?",
    "Are you sure you want to delete?",
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      { text: "OK", onPress: () => this.deleteComment(id) }
    ],
    { cancelable: false }
  );
  }

  deleteComment = (id) => {
    const deletecomment = {
      id: id
    }
    this.props.deleteComment(deletecomment);
  }


  addComment = async() => {
    let commentInput = { 
        id: uuidv4(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        postID:this.props.postId,
        content:this.state.commentmessage,
        authorId:this.props.profile.id,
        authorName:this.props.profile.username,
        authorImage:this.props.profile.useravatar }

    this.props.createComment(commentInput)
    this.setState({commentmessage: ''})
 
  }

  renderDate = (authorName,date) => {
    return(
      <Text style={styles.time}>
        -- by @{authorName} on {dayjs(date).format("DD-MMM-YYYY")}
      </Text>
    );
  }

  render() {
    const { profile, authenticated } = this.props; 
    let { comments } = this.props
    const { postId } = this.props
    return (
      <View style={styles.container}>
      <View style={{width:'100%',padding:1, textAlign:'center',height:50}}><Text style={{textAlign:'center',height:50}}>Chat window</Text></View>        
      <FlatList style={styles.list}
          data={comments}
          keyExtractor= {(item) => {
            return item.id;
          }}
          //ListFooterComponent={footerLoading}
          renderItem={({item}) => {
            //const item = message.item;
          //if (item._version === 1) {
            let inMessage = profile.authenticated ? profile.id !== item.authorId : false;
            let itemStyle = inMessage ? styles.itemIn : styles.itemOut;
            return (
              <View style={[styles.item, itemStyle]}>
                <View style={{flex:1,flexDirection:'row',width:300,margin:10}}>
                  <Image source={{ uri:item.authorImage}} style={styles.profileImageStyle}/>
                  <Text style={[styles.balloon]}>{item.content}</Text>
                  { authenticated && profile.id === item.authorId && ( 
                    <Icon
                    style={{margin:10}}
                      onPress={() => this.deleteButtonAlert(item.id)}
                      name='delete'
                      type='material'
                    />
                  )}
                </View>
                 <View style={{width:300,alignSelf:'flex-end'}}>                 
                  {this.renderDate(item.authorName,item.updatedAt)}
                </View>
              </View>
            )
        }}/>
        { authenticated ? (<View style={styles.footer}>
          <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
                name="commentmessage"
                placeholder="Write a comment/chat message..."
                underlineColorAndroid='transparent'
                onChangeText={(commentmessage) => this.setState({commentmessage})}
                value={this.state.commentmessage}
                />
          </View>
          <TouchableOpacity style={styles.btnSend} onPress={this.addComment}>
            <Icon
              name='send'
              type='material'
              
            />
          </TouchableOpacity>
        </View>
        ) : (
          <TouchableHighlight
          activeOpacity={0.8} 
          underlayColor={'#aaaaaa'}
          style={{flex:1,flexDirection:'column'}}
          onPress={() => {
            this.props.navigation.navigate('Login');
          }}                
        //<TouchableOpacity onPress={() => {this.props.navigation.navigate('Login')}}
          style={{margin:20,padding:10,alignItems:'center',justifyContent:'center',textAlign:'center',backgroundColor:'#202661'}}>
            <Text style={{fontSize:21,alignItems:'center',justifyContent:'center',textAlign:'center',color:'#ffffff'}}>
              Login here to chat/comment
            </Text>
        </TouchableHighlight>)}        
      </View>
    )
  }
}


const styles = StyleSheet.create({

  container:{
    flex:1
  },
  list:{
    paddingHorizontal: 7,
  },
  footer:{
    flexDirection: 'row',
    height:75,
    backgroundColor: '#eeeeee',
    paddingHorizontal:10,
    margin:5,
    padding:5,
  },
  btnSend:{
    backgroundColor:"#00BFFF",
    width:50,
    height:50,
    marginTop:10,
    borderRadius:360,
    alignItems:'center',
    justifyContent:'center',
  },
  iconSend:{
    width:30,
    height:30,
    alignSelf:'center',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius:30,
    borderBottomWidth: 1,
    height:70,
    alignItems:'flex-start',
    flex:1,
    marginRight:10,
  },
  inputs:{
    height:70,
    marginLeft:16,
    borderBottomColor: '#FFFFFF',
    flex:1,
  },
  balloon: {
    marginLeft:10,
    width: 200,
    borderRadius: 20,
    fontSize:16
  },
  itemIn: {
    alignSelf: 'flex-start'
  },
  itemOut: {
    backgroundColor: '#82ccdd',
    alignSelf: 'flex-end'
  },
  time: {
    alignSelf: 'flex-end',
    marginRight: 15,
    marginBottom:5,
    fontSize:10,
    textAlign:'right',
    color:"#808080",
   },
  item: {
    marginVertical: 14,
    width:300,
    backgroundColor:"#dddddd",
    borderRadius:30,
    fontSize:14
  },

  profileImageStyle: {
    height: 30,
    width: 30,
    marginLeft:5,
    paddingLeft:10,
    borderRadius:30,
    resizeMode:'cover',
    maxWidth: '100%',
    maxHeight: '100%',
  },


});



const config = {
  url: AppSyncConfig.aws_appsync_graphqlEndpoint,
  region: AppSyncConfig.aws_appsync_region,
  auth: {
    type: 'API_KEY',
    apiKey:AppSyncConfig.aws_appsync_apiKey,
    jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken()
  }
}

const clientApikey = new ApolloClient({
  link: ApolloLink.from([
    createAuthLink(config),
    createSubscriptionHandshakeLink(config)
  ]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network'
    }
  }
})


const configcognito = {
  url: AppSyncConfig.aws_appsync_graphqlEndpoint,
  region: AppSyncConfig.aws_appsync_region,
  auth: {
    type: AppSyncConfig.aws_appsync_authenticationType,
    jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken()
  }
}


const clientApikeycognito =  new ApolloClient({
  link: ApolloLink.from([
    createAuthLink(configcognito),
    createSubscriptionHandshakeLink(configcognito)
  ]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network'
    }
  }
})


const Addactivitycommentsdata = compose(
  graphql(listComments, {
    options: props => {
      const { postId } = props
      const { authenticated } = props;
      //console.log(postId);
      return {
        variables: { 
          filter: {
            postID: { eq:postId }
          }
        },
        client: authenticated ? clientApikeycognito : clientApikey,
        fetchPolicy: 'cache-and-network'
      }
    },
    props: props => {
      const { postId } = props.ownProps
      let comments = props.data.listCommentmadrass ?
      props.data.listCommentmadrass.items
      : []
      //console.log('post')
      //console.log(postId);
      //console.log(comments);
      return {
        comments,
        data: props.data,
        subscribeToNewComments: params => {
          props.data.subscribeToMore({
            document: onCreateComment,
            variables: { postID:postId
              //filter: {
              //  postID: { eq:postId }
              //}
            },
            updateQuery: (prev, { subscriptionData: { data : { onCreateCommentmadras } } }) => {
              //console.log('tests');
              //console.log(prev);
                //console.log(onCreateComment);
                //let commentArray = prev.listComments ? prev.listComments.items : []
                let commentsArray = {};
                commentsArray = prev.listCommentmadrass.items.filter(m => m.id !== onCreateCommentmadras.id)
                commentsArray = [
                 ...commentsArray,
                  onCreateCommentmadras,
                ]
                if (prev.listCommentmadrass) {
                  return {
                    ...prev,
                    listCommentmadrass: {...prev.listCommentmadrass, items: commentsArray}
                  }
                }
            }
          })
        },
        subscribeToDeleteComments: params => {
          props.data.subscribeToMore({
            document: onDeleteComment,
            variables: { postID:postId
              //filter: {
              //  postID: { eq:postId }
              //}
            },
            updateQuery: (prev, { subscriptionData: { data : { onDeleteCommentmadras } } }) => {
                let commentsArray = prev.listCommentmadrass.items.filter(m => m.id !== onDeleteCommentmadras.id)
                if (prev.listCommentmadrass) {
                  return {
                    ...prev,
                    listCommentmadrass: {...prev.listCommentmadrass, items: commentsArray}
                  }
                }
            }
          })
        },        
      }
    }
  }),
  graphql(CreateComment, {
    options: (props) => {
      const { postId } = props
      const { authenticated } = props
      return {
        client: clientApikeycognito,
        update: (dataProxy, { data: { createCommentmadras } }) => {
          //console.log(createComment);
          const query = listComments
          const data = dataProxy.readQuery({ query,
            variables: { 
            filter: {
              postID: { eq:postId }
            }
          } })
          //console.log(dataProxy)
          data.listCommentmadrass.items = data.listCommentmadrass.items.filter(m => m.id !== createCommentmadras.id)
          
          //console.log(createCommentupdate);

          data.listCommentmadrass.items.push(createCommentmadras)

          dataProxy.writeQuery({ query, data, variables: { filter: {postID: { eq:postId }}} })
          
        }
      }
    },
    props: (props) => ({
      createCommentmadras: comment => {
        //console.log(comment);
        props.mutate({
          variables: comment,
          optimisticResponse: {
            createCommentmadras: { ...comment, __typename: 'Comment' }
          }
        })
        //console.log(createComment);
      }
    }),
  }),
  graphql(DeleteComment, {
    options: (props) => {
      const { postId } = props
      //console.log(postId);
      return {
        client: clientApikeycognito,
        update: (dataProxy, { data: { deleteCommentmadras } }) => {
          //console.log(createComment);
          const query = listCommentmadrass
          const data = dataProxy.readQuery({ query,variables: { 
            filter: {
              postID: { eq:postId }
            }
          } })
          
          data.listCommentmadrass.items = data.listCommentmadrass.items.filter(m => m.id !== deleteCommentmadras.id)
          
          //data.listComments.items.push(deleteComment)

          dataProxy.writeQuery({ query, data, variables: { filter: {postID: { eq:postId }}} })
          //this.setState({dialogOpen:false})
        }
      }
    },
    props: (props) => ({
      deleteCommentmadras: deletecomment => {
        //console.log(comment);
        props.mutate({
          variables: deletecomment,
          optimisticResponse: {
            deleteCommentmadras: { ...deletecomment, __typename: 'Comment' }
          }
        })
        //console.log(createComment);
      }
    }),
  }),  
)(Addactivitycomments)


export default (Addactivitycommentsdata);