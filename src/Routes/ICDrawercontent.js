import React, { Component } from 'react';
import { DrawerContentScrollView,DrawerItemList,DrawerItem, } from '@react-navigation/drawer';


class ICDrawerContent extends Component {
    constructor(props){
      super(props)
    }
    
   render() {
    //const { authenticated } = this.props.user ? this.props.user : false;
    //console.log(this.props);
    return (
      <DrawerContentScrollView {...this.props}>
        <DrawerItemList {...this.props} />
          <DrawerItem label="Logout"
          labelStyle={{color:'#ffffff',textAlign:'center'}}
          style={{backgroundColor: '#202661'}} 
          onPress={}
        />
      </DrawerContentScrollView>
    );
  }
}



export default (ICDrawerContent);