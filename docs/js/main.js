window.onload = function () {
  var embedo = new Embedo({
    facebook: true,
    twitter: true,
    instagram: true,
    pinterest: true
  });

  if (document.getElementById('test-case')) {
    document.getElementById('test-url').addEventListener('input', build);
    document.getElementById('test-width').addEventListener('input', build);
    document.getElementById('test-height').addEventListener('input', build);
  }

  var timer;
  var timeout = 500;

  function build(event) {
    if (timer) {
      clearTimeout(timer);
    }

    document.getElementById('test-container').innerHTML = '';

    timer = setTimeout(function () {
      var width = parseInt(document.getElementById('test-width').value) || null;
      var height = parseInt(document.getElementById('test-height').value) || null;

      if (width > 0) {
        document.getElementById('test-container').style.width = width;
      }

      if (width > 0) {
        document.getElementById('test-container').style.height = height;
      }

      embedo.load(document.getElementById('test-container'),
        document.getElementById('test-url').value, {
          width: width,
          height: height
        });
    }, timeout);
  }
};
