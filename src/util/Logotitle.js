
import React from 'react';
import { Image, View } from 'react-native';

class LogoTitle extends React.Component {
    render() {
        return (
            <View style={{flex:12,flexDirection:'row',justifyContent:'space-between'}}>
                {/*<View style={{flex:1,marginTop:15,alignItems:'flex-end',marginLeft:5}}>
                    <Icon
                        style={{marginLeft:10,flex:1}}
                        name='dehaze'
                        type='material'
                        onPress={() =>  this.props.navigation.dispatch(DrawerActions.toggleDrawer())}
                    />
                </View>*/}
                <View style={{flex:10}}>
                    <Image
                        style={{height:55,marginLeft:10,flex:1}}
                        source={require('../../Assets/Images/indiacities_logo_app.png')}
                    />
                </View>                        
                <View style={{marginTop:18,flex:1,alignItems:'flex-end'}}>
                    <Icon
                        style={{marginLeft:10,flex:1}}
                        name='search'
                        type='material'
                    />
                </View>
            </View>
        );
    }    

}

export default LogoTitle;