# embedo [![npm](https://img.shields.io/npm/v/embedo.svg)](https://npmjs.org/package/embedo) ![Bower](https://img.shields.io/bower/v/embedo.svg)

<img src="https://cdn01.onzu.com/2017/3/5/14/embedo.png" height="200" align="right">

> **Embedo** adds a layer on top of third party embed APIs while ensuring best practices and native guidelines for each component. It takes cares of resizing the container, emitting necessary events and with support for native and external options to be pass along.

### What's currently supported?

* Facebook URLs containing post, photos and videos
* Twitter URLs containing user timeline and tweets
* YouTube videos URLs, playlists will play in loop
* Instagram URLs containing posts and videos
* Pinterest URLs containing board, profile and pins
* Vimeo URLs containing videos
* Github URLs containing gists
* Google Maps URLs containing cordinates to a location
* Embeds other urls or .pdf, .mp4, .webm and many formats as alternative
* Embeds any URL that fulfils HTTP access control (CORS) policy
* Supports IE9+ and all modern browsers.

## Installation

```sh
$ npm install embedo --save
$ yarn add embedo
$ bower install embedo
```

Alternatively, import using CDN while updating `version` as per requirements from any script below:

```html
<script type="text/javascript" src="https://unpkg.com/embedo/embedo.min.js"></script>
<script type="text/javascript" src="https://unpkg.com/embedo[@VERSION]/embedo.min.js"></script>
```

## Usage

Embedo supports AMD and CommonJS modules. For detailed resources, [read wiki here](https://github.com/shobhitsharma/embedo/wiki).

```js
import Embedo from '/path/to/vendor';

const embedo = new Embedo(options); // Initialize once (prefer globally)

// Then call .load() method from anywhere
embedo.load(<HTMLElement[object]>, <URL[string]>, <options[object]*optional>);

// Chaining methods and callback
embedo
  .load(HTMLElement, URL, options)
  .done(Function)
  .fail(Function)

// OR storing in a variable
let my_embedo = embedo.load(HTMLElement, URL)
my_embedo.done(Function);
my_embedo.fail(Function);
```

### Initialize SDKs

The following options can be set during library import is called, they automatically inject required SDK snippets to DOM while checking existing ones:

| Parameter       | Type     | Default    | Description                                    |
| -------------   |----------|------------|------------------------------------------------|
| `facebook`      | object/boolean   | null       | Injects Facebook SDK                           |
| `twitter`       | object/boolean  | false       | Injects Twitter SDK                            |
| `instagram`     | object/boolean  | false       | Injects Instagram SDK                          |
| `pinterest`     | object/boolean  | false      | Injects Pinterest SDK                          |
| `googlemaps`    | object/boolean   | null       | Injects Google Maps SDK                        |

For **Github**, **YouTube**, **Vimeo** and others no sdk is required. If you were to host any external URL with HTML or any other file, it will try to render after checking cross browser policies and other validations to an `<embed>` or `<object>` tag.

Try an example on [jsfiddle here](https://jsfiddle.net/shobhitsharma/wpajz4x9).

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
### .load() Call

The `.load()` function is all what you need to embed third party content given under following arguments. 

```js
embedo.load(<HTMLElement{}>, <URL[string|Array]>, <options[{}*optional]>)
```

Due to incongruent third party restrictions regarding sizes, additional functionality called `automagic` is added, which basically auto-scales the container to fit within DOM without overflowing (enabled by default unless `strict` is set to `true`). 

For single instance with same arguments, `.render(el, url, options, callback)` function can also be used.


## Options

The `options` are native and external based as described below: 

**Native Options**

| Parameter       | Type     | Default    | Description                                    |
| -------------   |----------|------------|------------------------------------------------|
| `width`      | number   | null      | Custom width of container (gets ignored if not supported via SDK)    |
| `height`       | number   | null      | Custom height of container (gets ignored if not supported via SDK)                       |
| `strict`     | boolean  | false      | Enable or disable auto-resizing functionality                |

**External Options**

* Facebook - Supports `maxwidth`, `omitscript` ([API Reference](https://developers.facebook.com/docs/plugins/oembed-endpoints))
* Twitter - See **Parameters** section [here](https://dev.twitter.com/rest/reference/get/statuses/oembed)
* Instagram - Supports `hidecaption`, `maxwidth`, `omitscript` ([API Reference](https://www.instagram.com/developer/embedding/))
* YouTube - See **Supported Parameters** section [here](https://developers.google.com/youtube/player_parameters)
* Pinterest - See [API Reference](https://developers.pinterest.com/tools/widget-builder/)
* Google Maps - Supports `zoom` as integer and `mapTypeId` as enum as `roadmap|satellite|hybrid|terrain` ([API Reference](https://developers.google.com/maps/documentation/javascript/reference))

## Methods

Embedo exposes following functions that you need after including the library:
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

## Event Listeners

Embedo has internal event listeners implemented which emits following events:

| Listeners   | Methods  |  Description                                |
| ------------|----------|---------------------------------------------|
| `watch`     | on/once/off   |  When an element has loaded or size is modified in DOM|
| `refresh`   | on/once/off   |  When a refresh event is finished      |
| `destroy`   | on/once/off   |  When embedo instance(s) are destroyed |
| `error`     | on/once/off   |  Exception handler happened during embed |

During lifecycle of Embedo class, all instances are stored in memory to emit and handle necessary events for DOM. They listen to any change in size, destroyed or refreshed instances all in once place. The arguments contain meta data which helps to log and understand which particular instance has been called.

```js
embedo.on('watch', (request) => {});
embedo.on('refresh', (request, data) => {});
embedo.on('destroy', (request) => {});
embedo.on('error', (error) => {});
```

## Example

```js
embedo.load(
  document.getElementById('my-element-id'),
  'https://twitter.com/Sh0bhit/status/797584590214926340'
);

embedo.load(
  document.getElementById('my-awesome-container'), 
  [
    'https://www.instagram.com/p/BXQyu8Zh0dR',
    'https://www.instagram.com/p/BXOasjpBllf',
    'https://www.instagram.com/p/BXNRCkAhn-0'
  ], 
  {
    hidecaption: false
  }
).done(function (data) {
  console.log(data);
});

// jQuery
embedo.load($('.my-unique-selector').get(0), 'https://www.youtube.com/watch?v=Q6gYFO4iGlk');
```

## Changelog

See [all releases](https://github.com/shobhitsharma/embedo/releases) with specs or necessary update logs.
