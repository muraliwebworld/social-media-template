import React, { PureComponent } from 'react';
import { Icon } from 'react-native-elements'
import { Alert } from 'react-native';
import { withApollo } from '@apollo/client/react/hoc';
import {MainContext} from '../../util/maincontext';
import {deleteActivity, orderbyupdatedID} from '../../graphql';

class Deletebpactivity extends PureComponent {

  static contextType = MainContext;

  createdeleteButtonAlert = () =>
    Alert.alert(
      "Confirm delete?",
      "Are you sure you want to delete?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: () => this.deletebpactivity(this.props.bpactivityId,1,this.props.client) }
      ],
      { cancelable: false }
    );

deletebpactivity = async(bpactivityid,_version,clientquery) => {
    this.context.setMutateloading(true);
    this.context.setMutateid(bpactivityid);
    const deleteActivityInput = {
      id: bpactivityid
    }
    await clientquery.clientprivate.mutate({
      variables: { input: deleteActivityInput },
      mutation: deleteActivity,
      optimisticResponse: () => ({
        deleteActivitymadras: { ...deleteActivityInput, __typename:'Activity' }
      }),
      /*update: async(datacache, { data: { deleteActivitymadras } }) => {
 
        const query = orderbyupdatedID
        
        const data = datacache.readQuery({ query,
          variables: {limit:30,sortDirection: "DESC", sorTid: "activity",filter: {
           contentLowercase: { contains:'' }
          }}, 
        });
        
      if (data.orderbyupdatedIDmadras && deleteActivitymadras.id){
        data.orderbyupdatedIDmadras.items = [
          ...data.orderbyupdatedIDmadras.items.filter(item => item.id !== deleteActivitymadras.id)
          
        ];
 
        datacache.writeQuery({ query, data });

      }
          
     
      }*/        
    })
    .then(async(res) => {
      let activitylist = this.context.activities;
      let index =  activitylist.findIndex(
        (bpactivity) => bpactivity.id === bpactivityid
      );
      activitylist.splice(index, 1);
      this.context.setActivities(activitylist);
      this.context.setMutateid('');
      this.context.setMutateloading(false);
    })
    .catch(async(error) => {
      console.log(error);
      console.log('Error in deleting activity...');    
      this.context.setMutateloading(false);
    })
};
  
  //deletebpactivity = () => {
  //  this.deletebpactivity(this.props.bpactivityId,1,this.props.client);
  //};

  render() {
    return (
          <Icon
            name='delete'
            type='material'
            onPress={this.createdeleteButtonAlert}
          />
    );
  }
}


export default withApollo(Deletebpactivity);
