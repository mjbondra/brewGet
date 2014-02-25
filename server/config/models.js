
/**
 * App models, in load order
 */
var models = [
  'image',
  'comment',
  'location',
  'brewery',
  'style',
  'beer',
  'user',
  'post',
  'cellar'
];

module.exports = function (modelsPath) {
  models.forEach(function (model) {
    require(modelsPath + model);
  });
}
