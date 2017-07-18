embedo [![CDNJS](https://img.shields.io/cdnjs/v/embedo.svg)](https://cdnjs.com/libraries/embedo) [![npm version](https://badge.fury.io/js/embedo.svg)](https://badge.fury.io/js/embedo)
=============

<img align="left" height="85"
     title="Embedo"
     src="https://cdn01.onzu.com/2017/3/5/14/embedo.png" style="margin-right: 25px;">

**Embedo** adds a layer on top of third party embed APIs while ensuring best practices and native guidelines for each component. It takes cares of resizing the container, emitting necessary events and with support for native and external options to be pass along.

It handles external SDKs, oEmbeds, adds responsivness and is intended to make easier integrations with less hassels or any setup.

## Install

```sh
# npm
$ npm install embedo --save

# Bower
$ bower install embedo
```

Alternatively, import latest versions hosted on CDNs via [jsDelivr](https://www.jsdelivr.com/projects/embedo), [cdnjs](https://cdnjs.com/libraries/embedo) or [latest unpkg](https://unpkg.com/embedo). It takes care of adding external scripts and necessary requirements to embed, and does checks if you've already added them already.

## Usage

Embedo supports AMD and CommonJS modules. Also, an example can be [found here](https://github.com/shobhitsharma/embedo/tree/master/docs/example).

```js
const Embedo = require('embedo'); // OR import Embedo from 'embedo';
const embedo = new Embedo(); // OR const embedo = new Embedo();

embedo.load(<HTMLElement[object]>, <URL[string]>, <options[object]*optional>);
```

### Initialize Options

The following options can be set during library import is called:

| Parameter       | Type     | Default    | Description                                    |
| -------------   |----------|------------|------------------------------------------------|
| `facebook`      | object/boolean   | null       | Injects Facebook SDK                           |
| `twitter`       | object/boolean  | true       | Injects Twitter SDK                            |
| `instagram`     | object/boolean  | true       | Injects Instagram SDK                          |
| `pinterest`     | object/boolean  | false      | Injects Pinterest SDK                          |
| `googlemaps`    | object/boolean   | null       | Injects Google Maps SDK                        |

For **YouTube** and **Vimeo**, no sdk is required. If you were to host any external URL with HTML or any other file, it will try to render after checking cross browser policies and other validations to an `<iframe>` or `<object>` tag.

### Advance Options

Since facebook and googlemaps require `appId` and `api_key` attributes for authorization, they can be passed along as:

```js
// Custom options for Facebook and Google Maps
new Embedo({
  facebook: {
    appId: 'my_app_id_here',
    version: 'v2.8',
    xfbml: false
  },
  googlemaps: {
    key: 'your_api_key'
  }
})
```

## Events

### .load()

The `.load()` function is all what you need to embed third party content. Since there are restrictions for sizes, that you can't bypass, an additonal functionality is added as **automagic** function which basically scales and add flex support to adjust content with assigned or detected size. It can be ignored by passing `{strict: true}` as option.

```js
embedo.load(<HTMLElement>, <URL|string>, <options|{}*optional>)
```

**Native Options**

| Parameter       | Type     | Default    | Description                                    |
| -------------   |----------|------------|------------------------------------------------|
| `width`      | number   | null      | Custom width of container (gets ignored if not supported via native embed API)    |
| `height`       | number   | null      | Custom height of container                       |
| `strict`     | boolean  | true      | Enabled/Disabled auto-resizing container                |

**External Options**

* Facebook - Supports `maxwidth`, `omitscript` ([API Reference](https://developers.facebook.com/docs/plugins/oembed-endpoints))
* Twitter - See **Parameters** section [here](https://dev.twitter.com/rest/reference/get/statuses/oembed)
* Instagram - Supports `hidecaption`, `maxwidth`, `omitscript` ([API Reference](https://www.instagram.com/developer/embedding/))
* YouTube - See **Supported Parameters** section [here](https://developers.google.com/youtube/player_parameters)
* Pinterest - See [API Reference](https://developers.pinterest.com/tools/widget-builder/)
* Google Maps - Supports `zoom` as integer and `mapTypeId` as enum as `roadmap|satellite|hybrid|terrain` ([API Reference](https://developers.google.com/maps/documentation/javascript/reference))

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

| Listeners   | Methods  |  Description                                |
| ------------|----------|---------------------------------------------|
| `watch`     | on/once/off   |  Updated element's properties and dimensions|
| `refresh`   | on/once/off   |  Triggers after an element refreshes      |
| `destroy`   | on/once/off   |  Triggers after emo destorys              |
| `error`     | on/once/off   |  Returns exception that occurs during load|

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

If you'd like to add some features or report bugs, pleaase feel free to fork, pull or create an issue for that concern.

```bash
# Local testing/development
$ npm start

# Build source
$ npm run build
```
