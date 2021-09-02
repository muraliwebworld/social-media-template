import React, { Component } from 'react';
import { View, Share, Text,  Image, TouchableHighlight } from 'react-native';


class group extends Component {


  state = { validImage: true}

  imagerror = () => {
    this.setState({validImage: false})
    //console.log('false')
  }
  onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'React Native | A framework for building native apps using React',
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
    const {
        bpgroup: {
            //avatar_urls, description, name, slug, id
            id,
            name,
            groupslug,
            description,
            groupImage          
        }
    } = this.props;

    //console.log(this.props.bpgroup);
    return (
      <TouchableHighlight
      activeOpacity={0.8} 
      underlayColor={'#aaaaaa'}
        onPress={() => {
          /* 1. Navigate to the Details route with params */
          this.props.navigation.navigate('GroupActivities', {
            groupid: id,
            groupname: name,
            groupslug: groupslug,
            groupImage:groupImage,
            groupdescription:description
          });
        }}        
        style={{
          marginBottom: 3,
          borderRadius: 0,
          flex: 1,
          backgroundColor:'#ffffff'
          }}>
          <View>
          <View style={{justifyContent:'center', flex: 1}}>
              <Text style={{textAlign:'center',fontSize:20,fontWeight:'bold'}}>{name}</Text>
          </View>
          { groupImage && (<Image source={{ uri: groupImage}} alt="" style={{ height:150,width:150,borderRadius: 70,resizeMode: 'cover',alignSelf:'center'}}
          />)}          
          <View style={{
            padding: 18,
            whiteSpace: 'pre-line',
            overflow: "hidden",
            width: '100%',
            alignItems: 'flex-start',
            borderWidth: 1,
            borderColor: '#ccc'
          }}>
            {/* Message */}
            { description && (<Text >{description}</Text>)}
          </View>
          </View>
        </TouchableHighlight>
    );
  }
}

export default  group;
