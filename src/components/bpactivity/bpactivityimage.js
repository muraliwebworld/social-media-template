import React, { Component } from 'react';
import { Share, TouchableHighlight,Image } from 'react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';


class bpactivityimage extends Component {

  _isMounted = false;
  state = { validImage: true}

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }


  imagerror = () => {
    if (this._isMounted){
      this.setState({validImage: false})
    }
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
    //console.log(this.props.bpactivity)
    const {
       bpactivity: {
        id,
        title,
        content,
        groupID,
        likeids,
        group,
        authorId,
        authorName,
        authorImage,
        activityImage,
        updatedAt,
        _deleted,        
      }
    } = this.props;

    const regex = /(<([^>]+)>)/ig;
    const likeidsvariable = likeids ? likeids : []
    if (likeidsvariable === ''){
      likeidsvariable = [];
    }
    const likecount = likeidsvariable ? likeidsvariable.length : 0
    return (
        
          activityImage !== null && activityImage !== undefined && activityImage !== true && activityImage.length > 0 &&   activityImage !== 'true' && activityImage !== 'null' ?  (
          <TouchableHighlight
          activeOpacity={0.8} 
          underlayColor={'#aaaaaa'}
          style={{marginLeft:6,width:100,height:100, flex:1,flexDirection:'column',resizeMode:'contain'}}
          onPress={() => {
            this.props.navigation.navigate('ActivityDetail', {
              bpactivityId: id,
              bpactivity:this.props.bpactivity,
              user:this.props.user
            });
          }}
        >            
          <Image 
            source={{ uri: activityImage}} alt="" style={{width:100,height:100, flex:1,resizeMode:'contain'}}
          />
          </TouchableHighlight>
        ):null
    )
  }
}


export default  bpactivityimage;
