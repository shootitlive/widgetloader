//
// Entry point for App
//
// Authors:
//
//    Emil Stenqvist <emil@shootitlive.com>
//

//
// RequireJS configuration
// -----------------------
//
// We have to put config here, or else it might not be loaded before other
// modules, resulting in wrong dependency paths
//

require.config({
    deps: [],
    paths: {
        "jquery": "../../vendor/jquery.amd",
        "backbone": "../../vendor/backbone.amd",
        "underscore": "../../vendor/underscore.amd"
    },

    // The r.js compiler will pick this up and enclose everything under this namespace.
    namespace: 'WidgetGlobal'
});

(function(exports) {

  define(
    [ 'widget' ],

    function(Widget) {

      // We create this hollow App object that proxies Widget to make a clean
      // cut - in `widget.js` we have RequireJS all setup and no longer need to
      // think of enclosure and configuration of the such.

      var App = function(params) { return Widget.apply(this, arguments); };
      App.prototype = Widget.prototype;
      return App;

    }
  );

}(this));

