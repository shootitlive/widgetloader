# Widget Loader

This is a skeleton for creating an embedded Javascript widget using
RequireJS, grunt and tightly controlled namespacing.

The idea is that this repository is for building the loader file - but
as a start, an example app is included as well.

# Getting started

```bash
$ npm install
$ grunt
$ grunt browser
```

This will start a web server in CWD and point your browser to it.  To
use this with your own widget - just copy the skeleton code. This
includes:

- `Gruntfile.js` - a very normal grunt file for a RequireJS project
- `vendor/` - monkeypatched AMD versions of `jQuery`, `underscore` and
`backbone`. Note that shim doesn't do since it will sitll expose global
variables.
- `app/js/app.js` - bootstrap file, you prolly want to leave
this pretty much untouched.
- `app/js/widget.js` - this is where your own code comes in.

Once built and minified - this software will expose only **one** variable in
the global namespace. The name of this can be set in `js/config.js`.
Note that the name must correspond to the one in your app.

# What's so good about it?
You have a fully namespaced RequireJS environment. Note how even
`define` and `require` reside under a global of your choice, by default
it's `WidgetGlobal`. All AMD modules will be loaded under this namespace
as well.

```javascript
define(['underscore', 'jquery'], function(_, $) {

  var Widget = function(params) {
    // Do magic
  };

  _.extend(Widget.prototype, {
    magic: function() {
      return 42;
    }
  };

  return Widget;
});
```

Our motivation for this hunt for globals and obsession with
self-containment is that the Shootitlive player is embedded on many
large newspapers, and we want to minimize the risk of interference.
This should be very important for anyone delivering Javascript to
someone else's site.

# Adding 3rd party libraries

Have a look in `vendor`. To make each library export only a
local variable, one has to perform various tricks.

```javascript
define('backbone', [ 'underscore', 'jquery' ], function(_, $) {

  var global = {
    _: _, $: $, jQuery: $
  };

  (function() {
    // Untouched Backbone source
  }).call(global);

  return global.Backbone;

});
```

The approach differs somewhat for each library - but most sane libraries
have their exports at the top or bottom of the source, and shouldn't be
too hard to figure out. Also there's a module for listing added globals
in `app/js/list_globals.js`.

# TODO
- Try to find a generic and automated way of wrapping libraries
- Make it easier to use this repository as a module, so one can pull
upgrades without manual copying.
- Convert `loader` to Grunt 0.4

# Authors
- [Emil Stenqvist](http://github.com/emilisto) at [Shootitlive AB](http://shootitlive.com)

# Licensing
This software is released under the [MIT license](http://mit-license.org).
