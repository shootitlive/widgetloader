define('loader.div', ['utils', 'namespace' ], function(utils, namespace) {

  var EMBED_DIV_CLASSNAME = 'widget-embed';

  if(!namespace.foundEls) namespace.foundEls = [];
  var foundEls = namespace.foundEls;

  return function loadEmbedsDiv(loadOne) {
    var els = utils.getElementsByClassName(EMBED_DIV_CLASSNAME),
    nEls = els.length;

    for(var i = 0; i < nEls; i++) {
      var el = els[i];

      var params = el.getAttribute('data') || '',
      paramsEmbed = utils.deparam(params);

      if(foundEls.indexOf(el) < 0) {
        foundEls.push(el);

        var id = el.id = utils.makeUniqueId();

        utils.extend(paramsEmbed, {
          el: el,
          element: el,
          element_id: id
        });

        loadOne(paramsEmbed);
      }
    }
  };

});
