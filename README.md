# embedo [![npm](https://img.shields.io/npm/v/embedo.svg)](https://npmjs.org/package/embedo) ![Bower](https://img.shields.io/bower/v/embedo.svg)

<img src="https://cdn01.onzu.com/2017/3/5/14/embedo.png" height="200" align="right">

> **Embedo** adds a layer on top of third party embed APIs while ensuring best practices and native guidelines for each component. It takes cares of resizing the container, emitting necessary events and with support for native and external options to be pass along.

### What's currently supported?

* Facebook URLs containing post, photos and videos
* Twitter URLs containing user timeline and tweets
* YouTube videos URLs, playlists will play in loop
* Instagram URLs containing posts and videos
* Pinterest URLs containing posts and pins
* Vimeo URLs containing videos
* Github URLs containing gists
* Google Maps URLs containing cordinates to a location
* Embeds other urls or .pdf, .mp4, .webm and many formats as alternative
* Embeds any URL that fulfils HTTP access control (CORS) policy

## Installation

```sh
# npm
$ npm install embedo --save

# yarn
$ yarn add embedo

# bower
$ bower install embedo
```

Alternatively, import using CDN while updating `version` as per requirements from any script below:

```html
<!--- unpkg -->
<script type="text/javascript" src="https://unpkg.com/embedo[@VERSION]/embedo.min.js"></script>

<!--- jsDelivr -->
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/embedo/embedo.min.js"></script>

<!--- CDNjs -->
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/embedo[/VERSION]/embedo.js"></script>
```

## Usage

Embedo supports AMD and CommonJS modules. Also, an example can be [found here](https://github.com/shobhitsharma/embedo/tree/master/docs/example).

```js
import Embedo from '/path/to/vendor';

const embedo = new Embedo();

embedo.load(<HTMLElement[object]>, <URL[string]>, <options[object]*optional>);
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

Try an example [here](https://codepen.io/shobhitsharma/pen/yojJZp).

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

## Events

Embedo also has internal event listeners implemented which emits following events:

| Listeners   | Methods  |  Description                                |
| ------------|----------|---------------------------------------------|
| `watch`     | on/once/off   |  When an element has loaded or size is modified in DOM|
| `refresh`   | on/once/off   |  When a refresh event is finished      |
| `destroy`   | on/once/off   |  When embedo instance(s) are destroyed |
| `error`     | on/once/off   |  Exception handler happened during embed |

They return basic details such as identifiers for request including width or height, and can be instantiated like this:

```js
embedo.on('watch', (result)=> {});
embedo.on('refresh', (request, result)=> {});
embedo.on('destroy', ()=> {});
embedo.on('error', (error)=> {});
```

## Example

```js
embedo.load(
  document.getElementById('my-element-id'),
  'https://twitter.com/Sh0bhit/status/797584590214926340'
);

embedo.load(
  document.getElementById('my-awesome-container'), [
  'https://www.instagram.com/p/BXQyu8Zh0dR',
  'https://www.instagram.com/p/BXOasjpBllf',
  'https://www.instagram.com/p/BXNRCkAhn-0'
], {
  hidecaption: false
});

// jQuery
embedo.load($('.my-unique-selector').get(0), 'https://www.youtube.com/watch?v=Q6gYFO4iGlk');
```

## Changelog

See [all releases](https://github.com/shobhitsharma/embedo/releases) with specs or necessary update logs.
