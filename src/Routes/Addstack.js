import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View,Image } from 'react-native';
import { Icon } from 'react-native-elements';
import Addscreen from '../pages/Postbpactivity';


class Addstack extends Component {

    render() {
        
        const Stack = createStackNavigator();

        //const { authenticated } = this.props.user;
        //console.log(authenticated)
        const LogoTitle = (props) => {
            return (
               <View style={{flex:12,flexDirection:'row',justifyContent:'space-between'}}>
                     {/*<View style={{flex:1,marginTop:15,alignItems:'flex-end',marginLeft:5}}>
                        <Icon
                            style={{marginLeft:10,flex:1}}
                            name='dehaze'
                            type='material'
                            onPress={() =>  props.navigation.dispatch(DrawerActions.toggleDrawer())}
                        />
                    </View>*/}
                    <View style={{flex:11}}>
                         <Image
                            style={{height:44,marginLeft:10,flex:1}}
                            source={require('../../Assets/Images/indiacities_logo_app.png')}
                        />
                    </View>                        
                </View>
            );
        }        

        return (

            <Stack.Navigator 
                initialRouteName="Add"
                screenOptions={({navigation}) => ({
                    title: null,
                    headerTitle: () => <LogoTitle navigation={navigation}  />,
                })}                    
            >
                <Stack.Screen name="Add" 
                    component={Addscreen}
                />

             </Stack.Navigator>
         
        )
    }
}



export default Addstack;