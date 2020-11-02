/**
 * @file embedo.js
 *
 * Embedo is third party content embed plugin with features having events and resizing.
 * It provides a layer above popular social media sites native embed snippets
 * making it easier to hook content without modifying much code.
 *
 * @author Shobhit Sharma <hi@shobh.it>
 * @license MIT
 */

'use strict';
(function (root, factory) {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'define'.
  if (typeof define === 'function' && define.amd) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'define'.
    define(factory);
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
  } else if (typeof module === 'object' && module.exports) {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
    module.exports = factory();
  } else if (root) {
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    root.Embedo = window.Embedo = factory();
  }
})(this, function () {
  /**
   * @class Embedo Prototype
   *
   * @param {object} options Initialize options.
   */
  function Embedo(options: any) {
    // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
    this.options = options || Embedo.defaults.OPTIONS;
    // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
    this.requests = [];
    // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
    this.events = [];

    // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
    this.init(this.options);

    // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
    return this;
  }

  /**
   * @constant
   * Embedo defaults
   *
   * @description Embedo defaults contains basic configuration and values required to build internal engine.
   */
  Object.defineProperty(Embedo, 'defaults', {
    value: {
      OPTIONS: {
        facebook: null,
        twitter: false,
        instagram: false,
        pinterest: false
      },
      SOURCES: {
        facebook: {
          GLOBAL: 'FB',
          SDK: '//connect.facebook.net/${locale}/sdk.js',
          oEmbed: '//graph.facebook.com/${version}/oembed_${type}',
          REGEX: /(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?([\w\-]*)?/g,
          PARAMS: {
            version: 'v3.2',
            cookie: true,
            appId: null,
            access_token: null
          }
        },
        twitter: {
          GLOBAL: 'twttr',
          SDK: '//platform.twitter.com/widgets.js',
          oEmbed: '//publish.twitter.com/oembed',
          REGEX: /^http[s]*:\/\/[www.]*twitter(\.[a-z]+).*/i,
          PARAMS: {}
        },
        instagram: {
          GLOBAL: 'instgrm',
          SDK: '//www.instagram.com/embed.js',
          oEmbed: '//graph.facebook.com/${version}/instagram_oembed',
          REGEX: /(http|https)?:\/\/(www\.)?instagram.com\/p\/[a-zA-Z0-9_\/\?\-\=]+/gi,
          PARAMS: {
            version: 'v8.0',
            access_token: null
          }
        },
        youtube: {
          GLOBAL: null,
          SDK: null,
          oEmbed: '//www.youtube.com/embed/',
          REGEX: /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/,
          PARAMS: null
        },
        pinterest: {
          GLOBAL: 'PinUtils',
          SDK: '//assets.pinterest.com/js/pinit.js',
          oEmbed: null,
          REGEX: /(https?:\/\/(ww.)?)?pinterest(\.[a-z]+).*/i,
          PARAMS: {}
        },
        vimeo: {
          GLOBAL: null,
          SDK: null,
          oEmbed: '//vimeo.com/api/oembed.json',
          REGEX: /(http|https)?:\/\/(www\.)?vimeo(\.[a-z]+)\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|)(\d+)(?:|\/\?)/,
          PARAMS: {}
        },
        github: {
          GLOBAL: null,
          SDK: null,
          oEmbed: null,
          REGEX: /(http|https):\/\/gist\.github\.com\/(\w+)\/(\w+)/,
          PARAMS: {}
        },
        soundcloud: {
          GLOBAL: null,
          SDK: null,
          oEmbed: '//soundcloud.com/oembed',
          REGEX: /^(http|https):\/\/soundcloud\.com\/(\w+)\/.*$/,
          PARAMS: {}
        }
      },
      RESTRICTED: ['url', 'strict', 'height', 'width', 'centerize', 'jsonp']
    },
    writable: false,
    enumerable: true,
    configurable: false
  });

  // Application Logger
  Object.defineProperty(Embedo, 'log', {
    value: function log(type: any) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'debug' does not exist on type '(options:... Remove this comment to see the full error message
      if (!Embedo.debug) {
        return;
      }
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      if (typeof console !== 'undefined' && typeof console[type] !== 'undefined') {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        console[type].apply(console, Array.prototype.slice.call(arguments, 1));
      }
    },
    writable: false,
    enumerable: true,
    configurable: false
  });

  // Plugins Loader
  Object.defineProperty(Embedo, 'plugins', {
    value: function load(plugins: any) {
      if (!plugins) {
        return;
      }
      if (plugins instanceof Array) {
        plugins.forEach(function (plugin) {
          if (typeof plugin === 'function') {
            plugin(Embedo);
          }
        });
      } else if (plugins === 'fuction') {
        plugins(Embedo);
      }
    },
    writable: false,
    enumerable: true,
    configurable: false
  });

  /**
   * Helper utlities
   * @method utils
   *
   * @private
   */
  Object.defineProperty(Embedo, 'utils', {
    value: Object.create({
      /**
       * @function uuid
       */
      uuid: function uuid() {
        var primary = (Math.random() * 0x10000) | 0;
        var secondary = (Math.random() * 0x10000) | 0;
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'number'.
        primary = ('000' + primary.toString(36)).slice(-3);
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'number'.
        secondary = ('000' + secondary.toString(36)).slice(-3);
        return 'embedo_' + primary + secondary;
      },

      /**
       * @function extend
       * @returns {object}
       */
      extend: function extend(obj: any) {
        obj = obj || {};
        for (var i = 1; i < arguments.length; i++) {
          if (!arguments[i]) {
            continue;
          }
          for (var key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) {
              obj[key] = arguments[i][key];
            }
          }
        }
        return obj;
      },

      /**
       * @function merge
       *
       * @param {object} destination
       * @param {object} source
       * @param {array} preserve
       * @returns
       */
      merge: function merge(destination: any, source: any, preserve: any) {
        preserve = preserve || [];

        for (var property in source) {
          if (preserve.indexOf(property) === -1) {
            destination[property] = source[property];
          }
        }

        return destination;
      },

      /**
       * @func sequencer
       * Breaks down array into sequencer
       *
       * @param {Array} array
       * @param {Number} size
       * @returns
       */
      sequencer: function sequencer() {
        var args = arguments;
        return {
          then: function (done: any) {
            var counter = 0;
            for (var i = 0; i < args.length; i++) {
              args[i](callme);
            }

            function callme() {
              counter++;
              if (counter === args.length) {
                done();
              }
            }
          }
        };
      },

      /**
       * @func replacer
       * Replaces ${entity} with object key/value pair
       *
       * @param {string} str
       * @param {object} obj
       */
      replacer: function replacer(str: any, obj: any) {
        if (!str || !obj) {
          return;
        }
        if (obj) {
          for (var key in obj) {
            if (str) {
              str = str.split('${' + key + '}').join(obj[key]);
            }
          }
        }
        return str;
      },

      /**
       * @func observer
       *
       * Deferred Implementation for Object
       */
      observer: (function () {
        function Deferred() {
          // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
          this.resolved = [];
          // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
          this.rejected = [];
        }
        Deferred.prototype = {
          execute: function (list: any, args: any) {
            var i = list.length;
            args = Array.prototype.slice.call(args);
            while (i--) {
              list[i].apply(null, args);
            }
          },
          resolve: function () {
            this.execute(this.resolved, arguments);
          },
          reject: function () {
            this.execute(this.rejected, arguments);
          },
          done: function (callback: any) {
            this.resolved.push(callback);
            return this;
          },
          fail: function (callback: any) {
            this.rejected.push(callback);
            return this;
          }
        };
        return Deferred;
      })(),

      camelToSnake: function camelToSnake(str: any) {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      },

      /**
       * @function validateURL
       *
       * @param {string} url
       * @returns
       */
      validateURL: function validateURL(url: any) {
        return /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(url);
      },

      /**
       * @function generateElement
       * Generates DOM element
       *
       * @param {string} source
       * @param {object} attributes
       * @param {string} html
       * @returns HTMLElement
       */
      generateElement: function generateElement(type: any, attributes: any, html: any) {
        var el = document.createElement(type);
        Object.keys(attributes || {}).forEach(function (type) {
          el.setAttribute(type, attributes[type]);
        });
        if (html) {
          el.innerHTML = html;
        }
        return el;
      },

      /**
       * @function generateEmbed
       * Generates Embed Container
       *
       * @param {string} source
       * @param {string} html
       * @returns
       */
      generateEmbed: function generateEmbed(id: any, source: any, html: any) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
        id = id || Embedo.utils.uuid();
        var container = document.createElement('div');

        container.setAttribute('id', id);
        container.setAttribute('data-embedo-id', id);
        container.setAttribute('data-embedo-source', source);

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
        if (Embedo.utils.validateElement(html)) {
          container.appendChild(html);
        } else {
          container.innerHTML = html || '';
        }

        return container;
      },

      /**
       * @function generateScript
       * Generates script tag element
       *
       * @param {string} source
       * @returns HTMLElement
       */
      generateScript: function generateScript(source: any) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = encodeURI(source);
        script.setAttribute('async', '');
        script.setAttribute('charset', 'utf-8');
        return script;
      },

      /**
       * @function validateElement
       * Validates if passed argument is valid DOM element
       *
       * @param {object} obj
       * @returns HTMLElement
       */
      validateElement: function validateElement(obj: any) {
        return typeof HTMLElement === 'object'
          ? obj instanceof window.HTMLElement
          : obj &&
              typeof obj === 'object' &&
              obj !== null &&
              obj.nodeType === 1 &&
              typeof obj.nodeName === 'string';
      },

      /**
       * @function sdkReady
       * Checks when SDK global object is ready
       *
       * @param {string} type
       * @param {function} callback
       */
      sdkReady: function sdkReady(type: any, callback: any) {
        callback = callback || function () {};
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'defaults' does not exist on type '(optio... Remove this comment to see the full error message
        if (!Embedo.defaults.SOURCES[type]) {
          return callback(new Error('unsupported_sdk_type'));
        }
        var counter = 0;
        (function check() {
          counter++;
          if (counter > 15) {
            return callback(new Error(type + ':sdk_not_available'));
          }
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'defaults' does not exist on type '(optio... Remove this comment to see the full error message
          if (window[Embedo.defaults.SOURCES[type].GLOBAL]) {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'defaults' does not exist on type '(optio... Remove this comment to see the full error message
            return callback(null, window[Embedo.defaults.SOURCES[type].GLOBAL]);
          }
          setTimeout(check, 10 * counter);
          // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
        })(type);
      },

      /**
       * @function querystring
       * Object to Query String
       *
       * @param {object} obj
       * @returns {string}
       */
      querystring: function querystring(obj: any) {
        var parts = [];

        for (var i in obj) {
          if (obj.hasOwnProperty(i)) {
            parts.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]));
          }
        }

        return parts.join('&');
      },

      /**
       * @function fetch
       * JSONP XHR fetch
       *
       * @param {string} url
       * @param {object} options
       * @param {function} callback
       */
      fetch: function fetch(url: any, options: any, callback: any) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options = options || {};
        options.callback = options.callback || 'callback';
        var target = document.head || document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
        var jsonpCallback = 'jsonp_' + Embedo.utils.uuid();
        url += (~url.indexOf('?') ? '&' : '?') + options.callback + '=' + encodeURIComponent(jsonpCallback);
        url = url.replace('?&', '?');

        // @ts-expect-error ts-migrate(7015) FIXME: Element implicitly has an 'any' type because index... Remove this comment to see the full error message
        window[jsonpCallback] = function (data: any) {
          clear(jsonpCallback, script);
          callback(null, data);
        };

        script.type = 'text/javascript';
        script.defer = true;
        script.charset = 'UTF-8';
        script.onerror = function (err) {
          clear(jsonpCallback, script);
          return callback(err);
        };
        target.appendChild(script);
        script.src = url;

        function clear(jsonpCallback: any, script: any) {
          try {
            delete window[jsonpCallback];
          } catch (e) {
            // @ts-expect-error ts-migrate(2322) FIXME: Type 'undefined' is not assignable to type 'Window... Remove this comment to see the full error message
            window[jsonpCallback] = undefined;
          }
          if (script) {
            target.removeChild(script);
            script = undefined;
          }
        }
      },

      /**
       * XHR HTTP Requests
       *
       * @param {string} url
       * @param {object} options
       * @param {Function} callback
       */
      ajax: function ajax(url: any, options: any, callback: any) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        callback = callback || function () {};
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
          if (xhr.status >= 400) {
            return callback(new Error(xhr.responseText || xhr.statusText));
          }
          try {
            return callback(null, JSON.parse(xhr.responseText));
          } catch (e) {
            return callback(new Error('invalid_response'));
          }
        };
        xhr.onerror = function (err) {
          return callback(err);
        };
        xhr.open('GET', url);
        xhr.send();
      },

      /**
       * @function transform
       * Cross Browser CSS Transformation
       *
       * @param {HTMLElement} element
       * @param {string} props
       */
      transform: function transform(element: any, props: any) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
        if (!Embedo.utils.validateElement(element)) {
          return;
        }
        element.style.webkitTransform = props;
        element.style.MozTransform = props;
        element.style.msTransform = props;
        element.style.OTransform = props;
        element.style.transform = props;
      },

      /**
       * @function compute
       * Computes property value of HTMLElement
       *
       * @param {HTMLElement} el
       * @param {string} prop
       * @param {Boolean} stylesheet
       * @returns {Number}
       */
      compute: function compute(el: any, prop: any, is_computed: any) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
        if (!Embedo.utils.validateElement(el) || !prop) {
          return;
        }

        var bounds = el.getBoundingClientRect();
        var value = bounds[prop];

        if (is_computed || !value) {
          if (document.defaultView && document.defaultView.getComputedStyle) {
            value = document.defaultView.getComputedStyle(el, '').getPropertyValue(prop);
          } else if (el.currentStyle) {
            prop = prop.replace(/\-(\w)/g, function (m: any, p: any) {
              return p.toUpperCase();
            });
            value = el.currentStyle[prop];
          }
        }

        if (typeof value === 'string' && !/^\d+(\.\d+)?%$/.test(value)) {
          value = value.replace(/[^\d.-]/g, '');
        }

        return isNaN(Number(value)) ? value : Number(value);
      },

      /**
       * @method convertToPx
       * Calculates approximate pixel value for vw, vh or % values
       *
       * @implements relative_px
       * @implements percent_px
       */
      convertToPx: function convertToPx(el: any, prop: any, value: any) {
        if (!isNaN(Number(value))) {
          return Number(value);
        } else if (/^\d+(\.\d+)?%$/.test(value)) {
          return percent_px(el, prop, value);
        } else if (value.match(/(vh|vw)/)) {
          var dimension = value.replace(/[0-9]/g, '');
          return relative_px(dimension, value);
        }

        // Converts vw or vh to PX
        function relative_px(type: any, value: any) {
          var w = window,
            d = document,
            e = d.documentElement,
            g = d.body,
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight || e.clientHeight || g.clientHeight;

          if (type === 'vw') {
            return (x * parseFloat(value)) / 100;
          } else if (type === 'vh') {
            return (y * parseFloat(value)) / 100;
          } else {
            return undefined;
          }
        }

        // Converts % to PX
        function percent_px(el: any, prop: any, percent: any) {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
          var parent_width = Embedo.utils.compute(el.parentNode, prop, true);
          percent = parseFloat(percent);
          return parent_width * (percent / 100);
        }
      },

      /**
       * @function watcher
       *
       * @param {string} Identifer
       * @param {Function} Function to Trigger
       * @param {integer} timer
       *
       * @returns {Function}
       */
      watcher: function watcher(id: any, fn: any, timer: any) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'EMBEDO_WATCHER' does not exist on type '... Remove this comment to see the full error message
        window.EMBEDO_WATCHER = window.EMBEDO_WATCHER || {};
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'EMBEDO_WATCHER' does not exist on type '... Remove this comment to see the full error message
        window.EMBEDO_WATCHER[id] = window.EMBEDO_WATCHER[id] || {
          id: id,
          count: 0,
          request: null
        };

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'EMBEDO_WATCHER' does not exist on type '... Remove this comment to see the full error message
        if (window.EMBEDO_WATCHER[id].count > 0 && window.EMBEDO_WATCHER[id].request) {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'EMBEDO_WATCHER' does not exist on type '... Remove this comment to see the full error message
          window.EMBEDO_WATCHER[id].count -= 1;
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'EMBEDO_WATCHER' does not exist on type '... Remove this comment to see the full error message
          clearTimeout(window.EMBEDO_WATCHER[id].request);
        }

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'EMBEDO_WATCHER' does not exist on type '... Remove this comment to see the full error message
        window.EMBEDO_WATCHER[id].count += 1;
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'EMBEDO_WATCHER' does not exist on type '... Remove this comment to see the full error message
        window.EMBEDO_WATCHER[id].request = setTimeout(function () {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'EMBEDO_WATCHER' does not exist on type '... Remove this comment to see the full error message
          window.EMBEDO_WATCHER[id].count -= 1;
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'EMBEDO_WATCHER' does not exist on type '... Remove this comment to see the full error message
          if (window.EMBEDO_WATCHER[id].count === 0) {
            fn.call();
          }
        }, timer);

        return null;
      },

      /**
       * @function dimensions
       *
       * @param {HTMLElement} el
       * @param {string} width
       * @param {string} height
       *
       * @returns {object{width,height}}
       */
      dimensions: function dimensions(el: any, width: any, height: any) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
        var el_width = Embedo.utils.compute(el, 'width');
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
        width = width ? width : el_width > 0 ? el_width : Embedo.utils.compute(el.parentNode, 'width');
        height = height
          ? height
          : el_width > 0
          ? el_width / 1.5
          : // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
            Embedo.utils.compute(el.parentNode, 'height');
        return {
          width: width,
          height: height
        };
      },

      /**
       * @function centerize
       * Align an element center in relation to parent div
       *
       * @param {HTMLElement} parent_el
       * @param {HTMLElement} child_el
       * @param {object} options
       * @returns
       */
      centerize: function centerize(parent_el: any, child_el: any, options: any) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'log' does not exist on type '(options: a... Remove this comment to see the full error message
        Embedo.log('info', 'centerize', parent_el, child_el, options);
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
        if (!Embedo.utils.validateElement(parent_el) || !Embedo.utils.validateElement(child_el)) {
          return;
        }
        options = options || {};

        if (options.width) {
          parent_el.style.width = options.width;
          parent_el.style.maxWidth = options.width;
          parent_el.style.marginLeft = 'auto';
          parent_el.style.marginRight = 'auto';
        }

        if (options.height) {
          parent_el.style.height = options.height;
          parent_el.style.maxHeight = options.height;
        }

        child_el.style.display = '-moz-box';
        child_el.style.display = '-ms-flexbox';
        child_el.style.display = '-webkit-flex';
        child_el.style.display = '-webkit-box';
        child_el.style.display = 'flex';
        child_el.style.textAlign = 'center';
        child_el.style['justify-content'] = 'center';
        child_el.style['align-items'] = 'center';
        child_el.style.margin = '0 auto';
      },

      /**
       * @function handleScriptValidation
       *
       * @param {string} url
       */
      handleScriptValidation: function handleScriptValidation(url: any) {
        if (!url) {
          return;
        }
        url = url.split('#')[0];
        var scripts = document.getElementsByTagName('script');
        for (var i = scripts.length; i--; ) {
          if (scripts[i].src === url) {
            return true;
          }
        }
        return false;
      }
    }),
    writable: false,
    enumerable: true,
    configurable: false
  });

  /**
   * Embedo Event Listeners
   * @private
   *
   * @implements on
   * @implements off
   * @implements emit
   */
  Object.defineProperties(Embedo.prototype, {
    on: {
      value: function (event: any, listener: any) {
        if (typeof this.events[event] !== 'object') {
          this.events[event] = [];
        }
        this.events[event].push(listener);
      },
      writable: false,
      configurable: false
    },
    off: {
      value: function (event: any, listener: any) {
        var index;
        if (typeof this.events[event] === 'object') {
          index = this.events[event].indexOf(listener);
          if (index > -1) {
            this.events[event].splice(index, 1);
          }
        }
      },
      writable: false,
      configurable: false
    },
    emit: {
      value: function (event: any) {
        var i,
          listeners,
          length,
          args = [].slice.call(arguments, 1);
        if (typeof this.events[event] === 'object') {
          listeners = this.events[event].slice();
          length = listeners.length;

          for (i = 0; i < length; i++) {
            listeners[i].apply(this, args);
          }
        }
      },
      writable: false,
      configurable: false
    },
    once: {
      value: function (event: any, listener: any) {
        this.on(event, function g() {
          // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
          this.off(event, g);
          // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
          listener.apply(this, arguments);
        });
      },
      writable: false,
      configurable: false
    }
  });

  /**
   * @method init
   * Primary Embedo initialization
   *
   * @param {object} options Optional parameters.
   * @return callback
   */
  Embedo.prototype.init = function (options: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'log' does not exist on type '(options: a... Remove this comment to see the full error message
    Embedo.log('info', 'init', this.requests, options);

    // Append enabled SDKs to DOM
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'defaults' does not exist on type '(optio... Remove this comment to see the full error message
    Object.keys(Embedo.defaults.SOURCES).forEach(function (source) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'defaults' does not exist on type '(optio... Remove this comment to see the full error message
      if (Embedo.defaults.SOURCES[source].SDK) {
        appendSDK(source, options[source]);
      }
    });

    this.domify();

    /**
     * @func appendSDK
     * Injects SDK's to body
     * @private
     *
     * @param {*} type
     * @param {*} props
     */
    function appendSDK(type: any, props: any) {
      if (!type || !props) {
        return;
      }
      var sdk =
        props.sdk ||
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
        Embedo.utils.replacer(Embedo.defaults.SOURCES[type.toLowerCase()].SDK, {
          locale: props.locale || window.navigator.language || 'en_US'
        });

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
      if (!Embedo.utils.handleScriptValidation(sdk)) {
        if (props && typeof props === 'object') {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
          sdk += (type === 'facebook' ? '#' : '?') + Embedo.utils.querystring(props);
        }
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
        document.body.appendChild(Embedo.utils.generateScript(sdk));
      }
    }
  };

  /**
   * @method domify
   * Replaces "data-embedo-*" elements during initialization.
   */
  Embedo.prototype.domify = function domify() {
    var embedos = document.querySelectorAll('[data-embedo-url]');
    [].forEach.call(
      embedos,
      function (embedo_el: any) {
        var options = Object.keys(embedo_el.dataset || {}).reduce(function (acc, cur) {
          if (cur.indexOf('embedo') !== -1) {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
            var option = Embedo.utils.camelToSnake(cur).replace('embedo-', '');
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            acc[option] = embedo_el.dataset[cur];
          }
          return acc;
        }, {});

        // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
        this.render(embedo_el, options.url, options);
      }.bind(this)
    );
  };

  /**
   * @method facebook
   * Facebook embed prototype
   *
   * @param {number} id
   * @param {HTMLElement} element
   * @param {string} url
   * @param {object} options Optional parameters.
   * @return callback
   */
  Embedo.prototype.facebook = function facebook(
    id: any,
    element: any,
    url: any,
    options: any,
    callback: any
  ) {
    var type, fb_html_class;
    var globalOptions = this.options.facebook || {};

    if (/^([^\/?].+\/)?post|photo(s|\.php)[\/?].*$/gm.test(url)) {
      type = url.match(/comment_id|reply_comment_id/) ? 'comment' : 'post';
    } else if (/^([^\/?].+\/)?video(s|\.php)[\/?].*$/gm.test(url)) {
      type = 'video';
    }

    if (type && type.match(/post|video/)) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
      var embed_uri = Embedo.utils.replacer(Embedo.defaults.SOURCES.facebook.oEmbed, {
        version: globalOptions.version || 'v8.0',
        type: type
      });
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
      var query = Embedo.utils.merge(
        {
          url: encodeURI(url),
          access_token: globalOptions.access_token,
          omitscript: true
        },
        options,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'defaults' does not exist on type '(optio... Remove this comment to see the full error message
        Embedo.defaults.RESTRICTED
      );

      if ('width' in options || 'maxwidth' in options) {
        query.maxwidth = options.maxwidth || options.width;
      }

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
      embed_uri += '?' + Embedo.utils.querystring(query);

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
      Embedo.utils.fetch(embed_uri, function (error: any, content: any) {
        if (error) {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'log' does not exist on type '(options: a... Remove this comment to see the full error message
          Embedo.log('error', 'facebook', error);
          return callback(error);
        }
        handleFacebookEmbed(content.html);
      });
    } else {
      if (type === 'comment' || url.match(/comment_id|reply_comment_id/)) {
        fb_html_class = 'fb-comment-embed';
        options['data-numposts'] = options['data-numposts'] || 5;
      } else if (url.match(/plugins\/comments/)) {
        fb_html_class = 'fb-comments';
      } else {
        fb_html_class = 'fb-page';
        options['data-height'] = options['data-height'] || options.maxheight || options.height || 500;
      }

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
      var fb_html = Embedo.utils.generateElement(
        'div',
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
        Embedo.utils.merge(
          {
            class: fb_html_class,
            'data-href': url,
            'data-width': options['data-width'] || options.maxwidth || options.width || 350
          },
          options
        )
      );

      fb_html.removeAttribute('width');
      fb_html.removeAttribute('height');
      handleFacebookEmbed(fb_html);
    }

    function handleFacebookEmbed(html: any) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
      var container = Embedo.utils.generateEmbed(id, 'facebook', html);
      element.appendChild(container);

      facebookify(
        element,
        container,
        {
          id: id,
          url: url,
          strict: options.strict,
          width: options.width,
          height: options.height,
          centerize: options.centerize
        },
        function (err: any, result: any) {
          if (err) {
            return callback(err);
          }
          callback(null, {
            id: id,
            el: element,
            width: result.width,
            height: result.height
          });
        }
      );
    }
  };

  /**
   * Twitter embed prototype
   * @method twitter
   *
   * @param {number} id
   * @param {HTMLElement} element
   * @param {string} url
   * @param {object} options Optional parameters.
   * @return callback
   */
  Embedo.prototype.twitter = function twitter(id: any, element: any, url: any, options: any, callback: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'defaults' does not exist on type '(optio... Remove this comment to see the full error message
    var embed_uri = Embedo.defaults.SOURCES.twitter.oEmbed;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
    var query = Embedo.utils.merge(
      {
        url: encodeURI(url),
        omit_script: 1
      },
      options,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'defaults' does not exist on type '(optio... Remove this comment to see the full error message
      Embedo.defaults.RESTRICTED
    );

    if ('width' in options || 'maxwidth' in options) {
      query.maxwidth = options.maxwidth || options.width;
    }

    if ('height' in options || 'maxheight' in options) {
      query.maxheight = options.maxheight || options.height;
    }

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
    embed_uri += '?' + Embedo.utils.querystring(query);

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
    Embedo.utils.fetch(embed_uri, function (error: any, content: any) {
      if (error) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'log' does not exist on type '(options: a... Remove this comment to see the full error message
        Embedo.log('error', 'twitter', error);
        return callback(error);
      }
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
      var container = Embedo.utils.generateEmbed(id, 'twitter', content.html);
      element.appendChild(container);

      twitterify(
        element,
        container,
        {
          id: id,
          url: url,
          strict: options.strict,
          width: options.width,
          height: options.height,
          centerize: options.centerize
        },
        function (err: any, result: any) {
          if (err) {
            return callback(err);
          }
          callback(null, {
            id: id,
            el: element,
            width: result.width,
            height: result.height
          });
        }
      );
    });
  };

  /**
   * @method instagram
   * Instagram embed prototype
   *
   * @param {number} id
   * @param {HTMLElement} element
   * @param {string} url
   * @param {object} options Optional parameters.
   * @return callback
   */
  Embedo.prototype.instagram = function (id: any, element: any, url: any, options: any, callback: any) {
    var globalOptions = this.options.instagram || {};
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
    var embed_uri = Embedo.utils.replacer(Embedo.defaults.SOURCES.instagram.oEmbed, {
      version: globalOptions.version || 'v8.0'
    });
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
    var query = Embedo.utils.merge(
      {
        url: encodeURI(url),
        access_token: globalOptions.access_token,
        omitscript: true,
        hidecaption: true
      },
      options,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'defaults' does not exist on type '(optio... Remove this comment to see the full error message
      Embedo.defaults.RESTRICTED
    );

    if ('width' in options || 'maxwidth' in options) {
      options.width = options.maxwidth ? options.maxwidth : options.width;
      if (options.width > 320) {
        query.maxwidth = options.width;
      }
    }

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
    embed_uri += '?' + Embedo.utils.querystring(query);

    var method = options.jsonp ? 'jsonp' : 'ajax';

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
    Embedo.utils[method](
      embed_uri,
      function (err: any, content: any) {
        if (err) {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'log' does not exist on type '(options: a... Remove this comment to see the full error message
          Embedo.log('error', 'instagram', err);
          // If oembed or instagram embed script is unavailable.
          if (options.jsonp === undefined || options.jsonp === null) {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'defaults' does not exist on type '(optio... Remove this comment to see the full error message
            var extracted_url = url.match(Embedo.defaults.SOURCES.instagram.REGEX);
            url = extracted_url && extracted_url.length > 0 ? extracted_url[0].replace(/\/$/, '') : url;
            // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
            return this.iframe(id, element, url + '/embed/', options, callback);
          }
          return callback(err);
        }

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
        var container = Embedo.utils.generateEmbed(id, 'instagram', content.html);
        element.appendChild(container);

        instagramify(
          element,
          container,
          {
            id: id,
            url: url,
            strict: options.strict,
            width: options.width,
            height: options.height,
            centerize: options.centerize
          },
          function (err: any, result: any) {
            if (err) {
              return callback(err);
            }
            callback(null, {
              id: id,
              el: element,
              width: result.width,
              height: result.height
            });
          }
        );
      }.bind(this)
    );
  };

  /**
   * @method youtube
   * YouTube embed prototype
   *
   * @param {number} id
   * @param {HTMLElement} element
   * @param {string} url
   * @param {object} options Optional parameters.
   * @return callback
   */
  Embedo.prototype.youtube = function (id: any, element: any, url: any, options: any, callback: any) {
    if (!getYTVideoID(url)) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'log' does not exist on type '(options: a... Remove this comment to see the full error message
      Embedo.log('error', 'youtube', 'Unable to detect Youtube video id.');
      return callback('Unable to detect Youtube video id.');
    }

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'defaults' does not exist on type '(optio... Remove this comment to see the full error message
    var youtube_uri = Embedo.defaults.SOURCES.youtube.oEmbed + getYTVideoID(url);
    youtube_uri +=
      '?' +
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
      Embedo.utils.querystring(
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
        Embedo.utils.merge(
          {
            modestbranding: 1,
            autohide: 1,
            showinfo: 0
          },
          options,
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'defaults' does not exist on type '(optio... Remove this comment to see the full error message
          Embedo.defaults.RESTRICTED
        )
      );

    this.iframe(id, element, youtube_uri, options, callback);

    /**
     * @func getYTVideoID
     * @private
     *
     * @param {string} url
     * @returns {String|Boolean}
     */
    function getYTVideoID(url: any) {
      var regexp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
      var match = url.match(regexp);
      return match && match.length === 2 ? match[1] : false;
    }
  };

  /**
   * @method vimeo
   * Vimeo embed prototype
   *
   * @param {number} id
   * @param {HTMLElement} element
   * @param {string} url
   * @param {object} options Optional parameters.
   * @return callback
   */
  Embedo.prototype.vimeo = function (id: any, element: any, url: any, options: any, callback: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
    var size = Embedo.utils.dimensions(element, options.width, options.height);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
    var embed_options = Embedo.utils.merge(
      {
        url: url,
        width: size.width,
        height: size.height,
        autohide: 1
      },
      options,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'defaults' does not exist on type '(optio... Remove this comment to see the full error message
      Embedo.defaults.RESTRICTED
    );
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'defaults' does not exist on type '(optio... Remove this comment to see the full error message
    var embed_uri = Embedo.defaults.SOURCES.vimeo.oEmbed + '?' + Embedo.utils.querystring(embed_options);

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
    Embedo.utils.fetch(embed_uri, function (error: any, content: any) {
      if (error) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'log' does not exist on type '(options: a... Remove this comment to see the full error message
        Embedo.log('error', 'vimeo', error);
        return callback(error);
      }
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
      var container = Embedo.utils.generateEmbed(id, 'vimeo', content.html);
      element.appendChild(container);

      callback(null, {
        id: id,
        el: element,
        width: size.width,
        height: size.height
      });
    });
  };

  /**
   * @method pinterest
   * Pinterest Embed
   *
   * @param {number} id
   * @param {HTMLElement} element
   * @param {string} url
   * @param {object} options Optional parameters.
   * @return callback
   */
  Embedo.prototype.pinterest = function (id: any, element: any, url: any, options: any, callback: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
    var size = Embedo.utils.dimensions(element, options.width, options.height);
    var pin_size = size.width > 600 ? 'large' : size.width < 345 ? 'small' : 'medium';
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
    var pin_el = Embedo.utils.generateElement(
      'a',
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
      Embedo.utils.merge(
        {
          href: url,
          'data-pin-do': options['data-pin-do'] || 'embedPin',
          'data-pin-lang': options['data-pin-lang'] || 'en',
          'data-pin-width': pin_size
        },
        options
      )
    );
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
    var container = Embedo.utils.generateEmbed(id, 'pinterest', pin_el);

    element.appendChild(container);

    pinterestify(
      element,
      container,
      {
        id: id,
        url: url,
        strict: options.strict,
        width: options.width,
        height: options.height,
        centerize: options.centerize
      },
      function (err: any, result: any) {
        if (err) {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'log' does not exist on type '(options: a... Remove this comment to see the full error message
          Embedo.log('error', 'pinterest', err);
          return callback(err);
        }
        callback(null, {
          id: id,
          el: element,
          width: result.width,
          height: result.height
        });
      }
    );
  };

  /**
   * @method github
   * Embed github URLs (gist) to DOM
   *
   * @param {number} id
   * @param {HTMLElement} element
   * @param {string} url
   * @param {object} options Optional parameters.
   * @return callback
   */
  Embedo.prototype.github = function github(id: any, element: any, url: any, options: any, callback: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
    var size = Embedo.utils.dimensions(element, options.width, options.height);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
    var iframe = Embedo.utils.generateElement(
      'iframe',
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
      Embedo.utils.merge(
        {
          width: size.width,
          height: size.height
        },
        options,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'defaults' does not exist on type '(optio... Remove this comment to see the full error message
        Embedo.defaults.RESTRICTED
      )
    );
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
    var container = Embedo.utils.generateEmbed(id, 'github', iframe);

    element.appendChild(container);
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(
      '<body><style type="text/css">body,html{margin:0;padding:0;border-radius:3px;}' +
        '.gist .gist-file{margin:0 !important;padding:0;}</style>' +
        '<script src="' +
        url +
        '"></script>' +
        '</body>'
    );
    iframe.contentWindow.document.close();
    iframe.onerror = function (err: any) {
      callback(err);
    };
    iframe.addEventListener('load', function (event: any) {
      callback(null, {
        id: id,
        el: element,
        event: event,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
        width: Embedo.utils.compute(container, 'width'),
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
        height: Embedo.utils.compute(container, 'height')
      });
    });
  };

  /**
   * @method soundcloud
   * SoundCloud Embed Player (api-web) prototype
   *
   * @see https://developers.soundcloud.com/docs/oembed
   * @param {number} id
   * @param {HTMLElement} element
   * @param {string} url
   * @param {object} options Optional parameters.
   * @return callback
   */
  Embedo.prototype.soundcloud = function (id: any, element: any, url: any, options: any, callback: any) {
    if (options.hasOwnProperty('width') && options.width) {
      options.maxwidth = options.maxwidth || options.width || '100%';
    }
    if (options.hasOwnProperty('height') && options.height) {
      options.maxheight = options.maxheight || options.height;
    }
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
    var size = Embedo.utils.dimensions(element, options.maxwidth, options.maxheight);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
    var embed_options = Embedo.utils.merge(
      {
        url: encodeURI(url),
        format: 'js' // Defaults JSONP
      },
      options,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'defaults' does not exist on type '(optio... Remove this comment to see the full error message
      Embedo.defaults.RESTRICTED
    );
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'defaults' does not exist on type '(optio... Remove this comment to see the full error message
    var embed_uri = Embedo.defaults.SOURCES.soundcloud.oEmbed + '?' + Embedo.utils.querystring(embed_options);

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
    Embedo.utils.fetch(embed_uri, function (error: any, content: any) {
      if (error) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'log' does not exist on type '(options: a... Remove this comment to see the full error message
        Embedo.log('error', 'soundcloud', error);
        return callback(error);
      }
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
      var container = Embedo.utils.generateEmbed(id, 'soundcloud', content.html);
      element.appendChild(container);

      callback(null, {
        id: id,
        el: element,
        width: size.width,
        height: size.height
      });
    });
  };

  /**
   * @method iframe
   * Embed URLs to HTML5 frame prototype
   *
   * @param {number} id
   * @param {HTMLElement} element
   * @param {string} url
   * @param {object} options Optional parameters.
   * @return callback
   */
  Embedo.prototype.iframe = function (id: any, element: any, url: any, options: any, callback: any) {
    var fragment = document.createDocumentFragment();
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
    var size = Embedo.utils.dimensions(element, options.width, options.height);
    var extension = (url.substr(url.lastIndexOf('.')) || '').replace('.', '').toLowerCase();
    var mimes = {
      csv: 'text/csv',
      pdf: 'application/pdf',
      gif: 'image/gif',
      js: 'application/javascript',
      json: 'application/json',
      xhtml: 'application/xhtml+xml',
      pps: 'application/vnd.ms-powerpoint',
      ppsx: 'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
      xml: 'application/xml',
      ogg: 'video/ogg',
      mp4: 'video/mp4',
      webm: 'video/webm',
      html: 'text/html'
    };
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    var mimetype = mimes[extension] || mimes.html;
    var has_video = extension.match(/(mp4|ogg|webm|ogv|ogm)/);
    var el_type = has_video ? 'video' : options.tagName || 'embed';
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
    var override = Embedo.utils.merge({}, options, Embedo.defaults.RESTRICTED);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
    var embed_el = Embedo.utils.generateElement(
      el_type,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
      Embedo.utils.merge(
        {
          type: mimetype,
          src: url,
          width: size.width,
          height: size.height
        },
        override
      )
    );

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
    fragment.appendChild(Embedo.utils.generateEmbed(id, 'iframe', embed_el));
    element.appendChild(fragment);

    if (el_type === 'video') {
      setTimeout(function () {
        callback(null, {
          id: id,
          el: element,
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
          width: Embedo.utils.compute(embed_el, 'width'),
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
          height: Embedo.utils.compute(embed_el, 'height')
        });
      }, 250);
    } else {
      embed_el.onerror = function (err: any) {
        callback(err);
      };
      embed_el.addEventListener('load', function (event: any) {
        callback(null, {
          id: id,
          el: element,
          event: event,
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
          width: Embedo.utils.compute(embed_el, 'width'),
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
          height: Embedo.utils.compute(embed_el, 'height')
        });
      });
    }
  };

  /**
   * @method render
   * Renders an embedo instance
   *
   * @name load
   * @param {HTMLElement} element
   * @param {string} url
   * @param {object} options Optional parameters.
   * @return callback
   */
  Embedo.prototype.render = function (element: any, url: any, options: any, callback: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'log' does not exist on type '(options: a... Remove this comment to see the full error message
    Embedo.log('info', 'render', element, url, options);
    options = options || {};
    callback = callback || function () {};

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
    if (!element || !Embedo.utils.validateElement(element)) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'log' does not exist on type '(options: a... Remove this comment to see the full error message
      Embedo.log('info', 'render', '`element` is either missing or invalid');
      return this.emit('error', new Error('element_is_missing'));
    }

    if (typeof url !== 'string') {
      return this.emit('error', new Error('invalid_url_string'));
    }

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
    if (!url || !Embedo.utils.validateURL(url)) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'log' does not exist on type '(options: a... Remove this comment to see the full error message
      Embedo.log('info', 'render', '`url` is either missing or invalid');
      return this.emit('error', new Error('invalid_or_missing_url'));
    }

    var source = getURLSource(url);

    if (!source) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'log' does not exist on type '(options: a... Remove this comment to see the full error message
      Embedo.log('info', 'render', new Error('Invalid or Unsupported URL'));
      return this.emit('error', new Error('url_not_supported'));
    }

    if (!this[source]) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'log' does not exist on type '(options: a... Remove this comment to see the full error message
      Embedo.log('info', 'render', new Error('Requested source is not implemented or missing.'));
      return this.emit('error', new Error('unrecognised_url'));
    }

    if ('width' in options && options.width) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
      options.width = Embedo.utils.convertToPx(element, 'width', options.width);
    }

    if ('height' in options && options.height) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
      options.height = Embedo.utils.convertToPx(element, 'height', options.height);
    }

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
    var id = Embedo.utils.uuid();
    var request = {
      id: id,
      el: element,
      source: source,
      url: url,
      attributes: options
    };

    this.requests.push(request);

    this.emit('watch', 'load', request);

    this[source](
      id,
      element,
      url,
      options,
      function (err: any, data: any) {
        if (err) {
          // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
          this.emit('error', err);
          return callback(err);
        }
        data.url = request.url;
        data.source = request.source;
        data.options = request.attributes;

        // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
        this.emit('watch', 'loaded', data);
        callback(null, data);
      }.bind(this)
    );

    /**
     * @function getURLSource
     * Checks Source from URI
     *
     * @param {string} url
     * @returns {string}
     */
    function getURLSource(url: any) {
      var urlRegExp = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'defaults' does not exist on type '(optio... Remove this comment to see the full error message
      var sources = Object.keys(Embedo.defaults.SOURCES) || [];

      if (!urlRegExp.test(url)) {
        return null;
      }

      var matched_source = sources
        .filter(function (source) {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'defaults' does not exist on type '(optio... Remove this comment to see the full error message
          if (Embedo.defaults.SOURCES[source] && url.match(Embedo.defaults.SOURCES[source].REGEX)) {
            return source;
          }
        })
        .filter(Boolean);

      return matched_source && matched_source.length ? matched_source[0] : 'iframe';
    }
  };

  /**
   * @method load
   * Loads single or multiple embedo instances
   *
   * @name load
   * @param {HTMLElement} element
   * @param {String|Array} urls
   * @param {object} options Optional parameters.
   * @return callback
   */
  Embedo.prototype.load = function (element: any, urls: any, options: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'log' does not exist on type '(options: a... Remove this comment to see the full error message
    Embedo.log('info', 'load', element, urls, options);
    options = options || {};
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
    var observer = new Embedo.utils.observer();

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
    if (!element || !Embedo.utils.validateElement(element)) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'log' does not exist on type '(options: a... Remove this comment to see the full error message
      Embedo.log('info', 'load', '`element` is either missing or invalid');
      this.emit('error', new Error('element_is_missing'));
    } else {
      if (urls instanceof Array) {
        var reqs = {
          failed: [],
          finished: []
        };
        var jobs = urls.map(
          function (url: any) {
            return function (done: any) {
              // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
              this.render(element, url, options, function (err: any, data: any) {
                if (err) {
                  // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
                  reqs.failed.push(err);
                  return done(err);
                }
                // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
                reqs.finished.push(data);
                done(null, data);
              });
              // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
            }.bind(this);
          }.bind(this)
        );

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
        Embedo.utils.sequencer.apply(this, jobs).then(function () {
          if (reqs.failed.length > 0) {
            return observer.reject(reqs.failed);
          }
          observer.resolve(reqs.finished);
        });
      } else if (typeof urls === 'string') {
        this.render(element, urls, options, function (err: any, data: any) {
          if (err) {
            return observer.reject(err);
          }
          observer.resolve(data);
        });
      } else {
        this.emit('error', new Error('invalid_url_string'));
      }
    }

    return observer;
  };

  /**
   * @method refresh
   * Refresh single or all embedo instances
   *
   * @param {object} element
   */
  Embedo.prototype.refresh = function (element: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'log' does not exist on type '(options: a... Remove this comment to see the full error message
    Embedo.log('info', 'refresh', this.requests, element);
    if (this.requests.length === 0) {
      return;
    }
    this.requests.forEach(
      function (request: any) {
        if (!request.el) {
          return;
        }

        if (request.source === 'iframe') {
          // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
          return this.emit('refresh', request, {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
            width: Embedo.utils.compute(request.el, 'width'),
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
            height: Embedo.utils.compute(request.el, 'height')
          });
        }

        if (element) {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
          if (!Embedo.utils.validateElement(element)) {
            return;
          }
          if (element === request.el) {
            automagic(
              request.el,
              document.getElementById(request.id),
              request.attributes,
              function (err: any, data: any) {
                if (data) {
                  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
                  this.emit('refresh', request, data);
                }
                // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
              }.bind(this)
            );
          }
        } else {
          automagic(
            request.el,
            document.getElementById(request.id),
            request.attributes,
            function (err: any, data: any) {
              if (data) {
                // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
                this.emit('refresh', request, data);
              }
              // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
            }.bind(this)
          );
        }
      }.bind(this)
    );

    return this;
  };

  /**
   * @method destroy
   * Destroy an/all instance(s) of embedo
   *
   * @param {object} element
   */
  Embedo.prototype.destroy = function (element: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'log' does not exist on type '(options: a... Remove this comment to see the full error message
    Embedo.log('warn', 'destroy', this.requests, element);
    if (this.requests.length === 0) {
      return;
    }
    var removed: any = [];

    this.requests.forEach(
      function (request: any) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
        if (!request.el || !Embedo.utils.validateElement(request.el)) {
          return;
        }
        if (element) {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
          if (!Embedo.utils.validateElement(element)) {
            return;
          }
          if (element === request.el) {
            if (document.getElementById(request.id)) {
              // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
              document.getElementById(request.id).remove();
            }
            removed.push(request.id);
            // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
            this.emit('destroy', request);
          }
        } else {
          if (document.getElementById(request.id)) {
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            document.getElementById(request.id).remove();
          }
          removed.push(request.id);
          // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
          this.emit('destroy', request);
        }
      }.bind(this)
    );

    this.requests = this.requests.filter(function (request: any) {
      return removed.indexOf(request.id) < 0;
    });

    return this;
  };

  /**
   * @function facebookify
   * Parses Facebook SDK
   *
   * @param {HTMLElement} parentNode
   * @param {HTMLElement} childNode
   * @param {object} options
   */
  function facebookify(parentNode: any, childNode: any, options: any, callback: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
    Embedo.utils.sdkReady('facebook', function (err: any) {
      if (err) {
        return callback(err);
      }
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'FB' does not exist on type 'Window & typ... Remove this comment to see the full error message
      window.FB.XFBML.parse(parentNode);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'FB' does not exist on type 'Window & typ... Remove this comment to see the full error message
      window.FB.Event.subscribe('xfbml.render', function () {
        // First state will be `parsed` and then `rendered` to acknowledge embed.
        if (childNode.firstChild) {
          if (options.centerize !== false) {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
            Embedo.utils.centerize(parentNode, childNode, options);
          }
          if (childNode.firstChild.getAttribute('fb-xfbml-state') === 'rendered') {
            automagic(parentNode, childNode, options, callback);
          }
        }
      });
    });
  }

  /**
   * @function twitterify
   * Parses Twitter SDK
   *
   * @param {HTMLElement} parentNode
   * @param {HTMLElement} childNode
   * @param {object} options
   */
  function twitterify(parentNode: any, childNode: any, options: any, callback: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
    Embedo.utils.sdkReady('twitter', function (err: any) {
      if (err) {
        return callback(err);
      }
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'twttr' does not exist on type 'Window & ... Remove this comment to see the full error message
      window.twttr.widgets.load(childNode);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'twttr' does not exist on type 'Window & ... Remove this comment to see the full error message
      window.twttr.events.bind('rendered', function (event: any) {
        if (
          childNode.firstChild &&
          childNode.firstChild.getAttribute('id') === event.target.getAttribute('id')
        ) {
          if (options.centerize !== false) {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
            Embedo.utils.centerize(parentNode, childNode, options);
          }
          automagic(parentNode, childNode, options, callback);
        }
      });
    });
  }

  /**
   * @function instagramify
   * Parses Instagram SDK
   *
   * @param {HTMLElement} parentNode
   * @param {HTMLElement} childNode
   * @param {object} options
   */
  function instagramify(parentNode: any, childNode: any, options: any, callback: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
    Embedo.utils.sdkReady('instagram', function (err: any) {
      if (err) {
        return callback(err);
      }
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'instgrm' does not exist on type 'Window ... Remove this comment to see the full error message
      if (!window.instgrm.Embeds || !window.instgrm.Embeds) {
        return callback(new Error('instagram_sdk_missing'));
      }

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'instgrm' does not exist on type 'Window ... Remove this comment to see the full error message
      window.instgrm.Embeds.process(childNode);
      var instagram_embed_timer = setInterval(handleInstagramRendered, 250);

      function handleInstagramRendered() {
        if (childNode.firstChild && childNode.firstChild.className.match(/instagram-media-rendered/)) {
          clearInterval(instagram_embed_timer);
          if (options.centerize !== false) {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
            Embedo.utils.centerize(parentNode, childNode, options);
          }
          return automagic(parentNode, childNode, options, callback);
        }
      }
    });
  }

  /**
   * @function pinterestify
   * Parses Pinterest SDK
   *
   * @param {HTMLElement} parentNode
   * @param {HTMLElement} childNode
   * @param {object} options
   */
  function pinterestify(parentNode: any, childNode: any, options: any, callback: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
    Embedo.utils.sdkReady('pinterest', function (err: any) {
      if (err) {
        return callback(err);
      }
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'PinUtils' does not exist on type 'Window... Remove this comment to see the full error message
      if (!window.PinUtils || !window.PinUtils || !childNode || !childNode.firstChild) {
        return callback(new Error('pinterest_sdk_missing'));
      }

      setTimeout(function () {
        if (!childNode.querySelector('[data-pin-href]')) {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'PinUtils' does not exist on type 'Window... Remove this comment to see the full error message
          window.PinUtils.build(childNode);
        }

        var pinterest_embed_timer_count = 0;
        var pinterest_embed_timer = setInterval(function () {
          pinterest_embed_timer_count += 1;
          if (childNode.querySelector('[data-pin-href]')) {
            clearInterval(pinterest_embed_timer);
            if (options.centerize !== false) {
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
              Embedo.utils.centerize(parentNode, childNode, options);
            }
            return automagic(parentNode, childNode, options, callback);
          } else if (pinterest_embed_timer_count >= 20) {
            clearInterval(pinterest_embed_timer);
            return callback(new Error('pinterest_embed_failed'));
          }
        }, 250);
      }, 750);
    });
  }

  /**
   * @function automagic
   * Automagic - Scales and resizes embed container
   *
   * @param {HTMLElement} parentNode
   * @param {HTMLElement} childNode
   * @param {object} options
   */
  function automagic(parentNode: any, childNode: any, options: any, callback: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'log' does not exist on type '(options: a... Remove this comment to see the full error message
    Embedo.log('info', 'automagic', parentNode, childNode, options);
    options = options || {};
    callback = callback || function () {};

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
    if (!Embedo.utils.validateElement(parentNode) || !Embedo.utils.validateElement(childNode)) {
      return callback(new Error('HTMLElement does not exist in DOM.'));
    }

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
    Embedo.utils.watcher(
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
      options.id || Embedo.utils.uuid(),
      function () {
        var parent = {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
          width: options.width || Embedo.utils.compute(parentNode, 'width'),
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
          height: options.height || Embedo.utils.compute(parentNode, 'height')
        };
        var child = {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
          width: Embedo.utils.compute(childNode, 'width'),
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
          height: Embedo.utils.compute(childNode, 'height')
        };

        if (options.strict) {
          return callback(null, {
            width: parent.width,
            height: parent.height
          });
        }

        // Odd case when requested height is beyond limit of third party
        // Only apply when fixed width and heights are provided
        if (options.width && options.height) {
          var isOverflowing = child.width > parent.width || child.height > parent.height;

          if (options.width) {
            childNode.style.width = options.width + 'px';
          }

          if (options.height) {
            childNode.style.height = options.height + 'px';
          }

          if (isOverflowing) {
            var scale = Math.min(parent.width / child.width, parent.height / child.height);
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'utils' does not exist on type '(options:... Remove this comment to see the full error message
            Embedo.utils.transform(childNode, 'scale(' + scale + ')');
          }
        }

        callback(null, {
          width: parent.width,
          height: parent.height
        });
      },
      500
    );
  }

  return Embedo;
});
