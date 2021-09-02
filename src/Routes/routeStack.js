import React, { useState } from 'react';
import Discuss from '../pages/discuss';
import GroupActivities from '../pages/groupactivities';
import ImageActivities from '../pages/imageactivities';
import UserActivities from '../pages/useractivities';
import ActivityDetail from '../pages/bpactivitydetail';
import Addactivitycommentsdata from '../pages/Addactivitycomments';
import Membersscreen from '../pages/members';
import MemberActivities from '../pages/useractivities';
import Groups from '../pages/groups';
import Addscreen from '../pages/Postbpactivity';
import Loginstack from './Loginstack';
import { createStackNavigator } from '@react-navigation/stack';
import { View,Image,TextInput } from 'react-native';
import { Icon } from 'react-native-elements';




const LogoTitle = (props) => {
    const [Searchbar, setSearchbar] = useState(false);

    const [Searchstring, setSearchstring] = useState("");
    
    //const displaySearchbar = () => {
    //    setSearchbar(true);
    //}

    const hideSearchbar = () => {
        setSearchstring("");
        setSearchbar(false);
        props.navigation.navigate("Discuss", {
            searchString: "",
          })
    }

    //console.log(Searchbar);
    if (!Searchbar) {
        return (
            <View style={{flex:12,flexDirection:'row',alignItems:'flex-start',marginBottom:0}}>
                {/*<View style={{flex:1,marginTop:10,alignItems:'center'}}>
                    <Icon
                        style={{flex:1}}
                        name='dehaze'
                        type='material'
                        onPress={() =>  props.navigation.dispatch(DrawerActions.toggleDrawer())}
                    />
                </View>*/}
                <View style={{flex:12,alignItems:'center'}}>
                    <Image
                        style={{height:42}}
                        source={require('../../Assets/Images/indiacities_logo_app.png')}
                    />
                </View>                        
                <View style={{marginTop:12,flex:1,alignItems:'flex-end',marginBottom:0}}>
                    <Icon
                        style={{marginLeft:5,flex:1,marginBottom:0}}
                        name='search'
                        type='material'
                        onPress={() => setSearchbar(true)}
                    />
                </View>
            </View>
        );
    }
    else
    {
        return (
            <View style={{flex:12,flexDirection:'row',justifyContent:'space-between'}}>
                <View style={{flex:1,marginTop:10,alignItems:'center',marginRight:5}}>
                    <Icon
                        style={{flex:1}}
                        name='cancel'
                        type='material'
                        onPress={hideSearchbar}
                    />
                </View>
                <View style={{flex:9}}>
                    <TextInput
                        name="searchString"
                        placeholder="Keyword to search..."
                        label="searchString"
                        style={{ width: 260, height: 44,padding: 10,
                            borderWidth: 1,borderColor: 'black',flex:1}}
                        value={Searchstring}
                        onChangeText={(searchString) => setSearchstring( searchString )}
                    />
                </View>                        
                <View style={{marginTop:12,flex:2,alignItems:'flex-end',marginLeft:20}}>
                    <Icon
                        name='search'
                        type='material'
                        onPress={() => props.navigation.navigate("Discuss", {
                            icpagenumber: 1,
                            searchString: Searchstring,
                          })}
                    />
                </View>                
            </View>
        )
    }
}


export const LoginStack = () => {
    const Stack = createStackNavigator();
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

            <Stack.Screen name="Signup" 
                component={Signupscreen}
            />

        </Stack.Navigator>
    );
}

   
export const DiscussStack = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator 
            initialRouteName="Discuss"
        >
                <Stack.Screen name="Discuss" 
                    component={Discuss}
                    options={({ navigation }) => ({
                        title:null,
                        headerTitle: () => <LogoTitle navigation={navigation}  />
                    })}
                />

                <Stack.Screen name="Images" 
                    component={ImageActivities}
                    options={() => ({
                        title: 'Activities with images'
                    })}                    
                />                

                <Stack.Screen name="Addactivitycommentsdata" 
                    component={Addactivitycommentsdata}
                    options={({ route }) => ({
                        title: 'Comments on activity '+route.params.postId
                    })}                    
                />                

                <Stack.Screen name="UserActivities" 
                    component={UserActivities}
                    options={({ route }) => ({
                        title: 'Activities of '+route.params.username
                    })}                    
                />

                <Stack.Screen name="Membersscreen"
                    component={Membersscreen}
                    options={({ navigation }) => ({
                        title:null,
                        headerTitle: () => <LogoTitle navigation={navigation}  />
                    })}                    
                />

                <Stack.Screen name="MemberActivities" 
                    component={MemberActivities}
                    options={({ route }) => ({
                        title: 'Activities of '+route.params.username
                    })}                    
                />                

                <Stack.Screen name="ActivityDetail" 
                    component={ActivityDetail}
                    options={({ route }) => ({
                        title: 'Activity Details of '+route.params.bpactivityId
                    })}                    
                />

                <Stack.Screen name="Add" 
                    component={Addscreen}
                    options={({ navigation,route }) => ({
                        title:null,
                        headerTitle: () => <LogoTitle navigation={navigation}  />
                    })}                    
                />

                <Stack.Screen name="Login" 
                    component={Loginstack}
                    options={({ navigation,route }) => ({
                        title:'Login'
                    })}                    
                />                                 

            </Stack.Navigator>
    );
}

