import React, { Component } from 'react';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { DiscussStack, GroupsStack } from './routeStack';
import { Icon } from 'react-native-elements';



class Imagestack extends Component {
        
 
    render() {

       const Tab = createBottomTabNavigator();

        return (
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
                        tabBarIcon: ({ color }) => (
                            <Icon name="image"
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
         
            </Tab.Navigator>

         
        )
    }
}



export default Imagestack;