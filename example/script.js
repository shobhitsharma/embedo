window.onload = function () {
  var embedo = new Embedo({
    facebook: {
      version: 'v2.8',
      appId: '269918776508696'
    },
    twitter: true,
    instagram: true,
    pinterest: true
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
    'https://www.youtube.com/watch?v=JGwWNGJdvx8'
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
  // }, 10000);

  // // Destroy Single Embdos Test
  // setTimeout(function () {
  //   embedo.destroy(document.getElementById('embedo-instagram'));
  // }, 20000);

  // Test Element Watch Events
  document.getElementById('embedo-twitter').addEventListener('watch',
    function (event) {
      console.log('twitter watch', event, event.detail);
    });

  document.getElementById('embedo-facebook').addEventListener('watch',
    function (event) {
      console.log('facebook watch', event, event.detail);
    });

  document.getElementById('embedo-instagram').addEventListener('watch',
    function (event) {
      console.log('instagram watch', event, event.detail);
    });

  document.getElementById('embedo-youtube').addEventListener('watch',
    function (event) {
      console.log('youtube watch', event, event.detail);
    });

  document.getElementById('embedo-pinterest').addEventListener('watch',
    function (event) {
      console.log('pinterest watch', event, event.detail);
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