export const AddStack = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator 
            initialRouteName="Add"
        >
 
                <Stack.Screen name="Discuss" 
                    component={Discuss}
                    options={({ navigation,route }) => ({
                        title:null,
                        headerTitle: () => <LogoTitle navigation={navigation}  />
                    })}
                />

                <Stack.Screen name="Images" 
                    component={ImageActivities}
                    options={() => ({
                        title: 'Activities with images'
                    })}                    
                />                

                <Stack.Screen name="Addactivitycommentsdata" 
                    component={Addactivitycommentsdata}
                    options={({ route }) => ({
                        title: 'Comments on activity '+route.params.postId
                    })}                    
                />                

                <Stack.Screen name="UserActivities" 
                    component={UserActivities}
                    options={({ route }) => ({
                        title: 'Activities of '+route.params.username
                    })}                    
                />

                <Stack.Screen name="Membersscreen"
                    component={Membersscreen}
                    options={({ navigation }) => ({
                        title:null,
                        headerTitle: () => <LogoTitle navigation={navigation}  />
                    })}                    
                />

                <Stack.Screen name="MemberActivities" 
                    component={MemberActivities}
                    options={({ route }) => ({
                        title: 'Activities of '+route.params.username
                    })}                    
                />                

                <Stack.Screen name="ActivityDetail" 
                    component={ActivityDetail}
                    options={({ route }) => ({
                        title: 'Activity Details of '+route.params.bpactivityId
                    })}                    
                />

               <Stack.Screen name="Add" 
                    component={Addscreen}
                    options={({ navigation,route }) => ({
                        title:null,
                        headerTitle: () => <LogoTitle navigation={navigation}  />
                    })}                    
                />

                <Stack.Screen name="ActivityDetail" 
                    component={ActivityDetail}
                    options={({ route }) => ({
                        title: 'Activity Details of '+route.params.bpactivityId
                    })}                    
                />                

            </Stack.Navigator>
    );
}
    

    export const ImagesStack = () => {
        const Stack = createStackNavigator();
        return (
            <Stack.Navigator 
                initialRouteName="Images"
                screenOptions={({navigation}) => ({
                    title: null,
                    headerTitle: () => <LogoTitle navigation={navigation}  />,
                })}                    
            >
                <Stack.Screen name="Images" 
                    component={ImageActivities}
                />

                <Stack.Screen name="Add" 
                    component={Addscreen}
                    options={({ navigation,route }) => ({
                        title:null,
                        headerTitle: () => <LogoTitle navigation={navigation}  />
                    })}                    
                />

                <Stack.Screen name="Membersscreen"
                    component={Membersscreen}
                    options={({ navigation }) => ({
                        title:null,
                        headerTitle: () => <LogoTitle navigation={navigation}  />
                    })}                    
                />

                <Stack.Screen name="MemberActivities" 
                    component={MemberActivities}
                    options={({ route }) => ({
                        title: 'Activities of '+route.params.username
                    })}                    
                />

                <Stack.Screen name="UserActivities" 
                    component={UserActivities}
                    options={({ route }) => ({
                        title: 'Activities of '+route.params.username
                    })}                    
                />

                <Stack.Screen name="ActivityDetail" 
                    component={ActivityDetail}
                    options={({ route }) => ({
                        title: 'Activity Details of '+route.params.bpactivityId
                    })}                    
                /> 

                <Stack.Screen name="Login" 
                    component={Loginstack}
                    options={({ navigation,route }) => ({
                        title:'Login'
                    })}                    
                />                                                             


            </Stack.Navigator>
        );
    }    
    
    export const GroupsStack = () => {
        const Stack = createStackNavigator();
        //console.log('stackgroupstack');
        return (
            <Stack.Navigator 
                initialRouteName="Groups"
            >


                <Stack.Screen name="Discuss" 
                    component={Discuss}
                    options={({ navigation,route }) => ({
                        title:null,
                        headerTitle: () => <LogoTitle navigation={navigation}  />
                    })}
                />

                <Stack.Screen name="Images" 
                    component={ImageActivities}
                    options={() => ({
                        title: 'Activities with images'
                    })}                    
                />                

                <Stack.Screen name="Addactivitycommentsdata" 
                    component={Addactivitycommentsdata}
                    options={({ route }) => ({
                        title: 'Comments on activity '+route.params.postId
                    })}                    
                /> 

                <Stack.Screen name="Groups" 
                    component={Groups}
                    options={({ navigation }) => ({
                        title:null,
                        headerTitle: () => <LogoTitle navigation={navigation}  />
                    })}                    
                />

                <Stack.Screen name="GroupActivities" 
                    component={GroupActivities}
                    options={({ route }) => ({
                        title: route.params.groupname+' group'
                    })}                    
                />

                <Stack.Screen name="Add" 
                    component={Addscreen}
                    options={({ navigation,route }) => ({
                        title:null,
                        headerTitle: () => <LogoTitle navigation={navigation}  />
                    })}                    
                />

                <Stack.Screen name="Login" 
                    component={Loginstack}
                    options={({ navigation,route }) => ({
                        title:'Login'
                    })}                    
                />                

            <Stack.Screen name="Membersscreen"
                    component={Membersscreen}
                    options={({ navigation }) => ({
                        title:null,
                        headerTitle: () => <LogoTitle navigation={navigation}  />
                    })}                    
                />

                <Stack.Screen name="MemberActivities" 
                    component={MemberActivities}
                    options={({ route }) => ({
                        title: 'Activities of '+route.params.username
                    })}                    
                />

                <Stack.Screen name="UserActivities" 
                    component={UserActivities}
                    options={({ route }) => ({
                        title: 'Activities of '+route.params.username
                    })}                    
                />

                <Stack.Screen name="ActivityDetail" 
                    component={ActivityDetail}
                    options={({ route }) => ({
                        title: 'Activity Details of '+route.params.bpactivityId
                    })}                    
                />                                             
              
            </Stack.Navigator>
        );
    }

    export const MembersStack = () => {
        const Stack = createStackNavigator();
        return (
            <Stack.Navigator 
                initialRouteName="Membersscreen"
            >

                <Stack.Screen name="Discuss" 
                    component={Discuss}
                    options={({ navigation,route }) => ({
                        title:null,
                        headerTitle: () => <LogoTitle navigation={navigation}  />
                    })}
                />

                <Stack.Screen name="Images" 
                    component={ImageActivities}
                    options={() => ({
                        title: 'Activities with images'
                    })}                    
                />                

                <Stack.Screen name="Addactivitycommentsdata" 
                    component={Addactivitycommentsdata}
                    options={({ route }) => ({
                        title: 'Comments on activity '+route.params.postId
                    })}                    
                /> 

                <Stack.Screen name="Membersscreen"
                    component={Membersscreen}
                    options={({ navigation }) => ({
                        title:null,
                        headerTitle: () => <LogoTitle navigation={navigation}  />
                    })}                    
                />

                <Stack.Screen name="MemberActivities" 
                    component={MemberActivities}
                    options={({ route }) => ({
                        title: 'Activities of '+route.params.username
                    })}                    
                />

                <Stack.Screen name="UserActivities" 
                    component={UserActivities}
                    options={({ route }) => ({
                        title: 'Activities of '+route.params.username
                    })}                    
                />                

                <Stack.Screen name="Add" 
                    component={Addscreen}
                    options={({ navigation,route }) => ({
                        title:null,
                        headerTitle: () => <LogoTitle navigation={navigation}  />
                    })}                    
                />

                <Stack.Screen name="ActivityDetail" 
                    component={ActivityDetail}
                    options={({ route }) => ({
                        title: 'Activity Details of '+route.params.bpactivityId
                    })}                    
                />     

                <Stack.Screen name="Login" 
                    component={Loginstack}
                    options={({ navigation,route }) => ({
                        title:'Login'
                    })}                    
                />                                          

              
            </Stack.Navigator>
        );
    }
