embedo [![CDNJS](https://img.shields.io/cdnjs/v/embedo.svg)](https://cdnjs.com/libraries/embedo) [![npm version](https://badge.fury.io/js/embedo.svg)](https://badge.fury.io/js/embedo)
=============

<img align="left" height="85"
     title="Embedo"
     src="https://cdn01.onzu.com/2017/3/5/14/embedo.png" style="margin-right: 25px;">

**Embedo** adds a layer on top of third party embed APIs while ensuring best practices and native guidelines for each component. It takes cares of resizing the container, emitting events and supports external options to be passed along. 

It handles external SDK code, jsonp fetching, adds responsivness and is intended to make easier integrations with less hassels.

## Install

```sh
# npm
$ npm install embedo --save

# Bower
$ bower install embedo
```

Alternatively, import latest versions hosted on CDNs via [jsDelivr](https://www.jsdelivr.com/projects/embedo), [cdnjs](https://cdnjs.com/libraries/embedo) or [latest unpkg](https://unpkg.com/embedo). It takes care of adding external scripts and necessary requirements to embed, and does check if you've already added some resources.

## Usage

Embedo supports AMD and CommonJS modules. Also, an example can be [found here](https://github.com/shobhitsharma/embedo/tree/master/example).

```js
const Embedo = require('embedo'); // OR import Embedo from 'embedo';
const embedo = new Embedo(); // OR const embedo = new Embedo();

embedo.load(<HTMLElement[object]>, <URL[string]>, <options[object]*optional>);
```

### Initialize Options

The following options can be set during library import is called:

| Parameter       | Type     | Default    | Description                                    |
| -------------   |----------|------------|------------------------------------------------|
| `facebook`      | boolean/object | true | Injects Facebook SDK                            |
| `twitter`       | boolean  | true       | Injects Twitter SDK                             |
| `instagram`     | boolean  | true       | Injects Instagram SDK                           |
| `youtube`       | boolean  | n/a        | Injects YouTube oEmbed                          |
| `pinterest`     | boolean  | false      | Injects Pinterest SDK                           |

For YouTube and Vimeo, no setup is required. If you were to hose any external URL (for example GoogleMaps URL) or API, then it will fallback to jsonp fetch, and if found `{DATA}.html` attribute from URI, it will load accordingly, or it will just load it in an object frame as HTML while checking cross origin support.

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

The `.load()` function is all what you need to embed third party content. Since there are restrictions for sizes, that you can't bypass, an additonal functionality is added as **automagic** function which basically scales and add flex support to adjust content with assigned or detected size.

```js
embedo.load(<HTMLElement>, <URL|string>, <options|{}*optional>)
```

**Native Options**

| Parameter       | Type     | Default    | Description                                    |
| -------------   |----------|------------|------------------------------------------------|
| `width`      | number   | null      | Custom width of container                           |
| `height`       | number   | null      | Custom height of container                        |
| `strict`     | boolean  | true      | Enables/Disbaled Automagic feature                  |
| `utility`     | boolean  | true      | Enables/Disbaled Automagic feature                  |

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

| Listeners   | Methods  | Parameters    | Description                                |
| ------------|----------|------------|-----------------------------------------------|
| `watch`     | on/off   | result      | Updated element's properties and dimensions  |
| `refresh`   | on/off   | request, result | Triggers after an element refreshes      |
| `destroy`   | on/off   | null      | Triggers after emo destorys                    |
| `error`     | on/off   | error      | Returns exception that occurs during load     |

They can be instantiated like this:

```js
embedo.on('watch', function (result) {});
embedo.on('refresh', function (request, result) {});
embedo.on('error', function (error) {});
embedo.on('destroy', function () {});
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

If you'd like to report issue or suggest some features, feel free to create an issue and that shall be gladly taken care of. Since it has been used in few procution apps/websites, regular maintenance is expected.

```bash
$ npm start
$ npm run build
```

