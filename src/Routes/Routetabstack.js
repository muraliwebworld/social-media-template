import React, { Component } from 'react';
import { NavigationContainer, c } from '@react-navigation/native';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { DiscussStack, GroupsStack, MembersStack, ImagesStack } from './routeStack';
import { Icon } from 'react-native-elements';
import {MainContext} from '../util/maincontext';
import Loginstack from './Loginstack';
import Addstack from './Addstack';
import Myprofilestack from './Myprofilestack';
//import Discuss from '../pages/discuss';


class Routetabstack extends Component {

    static contextType = MainContext;
    
    constructor(props){
        super(props)
    }

    componentDidMount() {
    }

 
    render() {
    const Tab = createBottomTabNavigator();
    const {authenticated} = this.context;
      //const { authenticated } = this.props.user ? this.props.user : false;

    return (
        authenticated ? (<NavigationContainer>
            <Tab.Navigator initialRouteName="Discuss"
            lazy="false"
            tabBarOptions={{
                tabStyle:{marginBottom:5},
                activeTintColor: '#202661',
                inactiveTintColor:'#ffffff',
                activeBackgroundColor:'wheat',
                style:{backgroundColor:'#202661'}
            }}
            >
                <Tab.Screen name="Discuss" 
                    component={DiscussStack}
                    options={{
                        tabBarLabel: 'Home',
                        tabBarIcon: ({ color }) => (
                          <Icon name="home"
                          color={color}
                          type='material' />
                        ),
                      }}                    
                />

             <Tab.Screen name="Images" 
                    component={ImagesStack}
                    options={{
                        tabBarLabel: 'Images',
                        tabBarIcon: ({ color}) => (
                            <Icon name="image" 
                            color={color}
                            type='material' />
                        ),
                      }}                     
                />                

                <Tab.Screen name="Members" 
                    component={MembersStack}
                    options={{
                        tabBarLabel: 'Members',
                        tabBarIcon: ({ color}) => (
                            <Icon name="group" 
                            color={color}
                            type='material' />
                        ),
                      }}                     
                />


                <Tab.Screen name="Groups" 
                    component={GroupsStack}
                    options={{
                        tabBarLabel: 'Groups',
                        tabBarIcon: ({ color }) => (
                            <Icon name="dashboard" 
                            color={color}
                            type='material' />
                        ),
                      }}
                />
                <Tab.Screen name="Add" 
                      component={Addstack}
                      options={{
                          tabBarLabel: 'Add',
                          tabBarIcon: ({ color }) => (
                              <Icon name="add-circle" 
                              color={color}
                              type='material' />
                          ),
                        }}                     
                        
                />

                <Tab.Screen name="Myprofile" 
                    component={Myprofilestack}
                    options={{
                        tabBarLabel: 'My Profile',
                        tabBarIcon: ({ color }) => (
                            <Icon name="account-circle"
                            color={color} 
                            type='material' />
                        ),
                      }}                     
                    />                 
            </Tab.Navigator>
            </NavigationContainer>):
            (
            <NavigationContainer>
            <Tab.Navigator initialRouteName="Discuss"
            lazy="false"
            tabBarOptions={{
                tabStyle:{marginBottom:5},
                activeTintColor: '#202661',
                inactiveTintColor:'#ffffff',
                activeBackgroundColor:'wheat',
                style:{backgroundColor:'#202661'}
            }}
            >
                <Tab.Screen name="Discuss" 
                    component={DiscussStack}
                    options={{
                        tabBarLabel: 'Home',
                        tabBarIcon: ({ color }) => (
                          <Icon name="home"
                          color={color}
                          type='material' />
                        ),
                      }}                    
                />

               <Tab.Screen name="Images" 
                    component={ImagesStack}
                    options={{
                        tabBarLabel: 'Images',
                        tabBarIcon: ({ color}) => (
                            <Icon name="image" 
                            color={color}
                            type='material' />
                        ),
                      }}                     
                />                

                <Tab.Screen name="Members" 
                    component={MembersStack}
                    options={{
                        tabBarLabel: 'Members',
                        tabBarIcon: ({ color}) => (
                            <Icon name="group" 
                            color={color}
                            type='material' />
                        ),
                      }}                     
                />

                <Tab.Screen name="Groups" 
                    component={GroupsStack}
                    options={{
                        tabBarLabel: 'Groups',
                        tabBarIcon: ({ color }) => (
                            <Icon name="group" 
                            color={color}
                            type='material' />
                        ),
                      }}
                />
                <Tab.Screen name="Login" 
                      component={Loginstack}
                      options={{
                          tabBarLabel: 'Login',
                          tabBarIcon: ({ color }) => (
                              <Icon name="power-settings-new" 
                              color={color}
                              type='material' />
                          ),
                        }}                     
                        
                    />                     
            </Tab.Navigator>
            </NavigationContainer>            )

         
        )
    }
}


export default Routetabstack;