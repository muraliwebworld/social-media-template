import React, { PureComponent } from 'react';
import { Icon } from 'react-native-elements';
import { withApollo } from '@apollo/client/react/hoc';
import {MainContext} from '../../util/maincontext';
import {updateActivity} from '../../graphql';
import { API, graphqlOperation } from 'aws-amplify';

export class LikeButton extends PureComponent {

  static contextType = MainContext;

  _isMounted = false;
  state = {
    likeButtonstatus: false
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.likedbpactivity();
    }
  }

  componentDidUpdate = (prevProps) => {
    this._isMounted = true;
    if((this._isMounted) && this.props.bpactivity.likeids.length !== prevProps.bpactivity.likeids.length){
      this.likedbpactivity();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  likedbpactivity = () => {
    const {
     authenticated,
     profile
   } = this.context;    
  
    if (!this.props.bpactivity.likeids || this.props.bpactivity.likeids === undefined || this.props.bpactivity.likeids.length === 0 || this.props.bpactivity.likeids.length === 0 || !authenticated)
    {
      this.setState({likeButtonstatus:false})
    }
    else
    {
      var currentuserid = profile.id;
      if (
        this.props.bpactivity.likeids.find(
            (bplikeid) => bplikeid === currentuserid
        )
      )
      {
        this.setState({likeButtonstatus:true})
      }
      else
      {
        this.setState({likeButtonstatus:false})
      }

    }

  }      

  likebpactivity = () => {

    var likeidsupdate = [];

    if (this.props.bpactivity.likeids === 'undefined' || this.props.bpactivity.likeids === null){

      likeidsupdate.push(this.context.profile.id);

      const updateActivityInput = { 
      id: this.props.bpactivity.id,
      title:this.props.bpactivity.title,
      content:this.props.bpactivity.content,
      groupID:this.props.bpactivity.groupID,
      authorId:this.props.bpactivity.authorId,
      likeids:likeidsupdate,
      authorName:this.props.bpactivity.authorName,
      authorImage:this.props.bpactivity.authorImage,
      activityImage:this.props.bpactivity.activityImage,
      updatedAt: this.props.bpactivity.updatedAt
      }
      this.updatelikedyndbActivity(updateActivityInput,this.props.bpactivity.updatedAt,this.props.client);
      this.setState({likeButtonstatus:true})
    }
    else
    {
      this.props.bpactivity.likeids.push(this.context.profile.id);
      const updateActivityInput = { 
      id: this.props.bpactivity.id,
      title:this.props.bpactivity.title,
      content:this.props.bpactivity.content,
      groupID:this.props.bpactivity.groupID,
      authorId:this.props.bpactivity.authorId,
      likeids:this.props.bpactivity.likeids,
      authorName:this.props.bpactivity.authorName,
      authorImage:this.props.bpactivity.authorImage,
      activityImage:this.props.bpactivity.activityImage,
      updatedAt: this.props.bpactivity.updatedAt
      }
      this.updatelikedyndbActivity(updateActivityInput); 
      this.setState({likeButtonstatus:true})
  }
  
  updatelikedyndbActivity = (inputData) => async() => {
  
   try {
      await API.graphql(graphqlOperation(updateActivity, {input: inputData}))
   
    } catch (err) {
      console.log(err);
      this.setState({likeButtonstatus:false})
      alert('Sorry!!!....Like update failed... ');
      console.log('Error in updating LIKE');    

    }
  
   }
    
    
  };

  render() {
    let likeButton = this.state.likeButtonstatus ? (
      <Icon
        name='favorite'
        type='material'
      />
    ) : (
      <Icon
        name='favorite-border'
        type='material'
      />
    )
    if (this.context.authenticated){
      likeButton = this.state.likeButtonstatus ? (
        <Icon
          name='favorite'
          type='material'
        />
      ) : (
        <Icon
          name='favorite-border'
          type='material'
          onPress={this.likebpactivity}
        />
      )
    }
       
    return likeButton;
  }
}

export default withApollo(LikeButton);
