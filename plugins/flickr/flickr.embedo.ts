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
    if (!root.Embedo || !window.Embedo) {
      throw Error('Embedo script is either not imported or not available.');
    }
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    root.Embedo.Flickr = window.Embedo.Flickr = factory()(root.Embedo || window.Embedo);
  }
})(this, function () {
  /**
   * Embedo Flickr plugin
   * @class EmbedoFlickr
   *
   * @param {object} Embedo Class Instance
   */
  function EmbedoFlickr(Embedo: any) {
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
      value: function (id: any, element: any, url: any, options: any, callback: any) {
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
        }, function (error: any, data: any) {
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
