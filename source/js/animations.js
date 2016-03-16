var type = /(canvas|webgl)/.test(url.type) ? url.type : 'svg',
    two = new Two({
       type: Two.Types[type],
       fullscreen: true
    }).appendTo(document.querySelector('#two')),
    Easing = TWEEN.Easing;

// Animation related variables
// =====================================================
var width = $(window).width(), height = $(window).height();
var center = { x: width / 2, y: height / 2 };
var duration = 1000;
var min_dimension = width > height ? height : width;
var TWO_PI = Math.PI * 2;
var colors = {
    black: "#000000",
    white: "#ffffff",
    seafoam: "#74C8B1",
    accent: "#0DB4FE"
};

function makeTriangle(x, y, radius) {
  var t1 = TWO_PI * .33;
  var t2 = TWO_PI * .66;
  var t3 = TWO_PI;
  var points = [
    new Two.Anchor(radius * Math.cos(t1) + x, radius * Math.sin(t1) + y),
    new Two.Anchor(radius * Math.cos(t2) + x, radius * Math.sin(t2) + y),
    new Two.Anchor(radius * Math.cos(t3) + x, radius * Math.sin(t3) + y)
  ];
  var shape = two.makePolygon(points);
  return shape;
}

function colorsEqual(c1, c2, t) {
  var threshold = t || 0.25;
  return Math.abs(c1.r - c2.r) < threshold
    && Math.abs(c1.g - c2.g) < threshold
    && Math.abs(c1.b - c2.b) < threshold;
}

function ease(cur, dest, t) {
  var d = dest - cur;
  if (Math.abs(d) <= 0.0001) {
    return dest;
  } else {
    return cur + d * t;
  }
}

function toRGB(o) {
  return 'rgb(' + Math.round(o.r) + ',' + Math.round(o.g) + ',' + Math.round(o.b) + ')';
}

function angleBetween(v1, v2) {
  var dx = v2.x - v1.x;
  var dy = v2.y - v2.y;
  return Math.atan2(dy, dx);
}

function negate(v) {
  return v * -1;
}

function lerp(a, b, t) {
  return (b - a) * t + a;
}

function map(v, i1, i2, o1, o2) {
  return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
}

function sigmoid(a, b, t, k) {
  var k = k || 0.2;
  return lerp(a, b, (k * t) / ((1 + k) * t));
}

// Rectangle Spin
// =====================================================
var r, rectSpin =  {
    vars: {
        square: null
    },
    init: function(){
        r = this.vars;
        this.bindUI();
    },
    reset: function(){
        r.square.translation.x = - two.width / 2;
    },
    bindUI: function() {
        r.square = two.makeRectangle(70, 0, 100, 100);
        r.square.fill = 'rgba(0, 191, 168, 0.33)';
        r.square.stroke = 'rgb(0, 191, 168)';
        r.square.linewidth = 5;
        r.square.translation.set(- two.width / 2, two.height / 2);
        var that = this;
        this.animate_out = new TWEEN.Tween(r.square.translation)
            .to({
                x: two.width * 1.5
            }, 750)
            .easing(TWEEN.Easing.Elastic.In)
            .onUpdate(function(t) {
                r.square.rotation = Math.PI * 2 * t;
            })
            .onComplete(that.reset);
        this.animate_in = new TWEEN.Tween(r.square.translation)
            .to({
                x: two.width / 2
            }, 750)
            .delay(500)
            .easing(TWEEN.Easing.Bounce.Out)
            .onUpdate(function(t) {
                r.square.rotation = Math.PI * 2 * t;
            })
            .onComplete(function() {
                that.animate_out.start();
            });
    },
    start: function (){
        this.animate_in.start();
    }
}

var centerCircle = (function() {

    var callback = _.identity;
    var playing = false;

    var direction = true;

    var shape = two.makeCircle(center.x, center.y, 200, 200);
    shape.fill = "#FFF";
    shape.noStroke();
    shape.visible = true;

    var start = function(onComplete, silent) {
      console.log("start got called");
      playing = true;
      shape.visible = true;
      animate_in.start();

      if (_.isFunction(onComplete)) {
          callback = onComplete;
      }  
    }

    start.onComplete = reset;

    var animate_in = new TWEEN.Tween(shape)
      .to({scale: 1.5}, duration * 0.2)
      .easing(Easing.Exponential.In)
      .onComplete(function() {
        animate_out.start();
      });

    var animate_out = new TWEEN.Tween(shape)
      .to({scale: 1}, duration * 0.15)
      .easing(Easing.Exponential.Out)
      .onComplete(function() {
        start.onComplete();
        callback();
      });

    reset();

    function reset() {
      shape.visible = true;
      playing = false;
      animate_in.stop();
      animate_out.stop();
    }

    var exports = {
      start: start,
      clear: reset,
      playing: function() { return playing; },
    };

    return exports;

})();

