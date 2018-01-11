/* jshint undef: true, unused: true */
/* global $, paper, Backbone, _, console */
(function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition();
  else if (typeof define == 'function' && define.amd) define(definition);
  else context[name] = definition();
})('RegexSelection', this, function (name, context) {
  return Backbone.View.extend(regex_select_proto);
});
