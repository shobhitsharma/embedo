/**
 * @file flickr.embedo.js
 *
 * Embedo plugin to embed flickr.
 *
 * @author Shobhit Sharma <hi@shobh.it>
 * @license MIT
 */

'use strict';

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else if (root) {
    if (!root.Embedo || !window.Embedo) {
      throw Error('Embedo script is either not imported or not available.');
    }
    root.Embedo.Flickr = window.Embedo.Flickr = factory()(root.Embedo || window.Embedo);
  }
})(this, function () {
  /**
   * Embedo Flickr plugin
   * @class EmbedoFlickr
   *
   * @param {object} Embedo Class Instance
   */
  function EmbedoFlickr(Embedo) {
    if (!Embedo) {
      throw Error('Embedo instance as argument is missing.');
    }

    // Add `flickr` as source
    Embedo.defaults.SOURCES.flickr = {
      GLOBAL: null,
      SDK: 'https://embedr.flickr.com/assets/embedr-loader.js',
      oEmbed: '//www.flickr.com/services/oembed',
      REGEX: /(https?:\/\/(ww.)?)?flickr(\.[a-z]+).*/i,
      PARAMS: {}
    };

    /**
     * @method flickr
     * Flickr Embed
     *
     * @param {number} id
     * @param {HTMLElement} element
     * @param {string} url
     * @param {object} options Optional parameters.
     * @return callback
     */
    Object.defineProperty(Embedo.prototype, 'flickr', {
      value: function (id, element, url, options, callback) {
        var embed_uri = Embedo.defaults.SOURCES.flickr.oEmbed;
        var query = Embedo.utils.merge({
            url: encodeURI(url),
            format: 'json'
          },
          options,
          Embedo.defaults.RESTRICTED
        );

        if ('width' in options || 'maxwidth' in options) {
          query.maxwidth = options.maxwidth || options.width;
        }

        if ('height' in options || 'maxheight' in options) {
          query.maxheight = options.maxheight || options.height;
        }

        embed_uri += '?' + Embedo.utils.querystring(query);

        Embedo.utils.fetch(embed_uri, {
          callback: 'jsoncallback'
        }, function (error, data) {
          if (error) {
            Embedo.log('error', 'flickr', error);
            return callback(error);
          }
          var container = Embedo.utils.generateEmbed(id, 'flickr', data.html);
          var embed_el = container.querySelector('[data-flickr-embed]');
          if (embed_el) {
            embed_el.setAttribute('data-header', options.header || true);
            embed_el.setAttribute('data-footer', options.footer || true);
            embed_el.setAttribute('data-context', options.context || true);
          }
          element.appendChild(container);

          callback(null, Embedo.utils.extend({}, data, {
            id: id,
            el: element,
            width: options.width,
            height: options.height
          }));
        });
      },
      writable: false,
      enumerable: true,
      configurable: true
    });
  }

  return EmbedoFlickr;
});