// Wipe
// =====================================================
// var w, wipe = {
//     vars: {
//         playing: false,
//         direction: true,
//         points: [
//              new Two.Anchor(- center.x, -center.y),
//              new Two.Anchor(center.x, - center.y),
//              new Two.Anchor(center.x, center.y),
//              new Two.Anchor(- center.x, center.y)
//          ],
//          shape: null,
//          dest_in: { x: center.x },
//          dest_out: { x: width * 1.5 }
//     },
//     init: function() {
//         w = this.vars;
//         console.log("center", center);
//         console.log("width", width);
//         this.initAnimations();
//     },
//     initAnimations: function() {
//         var that = this;
//         console.log("w", w);
//         console.log("this", this);
//         console.log("that", that);
//         w.shape = two.makePolygon(w.points);
//         w.shape.fill = "#CD92F1";
//         w.shape.noStroke();
//         this.reset();
//         this.animate_out = new TWEEN.Tween(w.shape.translation)
//             .to(w.dest_out, duration * 0.5)
//             .easing(Easing.Exponential.In)
//             .onComplete(that.reset);
//         this.animate_in = new TWEEN.Tween(w.shape.translation)
//             .to(w.dest_in, duration * 0.5)
//             .easing(Easing.Exponential.Out)
//             .onComplete(function() {
//                 that.animate_out.start();
//             });
//     },
//     reset: function () {
//         w.shape.visible = false;
//         w.playing = false;
//         w.direction = Math.random() > 0.5;
//         if (w.direction) {
//             w.shape.translation.set(- center.x, center.y);
//             w.dest_out.x = width * 1.5;
//         } else {
//             w.shape.translation.set(width * 1.5, center.y);
//             w.dest_out.x = - center.x;
//         }
//         w.dest_in.x = center.x;
//         // this.animate_in.stop();
//         // this.animate_out.stop();
//     },
//     start: function() {
//         // w.playing = true;
//         // w.shape.visible = true;
//         this.animate_in.start();
//     }
// }


// rip

  var veil = (function() {

    var callback = _.identity;
    var playing = false;

    var direction = true;
    var points = [
      new Two.Anchor(- center.x, - center.y),
      new Two.Anchor(center.x, - center.y),
      new Two.Anchor(center.x, center.y),
      new Two.Anchor(- center.x, center.y)
    ];
    var shape = two.makePolygon(points);
    shape.fill = "#EEE";
    shape.noStroke();

    var start = function(onComplete, silent) {
      playing = true;
      shape.visible = true;
      animate_in.start();
      if (!silent && exports.sound) {
        exports.sound.stop().play();
      }
      if (_.isFunction(onComplete)) {
        callback = onComplete;
      }
    };

    start.onComplete = reset;

    var update = function() {
      shape.fill = "#EEE";
    };
    var resize = function() {
      points[0].set(- center.x, - center.y);
      points[1].set(center.x, - center.y);
      points[2].set(center.x, center.y);
      points[3].set(- center.x, center.y);
    };

    var dest_in = { y: center.y }, dest_out = { y: 0 };

    var animate_in = new TWEEN.Tween(shape.translation)
      .to(dest_in, duration * 0.5)
      .easing(Easing.Exponential.Out)
      .onComplete(function() {
        animate_out.start();
      });

    var animate_out = new TWEEN.Tween(shape.translation)
      .to(dest_out, duration * 0.5)
      .easing(Easing.Exponential.In)
      .onComplete(function() {
        start.onComplete();
        callback();
      });

    reset();

    function reset() {
      shape.visible = false;
      playing = false;
      direction = Math.random() > 0.5;
      if (direction) {
        shape.translation.set(center.x, - center.y);
        dest_out.y = height * 1.5;
      } else {
        shape.translation.set(center.x, height * 1.5);
        dest_out.y = - center.y;
      }
      dest_in.y = center.y;
      animate_in.stop();
      animate_out.stop();
    }

    var exports = {
      start: start,
      update: update,
      resize: resize,
      clear: reset,
      playing: function() { return playing; },
      hash: '1,1',
      filename: 'veil'
    };

    return exports;

  })();

