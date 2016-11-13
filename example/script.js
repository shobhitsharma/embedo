document.addEventListener('DOMContentLoaded', function () {
  var embedder = new Embedder();

  // Loads facebook post
  embedder.load(
    document.getElementById('fb-post'),
    'https://www.facebook.com/LaLiga/posts/1131604813542743'
  );

  // Loads tweet
  embedder.load(
    document.getElementById('twttr-tweet'),
    'https://twitter.com/Sh0bhit/status/797584590214926340'
  );

  // Loads instagram photo
  embedder.load(
    document.getElementById('instgrm-photo'),
    'https://www.instagram.com/p/BJA9BB-B46A'
  );

  // Loads youtube video
  embedder.load(
    document.getElementById('yt-video'),
    'https://www.youtube.com/embed/8pTEmbeENF4'
  );
});
