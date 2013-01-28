define(['underscore', 'jquery', 'list_globals'], function(_, $, listGlobals) {

  var Widget = function(params) {

    var $el = $(params.el);

    var globals = listGlobals();
    var fragment = _.reduce(globals, function(html, global) {
      return html + '<li><code>' + global + '</code></li>\n';
    }, '');

    $el
      .append('grunt, RequireJS, underscore and jQuery made me be')
      .append("<p>I'm guilty of these globals:</p>")
      .append($('<ul/>').html(fragment));

  };

  return Widget;

});
