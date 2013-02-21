//////////////////
// Config

var QUERYSTRING_PREFIX = 'widget_',
    defaultParameters = {
      base_url: config.baseUrl

      // Default parameters go here

    };

require([ 'utils', 'loader.div', 'loader.script' ], function(utils, loadDivEmbeds, loadScriptEmbeds) {

  //
  // One can add silp params to the query string and they will be translated like:
  //
  //    widget_example_param -> example_param
  //
  var paramsQueryString = {};
  var document_params = utils.parseQueryString(document.location) || {};
  utils.each(document_params, function(val, key) {
    if(key.indexOf(QUERYSTRING_PREFIX) >= 0) {
      key = key.slice(QUERYSTRING_PREFIX.length);
      paramsQueryString[key] = val;
    }
  });

  var loadOne = function(paramsEmbed) {

    // Parameters are overriden in order (1 overrides 2, 2 overrides 3)
    //
    //  1. querystring parameters to embedding site
    //  2. querystring to load script src
    //  3. parameters in loader file
    //

    var parameters = utils.extend({}, defaultParameters, paramsEmbed, paramsQueryString);

    if(parameters.base_url !== defaultParameters.base_url) {

      //
      // Export RequireJS in global namespace if we set a custom base_url,
      // which is done because we want to either:
      //
      //  1. develop locally
      //  2. use a different version on the widget on a site we don't control
      //
      // For 1., we need define() globally, since we're working with the
      // files before they've gone through r.js. In case 2. it's okay - we
      // only risk breaking the embedding site for ourselves.
      //

      exports.define = namespace.define;
      exports.require = namespace.require;
      exports.requirejs = namespace.requirejs;

    }

    // Setup RequireJS and load the widget
    namespace.require.config({ baseUrl: parameters.base_url + '/js' });

    namespace.require([ 'app' ], function(App) {
      var app = new App(parameters);
    });

  };

  // Find all embeds
  loadScriptEmbeds(loadOne);
  loadDivEmbeds(loadOne);

});