var ufo = (function() {

  var playing = false;
  var callback = _.identity;

  var radius = min_dimension * 0.25;
  var circle = two.makeCircle(0, 0, radius);
  circle.noStroke().fill = "#6ECCFA";

  var start = function(onComplete, silent) {
    playing = true;
    _in.start();
    circle.visible = true;
    if (!silent && exports.sound) {
      exports.sound.stop().play();
    }
    if (_.isFunction(onComplete)) {
      callback = onComplete;
    }
  };

  start.onComplete = reset;

  var update = function() {
    circle.fill = "#6ECCFA";
  };
  var resize = function() {
    radius = min_dimension * 0.25;
  };

  circle.destination = { y: center.y };

  var _in = new TWEEN.Tween(circle.translation)
    .to(circle.destination, duration / 2)
    .easing(Easing.Circular.Out)
    .onComplete(function() {
      _out.start();
    });

  var _out = new TWEEN.Tween(circle)
    .to({ scale: 0 }, duration / 2)
    .easing(Easing.Circular.Out)
    .onComplete(function() {
      playing = false;
      start.onComplete();
      callback();
    });

  function reset() {
    circle.visible = false;
    var right = Math.random() > 0.5;
    var top = Math.random() > 0.5;
    var x, y;
    if (right) {
      circle.translation.x = width * 0.75;
    } else {
      circle.translation.x = width * 0.25;
    }
    if (top) {
      circle.origin = circle.translation.y =  - center.y;
    } else {
      circle.origin = circle.translation.y = height * 1.5;
    }
    circle.destination.y = center.y;
    circle.scale = 1;
    _in.stop();
    _out.stop();
  }

  reset();

  var exports = {
    resize: resize,
    update: update,
    clear: reset,
    start: start,
    playing: function() { return playing; },
    hash: '1,2',
    filename: 'ufo'
  };

  return exports;
})();

  var dotted_spiral = (function() {

    var playing = false;
    var callback = _.identity;
    var amount = 120, linewidth = min_dimension / (amount), resolution = 4;
    var magnitude = min_dimension / 2;

    var lines = _.map(_.range(amount), function(i) {

      var pct = i / amount;
      var r = magnitude * pct;
      var theta = pct * Math.PI * resolution;

      var x1 = r * Math.cos(theta);
      var y1 = r * Math.sin(theta);

      pct = (i + 0.25) / amount;
      r = magnitude * pct;
      theta = pct * Math.PI * resolution;

      var x2 = r * Math.cos(theta);
      var y2 = r * Math.sin(theta);

      var line = two.makeLine(x1, y1, x2, y2);
      line.stroke = colors.black;
      line.linewidth = (1 - Math.sqrt(1 - pct)) * linewidth;
      line.cap = line.join = 'round';

      return line;

    });

    var updateLinewidth = function(line, i) {
      var pct = i / amount;
      line.linewidth = (Math.sqrt(1 - pct)) * linewidth;
    };

    lines.reverse();

    var group = two.makeGroup(lines);
    group.translation.set(center.x, center.y);

    var start = function(onComplete, silent) {
      _in.start();
      if (!silent && exports.sound) {
        exports.sound.stop().play();
      }
      if (_.isFunction(onComplete)) {
        callback = onComplete
      }
    };

    start.onComplete = reset;

    var update = function() {
      group.stroke = colors.black;
    };
    var resize = function() {
      group.translation.set(center.x, center.y);
      linewidth = min_dimension / amount;
      _.each(lines, updateLinewidth);
    };

    var i, t, index;
    var _in = new TWEEN.Tween(group)
      .onStart(function() {
        playing = true;
      })
      .easing(Easing.Circular.In)
      .to({ rotation: Math.PI / 8, scale: 8 }, duration * 2)
      .onUpdate(function(u) {
        t = Math.min(map(u, 0, 0.25, 0, 1), 1);
        index = Math.floor(t * (amount));
        for (i = 0; i < index; i++) {
          lines[i].visible = true;
        }
      })
      .onComplete(function() {
        start.onComplete();
        callback();
      });

    var resetLine = function(l) {
      l.visible = false;
    };

    function reset() {

      _.each(lines, resetLine);

      group.rotation = Math.random() * TWO_PI;
      group.scale = 1;

      _in.to({ rotation: group.rotation + Math.PI / 8, scale: Math.random() * 2 + 10 }, duration * 2).stop();

      playing = false;

    }

    reset();

    var exports = {
      start: start,
      update: update,
      clear: reset,
      resize: resize,
      playing: function() { return playing; },
      hash: '0,9',
      filename: 'dotted-spiral'
    };

    return exports;

  })();


    var clay = (function() {

      var callback = _.identity;
      var playing = false;

      var amount = Math.floor(Math.random()) * 8 + 8, w = width * Math.random(), h = height * Math.random();
      var distance = height, rotation = Math.PI / 2;

      var destinations = [];
      var points = _.map(_.range(amount), function(i) {
        var pct = i / amount;
        var theta = TWO_PI * pct;
        var x = distance * Math.sin(theta);
        var y = distance * Math.cos(theta);
        destinations.push(new Two.Vector(x, y));
        return new Two.Anchor(x, y);
      });

      var clay = two.makeCurve(points);
      clay.fill = colors.seafoam;
      clay.noStroke();

      points = clay.vertices;

      var start = function(onComplete, silent) {
        clay.visible = true;
        _in.start();
        if (!silent && exports.sound) {
          exports.sound.stop().play();
        }
        if (_.isFunction(onComplete)) {
          callback = onComplete;
        }
      };

      start.onComplete = reset;

      var update = function() {
        clay.fill = colors.seafoam;
      };
      var resize = function() {};

      var options = { ending: 0 };

      var v, i, l, d, x, y, a, theta, ptheta;
      var _in = new TWEEN.Tween(options)
        .to({ ending: 1 }, duration * 0.75)
        .easing(Easing.Circular.In)
        .onStart(function() {
          playing = true;
        })
        .onUpdate(function() {
          var t = options.ending;
          for (i = 0; i < amount; i++) {
            v = points[i];
            d = destinations[i];
            x = lerp(v.x, d.x, t);
            y = lerp(v.y, d.y, t);
            v.set(x, y);
          }
        })
        .onComplete(function() {
          start.onComplete();
          callback();
        });

      function reset() {

        clay.visible = false;
        impact = new Two.Vector(Math.random() * width, Math.random() * height);
        var x, y, pos = Math.random() * 8;

        if (pos > 7) {
          // north
          x = center.x;
          y = 0;
        } else if (pos > 6) {
          // north-west
          x = 0;
          y = 0;
        } else if (pos > 5) {
          // west
          x = 0;
          y = center.y;
        } else if (pos > 4) {
          // south-west
          x = 0;
          y = height;
        } else if (pos > 3) {
          // south
          x = center.x;
          y = height;
        }  else if (pos > 2) {
          // south-east
          x = width;
          y = height;
        } else if (pos > 1) {
          // east
          x = width;
          y = center.y;
        } else {
          x = width;
          y = 0;
        }

        clay.translation.set(x, y);
        options.ending = 0;
        distance = height;

        for (i = 0; i < amount; i++) {
          v = points[i];
          pct = i / amount;
          ptheta = pct * TWO_PI;
          v.set(distance * Math.cos(ptheta), distance * Math.sin(ptheta));
          theta = angleBetween(v, impact) - ptheta;
          d = v.distanceTo(impact);
          a = 10 * distance / Math.sqrt(d);
          x = a * Math.cos(theta) + v.x;
          y = a * Math.sin(theta) + v.y;
          destinations[i].set(x, y);
        }

        playing = false;
        _in.stop();

      }

      reset();

      var exports = {
        start: start,
        update: update,
        clear: reset,
        resize: resize,
        playing: function() { return playing; },
        hash: '0,1',
        filename: 'clay'
      };


      return exports;

    })();

