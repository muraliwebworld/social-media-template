import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator} from '@react-navigation/drawer';
import Homestack from './Homestack';
import Imagestack from './Imagestack';
import Groupstack from './Groupstack';
import ICDrawerContent from './ICDrawercontent';
import Loginstack from './Loginstack';
import Addstack from './Addstack';
import Myprofilestack from './Myprofilestack';
import MemberslistStack from './MemberslistStack';




class Routes extends Component {
    constructor(props){
        super(props)
    }

    render() {
        
        const { authenticated } = this.props.user ? this.props.user : false;
        //console.log(this.props.navigation)       
        const Drawer = createDrawerNavigator();
        return (
            !authenticated ? (<NavigationContainer>
                <Drawer.Navigator>
                    <Drawer.Screen name="Home" component={Homestack} />
                    <Drawer.Screen name="Images" component={Imagestack} />
                    <Drawer.Screen name="Groups" component={Groupstack} />
                    <Drawer.Screen name="Login" component={Loginstack} />
                </Drawer.Navigator>
            </NavigationContainer>) : (
                <NavigationContainer>
                    <Drawer.Navigator drawerContent={props => <ICDrawerContent {...props}/>}>
                        <Drawer.Screen name="Home" component={Homestack} />
                        <Drawer.Screen name="Add" component={Addstack} />
                        <Drawer.Screen name="Images" component={Imagestack} />
                        <Drawer.Screen name="Groups" component={Groupstack} />
                        <Drawer.Screen name="Members" component={MemberslistStack} />
                        <Drawer.Screen name="Myprofile" component={Myprofilestack} />
                    </Drawer.Navigator>
                </NavigationContainer>                
            )
        )
    }
}


export default Routes;

