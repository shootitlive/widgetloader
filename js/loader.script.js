define(['utils', 'namespace' ], function(utils, namespace) {

  if(!namespace.foundEls) namespace.foundEls = [];
  var foundEls = namespace.foundEls;

  // RE used to identify widgets, note that scripts must have the src
  //
  //   //anything/widget.load(anything).js
  //
  // Since this is how they are identified. The reason for not using a class
  // name, etc. is that emebd tags might be "mangled" by blog tools, e.g.
  // Tumblr.
  //
  var re = /.*widget\.load\.([^/]+\.)?js/;

  return function(loadOne) {
    var els = document.getElementsByTagName('script'),
        nEls = els.length;

    for(var i = 0; i < nEls; i++) {
      var el = els[i];

      if(el.src.match(re)) {

        var paramsEmbed = utils.parseQueryString(el.src),
        nParams = utils.keys(paramsEmbed).length;

        // Skip script inclusion that have no params specified, and script
        // elements already found.
        if(nParams > 0 && foundEls.indexOf(el) < 0) {
          foundEls.push(el);

          utils.extend(paramsEmbed, {
            element: el,
            element_id: utils.makeUniqueId()
          });

          var div = document.createElement('div'),
              script_tag = paramsEmbed.element;

          div.id = paramsEmbed.element_id;
          script_tag.parentNode.insertBefore(div, script_tag);
          paramsEmbed.el = div;

          loadOne(paramsEmbed);

        }
      }
    }
  };

});