var strike = (function() {

    var playing = false;
    var callback = _.identity;

    var amount = 32;
    var distance = min_dimension * 0.5;

    var points = _.map(_.range(amount), function(i) {
        return new Two.Anchor();
    });
    var line = two.makePolygon(points, true);
        line.noFill().stroke = colors.black;
        line.translation.set(center.x, center.y);
        line.cap = 'round';

    var start = function(onComplete, silent) {
        line.visible = true;
        playing = true;
        animate_in.start();
        if (!silent && exports.sound) {
            exports.sound.stop().play();
        }
        if (_.isFunction(onComplete)) {
            callback = onComplete;
        }
    };

    start.onComplete = reset;

    var resize = function() {
        // distance = height * 0.5;
        line.translation.set(center.x, center.y);
    };
    var update = function() {
        line.stroke = colors.black;
    };

    var animate_in = new TWEEN.Tween(line)
        .to({
            ending: 1.0
        }, duration * 0.25)
        .easing(Easing.Circular.In)
        .onComplete(function() {
            animate_out.start();
        });

    var animate_out = new TWEEN.Tween(line)
        .to({
            beginning: 1.0
        }, duration * 0.25)
        .easing(Easing.Circular.Out)
        .onComplete(function() {
            start.onComplete();
            callback();
        });

    var exports = {
        start: start,
        update: update,
        clear: reset,
        resize: resize,
        playing: function() { return playing; },
        hash: '1,5',
        filename: 'strike'
    };

    var a = {
        x: 0, y: 0
    };
    var b = {
        x: 0, y: 0
    };

    var rando, theta, pct, i, p;
    function reset() {
        playing = false;
        rando = Math.random();
        line.linewidth = Math.round(rando * 7) + 3;
        distance = Math.round(map(rando, 0, 1, height * 0.5, width))
        theta = Math.random() * TWO_PI;
        a.x = distance * Math.cos(theta);
        a.y = distance * Math.sin(theta);
        theta = theta + Math.PI;
        b.x = distance * Math.cos(theta);
        b.y = distance * Math.sin(theta);
        line.ending = line.beginning = 0;
        line.visible = false;
        for (i = 0; i < amount; i++) {
            p = points[i];
            pct = i / (amount - 1);
            p.x = lerp(a.x, b.x, pct);
            p.y = lerp(a.y, b.y, pct);
        }
        animate_in.stop();
        animate_out.stop();
    }

    reset();

    return exports;

})();

