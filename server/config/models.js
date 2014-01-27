
/**
 * App models, in load order
 */
var models = [
  'image',
  'comment',
  'brewery',
  'beer',
  'user',
  'post'
];

module.exports = function (modelsPath) {
  models.forEach(function (model) {
    require(modelsPath + model);
  });
}
