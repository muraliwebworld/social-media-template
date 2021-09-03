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
<br/><br/>
<b>Before proceeding with below build app procedure, please refer react native documents to install react native app and replace/modify  src and android  folder by copying files from this repository</b><br/>
#Procedure to build app
1. Install Amplify CLI and configure<br/>
  ```npm install -g @aws-amplify```<br/>
  ```amplify configure```<br/><br/>
2. Installing this repository<br/>
  <b>please refer react native documents to install react native app and replace/modify  src and android  folder by copying files from this repository</b>
3. Install dependencies<br />
  ```npm install```<br/><br/>
4. Delete the amplify folder<br /><br />
5. Initialize a new Amplify project<br/>
  ```amplify init```<br /><br />
6. Add Authentication<br />  
 ```amplify add auth```<br/>
(Configure using cognito with username as email address and also third party logins like faceboook)<br/><br/>
7. Add API<br />
  ```amplify add api```<br/><br/>
  (Choose Cognito User Pools as the authentication type(read write update delete) and also API for read only)<br/>
  (When prompted for the GraphQL schema, use the following schema:)
  ```graphql
  type Usermadras @aws_api_key @aws_cognito_user_pools
  @model 
  @auth(rules: [{ allow: owner, operations: [create, update, delete] },{allow:private, operations:[read]},{allow:public, operations:[read]}]) {
  id: ID!
  username: String!
  useravatar: String
  bio: String
  website: String
  location: String
  activityidlikes: [String]
  chatrooms: [RoomLinkmadras] @connection(name: "UserLinksmadras")
  messages: [Messagemadras] @connection(name: "UserMessagesmadras")
	createdAt: String
	updatedAt: String
  comments: [Commentmadras] @connection(keyName: "byUsermadras", fields: ["id"])
}

type PushNotificationsubscribersmadras @aws_cognito_user_pools
  @model 
  @auth(rules: [{ allow: owner, operations: [create, update, delete]},{allow:private, operations:[read, create]},{allow:public, operations:[read, create]}]) {
  id: ID!
  subscription: String
  tempfield: String
	createdAt: String
	updatedAt: String
}


type UserNotificationsmadras @aws_cognito_user_pools
  @model 
  @auth(rules: [{ allow: owner, ownerField: "userID", operations: [create, update, delete] }]) {
  id: ID!
  userID: ID!
  messages: String
  readstatus: Boolean
	createdAt: String
	updatedAt: String
}

type Chatroommadras @aws_cognito_user_pools
  @model(
    mutations: { create: "createRoommadras", update: "updateRoommadras", delete: "deleteRoommadras" }
    queries: { get: "getRoommadras", list: "listRoomsmadras" }
    subscriptions: null
  )
  @auth(rules: [{ allow: owner, ownerField: "memberids" , operations: [create, update, delete, read]}]) {
  id: ID!
  messages: [Messagemadras] @connection(name: "RoomMsgsmadras", sortField: "createdAt")
  associated: [RoomLinkmadras] @connection(name: "AssociatedLinksmadras")
  name: String!
  members: [String!]!
  memberids: [String!]!
  ownerId: String
  Moderators: [String]
	createdAt: String
	updatedAt: String
}

type Messagemadras @aws_cognito_user_pools
  @model(subscriptions: null, queries: null) 
  @auth(rules: [{ allow: owner, ownerField: "authorId", operations: [create, update, delete] }]) {
  id: ID!
  author: Usermadras @connection(name: "UserMessagesmadras", keyField: "authorId")
  authorId: String
  authorName: String!
  authorImage: String!  
  content: String!
  chatroom: Chatroommadras! @connection(name: "RoomMsgsmadras")
  messageRoomId: ID!
  messageChatroomId: ID!
	createdAt: String
	updatedAt: String
}


type RoomLinkmadras @aws_cognito_user_pools
  @model(
    mutations: { create: "createRoomLinkmadras", update: "updateRoomLinkmadras", delete: "deleteRoomLinkmadras" }
    queries: { get: "getRoomlinkmadras", list: "listRoomlinkmadras" }
    subscriptions: null
  )
  @auth(rules: [{ allow: owner, ownerField: "members", operations: [create, update, delete] }]) {
  id: ID!
  user: Usermadras! @connection(name: "UserLinksmadras")
  roomLinkUserId: ID
  chatroom: Chatroommadras! @connection(name: "AssociatedLinksmadras")
  roomLinkChatroomId: ID!
  chatroomName: String
	createdAt: String
	updatedAt: String
}


type Blogmadras @aws_api_key @aws_cognito_user_pools @model 
  @auth(rules: [{ allow: owner, operations: [create, update, delete] },{allow:private, operations:[read]},{allow:public, operations:[read]}]) {
  id: ID!
  name: String!
  posts: [Postmadras] @connection(keyName: "byBlogmadras", fields: ["id"])
}

type Postmadras @aws_api_key @aws_cognito_user_pools @model @key(name: "byBlogmadras", fields: ["blogID"], queryField: "byBlogmadras") 
@auth(rules: [{ allow: owner, operations: [create, update, delete] },{allow:private, operations:[read]},{allow:public, operations:[read]}]) {
  id: ID!
  title: String!
  content: String
  blogID: ID!
  blog: Blogmadras @connection(fields: ["blogID"])
  comments: [Commentmadras] @connection(keyName: "byPostmadras", fields: ["id"])
}

type Groupmadras @aws_api_key @aws_cognito_user_pools @model 
  @auth(rules: [{ allow: owner, operations: [create, update, delete] },{allow:private, operations:[read]},{allow:public, operations:[read]}]) {
  id: ID!
  name: String
  groupslug: String
  content: String
  description: String
  groupImage: String
  activities: [Activitymadras] @connection(keyName: "byGroupmadras", fields: ["id"])
}


type Activitymadras @aws_api_key @aws_cognito_user_pools @model 
@key(name: "orderbyupdatedIDmadras", fields: ["sorTid", "updatedAt"], queryField: "orderbyupdatedIDmadras")
@auth(rules: [{ allow: owner, operations: [create, update, delete] },{allow:private, operations:[read,update]},{allow:public, operations:[read]}]) {
  id: ID!
  sorTid: ID!
  title: String
  slug: String
  content: String
  contentLowercase: String
  groupID: ID!
  likeids: [Int]
  group: Groupmadras @connection(fields: ["groupID"])
  authorId: ID!
  authorName: String
  userdetails: Usermadras @connection(fields:["authorId"])  
  authorImage: String
  activityImage: String
  createdAt: AWSDateTime
  updatedAt: AWSDateTime
}


type Commentmadras @aws_api_key @aws_cognito_user_pools @model(subscriptions: null) 
@key(name: "byPostmadras", fields: ["postID", "content"], queryField: "byPostmadras")
@key(name: "byUsermadras", fields: ["authorId"], queryField: "byUsermadras") 
@auth(rules: [{ allow: owner, operations: [create, update, delete] },{allow:private, operations:[read]},{allow:public, operations:[read]}]){
  id: ID
  postID: ID!
  post: Postmadras @connection(fields: ["postID"])
  content: String!
  authorId: ID!
  authorName: String!
  userdetails: Usermadras @connection(fields:["authorId"])  
  authorImage: String!
  createdAt: String
	updatedAt: String
}


type Subscription @aws_api_key @aws_cognito_user_pools {
  onCreateRoomLinkmadras(roomLinkUserId: ID!): RoomLinkmadras
    @aws_subscribe(mutations: ["createRoomLinkmadras"])
  onDeleteRoomLinkmadras(roomLinkUserId: ID!): RoomLinkmadras
    @aws_subscribe(mutations: ["deleteRoomLinkmadras"])
  onCreateUsernotificationmadras(userID: ID!): UserNotificationsmadras
    @aws_subscribe(mutations: ["createUserNotificationsmadras"])
  onDeleteUserNotificationmadras(userID: ID!): UserNotificationsmadras
    @aws_subscribe(mutations: ["deleteUserNotificationsmadras"])      
  onCreateMessagemadras(messageRoomId: ID!,messageChatroomId: ID!): Messagemadras
    @aws_subscribe(mutations: ["createMessagemadras"])
  onDeleteMessagemadras(messageRoomId: ID!,messageChatroomId: ID!): Messagemadras
    @aws_subscribe(mutations: ["deleteMessagemadras"])
  onCreateCommentmadras(postID: ID): Commentmadras
    @aws_subscribe(mutations: ["createCommentmadras"])
  onDeleteCommentmadras(postID: ID): Commentmadras
    @aws_subscribe(mutations: ["deleteCommentmadras"])
} 
```

8.Run the push command to create the resources in your account:<br/>
 ```amplify push```<br/><br/>
9. Run the project as per react native cli instructions standalone using<br/>
 ```npx react-native start``` and ```npx react-native run-android``` simultaneously in two terminals.