var squiggle = (function() {

    var playing = false;
    var callback = _.identity;
    var amount = 200, w = center.x, phi = 6, h = height * 0.33;
    var offset = Math.PI * 0.5;

    var points = _.map(_.range(amount), function(i) {
    var pct = i / amount;
    var theta = TWO_PI * phi * pct + offset;
    var x = map(pct, 0, 1, - w / 2, w / 2);
    var y = h * Math.sin(theta);
        return new Two.Anchor(x, y);
    });

    var squiggle = two.makePolygon(points, true);
        squiggle.translation.set(center.x, center.y);
        squiggle.stroke = colors.accent;
        squiggle.linewidth = min_dimension / 40;
        squiggle.cap = squiggle.join = 'round';
        squiggle.noFill();

// points = squiggle.vertices;

    var start = function(onComplete, silent) {
        squiggle.visible = true;
        playing = true;
        _in.start();
        if (!silent && exports.sound) {
            exports.sound.stop().play();
        }
        if (_.isFunction(onComplete)) {
            callback = onComplete;
        }
    };

    start.onComplete = reset;

    var update = function() {
        squiggle.stroke = colors.accent;
    };
    var resize = function() {
        w = center.x;
        h = height * 0.33;
        squiggle.linewidth = min_dimension / 40;
        squiggle.translation.set(center.x, center.y);
    };

// var options = { ending: 0, beginning: 0 };

    var _in = new TWEEN.Tween(squiggle)
        .to({ ending: 1.0 }, duration / 2)
        .easing(Easing.Sinusoidal.Out)
        .onComplete(function() {
            _out.start();
        });

    var _out = new TWEEN.Tween(squiggle)
        .to({ beginning: 1.0 }, duration / 2)
        .easing(Easing.Sinusoidal.In)
        .onComplete(function() {
        start.onComplete();
            callback();
        });

    var i, v, pct, theta, x, y;
    function reset() {
        squiggle.visible = false;
        phi = Math.round(Math.random() * 6) + 1;
        offset = Math.PI / 2;
        squiggle.rotation = Math.random() > 0.5 ? Math.PI : 0;
        squiggle.ending = squiggle.beginning = 0;
            for (i = 0; i < amount; i++) {
            v = points[i];
            pct = i / amount;
            theta = TWO_PI * phi * pct + offset;
            x = map(pct, 0, 1, - w / 2, w / 2);
            y = h * Math.sin(theta);
            v.set(x, y);
        }
        playing = false;
        _in.stop();
        _out.stop();
    }

    reset();

    var exports = {
        start: start,
        update: update,
        clear: reset,
        resize: resize,
        playing: function() { return playing; },
        hash: '0,7',
        filename: 'squiggle'
    };

    return exports;

})();


