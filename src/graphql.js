import graphql from 'graphql-tag'
import gql from 'graphql-tag';

// mutations
const createUser = `
  mutation($id: ID!,$username: String!,$useravatar: String!,$bio: String,$website:String,$location:String) {
    createUsermadras(input: {
      id: $id,
      username: $username,
      useravatar: $useravatar,
      bio: $bio,
      website:$website,
      location:$location
    }) {
      id username useravatar bio website location createdAt
    }
  }
`

// mutations
const updateUser = `
  mutation($id: ID!,$username: String!,$useravatar: String!,$bio: String,$website:String,$location:String) {
    updateUsermadras(input: {
      id: $id,
      username: $username,
      useravatar: $useravatar,
      bio:$bio,
      website:$website,
      location:$location
    }) {
      id username useravatar bio website location createdAt
    }
  }
`

const createMessage = gql`mutation CreateMessagemadras(
    $createdAt: String, $id: ID, $authorId: String, $content: String!, $messageRoomId: ID!, $messageChatroomId: ID!, $authorImage: String!, $authorName: String!
  ) {
  createMessagemadras(input: {
    createdAt: $createdAt, id: $id, content: $content, messageRoomId: $messageRoomId, messageChatroomId: $messageChatroomId,
    authorId: $authorId,authorImage: $authorImage, authorName: $authorName
  }) {
    id
    content
    authorId
    authorName
    authorImage
    messageRoomId
    messageChatroomId
    createdAt
  }
}
`;

const deleteMessage = gql`mutation DeleteMessagemadras(
  $id: ID
) {
deleteMessagemadras(input: {
  id: $id
}) {
  id
}
}
`;

const createUserNotifications = gql`mutation CreateUserNotificationsmadras($id: ID!, $userID: ID!, $messages: String, $readstatus: Boolean,$createdAt: String) {
  createUserNotificationsmadras(input: {
    id: $id, userID: $userID, messages: $messages, readstatus: $readstatus, createdAt: $createdAt
  }) {
    id
    userID
    messages
    readstatus
    createdAt
  }
}
`;

const updateUserNotifications = gql`mutation UpdateUserNotificationsmadras($id: ID!, $userID: ID!, $messages: String, $readstatus: Boolean,$createdAt: String) {
  updateUserNotificationsmadras(input: {
    id: $id, userID: $userID, messages: $messages, readstatus: $readstatus, createdAt: $createdAt
  }) {
    id
    userID
    messages
    readstatus
    createdAt
  }
}
`;

const onCreateUserNotifications = gql`
  subscription onCreateUserNotificationsmadras($userID: ID!,) {
    onCreateUserNotificationsmadras(userID: $userID) {
      id
      userID
      messages
      readstatus
      createdAt
    }
  }
`

const deleteUserNotifications = gql`mutation DeleteUserNotificationsmadras(
  $id: ID
) {
  deleteUserNotificationsmadras(input: {
  id: $id
}) {
  id
}
}
`;

const listUserNotificationssUnread = graphql`
  query listUserNotificationssmadras($userID: ID!, $readstatus: Boolean!) {
    listUserNotificationssmadras(filter : { AND: [{userID: $userID}, {readstatus: $readstatus}] }) {
      items(order_by: {created_at: desc}, limit: 32) {
        id
        userID
        messages
        readstatus
        createdAt
      }
    }
  }
`

const listUserNotificationss = graphql`
  query listUserNotificationssmadras($userID: ID!) {
    listUserNotificationssmadras(filter : { AND: [{userID: $userID}] }) {
      items(order_by: {created_at: desc}, limit: 32) {
        id
        userID
        messages
        readstatus
        createdAt
      }
    }
  }
`


const createRoom = `mutation CreateRoommadras($name: String!, $memberids: [String!]!, $members: [String!]!) {
  createRoommadras(input: {
    name: $name, memberids: $memberids, members: $members
  }) {
    id
    name
    members
    memberids
  }
}
`;

