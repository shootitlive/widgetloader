///////////////////////////
//
// Utility functions for the SILP loader
//
define('utils', function() {

  var exports = {};

  if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
      for (var i = (start || 0), j = this.length; i < j; i++) {
        if (this[i] === obj) { return i; }
      }
      return -1;
    };
  }

  // Taken from underscore.js by Jeremy Ashkenas
  var nativeForEach = Array.prototype.forEach;
  var nativeKeys = Object.keys;
  var slice = Array.prototype.slice;
  var breaker = {};

  // Has own property?
  var has = function(obj, key) {
    return Object.hasOwnProperty.call(obj, key);
  };

  var keys = exports.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (has(obj, key)) keys[keys.length] = key;
    return keys;
  };

  var each = exports.each = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  var extend = exports.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  var nativeIsArray = Array.isArray;
  var isArray = nativeIsArray || function(obj) {
    return Object.prototype.toString.call(obj) == '[object Array]';
  };

  // deparam
  //
  // Inverse of $.param()
  //
  // Taken from jquery-bbq by Ben Alman
  // https://github.com/cowboy/jquery-bbq/blob/master/jquery.ba-bbq.js
  var deparam = exports.deparam = function( params, coerce ) {
    var obj = {},
    coerce_types = { 'true': !0, 'false': !1, 'null': null };

    // Iterate over all name=value pairs.
    each( params.replace( /\+/g, ' ' ).split( '&' ), function(v, j){
      var param = v.split( '=' ),
      key = decodeURIComponent( param[0] ),
      val,
      cur = obj,
      i = 0,

      // If key is more complex than 'foo', like 'a[]' or 'a[b][c]', split it
      // into its component parts.
      keys = key.split( '][' ),
      keys_last = keys.length - 1;

      // If the first keys part contains [ and the last ends with ], then []
      // are correctly balanced.
      if ( /\[/.test( keys[0] ) && /\]$/.test( keys[ keys_last ] ) ) {
        // Remove the trailing ] from the last keys part.
        keys[ keys_last ] = keys[ keys_last ].replace( /\]$/, '' );

        // Split first keys part into two parts on the [ and add them back onto
        // the beginning of the keys array.
        keys = keys.shift().split('[').concat( keys );

        keys_last = keys.length - 1;
      } else {
        // Basic 'foo' style key.
        keys_last = 0;
      }

      // Are we dealing with a name=value pair, or just a name?
      if ( param.length === 2 ) {
        val = decodeURIComponent( param[1] );

        // Coerce values.
        if ( coerce ) {
          val = val && !isNaN(val)            ? +val              // number
          : val === 'undefined'             ? undefined         // undefined
          : coerce_types[val] !== undefined ? coerce_types[val] // true, false, null
          : val;                                                // string
        }

        if ( keys_last ) {
          // Complex key, build deep object structure based on a few rules:
          // * The 'cur' pointer starts at the object top-level.
          // * [] = array push (n is set to array length), [n] = array if n is 
          //   numeric, otherwise object.
          // * If at the last keys part, set the value.
          // * For each keys part, if the current level is undefined create an
          //   object or array based on the type of the next keys part.
          // * Move the 'cur' pointer to the next level.
          // * Rinse & repeat.
          for ( ; i <= keys_last; i++ ) {
            key = keys[i] === '' ? cur.length : keys[i];
            cur = cur[key] = i < keys_last
            ? cur[key] || ( keys[i+1] && isNaN( keys[i+1] ) ? {} : [] )
            : val;
          }

        } else {
          // Simple key, even simpler rules, since only scalars and shallow
          // arrays are allowed.

          if ( isArray( obj[key] ) ) {
            // val is already an array, so push on the next value.
            obj[key].push( val );

          } else if ( obj[key] !== undefined ) {
            // val isn't an array, but since a second value has been specified,
            // convert val into an array.
            obj[key] = [ obj[key], val ];

          } else {
            // val is a scalar.
            obj[key] = val;
          }
        }

      } else if ( key ) {
        // No value was defined, so set something meaningful.
        obj[key] = coerce
        ? undefined
        : '';
      }
    });

    return obj;
  };

  var parseQueryString = exports.parseQueryString = function(url) {
    var a = document.createElement('a');
    a.href = url;
    var str = a.search.replace(/\?/, '');

    return deparam(str, true);
  };

  // Returns an id that no other element on the page already has
  var makeUniqueId = exports.makeUniqueId = function() {
    var text = "silp-",
        possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        length = 5;

    for(var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return document.getElementById(text) ? makeUniqueId() : text;
  };

  /*
    Developed by Robert Nyman, http://www.robertnyman.com
    Code/licensing: http://code.google.com/p/getelementsbyclassname/
  */
  var getElementsByClassName = exports.getElementsByClassName = function (className, tag, elm) {
    if (document.getElementsByClassName) {
      getElementsByClassName = function (className, tag, elm) {
        elm = elm || document;
        var elements = elm.getElementsByClassName(className),
          nodeName = (tag)? new RegExp("\\b" + tag + "\\b", "i") : null,
          returnElements = [],
          current;
        for(var i=0, il=elements.length; i<il; i+=1){
          current = elements[i];
          if(!nodeName || nodeName.test(current.nodeName)) {
            returnElements.push(current);
          }
        }
        return returnElements;
      };
    }
    else if (document.evaluate) {
      getElementsByClassName = function (className, tag, elm) {
        tag = tag || "*";
        elm = elm || document;
        var classes = className.split(" "),
          classesToCheck = "",
          xhtmlNamespace = "http://www.w3.org/1999/xhtml",
          namespaceResolver = (document.documentElement.namespaceURI === xhtmlNamespace)? xhtmlNamespace : null,
          returnElements = [],
          elements,
          node;
        for(var j=0, jl=classes.length; j<jl; j+=1){
          classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[j] + " ')]";
        }
        try	{
          elements = document.evaluate(".//" + tag + classesToCheck, elm, namespaceResolver, 0, null);
        }
        catch (e) {
          elements = document.evaluate(".//" + tag + classesToCheck, elm, null, 0, null);
        }
        while ((node = elements.iterateNext())) {
          returnElements.push(node);
        }
        return returnElements;
      };
    }
    else {
      getElementsByClassName = function (className, tag, elm) {
        tag = tag || "*";
        elm = elm || document;
        var classes = className.split(" "),
          classesToCheck = [],
          elements = (tag === "*" && elm.all)? elm.all : elm.getElementsByTagName(tag),
          current,
          returnElements = [],
          match;
        for(var k=0, kl=classes.length; k<kl; k+=1){
          classesToCheck.push(new RegExp("(^|\\s)" + classes[k] + "(\\s|$)"));
        }
        for(var l=0, ll=elements.length; l<ll; l+=1){
          current = elements[l];
          match = false;
          for(var m=0, ml=classesToCheck.length; m<ml; m+=1){
            match = classesToCheck[m].test(current.className);
            if (!match) {
              break;
            }
          }
          if (match) {
            returnElements.push(current);
          }
        }
        return returnElements;
      };
    }
    return getElementsByClassName(className, tag, elm);
  };

  return exports;

});

