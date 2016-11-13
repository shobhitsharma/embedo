/**
 * @file auth.js - Authentication Component
 *
 * @author Shobhit Sharma <hi@onzu.com>
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

    this.init();

		return this;
	}

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
		facebook: function (url, callback) {
			fetch(buildURL(url, this.options), function (error, response) {
				if (error) {
					return console.error(error);
				}

        // Do Something
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
		twitter: function (url, callback) {
			fetch(buildURL(url, this.options), function (error, response) {
				if (error) {
					return console.error(error);
				}

        // Do Something
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
		instagram: function (url, callback) {
			fetch(buildURL(url, this.options), function (error, response) {
				if (error) {
					return console.error(error);
				}

        // Do Something
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
		youtube: function () {
			fetch(buildURL(url, this.options), function (error, response) {
				if (error) {
					return console.error(error);
				}

        // Do Something
			});
		},

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

	};

  /**
	 * @method Initialize auth component
	 *
	 * @name init
	 * @function
	 * @param {object} options Optional parameters.
	 * @return callback
	 */
	Embedder.prototype.load = function (options) {
		console.log('Embedder Loaded..', options);

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

  function buildURL(url, options) {
    var defaults = {
      FACEBOOK_API: '',
      TWITTR_API: '',
      INSTAGRAM_API: '',
      YOUTUBE_API: ''
    };
    var custom_url = '';

    return custom_url;
  }

  function buildSDK(sdk) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = sdk;

    return script;
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

	function fetch(url, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    options = options || {};

		var http = new XMLHttpRequest();
		var request = {
			type: options.type || 'GET',
			contentType: options.contentType || 'application/json',
			query: options.formData || options.params || ''
		};

		http.open(request.type, url);
		http.setRequestHeader('Accept', 'application/json, text/javascript, */*; q=0.01');
		http.setRequestHeader('Content-Type', request.contentType);

		http.onload = function () {
			if (http.status >= 200 && http.status < 300) {
				var responseText = http.responseText;
				if (responseText) {
					var message = '';
					try {
						message = JSON.parse(responseText);
					} catch (e) {
						message = responseText;
					}
					callback(null, message);
				} else {
					callback(new Error('invalid_response_type', 400));
				}
			} else if (http.status < 200 || http.status >= 300) {
				callback(new Error(http.responseText || http.statusText, http.status));
			}
		};

		http.send(request.query);
	}

	return Embedder;
});
