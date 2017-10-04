'use strict';

window.onload = function () {
  var embedo = new Embedo({
    facebook: {
      version: 'v2.8',
      appId: '269918776508696',
      xfbml: true
    },
    twitter: true,
    instagram: true,
    pinterest: true,
    googlemaps: {
      key: 'AIzaSyDDmeVWuW86QT0JPikPas0BeWxbpVBlFy8'
    }
  });

  if (document.getElementById('test-case')) {
    document.getElementById('test-url').addEventListener('input', build);
    document.getElementById('test-width').addEventListener('input', build);
    document.getElementById('test-height').addEventListener('input', build);
  }

  var timer;
  var timeout = 500;

  function build() {
    if (timer) {
      clearTimeout(timer);
    }
    document.getElementById('test-container').innerHTML = '';
    timer = setTimeout(function () {
      var width = document.getElementById('test-width').value;
      var height = document.getElementById('test-height').value;

      embedo.load(document.getElementById('test-container'),
        document.getElementById('test-url').value, {
          width: width,
          height: height
        }).done(function (data) {
        if (window.ga) {
          window.ga('send', 'event', {
            eventCategory: 'embedo.load',
            eventAction: 'done',
            eventLabel: event.target.href,
            eventValue: data
          });
        }
      }).fail(function (err) {
        if (window.ga) {
          window.ga('send', 'event', {
            eventCategory: 'embedo.load',
            eventAction: 'error',
            eventLabel: event.target.href,
            eventValue: err
          });
        }
      });
    }, timeout);
  }
};
