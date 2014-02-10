
/**
 * Slug utility
 */

/**
 * Convert string to slug
 *
 * @param {string} str - string to convert
 * @param {boolean} strip - removes non-word characters; do not replace with '-'
 * @returns {string} - slug
 */
exports.slug = function (str, strip) {
  if (!str) return;
  if (strip === true) return str.toLowerCase().replace(/[_]/g, '').replace(/[^\w]+/g,'');
  return str.toLowerCase().replace(/[ |_]/g, '-').replace(/[^\w-]+/g,'');
}
