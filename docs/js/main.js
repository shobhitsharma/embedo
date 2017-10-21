'use strict';

if (window.addEventListener) {
  window.addEventListener('load', render, false);
} else if (window.attachEvent) {
  window.attachEvent('onload', render);
} else {
  window.onload = render;
}

function render() {
  var embedo = new Embedo({
    facebook: {
      version: 'v2.10',
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

  function build() {
    Embedo.utils.watcher('demo', function () {
      var url = document.getElementById('test-url').value;
      var width = document.getElementById('test-width').value;
      var height = document.getElementById('test-height').value;
      var hash = url + '#w=' + width + '&h=' + height;

      document.getElementById('test-container').innerHTML = '';
      embedo.load(document.getElementById('test-container'), url, {
        width: width,
        height: height
      }).done(function () {
        if (window.ga) {
          window.ga('send', 'event', 'Demo', hash, 'success');
        }
      }).fail(function () {
        if (window.ga) {
          window.ga('send', 'event', 'Demo', hash, 'failed');
        }
      });
    }, 300);
  }
}