var flash = (function() {

    var playing = false;
    var callback = _.identity;

    var shape = two.makeRectangle(center.x, center.y, width, height);
    var timeout;
    shape.noStroke().fill = colors.white;
    shape.visible = false;

    var start = function(onComplete, silent) {
        if (!_.isUndefined(timeout)) {
            clearTimeout(timeout);
            timeout = undefined;
        }
        playing = true;
        if (!silent && exports.sound) {
            exports.sound.stop().play();
        }
        timeout = setTimeout(function() {
            playing = false;
            callback();
            shape.visible = false;
        }, duration * 0.25);
        if (_.isFunction(onComplete)) {
            callback = onComplete;
        }
    };

    var update = function() {
        shape.fill = colors.white;
    };

    var resize = function() {
    var vertices = shape.vertices;
        vertices[0].set(- center.x, - center.y);
        vertices[1].set(center.x, - center.y);
        vertices[2].set(center.x, center.y);
        vertices[3].set(- center.x, center.y);
        shape.translation.copy(center);
    };

    two.bind('update', function() {
        if (!playing) {
            return;
        }
            shape.visible = Math.random() > 0.5;
    });

    var exports = {
        start: start,
        update: update,
        clear: _.identity,
        resize: resize,
        playing: function() { return playing; },
    };

    return exports;

})();


    var pistons = (function() {
        var i = 1;
      var playing = false;
      var callback = _.identity;

      var amount = i * 4 + 1, w = width * 0.75, h = center.y;
      var begin, end;

      var group = two.makeGroup();
      group.translation.copy(center);

      var shapes = _.map(_.range(amount), function(i) {

        var d = h / amount - h / (amount * 3);
        var x = 0;
        var y = - h / 2 + (i + 1) * (h / (amount + 1));

        var shape = two.makeRectangle(x, y, w, d);

        shape.fill = colors.white;
        shape.noStroke();

        group.add(shape);

        return shape;

      });

      var options = { ending: 0, beginning: 0 };

      var showShape = function(shape) {
        shape.visible = true;
      };

      var start = function(onComplete, silent) {
        _.each(shapes, showShape);
        _in.start();
        if (!silent && exports.sound) {
          exports.sound.stop().play();
        }
        if (_.isFunction(onComplete)) {
          callback = onComplete;
        }
      };

      start.onComplete = reset;

      var s, points;
      var update = function() {
        for (i = 0; i < amount; i++) {
          shapes[i].fill = colors.white;
        }
      }; // Mainly for color in the future
      var resize = function() {
        w = width * 0.75, h = center.y;
        group.translation.copy(center);
      };

      var _in = new TWEEN.Tween(options)
        .to({ ending: 1.0 }, duration * 0.125)
        .easing(Easing.Sinusoidal.Out)
        .onStart(function() {
          playing = true;
        })
        .onUpdate(function() {
          for (i = 0; i < amount; i++) {
            s = shapes[i];
            points = s.vertices;
            points[3].x = points[0].x = end * options.ending;
          }
        })
        .onComplete(function() {
          _out.start();
        });

      var _out = new TWEEN.Tween(options)
        .to({ beginning: 1.0 }, duration * 0.125)
        .easing(Easing.Sinusoidal.Out)
        .onUpdate(function() {
          for (i = 0; i < amount; i++) {
            s = shapes[i];
            points = s.vertices;
            points[1].x = points[2].x = end * options.beginning;
          }
        })
        .onComplete(function() {
          start.onComplete();
          callback();
        });

      function reset() {

        options.beginning = options.ending = 0;
        var rotated = Math.random() > 0.5 ? true : false;

        if (rotated) {
          begin = - w / 2;
          end = w / 2;
        } else {
          begin = w / 2;
          end = - w / 2;
        }

        for (i = 0; i < amount; i++) {
          s = shapes[i];
          shapes.visible = false;
          points = s.vertices;
          points[0].x = points[1].x = points[2].x = points[3].x = begin;
        }

        playing = false;

        _in.stop();
        _out.stop();

      }

      var exports = {
        start: start,
        update: update,
        clear: reset,
        resize: resize,
        playing: function() { return playing; },
      };

      reset();

      return exports;

    })();
