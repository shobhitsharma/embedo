/**
 * @file Embedder JS
 *
 * @author Shobhit Sharma <hi@shobh.it>
 */

(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    global.Embedder = window.Embedder = factory();
  }
})(this, function () {
  'use strict';

  /**
   * Embedder Prototype
   *
   * @class
   * @param {object} options Initialize options.
   */
  function Embedder(options) {
    this.options = options || {};

    this.init(this.options);

    return this;
  }

  Embedder.defaults = {
    FACEBOOK: {
      color: '#3b5999',
      SDK: '//connect.facebook.net/es_LA/sdk.js',
      oEmbed: 'https://www.facebook.com/plugins/facebook/oembed.json',
      REGEX: /^http[s]*:\/\/[www.]*facebook\.com.*/i
    },
    TWITTER: {
      color: '#55acee',
      SDK: '//platform.twitter.com/widgets.js',
      oEmbed: 'https://publish.twitter.com/oembed',
      REGEX: /^http[s]*:\/\/[www.]*twitter\.com.*/i
    },
    INSTAGRAM: {
      color: '#3f729b',
      SDK: '//platform.instagram.com/en_US/embeds.js',
      oEmbed: 'https://api.instagram.com/oembed',
      REGEX: /^http[s]*:\/\/[www.]*instagram\.com.*/i
    },
    YOUTUBE: {
      color: '#cd201f',
      SDK: null,
      oEmbed: 'https://www.youtube.com/embed/',
      REGEX: /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/
    }
  };

  /**
   * Embedder Methods
   *
   * @mixin
   * @implements compile
   * @implements transform
   */
  Embedder.prototype = {

    /**
     * @method Facebook Embed
     *
     * @name facebook
     * @function
     * @param {object} options Optional parameters.
     * @return callback
     */
    facebook: function (url, options, callback) {
      var embed_uri = Embedder.defaults.FACEBOOK.oEmbed;
      var query = {
        url: encodeURI(url),
        omitscript: true
      };

      if (options.width && parseInt(options.width) > 0) {
        query.maxwidth = options.width;
      }

      embed_uri += '?' + toQueryString(query);

      fetch(embed_uri, function (error, content) {
        if (error) {
          return callback(error);
        }
        callback(null, content.html);
      });
    },

    /**
     * @method Twitter Embed
     *
     * @name twitter
     * @function
     * @param {object} options Optional parameters.
     * @return callback
     */
    twitter: function (url, options, callback) {
      var embed_uri = Embedder.defaults.TWITTER.oEmbed;
      var query = {
        url: encodeURI(url),
        omit_script: 1
      };

      if (options.width && parseInt(options.width) > 0) {
        query.maxwidth = options.width;
      }

      embed_uri += '?' + toQueryString(query);

      fetch(embed_uri, function (error, content) {
        if (error) {
          return callback(error);
        }
        callback(null, content.html);
      });
    },

    /**
     * @method Instagram Embed
     *
     * @name instagram
     * @function
     * @param {object} options Optional parameters.
     * @return callback
     */
    instagram: function (url, options, callback) {
      var embed_uri = Embedder.defaults.INSTAGRAM.oEmbed;
      var query = {
        url: encodeURI(url),
        omitscript: true,
        hidecaption: true
      };

      if (options.width && parseInt(options.width) > 0) {
        query.maxwidth = options.width;
      }

      embed_uri += '?' + toQueryString(query);

      fetch(embed_uri, function (error, content) {
        if (error) {
          return callback(error);
        }
        callback(null, content.html);
      });
    },

    /**
     * @method YouTube Embed
     *
     * @name youtube
     * @function
     * @param {object} options Optional parameters.
     * @return callback
     */
    youtube: function (url, options, callback) {
      function getYTVideoID(url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = url.match(regExp);
        return (match && match[7].length == 11) ? match[7] : false;
      }

      var embed_uri = Embedder.defaults.YOUTUBE.oEmbed;
      var video_id = '';
      var query = {
        url: encodeURI(url),
        modestbranding: 1,
        autohide: 1,
        showinfo: 0,
        controls: 0
      };

      if (options.width && parseInt(options.width || 0) > 10) {
        query.width = options.width;
      }

      if (options.height && parseInt(options.height || 0) > 10) {
        query.height = options.height;
      }

      if (!getYTVideoID(url)) {
        return callback(new Error('Unable to detect Youtube video id.'));
      }

      embed_uri += video_id + '?' + toQueryString(query);

      callback(null, '<iframe src="' + embed_uri + '" frameborder="0" allowtransparency="true"></iframe>');
    }

  };

  /**
   * @method Initialize auth component
   *
   * @name init
   * @function
   * @param {object} options Optional parameters.
   * @return callback
   */
  Embedder.prototype.init = function (options) {
    console.log('Embedder Initialized..', options);
    document.body.appendChild(generateSDK(Embedder.defaults.FACEBOOK.SDK));
    document.body.appendChild(generateSDK(Embedder.defaults.TWITTER.SDK));
    document.body.appendChild(generateSDK(Embedder.defaults.INSTAGRAM.SDK));
  };

  /**
   * @method Initialize auth component
   *
   * @name init
   * @function
   * @param {object} options Optional parameters.
   * @return callback
   */
  Embedder.prototype.load = function (element, url, options) {
    console.log('Embedder Loaded..', element, url, options);
    options = options || {};

    if (!element || !validateElement(element)) {
      console.error('`element` is either missing or invalid');
      return;
    }

    var source = getURLSource(url);

    if (!source) {
      console.error(new Error('Invalid or Unsupported URL'));
      return;
    }

    this[source](url, options, function (err, html) {
      if (err) {
        console.error(err);
        return;
      }
      element.innerHTML = html;
    });

    function twttr_check() {
      if (window.twttr) {
        window.twttr.widgets.load();
      } else {
        setTimeout(twttr_check, 100);
      }
    }
  };

  /**
   * @method Initialize auth component
   *
   * @name init
   * @function
   * @param {object} options Optional parameters.
   * @return callback
   */
  Embedder.prototype.resize = function (options) {
    console.log('Embedder Loaded..', options);

  };

  function generateSDK(source) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = encodeURI(source);
    script.setAttribute('async', '');
    script.setAttribute('defer', '');
    script.setAttribute('charset', 'utf-8');

    return script;
  }

  function validateElement(obj) {
    try {
      return obj instanceof HTMLElement;
    } catch (e) {
      return (typeof obj === "object") &&
        (obj.nodeType === 1) && (typeof obj.style === "object") &&
        (typeof obj.ownerDocument === "object");
    }
  }

  function getURLSource(url) {
    var type;
    var urlRegExp = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

    if (!urlRegExp.test(url)) {
      return;
    }

    if (url.match(Embedder.defaults.FACEBOOK.REGEX)) {
      return 'facebook';
    } else if (url.match(Embedder.defaults.TWITTER.REGEX)) {
      return 'twitter';
    } else if (url.match(Embedder.defaults.INSTAGRAM.REGEX)) {
      return 'instagram';
    } else if (url.match(Embedder.defaults.YOUTUBE.REGEX)) {
      return 'youtube';
    }
  }

  function literalize(value) {
    var props = {
      'NaN': NaN,
      'null': null,
      'undefined': undefined,
      'Infinity': Infinity,
      '-Infinity': -Infinity
    };

    return ((value in props) ? props[value] : value);
  }

  function toQueryString(obj) {
    var parts = [];
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        parts.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]));
      }
    }
    return parts.join('&');
  }

  function fetch(url, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    options = options || {};

    var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    window[callbackName] = function (data) {
      delete window[callbackName];
      document.body.removeChild(script);
      callback(null, data);
    };

    var script = document.createElement('script');
    script.type = 'application/javascript';
    script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
    document.body.appendChild(script);
  }

  return Embedder;
});
