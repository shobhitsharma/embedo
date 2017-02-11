window.onload = function () {
  var embedo = new Embedo({
    facebook: true,
    twitter: true,
    instagram: true
  });

  document.getElementById('test-url').addEventListener('input', build);
  document.getElementById('test-width').addEventListener('input', build);
  document.getElementById('test-height').addEventListener('input', build);

  function build(event) {
    embedo.load(document.getElementById('test-container'),
      document.getElementById('test-url').value, {
        width: document.getElementById('test-width').value,
        height: document.getElementById('test-height').value
      });
  }

  // Loads facebook post
  embedo.load(
    document.getElementById('embedo-facebook'),
    'https://www.facebook.com/LaLiga/posts/1131604813542743',
    {
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
    'https://www.instagram.com/p/BJA9BB-B46A'
  );

  // Loads youtube video
  embedo.load(
    document.getElementById('embedo-youtube'),
    'https://www.youtube.com/watch?v=JGwWNGJdvx8'
  );

  embedo.refresh();

  setTimeout(function () {
    embedo.refresh();
  }, 5000);
};
