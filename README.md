# embedo [![npm](https://img.shields.io/npm/v/embedo.svg)](https://npmjs.org/package/embedo)

<img src="https://cdn01.onzu.com/2017/3/5/14/embedo.png" height="200" align="right">

> **Embedo** adds a layer on top of third party embed APIs while ensuring best practices and native guidelines for each component. It takes cares of resizing the container, emitting necessary events and with support for native and external options to be pass along.

### Docs: [Options](https://github.com/shobhitsharma/embedo/wiki/Options) / [API](https://github.com/shobhitsharma/embedo/wiki/API) / [Events](https://github.com/shobhitsharma/embedo/wiki/Events) / [Usage](https://github.com/shobhitsharma/embedo/wiki/Usage) / [Changelog](https://github.com/shobhitsharma/embedo/releases)

### What's currently supported?

- Facebook URLs containing page, post, photos, videos or comments
- Twitter URLs containing user timeline and tweets
- YouTube and Vimeo videos URLs
- Instagram URLs containing posts and videos
- Pinterest URLs containing board, profile and pins
- Github URLs containing gists
- Google Maps URLs containing cordinates to a location
- Embeds other urls like Soundcloud, Spotify or PDF, MP4, Webm, ... as `iframe`
- Embeds any URL that fulfils HTTP access control (CORS) policy
- Supports IE10+ and all modern browsers.

---

## Installation

#### NPM / Yarn

```sh
$ npm install embedo --save
$ yarn add embedo
```

#### Bower

```sh
$ bower install embedo
```

#### CDN

Alternatively, import using CDN while updating `version` as per requirements from any script below:

```html
<script type="text/javascript" src="https://unpkg.com/embedo/embedo.min.js"></script>
<script type="text/javascript" src="https://unpkg.com/embedo[@VERSION]/embedo.min.js"></script>
<script type="text/javascript" src="https://unpkg.com/embedo[@VERSION]/plugins/[@PLUGIN_NAME]/[@PLUGIN_NAME].embedo.min.js"></script>
```

## Setup

#### CommonJS / AMD

```js
import Embedo from '/path/to/vendor';

// Initialize once (prefer globally)
const embedo = new Embedo({
 facebook: {
    appId: 'my_app_id', // Enable facebook SDK
    version: 'v2.10'
  },
  twitter: true,  // Enable twitter SDK
  instagram: true,  // Enable instagram SDK
  pinterest: true  // Enable pinterest SDK,
  googlemaps: {
    key: 'my_api_key' // Enables google maps API
  }
});

// Then call .load() method from anywhere
embedo.load(<HTMLElement[object]>, <URL[string]>, <options[object]*optional>);

// OR Chaining methods and callback
embedo
  .load(HTMLElement, URL, options)
  .done(Function)
  .fail(Function)

// OR storing in a variable
let my_embedo = embedo.load(HTMLElement, URL)
my_embedo.done(Function);
my_embedo.fail(Function);
```

Also, an example can be [found here](https://codepen.io/shobhitsharma/pen/yojJZp).

#### HTML

```html
...

<body>
  <div data-embedo-url="[@URL_TO_EMBED]"></div>
  <div data-embedo-url="[@URL_TO_EMBED]" data-embedo-[@OPTION_KEY]]="[@OPTION_VALUE]"></div>
</body>

...

<script>
  new Embedo({
    facebook: {
      appId: 'my_app_id', // Enable facebook SDK
      version: 'v2.10'
    },
    twitter: true,  // Enable twitter SDK
    instagram: true,  // Enable instagram SDK
    pinterest: true  // Enable pinterest SDK,
    googlemaps: {
      key: 'my_api_key' // Enables google maps API
    }
  });
</script>
```

Also, an example can be [found here](https://github.com/shobhitsharma/embedo/blob/master/test/index.dom.html).
