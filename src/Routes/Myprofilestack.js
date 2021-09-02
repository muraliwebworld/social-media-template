import React, { Component,useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View,Image,Text,TextInput } from 'react-native';
import { Icon } from 'react-native-elements';
import Myprofilescreen from '../components/profile/Profile';
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
                <View style={{flex:12,alignItems:'center'}}>
                    <Image
                        style={{height:44,alignSelf:'center'}}
                        source={require('../../Assets/Images/indiacities_logo_app.png')}
                    />
                </View>                        
            </View>
            );
        }
        
        const CustomTitle = (props) => {
            const [Searchbar, setSearchbar] = useState(false);
        
            const [Searchstring, setSearchstring] = useState("");
            
            //const displaySearchbar = () => {
            //    setSearchbar(true);
            //}
        
            const hideSearchbar = () => {
                setSearchstring("");
                setSearchbar(false);
                /*this.setState({
                    Searchstring : "",
                    Searchbar : false
                });*/
            }

        
            if (!Searchbar) {
                return (
                    <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',width:'100%'}}>
                        {/*<View style={{flex:1,marginTop:10,alignItems:'center'}}>
                            <Icon
                                style={{flex:1}}
                                name='dehaze'
                                type='material'
                                onPress={() =>  props.navigation.dispatch(DrawerActions.toggleDrawer())}
                            />
                        </View>*/}
                        <View style={{marginTop:8,marginRight:10,alignSelf:'center',width:'90%',alignSelf:'stretch'}}>
                            <Text style={{alignSelf:'center',textAlign:'center',fontSize:16,fontWeight:'bold',minWidth:200,flexWrap:'wrap'}}>{props.ictitle}</Text>
                        </View>                        
                        <View style={{marginTop:8,width:'10%'}}>
                            <Icon
                                style={{marginLeft:5,flex:1,alignSelf:'flex-end'}}
                                name='search'
                                type='material'
                                onPress={() => setSearchbar(true)}
                            />
                        </View>
                    </View>
                )
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
                                style={{ width: 190, height: 44,padding: 10,
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

class Myprofilestack extends Component {

        
    render() {
                
        
        const Stack = createStackNavigator();        

        return (

            <Stack.Navigator 
                initialRouteName="Myprofile"
                screenOptions={({navigation}) => ({
                    title: null,
                    headerTitle: () => <LogoTitle navigation={navigation}  />,
                })}                    
            >
                <Stack.Screen name="Myprofile" 
                    component={Myprofilescreen}
                />

                <Stack.Screen name="Add" 
                    component={Addscreen}
                    options={({navigation}) => ({
                        headerTitle: <LogoTitle navigation={navigation}  />,
                    })}                    
                />            

                <Stack.Screen name="Groups" 
                    component={Groups}
                    options={({navigation}) => ({
                        headerTitle: <LogoTitle navigation={navigation}  />
                    })}                     

                />

                <Stack.Screen name="GroupActivities" 
                    component={GroupActivities}
                    options={({ route,navigation }) => ({
                        headerTitle: <LogoTitle navigation={navigation}  />
                    })}                      
                />

                <Stack.Screen name="Discuss" 
                    component={Discuss}
                    options={(navigation) => ({
                        headerTitle: <LogoTitle navigation={navigation}  />
                    })}                     
                />

                <Stack.Screen name="Images" 
                    component={ImageActivities}
                    options={(navigation) => ({
                        headerTitle: <LogoTitle navigation={navigation}  />
                    })}                     
                />                

                <Stack.Screen name="Addactivitycommentsdata" 
                    component={Addactivitycommentsdata}
                    options={({ route,navigation }) => ({
                        headerTitle: <LogoTitle navigation={navigation}  />
                    })}                    
                />                

                <Stack.Screen name="UserActivities" 
                    component={UserActivities}
                    options={({ navigation }) => ({
                        headerTitleStyle : {width : '100%'},
                        headerTitle: <LogoTitle navigation={navigation}  />
                    })}                     
                />

                <Stack.Screen name="Membersscreen"
                    component={Membersscreen}
                    options={(navigation) => ({
                        headerTitle: <LogoTitle navigation={navigation}  />,
                    })}                     
                />

                <Stack.Screen name="MemberActivities" 
                    component={MemberActivities}
                    options={({ navigation }) => ({
                        headerTitle: <LogoTitle navigation={navigation}  />
                    })}                    
                />                

                <Stack.Screen name="ActivityDetail" 
                    component={ActivityDetail}
                    options={({ route,navigation }) => ({
                        headerTitle: <LogoTitle navigation={navigation}  />
                    })}                      
                />

           


             </Stack.Navigator>
         
        )
    }
}



export default Myprofilestack;