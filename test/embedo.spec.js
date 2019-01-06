"use strict";

var fs = require("fs");
var jsdom = require("jsdom");
var expect = require("chai").expect;
var Embedo = require("../embedo");
var EmbedoGMaps = require("../plugins/gmaps");
var EmbedoReddit = require("../plugins/reddit");

// Cache FileBuffer
var html = fs.readFileSync(require.resolve("./index.html"), "utf8");
var embedoScript = fs.readFileSync(require.resolve("../embedo.js"), "utf8");
var embedo = null;

// Build virtual DOM Tree
var dom = new jsdom.JSDOM(html, {
  runScripts: "dangerously",
  strictSSL: false,
  userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36"
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

describe("Embedo", function () {
  this.timeout(5000);

  before(function (done) {
    // Append library to DOM
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.innerHTML = embedoScript;
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(script);

    // Initialize constructor
    embedo = new Embedo({
      facebook: {
        version: "v3.1",
        appId: "269918776508696",
        xfbml: true
      },
      twitter: true,
      instagram: true,
      pinterest: true,
      googlemaps: {
        key: "AIzaSyDDmeVWuW86QT0JPikPas0BeWxbpVBlFy8"
      }
    });

    done();
  });

  after(function () {
    delete global.window;
    delete global.document;
  });

  it("constructor", function (done) {
    expect(Embedo).to.be.a("function");
    expect(EmbedoGMaps).to.be.a("object");
    expect(EmbedoReddit).to.be.a("object");
    expect(embedo).to.be.a("object");
    done();
  });

  it("should expose dispatchers", function (done) {
    expect(embedo.on).to.be.a("function");
    expect(embedo.off).to.be.a("function");
    expect(embedo.emit).to.be.a("function");
    expect(embedo.once).to.be.a("function");
    done();
  });

  it("should have .load() method", function (done) {
    expect(embedo.load).to.be.a("function");
    done();
  });

  it("should have .render() method", function (done) {
    expect(embedo.render).to.be.a("function");
    done();
  });

  it("should have .refresh() method", function (done) {
    expect(embedo.refresh).to.be.a("function");
    done();
  });

  it("should have .destroy() method", function (done) {
    expect(embedo.destroy).to.be.a("function");
    done();
  });

  it("should have .domify() method", function (done) {
    expect(embedo.domify).to.be.a("function");
    done();
  });

  it("should embed a PDF file", function (done) {
    embedo
      .load(
        document.getElementById("embedo-file"),
        "http://www.a3ts.org/wp-content/uploads/2014/07/PREVAC.pdf"
      )
      .done(function (data) {
        expect(data).to.be.a("object");
        done();
      })
      .fail(function (err) {
        done(err);
      });
  });

  it("should embed a HTML Website", function (done) {
    embedo
      .load(
        document.getElementById("embedo-website"),
        "https://static01.nyt.com/video/players/offsite/index.html?videoId=100000005363413"
      )
      .done(function (data) {
        console.log(">>HTML>", data);
        expect(data).to.be.a("object");
        done();
      })
      .fail(function (err) {
        done(err);
      });
  });

  it("should embed a webm video", function (done) {
    embedo
      .load(
        document.getElementById("embedo-video"),
        "https://archive.org/download/WebmVp8Vorbis/webmvp8.webm", {
          controls: "contorls"
        }
      )
      .done(function (data) {
        expect(data).to.be.a("object");
        done();
      })
      .fail(function (err) {
        done(err);
      });
  });

  it("should embed a facebook post", function (done) {
    embedo
      .load(
        document.getElementById("embedo-facebook"),
        "https://www.facebook.com/LaLiga/posts/1131604813542743", {
          width: 600,
          height: 400
        }
      )
      .done(function (data) {
        expect(data).to.be.a("object");
        done();
      })
      .fail(function (err) {
        done(err);
      });
  });

  it("should embed a pinterest pin", function (done) {
    embedo
      .load(
        document.getElementById("embedo-pinterest"),
        "https://www.pinterest.com/pin/99360735500167749"
      )
      .done(function (data) {
        expect(data).to.be.a("object");
        done();
      })
      .fail(function (err) {
        done(err);
      });
  });

  it("should embed google maps URL", function (done) {
    embedo
      .load(
        document.getElementById("embedo-googlemaps"),
        "https://www.google.de/maps/place/Berlin/@52.5076682,13.286064,11z/data=!3m1!4b1!4m5!3m4!1s0x47a84e373f035901:0x42120465b5e3b70!8m2!3d52.5200066!4d13.404954", {
          width: 640,
          height: 480,
          zoom: 10
        }
      )
      .done(function (data) {
        expect(data).to.be.a("object");
        done();
      })
      .fail(function (err) {
        done(err);
      });
  });

  it("should embed a instagram post", function (done) {
    embedo
      .load(
        document.getElementById("embedo-instagram"),
        "https://www.instagram.com/p/BJA9BB-B46A", {
          hidecaption: false
        }
      )
      .done(function (data) {
        expect(data).to.be.a("object");
        done();
      })
      .fail(function (err) {
        done(err);
      });
  });

  it("should embed multiple instagram posts", function (done) {
    embedo
      .load(
        document.getElementById("embedo-multiple"),
        [
          "https://www.instagram.com/p/BX3fMnRjHpZ",
          "https://www.instagram.com/p/BX3ejdJHmkD",
          "https://www.instagram.com/p/BX3VEDqFvmg"
        ], {
          hidecaption: false
        }
      )
      .done(function (data) {
        expect(data).to.be.a("object");
        done();
      })
      .fail(function (err) {
        done(err);
      });
  });

  it("should embed a tweet", function (done) {
    embedo
      .load(
        document.getElementById("embedo-twitter"),
        "https://twitter.com/Sh0bhit/status/797584590214926340"
      )
      .done(function (data) {
        expect(data).to.be.a("object");
        done();
      })
      .fail(function (err) {
        done(err);
      });
  });

  it("should embed a youtube video", function (done) {
    embedo
      .load(
        document.getElementById("embedo-youtube"),
        "https://www.youtube.com/watch?v=JGwWNGJdvx8", {
          width: 640,
          height: 480
        }
      )
      .done(function (data) {
        expect(data).to.be.a("object");
        done();
      })
      .fail(function (err) {
        done(err);
      });
  });

  it("should embed a youtube video via embed-url", function (done) {
    embedo
      .load(
        document.getElementById("embedo-youtube-embed"),
        "https://www.youtube.com/embed/vn2qXpcon-s", {
          width: 640,
          height: 480
        }
      )
      .done(function (data) {
        expect(data).to.be.a("object");
        done();
      })
      .fail(function (err) {
        done(err);
      });
  });

  it("should embed a vimeo video", function (done) {
    embedo
      .load(
        document.getElementById("embedo-vimeo"),
        "https://vimeo.com/212603149"
      )
      .done(function (data) {
        expect(data).to.be.a("object");
        done();
      })
      .fail(function (err) {
        done(err);
      });
  });

  it("should embed a github gist", function (done) {
    embedo
      .load(
        document.getElementById("embedo-gist"),
        "https://gist.github.com/brandonb927/4149074.js"
      )
      .done(function (data) {
        expect(data).to.be.a("object");
        done();
      })
      .fail(function (err) {
        done(err);
      });
  });

  it("should embed a soundcloud track", function (done) {
    embedo
      .load(
        document.getElementById("embedo-soundcloud"),
        "https://soundcloud.com/uiceheidd/lucid-dreams-forget-me"
      )
      .done(function (data) {
        expect(data).to.be.a("object");
        done();
      })
      .fail(function (err) {
        done(err);
      });
  });

  it("should have requests stored after calling .load()", function (done) {
    expect(embedo.requests).to.be.an("array");
    done();
  });
});
