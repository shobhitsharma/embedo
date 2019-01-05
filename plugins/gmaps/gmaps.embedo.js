/**
 * @file gmaps.embedo.js
 *
 * Embedo plugin to embed Google Maps.
 *
 * @author Shobhit Sharma <hi@shobh.it>
 * @license MIT
 */
'use strict';

(function (Embedo) {
  if (!Embedo) {
    throw Error('Embedo script is either not imported or not available.');
  }

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
    value: function (id, element, url, options, callback) {
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
        function (err) {
          if (err) {
            Embedo.log('error', 'googlemaps', err);
            return callback(err);
          }

          var location = new window.google.maps.LatLng(cordinates.lat, cordinates.lng);
          var map = new window.google.maps.Map(container, {
            zoom: options.zoom || 12,
            center: location,
            mapTypeId: options.MapTypeId || window.google.maps.MapTypeId.ROADMAP
          });
          var marker = new window.google.maps.Marker({
            map: map,
            draggable: true,
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
    }
  });

  /**
   * @func getCordinates
   * Get Cordinates from URL
   *
   * @param {string} url
   */
  function getCordinates(url) {
    var regex = /@(-?\d+\.\d+),(-?\d+\.\d+),(\d+\.?\d?)+z/;
    var match = url.match(regex);
    return match && match.length && match[1] && match[2] ? {
        lat: parseFloat(match[1], 0),
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
  function gmapsify(parentNode, childNode, options, callback) {
    Embedo.utils.sdkReady('googlemaps', function (err) {
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

})(window.Embedo);
