# pixi-gl-core

[![Build Status](https://travis-ci.org/pixijs/pixi-gl-core.svg?branch=master)](https://travis-ci.org/pixijs/pixi-gl-core)

A set of tidy little pixi objects that make working with WebGL simpler.

They are used under the hood in [Pixi v4](http://www.pixijs.com/). They should also give more users the ability to do more advanced stuff with WebGL in v4 too.

You can see the components in action here: 

http://dev.goodboydigital.com/client/goodboy/million/

## Installing

Installing using [NPM](https://npmjs.com):

```bash
npm install pixi-gl-core --save
```

Installing using [Bower](http://bower.io):

```bash
bower install pixi-gl-core
```

## Usage

Including using Node:

```js
var gl = require('pixi-gl-core');
```

Including in the Browser:

```html
<canvas id="stage"></canvas>
<script src="bower_components/pixi-gl-core/bin/pixi-gl-core.min.js"></script>
<script>
    try 
    {
        var context = pixi.gl.createContext(document.getElementById('stage'));
    }
    catch(e)
    {
        console.error("Unable to create WebGL context");
    }
</script>
```

## Rebuilding

After install NPM module with `npm install`, build using:

```bash
npm run build
```

To run a watch, development command.

```bash
npm run watch
```