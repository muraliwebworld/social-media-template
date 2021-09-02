import React, { Component } from 'react';
import { View, Text, Button, Image } from 'react-native';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { DiscussStack, MembersStack, GroupsStack } from './routeStack';
import { Icon } from 'react-native-elements';

class MemberslistStack extends Component {
        
 
    render() {

       const Tab = createBottomTabNavigator();

        function ProfileScreen({navigation}) {
            return (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Button onPress={() => navigation.goBack()} title="Go back home" />
              </View>
            );
        } 
        

        return (
            <Tab.Navigator initialRouteName="Members"
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


                <Tab.Screen name="Members" 
                    component={MembersStack}
                    options={{
                        tabBarLabel: 'Members',
                        tabBarIcon: ({ color }) => (
                            <Icon name="mood" 
                            color={color}
                            type='material' />
                        ),
                      }}                     
                /> 
                                        

            </Tab.Navigator>
         
        )
    }
}



export default MemberslistStack;