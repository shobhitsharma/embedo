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

  document.getElementById('test-url').addEventListener('input', build);
  document.getElementById('test-width').addEventListener('input', build);
  document.getElementById('test-height').addEventListener('input', build);

  function build(event) {
    document.getElementById('test-container').innerHTML = '';

    typewatch('embedo-test', function () {
      embedo.load(document.getElementById('test-container'),
        document.getElementById('test-url').value, {
          width: parseInt(document.getElementById('test-width').value) || null,
          height: parseInt(document.getElementById('test-height').value) || null
        });
    }, 750);

    // Test event on delay
    setTimeout(function () {
      embedo.refresh(document.getElementById('test-container'));
    }, 5000);
  }

  // Loads google maps URL
  embedo.load(
    document.getElementById('embedo-googlemaps'),
    'https://www.google.de/maps/place/Berlin/@52.5076682,13.286064,11z/data=!3m1!4b1!4m5!3m4!1s0x47a84e373f035901:0x42120465b5e3b70!8m2!3d52.5200066!4d13.404954', {
      width: 640,
      height: 480,
      zoom: 10
    }
  );

  // Loads pinterest post
  embedo.load(
    document.getElementById('embedo-pinterest'),
    'https://www.pinterest.com/pin/99360735500167749'
  );

  // Loads facebook post
  embedo.load(
    document.getElementById('embedo-facebook'),
    'https://www.facebook.com/LaLiga/posts/1131604813542743', {
      width: 600,
      height: 400
    }
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
    document.getElementById('embedo-youtube'),
    'https://www.youtube.com/watch?v=JGwWNGJdvx8', {
      width: 640,
      height: 480
    }
  );

  // Loads youtube embed video
  embedo.load(
    document.getElementById('embedo-youtube-embed'),
    'https://www.youtube.com/embed/vn2qXpcon-s', {
      width: 640,
      height: 480
    }
  );

  // Loads vimeo video
  embedo.load(
    document.getElementById('embedo-vimeo'),
    'https://vimeo.com/212603149'
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
  //   embedo.destroy();
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
};

function typewatch(id, fn, timer) {
  window.typewatch_stack = window.typewatch_stack || {};
  window.typewatch_stack[id] = window.typewatch_stack[id] || {
    id: id,
    count: 0,
    request: null
  };

  if (window.typewatch_stack[id].count > 0 && window.typewatch_stack[id].request) {
    window.typewatch_stack[id].count -= 1;
    clearTimeout(window.typewatch_stack[id].request);
  }

  window.typewatch_stack[id].count += 1;
  window.typewatch_stack[id].request = setTimeout(function (e) {
    window.typewatch_stack[id].count -= 1;
    if (window.typewatch_stack[id].count === 0) {
      fn.call();
    }
  }, timer);

  return null;
}