const updateRoom = `mutation updateRoommadras(id: ID!, $name: String!, $memberids: [String!]!, $members: [String!]!) {
  updateRoommadras(input: {
    $id, $name, memberids: $memberids, members: $members
  }) {
    id
    name
    members
    memberids
  }
}
`;

const createRoomLink = gql`mutation CreateRoomLinkmadras(
    $id:ID!,$roomLinkChatroomId: ID!, $roomLinkUserId: ID, $chatroomName: String
  ) {
  createRoomLinkmadras(input: {
    id:$id,roomLinkChatroomId: $roomLinkChatroomId, roomLinkUserId: $roomLinkUserId, chatroomName: $chatroomName
  }) {
    id
    roomLinkUserId
    roomLinkChatroomId
    chatroomName
  }
}
`;

const getUser = graphql`
  query getUsermadras($id: ID!) {
    getUsermadras(id: $id) {
      id
      username
      useravatar
      bio
      website
      location
    }
  }
`

const getUserAndChatrooms = gql`
  query getUserAndChatroomsmadras($id:ID!) {
    getUsermadras(id:$id) {
      id
      username
      chatrooms(limit: 100) {
        items {
          id
          chatroom {
            id
            name
          }
        }
      }
    }
  }
`

const getRoom = gql`
  query getRoommadras($id: ID!) {
    getRoommadras(id:$id) {
      id
      name
      members
      messages(limit: 100) {
        items {
          id
          content
          authorId
          authorName
          authorImage
          messageRoomId
          createdAt
        }
      }
      createdAt
      updatedAt
    }
  }
`

const onCreateMessage = gql`
  subscription onCreateMessagemadras($messageRoomId: ID!,$messageChatroomId: ID!) {
    onCreateMessagemadras(messageRoomId: $messageRoomId, messageChatroomId: $messageChatroomId) {
      id
      content
      authorId
      authorName
      authorImage
      messageRoomId
      messageChatroomId
      createdAt
    }
  }
`

const onCreateRoomLink = gql`
  subscription onCreateRoomLinkmadras($roomLinkUserId: ID!,) {
    onCreateRoomLinkmadras(roomLinkUserId: $roomLinkUserId) {
      id
      roomLinkUserId
      roomLinkChatroomId
      chatroomName
    }
  }
`

const onCreateUser = gql`subscription OnCreateUsermadras {
  onCreateUsermadras {
    id
    username
    createdAt
  }
}
`;

export {
  createUser,
  updateUser,
  createMessage,
  deleteMessage,
  createRoom,
  updateRoom,
  createRoomLink,
  createUserNotifications,
  updateUserNotifications,
  onCreateUserNotifications,
  deleteUserNotifications,
  listUserNotificationss,
  listUserNotificationssUnread,
  getRoom,
  getUser,
  getUserAndChatrooms,
  onCreateMessage,
  onCreateUser,
  onCreateRoomLink
}

export const createBlog = /* GraphQL */ `
  mutation CreateBlogmadras(
    $input: CreateBlogInput!
    $condition: ModelBlogmadrasConditionInput
  ) {
    createBlogmadras(input: $input, condition: $condition) {
      id
      name
      posts {
        items {
          id
          title
          blogID
        }
        nextToken
      }
    }
  }
`;
export const updateBlog = /* GraphQL */ `
  mutation UpdateBlogmadras(
    $input: UpdateBlogInput!
    $condition: ModelBlogmadrasConditionInput
  ) {
    updateBlogmadras(input: $input, condition: $condition) {
      id
      name
      posts {
        items {
          id
          title
          blogID
        }
        nextToken
      }
    }
  }
`;
export const deleteBlog = /* GraphQL */ `
  mutation DeleteBlogmadras(
    $input: DeleteBlogInput!
    $condition: ModelBlogmadrasConditionInput
  ) {
    deleteBlogmadras(input: $input, condition: $condition) {
      id
      name
      posts {
        items {
          id
          title
          blogID
        }
        nextToken
      }
    }
  }
`;

