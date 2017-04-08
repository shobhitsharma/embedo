embedo [![CDNJS](https://img.shields.io/cdnjs/v/embedo.svg)](https://cdnjs.com/libraries/embedo) [![npm version](https://badge.fury.io/js/embedo.svg)](https://badge.fury.io/js/embedo)
=============

<img align="left" height="72"
     title="Embedo"
     src="https://cdn01.onzu.com/2017/3/5/14/embedo.png" style="margin-right: 20px;">

Embedo is a simple, fast, lightweight and standalone library which lets you embed third-party content without any setup for oembed or SDK's. It handles resizing and emit necessary events which eases the implementation. 

Since there are lot of complications when it comes to embed external content, and developers usually endup in writing bits and pieces of code which usually doesnt work or future-proof; to overcome this hassle, Embedo creates a layer on top of embed libraries by implementing the necessary guidelines and verfiying schmea to embed a content. There are even paid services and really more advanced embed libaries available but its the matter of simplicity, trust, script size and speed of code to be included in your beloved web component.

## Install

```sh
# npm Module
$ npm install embedo --save

# Bower
$ bower install embedo
```

Alternatively, import using CDN [jsDelivr](https://www.jsdelivr.com/projects/embedo), [cdnjs](https://cdnjs.com/libraries/embedo) or [latest unpkg](https://unpkg.com/embedo) links.

## Usage

Embedo supports AMD and CommonJS modules. Also, an example can be [found here](https://github.com/shobhitsharma/embedo/tree/master/example).

```js
const Embedo = require('embedo'); // OR import Embedo from 'embedo';
const embedo = new Embedo(); // OR const embedo = new Embedo();

embedo.load(<HTMLElement[object]>, <URL[string]>, <options[object]>);
```

Embedo automatically injects third-part social media SDKs once you include this to your project.

### Initialize Options

The following options can be set during library import is called:

| Parameter       | Type     | Default    | Description                                    |
| -------------   |----------|------------|------------------------------------------------|
| `facebook`      | number   | true      | Injects Facebook SDK                            |
| `twitter`       | number   | true      | Injects Twitter SDK                             |
| `instagram`     | boolean  | true      | Injects Instagram SDK                           |
| `youtube`       | boolean  | n/a       | Injects YouTube oEmbed                          |
| `pinterest`     | boolean  | false     | Injects Pinterest SDK                           |

If any other website URL is added, then it will simply create an iframe and append to the container while checking cross origin policies and provided parameters.

### Advance Options

For facebook, if you need to use your own appId, or version, you can declate this instead of `boolean` with an `object` in snippet below. This will override Embedo's defaults.

```js
// Overriding Facebook
new Embedo({
  facebook: {
    appId: 'my_app_id_here',
    version: 'v2.8',
    xfbml: false
  }
})

```

## Events

### .load()

The `.load()` function is all what you need to embed third party content.
There is an **automagic** function which translates the embedded content to fit and centerize the parent container if `width` or `height` is provided. 
If `strict: true` option is passed, then it will be ignored.

```js
embedo.load(<HTMLElement>, <URL|string>, <options|{}>)
```

**Native Options**

| Parameter       | Type     | Default    | Description                                    |
| -------------   |----------|------------|------------------------------------------------|
| `width`      | number   | null      | Custom width of container                           |
| `height`       | number   | null      | Custom height of container                        |
| `strict`     | boolean  | true      | Enables/Disbaled Automagic feature                  |

**External Options**

* Facebook - Supports `maxwidth`, `omitscript` ([API Reference](https://developers.facebook.com/docs/plugins/oembed-endpoints))
* Twitter - See **Parameters** section [here](https://dev.twitter.com/rest/reference/get/statuses/oembed)
* Instagram - Supports `hidecaption`, `maxwidth`, `omitscript` ([API Reference](https://www.instagram.com/developer/embedding/))
* YouTube - See **Supported Parameters** section [here](https://developers.google.com/youtube/player_parameters)
* Pinterest - See [API Reference](https://developers.pinterest.com/tools/widget-builder/)

### .refresh()

The `embedo.refresh()` method can be called explicitly when you have a `change` or `resize` event, which re-calculates the dimensions of generated content.

```js
// Refresh single container
embedo.refresh(document.getElementById('my-element-id'));

// Refresh all embedo instances
embedo.refresh();
```

### .destroy()

The `embedo.destroy()` method can be called explicitly when wish to remove and unbind embedo instance(s).

```js
// Destroy single container
embedo.destroy(document.getElementById('my-element-id'));

// Destroys all embedo instances
embedo.destroy();
```

### Event Listeners

Embedo also has internal event listeners implemented which emits following events:

```js
// Watch Event
embedo.on('watch', function (result) {
  console.log(result); // Returns element and its dimensions
});

// Refresh Event
embedo.on('refresh', function (request, result) {
  console.log(request, result); // Returns request meta and dimensions
});

// Error Handler
embedo.on('error', function (error) {
  console.error(error); // Emits in case of invalid request or an exception
});

// Destroy Event
embedo.on('destroy', function () {
  // Do something when embedo destroys
});
```

## Example

```js
embedo.load(
  document.getElementById('my-element-id'),
  'https://twitter.com/Sh0bhit/status/797584590214926340'
);

// jQuery
embedo.load($('.my-unique-selector').get(0), 'https://www.youtube.com/watch?v=Q6gYFO4iGlk');
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

