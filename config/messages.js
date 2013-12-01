
module.exports = {

  /**
   * Model messages (CRUD, etc)
   */
  user: {
    adminRequired: function (path) { return 'You must be a site administrator to access ' + path; },
    authenticated:  function (username) { return 'Authenticated as \'' + username + '\''; },
    authenticationFailed: 'Username and/or password are not correct',
    authenticationRequired: function (path) { return 'You must be authenticated to access ' + path; },
    created: function (username) { return 'User \'' + username + '\' was created'; },
    deleted: function (username) { return 'User \'' + username + '\' was deleted'; },
    notFound: function (username, path) { return 'User \'' + username + '\' could not found while trying to respond to ' + path; },
    selfRequired: function (username, path) { return 'You must be user \'' + username + '\' to access ' + path; },
    read: function (username) { return 'User \'' + username + ' \' was read'; },
    restored: function (username, version) { return 'User \'' + username + '\' was restored with data from version ' + version; },
    updated: function (username) { return 'User \'' + username + '\' was updated'; },
    userRequired: function (path) { return 'You must be an authorized user to access ' + path; }
  },

  /*
   * Field validation messages
   */
  body: {
    isNull: 'Body field cannot be empty' 
  },
  comments: {
    isNull: 'Please include comments'
  },
  email: {
    notEmail: 'Email address must be valid',
    isNull: 'Please include your email address'
  },
  jobTitle: {
    isNull: 'Job title cannot be empty'
  },
  name: {
    first: {
      isNull: 'First name cannot be empty'
    },
    last: {
      isNull: 'Last name cannot be empty'
    }, 
    isNull: 'Please include your name'
  },
  password: {
    isNull: 'Password cannot be empty'
  },
  position: {
    isNull: 'Position cannot be empty',
    notNumeric: 'Position must be numeric'
  },
  title: {
    isNull: 'Title cannot be empty'
  },
  url: {
    notUrl: 'Url must be valid'
  },
  username: {
    isNull: 'Username cannot be empty'
  },

  /**
   * Unbound validation messages
   */
  default: 'Sorry! There was an error',
  notUnique: function (collectionField, fieldValue) { return collectionField + ' \'' + fieldValue + '\' already exists, please enter another'; },

  /**
   * HTTP status code messages
   */
  status: {
    403: 'Forbidden! You are not authorized to view this page.',
    404: 'Oh, no! That page was not found.',
    500: 'Whoa! There was an error while processing your request.'
  }
}