export const getBlog = graphql`
  query getBlogmadras($id: ID!) {
    getBlogmadras(id: $id) {
      id
      name
      posts {
        items {
          id
          title
          blogID
        }
        nextToken
      }
    }
  }
`;

export const createPost = /* GraphQL */ `
  mutation CreatePostmadras(
    $input: CreatePostInput!
    $condition: ModelPostmadrasConditionInput
  ) {
    createPostmadras(input: $input, condition: $condition) {
      id
      title
      blogID
      blog {
        id
        name
        posts {
          nextToken
        }
      }
      comments {
        items {
          id
          postID
          content
          authorId
          authorName
          authorImage          
        }
        nextToken
      }
    }
  }
`;
export const updatePost = /* GraphQL */ `
  mutation UpdatePostmadras(
    $input: UpdatePostInput!
    $condition: ModelPostmadrasConditionInput
  ) {
    updatePostmadras(input: $input, condition: $condition) {
      id
      title
      blogID
      blog {
        id
        name
        posts {
          nextToken
        }
      }
      comments {
        items {
          id
          postID
          content
          authorId
          authorName
          authorImage          
        }
        nextToken
      }
    }
  }
`;
export const deletePost = /* GraphQL */ `
  mutation DeletePostmadras(
    $input: DeletePostInput!
    $condition: ModelPostmadrasConditionInput
  ) {
    deletePostmadras(input: $input, condition: $condition) {
      id
      title
      blogID
      blog {
        id
        name
        posts {
          nextToken
        }
      }
      comments {
        items {
          id
          postID
          content
          authorId
          authorName
          authorImage
        }
        nextToken
      }
    }
  }
`;

export const getPost = graphql`
  query getPostmadras($id: ID!) {
    getPostmadras(id: $id) {
      id
      title
      blogID
      blog {
        id
        name
        posts {
          nextToken
        }
      }
      comments {
        items {
          id
          postID
          content
          authorId
          authorName
          authorImage
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;

export const createComment = gql`mutation CreateCommentmadras(
    $id: ID, $authorId: ID!, $authorName: String!, $authorImage: String!, $content: String!, $postID: ID!,$createdAt: String
  ) {
    createCommentmadras(input: {id: $id,postID: $postID,content: $content,
      authorId:$authorId,authorName:$authorName,
      authorImage:$authorImage,createdAt: $createdAt
    }) {
      id
      postID
      content
      authorId
      authorName
      authorImage
      createdAt
      updatedAt
    }
  }
`;



export const updateComment = gql`
  mutation UpdateCommentmadras(
    $input: UpdateCommentInput!
    $condition: ModelCommentmadrasConditionInput
  ) {
    updateCommentmadras(input: $input, condition: $condition) {
      id
      postID
      content
      authorId
      authorName
      authorImage
      createdAt
      updatedAt         
    }
  }
`;
export const deleteComment = gql`
  mutation DeleteCommentmadras(
    $id: ID
  ) {
    deleteCommentmadras(input: {id: $id}) {
      id
      postID
      content
      authorId
      authorName
      authorImage
      createdAt
      updatedAt      
     }
  }
`;

export const onCreateComment = gql`
  subscription onCreateCommentmadras($postID: ID!) {
    onCreateCommentmadras(postID: $postID) {
      id
      postID
      content
      authorId
      authorName
      authorImage
      createdAt
      updatedAt
    }
  }
`

export const onDeleteComment = gql`
  subscription onDeleteCommentmadras($postID: ID!) {
    onDeleteCommentmadras(postID: $postID) {
      id
      postID
      content
      authorId
      authorName
      authorImage
      createdAt
      updatedAt        
    }
  }
