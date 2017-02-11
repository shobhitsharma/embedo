embedo [![Build Status](https://api.travis-ci.org/shobhitsharma/embedo.svg)](https://travis-ci.org/shobhitsharma/embedo) [![npm version](https://badge.fury.io/js/embedo.svg)](https://badge.fury.io/js/embedo)
=============

<img align="right" width="100" height="100"
     title="Embedo"
     src="https://s16.postimg.org/5aauaeih1/embed.png" style="margin-right: 20px;">

Embedo is a lightweight JS library which lets you embed social media content without any setup or hassels. It has features like auto-resize or auto-adjustment with respect to your container or passed optional parameters.

## Install

```sh
# npm Module
$ npm install embedo --save

# Bower
$ bower install embedo
```

## Usage

Embdedder supports AMD and CommonJS modules. Also, an example can be [found here](https://github.com/shobhitsharma/embedo/tree/master/example).

```js
var Embedo = require('embedo'); // OR import Embedo from 'embedo';
var embedo = new Embedo(); // OR const embedo = new Embedo();

embedo.load(<HTMLElement[object]>, <URL[string]>, <options[object]>);
```

Embedo automatically injects third-part social media SDKs once you include this to your project.

### Initialize Options

The following options can be set during library import is called:

| Parameter       | Type     | Default    | Description                                    |
| -------------   |----------|------------|------------------------------------------------|
| `facebook`      | number   | true      | Injects FB SDK                                  |
| `twitter`       | number   | true      | Injects Twitter SDK                             |
| `instagram`     | boolean  | true      | Injects Instagram SDK                           |
| `youtube`       | boolean  | n/a       | Injects Youtube iframe                          |

## Events

### .load()

The `.load()` function is all what you need to embed third party content.
There is an **automagic** function which translates the embedded content to fit and centerize the parent container if `width` or `height` is provided. 
If `strict: true` option is passed, then it will be ignored.

```
embedo.load(<HTMLElement>, <URL|string>, <options|{}>)
```

| Parameter       | Type     | Default    | Description                                    |
| -------------   |----------|------------|------------------------------------------------|
| `width`      | number   | null      | Custom width of container                           |
| `height`       | number   | null      | Custom height of container                        |
| `strict`     | boolean  | true      | Enables/Disbaled Automagic feature                  |

### .refresh()

The `embedo.refresh()` method can be called explicitly when you have a `change` or `resize` event, which re-calculates the dimensions of generated content.

```
embedo.refresh()
```

## Example

```js
embedo.load(
  document.getElementById('twttr-tweet'),
  'https://twitter.com/Sh0bhit/status/797584590214926340'
);
```

## Development and Contribution

If you'd like to fix some issues or add new features, feel free to create an issue for that.
To setup environment, tests and build, use following commands:

```bash
$ npm start
$ npm run build
```

## Supports

- Facebook SDK and oEmbed
- Twitter SDK and oEmbed
- Instagram SDK and oEmbed
- YouTube Embed

