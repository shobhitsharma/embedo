/**
 * @file gmaps.embedo.js
 *
 * Embedo plugin to embed Google Maps.
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
    root.Embedo.GMaps = window.Embedo.GMaps = factory()(root.Embedo || window.Embedo);
  }
})(this, function () {
  /**
   * Embedo Google Maps plugin
   * @class EmbedoGMaps
   *
   * @param {object} Embedo Class Instance
   */
  function EmbedoGMaps(Embedo: any) {
    if (!Embedo) {
      throw Error('Embedo instance as argument is missing.');
    }

    // Add `googlemaps` as source
    Embedo.defaults.SOURCES.googlemaps = {
      GLOBAL: 'google',
      SDK: 'https://maps.googleapis.com/maps/api/js',
      oEmbed: null,
      REGEX: /(http|https)?:\/\/(www\.|maps\.)?google(\.[a-z]+){1,2}\/maps\/.*/i,
      PARAMS: {}
    };

    /**
     * @method googlemaps
     * Google Maps Embed
     *
     * @param {number} id
     * @param {HTMLElement} element
     * @param {string} url
     * @param {object} options Optional parameters.
     * @return callback
     */
    Object.defineProperty(Embedo.prototype, 'googlemaps', {
      value: function (id: any, element: any, url: any, options: any, callback: any) {
        var size = Embedo.utils.dimensions(element, options.width, options.height);
        var cordinates = getCordinates(url);
        if (!cordinates) {
          return callback(new Error('unable_to_find_cordinates'));
        }

        var container = Embedo.utils.generateEmbed(id, 'googlemaps');
        element.appendChild(container);

        gmapsify(
          element,
          container, {
            url: url,
            width: size.width,
            height: size.height,
            centerize: options.centerize
          },
          function (err: any) {
            if (err) {
              Embedo.log('error', 'googlemaps', err);
              return callback(err);
            }

            // @ts-expect-error ts-migrate(2339) FIXME: Property 'google' does not exist on type 'Window &... Remove this comment to see the full error message
            var location = new window.google.maps.LatLng(cordinates.lat, cordinates.lng);
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'google' does not exist on type 'Window &... Remove this comment to see the full error message
            var map = new window.google.maps.Map(container, {
              zoom: options.zoom || 12,
              center: location,
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'google' does not exist on type 'Window &... Remove this comment to see the full error message
              mapTypeId: options.MapTypeId || window.google.maps.MapTypeId.ROADMAP
            });
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'google' does not exist on type 'Window &... Remove this comment to see the full error message
            var marker = new window.google.maps.Marker({
              map: map,
              draggable: true,
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'google' does not exist on type 'Window &... Remove this comment to see the full error message
              animation: window.google.maps.Animation.DROP,
              position: location
            });

            callback(null, {
              id: id,
              el: element,
              width: size.width,
              height: size.height,
              marker: marker
            });
          }
        );
      },
      writable: false,
      enumerable: true,
      configurable: true
    });

    /**
     * @func getCordinates
     * Get Cordinates from URL
     *
     * @param {string} url
     */
    function getCordinates(url: any) {
      var regex = /@(-?\d+\.\d+),(-?\d+\.\d+),(\d+\.?\d?)+z/;
      var match = url.match(regex);
      return match && match.length && match[1] && match[2] ? {
          // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 2.
          lat: parseFloat(match[1], 0),
          // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 2.
          lng: parseFloat(match[2], 0)
        } :
        null;
    }

    /**
     * @function gmapsify
     * Parses Google Maps SDK
     *
     * @param {HTMLElement} parentNode
     * @param {HTMLElement} childNode
     * @param {object} options
     */
    function gmapsify(parentNode: any, childNode: any, options: any, callback: any) {
      Embedo.utils.sdkReady('googlemaps', function (err: any) {
        if (err) {
          return callback(err);
        }
        if (options.centerize !== false) {
          Embedo.utils.centerize(parentNode, childNode, options);
        }
        childNode.style.width = options.width ?
          options.width + 'px' :
          Embedo.utils.compute(parentNode, 'width');
        childNode.style.height = options.height ?
          options.height + 'px' :
          Embedo.utils.compute(parentNode, 'height');
        callback(null, {});
      });
    }
  }

  return EmbedoGMaps;
});
