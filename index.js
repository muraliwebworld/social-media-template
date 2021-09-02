/**
 * //@//format
 */
 import React from 'react';
 //import { Rehydrated } from 'aws-appsync-react';
 import Rehydrated from './src/util/rehydrated/Rehydrated';
 import { registerRootComponent } from 'expo';
 import AWSAppSyncClient, {AUTH_TYPE} from 'aws-appsync';
 import { Auth, Amplify } from 'aws-amplify';
 import AppSyncConfig from './aws-exports';
 import App from './App';
 import { ApolloProvider } from '@apollo/client';
 import InAppBrowser from 'react-native-inappbrowser-reborn';
 import * as Linking from 'expo-linking';

 async function urlOpener (url, redirectUrl)  {
   const brow = await InAppBrowser.isAvailable();
   try {
     if (brow) {
       InAppBrowser.openAuth(url, redirectUrl, {
         showTitle: false,
         enableUrlBarHiding: true,
         enableDefaultShare: false,
         ephemeralWebSession: false,
         forceCloseOnRedirection: true,
         hasBackButton: true,
       }).then((response) => {
         if (
           response.type === 'success' &&
           response.url
         ) {
           Linking.openURL(response.url)
         }
       })
     } else Linking.openURL(url)
   } catch (error) {
     Linking.openURL(url)
   }
 

   
 };
 
 
 const oauth = {
   // Domain name //********.auth.us-east-1.amazoncognito.com
   domain : 'xxxx1111-xxxx-chatic.auth.us-east-1.amazoncognito.com', 
  
   // Authorized scopes
   scope : ['phone', 'email', 'profile', 'openid','aws.cognito.signin.user.admin'], 
 
   // Callback URL
   redirectSignIn : 'chforum://', // http://www.example.com/signin/ or 'exp://127.0.0.1:19000/--/', 'myapp://main/'
 
   // Sign out URL
   redirectSignOut : 'chforum://', // 'http://www.example.com/signout/' or 'exp://127.0.0.1:19000/--/', 'myapp://main/'
 
   // 'code' for Authorization code grant, 
   // 'token' for Implicit grant
   // Note that REFRESH token will only be generated when the responseType is code
   responseType: 'code',
 
   // optional, for Cognito hosted ui specified options
   options: {
       // Indicates if the data collection is enabled to support Cognito advanced security features. By default, this flag is set to true.
       AdvancedSecurityDataCollectionFlag : true
   },
 
   urlOpener
 }
 AppSyncConfig.oauth = oauth;
 

 Amplify.configure(AppSyncConfig);

 const options = {
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      }  
    }
  }
 
 const clientpublic = new AWSAppSyncClient({
   url: AppSyncConfig.aws_appsync_graphqlEndpoint,
   region: AppSyncConfig.aws_appsync_region,
   auth: {
     type: AUTH_TYPE.API_KEY, apiKey: AppSyncConfig.aws_appsync_apiKey,
     //type: AppSyncConfig.aws_appsync_authenticationType,
     jwtToken: async () => (await Auth.currentSession()).idToken.jwtToken
   },offlineConfig: {
     keyPrefix: 'getinitialpublic'},options
 });

 //const querysubs = clientpublic.watchQuery().subscribe
 const clientprivate = new AWSAppSyncClient({
   url: AppSyncConfig.aws_appsync_graphqlEndpoint,
   region: AppSyncConfig.aws_appsync_region,
   auth: {
     type: AppSyncConfig.aws_appsync_authenticationType,
     jwtToken: async () => (await Auth.currentSession()).idToken.jwtToken
   },offlineConfig: {
     keyPrefix: 'getinitialprivate'}
 },options
 );
 //const RehydratedWithClient = withApollo(Rehydrated);
 const AppWithProvider = () => (
     <ApolloProvider client={{clientpublic, clientprivate}}>
       <Rehydrated>
          <App />
        </Rehydrated>
     </ApolloProvider>
   );

 
 // registerRootComponent calls AppRegistry.registerComponent('main', () => App);
 // It also ensures that whether you load the app in the Expo client or in a native build,
 // the environment is set up appropriately
 registerRootComponent(AppWithProvider);
 

/*import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent('main', () => App);*/
