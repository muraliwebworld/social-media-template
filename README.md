# Social Media Android app template using react-native
Social Media template with live chat using react-native, react-navigation, AWS appsync client (offline and online modes), APOLLO client, Amplify, Cognito, graphql, NodeJS, javascript<br/><br/>
This app allows user to publish social media like activities, upload images, live chat for every activity with live graphql subscription, offline content storage using AWS appsync. It uses react context provider instead of redux store to pass credentials to child elements. It also uses withApollo to pass AWSappsync client downstream to all child elements<br/><br/>
To install, it requires AWS Amplify CLI to create required AWS appsync setup with authorization using cognito and other dynamodb tables. Please refer schema.graphql to create required dynamodb table and modify as per your requirement. Some of details sensitive credentials are removed in amplify folder, it must be setup as per your AWS credentials using Amplify CLI<br/><br/>
# Demo
https://play.google.com/store/apps/details?id=com.indiacities.chennaicommunityforum
<br/><br/>
# Screenshots
![social3](https://user-images.githubusercontent.com/32461311/131834532-ca22534d-2acb-4ba3-acf6-ebacac79216b.png)
![social2](https://user-images.githubusercontent.com/32461311/131834530-733b0e57-b909-4919-8f26-dae82faa5049.png)
![social4](https://user-images.githubusercontent.com/32461311/131834538-af648afe-18fc-4411-a0ab-d9e8993a2a08.png)
![social5](https://user-images.githubusercontent.com/32461311/131834539-992a99b1-cd32-4b37-aa7f-76d7fd9b84a5.png)
![social6](https://user-images.githubusercontent.com/32461311/131834541-5856345b-b7a7-474c-9764-8c2db14ec2be.png)
![social1](https://user-images.githubusercontent.com/32461311/131834523-2f7c3233-433e-4e7d-a9e3-28b15b75dd2a.png)

