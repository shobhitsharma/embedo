embedder [![Build Status](https://api.travis-ci.org/w0rm/gulp-svgstore.svg)](https://travis-ci.org/shobhitsharma/embedder)
=============

<img align="right" width="100" height="100"
     title="Embedder"
     src="https://s16.postimg.org/5aauaeih1/embed.png" style="margin-right: 20px;">

Embedder is a lightweight JS library which lets you embed social media content without any setup or hassels. It has features like auto-resize or auto-adjustment with respect to your container or passed optional parameters.

## Install

```sh
# npm Module
$ npm install embedder --save

# Bower
$ bower install embedder
```

## Usage

Embdedder supports AMD and CommonJS modules. Also, an example can be [found here](https://github.com/shobhitsharma/embedder/example).

```js
var Embedder = require('embedder'); // OR import Embedder from 'embedder';
var embedder = new Embedder(); // OR const embedder = new Embedder();

embedder.load(<element[HTMLObject]>, <URL[string]>, <options[object]>);
```

Embedder automatically injects third-part social media SDKs once you include this to your project.

### Embed Options

The following options can be set once `.load` function is called:

| Parameter       | Type     | Default    | Description                                     |
| -------------   |----------|------------|-------------------------------------------------|
| `width`         | number   | null       | Sets width for container                        |
| `height`        | number   | null       | Sets height for container                       |
| `noresize`      | boolean  | false      | Automatically adjust element to center          |
| `scale`         | boolean  | false      | Makes embed element to contain within parent    |

### Example

```js
embedder.load(
  document.getElementById('twttr-tweet'),
  'https://twitter.com/Sh0bhit/status/797584590214926340',
  {
    width: 500,
    scale: true
  }
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

