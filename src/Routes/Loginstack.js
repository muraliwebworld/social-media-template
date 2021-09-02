import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View,Image } from 'react-native';
import Loginscreen from '../pages/login';
import Signupscreen from '../pages/signup';
import Myprofilescreen from '../components/profile/Profile';

class Loginstack extends Component {

    render() {
        

        const Stack = createStackNavigator();

        //const { authenticated } = this.props.user;
        //console.log(authenticated)
        const LogoTitle = (props) => {
            
            return (
                <View style={{flex:12,flexDirection:'row',justifyContent:'center'}}>
                {/*<View style={{flex:1,marginTop:15,alignItems:'flex-end',marginLeft:5}}>
                    <Icon
                        style={{marginLeft:10,flex:1}}
                        name='dehaze'
                        type='material'
                        onPress={() =>  props.navigation.dispatch(DrawerActions.toggleDrawer())}
                    />
                </View>*/}
                <View style={{flex:12}}>
                    <Image
                        style={{height:44,alignSelf:'center'}}
                        source={require('../../Assets/Images/indiacities_logo_app.png')}
                    />
                </View>                        
            </View>
            );
        }        

        return (

            <Stack.Navigator 
                initialRouteName="Login"
                screenOptions={({navigation}) => ({
                    title: null,
                    headerTitle: () => <LogoTitle navigation={navigation}  />,
                })}                    
            >
            <Stack.Screen name="Login" 
                component={Loginscreen}
            />

            <Stack.Screen name="Myprofile" 
                component={Myprofilescreen}
            />            

            <Stack.Screen name="Signup" 
                component={Signupscreen}
            />
 
             </Stack.Navigator>
         
        )
    }
}



export default Loginstack;