
/**
 * Validation Error handler
 */
exports.validation = function (err, req, res, next) {
  var resJSON = {};

  /** Mongo errors */
  if (err.name === 'MongoError' && err.err) {

    /** duplicate key */
    if (( err.code === 11000 || err.code === 11001 )) {
      err.status = 409; // 409 Conflict
      var mongoError = err.err.match(/index:.*\.(.*)\.\$(.*)_.*dup\skey:\s{\s:\s"(.*)"/);
      var dbCollection = ( mongoError ? mongoError[1] : 'content' );
      var collectionField = ( mongoError ? mongoError[2] : 'field' );
      var fieldValue = ( mongoError ? mongoError[3] : 'value' );
      var mongoErrorObj = { message: msg.notUnique(collectionField, fieldValue), related: collectionField, type: 'validation', value: fieldValue }
      resJSON.messages = [ mongoErrorObj ];
    }

  /** Mongoose validation errors */
  } else if (err.name === 'ValidationError' && err.errors) {
    err.status = 422; // 422 Unprocessable Entity
    resJSON.messages = [];
    var objKeys = Object.keys(err.errors);
    objKeys.forEach(function (key) {
      var validationErrorObj = { message: err.errors[key].message, related: err.errors[key].path, type: 'validation', value: err.errors[key].value };
      resJSON.messages.push(validationErrorObj);
    });
  }

  /** respond if messages if they exist, or move to the next error middleware */
  if (resJSON.messages) {
    console.log(resJSON);
    return res.json(err.status, resJSON);
  }
  console.log(err);
  res.json(err);
}