`
export const listGroups = gql `
query listGroupmadrass(
  $filter: ModelGroupmadrasFilterInput
  $limit: Int
  $nextToken: String
) {
  listGroupmadrass(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    ) {
    items {
      id
      name
      groupslug
      description
      groupImage
    }
    nextToken
  }
}
`

export const listUsers = gql `
query listUsermadrass(
  $filter: ModelUsermadrasFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsermadrass(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    ) {
    items {
      id
      username
      useravatar
      bio
      website
      location
      createdAt
      updatedAt

    }
    nextToken
  }
}
`

export const orderbyupdatedID = gql `
query OrderbyupdatedIDmadras(
  $sorTid: ID
  $limit: Int
  $filter: ModelActivitymadrasFilterInput
  $sortDirection: ModelSortDirection
  $nextToken: String
) {
  orderbyupdatedIDmadras(
    sorTid: $sorTid
    limit: $limit
    filter:$filter
    sortDirection: $sortDirection
    nextToken: $nextToken
    ) {
    items {
      id
      sorTid
      slug
      title
      content
      contentLowercase
      groupID
      likeids
      authorId
      authorName
      authorImage
      activityImage
      createdAt
      updatedAt
      userdetails {
        id
        username
        useravatar
        bio
        website
        location
        activityidlikes
        createdAt
        updatedAt
      }
   
    }

    nextToken
  }
}
`
export const byPost = gql`
  query byPostmadras($postID: ID!) {
    byPostmadras(postID: $postID) {
     items {
      id
      postID
      content
      authorId
      authorName
      authorImage
      createdAt
      updatedAt
      userdetails {
        id
        username
        useravatar
        createdAt
        updatedAt
      }      
     }
    }
  }
`;
//{where: {postID: {_eq: $postID}}}
/*export const listComments = gql`
  query ListComments(
    $filter: ModelCommentFilterInput
  ) {
    listComments(filter: $filter) {
      items {
        id
        postID
        content
        authorId
        authorName
        authorImage
        createdAt
        updatedAt
        _version
        userdetails {
          id
          username
          useravatar
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        post {
          id
          title
          content
          blogID
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }            
      }
      nextToken
    }
  }
`;*/

export const listActivitys = gql `
  query ListActivitymadrass(
    $filter: ModelActivitymadrasFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listActivitymadrass(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        sorTid
        title
        content
        groupID
        likeids
        authorId
        authorName
        authorImage
        activityImage
        createdAt
        updatedAt
        userdetails {
          bio
          website
          location                  
        }
      }
      nextToken
    }
  }
`;

export const listComments = gql `
  query ListCommentmadrass(
    $filter: ModelCommentmadrasFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCommentmadrass(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        postID
        content
        authorId
        authorName
        authorImage
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const createActivity = gql `
mutation CreateActivitymadras(
  $input: CreateActivitymadrasInput!, $condition: ModelActivitymadrasConditionInput
    ) {
  createActivitymadras(input: $input,condition: $condition) {
    id
    title
    sorTid
    slug
    content
    contentLowercase
    groupID
    authorId
    likeids
    authorName
    authorImage
    activityImage
    createdAt
    updatedAt        
    userdetails {
      id
      username
      useravatar
      bio
      website
      location
      activityidlikes
      createdAt
      updatedAt
    }        
  }
}
`;

export const updateActivity = gql `
mutation UpdateActivitymadras(
  $input: UpdateActivitymadrasInput!, $condition: ModelActivitymadrasConditionInput
    ) {
  updateActivitymadras(input: $input,condition: $condition) {
    id
    title
    content
    groupID
    authorId
    likeids
    authorName
    authorImage
    activityImage
    updatedAt
  }
}
`;

export const deleteActivity = gql `
mutation DeleteActivitymadras(
  $input: DeleteActivitymadrasInput!, $condition: ModelActivitymadrasConditionInput
    ) {
    deleteActivitymadras(input: $input,condition: $condition) {
    id
  }
}
`;