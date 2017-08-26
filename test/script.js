'use strict';

window.onload = function () {
  Embedo.debug = true;

  var embedo = new Embedo({
    facebook: {
      version: 'v2.8',
      appId: '269918776508696',
      xfbml: true
    },
    twitter: true,
    instagram: true,
    pinterest: true,
    // googlemaps: {
    //   key: 'AIzaSyDDmeVWuW86QT0JPikPas0BeWxbpVBlFy8'
    // }
  });

  document.getElementById('test-url').addEventListener('input', build);
  document.getElementById('test-width').addEventListener('input', build);
  document.getElementById('test-height').addEventListener('input', build);

  // Loads facebook post
  embedo.load(
    document.getElementById('embedo-facebook'),
    'https://www.facebook.com/Channel4/videos/10154585936602330', {
      width: 330,
      height: 400
    }
  ).fail(function (err) {
    console.error('Embedo instance error', err);
  }).done(function (data) {
    console.log('Embedo instance watch', data);
  });

  // Multiple URLs
  embedo.load(document.getElementById('embedo-multiple'), [
    'https://www.instagram.com/p/BX3fMnRjHpZ',
    'https://www.instagram.com/p/BX3ejdJHmkD',
    'https://www.instagram.com/p/BX3VEDqFvmg'
  ], {
    hidecaption: false
  }).fail(function (err) {
    console.error('Embedo instance error', err);
  }).done(function (data) {
    console.log('Embedo instance watch', data);
  });

  embedo.load(document.getElementById('embedo-gist'), 'https://gist.github.com/brandonb927/4149074.js');

  embedo.load(document.getElementById('embedo-codepen'),
    'https:////codepen.io/PavelDoGreat/embed/zdWzEL/?height=265&theme-id=0&default-tab=js,result&embed-version=2');

  // Embed file test
  embedo.load(document.getElementById('embedo-file'), 'http://www.a3ts.org/wp-content/uploads/2014/07/PREVAC.pdf');

  // Embed external URL test
  embedo.load(document.getElementById('embedo-website'), 'https://static01.nyt.com/video/players/offsite/index.html?videoId=100000005363413');

  // Embed video URL
  embedo.load(document.getElementById('embedo-video'), 'https://archive.org/download/WebmVp8Vorbis/webmvp8.webm', {
    controls: 'contorls'
  });

  // Loads google maps URL
  // embedo.load(
  //   document.getElementById('embedo-googlemaps'),
  //   'https://www.google.de/maps/place/Berlin/@52.5076682,13.286064,11z/data=!3m1!4b1!4m5!3m4!1s0x47a84e373f035901:0x42120465b5e3b70!8m2!3d52.5200066!4d13.404954', {
  //     width: 640,
  //     height: 480,
  //     zoom: 10
  //   }
  // );

  // Loads pinterest post
  embedo.load(
    document.getElementById('embedo-pinterest'),
    'https://www.pinterest.com/pin/99360735500167749'
  );

  // Loads tweet
  embedo.load(
    document.getElementById('embedo-twitter'),
    'https://twitter.com/Sh0bhit/status/797584590214926340'
  );

  // Loads instagram photo
  embedo.load(
    document.getElementById('embedo-instagram'),
    'https://www.instagram.com/p/BJA9BB-B46A', {
      hidecaption: false
    }
  );

  // Loads youtube video
  embedo.load(
    document.getElementById('embedo-youtube'), [
      'https://www.youtube.com/watch?v=JGwWNGJdvx8',
      'https://www.youtube.com/embed/vn2qXpcon-s'
    ], {
      width: 640,
      height: 480
    }
  );

  // Loads vimeo video
  embedo.load(
    document.getElementById('embedo-vimeo'),
    'https://vimeo.com/212603149', {
      height: 500
    }
  );

  embedo.load(
    document.getElementById('embedo-jsfiddle'),
    'http://jsfiddle.net/skelly/FX44w/embedded/'
  );

  // Refresh All Embedo instances
  setTimeout(function () {
    embedo.refresh();
  }, 5000);

  // Refresh Single Embedo instance
  setTimeout(function () {
    embedo.refresh(document.getElementById('embedo-facebook'));
  }, 5000);

  // // Destroy All Embdos Test
  // setTimeout(function () {
  //   embedo.destroy(document.getElementById('embedo-multiple'));
  // }, 5000);

  // // Destroy Single Embdos Test
  // setTimeout(function () {
  //   embedo.destroy(document.getElementById('embedo-instagram'));
  // }, 20000);

  // Test Element Watch Events
  embedo.on('watch', function (result) {
    console.log('Embedo watch', result);
  });

  embedo.on('refresh', function (request, data) {
    console.log('Embedo refresh', request, data);
  });

  embedo.on('destroy', function () {
    console.log('Embedo destroy');
  });

  embedo.on('error', function (error) {
    console.error('Embedo error', error);
  });

  function build() {
    document.getElementById('test-container').innerHTML = '';

    embedo.load(document.getElementById('test-container'),
      document.getElementById('test-url').value, {
        width: parseInt(document.getElementById('test-width').value) || null,
        height: parseInt(document.getElementById('test-height').value) || null
      });

    // Test event on delay
    setTimeout(function () {
      embedo.refresh(document.getElementById('test-container'));
    }, 5000);
  }
};
