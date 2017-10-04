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

  // Create IE + others compatible event handler
  var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
  var eventer = window[eventMethod];
  var messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

  // Decoding mesage posted on each successful render
  eventer(messageEvent, function (e) {
    if (e.data.match(/embedo.rendered/)) {
      var decoded_message = JSON.parse(e.data.replace('embedo.rendered=', ''));
      Embedo.log('warn', e, decoded_message);
    }
  }, false);

  function build() {
    document.getElementById('test-container').innerHTML = '';

    embedo.load(document.getElementById('test-container'),
      document.getElementById('test-url').value, {
        width: document.getElementById('test-width').value || null,
        height: document.getElementById('test-height').value || null
      }).done(function (data) {
      Embedo.log('info', 'build', 'onDoneEvent', data);
    }).fail(function (err) {
      Embedo.log('error', 'build', 'onErrorEvent', err);
    });
  }

  document.getElementById('test-url').addEventListener('input', build);
  document.getElementById('test-width').addEventListener('input', build);
  document.getElementById('test-height').addEventListener('input', build);

  // Loads facebook post
  embedo.load(
    document.getElementById('embedo-facebook-post'),
    'https://www.facebook.com/9gag/posts/10156278718151840'
  ).fail(function (err) {
    Embedo.log('error', 'TESTING', 'Embedo instance error', err);
  }).done(function (data) {
    Embedo.log('info', 'TESTING', 'Embedo instance watch', data);
  });

  embedo.load(
    document.getElementById('embedo-facebook-photo'),
    'https://www.facebook.com/9gag/photos/a.109041001839.105995.21785951839/10156236707186840'
  );

  embedo.load(
    document.getElementById('embedo-facebook-video'),
    'https://www.facebook.com/9gag/videos/10156133478761840/'
  );

  // Loads tweet
  embedo.load(
    document.getElementById('embedo-twitter'),
    'https://twitter.com/Sh0bhit/status/797584590214926340'
  );

  // Loads twitter timeline grid
  embedo.load(
    document.getElementById('embedo-twitter-grid'),
    'https://twitter.com/TwitterDev/timelines/539487832448843776', {
      widget_type: 'grid'
    }
  );

  // Loads twitter timeline
  embedo.load(
    document.getElementById('embedo-twitter-timeline'),
    'https://twitter.com/TwitterDev/timelines/539487832448843776', {
      height: 500
    }
  );

  // Multiple URLs
  embedo.load(document.getElementById('embedo-multiple'), [
    'https://www.instagram.com/p/BX3fMnRjHpZ',
    'https://www.instagram.com/p/BX3ejdJHmkD',
    'https://www.instagram.com/p/BX3VEDqFvmg'
  ], {
    hidecaption: false
  }).fail(function (err) {
    Embedo.log('error', 'TESTING', 'Embedo instance error', err);
  }).done(function (data) {
    Embedo.log('info', 'TESTING', 'Embedo instance watch', data);
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

  // Loads pinterest post
  embedo.load(
    document.getElementById("embedo-pinterest-pin"),
    "https://www.pinterest.com/pin/99360735500167749", {
      strict: true
    }
  );

  embedo.load(
    document.getElementById("embedo-pinterest-board"),
    "https://www.pinterest.com/pinterest/official-news/", {
      "data-pin-do": "embedBoard",
      "data-pin-board-width": 750,
      "data-pin-scale-height": 600,
      "data-pin-scale-width": 80,
      "strict": true
    }
  );

  embedo.load(
    document.getElementById("embedo-pinterest-profile"),
    "https://www.pinterest.com/pinterest/", {
      "data-pin-do": "embedUser",
      "data-pin-board-width": 750,
      "data-pin-scale-height": 500,
      "data-pin-scale-width": 80,
      "strict": true
    }
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

  // Loads google maps URL
  // embedo.load(
  //   document.getElementById('embedo-googlemaps'),
  //   'https://www.google.de/maps/place/Berlin/@52.5076682,13.286064,11z/data=!3m1!4b1!4m5!3m4!1s0x47a84e373f035901:0x42120465b5e3b70!8m2!3d52.5200066!4d13.404954', {
  //     width: 640,
  //     height: 480,
  //     zoom: 10
  //   }
  // );

  // // Refresh All Embedo instances
  // setTimeout(function () {
  //   embedo.refresh();
  // }, 5000);

  // // Refresh Single Embedo instance
  // setTimeout(function () {
  //   embedo.refresh(document.getElementById('embedo-facebook'));
  // }, 5000);

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
    Embedo.log('info', 'TESTING', 'Embedo watch', result);
  });

  embedo.on('refresh', function (request, data) {
    Embedo.log('info', 'TESTING', 'Embedo refresh', request, data);
  });

  embedo.on('destroy', function () {
    Embedo.log('info', 'TESTING', 'Embedo destroy');
  });

  embedo.on('error', function (error) {
    Embedo.log('error', 'TESTING', 'Embedo error', error);
  });
};
