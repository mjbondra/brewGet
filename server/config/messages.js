
module.exports = {

  /**
   * Authentication messages
   */
  authentication: {
    incorrect: {
      user: function (username) { return 'User \'' + username + '\' was not found'; },
      email: function (email) { return 'Email address \'' + email + '\' is not associated with an account'; },
      password: 'Password is incorrect'
    },
    requires: {
      authentication: function (path) { return 'You must be authenticated to access ' + path; },
      role: function (path) { return 'You are not authorized to access ' + path; },
      self: function (username, path) { return 'You must be user \'' + username + '\' to access ' + path; }
    },
    success: function (username) { return 'Authenticated as \'' + username + '\''; }
  },

  /**
   * Model messages (CRUD, etc)
   */

  post: {
    created: function (title) { return 'Post \'' + title + '\' was created'; },
    deleted: function (title) { return 'Post \'' + title + '\' was deleted'; },
    updated: function (title) { return 'Post \'' + title + '\' was updated'; }
  },

  user: {
    created: function (username) { return 'User \'' + username + '\' was created'; },
    deleted: function (username) { return 'User \'' + username + '\' was deleted'; },
    updated: function (username) { return 'User \'' + username + '\' was updated'; }
  },

  image: {
    created: 'Image was successfully uploaded',
    deleted: 'Images was successfully deleted',
    exceedsFileSize: function (size) { return 'Image must be smaller than ' + size / 1024 / 1024 + ' MB'; },
    mimeError: function (mime) { return 'File type \'' + mime + '\' is not supported'; },
    unknownError: 'The was an unknown error while uploading this image'
  },

  /*
   * Field validation messages
   */
  body: {
    isNull: 'Body field cannot be empty' 
  },
  category: {
    isNull: 'You must select a post category'
  },
  comments: {
    isNull: 'Comments cannot be empty'
  },
  birthday: {
    isNull: 'Birthday cannot be empty',
    notDate: 'Birthday entered is not a valid date',
    under21: 'You must be 21'
  },
  email: {
    notEmail: 'Email address must be valid',
    isNull: 'Email address cannot be empty'
  },
  jobTitle: {
    isNull: 'Job title cannot be empty'
  },
  location: {
    notUS: 'Your location must be within the United States'
  },
  name: {
    first: {
      isNull: 'First name cannot be empty'
    },
    last: {
      isNull: 'Last name cannot be empty'
    }, 
    isNull: 'Name cannot be empty'
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
  type: {
    isNull: 'Please select a trade type; \'offer\' or \'request\''
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
  notUnique: function (dbCollection, collectionField, fieldValue) {
    if (collectionField === 'slug') {
      if (dbCollection === 'users') return 'Username already exists, please enter another';
    }
    return collectionField + ' \'' + fieldValue + '\' already exists, please enter another';
  },

  /**
   * HTTP status code messages
   */
  status: {
    403: 'You are not authorized to access this content',
    404: 'The content you were looking for was not found',
    500: 'There was a server error while processing your request'
  }
}
