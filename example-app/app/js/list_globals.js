define(['underscore'], function(_) {

  return function() {

    var iframe = document.createElement('iframe');

    document.body.appendChild(iframe);

    var originalGlobalKeys = _.keys(iframe.contentWindow),
        ourGlobalKeys = _.keys(window),
        addedGlobalKeys = _.difference(ourGlobalKeys, originalGlobalKeys);

    addedGlobalKeys = _.filter(addedGlobalKeys, function(key) {
      return !!window[key];
    });

    document.body.removeChild(iframe);

    return addedGlobalKeys;
  };

});

