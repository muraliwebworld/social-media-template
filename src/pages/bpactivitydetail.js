import React, { Component } from 'react';
import { View, Share, Text, Image,ActivityIndicator,ScrollView,InteractionManager } from 'react-native';
import { withApollo } from '@apollo/client/react/hoc';
import { Icon } from 'react-native-elements';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Deletebpactivity from '../components/bpactivity/Deletebpactivity';
import LikeButton from '../components/bpactivity/LikeButton';
import Addactivitycomments from '../pages/Addactivitycomments';


class bpactivitydetail extends Component {

  state = { validImage: true, bpactivity: {}, user:{},is_initiated: false,displayComments: false,open: false}

  componentDidMount() {
    
    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        this.setState({'is_initiated': true });
        //console.log(this.props.data.bpgroups);
      }, 0);
    });
  }

  showComments = () => {
    //this.props.history.push(`/activity/${postId}/comments`);
    this.setState({displayComments: !this.state.displayComments})
  }

  imagerror = () => {
    this.setState({validImage: false})
    console.log('false')
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

    const bpactivity = this.props.route.params.bpactivity
    const user = this.props.route.params.user

    const deleteButton =
    this.props.route.params.authenticated  && bpactivity.authorId === user.id ? (
      <Deletebpactivity bpactivityId={bpactivity.id} client={this.props.client} />
    ) : null;

    if (this.state.is_initiated) {
    return (
      <View style={{marginBottom: 3,borderRadius: 0,flex: 1,backgroundColor:'#ffffff'}}>
          <ScrollView style={{marginBottom: 1,borderRadius: 0,backgroundColor:'#ffffff',height:this.state.displayComments ? 50 : 380 }}>
          <View style={{flex: 1,backgroundColor:'#ffffff'}}>
          <View style={{justifyContent: 'space-between', flex: 9,flexDirection: 'row',margin:1}}>
            <View style={{alignItems:'flex-start',flexDirection:'row',flex:5}}>
              <View style={{
                height: 40,
                width: 40,
                textAlign: 'left',
                alignItems:'flex-start',
                flexDirection:'row',
                flex:1,
                //flexDirection: 'row',flex:1
              }}>
                <Image source={{ uri:bpactivity.authorImage}} alt="" style={{ height: 40, width: 40, borderRadius: 50, resizeMode: 'cover'}}/>
              </View>
              <View style={{
                fontWeight:'bold',
                fontSize:12,
                flex:2,
                //width:'85%',
                alignItems:'flex-start',
                flexDirection:'row',
                wordBreak:'normal',
                textAlign: 'left',
                marginLeft:0,
                marginTop:5             
              }}>
                <Text>@{bpactivity.authorName}</Text>
              </View>
            </View>
            <View style={{alignItems:'flex-start',flexDirection:'row',flex:4}}>
              <View style={{padding:5,paddingBottom:20,paddingRight:20,alignItems:'flex-end',flexDirection:'row',flex:4}}>           
                {deleteButton}
              </View>
              { bpactivity.content ? (<View style={{padding:5,alignItems:'flex-end',flexDirection:'row',flex:1}}>
                <Icon
                  name='share'
                  type='material'
                  onPress={() => this.onShare(bpactivity.content)}
                />
              </View>):(
                <View style={{padding:5,alignItems:'flex-end',flexDirection:'row',flex:1}}>
                <Icon
                  name='share'
                  type='material'
                  onPress={() => this.onShare('')}
                />
              </View>                
              ) }             
            </View>             
          </View>
          
          <View style={{
            padding: 18,
            whiteSpace: 'pre-line',
            overflow: "hidden",
            borderWidth: 1,
            borderColor: '#ccc',
            margin:5
          }}>
            {/* Message */}
            { bpactivity.content && (<Text >{bpactivity.content}</Text>)}
          </View>
          { bpactivity.activityImage && (<Image 
            onError={() => this.imagerror()} source={{ uri: this.state.validImage? bpactivity.activityImage : null}} alt="" style={{ padding:3,height:300,
              resizeMode: 'cover'}}
          />)}
          <View>
          </View>
          </View></ScrollView>
          <View style={{background:'#ffffff',height:70}}>
          <View style={{justifyContent: 'space-between', flex: 6,flexDirection:'row',padding:0,background:'#ffffff'}}>
          <View style={{alignItems: 'flex-start',flex:3,flexDirection:'row',padding:5, textAlign:'center'}}>
            <View style={{width:'100%'}}>
              <LikeButton bpactivityId={bpactivity.id} bplikeids={bpactivity.likeids} bpactivity={bpactivity} />
              <Text style={{textAlign:'center'}}>Like {bpactivity.likecount}</Text>
            </View>
          </View>
          <View style={{alignItems: 'flex-start',flex:3,flexDirection:'row',padding:5, textAlign:'center'}}>
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
          </View>
          </View>
          <View style={{marginBottom: 1,borderRadius: 0,backgroundColor:'#ffffff',flex:8}}>
            { this.state.displayComments && (<View style={{flex:9,width:'100%',paddingBottom:3, textAlign:'center',}}><Addactivitycomments postId={bpactivity.id} navigation={this.props.navigation}/></View>)}
          </View>        
          {<View style={{width:'100%',alignItems: 'flex-end'}}><Text style={{fontSize:10,padding:5}}>posted on {dayjs(bpactivity.date).format('DD-MMM-YYYY')}</Text></View>}
        </View>
        );
              }
              else
              {
                return (
                  <ActivityIndicator color="#0000ff" size="large" />
                );
              }
  }
}

export default  withApollo(bpactivitydetail);
