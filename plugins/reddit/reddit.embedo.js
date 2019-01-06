/**
 * @file gmaps.reddit.js
 *
 * Embedo plugin to embed Reddit.
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
    root.Embedo.Reddit = window.Embedo.Reddit = factory()(root.Embedo || window.Embedo);
  }
})(this, function () {
  /**
   * Embedo Reddit plugin
   * @class EmbedoReddit
   *
   * @param {object} Embedo Class Instance
   */
  function EmbedoReddit(Embedo) {
    // Add `reddit` as source
    Embedo.defaults.SOURCES.reddit = {
      GLOBAL: 'reddit',
      SDK: 'https://embed.redditmedia.com/widgets/platform.js',
      oEmbed: null,
      REGEX: /(https?:\/\/(ww.)?)?reddit(\.[a-z]+).*/i,
      PARAMS: {}
    };

    /**
     * @method reddit
     * Reddit Embed
     *
     * @param {number} id
     * @param {HTMLElement} element
     * @param {string} url
     * @param {object} options Optional parameters.
     * @return callback
     */
    Object.defineProperty(Embedo.prototype, 'reddit', {
      value: function (id, element, url, options, callback) {
        var size = Embedo.utils.dimensions(element, options.width, options.height);
        var embed_options = Embedo.utils.merge({
            embed: true,
            context: 1,
            depth: 2,
            uuid: null,
            showedits: true,
            showmore: false,
            width: size.width,
            height: size.height
          },
          options,
          Embedo.defaults.RESTRICTED
        );
        var embed_url = url + '?' + Embedo.utils.querystring(embed_options);
        var embed_el = Embedo.utils.generateElement('div', {
          style: 'width:' + size.width + 'px;'
        }, '<blockquote class="reddit-card"><a href="' + embed_url + '"></a></blockquote>');
        var container = Embedo.utils.generateEmbed(id, 'reddit', embed_el);

        element.appendChild(container);

        callback(null, {
          id: id,
          el: element,
          width: size.width,
          height: size.height
        });
      }
    });
  }

  return EmbedoReddit;
});
