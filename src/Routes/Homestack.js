import React, { Component } from 'react';
import { View, Text, Button, Image } from 'react-native';
//import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { DiscussStack, GroupsStack } from './routeStack';
import { Icon } from 'react-native-elements';
//import Discuss from '../pages/discuss';
//import { DrawerActions } from '@react-navigation/native';


class Homestack extends Component {
        
 
    render() {

       const Tab = createBottomTabNavigator();

       /*const stack = createStackNavigator();

       function Profilestack() {
            return (
                <Stack.Navigator>
                    <Stack.Screen name="Profile" 
                        component={ProfileScreen}
                    />
                </Stack.Navigator>
            );        
        }*/

        function ProfileScreen({navigation}) {
            return (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Button onPress={() => navigation.goBack()} title="Go back home" />
              </View>
            );
        } 
        
        /*function Profile1Screen() {
            return (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Button
                  title="Go to Profile"
                />
              </View>
            );
        }        
  
        
        function MyTabs() {
              return (
            <Tab.Navigator>
                <Tab.Screen name="Discuss" component={Profile1Screen} />
                <Tab.Screen name="Profile" component={ProfileScreen} />
            </Tab.Navigator>   
              );
        }*/

        /*const A = ({ navigation }) => {
            const B = (
              <Tab.Navigator>
                <Tab.Screen name="Discuss" component={Discuss} />
                <Tab.Screen name="Settings" component={SettingsScreen} />
              </Tab.Navigator>
            );
            return B;
        }*/
            




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



export default Homestack;