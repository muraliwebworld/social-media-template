import React, { Component } from 'react';
import { View, Share,Text, ActivityIndicator,
  TouchableHighlight,  Image } from 'react-native';
import {  Icon } from 'react-native-elements';
import {MainContext} from '../../util/maincontext';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Deletebpactivity from './Deletebpactivity';
import Addactivitycomments from '../../pages/Addactivitycomments';
import LikeButton from './LikeButton';

class bpactivity extends Component {

  static contextType = MainContext;

  _isMounted = false;
  state = { validImage: true,displayComments: false,open: false}



  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  //shouldComponentUpdate() {
  //  return false;
  //}

  showComments = () => {
    //this.props.history.push(`/activity/${postId}/comments`);
    this.setState({displayComments: !this.state.displayComments})
  }

  imagerror = () => {
    if (this._isMounted){
      this.setState({validImage: false})
    }
    //console.log('false')
  }
  onShare = async (content) => {
    try {
      const messageshare = content+ '  - India Cities Forum - Download from playstore '
      const result = await Share.share({
        message: messageshare.toString()
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  render() {
    dayjs.extend(relativeTime);
    const {
       bpactivity: {
        id,
        title,
        content,
        groupID,
        likeids,
        authorId,
        authorName,
        authorImage,
        activityImage
      },
    } = this.props;
    const {
      authenticated,
      profile
    } = this.context;
    const regex = /(<([^>]+)>)/ig;
    const likeidsvariable = likeids ? likeids : []
    if (likeidsvariable === ''){
      likeidsvariable = [];
    }
    const likecount = likeidsvariable ? likeidsvariable.length : 0
    return (
         <View style={{
          marginBottom: 3,
          borderRadius: 0,
          flex: 1,
          //backgroundColor: '#ffffff'
          backgroundColor: this.context.mutateloading && this.context.mutateid === id ? '#cccccc' :'#ffffff' 
          }}>
          <View style={{justifyContent: 'space-between', flex: 7,flexDirection: 'row'}}>
          <TouchableHighlight
                activeOpacity={0.8} 
                underlayColor={'#aaaaaa'}
                style={{flexDirection: 'row',flex:6,alignItems:'flex-start'}}          
                onPress={() => {
                  this.props.navigation.navigate('UserActivities', {
                    userid: authorId,
                    username: authorName
                  });
                }}
              >            
            <View style={{flexDirection: 'row',flex:4,alignItems:'flex-start',padding:10}}>
              <View
              style={{
                height: 40,
                width: 40,
                textAlign: 'left'
              }}>
                <Image 
                source={{ uri:authorImage}} 
                alt="" 
                style={{ height: 40, width: 40, borderRadius: 50, resizeMode: 'cover',flex: 1}}/>
              </View>
              <View style={{
                flex:6,
                fontWeight:'bold',
                fontSize:12,
                //width:'85%',
                wordBreak:'normal',
                textAlign: 'left',
                marginLeft:5,
                marginTop:5             
              }}>
                <Text>@{authorName}</Text>
              </View>
            </View>
            </TouchableHighlight>            
            <View style={{flexDirection: 'row',flex:3,alignItems:'flex-end',padding:0,paddingRight:0}}>
            {(!this.context.mutateloading && this.context.mutateid !== id && authenticated  && profile.id && authorId.toString() === profile.id.toString()) && (<View style={{padding:10,paddingBottom:20,paddingRight:20}}>           
                <Deletebpactivity bpactivityId={id} />
              </View>)}
              { content ? (<View style={{padding:20}}>
                <Icon
                  name='share'
                  type='material'
                  onPress={() => this.onShare(content)}
                />
              </View>):(
                <View style={{padding:20}}>
                <Icon
                  name='share'
                  type='material'
                  onPress={() => this.onShare('')}
                />
              </View>                
              )}        
            </View>
          </View>
          {this.context.mutateloading && this.context.mutateid === id && (
            <View>
              <ActivityIndicator color="#0000ff" size="small" />
            </View>
          )}           
          { content && (<TouchableHighlight
            activeOpacity={0.8} 
            underlayColor={'#aaaaaa'}
            onPress={() => {
              this.props.navigation.navigate('ActivityDetail', {
                bpactivityId: id,
                bpactivity:this.props.bpactivity,
                user:this.context.profile,
                authenticated:this.context.authenticated
              });
            }}
          >
          <View style={{
            padding: 18,
            whiteSpace: 'pre-line',
            overflow: "hidden",
            width: '100%',
            alignItems: 'flex-start',
            borderWidth: 1,
            borderColor: '#ccc'
          }}>
            <Text>{content.replace(regex, '').substring(0,300)+"....."}</Text>
          </View>
          </TouchableHighlight>)}
          {  activityImage !== null && activityImage !== undefined && activityImage !== true && activityImage.length > 0 &&   activityImage !== 'true' && activityImage !== 'null' &&  (
          <TouchableHighlight
          activeOpacity={0.8} 
          underlayColor={'#aaaaaa'}
          style={{ height:300,flex:1, resizeMode: 'cover',flex: 1}}          
          onPress={() => {
            this.props.navigation.navigate('ActivityDetail', {
              bpactivityId: id,
              bpactivity:this.props.bpactivity,
              user:this.context.profile
            });
          }}
        >            
          <Image 
            source={{ uri: activityImage}} alt="" style={{ padding:3,height:300,flex:1, resizeMode: 'cover',flex: 1}}
          />
          </TouchableHighlight>
        )}
          <View style={{justifyContent: 'space-between', flex: 9,flexDirection: 'row'}}>
          <View style={{alignItems: 'flex-start',flex:3,padding:5, textAlign:'center'}}>   
            {<View style={{width:'100%'}}>
              <LikeButton bpactivityId={id} bplikeids={likeids} bpactivity={this.props.bpactivity} />
              <Text style={{textAlign:'center'}}>{likecount}</Text>
        </View>}
          </View>
          <View style={{alignItems: 'flex-start',flex:3,padding:5, textAlign:'center'}}>
            <View style={{width:'100%'}}>
            {!this.state.displayComments && (<Icon
                name='chat'
                type='material'
                onPress={() => this.showComments()}
              />)}
            { this.state.displayComments && (<Icon
                name='speaker-notes-off'
                type='material'
                onPress={() => this.showComments()}
              />)}              
              { !this.state.displayComments && (<Text style={{textAlign:'center'}}>Chat</Text>)}
            { this.state.displayComments && (<Text style={{textAlign:'center'}}>Hide Chat</Text>)}           
            </View>
          </View>
          <TouchableHighlight
            activeOpacity={0.8} 
            underlayColor={'#aaaaaa'}          
            style={{alignItems: 'flex-start',flex:3,padding:5, textAlign:'center'}}
            onPress={() => {
              this.props.navigation.navigate('ActivityDetail', {
                bpactivityId: id,
                bpactivity:this.props.bpactivity,
                user:this.context.profile
              });
            }}
          >         
            <View 
            style={{width:'100%'}}>
              <Icon
                name='open-in-new'
                type='material'
              />
              <Text style={{textAlign:'center'}}>View</Text>              
            </View>
          </TouchableHighlight>           
          </View>
         {<View style={{width:'100%',padding:0,background:'#ffffff'}}>
            { this.state.displayComments && (<View style={{width:'100%',padding:1, textAlign:'center'}}><Text style={{textAlign:'center',fontSize:16,fontWeight:'bold'}}>Chat</Text></View>)}
            { this.state.displayComments && (<View style={{width:'100%',paddingBottom:3, textAlign:'center'}}><Text style={{textAlign:'center',fontSize:10,fontWeight:'normal'}}>{`(scroll down in chat window to enter comment)`}</Text></View>)}
            { this.state.displayComments && (<View style={{width:'100%',paddingBottom:5, textAlign:'center'}}><Addactivitycomments postId={id} authenticated={this.context.authenticated} user={this.context.profile} navigation={this.props.navigation}/></View>)}
          </View>}
        </View>
    );
  }
}


export default  bpactivity;
