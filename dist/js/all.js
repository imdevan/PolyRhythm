var _this = this;

var animationController = {
    dict: {
        "veil": veil,
        "ufo": ufo,
        "suspension": suspension,
        "highRise": highRise,
        "starExplode": starExplode,
        "clay": clay,
        "circlePop": circlePop,
        "horizontalLines": horizontalLines,
        "strike": strike,
        "squiggle": squiggle,
        "flash": flash,
        "dotted_spiral": dotted_spiral,
        "centerCircle": centerCircle,
        // THIS ONE IS WEIRD
        "audienceShapes": audienceShapes
    },
    trigger: animations => {
        var that = _this;
        _.each(animations, key => {
            animation = that.dict[key];
            if (animation) {
                if (animation.playing()) {
                    animation.clear();
                }
                animation.start(undefined, undefined);
            }
        });
    }
};

two.bind('update', () => {
    TWEEN.update();
}).play();
// Environment Set Up
var type = /(canvas|webgl)/.test(url.type) ? url.type : 'svg',
    two = new Two({
    type: Two.Types[type],
    fullscreen: true
}).appendTo(document.querySelector('#two')),
    Easing = TWEEN.Easing;

// Animation Related Variables and helpers
var width = $(window).width(),
    height = $(window).height();
var center = { x: width / 2, y: height / 2 };
var min_dimension = width > height ? height : width;
var TWO_PI = Math.PI * 2;
var duration = 1000;
var shortDuration = duration * 0.3;
var mediumDuration = duration * 0.75;
var rand = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

function map(v, i1, i2, o1, o2) {
    return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
}

var colors = {
    // inspo: https://dribbble.com/shots/2590101-BeBright-App
    morning: ["#FFE481", "#FB8C8E", "#C695FA"],
    // inspo: varying
    afternoon: ["#A6F4FE", "#E9547D", "#DFD4B8"],
    // inspo: https://dribbble.com/shots/2590588-Login-Startup-Screen
    night: ["#DE1157", "#F2A600", "#1F285E"]
};

function convertHex(hex, opacity) {
    hex = hex.replace('#', '');
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);

    result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
    return result;
}

var currentPallette = colors.afternoon;

document.querySelector('body').style.backgroundImage = 'linear-gradient(45deg' + ', ' + currentPallette[0] + ', ' + currentPallette[1] + ', ' + currentPallette[2] + ')';

var midCornerPositions = [{
    x: width - width / 3,
    y: height / 3 / 2
}, {
    x: width - width / 3,
    y: height - height / 3 / 2
}, {
    x: width / 3,
    y: height / 3 / 2
}, {
    x: width / 3,
    y: height - height / 3 / 2
}, {
    x: width - width / 3 / 2,
    y: height / 3
}, {
    x: width - width / 3 / 2,
    y: height - height / 3
}, {
    x: width / 3 / 2,
    y: height / 3
}, {
    x: width / 3 / 2,
    y: height - height / 3
}];

function lerp(a, b, t) {
    return (b - a) * t + a;
}

// ======================================
// BACK GROUND
// ======================================
var backGround = two.makeGroup();

var veil = function () {

    var callback = _.identity;
    var playing = false;

    var direction = true;
    var points = [new Two.Anchor(-center.x, -center.y), new Two.Anchor(center.x, -center.y), new Two.Anchor(center.x, center.y), new Two.Anchor(-center.x, center.y)];
    var shape = two.makePath(points);
    shape.fill = currentPallette[rand(0, currentPallette.length)];
    shape.noStroke();

    var start = function (onComplete, silent) {
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

    var update = function () {
        shape.fill = "#EEE";
    };
    var resize = function () {
        points[0].set(-center.x, -center.y);
        points[1].set(center.x, -center.y);
        points[2].set(center.x, center.y);
        points[3].set(-center.x, center.y);
    };

    var dest_in = { y: center.y },
        dest_out = { y: 0 };

    var animate_in = new TWEEN.Tween(shape.translation).to(dest_in, duration * 0.5).easing(Easing.Exponential.Out).onComplete(function () {
        animate_out.start();
    });

    var animate_out = new TWEEN.Tween(shape.translation).to(dest_out, duration * 0.5).easing(Easing.Exponential.In).onComplete(function () {
        start.onComplete();
        callback();
    });

    reset();

    function reset() {
        shape.visible = false;
        shape.fill = currentPallette[rand(0, currentPallette.length)];
        playing = false;
        direction = Math.random() > 0.5;
        if (direction) {
            shape.translation.set(center.x, -center.y);
            dest_out.y = height * 1.5;
        } else {
            shape.translation.set(center.x, height * 1.5);
            dest_out.y = -center.y;
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
        playing: function () {
            return playing;
        },
        hash: '1,1',
        filename: 'veil'
    };

    return exports;
}();

var highRise = function () {
    var callback = _.identity,
        colCount = 5,
        playing = false,
        shape = two.makeRectangle(0, 0, width / colCount * 1.5, height);
    shape.fill = currentPallette[0];
    shape.noStroke();
    shape.visible = true;

    var start = function (onComplete, silent) {
        playing = true;
        shape.visible = true;
        animate_in.start();

        if (_.isFunction(onComplete)) {
            callback = onComplete;
        }
    };

    start.onComplete = reset;

    var animate_in = new TWEEN.Tween(shape.translation).to({ y: center.y }, shortDuration).easing(Easing.Cubic.Out).onComplete(function () {
        animate_out.start();
    });
    console.log(Easing);
    var animate_out = new TWEEN.Tween(shape.translation).to({ y: height + height / 2 }, shortDuration).easing(Easing.Cubic.Out).onComplete(function () {
        start.onComplete();
        callback();
    });

    reset();

    function reset() {
        var newPos = { x: width / (rand(0, colCount) + 1), y: height + height / 2 };
        shape.translation.set(newPos.x, newPos.y);
        shape.visible = false;
        shape.fill = currentPallette[0];
        playing = false;
        animate_in.stop();
        animate_out.stop();
    }

    var exports = {
        start: start,
        clear: reset,
        playing: function () {
            return playing;
        }
    };

    return exports;
}();

var flash = function () {

    var playing = false;
    var callback = _.identity;

    var shape = two.makeRectangle(center.x, center.y, width, height);
    var timeout;
    shape.noStroke().fill = currentPallette[0];
    shape.visible = false;

    var start = function (onComplete, silent) {
        if (!_.isUndefined(timeout)) {
            clearTimeout(timeout);
            timeout = undefined;
        }
        playing = true;
        if (!silent && exports.sound) {
            exports.sound.stop().play();
        }
        timeout = setTimeout(function () {
            playing = false;
            callback();
            shape.visible = false;
        }, duration * 0.25);
        if (_.isFunction(onComplete)) {
            callback = onComplete;
        }
    };

    var update = function () {
        shape.fill = currentPallette[0];
    };

    var resize = function () {
        var vertices = shape.vertices;
        vertices[0].set(-center.x, -center.y);
        vertices[1].set(center.x, -center.y);
        vertices[2].set(center.x, center.y);
        vertices[3].set(-center.x, center.y);
        shape.translation.copy(center);
    };

    two.bind('update', function () {
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
        playing: function () {
            return playing;
        }
    };
    return exports;
}();

var starExplode = function () {
    var callback = _.identity;
    var playing = false;

    var shape = two.makeStar(center.x, center.y, 200, 400, 5);
    var randColor = randomColor({ luminosity: 'light' });
    shape.fill = convertHex(randColor, 100);
    shape.stroke = convertHex(randColor, 100);
    shape.linewidth = 10;
    shape.visible = true;
    shape.scale = 0;

    var start = function (onComplete, silent) {
        var randColor = randomColor({ luminosity: 'light' });
        shape.fill = convertHex(randColor, 100);
        shape.stroke = convertHex(randColor, 100);
        playing = true;
        shape.visible = true;
        animate_in.start();
        if (_.isFunction(onComplete)) {
            callback = onComplete;
        }
    };
    start.onComplete = reset;

    var animate_in = new TWEEN.Tween(shape).to({ scale: 1 }, duration * .2).easing(Easing.Exponential.Out).onComplete(function () {
        animate_out.start();
    });
    var animate_out = new TWEEN.Tween(shape).to({ scale: 0 }, duration * .2).easing(Easing.Exponential.In).onComplete(function () {
        start.onComplete();
        callback();
    });
    reset();
    function reset() {
        shape.rotation = Math.PI * Math.random() * 10;
        shape.visible = true;
        playing = false;
        animate_in.stop();
        animate_out.stop();
    }
    var exports = {
        start: start,
        clear: reset,
        playing: function () {
            return playing;
        }
    };
    return exports;
}();

// ======================================
// MIDDLE GROUND
// ======================================
var middleGround = two.makeGroup();

var suspension = function () {

    var playing = false,
        callback = _.identity,
        amount = 16,
        r1 = min_dimension * 40 / 900,
        r2 = min_dimension * 60 / 900,
        theta,
        deviation,
        distance = height,
        destinations = [],
        circles = _.map(_.range(amount), function (i) {
        var r = Math.round(map(Math.random(), 0, 1, r1, r2));
        var circle = two.makeCircle(0, 0, r);
        circle.fill = colors.white;
        circle.noStroke();
        destinations.push(new Two.Vector());
        return circle;
    });

    var group = two.makeGroup(circles);
    group.translation.set(center.x, center.y);

    var i, c;
    var start = function (onComplete, silent) {
        for (i = 0; i < amount; i++) {
            circles[i].visible = true;
        }
        _in.start();
        if (!silent && exports.sound) {
            exports.sound.stop().play();
        }
        if (_.isFunction(onComplete)) {
            callback = onComplete;
        }
    };

    start.onComplete = reset;

    var options = { ending: 0 },
        t,
        d,
        x,
        y;

    var _in = new TWEEN.Tween(options).to({ ending: 1 }, duration * 0.5).easing(Easing.Sinusoidal.Out).onStart(function () {
        playing = true;
    }).onUpdate(function () {
        t = options.ending;
        for (i = 0; i < amount; i++) {
            c = circles[i];
            d = destinations[i];
            x = lerp(c.translation.x, d.x, t);
            y = lerp(c.translation.y, d.y, t);
            c.translation.set(x, y);
        }
    }).onComplete(function () {
        start.onComplete();
        callback();
    });

    function reset() {
        theta = Math.random() * TWO_PI;
        deviation = map(Math.random(), 0, 1, Math.PI / 4, Math.PI / 2);
        options.ending = 0;

        for (i = 0; i < amount; i++) {
            c = circles[i];
            t = theta + Math.random() * deviation * 2 - deviation;
            a = Math.random() * distance;
            x = a * Math.cos(t);
            y = a * Math.sin(t);
            destinations[i].set(x, y);
            c.visible = false;
            c.fill = randomColor();
            c.translation.set(0, 0);
        }

        playing = false;
        _in.stop();
    }

    reset();

    var exports = {
        start: start,
        clear: reset,
        playing: function () {
            return playing;
        }
    };

    return exports;
}();

// ======================================
// FORE GROUND
// ======================================
var foreGround = two.makeGroup();

var circlePop = function () {
    var callback = _.identity,
        playing = false,
        shape = two.makeCircle(center.x, center.y, 200, 200);
    shape.fill = "#FFF";
    shape.noStroke();
    shape.visible = true;

    var start = function (onComplete, silent) {
        playing = true;
        shape.visible = true;
        animate_in.start();

        if (_.isFunction(onComplete)) {
            callback = onComplete;
        }
    };

    start.onComplete = reset;

    var animate_in = new TWEEN.Tween(shape).to({ scale: 1 }, shortDuration).easing(Easing.Exponential.Out).onComplete(function () {
        animate_out.start();
    });

    var animate_out = new TWEEN.Tween(shape).to({ scale: 0 }, shortDuration).easing(Easing.Exponential.Out).onComplete(function () {
        start.onComplete();
        callback();
    });

    reset();

    function reset() {
        var newPos = midCornerPositions[rand(0, midCornerPositions.length)];
        shape.translation.set(newPos.x, newPos.y);
        shape.visible = false;
        shape.fill = currentPallette[rand(0, currentPallette.length)];
        playing = false;
        animate_in.stop();
        animate_out.stop();
    }

    var exports = {
        start: start,
        clear: reset,
        playing: function () {
            return playing;
        }
    };
    return exports;
}();

var horizontalLines = function () {

    var playing = false;
    var callback = _.identity;

    var distance = min_dimension * 0.5;

    var line = two.makeLine(-width, center.y - center.y * .25, 0, center.y - center.y * .25);
    var line2 = two.makeLine(width, center.y + center.y * .25, 2 * width, center.y + center.y * .25);

    line.noFill().stroke = "#333";
    line.visible = true;

    line2.noFill().stroke = "#333";
    line2.visible = true;

    var start = function (onComplete, silent) {
        line.visible = true;
        playing = true;
        animate_in.start();
        animate_in2.start();
        if (_.isFunction(onComplete)) {
            callback = onComplete;
        }
    };

    start.onComplete = reset;

    var animate_in = new TWEEN.Tween(line.translation).to({
        x: 2 * width + width / 2
    }, duration * 0.7).easing(Easing.Circular.In).onComplete(function () {
        //animate_out.start();
        start.onComplete();
        callback();
    });

    var animate_in2 = new TWEEN.Tween(line2.translation).to({
        x: -2 * width + width / 2
    }, duration * 0.7).easing(Easing.Circular.In).onComplete(function () {
        //animate_out.start();
        start.onComplete();
        callback();
    });

    var animate_out = new TWEEN.Tween(line).to({
        beginning: 1.0
    }, duration * 0.25).easing(Easing.Circular.Out).onComplete(function () {
        start.onComplete();
        callback();
    });

    var exports = {
        start: start,
        clear: reset,
        playing: function () {
            return playing;
        }
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

        line.linewidth = Math.round(rando * 5) + 7;
        line2.linewidth = Math.round(rando * 5) + 7;
        line.translation.set(-width + width / 2, line.translation.y);
        line2.translation.set(width + width / 2, line2.translation.y);

        line.ending = line.beginning = 0;
        line.ending = 1;
        line.visible = true;
        line2.visible = true;

        animate_in.stop();
        animate_out.stop();
    }

    reset();

    return exports;
}();

// Util functions
function angleBetween(v1, v2) {
  var dx = v2.x - v1.x;
  var dy = v2.y - v2.y;
  return Math.atan2(dy, dx);
}

var audienceShapes = function (type, color) {
  return function () {
    var callback = _.identity;
    var playing = false;
    var actual = type;
    var shape;
    type = type || "star";
    switch (type) {
      case "sqaure":
        shape = two.makeRectangle(center.x, center.y, 50, 50);
        break;
      case "circle":
        shape = two.makeCircle(center.x, center.y, 50 / 2);
        break;
      case "triangle":
        shape = two.makePolygon(center.x, center.y, 50 / 2, 3);
        break;
      case "star":
        shape = two.makeStar(center.x, center.y, 50 / 2, 40, 5);
        break;
    }
    middleGround.add(shape);

    var randColor = color;
    shape.fill = convertHex(randColor, 50);
    shape.stroke = convertHex(randColor, 100);
    shape.linewidth = 5;
    shape.visible = true;
    shape.rotation = Math.PI * Math.random() * 10;
    shape.scale = 1;

    var angle = Math.PI * Math.random() * 10;
    console.log("Angle ", angle);

    var posx = Math.cos(angle);
    var posy = Math.sin(angle);

    console.log(posx, posy);

    // distance = Math.round(map(Math.random(), 0, 1, height, width));

    posx *= width;
    posy *= width;

    posx += center.x;
    posy += center.y;

    var start = function (onComplete, silent) {
      playing = true;
      shape.visible = true;
      animate_in.start();
      if (_.isFunction(onComplete)) {
        callback = onComplete;
      }
    };
    start.onComplete = reset;

    var dest_in = { x: posx, y: posy };

    var animate_in = new TWEEN.Tween(shape.translation).to(dest_in, duration * 4).easing(Easing.Exponential.Out).onComplete(function () {
      animate_out.start();
      two.remove(shape);
    });
    var animate_out = new TWEEN.Tween(shape).to({ scale: 0 }, duration * 1).easing(Easing.Exponential.In).onComplete(function () {
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
      playing: function () {
        return playing;
      }
    };
    return exports;
  }();
};

var centerCircle = function () {
  var callback = _.identity;
  var playing = false;
  var direction = true;
  var pulseMin = 0.50;
  var pulseDistance = 0.5;
  var pulseIn = pulseMin + pulseDistance;
  var pulseOut = pulseMin;
  var shape = two.makeCircle(center.x, center.y, 200, 200);
  shape.fill = "#FFF";
  shape.noStroke();
  shape.visible = true;
  shape.scale = pulseMin;
  var start = function (onComplete, silent) {
    var x = acceleration / 40 * 1.5;
    if (x > 2) x = 2;
    if (x < pulseMin) x = pulseMin;
    if (x > pulseOut) {
      pulseIn = x + pulseDistance;
      pulseOut = x;
    } else if (x < pulseOut) {
      pulseIn = pulseIn;
      pulseOut = x;
    }
    playing = true;
    shape.visible = true;
    animate_in.start();
    if (_.isFunction(onComplete)) {
      callback = onComplete;
    }
  };
  start.onComplete = reset;
  var pI = { scale: pulseIn };
  var pO = { scale: pulseOut };
  var animate_in = new TWEEN.Tween(shape).to(pI, duration * 0.04).easing(Easing.Exponential.Out).onComplete(function () {
    animate_out.start();
  });
  var animate_out = new TWEEN.Tween(shape).to(pO, duration * 0.04).easing(Easing.Exponential.In).onComplete(function () {
    start.onComplete();
    callback();
  });
  reset();
  function reset() {
    pI.scale = pulseIn;
    pO.scale = pulseOut;
    shape.visible = true;
    playing = false;
    animate_in.stop();
    animate_out.stop();
  }
  var exports = {
    start: start,
    clear: reset,
    playing: function () {
      return playing;
    }
  };
  return exports;
}();

var ufo = function () {

  var playing = false;
  var callback = _.identity;

  var radius = min_dimension * 0.25;
  var circle = two.makeCircle(0, 0, radius);
  circle.noStroke().fill = "#6ECCFA";

  var start = function (onComplete, silent) {
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

  var update = function () {
    circle.fill = "#6ECCFA";
  };
  var resize = function () {
    radius = min_dimension * 0.25;
  };

  circle.destination = { y: center.y };

  var _in = new TWEEN.Tween(circle.translation).to(circle.destination, duration / 2).easing(Easing.Circular.Out).onComplete(function () {
    _out.start();
  });

  var _out = new TWEEN.Tween(circle).to({ scale: 0 }, duration / 2).easing(Easing.Circular.Out).onComplete(function () {
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
      circle.origin = circle.translation.y = -center.y;
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
    playing: function () {
      return playing;
    },
    hash: '1,2',
    filename: 'ufo'
  };

  return exports;
}();

var dotted_spiral = function () {

  var playing = false;
  var callback = _.identity;
  var amount = 120,
      linewidth = min_dimension / amount,
      resolution = 4;
  var magnitude = min_dimension / 2;

  var lines = _.map(_.range(amount), function (i) {

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
    line.stroke = currentPallette[rand(0, currentPallette.length)];
    line.linewidth = (1 - Math.sqrt(1 - pct)) * linewidth;
    line.cap = line.join = 'round';

    return line;
  });

  var updateLinewidth = function (line, i) {
    var pct = i / amount;
    line.linewidth = Math.sqrt(1 - pct) * linewidth;
  };

  lines.reverse();

  var group = two.makeGroup(lines);
  group.translation.set(center.x, center.y);

  var start = function (onComplete, silent) {
    _in.start();
    if (!silent && exports.sound) {
      exports.sound.stop().play();
    }
    if (_.isFunction(onComplete)) {
      callback = onComplete;
    }
  };

  start.onComplete = reset;

  var update = function () {
    group.stroke = currentPallette[rand(0, currentPallette.length)];
  };
  var resize = function () {
    group.translation.set(center.x, center.y);
    linewidth = min_dimension / amount;
    _.each(lines, updateLinewidth);
  };

  var i, t, index;
  var _in = new TWEEN.Tween(group).onStart(function () {
    playing = true;
  }).easing(Easing.Circular.In).to({ rotation: Math.PI / 8, scale: 8 }, duration * 2).onUpdate(function (u) {
    t = Math.min(map(u, 0, 0.25, 0, 1), 1);
    index = Math.floor(t * amount);
    for (i = 0; i < index; i++) {
      lines[i].visible = true;
    }
  }).onComplete(function () {
    start.onComplete();
    callback();
  });

  var resetLine = function (l) {
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
    playing: function () {
      return playing;
    },
    hash: '0,9',
    filename: 'dotted-spiral'
  };

  return exports;
}();

var clay = function () {

  var callback = _.identity;
  var playing = false;

  var amount = Math.floor(Math.random()) * 8 + 8,
      w = width * Math.random(),
      h = height * Math.random();
  var distance = height,
      rotation = Math.PI / 2;

  var destinations = [];
  var points = _.map(_.range(amount), function (i) {
    var pct = i / amount;
    var theta = TWO_PI * pct;
    var x = distance * Math.sin(theta);
    var y = distance * Math.cos(theta);
    destinations.push(new Two.Vector(x, y));
    return new Two.Anchor(x, y);
  });

  var clay = two.makePath(points);
  clay.fill = currentPallette[1];
  clay.noStroke();

  points = clay.vertices;

  var start = function (onComplete, silent) {
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

  var update = function () {
    clay.fill = currentPallette[1];
  };
  var resize = function () {};

  var options = { ending: 0 };

  var v, i, l, d, x, y, a, theta, ptheta;
  var _in = new TWEEN.Tween(options).to({ ending: 1 }, duration * 0.75).easing(Easing.Circular.In).onStart(function () {
    playing = true;
  }).onUpdate(function () {
    var t = options.ending;
    for (i = 0; i < amount; i++) {
      v = points[i];
      d = destinations[i];
      x = lerp(v.x, d.x, t);
      y = lerp(v.y, d.y, t);
      v.set(x, y);
    }
  }).onComplete(function () {
    start.onComplete();
    callback();
  });

  function reset() {

    clay.visible = false;
    impact = new Two.Vector(Math.random() * width, Math.random() * height);
    var x,
        y,
        pos = Math.random() * 8;
    clay.opacity = 0.5;

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
    } else if (pos > 2) {
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
    playing: function () {
      return playing;
    },
    hash: '0,1',
    filename: 'clay'
  };

  return exports;
}();

var strike = function () {

  var playing = false;
  var callback = _.identity;

  var amount = 32;
  var distance = min_dimension * 0.5;

  var points = _.map(_.range(amount), function (i) {
    return new Two.Anchor();
  });
  var line = two.makePath(points, true);
  line.stroke = currentPallette[rand(0, currentPallette.length)];
  line.translation.set(center.x, center.y);
  line.cap = 'round';

  var start = function (onComplete, silent) {
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

  var resize = function () {
    // distance = height * 0.5;
    line.translation.set(center.x, center.y);
  };
  var update = function () {
    line.stroke = currentPallette[2];
  };

  var animate_in = new TWEEN.Tween(line).to({
    ending: 1.0
  }, duration * 0.25).easing(Easing.Circular.In).onComplete(function () {
    console.log("End of in");
    animate_out.start();
  });

  var animate_out = new TWEEN.Tween(line).to({
    beginning: 1.0
  }, duration * 0.25).easing(Easing.Circular.Out).onComplete(function () {
    console.log("End of out");
    start.onComplete();
    callback();
  });

  var exports = {
    start: start,
    update: update,
    clear: reset,
    resize: resize,
    playing: function () {
      return playing;
    },
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
    line.stroke = currentPallette[rand(0, currentPallette.length)];
    line.linewidth = Math.round(rando * 7) + 3;
    distance = Math.round(map(rando, 0, 1, height * 0.5, width));
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
}();

var squiggle = function () {

  var playing = false;
  var callback = _.identity;
  var amount = 200,
      w = center.x,
      phi = 6,
      h = height * 0.33;
  var offset = Math.PI * 0.5;

  var points = _.map(_.range(amount), function (i) {
    var pct = i / amount;
    var theta = TWO_PI * phi * pct + offset;
    var x = map(pct, 0, 1, -w / 2, w / 2);
    var y = h * Math.sin(theta);
    return new Two.Anchor(x, y);
  });

  var squiggle = two.makePath(points, true);
  squiggle.translation.set(center.x, center.y);
  squiggle.stroke = currentPallette[1];
  squiggle.linewidth = min_dimension / 40;
  squiggle.cap = squiggle.join = 'round';
  squiggle.noFill();

  // points = squiggle.vertices;

  var start = function (onComplete, silent) {
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

  var update = function () {
    squiggle.stroke = currentPallette[1];
  };
  var resize = function () {
    w = center.x;
    h = height * 0.33;
    squiggle.linewidth = min_dimension / 40;
    squiggle.translation.set(center.x, center.y);
  };

  // var options = { ending: 0, beginning: 0 };

  var _in = new TWEEN.Tween(squiggle).to({ ending: 1.0 }, duration / 2).easing(Easing.Sinusoidal.Out).onComplete(function () {
    _out.start();
  });

  var _out = new TWEEN.Tween(squiggle).to({ beginning: 1.0 }, duration / 2).easing(Easing.Sinusoidal.In).onComplete(function () {
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
      x = map(pct, 0, 1, -w / 2, w / 2);
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
    playing: function () {
      return playing;
    },
    hash: '0,7',
    filename: 'squiggle'
  };

  return exports;
}();

var pistons = function () {
  var i = 1;
  var playing = false;
  var callback = _.identity;

  var amount = i * 4 + 1,
      w = width * 0.75,
      h = center.y;
  var begin, end;

  var group = two.makeGroup();
  group.translation.copy(center);

  var shapes = _.map(_.range(amount), function (i) {

    var d = h / amount - h / (amount * 3);
    var x = 0;
    var y = -h / 2 + (i + 1) * (h / (amount + 1));

    var shape = two.makeRectangle(x, y, w, d);

    shape.fill = "#C695FA";
    shape.noStroke();

    group.add(shape);

    return shape;
  });

  var options = { ending: 0, beginning: 0 };

  var showShape = function (shape) {
    shape.visible = true;
  };

  var start = function (onComplete, silent) {
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
  var update = function () {
    for (i = 0; i < amount; i++) {
      shapes[i].fill = currentPallette[0];
    }
  }; // Mainly for color in the future
  var resize = function () {
    w = width * 0.75, h = center.y;
    group.translation.copy(center);
  };

  var _in = new TWEEN.Tween(options).to({ ending: 1.0 }, duration * 0.125).easing(Easing.Sinusoidal.Out).onStart(function () {
    playing = true;
  }).onUpdate(function () {
    for (i = 0; i < amount; i++) {
      s = shapes[i];
      points = s.vertices;
      points[3].x = points[0].x = end * options.ending;
    }
  }).onComplete(function () {
    _out.start();
  });

  var _out = new TWEEN.Tween(options).to({ beginning: 1.0 }, duration * 0.125).easing(Easing.Sinusoidal.Out).onUpdate(function () {
    for (i = 0; i < amount; i++) {
      s = shapes[i];
      points = s.vertices;
      points[1].x = points[2].x = end * options.beginning;
    }
  }).onComplete(function () {
    start.onComplete();
    callback();
  });

  function reset() {

    options.beginning = options.ending = 0;
    var rotated = Math.random() > 0.5 ? true : false;

    if (rotated) {
      begin = -w / 2;
      end = w / 2;
    } else {
      begin = w / 2;
      end = -w / 2;
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
    playing: function () {
      return playing;
    }
  };

  reset();

  return exports;
}();

var pistons = function () {
  var i = 1;
  var playing = false;
  var callback = _.identity;

  var amount = i * 4 + 1,
      w = width * 0.75,
      h = center.y;
  var begin, end;

  var group = two.makeGroup();
  group.translation.copy(center);

  var shapes = _.map(_.range(amount), function (i) {

    var d = h / amount - h / (amount * 3);
    var x = 0;
    var y = -h / 2 + (i + 1) * (h / (amount + 1));

    var shape = two.makeRectangle(x, y, w, d);

    shape.fill = "#C695FA";
    shape.noStroke();

    group.add(shape);

    return shape;
  });

  var options = { ending: 0, beginning: 0 };

  var showShape = function (shape) {
    shape.visible = true;
  };

  var start = function (onComplete, silent) {
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
  var update = function () {
    for (i = 0; i < amount; i++) {
      shapes[i].fill = currentPallette[rand(0, currentPallette.length)];
    }
  }; // Mainly for color in the future
  var resize = function () {
    w = width * 0.75, h = center.y;
    group.translation.copy(center);
  };

  var _in = new TWEEN.Tween(options).to({ ending: 1.0 }, duration * 0.125).easing(Easing.Sinusoidal.Out).onStart(function () {
    playing = true;
  }).onUpdate(function () {
    for (i = 0; i < amount; i++) {
      s = shapes[i];
      points = s.vertices;
      points[3].x = points[0].x = end * options.ending;
    }
  }).onComplete(function () {
    _out.start();
  });

  var _out = new TWEEN.Tween(options).to({ beginning: 1.0 }, duration * 0.125).easing(Easing.Sinusoidal.Out).onUpdate(function () {
    for (i = 0; i < amount; i++) {
      s = shapes[i];
      points = s.vertices;
      points[1].x = points[2].x = end * options.beginning;
    }
  }).onComplete(function () {
    start.onComplete();
    callback();
  });

  function reset() {

    options.beginning = options.ending = 0;
    var rotated = Math.random() > 0.5 ? true : false;

    if (rotated) {
      begin = -w / 2;
      end = w / 2;
    } else {
      begin = w / 2;
      end = -w / 2;
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
    playing: function () {
      return playing;
    }
  };

  reset();

  return exports;
}();
var socket = io();
socket.emit('audience_init');

shapes = ["sqaure", "circle", "triangle", "star"];

shape = shapes[Math.floor(Math.random() * shapes.length)];
color = randomColor();

var acc = null;
var button = document.getElementById("button");

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function setButtonHeightWidth() {
	var height = window.innerHeight;
	var width = window.innerWidth;
	var setHeight = 0;
	var setWidth = 0;

	if (height > width) {
		setWidth = width * .6;
		setHeight = setWidth;
	} else {
		setWidth = height * .6;
		setHeight = setWidth;
	}
	button.style.width = setWidth + "px";
	button.style.height = setHeight + "px";
	button.style.lineHeight = setHeight + "px";
	var str = capitalizeFirstLetter(shape);
	button.innerHTML = str + "!";
}

window.onload = setButtonHeightWidth;
window.onresize = setButtonHeightWidth;

function send() {
	var send = Math.sqrt(acc.acceleration.x * acc.acceleration.x + acc.acceleration.y * acc.acceleration.y + acc.acceleration.z * acc.acceleration.z);
	socket.emit("audience_acceleration", send);
}

setInterval(send, 750);

window.addEventListener('devicemotion', function (event) {
	acc = event;
});

var button = document.getElementById("button");
button.style.backgroundColor = color;
var mytimeout = null;

button.addEventListener("touchstart", buttonPress, false);

function buttonPress(event) {
	console.log("in here");
	//button.classList.remove("comingback");
	button.classList.add("active");
	clearTimeout(mytimeout);
	mytimeout = setTimeout(removeActive, 1000);
	socket.emit("audience_shape", { shape: shape, color: color });
}

function removeActive() {
	button.classList.remove("active");
	//button.classList.add("comingback");
}
// this takes in events of all sorts
// if the event is midi, pass the identifier to triggered
// sets up the event listener which eventually triggers animationController
window.addEventListener("keydown", function (e, data) {
    if (e.metaKey || e.ctrlKey) {
        return;
    }

    console.log(e.which);
    // 85 73 79 80 [u - p]
    // 74 45 76 186 [j - ;]
    // 78 77 188 190 [n - .]
    // 81 87 69 82 [q - r]
    // 65 83 68 70 [a - f]
    // 90 88 67 86 [z - v]
    var animationsToTrigger = [];
    var soundsToTrigger = [];
    switch (e.which) {
        case 85:
            animationsToTrigger.push("veil");
            break;
        case 73:
            animationsToTrigger.push("ufo");
            animationsToTrigger.push("centerCircle");
            break;
        case 79:
            animationsToTrigger.push("suspension");
            break;
        case 80:
            animationsToTrigger.push("ufo");
            animationsToTrigger.push("centerCircle");
            break;
        case 74:
            animationsToTrigger.push("starExplode");
            break;
        case 45:
            animationsToTrigger.push("clay");
            animationsToTrigger.push("centerCircle");
            break;
        case 76:
            animationsToTrigger.push("circlePop");
            break;
        case 186:
            animationsToTrigger.push("horizontalLines");
            animationsToTrigger.push("centerCircle");
            break;
        case 78:
            animationsToTrigger.push("strike");
            break;
        case 77:
            animationsToTrigger.push("strike");
            animationsToTrigger.push("centerCircle");
            break;
        case 34:
            animationsToTrigger.push("flash");
            break;
        case 188:
            animationsToTrigger.push("dotted_spiral");
            break;
        case 190:
            animationsToTrigger.push("centerCircle");
            break;
        case 81:
            animationsToTrigger.push("centerCircle");
            soundsToTrigger.push("kick");
            break;
        case 87:
            animationsToTrigger.push("strike");
            soundsToTrigger.push("snare");
            break;
        case 69:
            animationsToTrigger.push("suspension");
            soundsToTrigger.push("droplet");
            break;
        case 82:
            animationsToTrigger.push("starExplode");
            soundsToTrigger.push("carSound");
            break;
        case 65:
            animationsToTrigger.push("ufo");
            soundsToTrigger.push("pikaHi");
            break;
        case 83:
            animationsToTrigger.push("circlePop");
            soundsToTrigger.push("pikaLow");
            break;
        case 68:
            animationsToTrigger.push("veil");
            soundsToTrigger.push("kirby");
            break;
        case 70:
            animationsToTrigger.push("horizontalLines");
            soundsToTrigger.push("iphone");
            break;
    }

    animationController.trigger(animationsToTrigger);
    soundController.trigger(soundsToTrigger);
    e.preventDefault();
});
var AudioContext = AudioContext || webkitAudioContext,
    // for ios/safari
context = new AudioContext(),
    data,
    cmd,
    channel,
    type,
    note,
    velocity,
    midiDeviceConnected = false;

// request MIDI access
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({
        sysex: false
    }).then(onMIDISuccess, onMIDIFailure);
} else {
    console.log("No MIDI support in your browser.");
}

// midi functions
function onMIDISuccess(midiAccess) {
    midiDeviceConnected = true;
    midi = midiAccess;
    var inputs = midi.inputs.values();
    // loop through all inputs
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        // listen for midi messages
        input.value.onmidimessage = onMIDIMessage;
        // this just lists our inputs in the console
        listInputs(input);
    }
    // listen for connect/disconnect message
    midi.onstatechange = onStateChange;
}

function onMIDIFailure(midiAccess) {
    console.log("Shit's broke - midi - ", midiAccess);
}
function onMIDIMessage(event) {
    console.log(event);
    data = event.data, cmd = data[0] >> 4, channel = data[0] & 0xf, type = data[0] & 0xf0, // channel agnostic message type. Thanks, Phil Burk.
    note = data[1], velocity = data[2];
    // with pressure and tilt off
    // note off: 128, cmd: 8
    // note on: 144, cmd: 9
    // pressure / tilt on
    // pressure: 176, cmd 11:
    // bend: 224, cmd: 14

    switch (type) {
        case 144:
            // noteOn message
            noteOn(note, velocity);
            break;
        case 128:
            // noteOff message
            break;
    }
}

function listInputs(inputs) {
    var input = inputs.value;
    console.log("Input port : [ type:'" + input.type + "' id: '" + input.id + "' manufacturer: '" + input.manufacturer + "' name: '" + input.name + "' version: '" + input.version + "']");
}

function noteOn(midiNote, velocity) {
    // mpk mini layout
    // 36 38 40 41
    // 43 45 47 48
    // alesis
    // 49 41 42 46
    // 36 37 69 39
    // launchpad
    // 0 1 2 3
    // 16 17 18 19
    // 32 33 34 35
    // 48 49 50 51
    var animationsToTrigger = [];
    var soundsToTrigger = [];
    switch (midiNote) {
        case 0:
            animationsToTrigger.push("veil");
            break;
        case 97:
            soundsToTrigger.push("pikaHi");
            animationsToTrigger.push("starExplode");
            break;
        case 98:
            animationsToTrigger.push("suspension");
            break;
        case 99:
            animationsToTrigger.push("ufo");
            animationsToTrigger.push("centerCircle");
            break;
        case 16:
            animationsToTrigger.push("starExplode");
            break;
        case 17:
            animationsToTrigger.push("clay");
            animationsToTrigger.push("centerCircle");
            break;
        case 18:
            animationsToTrigger.push("circlePop");
            break;
        case 19:
            animationsToTrigger.push("horizontalLines");
            animationsToTrigger.push("centerCircle");
            break;
        case 32:
            animationsToTrigger.push("strike");
            break;
        case 33:
            animationsToTrigger.push("strike");
            animationsToTrigger.push("centerCircle");
            break;
        case 34:
            animationsToTrigger.push("flash");
            break;
        case 35:
            animationsToTrigger.push("dotted_spiral");
            break;
        case 48:
            animationsToTrigger.push("centerCircle");
            break;
    }
    console.log("MIDI Note", midiNote);
    animationController.trigger(animationsToTrigger);
    soundController.trigger(soundsToTrigger);
    // socket.emit('animation_output', {animations: animationsToTrigger});
}

function logger(data) {
    console.log(" [channel: " + (data[0] & 0xf) + ", cmd: " + (data[0] >> 4) + ", type: " + (data[0] & 0xf0) + " , note: " + data[1] + " , velocity: " + data[2] + "]");
}

function onStateChange(event) {
    var port = event.port,
        state = port.state,
        name = port.name,
        type = port.type;
    if (type == "input") console.log("name", name, "port", port, "state", state);
}
var infoPopUp = document.querySelector('.info--popup');
var infoWindow = document.querySelector('.info--window');
var idleTime = 0;

function showInfo() {
    idleTime = 0;
    infoPopUp.classList.add('show');
    infoWindow.classList.add('show');
}
function hideInfo() {
    infoPopUp.classList.remove('show');
    infoWindow.classList.remove('show');
}

window.addEventListener("mousemove", function (e) {
    showInfo();
});

window.addEventListener("keydown", function (e) {
    hideInfo();
});

function timerIncrement() {
    idleTime++;
    if (idleTime > 2) {
        hideInfo();
    }
}

(function () {
    setInterval(timerIncrement, 1000); // 1 second
})();

var test = require("./socket-init");
var test1 = require("./sounds");
var test2 = require("./sound-controller");
var test3 = require("./animations-og");
var test4 = require("./animations");
var test5 = require("./animation-controller");
var test6 = require("./midi-input");
var test7 = require("./key-input");
var test8 = require("./mouse-info");
var test9 = require("./socket-input");
var socket = io();

var buttons = document.querySelector(".phone-container");
buttons.addEventListener("touchstart", buttonPress, false);
buttons.addEventListener("touchend", buttonPress, false);

function buttonPress(event) {
	if (event.target !== event.currentTarget) {
		var clickedItem = event.target;
		switch (event.type) {
			case "touchstart":
				clickedItem.classList.add("active");
				var msg = {
					animations: [],
					audio: null
				};
				switch (clickedItem.dataset.id) {
					case "1":
						msg.animations.push("ufo");
						msg.animations.push("starExplode");
						msg.animations.push("centerCircle");
						msg.audio = "kick";
						break;
					case "2":
						msg.animations.push("centerCircle");
						msg.audio = "snare";
						break;
					case "3":
						msg.animations.push("highRise");
						msg.animations.push("centerCircle");
						msg.animations.push("clay");
						msg.audio = "droplet";
						break;
					case "4":
						msg.animations.push("centerCircle");
						msg.audio = "carSound";
						break;
					case "5":
						msg.animations.push("ufo");
						msg.animations.push("centerCircle");
						msg.animations.push("strike");
						msg.animations.push("circlePop");
						msg.audio = "pikaHi";
						break;
					case "6":
						msg.animations.push("centerCircle");
						msg.animations.push("circlePop");
						msg.audio = "pikaLow";
						break;
					case "7":
						msg.animations.push("veil");
						msg.animations.push("centerCircle");
						msg.audio = "kirby";
						break;
					case "8":
						msg.animations.push("strike");
						msg.animations.push("horizontalLines");
						msg.animations.push("centerCircle");
						msg.audio = "iphone";
						break;
				}
				socket.emit('animation_output', msg);
				break;
			case "touchend":
				clickedItem.classList.remove("active");
				break;
		}
	}
	event.stopPropagation();
}
var socket = io();

var acceleration = 0;
socket.on("animation_input", function (msg) {
	if (msg.animations) {
		animationController.trigger(msg.animations);
	}
	if (msg.audio) {
		soundController.dict[msg.audio].play();
	}
});

socket.on("acceleration_input", function (msg) {
	acceleration = msg;
});

socket.on("audience_shape_input", function (msg) {
	console.log(msg.shape);
	animationController.dict["audienceShapes"](msg.shape, msg.color).start();
});
var soundController = {
    dict: {
        "kick": kick,
        "snare": snare,
        "droplet": droplet,
        "carSound": carSound,
        "pikaHi": pikaHi,
        "pikaLow": pikaLow,
        "kirby": kirby,
        "iphone": iphone
    },
    init: function () {
        $.each(this.dict, function (key, val) {
            console.log(val);
            val.init();
        });
    },
    trigger: function (sounds) {
        var that = this;
        _.each(sounds, function (key) {
            sound = that.dict[key];
            if (sound) {
                sound.play();
            }
        });
    }
};

soundController.init();
// the organization of this is so redundant
// that we should probably use actual classes instead of singletons
// I'll look into that later :3

var kick = function () {
	var id = 'kick';
	var init = function () {
		console.log(init, id);
		createjs.Sound.registerSound('../../assets/kick.wav', id);
	};
	var play = function () {
		createjs.Sound.play(id);
	};
	var exports = {
		id: id,
		init: init,
		play: play
	};
	return exports;
}();

var snare = function () {
	var id = 'snare';
	var init = function () {
		console.log(init, id);
		createjs.Sound.registerSound('../../assets/snare.mp3', id);
	};
	var play = function () {
		createjs.Sound.play(id);
	};
	var exports = {
		id: id,
		init: init,
		play: play
	};
	return exports;
}();

var droplet = function () {
	var id = 'droplet';
	var init = function () {
		console.log(init, id);
		createjs.Sound.registerSound('../../assets/droplet.mp3', id);
	};
	var play = function () {
		createjs.Sound.play(id);
	};
	var exports = {
		id: id,
		init: init,
		play: play
	};
	return exports;
}();

var carSound = function () {
	var id = 'carSound';
	var init = function () {
		console.log(init, id);
		createjs.Sound.registerSound('../../assets/car_tweet.mp3', id);
	};
	var play = function () {
		createjs.Sound.play(id);
	};
	var exports = {
		id: id,
		init: init,
		play: play
	};
	return exports;
}();

var pikaHi = function () {
	var id = 'pikaHi';
	var init = function () {
		console.log(init, id);
		createjs.Sound.registerSound('../../assets/pika_hi.mp3', id);
	};
	var play = function () {
		createjs.Sound.play(id);
	};
	var exports = {
		id: id,
		init: init,
		play: play
	};
	return exports;
}();

var pikaLow = function () {
	var id = 'pikaLow';
	var init = function () {
		console.log(init, id);
		createjs.Sound.registerSound('../../assets/pika_low.mp3', id);
	};
	var play = function () {
		createjs.Sound.play(id);
	};
	var exports = {
		id: id,
		init: init,
		play: play
	};
	return exports;
}();

var kirby = function () {
	var id = 'kirby';
	var init = function () {
		console.log(init, id);
		createjs.Sound.registerSound('../../assets/kirby.mp3', id);
	};
	var play = function () {
		createjs.Sound.play(id);
	};
	var exports = {
		id: id,
		init: init,
		play: play
	};
	return exports;
}();

var iphone = function () {
	var id = 'iphone';
	var init = function () {
		console.log(init, id);
		createjs.Sound.registerSound('../../assets/iphone_text.mp3', id);
	};
	var play = function () {
		createjs.Sound.play(id);
	};
	var exports = {
		id: id,
		init: init,
		play: play
	};
	return exports;
}();

var clips = {
    midi: document.querySelectorAll('.clip-box[data-type="midi"] .clip-box'),
    phone: document.querySelectorAll('.clip-box[data-type="phone"] .clip-box'),
    keyboard: document.querySelectorAll('.clip-box[data-type="keyboard"] .clip-box')
};

var getChar = e => {
    console.log(String.fromCharCode(e.keyCode).toLowerCase());
    return String.fromCharCode(e.keyCode).toLowerCase();
};

var getClipBox = (e, type) => {
    return type === "keyboard" ? document.querySelector("[data-type='keyboard'][data-name='" + getChar(e) + "']") : document.querySelector("[data-type=" + type + "][data-name='" + e + "']");
};

window.addEventListener("keydown", (e, data) => {
    var clipBox = getClipBox(e, "keyboard");
    if (clipBox) clipBox.classList.add("active");
});

window.addEventListener("keyup", (e, data) => {
    var clipBox = getClipBox(e, "keyboard");
    if (clipBox) clipBox.classList.remove("active");
});
var AudioContext = AudioContext || webkitAudioContext,
    // for ios/safari
context = new AudioContext(),
    data,
    cmd,
    channel,
    type,
    note,
    velocity,
    midiDeviceConnected = false;

// request MIDI access
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({
        sysex: false
    }).then(onMIDISuccess, onMIDIFailure);
} else {
    console.log("No MIDI support in your browser.");
}

// midi functions
function onMIDISuccess(midiAccess) {
    midiDeviceConnected = true;
    midi = midiAccess;
    var inputs = midi.inputs.values();
    // loop through all inputs
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        // listen for midi messages
        input.value.onmidimessage = onMIDIMessage;
        // this just lists our inputs in the console
        listInputs(input);
    }
    // listen for connect/disconnect message
    midi.onstatechange = onStateChange;
}

function onMIDIFailure(midiAccess) {
    console.log("Shit's broke - midi - ", midiAccess);
}
function onMIDIMessage(event) {
    console.log(event);
    data = event.data, cmd = data[0] >> 4, channel = data[0] & 0xf, type = data[0] & 0xf0, // channel agnostic message type. Thanks, Phil Burk.
    note = data[1], velocity = data[2];

    switch (type) {
        case 144:
            // noteOn message
            noteOn(note, velocity);
            break;
        case 128:
            noteOff(note, velocity);
            break;
    }
}

function noteOn(midiNote, velocity) {
    console.log("MIDI Note", midiNote);
    var clipBox = getClipBox(midiNote, "midi");
    if (clipBox) clipBox.classList.add("active");
}

function noteOff(midiNote, velocity) {
    console.log("MIDI Note", midiNote);
    var clipBox = getClipBox(midiNote, "midi");
    if (clipBox) clipBox.classList.remove("active");
}

function listInputs(inputs) {
    var input = inputs.value;
    console.log("Input port : [ type:'" + input.type + "' id: '" + input.id + "' manufacturer: '" + input.manufacturer + "' name: '" + input.name + "' version: '" + input.version + "']");
}

function logger(data) {
    console.log(" [channel: " + (data[0] & 0xf) + ", cmd: " + (data[0] >> 4) + ", type: " + (data[0] & 0xf0) + " , note: " + data[1] + " , velocity: " + data[2] + "]");
}

function onStateChange(event) {
    var port = event.port,
        state = port.state,
        name = port.name,
        type = port.type;
    if (type == "input") console.log("name", name, "port", port, "state", state);
}
/**
 * @author jonobr1 / http://jonobr1.com
 *
 */

(function () {

  var root = this;
  var previousHas = root.has || {};

  // Let's do a bunch of navigator detections shall we?

  var ua = root.navigator.userAgent;

  var has = {

    // Mobile Detection

    Android: !!ua.match(/Android/ig),
    Blackberry: !!ua.match(/BlackBerry/ig),
    iOS: !!ua.match(/iPhone|iPad|iPod/ig),
    OperaMini: !!ua.match(/Opera Mini/ig),
    Windows: !!ua.match(/IEMobile/ig),
    WebOS: !!ua.match(/webOS/ig),

    // Browser Detection

    Arora: !!ua.match(/Arora/ig),
    Chrome: !!ua.match(/Chrome/ig),
    Epiphany: !!ua.match(/Epiphany/ig),
    Firefox: !!ua.match(/Firefox/ig),
    InternetExplorer: !!ua.match(/MSIE/ig),
    Midori: !!ua.match(/Midori/ig),
    Opera: !!ua.match(/Opera/ig),
    Safari: !!ua.match(/Safari/ig),

    webgl: function () {
      try {
        return !!window.WebGLRenderingContext && !!(document.createElement('canvas').getContext('webgl') || document.createElement('canvas').getContext('experimental-webgl'));
      } catch (e) {
        return false;
      }
    }(),

    noConflict: function () {
      return previousHas;
    }

  };

  has.mobile = has.Android || has.Blackberry || has.iOS || has.OperaMini || has.Windows || has.WebOS;

  root.has = has;
})();
/*!
 * jQuery JavaScript Library v1.9.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2012 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-2-4
 */(function(window,undefined){ // Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var  // The deferred used on DOM ready
readyList, // A central reference to the root jQuery(document)
rootjQuery, // Support: IE<9
// For `typeof node.method` instead of `node.method !== undefined`
core_strundefined=typeof undefined, // Use the correct document accordingly with window argument (sandbox)
document=window.document,location=window.location, // Map over jQuery in case of overwrite
_jQuery=window.jQuery, // Map over the $ in case of overwrite
_$=window.$, // [[Class]] -> type pairs
class2type={}, // List of deleted data cache ids, so we can reuse them
core_deletedIds=[],core_version="1.9.1", // Save a reference to some core methods
core_concat=core_deletedIds.concat,core_push=core_deletedIds.push,core_slice=core_deletedIds.slice,core_indexOf=core_deletedIds.indexOf,core_toString=class2type.toString,core_hasOwn=class2type.hasOwnProperty,core_trim=core_version.trim, // Define a local copy of jQuery
jQuery=function(selector,context){ // The jQuery object is actually just the init constructor 'enhanced'
return new jQuery.fn.init(selector,context,rootjQuery);}, // Used for matching numbers
core_pnum=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, // Used for splitting on whitespace
core_rnotwhite=/\S+/g, // Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
rtrim=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, // A simple way to check for HTML strings
// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
// Strict HTML recognition (#11290: must start with <)
rquickExpr=/^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/, // Match a standalone tag
rsingleTag=/^<(\w+)\s*\/?>(?:<\/\1>|)$/, // JSON RegExp
rvalidchars=/^[\],:{}\s]*$/,rvalidbraces=/(?:^|:|,)(?:\s*\[)+/g,rvalidescape=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,rvalidtokens=/"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g, // Matches dashed string for camelizing
rmsPrefix=/^-ms-/,rdashAlpha=/-([\da-z])/gi, // Used by jQuery.camelCase as callback to replace()
fcamelCase=function(all,letter){return letter.toUpperCase();}, // The ready event handler
completed=function(event){ // readyState === "complete" is good enough for us to call the dom ready in oldIE
if(document.addEventListener||event.type==="load"||document.readyState==="complete"){detach();jQuery.ready();}}, // Clean-up method for dom ready events
detach=function(){if(document.addEventListener){document.removeEventListener("DOMContentLoaded",completed,false);window.removeEventListener("load",completed,false);}else {document.detachEvent("onreadystatechange",completed);window.detachEvent("onload",completed);}};jQuery.fn=jQuery.prototype={ // The current version of jQuery being used
jquery:core_version,constructor:jQuery,init:function(selector,context,rootjQuery){var match,elem; // HANDLE: $(""), $(null), $(undefined), $(false)
if(!selector){return this;} // Handle HTML strings
if(typeof selector==="string"){if(selector.charAt(0)==="<"&&selector.charAt(selector.length-1)===">"&&selector.length>=3){ // Assume that strings that start and end with <> are HTML and skip the regex check
match=[null,selector,null];}else {match=rquickExpr.exec(selector);} // Match html or make sure no context is specified for #id
if(match&&(match[1]||!context)){ // HANDLE: $(html) -> $(array)
if(match[1]){context=context instanceof jQuery?context[0]:context; // scripts is true for back-compat
jQuery.merge(this,jQuery.parseHTML(match[1],context&&context.nodeType?context.ownerDocument||context:document,true)); // HANDLE: $(html, props)
if(rsingleTag.test(match[1])&&jQuery.isPlainObject(context)){for(match in context){ // Properties of context are called as methods if possible
if(jQuery.isFunction(this[match])){this[match](context[match]); // ...and otherwise set as attributes
}else {this.attr(match,context[match]);}}}return this; // HANDLE: $(#id)
}else {elem=document.getElementById(match[2]); // Check parentNode to catch when Blackberry 4.6 returns
// nodes that are no longer in the document #6963
if(elem&&elem.parentNode){ // Handle the case where IE and Opera return items
// by name instead of ID
if(elem.id!==match[2]){return rootjQuery.find(selector);} // Otherwise, we inject the element directly into the jQuery object
this.length=1;this[0]=elem;}this.context=document;this.selector=selector;return this;} // HANDLE: $(expr, $(...))
}else if(!context||context.jquery){return (context||rootjQuery).find(selector); // HANDLE: $(expr, context)
// (which is just equivalent to: $(context).find(expr)
}else {return this.constructor(context).find(selector);} // HANDLE: $(DOMElement)
}else if(selector.nodeType){this.context=this[0]=selector;this.length=1;return this; // HANDLE: $(function)
// Shortcut for document ready
}else if(jQuery.isFunction(selector)){return rootjQuery.ready(selector);}if(selector.selector!==undefined){this.selector=selector.selector;this.context=selector.context;}return jQuery.makeArray(selector,this);}, // Start with an empty selector
selector:"", // The default length of a jQuery object is 0
length:0, // The number of elements contained in the matched element set
size:function(){return this.length;},toArray:function(){return core_slice.call(this);}, // Get the Nth element in the matched element set OR
// Get the whole matched element set as a clean array
get:function(num){return num==null? // Return a 'clean' array
this.toArray(): // Return just the object
num<0?this[this.length+num]:this[num];}, // Take an array of elements and push it onto the stack
// (returning the new matched element set)
pushStack:function(elems){ // Build a new jQuery matched element set
var ret=jQuery.merge(this.constructor(),elems); // Add the old object onto the stack (as a reference)
ret.prevObject=this;ret.context=this.context; // Return the newly-formed element set
return ret;}, // Execute a callback for every element in the matched set.
// (You can seed the arguments with an array of args, but this is
// only used internally.)
each:function(callback,args){return jQuery.each(this,callback,args);},ready:function(fn){ // Add the callback
jQuery.ready.promise().done(fn);return this;},slice:function(){return this.pushStack(core_slice.apply(this,arguments));},first:function(){return this.eq(0);},last:function(){return this.eq(-1);},eq:function(i){var len=this.length,j=+i+(i<0?len:0);return this.pushStack(j>=0&&j<len?[this[j]]:[]);},map:function(callback){return this.pushStack(jQuery.map(this,function(elem,i){return callback.call(elem,i,elem);}));},end:function(){return this.prevObject||this.constructor(null);}, // For internal use only.
// Behaves like an Array's method, not like a jQuery method.
push:core_push,sort:[].sort,splice:[].splice}; // Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype=jQuery.fn;jQuery.extend=jQuery.fn.extend=function(){var src,copyIsArray,copy,name,options,clone,target=arguments[0]||{},i=1,length=arguments.length,deep=false; // Handle a deep copy situation
if(typeof target==="boolean"){deep=target;target=arguments[1]||{}; // skip the boolean and the target
i=2;} // Handle case when target is a string or something (possible in deep copy)
if(typeof target!=="object"&&!jQuery.isFunction(target)){target={};} // extend jQuery itself if only one argument is passed
if(length===i){target=this;--i;}for(;i<length;i++){ // Only deal with non-null/undefined values
if((options=arguments[i])!=null){ // Extend the base object
for(name in options){src=target[name];copy=options[name]; // Prevent never-ending loop
if(target===copy){continue;} // Recurse if we're merging plain objects or arrays
if(deep&&copy&&(jQuery.isPlainObject(copy)||(copyIsArray=jQuery.isArray(copy)))){if(copyIsArray){copyIsArray=false;clone=src&&jQuery.isArray(src)?src:[];}else {clone=src&&jQuery.isPlainObject(src)?src:{};} // Never move original objects, clone them
target[name]=jQuery.extend(deep,clone,copy); // Don't bring in undefined values
}else if(copy!==undefined){target[name]=copy;}}}} // Return the modified object
return target;};jQuery.extend({noConflict:function(deep){if(window.$===jQuery){window.$=_$;}if(deep&&window.jQuery===jQuery){window.jQuery=_jQuery;}return jQuery;}, // Is the DOM ready to be used? Set to true once it occurs.
isReady:false, // A counter to track how many items to wait for before
// the ready event fires. See #6781
readyWait:1, // Hold (or release) the ready event
holdReady:function(hold){if(hold){jQuery.readyWait++;}else {jQuery.ready(true);}}, // Handle when the DOM is ready
ready:function(wait){ // Abort if there are pending holds or we're already ready
if(wait===true?--jQuery.readyWait:jQuery.isReady){return;} // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
if(!document.body){return setTimeout(jQuery.ready);} // Remember that the DOM is ready
jQuery.isReady=true; // If a normal DOM Ready event fired, decrement, and wait if need be
if(wait!==true&&--jQuery.readyWait>0){return;} // If there are functions bound, to execute
readyList.resolveWith(document,[jQuery]); // Trigger any bound ready events
if(jQuery.fn.trigger){jQuery(document).trigger("ready").off("ready");}}, // See test/unit/core.js for details concerning isFunction.
// Since version 1.3, DOM methods and functions like alert
// aren't supported. They return false on IE (#2968).
isFunction:function(obj){return jQuery.type(obj)==="function";},isArray:Array.isArray||function(obj){return jQuery.type(obj)==="array";},isWindow:function(obj){return obj!=null&&obj==obj.window;},isNumeric:function(obj){return !isNaN(parseFloat(obj))&&isFinite(obj);},type:function(obj){if(obj==null){return String(obj);}return typeof obj==="object"||typeof obj==="function"?class2type[core_toString.call(obj)]||"object":typeof obj;},isPlainObject:function(obj){ // Must be an Object.
// Because of IE, we also have to check the presence of the constructor property.
// Make sure that DOM nodes and window objects don't pass through, as well
if(!obj||jQuery.type(obj)!=="object"||obj.nodeType||jQuery.isWindow(obj)){return false;}try{ // Not own constructor property must be Object
if(obj.constructor&&!core_hasOwn.call(obj,"constructor")&&!core_hasOwn.call(obj.constructor.prototype,"isPrototypeOf")){return false;}}catch(e){ // IE8,9 Will throw exceptions on certain host objects #9897
return false;} // Own properties are enumerated firstly, so to speed up,
// if last one is own, then all properties are own.
var key;for(key in obj){}return key===undefined||core_hasOwn.call(obj,key);},isEmptyObject:function(obj){var name;for(name in obj){return false;}return true;},error:function(msg){throw new Error(msg);}, // data: string of html
// context (optional): If specified, the fragment will be created in this context, defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
parseHTML:function(data,context,keepScripts){if(!data||typeof data!=="string"){return null;}if(typeof context==="boolean"){keepScripts=context;context=false;}context=context||document;var parsed=rsingleTag.exec(data),scripts=!keepScripts&&[]; // Single tag
if(parsed){return [context.createElement(parsed[1])];}parsed=jQuery.buildFragment([data],context,scripts);if(scripts){jQuery(scripts).remove();}return jQuery.merge([],parsed.childNodes);},parseJSON:function(data){ // Attempt to parse using the native JSON parser first
if(window.JSON&&window.JSON.parse){return window.JSON.parse(data);}if(data===null){return data;}if(typeof data==="string"){ // Make sure leading/trailing whitespace is removed (IE can't handle it)
data=jQuery.trim(data);if(data){ // Make sure the incoming data is actual JSON
// Logic borrowed from http://json.org/json2.js
if(rvalidchars.test(data.replace(rvalidescape,"@").replace(rvalidtokens,"]").replace(rvalidbraces,""))){return new Function("return "+data)();}}}jQuery.error("Invalid JSON: "+data);}, // Cross-browser xml parsing
parseXML:function(data){var xml,tmp;if(!data||typeof data!=="string"){return null;}try{if(window.DOMParser){ // Standard
tmp=new DOMParser();xml=tmp.parseFromString(data,"text/xml");}else { // IE
xml=new ActiveXObject("Microsoft.XMLDOM");xml.async="false";xml.loadXML(data);}}catch(e){xml=undefined;}if(!xml||!xml.documentElement||xml.getElementsByTagName("parsererror").length){jQuery.error("Invalid XML: "+data);}return xml;},noop:function(){}, // Evaluates a script in a global context
// Workarounds based on findings by Jim Driscoll
// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
globalEval:function(data){if(data&&jQuery.trim(data)){ // We use execScript on Internet Explorer
// We use an anonymous function so that context is window
// rather than jQuery in Firefox
(window.execScript||function(data){window["eval"].call(window,data);})(data);}}, // Convert dashed to camelCase; used by the css and data modules
// Microsoft forgot to hump their vendor prefix (#9572)
camelCase:function(string){return string.replace(rmsPrefix,"ms-").replace(rdashAlpha,fcamelCase);},nodeName:function(elem,name){return elem.nodeName&&elem.nodeName.toLowerCase()===name.toLowerCase();}, // args is for internal usage only
each:function(obj,callback,args){var value,i=0,length=obj.length,isArray=isArraylike(obj);if(args){if(isArray){for(;i<length;i++){value=callback.apply(obj[i],args);if(value===false){break;}}}else {for(i in obj){value=callback.apply(obj[i],args);if(value===false){break;}}} // A special, fast, case for the most common use of each
}else {if(isArray){for(;i<length;i++){value=callback.call(obj[i],i,obj[i]);if(value===false){break;}}}else {for(i in obj){value=callback.call(obj[i],i,obj[i]);if(value===false){break;}}}}return obj;}, // Use native String.trim function wherever possible
trim:core_trim&&!core_trim.call("\uFEFF\xA0")?function(text){return text==null?"":core_trim.call(text);}: // Otherwise use our own trimming functionality
function(text){return text==null?"":(text+"").replace(rtrim,"");}, // results is for internal usage only
makeArray:function(arr,results){var ret=results||[];if(arr!=null){if(isArraylike(Object(arr))){jQuery.merge(ret,typeof arr==="string"?[arr]:arr);}else {core_push.call(ret,arr);}}return ret;},inArray:function(elem,arr,i){var len;if(arr){if(core_indexOf){return core_indexOf.call(arr,elem,i);}len=arr.length;i=i?i<0?Math.max(0,len+i):i:0;for(;i<len;i++){ // Skip accessing in sparse arrays
if(i in arr&&arr[i]===elem){return i;}}}return -1;},merge:function(first,second){var l=second.length,i=first.length,j=0;if(typeof l==="number"){for(;j<l;j++){first[i++]=second[j];}}else {while(second[j]!==undefined){first[i++]=second[j++];}}first.length=i;return first;},grep:function(elems,callback,inv){var retVal,ret=[],i=0,length=elems.length;inv=!!inv; // Go through the array, only saving the items
// that pass the validator function
for(;i<length;i++){retVal=!!callback(elems[i],i);if(inv!==retVal){ret.push(elems[i]);}}return ret;}, // arg is for internal usage only
map:function(elems,callback,arg){var value,i=0,length=elems.length,isArray=isArraylike(elems),ret=[]; // Go through the array, translating each of the items to their
if(isArray){for(;i<length;i++){value=callback(elems[i],i,arg);if(value!=null){ret[ret.length]=value;}} // Go through every key on the object,
}else {for(i in elems){value=callback(elems[i],i,arg);if(value!=null){ret[ret.length]=value;}}} // Flatten any nested arrays
return core_concat.apply([],ret);}, // A global GUID counter for objects
guid:1, // Bind a function to a context, optionally partially applying any
// arguments.
proxy:function(fn,context){var args,proxy,tmp;if(typeof context==="string"){tmp=fn[context];context=fn;fn=tmp;} // Quick check to determine if target is callable, in the spec
// this throws a TypeError, but we will just return undefined.
if(!jQuery.isFunction(fn)){return undefined;} // Simulated bind
args=core_slice.call(arguments,2);proxy=function(){return fn.apply(context||this,args.concat(core_slice.call(arguments)));}; // Set the guid of unique handler to the same of original handler, so it can be removed
proxy.guid=fn.guid=fn.guid||jQuery.guid++;return proxy;}, // Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
access:function(elems,fn,key,value,chainable,emptyGet,raw){var i=0,length=elems.length,bulk=key==null; // Sets many values
if(jQuery.type(key)==="object"){chainable=true;for(i in key){jQuery.access(elems,fn,i,key[i],true,emptyGet,raw);} // Sets one value
}else if(value!==undefined){chainable=true;if(!jQuery.isFunction(value)){raw=true;}if(bulk){ // Bulk operations run against the entire set
if(raw){fn.call(elems,value);fn=null; // ...except when executing function values
}else {bulk=fn;fn=function(elem,key,value){return bulk.call(jQuery(elem),value);};}}if(fn){for(;i<length;i++){fn(elems[i],key,raw?value:value.call(elems[i],i,fn(elems[i],key)));}}}return chainable?elems: // Gets
bulk?fn.call(elems):length?fn(elems[0],key):emptyGet;},now:function(){return new Date().getTime();}});jQuery.ready.promise=function(obj){if(!readyList){readyList=jQuery.Deferred(); // Catch cases where $(document).ready() is called after the browser event has already occurred.
// we once tried to use readyState "interactive" here, but it caused issues like the one
// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
if(document.readyState==="complete"){ // Handle it asynchronously to allow scripts the opportunity to delay ready
setTimeout(jQuery.ready); // Standards-based browsers support DOMContentLoaded
}else if(document.addEventListener){ // Use the handy event callback
document.addEventListener("DOMContentLoaded",completed,false); // A fallback to window.onload, that will always work
window.addEventListener("load",completed,false); // If IE event model is used
}else { // Ensure firing before onload, maybe late but safe also for iframes
document.attachEvent("onreadystatechange",completed); // A fallback to window.onload, that will always work
window.attachEvent("onload",completed); // If IE and not a frame
// continually check to see if the document is ready
var top=false;try{top=window.frameElement==null&&document.documentElement;}catch(e){}if(top&&top.doScroll){(function doScrollCheck(){if(!jQuery.isReady){try{ // Use the trick by Diego Perini
// http://javascript.nwbox.com/IEContentLoaded/
top.doScroll("left");}catch(e){return setTimeout(doScrollCheck,50);} // detach all dom ready events
detach(); // and execute any waiting functions
jQuery.ready();}})();}}}return readyList.promise(obj);}; // Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(i,name){class2type["[object "+name+"]"]=name.toLowerCase();});function isArraylike(obj){var length=obj.length,type=jQuery.type(obj);if(jQuery.isWindow(obj)){return false;}if(obj.nodeType===1&&length){return true;}return type==="array"||type!=="function"&&(length===0||typeof length==="number"&&length>0&&length-1 in obj);} // All jQuery objects should point back to these
rootjQuery=jQuery(document); // String to Object options format cache
var optionsCache={}; // Convert String-formatted options into Object-formatted ones and store in cache
function createOptions(options){var object=optionsCache[options]={};jQuery.each(options.match(core_rnotwhite)||[],function(_,flag){object[flag]=true;});return object;} /*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */jQuery.Callbacks=function(options){ // Convert options from String-formatted to Object-formatted if needed
// (we check in cache first)
options=typeof options==="string"?optionsCache[options]||createOptions(options):jQuery.extend({},options);var  // Flag to know if list is currently firing
firing, // Last fire value (for non-forgettable lists)
memory, // Flag to know if list was already fired
fired, // End of the loop when firing
firingLength, // Index of currently firing callback (modified by remove if needed)
firingIndex, // First callback to fire (used internally by add and fireWith)
firingStart, // Actual callback list
list=[], // Stack of fire calls for repeatable lists
stack=!options.once&&[], // Fire callbacks
fire=function(data){memory=options.memory&&data;fired=true;firingIndex=firingStart||0;firingStart=0;firingLength=list.length;firing=true;for(;list&&firingIndex<firingLength;firingIndex++){if(list[firingIndex].apply(data[0],data[1])===false&&options.stopOnFalse){memory=false; // To prevent further calls using add
break;}}firing=false;if(list){if(stack){if(stack.length){fire(stack.shift());}}else if(memory){list=[];}else {self.disable();}}}, // Actual Callbacks object
self={ // Add a callback or a collection of callbacks to the list
add:function(){if(list){ // First, we save the current length
var start=list.length;(function add(args){jQuery.each(args,function(_,arg){var type=jQuery.type(arg);if(type==="function"){if(!options.unique||!self.has(arg)){list.push(arg);}}else if(arg&&arg.length&&type!=="string"){ // Inspect recursively
add(arg);}});})(arguments); // Do we need to add the callbacks to the
// current firing batch?
if(firing){firingLength=list.length; // With memory, if we're not firing then
// we should call right away
}else if(memory){firingStart=start;fire(memory);}}return this;}, // Remove a callback from the list
remove:function(){if(list){jQuery.each(arguments,function(_,arg){var index;while((index=jQuery.inArray(arg,list,index))>-1){list.splice(index,1); // Handle firing indexes
if(firing){if(index<=firingLength){firingLength--;}if(index<=firingIndex){firingIndex--;}}}});}return this;}, // Check if a given callback is in the list.
// If no argument is given, return whether or not list has callbacks attached.
has:function(fn){return fn?jQuery.inArray(fn,list)>-1:!!(list&&list.length);}, // Remove all callbacks from the list
empty:function(){list=[];return this;}, // Have the list do nothing anymore
disable:function(){list=stack=memory=undefined;return this;}, // Is it disabled?
disabled:function(){return !list;}, // Lock the list in its current state
lock:function(){stack=undefined;if(!memory){self.disable();}return this;}, // Is it locked?
locked:function(){return !stack;}, // Call all callbacks with the given context and arguments
fireWith:function(context,args){args=args||[];args=[context,args.slice?args.slice():args];if(list&&(!fired||stack)){if(firing){stack.push(args);}else {fire(args);}}return this;}, // Call all the callbacks with the given arguments
fire:function(){self.fireWith(this,arguments);return this;}, // To know if the callbacks have already been called at least once
fired:function(){return !!fired;}};return self;};jQuery.extend({Deferred:function(func){var tuples=[ // action, add listener, listener list, final state
["resolve","done",jQuery.Callbacks("once memory"),"resolved"],["reject","fail",jQuery.Callbacks("once memory"),"rejected"],["notify","progress",jQuery.Callbacks("memory")]],state="pending",promise={state:function(){return state;},always:function(){deferred.done(arguments).fail(arguments);return this;},then:function() /* fnDone, fnFail, fnProgress */{var fns=arguments;return jQuery.Deferred(function(newDefer){jQuery.each(tuples,function(i,tuple){var action=tuple[0],fn=jQuery.isFunction(fns[i])&&fns[i]; // deferred[ done | fail | progress ] for forwarding actions to newDefer
deferred[tuple[1]](function(){var returned=fn&&fn.apply(this,arguments);if(returned&&jQuery.isFunction(returned.promise)){returned.promise().done(newDefer.resolve).fail(newDefer.reject).progress(newDefer.notify);}else {newDefer[action+"With"](this===promise?newDefer.promise():this,fn?[returned]:arguments);}});});fns=null;}).promise();}, // Get a promise for this deferred
// If obj is provided, the promise aspect is added to the object
promise:function(obj){return obj!=null?jQuery.extend(obj,promise):promise;}},deferred={}; // Keep pipe for back-compat
promise.pipe=promise.then; // Add list-specific methods
jQuery.each(tuples,function(i,tuple){var list=tuple[2],stateString=tuple[3]; // promise[ done | fail | progress ] = list.add
promise[tuple[1]]=list.add; // Handle state
if(stateString){list.add(function(){ // state = [ resolved | rejected ]
state=stateString; // [ reject_list | resolve_list ].disable; progress_list.lock
},tuples[i^1][2].disable,tuples[2][2].lock);} // deferred[ resolve | reject | notify ]
deferred[tuple[0]]=function(){deferred[tuple[0]+"With"](this===deferred?promise:this,arguments);return this;};deferred[tuple[0]+"With"]=list.fireWith;}); // Make the deferred a promise
promise.promise(deferred); // Call given func if any
if(func){func.call(deferred,deferred);} // All done!
return deferred;}, // Deferred helper
when:function(subordinate /* , ..., subordinateN */){var i=0,resolveValues=core_slice.call(arguments),length=resolveValues.length, // the count of uncompleted subordinates
remaining=length!==1||subordinate&&jQuery.isFunction(subordinate.promise)?length:0, // the master Deferred. If resolveValues consist of only a single Deferred, just use that.
deferred=remaining===1?subordinate:jQuery.Deferred(), // Update function for both resolve and progress values
updateFunc=function(i,contexts,values){return function(value){contexts[i]=this;values[i]=arguments.length>1?core_slice.call(arguments):value;if(values===progressValues){deferred.notifyWith(contexts,values);}else if(! --remaining){deferred.resolveWith(contexts,values);}};},progressValues,progressContexts,resolveContexts; // add listeners to Deferred subordinates; treat others as resolved
if(length>1){progressValues=new Array(length);progressContexts=new Array(length);resolveContexts=new Array(length);for(;i<length;i++){if(resolveValues[i]&&jQuery.isFunction(resolveValues[i].promise)){resolveValues[i].promise().done(updateFunc(i,resolveContexts,resolveValues)).fail(deferred.reject).progress(updateFunc(i,progressContexts,progressValues));}else {--remaining;}}} // if we're not waiting on anything, resolve the master
if(!remaining){deferred.resolveWith(resolveContexts,resolveValues);}return deferred.promise();}});jQuery.support=function(){var support,all,a,input,select,fragment,opt,eventName,isSupported,i,div=document.createElement("div"); // Setup
div.setAttribute("className","t");div.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>"; // Support tests won't run in some limited or non-browser environments
all=div.getElementsByTagName("*");a=div.getElementsByTagName("a")[0];if(!all||!a||!all.length){return {};} // First batch of tests
select=document.createElement("select");opt=select.appendChild(document.createElement("option"));input=div.getElementsByTagName("input")[0];a.style.cssText="top:1px;float:left;opacity:.5";support={ // Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
getSetAttribute:div.className!=="t", // IE strips leading whitespace when .innerHTML is used
leadingWhitespace:div.firstChild.nodeType===3, // Make sure that tbody elements aren't automatically inserted
// IE will insert them into empty tables
tbody:!div.getElementsByTagName("tbody").length, // Make sure that link elements get serialized correctly by innerHTML
// This requires a wrapper element in IE
htmlSerialize:!!div.getElementsByTagName("link").length, // Get the style information from getAttribute
// (IE uses .cssText instead)
style:/top/.test(a.getAttribute("style")), // Make sure that URLs aren't manipulated
// (IE normalizes it by default)
hrefNormalized:a.getAttribute("href")==="/a", // Make sure that element opacity exists
// (IE uses filter instead)
// Use a regex to work around a WebKit issue. See #5145
opacity:/^0.5/.test(a.style.opacity), // Verify style float existence
// (IE uses styleFloat instead of cssFloat)
cssFloat:!!a.style.cssFloat, // Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
checkOn:!!input.value, // Make sure that a selected-by-default option has a working selected property.
// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
optSelected:opt.selected, // Tests for enctype support on a form (#6743)
enctype:!!document.createElement("form").enctype, // Makes sure cloning an html5 element does not cause problems
// Where outerHTML is undefined, this still works
html5Clone:document.createElement("nav").cloneNode(true).outerHTML!=="<:nav></:nav>", // jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
boxModel:document.compatMode==="CSS1Compat", // Will be defined later
deleteExpando:true,noCloneEvent:true,inlineBlockNeedsLayout:false,shrinkWrapBlocks:false,reliableMarginRight:true,boxSizingReliable:true,pixelPosition:false}; // Make sure checked status is properly cloned
input.checked=true;support.noCloneChecked=input.cloneNode(true).checked; // Make sure that the options inside disabled selects aren't marked as disabled
// (WebKit marks them as disabled)
select.disabled=true;support.optDisabled=!opt.disabled; // Support: IE<9
try{delete div.test;}catch(e){support.deleteExpando=false;} // Check if we can trust getAttribute("value")
input=document.createElement("input");input.setAttribute("value","");support.input=input.getAttribute("value")===""; // Check if an input maintains its value after becoming a radio
input.value="t";input.setAttribute("type","radio");support.radioValue=input.value==="t"; // #11217 - WebKit loses check when the name is after the checked attribute
input.setAttribute("checked","t");input.setAttribute("name","t");fragment=document.createDocumentFragment();fragment.appendChild(input); // Check if a disconnected checkbox will retain its checked
// value of true after appended to the DOM (IE6/7)
support.appendChecked=input.checked; // WebKit doesn't clone checked state correctly in fragments
support.checkClone=fragment.cloneNode(true).cloneNode(true).lastChild.checked; // Support: IE<9
// Opera does not clone events (and typeof div.attachEvent === undefined).
// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
if(div.attachEvent){div.attachEvent("onclick",function(){support.noCloneEvent=false;});div.cloneNode(true).click();} // Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP), test/csp.php
for(i in {submit:true,change:true,focusin:true}){div.setAttribute(eventName="on"+i,"t");support[i+"Bubbles"]=eventName in window||div.attributes[eventName].expando===false;}div.style.backgroundClip="content-box";div.cloneNode(true).style.backgroundClip="";support.clearCloneStyle=div.style.backgroundClip==="content-box"; // Run tests that need a body at doc ready
jQuery(function(){var container,marginDiv,tds,divReset="padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",body=document.getElementsByTagName("body")[0];if(!body){ // Return for frameset docs that don't have a body
return;}container=document.createElement("div");container.style.cssText="border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";body.appendChild(container).appendChild(div); // Support: IE8
// Check if table cells still have offsetWidth/Height when they are set
// to display:none and there are still other visible table cells in a
// table row; if so, offsetWidth/Height are not reliable for use when
// determining if an element has been hidden directly using
// display:none (it is still safe to use offsets if a parent element is
// hidden; don safety goggles and see bug #4512 for more information).
div.innerHTML="<table><tr><td></td><td>t</td></tr></table>";tds=div.getElementsByTagName("td");tds[0].style.cssText="padding:0;margin:0;border:0;display:none";isSupported=tds[0].offsetHeight===0;tds[0].style.display="";tds[1].style.display="none"; // Support: IE8
// Check if empty table cells still have offsetWidth/Height
support.reliableHiddenOffsets=isSupported&&tds[0].offsetHeight===0; // Check box-sizing and margin behavior
div.innerHTML="";div.style.cssText="box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";support.boxSizing=div.offsetWidth===4;support.doesNotIncludeMarginInBodyOffset=body.offsetTop!==1; // Use window.getComputedStyle because jsdom on node.js will break without it.
if(window.getComputedStyle){support.pixelPosition=(window.getComputedStyle(div,null)||{}).top!=="1%";support.boxSizingReliable=(window.getComputedStyle(div,null)||{width:"4px"}).width==="4px"; // Check if div with explicit width and no margin-right incorrectly
// gets computed margin-right based on width of container. (#3333)
// Fails in WebKit before Feb 2011 nightlies
// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
marginDiv=div.appendChild(document.createElement("div"));marginDiv.style.cssText=div.style.cssText=divReset;marginDiv.style.marginRight=marginDiv.style.width="0";div.style.width="1px";support.reliableMarginRight=!parseFloat((window.getComputedStyle(marginDiv,null)||{}).marginRight);}if(typeof div.style.zoom!==core_strundefined){ // Support: IE<8
// Check if natively block-level elements act like inline-block
// elements when setting their display to 'inline' and giving
// them layout
div.innerHTML="";div.style.cssText=divReset+"width:1px;padding:1px;display:inline;zoom:1";support.inlineBlockNeedsLayout=div.offsetWidth===3; // Support: IE6
// Check if elements with layout shrink-wrap their children
div.style.display="block";div.innerHTML="<div></div>";div.firstChild.style.width="5px";support.shrinkWrapBlocks=div.offsetWidth!==3;if(support.inlineBlockNeedsLayout){ // Prevent IE 6 from affecting layout for positioned elements #11048
// Prevent IE from shrinking the body in IE 7 mode #12869
// Support: IE<8
body.style.zoom=1;}}body.removeChild(container); // Null elements to avoid leaks in IE
container=div=tds=marginDiv=null;}); // Null elements to avoid leaks in IE
all=select=fragment=opt=a=input=null;return support;}();var rbrace=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,rmultiDash=/([A-Z])/g;function internalData(elem,name,data,pvt /* Internal Use Only */){if(!jQuery.acceptData(elem)){return;}var thisCache,ret,internalKey=jQuery.expando,getByName=typeof name==="string", // We have to handle DOM nodes and JS objects differently because IE6-7
// can't GC object references properly across the DOM-JS boundary
isNode=elem.nodeType, // Only DOM nodes need the global jQuery cache; JS object data is
// attached directly to the object so GC can occur automatically
cache=isNode?jQuery.cache:elem, // Only defining an ID for JS objects if its cache already exists allows
// the code to shortcut on the same path as a DOM node with no cache
id=isNode?elem[internalKey]:elem[internalKey]&&internalKey; // Avoid doing any more work than we need to when trying to get data on an
// object that has no data at all
if((!id||!cache[id]||!pvt&&!cache[id].data)&&getByName&&data===undefined){return;}if(!id){ // Only DOM nodes need a new unique ID for each element since their data
// ends up in the global cache
if(isNode){elem[internalKey]=id=core_deletedIds.pop()||jQuery.guid++;}else {id=internalKey;}}if(!cache[id]){cache[id]={}; // Avoids exposing jQuery metadata on plain JS objects when the object
// is serialized using JSON.stringify
if(!isNode){cache[id].toJSON=jQuery.noop;}} // An object can be passed to jQuery.data instead of a key/value pair; this gets
// shallow copied over onto the existing cache
if(typeof name==="object"||typeof name==="function"){if(pvt){cache[id]=jQuery.extend(cache[id],name);}else {cache[id].data=jQuery.extend(cache[id].data,name);}}thisCache=cache[id]; // jQuery data() is stored in a separate object inside the object's internal data
// cache in order to avoid key collisions between internal data and user-defined
// data.
if(!pvt){if(!thisCache.data){thisCache.data={};}thisCache=thisCache.data;}if(data!==undefined){thisCache[jQuery.camelCase(name)]=data;} // Check for both converted-to-camel and non-converted data property names
// If a data property was specified
if(getByName){ // First Try to find as-is property data
ret=thisCache[name]; // Test for null|undefined property data
if(ret==null){ // Try to find the camelCased property
ret=thisCache[jQuery.camelCase(name)];}}else {ret=thisCache;}return ret;}function internalRemoveData(elem,name,pvt){if(!jQuery.acceptData(elem)){return;}var i,l,thisCache,isNode=elem.nodeType, // See jQuery.data for more information
cache=isNode?jQuery.cache:elem,id=isNode?elem[jQuery.expando]:jQuery.expando; // If there is already no cache entry for this object, there is no
// purpose in continuing
if(!cache[id]){return;}if(name){thisCache=pvt?cache[id]:cache[id].data;if(thisCache){ // Support array or space separated string names for data keys
if(!jQuery.isArray(name)){ // try the string as a key before any manipulation
if(name in thisCache){name=[name];}else { // split the camel cased version by spaces unless a key with the spaces exists
name=jQuery.camelCase(name);if(name in thisCache){name=[name];}else {name=name.split(" ");}}}else { // If "name" is an array of keys...
// When data is initially created, via ("key", "val") signature,
// keys will be converted to camelCase.
// Since there is no way to tell _how_ a key was added, remove
// both plain key and camelCase key. #12786
// This will only penalize the array argument path.
name=name.concat(jQuery.map(name,jQuery.camelCase));}for(i=0,l=name.length;i<l;i++){delete thisCache[name[i]];} // If there is no data left in the cache, we want to continue
// and let the cache object itself get destroyed
if(!(pvt?isEmptyDataObject:jQuery.isEmptyObject)(thisCache)){return;}}} // See jQuery.data for more information
if(!pvt){delete cache[id].data; // Don't destroy the parent cache unless the internal data object
// had been the only thing left in it
if(!isEmptyDataObject(cache[id])){return;}} // Destroy the cache
if(isNode){jQuery.cleanData([elem],true); // Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
}else if(jQuery.support.deleteExpando||cache!=cache.window){delete cache[id]; // When all else fails, null
}else {cache[id]=null;}}jQuery.extend({cache:{}, // Unique for each copy of jQuery on the page
// Non-digits removed to match rinlinejQuery
expando:"jQuery"+(core_version+Math.random()).replace(/\D/g,""), // The following elements throw uncatchable exceptions if you
// attempt to add expando properties to them.
noData:{"embed":true, // Ban all objects except for Flash (which handle expandos)
"object":"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000","applet":true},hasData:function(elem){elem=elem.nodeType?jQuery.cache[elem[jQuery.expando]]:elem[jQuery.expando];return !!elem&&!isEmptyDataObject(elem);},data:function(elem,name,data){return internalData(elem,name,data);},removeData:function(elem,name){return internalRemoveData(elem,name);}, // For internal use only.
_data:function(elem,name,data){return internalData(elem,name,data,true);},_removeData:function(elem,name){return internalRemoveData(elem,name,true);}, // A method for determining if a DOM node can handle the data expando
acceptData:function(elem){ // Do not set data on non-element because it will not be cleared (#8335).
if(elem.nodeType&&elem.nodeType!==1&&elem.nodeType!==9){return false;}var noData=elem.nodeName&&jQuery.noData[elem.nodeName.toLowerCase()]; // nodes accept data unless otherwise specified; rejection can be conditional
return !noData||noData!==true&&elem.getAttribute("classid")===noData;}});jQuery.fn.extend({data:function(key,value){var attrs,name,elem=this[0],i=0,data=null; // Gets all values
if(key===undefined){if(this.length){data=jQuery.data(elem);if(elem.nodeType===1&&!jQuery._data(elem,"parsedAttrs")){attrs=elem.attributes;for(;i<attrs.length;i++){name=attrs[i].name;if(!name.indexOf("data-")){name=jQuery.camelCase(name.slice(5));dataAttr(elem,name,data[name]);}}jQuery._data(elem,"parsedAttrs",true);}}return data;} // Sets multiple values
if(typeof key==="object"){return this.each(function(){jQuery.data(this,key);});}return jQuery.access(this,function(value){if(value===undefined){ // Try to fetch any internally stored data first
return elem?dataAttr(elem,key,jQuery.data(elem,key)):null;}this.each(function(){jQuery.data(this,key,value);});},null,value,arguments.length>1,null,true);},removeData:function(key){return this.each(function(){jQuery.removeData(this,key);});}});function dataAttr(elem,key,data){ // If nothing was found internally, try to fetch any
// data from the HTML5 data-* attribute
if(data===undefined&&elem.nodeType===1){var name="data-"+key.replace(rmultiDash,"-$1").toLowerCase();data=elem.getAttribute(name);if(typeof data==="string"){try{data=data==="true"?true:data==="false"?false:data==="null"?null: // Only convert to a number if it doesn't change the string
+data+""===data?+data:rbrace.test(data)?jQuery.parseJSON(data):data;}catch(e){} // Make sure we set the data so it isn't changed later
jQuery.data(elem,key,data);}else {data=undefined;}}return data;} // checks a cache object for emptiness
function isEmptyDataObject(obj){var name;for(name in obj){ // if the public data object is empty, the private is still empty
if(name==="data"&&jQuery.isEmptyObject(obj[name])){continue;}if(name!=="toJSON"){return false;}}return true;}jQuery.extend({queue:function(elem,type,data){var queue;if(elem){type=(type||"fx")+"queue";queue=jQuery._data(elem,type); // Speed up dequeue by getting out quickly if this is just a lookup
if(data){if(!queue||jQuery.isArray(data)){queue=jQuery._data(elem,type,jQuery.makeArray(data));}else {queue.push(data);}}return queue||[];}},dequeue:function(elem,type){type=type||"fx";var queue=jQuery.queue(elem,type),startLength=queue.length,fn=queue.shift(),hooks=jQuery._queueHooks(elem,type),next=function(){jQuery.dequeue(elem,type);}; // If the fx queue is dequeued, always remove the progress sentinel
if(fn==="inprogress"){fn=queue.shift();startLength--;}hooks.cur=fn;if(fn){ // Add a progress sentinel to prevent the fx queue from being
// automatically dequeued
if(type==="fx"){queue.unshift("inprogress");} // clear up the last queue stop function
delete hooks.stop;fn.call(elem,next,hooks);}if(!startLength&&hooks){hooks.empty.fire();}}, // not intended for public consumption - generates a queueHooks object, or returns the current one
_queueHooks:function(elem,type){var key=type+"queueHooks";return jQuery._data(elem,key)||jQuery._data(elem,key,{empty:jQuery.Callbacks("once memory").add(function(){jQuery._removeData(elem,type+"queue");jQuery._removeData(elem,key);})});}});jQuery.fn.extend({queue:function(type,data){var setter=2;if(typeof type!=="string"){data=type;type="fx";setter--;}if(arguments.length<setter){return jQuery.queue(this[0],type);}return data===undefined?this:this.each(function(){var queue=jQuery.queue(this,type,data); // ensure a hooks for this queue
jQuery._queueHooks(this,type);if(type==="fx"&&queue[0]!=="inprogress"){jQuery.dequeue(this,type);}});},dequeue:function(type){return this.each(function(){jQuery.dequeue(this,type);});}, // Based off of the plugin by Clint Helfers, with permission.
// http://blindsignals.com/index.php/2009/07/jquery-delay/
delay:function(time,type){time=jQuery.fx?jQuery.fx.speeds[time]||time:time;type=type||"fx";return this.queue(type,function(next,hooks){var timeout=setTimeout(next,time);hooks.stop=function(){clearTimeout(timeout);};});},clearQueue:function(type){return this.queue(type||"fx",[]);}, // Get a promise resolved when queues of a certain type
// are emptied (fx is the type by default)
promise:function(type,obj){var tmp,count=1,defer=jQuery.Deferred(),elements=this,i=this.length,resolve=function(){if(! --count){defer.resolveWith(elements,[elements]);}};if(typeof type!=="string"){obj=type;type=undefined;}type=type||"fx";while(i--){tmp=jQuery._data(elements[i],type+"queueHooks");if(tmp&&tmp.empty){count++;tmp.empty.add(resolve);}}resolve();return defer.promise(obj);}});var nodeHook,boolHook,rclass=/[\t\r\n]/g,rreturn=/\r/g,rfocusable=/^(?:input|select|textarea|button|object)$/i,rclickable=/^(?:a|area)$/i,rboolean=/^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i,ruseDefault=/^(?:checked|selected)$/i,getSetAttribute=jQuery.support.getSetAttribute,getSetInput=jQuery.support.input;jQuery.fn.extend({attr:function(name,value){return jQuery.access(this,jQuery.attr,name,value,arguments.length>1);},removeAttr:function(name){return this.each(function(){jQuery.removeAttr(this,name);});},prop:function(name,value){return jQuery.access(this,jQuery.prop,name,value,arguments.length>1);},removeProp:function(name){name=jQuery.propFix[name]||name;return this.each(function(){ // try/catch handles cases where IE balks (such as removing a property on window)
try{this[name]=undefined;delete this[name];}catch(e){}});},addClass:function(value){var classes,elem,cur,clazz,j,i=0,len=this.length,proceed=typeof value==="string"&&value;if(jQuery.isFunction(value)){return this.each(function(j){jQuery(this).addClass(value.call(this,j,this.className));});}if(proceed){ // The disjunction here is for better compressibility (see removeClass)
classes=(value||"").match(core_rnotwhite)||[];for(;i<len;i++){elem=this[i];cur=elem.nodeType===1&&(elem.className?(" "+elem.className+" ").replace(rclass," "):" ");if(cur){j=0;while(clazz=classes[j++]){if(cur.indexOf(" "+clazz+" ")<0){cur+=clazz+" ";}}elem.className=jQuery.trim(cur);}}}return this;},removeClass:function(value){var classes,elem,cur,clazz,j,i=0,len=this.length,proceed=arguments.length===0||typeof value==="string"&&value;if(jQuery.isFunction(value)){return this.each(function(j){jQuery(this).removeClass(value.call(this,j,this.className));});}if(proceed){classes=(value||"").match(core_rnotwhite)||[];for(;i<len;i++){elem=this[i]; // This expression is here for better compressibility (see addClass)
cur=elem.nodeType===1&&(elem.className?(" "+elem.className+" ").replace(rclass," "):"");if(cur){j=0;while(clazz=classes[j++]){ // Remove *all* instances
while(cur.indexOf(" "+clazz+" ")>=0){cur=cur.replace(" "+clazz+" "," ");}}elem.className=value?jQuery.trim(cur):"";}}}return this;},toggleClass:function(value,stateVal){var type=typeof value,isBool=typeof stateVal==="boolean";if(jQuery.isFunction(value)){return this.each(function(i){jQuery(this).toggleClass(value.call(this,i,this.className,stateVal),stateVal);});}return this.each(function(){if(type==="string"){ // toggle individual class names
var className,i=0,self=jQuery(this),state=stateVal,classNames=value.match(core_rnotwhite)||[];while(className=classNames[i++]){ // check each className given, space separated list
state=isBool?state:!self.hasClass(className);self[state?"addClass":"removeClass"](className);} // Toggle whole class name
}else if(type===core_strundefined||type==="boolean"){if(this.className){ // store className if set
jQuery._data(this,"__className__",this.className);} // If the element has a class name or if we're passed "false",
// then remove the whole classname (if there was one, the above saved it).
// Otherwise bring back whatever was previously saved (if anything),
// falling back to the empty string if nothing was stored.
this.className=this.className||value===false?"":jQuery._data(this,"__className__")||"";}});},hasClass:function(selector){var className=" "+selector+" ",i=0,l=this.length;for(;i<l;i++){if(this[i].nodeType===1&&(" "+this[i].className+" ").replace(rclass," ").indexOf(className)>=0){return true;}}return false;},val:function(value){var ret,hooks,isFunction,elem=this[0];if(!arguments.length){if(elem){hooks=jQuery.valHooks[elem.type]||jQuery.valHooks[elem.nodeName.toLowerCase()];if(hooks&&"get" in hooks&&(ret=hooks.get(elem,"value"))!==undefined){return ret;}ret=elem.value;return typeof ret==="string"? // handle most common string cases
ret.replace(rreturn,""): // handle cases where value is null/undef or number
ret==null?"":ret;}return;}isFunction=jQuery.isFunction(value);return this.each(function(i){var val,self=jQuery(this);if(this.nodeType!==1){return;}if(isFunction){val=value.call(this,i,self.val());}else {val=value;} // Treat null/undefined as ""; convert numbers to string
if(val==null){val="";}else if(typeof val==="number"){val+="";}else if(jQuery.isArray(val)){val=jQuery.map(val,function(value){return value==null?"":value+"";});}hooks=jQuery.valHooks[this.type]||jQuery.valHooks[this.nodeName.toLowerCase()]; // If set returns undefined, fall back to normal setting
if(!hooks||!("set" in hooks)||hooks.set(this,val,"value")===undefined){this.value=val;}});}});jQuery.extend({valHooks:{option:{get:function(elem){ // attributes.value is undefined in Blackberry 4.7 but
// uses .value. See #6932
var val=elem.attributes.value;return !val||val.specified?elem.value:elem.text;}},select:{get:function(elem){var value,option,options=elem.options,index=elem.selectedIndex,one=elem.type==="select-one"||index<0,values=one?null:[],max=one?index+1:options.length,i=index<0?max:one?index:0; // Loop through all the selected options
for(;i<max;i++){option=options[i]; // oldIE doesn't update selected after form reset (#2551)
if((option.selected||i===index)&&( // Don't return options that are disabled or in a disabled optgroup
jQuery.support.optDisabled?!option.disabled:option.getAttribute("disabled")===null)&&(!option.parentNode.disabled||!jQuery.nodeName(option.parentNode,"optgroup"))){ // Get the specific value for the option
value=jQuery(option).val(); // We don't need an array for one selects
if(one){return value;} // Multi-Selects return an array
values.push(value);}}return values;},set:function(elem,value){var values=jQuery.makeArray(value);jQuery(elem).find("option").each(function(){this.selected=jQuery.inArray(jQuery(this).val(),values)>=0;});if(!values.length){elem.selectedIndex=-1;}return values;}}},attr:function(elem,name,value){var hooks,notxml,ret,nType=elem.nodeType; // don't get/set attributes on text, comment and attribute nodes
if(!elem||nType===3||nType===8||nType===2){return;} // Fallback to prop when attributes are not supported
if(typeof elem.getAttribute===core_strundefined){return jQuery.prop(elem,name,value);}notxml=nType!==1||!jQuery.isXMLDoc(elem); // All attributes are lowercase
// Grab necessary hook if one is defined
if(notxml){name=name.toLowerCase();hooks=jQuery.attrHooks[name]||(rboolean.test(name)?boolHook:nodeHook);}if(value!==undefined){if(value===null){jQuery.removeAttr(elem,name);}else if(hooks&&notxml&&"set" in hooks&&(ret=hooks.set(elem,value,name))!==undefined){return ret;}else {elem.setAttribute(name,value+"");return value;}}else if(hooks&&notxml&&"get" in hooks&&(ret=hooks.get(elem,name))!==null){return ret;}else { // In IE9+, Flash objects don't have .getAttribute (#12945)
// Support: IE9+
if(typeof elem.getAttribute!==core_strundefined){ret=elem.getAttribute(name);} // Non-existent attributes return null, we normalize to undefined
return ret==null?undefined:ret;}},removeAttr:function(elem,value){var name,propName,i=0,attrNames=value&&value.match(core_rnotwhite);if(attrNames&&elem.nodeType===1){while(name=attrNames[i++]){propName=jQuery.propFix[name]||name; // Boolean attributes get special treatment (#10870)
if(rboolean.test(name)){ // Set corresponding property to false for boolean attributes
// Also clear defaultChecked/defaultSelected (if appropriate) for IE<8
if(!getSetAttribute&&ruseDefault.test(name)){elem[jQuery.camelCase("default-"+name)]=elem[propName]=false;}else {elem[propName]=false;} // See #9699 for explanation of this approach (setting first, then removal)
}else {jQuery.attr(elem,name,"");}elem.removeAttribute(getSetAttribute?name:propName);}}},attrHooks:{type:{set:function(elem,value){if(!jQuery.support.radioValue&&value==="radio"&&jQuery.nodeName(elem,"input")){ // Setting the type on a radio button after the value resets the value in IE6-9
// Reset value to default in case type is set after value during creation
var val=elem.value;elem.setAttribute("type",value);if(val){elem.value=val;}return value;}}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(elem,name,value){var ret,hooks,notxml,nType=elem.nodeType; // don't get/set properties on text, comment and attribute nodes
if(!elem||nType===3||nType===8||nType===2){return;}notxml=nType!==1||!jQuery.isXMLDoc(elem);if(notxml){ // Fix name and attach hooks
name=jQuery.propFix[name]||name;hooks=jQuery.propHooks[name];}if(value!==undefined){if(hooks&&"set" in hooks&&(ret=hooks.set(elem,value,name))!==undefined){return ret;}else {return elem[name]=value;}}else {if(hooks&&"get" in hooks&&(ret=hooks.get(elem,name))!==null){return ret;}else {return elem[name];}}},propHooks:{tabIndex:{get:function(elem){ // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
var attributeNode=elem.getAttributeNode("tabindex");return attributeNode&&attributeNode.specified?parseInt(attributeNode.value,10):rfocusable.test(elem.nodeName)||rclickable.test(elem.nodeName)&&elem.href?0:undefined;}}}}); // Hook for boolean attributes
boolHook={get:function(elem,name){var  // Use .prop to determine if this attribute is understood as boolean
prop=jQuery.prop(elem,name), // Fetch it accordingly
attr=typeof prop==="boolean"&&elem.getAttribute(name),detail=typeof prop==="boolean"?getSetInput&&getSetAttribute?attr!=null: // oldIE fabricates an empty string for missing boolean attributes
// and conflates checked/selected into attroperties
ruseDefault.test(name)?elem[jQuery.camelCase("default-"+name)]:!!attr: // fetch an attribute node for properties not recognized as boolean
elem.getAttributeNode(name);return detail&&detail.value!==false?name.toLowerCase():undefined;},set:function(elem,value,name){if(value===false){ // Remove boolean attributes when set to false
jQuery.removeAttr(elem,name);}else if(getSetInput&&getSetAttribute||!ruseDefault.test(name)){ // IE<8 needs the *property* name
elem.setAttribute(!getSetAttribute&&jQuery.propFix[name]||name,name); // Use defaultChecked and defaultSelected for oldIE
}else {elem[jQuery.camelCase("default-"+name)]=elem[name]=true;}return name;}}; // fix oldIE value attroperty
if(!getSetInput||!getSetAttribute){jQuery.attrHooks.value={get:function(elem,name){var ret=elem.getAttributeNode(name);return jQuery.nodeName(elem,"input")? // Ignore the value *property* by using defaultValue
elem.defaultValue:ret&&ret.specified?ret.value:undefined;},set:function(elem,value,name){if(jQuery.nodeName(elem,"input")){ // Does not return so that setAttribute is also used
elem.defaultValue=value;}else { // Use nodeHook if defined (#1954); otherwise setAttribute is fine
return nodeHook&&nodeHook.set(elem,value,name);}}};} // IE6/7 do not support getting/setting some attributes with get/setAttribute
if(!getSetAttribute){ // Use this for any attribute in IE6/7
// This fixes almost every IE6/7 issue
nodeHook=jQuery.valHooks.button={get:function(elem,name){var ret=elem.getAttributeNode(name);return ret&&(name==="id"||name==="name"||name==="coords"?ret.value!=="":ret.specified)?ret.value:undefined;},set:function(elem,value,name){ // Set the existing or create a new attribute node
var ret=elem.getAttributeNode(name);if(!ret){elem.setAttributeNode(ret=elem.ownerDocument.createAttribute(name));}ret.value=value+=""; // Break association with cloned elements by also using setAttribute (#9646)
return name==="value"||value===elem.getAttribute(name)?value:undefined;}}; // Set contenteditable to false on removals(#10429)
// Setting to empty string throws an error as an invalid value
jQuery.attrHooks.contenteditable={get:nodeHook.get,set:function(elem,value,name){nodeHook.set(elem,value===""?false:value,name);}}; // Set width and height to auto instead of 0 on empty string( Bug #8150 )
// This is for removals
jQuery.each(["width","height"],function(i,name){jQuery.attrHooks[name]=jQuery.extend(jQuery.attrHooks[name],{set:function(elem,value){if(value===""){elem.setAttribute(name,"auto");return value;}}});});} // Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if(!jQuery.support.hrefNormalized){jQuery.each(["href","src","width","height"],function(i,name){jQuery.attrHooks[name]=jQuery.extend(jQuery.attrHooks[name],{get:function(elem){var ret=elem.getAttribute(name,2);return ret==null?undefined:ret;}});}); // href/src property should get the full normalized URL (#10299/#12915)
jQuery.each(["href","src"],function(i,name){jQuery.propHooks[name]={get:function(elem){return elem.getAttribute(name,4);}};});}if(!jQuery.support.style){jQuery.attrHooks.style={get:function(elem){ // Return undefined in the case of empty string
// Note: IE uppercases css property names, but if we were to .toLowerCase()
// .cssText, that would destroy case senstitivity in URL's, like in "background"
return elem.style.cssText||undefined;},set:function(elem,value){return elem.style.cssText=value+"";}};} // Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if(!jQuery.support.optSelected){jQuery.propHooks.selected=jQuery.extend(jQuery.propHooks.selected,{get:function(elem){var parent=elem.parentNode;if(parent){parent.selectedIndex; // Make sure that it also works with optgroups, see #5701
if(parent.parentNode){parent.parentNode.selectedIndex;}}return null;}});} // IE6/7 call enctype encoding
if(!jQuery.support.enctype){jQuery.propFix.enctype="encoding";} // Radios and checkboxes getter/setter
if(!jQuery.support.checkOn){jQuery.each(["radio","checkbox"],function(){jQuery.valHooks[this]={get:function(elem){ // Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
return elem.getAttribute("value")===null?"on":elem.value;}};});}jQuery.each(["radio","checkbox"],function(){jQuery.valHooks[this]=jQuery.extend(jQuery.valHooks[this],{set:function(elem,value){if(jQuery.isArray(value)){return elem.checked=jQuery.inArray(jQuery(elem).val(),value)>=0;}}});});var rformElems=/^(?:input|select|textarea)$/i,rkeyEvent=/^key/,rmouseEvent=/^(?:mouse|contextmenu)|click/,rfocusMorph=/^(?:focusinfocus|focusoutblur)$/,rtypenamespace=/^([^.]*)(?:\.(.+)|)$/;function returnTrue(){return true;}function returnFalse(){return false;} /*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */jQuery.event={global:{},add:function(elem,types,handler,data,selector){var tmp,events,t,handleObjIn,special,eventHandle,handleObj,handlers,type,namespaces,origType,elemData=jQuery._data(elem); // Don't attach events to noData or text/comment nodes (but allow plain objects)
if(!elemData){return;} // Caller can pass in an object of custom data in lieu of the handler
if(handler.handler){handleObjIn=handler;handler=handleObjIn.handler;selector=handleObjIn.selector;} // Make sure that the handler has a unique ID, used to find/remove it later
if(!handler.guid){handler.guid=jQuery.guid++;} // Init the element's event structure and main handler, if this is the first
if(!(events=elemData.events)){events=elemData.events={};}if(!(eventHandle=elemData.handle)){eventHandle=elemData.handle=function(e){ // Discard the second event of a jQuery.event.trigger() and
// when an event is called after a page has unloaded
return typeof jQuery!==core_strundefined&&(!e||jQuery.event.triggered!==e.type)?jQuery.event.dispatch.apply(eventHandle.elem,arguments):undefined;}; // Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
eventHandle.elem=elem;} // Handle multiple events separated by a space
// jQuery(...).bind("mouseover mouseout", fn);
types=(types||"").match(core_rnotwhite)||[""];t=types.length;while(t--){tmp=rtypenamespace.exec(types[t])||[];type=origType=tmp[1];namespaces=(tmp[2]||"").split(".").sort(); // If event changes its type, use the special event handlers for the changed type
special=jQuery.event.special[type]||{}; // If selector defined, determine special event api type, otherwise given type
type=(selector?special.delegateType:special.bindType)||type; // Update special based on newly reset type
special=jQuery.event.special[type]||{}; // handleObj is passed to all event handlers
handleObj=jQuery.extend({type:type,origType:origType,data:data,handler:handler,guid:handler.guid,selector:selector,needsContext:selector&&jQuery.expr.match.needsContext.test(selector),namespace:namespaces.join(".")},handleObjIn); // Init the event handler queue if we're the first
if(!(handlers=events[type])){handlers=events[type]=[];handlers.delegateCount=0; // Only use addEventListener/attachEvent if the special events handler returns false
if(!special.setup||special.setup.call(elem,data,namespaces,eventHandle)===false){ // Bind the global event handler to the element
if(elem.addEventListener){elem.addEventListener(type,eventHandle,false);}else if(elem.attachEvent){elem.attachEvent("on"+type,eventHandle);}}}if(special.add){special.add.call(elem,handleObj);if(!handleObj.handler.guid){handleObj.handler.guid=handler.guid;}} // Add to the element's handler list, delegates in front
if(selector){handlers.splice(handlers.delegateCount++,0,handleObj);}else {handlers.push(handleObj);} // Keep track of which events have ever been used, for event optimization
jQuery.event.global[type]=true;} // Nullify elem to prevent memory leaks in IE
elem=null;}, // Detach an event or set of events from an element
remove:function(elem,types,handler,selector,mappedTypes){var j,handleObj,tmp,origCount,t,events,special,handlers,type,namespaces,origType,elemData=jQuery.hasData(elem)&&jQuery._data(elem);if(!elemData||!(events=elemData.events)){return;} // Once for each type.namespace in types; type may be omitted
types=(types||"").match(core_rnotwhite)||[""];t=types.length;while(t--){tmp=rtypenamespace.exec(types[t])||[];type=origType=tmp[1];namespaces=(tmp[2]||"").split(".").sort(); // Unbind all events (on this namespace, if provided) for the element
if(!type){for(type in events){jQuery.event.remove(elem,type+types[t],handler,selector,true);}continue;}special=jQuery.event.special[type]||{};type=(selector?special.delegateType:special.bindType)||type;handlers=events[type]||[];tmp=tmp[2]&&new RegExp("(^|\\.)"+namespaces.join("\\.(?:.*\\.|)")+"(\\.|$)"); // Remove matching events
origCount=j=handlers.length;while(j--){handleObj=handlers[j];if((mappedTypes||origType===handleObj.origType)&&(!handler||handler.guid===handleObj.guid)&&(!tmp||tmp.test(handleObj.namespace))&&(!selector||selector===handleObj.selector||selector==="**"&&handleObj.selector)){handlers.splice(j,1);if(handleObj.selector){handlers.delegateCount--;}if(special.remove){special.remove.call(elem,handleObj);}}} // Remove generic event handler if we removed something and no more handlers exist
// (avoids potential for endless recursion during removal of special event handlers)
if(origCount&&!handlers.length){if(!special.teardown||special.teardown.call(elem,namespaces,elemData.handle)===false){jQuery.removeEvent(elem,type,elemData.handle);}delete events[type];}} // Remove the expando if it's no longer used
if(jQuery.isEmptyObject(events)){delete elemData.handle; // removeData also checks for emptiness and clears the expando if empty
// so use it instead of delete
jQuery._removeData(elem,"events");}},trigger:function(event,data,elem,onlyHandlers){var handle,ontype,cur,bubbleType,special,tmp,i,eventPath=[elem||document],type=core_hasOwn.call(event,"type")?event.type:event,namespaces=core_hasOwn.call(event,"namespace")?event.namespace.split("."):[];cur=tmp=elem=elem||document; // Don't do events on text and comment nodes
if(elem.nodeType===3||elem.nodeType===8){return;} // focus/blur morphs to focusin/out; ensure we're not firing them right now
if(rfocusMorph.test(type+jQuery.event.triggered)){return;}if(type.indexOf(".")>=0){ // Namespaced trigger; create a regexp to match event type in handle()
namespaces=type.split(".");type=namespaces.shift();namespaces.sort();}ontype=type.indexOf(":")<0&&"on"+type; // Caller can pass in a jQuery.Event object, Object, or just an event type string
event=event[jQuery.expando]?event:new jQuery.Event(type,typeof event==="object"&&event);event.isTrigger=true;event.namespace=namespaces.join(".");event.namespace_re=event.namespace?new RegExp("(^|\\.)"+namespaces.join("\\.(?:.*\\.|)")+"(\\.|$)"):null; // Clean up the event in case it is being reused
event.result=undefined;if(!event.target){event.target=elem;} // Clone any incoming data and prepend the event, creating the handler arg list
data=data==null?[event]:jQuery.makeArray(data,[event]); // Allow special events to draw outside the lines
special=jQuery.event.special[type]||{};if(!onlyHandlers&&special.trigger&&special.trigger.apply(elem,data)===false){return;} // Determine event propagation path in advance, per W3C events spec (#9951)
// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
if(!onlyHandlers&&!special.noBubble&&!jQuery.isWindow(elem)){bubbleType=special.delegateType||type;if(!rfocusMorph.test(bubbleType+type)){cur=cur.parentNode;}for(;cur;cur=cur.parentNode){eventPath.push(cur);tmp=cur;} // Only add window if we got to document (e.g., not plain obj or detached DOM)
if(tmp===(elem.ownerDocument||document)){eventPath.push(tmp.defaultView||tmp.parentWindow||window);}} // Fire handlers on the event path
i=0;while((cur=eventPath[i++])&&!event.isPropagationStopped()){event.type=i>1?bubbleType:special.bindType||type; // jQuery handler
handle=(jQuery._data(cur,"events")||{})[event.type]&&jQuery._data(cur,"handle");if(handle){handle.apply(cur,data);} // Native handler
handle=ontype&&cur[ontype];if(handle&&jQuery.acceptData(cur)&&handle.apply&&handle.apply(cur,data)===false){event.preventDefault();}}event.type=type; // If nobody prevented the default action, do it now
if(!onlyHandlers&&!event.isDefaultPrevented()){if((!special._default||special._default.apply(elem.ownerDocument,data)===false)&&!(type==="click"&&jQuery.nodeName(elem,"a"))&&jQuery.acceptData(elem)){ // Call a native DOM method on the target with the same name name as the event.
// Can't use an .isFunction() check here because IE6/7 fails that test.
// Don't do default actions on window, that's where global variables be (#6170)
if(ontype&&elem[type]&&!jQuery.isWindow(elem)){ // Don't re-trigger an onFOO event when we call its FOO() method
tmp=elem[ontype];if(tmp){elem[ontype]=null;} // Prevent re-triggering of the same event, since we already bubbled it above
jQuery.event.triggered=type;try{elem[type]();}catch(e){ // IE<9 dies on focus/blur to hidden element (#1486,#12518)
// only reproducible on winXP IE8 native, not IE9 in IE8 mode
}jQuery.event.triggered=undefined;if(tmp){elem[ontype]=tmp;}}}}return event.result;},dispatch:function(event){ // Make a writable jQuery.Event from the native event object
event=jQuery.event.fix(event);var i,ret,handleObj,matched,j,handlerQueue=[],args=core_slice.call(arguments),handlers=(jQuery._data(this,"events")||{})[event.type]||[],special=jQuery.event.special[event.type]||{}; // Use the fix-ed jQuery.Event rather than the (read-only) native event
args[0]=event;event.delegateTarget=this; // Call the preDispatch hook for the mapped type, and let it bail if desired
if(special.preDispatch&&special.preDispatch.call(this,event)===false){return;} // Determine handlers
handlerQueue=jQuery.event.handlers.call(this,event,handlers); // Run delegates first; they may want to stop propagation beneath us
i=0;while((matched=handlerQueue[i++])&&!event.isPropagationStopped()){event.currentTarget=matched.elem;j=0;while((handleObj=matched.handlers[j++])&&!event.isImmediatePropagationStopped()){ // Triggered event must either 1) have no namespace, or
// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
if(!event.namespace_re||event.namespace_re.test(handleObj.namespace)){event.handleObj=handleObj;event.data=handleObj.data;ret=((jQuery.event.special[handleObj.origType]||{}).handle||handleObj.handler).apply(matched.elem,args);if(ret!==undefined){if((event.result=ret)===false){event.preventDefault();event.stopPropagation();}}}}} // Call the postDispatch hook for the mapped type
if(special.postDispatch){special.postDispatch.call(this,event);}return event.result;},handlers:function(event,handlers){var sel,handleObj,matches,i,handlerQueue=[],delegateCount=handlers.delegateCount,cur=event.target; // Find delegate handlers
// Black-hole SVG <use> instance trees (#13180)
// Avoid non-left-click bubbling in Firefox (#3861)
if(delegateCount&&cur.nodeType&&(!event.button||event.type!=="click")){for(;cur!=this;cur=cur.parentNode||this){ // Don't check non-elements (#13208)
// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
if(cur.nodeType===1&&(cur.disabled!==true||event.type!=="click")){matches=[];for(i=0;i<delegateCount;i++){handleObj=handlers[i]; // Don't conflict with Object.prototype properties (#13203)
sel=handleObj.selector+" ";if(matches[sel]===undefined){matches[sel]=handleObj.needsContext?jQuery(sel,this).index(cur)>=0:jQuery.find(sel,this,null,[cur]).length;}if(matches[sel]){matches.push(handleObj);}}if(matches.length){handlerQueue.push({elem:cur,handlers:matches});}}}} // Add the remaining (directly-bound) handlers
if(delegateCount<handlers.length){handlerQueue.push({elem:this,handlers:handlers.slice(delegateCount)});}return handlerQueue;},fix:function(event){if(event[jQuery.expando]){return event;} // Create a writable copy of the event object and normalize some properties
var i,prop,copy,type=event.type,originalEvent=event,fixHook=this.fixHooks[type];if(!fixHook){this.fixHooks[type]=fixHook=rmouseEvent.test(type)?this.mouseHooks:rkeyEvent.test(type)?this.keyHooks:{};}copy=fixHook.props?this.props.concat(fixHook.props):this.props;event=new jQuery.Event(originalEvent);i=copy.length;while(i--){prop=copy[i];event[prop]=originalEvent[prop];} // Support: IE<9
// Fix target property (#1925)
if(!event.target){event.target=originalEvent.srcElement||document;} // Support: Chrome 23+, Safari?
// Target should not be a text node (#504, #13143)
if(event.target.nodeType===3){event.target=event.target.parentNode;} // Support: IE<9
// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
event.metaKey=!!event.metaKey;return fixHook.filter?fixHook.filter(event,originalEvent):event;}, // Includes some event props shared by KeyEvent and MouseEvent
props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(event,original){ // Add which for key events
if(event.which==null){event.which=original.charCode!=null?original.charCode:original.keyCode;}return event;}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(event,original){var body,eventDoc,doc,button=original.button,fromElement=original.fromElement; // Calculate pageX/Y if missing and clientX/Y available
if(event.pageX==null&&original.clientX!=null){eventDoc=event.target.ownerDocument||document;doc=eventDoc.documentElement;body=eventDoc.body;event.pageX=original.clientX+(doc&&doc.scrollLeft||body&&body.scrollLeft||0)-(doc&&doc.clientLeft||body&&body.clientLeft||0);event.pageY=original.clientY+(doc&&doc.scrollTop||body&&body.scrollTop||0)-(doc&&doc.clientTop||body&&body.clientTop||0);} // Add relatedTarget, if necessary
if(!event.relatedTarget&&fromElement){event.relatedTarget=fromElement===event.target?original.toElement:fromElement;} // Add which for click: 1 === left; 2 === middle; 3 === right
// Note: button is not normalized, so don't use it
if(!event.which&&button!==undefined){event.which=button&1?1:button&2?3:button&4?2:0;}return event;}},special:{load:{ // Prevent triggered image.load events from bubbling to window.load
noBubble:true},click:{ // For checkbox, fire native event so checked state will be right
trigger:function(){if(jQuery.nodeName(this,"input")&&this.type==="checkbox"&&this.click){this.click();return false;}}},focus:{ // Fire native event if possible so blur/focus sequence is correct
trigger:function(){if(this!==document.activeElement&&this.focus){try{this.focus();return false;}catch(e){ // Support: IE<9
// If we error on focus to hidden element (#1486, #12518),
// let .trigger() run the handlers
}}},delegateType:"focusin"},blur:{trigger:function(){if(this===document.activeElement&&this.blur){this.blur();return false;}},delegateType:"focusout"},beforeunload:{postDispatch:function(event){ // Even when returnValue equals to undefined Firefox will still show alert
if(event.result!==undefined){event.originalEvent.returnValue=event.result;}}}},simulate:function(type,elem,event,bubble){ // Piggyback on a donor event to simulate a different one.
// Fake originalEvent to avoid donor's stopPropagation, but if the
// simulated event prevents default then we do the same on the donor.
var e=jQuery.extend(new jQuery.Event(),event,{type:type,isSimulated:true,originalEvent:{}});if(bubble){jQuery.event.trigger(e,null,elem);}else {jQuery.event.dispatch.call(elem,e);}if(e.isDefaultPrevented()){event.preventDefault();}}};jQuery.removeEvent=document.removeEventListener?function(elem,type,handle){if(elem.removeEventListener){elem.removeEventListener(type,handle,false);}}:function(elem,type,handle){var name="on"+type;if(elem.detachEvent){ // #8545, #7054, preventing memory leaks for custom events in IE6-8
// detachEvent needed property on element, by name of that event, to properly expose it to GC
if(typeof elem[name]===core_strundefined){elem[name]=null;}elem.detachEvent(name,handle);}};jQuery.Event=function(src,props){ // Allow instantiation without the 'new' keyword
if(!(this instanceof jQuery.Event)){return new jQuery.Event(src,props);} // Event object
if(src&&src.type){this.originalEvent=src;this.type=src.type; // Events bubbling up the document may have been marked as prevented
// by a handler lower down the tree; reflect the correct value.
this.isDefaultPrevented=src.defaultPrevented||src.returnValue===false||src.getPreventDefault&&src.getPreventDefault()?returnTrue:returnFalse; // Event type
}else {this.type=src;} // Put explicitly provided properties onto the event object
if(props){jQuery.extend(this,props);} // Create a timestamp if incoming event doesn't have one
this.timeStamp=src&&src.timeStamp||jQuery.now(); // Mark it as fixed
this[jQuery.expando]=true;}; // jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype={isDefaultPrevented:returnFalse,isPropagationStopped:returnFalse,isImmediatePropagationStopped:returnFalse,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=returnTrue;if(!e){return;} // If preventDefault exists, run it on the original event
if(e.preventDefault){e.preventDefault(); // Support: IE
// Otherwise set the returnValue property of the original event to false
}else {e.returnValue=false;}},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=returnTrue;if(!e){return;} // If stopPropagation exists, run it on the original event
if(e.stopPropagation){e.stopPropagation();} // Support: IE
// Set the cancelBubble property of the original event to true
e.cancelBubble=true;},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=returnTrue;this.stopPropagation();}}; // Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(orig,fix){jQuery.event.special[orig]={delegateType:fix,bindType:fix,handle:function(event){var ret,target=this,related=event.relatedTarget,handleObj=event.handleObj; // For mousenter/leave call the handler if related is outside the target.
// NB: No relatedTarget if the mouse left/entered the browser window
if(!related||related!==target&&!jQuery.contains(target,related)){event.type=handleObj.origType;ret=handleObj.handler.apply(this,arguments);event.type=fix;}return ret;}};}); // IE submit delegation
if(!jQuery.support.submitBubbles){jQuery.event.special.submit={setup:function(){ // Only need this for delegated form submit events
if(jQuery.nodeName(this,"form")){return false;} // Lazy-add a submit handler when a descendant form may potentially be submitted
jQuery.event.add(this,"click._submit keypress._submit",function(e){ // Node name check avoids a VML-related crash in IE (#9807)
var elem=e.target,form=jQuery.nodeName(elem,"input")||jQuery.nodeName(elem,"button")?elem.form:undefined;if(form&&!jQuery._data(form,"submitBubbles")){jQuery.event.add(form,"submit._submit",function(event){event._submit_bubble=true;});jQuery._data(form,"submitBubbles",true);}}); // return undefined since we don't need an event listener
},postDispatch:function(event){ // If form was submitted by the user, bubble the event up the tree
if(event._submit_bubble){delete event._submit_bubble;if(this.parentNode&&!event.isTrigger){jQuery.event.simulate("submit",this.parentNode,event,true);}}},teardown:function(){ // Only need this for delegated form submit events
if(jQuery.nodeName(this,"form")){return false;} // Remove delegated handlers; cleanData eventually reaps submit handlers attached above
jQuery.event.remove(this,"._submit");}};} // IE change delegation and checkbox/radio fix
if(!jQuery.support.changeBubbles){jQuery.event.special.change={setup:function(){if(rformElems.test(this.nodeName)){ // IE doesn't fire change on a check/radio until blur; trigger it on click
// after a propertychange. Eat the blur-change in special.change.handle.
// This still fires onchange a second time for check/radio after blur.
if(this.type==="checkbox"||this.type==="radio"){jQuery.event.add(this,"propertychange._change",function(event){if(event.originalEvent.propertyName==="checked"){this._just_changed=true;}});jQuery.event.add(this,"click._change",function(event){if(this._just_changed&&!event.isTrigger){this._just_changed=false;} // Allow triggered, simulated change events (#11500)
jQuery.event.simulate("change",this,event,true);});}return false;} // Delegated event; lazy-add a change handler on descendant inputs
jQuery.event.add(this,"beforeactivate._change",function(e){var elem=e.target;if(rformElems.test(elem.nodeName)&&!jQuery._data(elem,"changeBubbles")){jQuery.event.add(elem,"change._change",function(event){if(this.parentNode&&!event.isSimulated&&!event.isTrigger){jQuery.event.simulate("change",this.parentNode,event,true);}});jQuery._data(elem,"changeBubbles",true);}});},handle:function(event){var elem=event.target; // Swallow native change events from checkbox/radio, we already triggered them above
if(this!==elem||event.isSimulated||event.isTrigger||elem.type!=="radio"&&elem.type!=="checkbox"){return event.handleObj.handler.apply(this,arguments);}},teardown:function(){jQuery.event.remove(this,"._change");return !rformElems.test(this.nodeName);}};} // Create "bubbling" focus and blur events
if(!jQuery.support.focusinBubbles){jQuery.each({focus:"focusin",blur:"focusout"},function(orig,fix){ // Attach a single capturing handler while someone wants focusin/focusout
var attaches=0,handler=function(event){jQuery.event.simulate(fix,event.target,jQuery.event.fix(event),true);};jQuery.event.special[fix]={setup:function(){if(attaches++===0){document.addEventListener(orig,handler,true);}},teardown:function(){if(--attaches===0){document.removeEventListener(orig,handler,true);}}};});}jQuery.fn.extend({on:function(types,selector,data,fn, /*INTERNAL*/one){var type,origFn; // Types can be a map of types/handlers
if(typeof types==="object"){ // ( types-Object, selector, data )
if(typeof selector!=="string"){ // ( types-Object, data )
data=data||selector;selector=undefined;}for(type in types){this.on(type,selector,data,types[type],one);}return this;}if(data==null&&fn==null){ // ( types, fn )
fn=selector;data=selector=undefined;}else if(fn==null){if(typeof selector==="string"){ // ( types, selector, fn )
fn=data;data=undefined;}else { // ( types, data, fn )
fn=data;data=selector;selector=undefined;}}if(fn===false){fn=returnFalse;}else if(!fn){return this;}if(one===1){origFn=fn;fn=function(event){ // Can use an empty set, since event contains the info
jQuery().off(event);return origFn.apply(this,arguments);}; // Use same guid so caller can remove using origFn
fn.guid=origFn.guid||(origFn.guid=jQuery.guid++);}return this.each(function(){jQuery.event.add(this,types,fn,data,selector);});},one:function(types,selector,data,fn){return this.on(types,selector,data,fn,1);},off:function(types,selector,fn){var handleObj,type;if(types&&types.preventDefault&&types.handleObj){ // ( event )  dispatched jQuery.Event
handleObj=types.handleObj;jQuery(types.delegateTarget).off(handleObj.namespace?handleObj.origType+"."+handleObj.namespace:handleObj.origType,handleObj.selector,handleObj.handler);return this;}if(typeof types==="object"){ // ( types-object [, selector] )
for(type in types){this.off(type,selector,types[type]);}return this;}if(selector===false||typeof selector==="function"){ // ( types [, fn] )
fn=selector;selector=undefined;}if(fn===false){fn=returnFalse;}return this.each(function(){jQuery.event.remove(this,types,fn,selector);});},bind:function(types,data,fn){return this.on(types,null,data,fn);},unbind:function(types,fn){return this.off(types,null,fn);},delegate:function(selector,types,data,fn){return this.on(types,selector,data,fn);},undelegate:function(selector,types,fn){ // ( namespace ) or ( selector, types [, fn] )
return arguments.length===1?this.off(selector,"**"):this.off(types,selector||"**",fn);},trigger:function(type,data){return this.each(function(){jQuery.event.trigger(type,data,this);});},triggerHandler:function(type,data){var elem=this[0];if(elem){return jQuery.event.trigger(type,data,elem,true);}}}); /*!
 * Sizzle CSS Selector Engine
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://sizzlejs.com/
 */(function(window,undefined){var i,cachedruns,Expr,getText,isXML,compile,hasDuplicate,outermostContext, // Local document vars
setDocument,document,docElem,documentIsXML,rbuggyQSA,rbuggyMatches,matches,contains,sortOrder, // Instance-specific data
expando="sizzle"+-new Date(),preferredDoc=window.document,support={},dirruns=0,done=0,classCache=createCache(),tokenCache=createCache(),compilerCache=createCache(), // General-purpose constants
strundefined=typeof undefined,MAX_NEGATIVE=1<<31, // Array methods
arr=[],pop=arr.pop,push=arr.push,slice=arr.slice, // Use a stripped-down indexOf if we can't use a native one
indexOf=arr.indexOf||function(elem){var i=0,len=this.length;for(;i<len;i++){if(this[i]===elem){return i;}}return -1;}, // Regular expressions
// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
whitespace="[\\x20\\t\\r\\n\\f]", // http://www.w3.org/TR/css3-syntax/#characters
characterEncoding="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", // Loosely modeled on CSS identifier characters
// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
identifier=characterEncoding.replace("w","w#"), // Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
operators="([*^$|!~]?=)",attributes="\\["+whitespace+"*("+characterEncoding+")"+whitespace+"*(?:"+operators+whitespace+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+identifier+")|)|)"+whitespace+"*\\]", // Prefer arguments quoted,
//   then not containing pseudos/brackets,
//   then attribute selectors/non-parenthetical expressions,
//   then anything else
// These preferences are here to reduce the number of selectors
//   needing tokenize in the PSEUDO preFilter
pseudos=":("+characterEncoding+")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+attributes.replace(3,8)+")*)|.*)\\)|)", // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
rtrim=new RegExp("^"+whitespace+"+|((?:^|[^\\\\])(?:\\\\.)*)"+whitespace+"+$","g"),rcomma=new RegExp("^"+whitespace+"*,"+whitespace+"*"),rcombinators=new RegExp("^"+whitespace+"*([\\x20\\t\\r\\n\\f>+~])"+whitespace+"*"),rpseudo=new RegExp(pseudos),ridentifier=new RegExp("^"+identifier+"$"),matchExpr={"ID":new RegExp("^#("+characterEncoding+")"),"CLASS":new RegExp("^\\.("+characterEncoding+")"),"NAME":new RegExp("^\\[name=['\"]?("+characterEncoding+")['\"]?\\]"),"TAG":new RegExp("^("+characterEncoding.replace("w","w*")+")"),"ATTR":new RegExp("^"+attributes),"PSEUDO":new RegExp("^"+pseudos),"CHILD":new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+whitespace+"*(even|odd|(([+-]|)(\\d*)n|)"+whitespace+"*(?:([+-]|)"+whitespace+"*(\\d+)|))"+whitespace+"*\\)|)","i"), // For use in libraries implementing .is()
// We use this for POS matching in `select`
"needsContext":new RegExp("^"+whitespace+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+whitespace+"*((?:-\\d)?\\d*)"+whitespace+"*\\)|)(?=[^-]|$)","i")},rsibling=/[\x20\t\r\n\f]*[+~]/,rnative=/^[^{]+\{\s*\[native code/, // Easily-parseable/retrievable ID or TAG or CLASS selectors
rquickExpr=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,rinputs=/^(?:input|select|textarea|button)$/i,rheader=/^h\d$/i,rescape=/'|\\/g,rattributeQuotes=/\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g, // CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
runescape=/\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,funescape=function(_,escaped){var high="0x"+escaped-0x10000; // NaN means non-codepoint
return high!==high?escaped: // BMP codepoint
high<0?String.fromCharCode(high+0x10000): // Supplemental Plane codepoint (surrogate pair)
String.fromCharCode(high>>10|0xD800,high&0x3FF|0xDC00);}; // Use a stripped-down slice if we can't use a native one
try{slice.call(preferredDoc.documentElement.childNodes,0)[0].nodeType;}catch(e){slice=function(i){var elem,results=[];while(elem=this[i++]){results.push(elem);}return results;};} /**
 * For feature detection
 * @param {Function} fn The function to test for native support
 */function isNative(fn){return rnative.test(fn+"");} /**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */function createCache(){var cache,keys=[];return cache=function(key,value){ // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
if(keys.push(key+=" ")>Expr.cacheLength){ // Only keep the most recent entries
delete cache[keys.shift()];}return cache[key]=value;};} /**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */function markFunction(fn){fn[expando]=true;return fn;} /**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */function assert(fn){var div=document.createElement("div");try{return fn(div);}catch(e){return false;}finally { // release memory in IE
div=null;}}function Sizzle(selector,context,results,seed){var match,elem,m,nodeType, // QSA vars
i,groups,old,nid,newContext,newSelector;if((context?context.ownerDocument||context:preferredDoc)!==document){setDocument(context);}context=context||document;results=results||[];if(!selector||typeof selector!=="string"){return results;}if((nodeType=context.nodeType)!==1&&nodeType!==9){return [];}if(!documentIsXML&&!seed){ // Shortcuts
if(match=rquickExpr.exec(selector)){ // Speed-up: Sizzle("#ID")
if(m=match[1]){if(nodeType===9){elem=context.getElementById(m); // Check parentNode to catch when Blackberry 4.6 returns
// nodes that are no longer in the document #6963
if(elem&&elem.parentNode){ // Handle the case where IE, Opera, and Webkit return items
// by name instead of ID
if(elem.id===m){results.push(elem);return results;}}else {return results;}}else { // Context is not a document
if(context.ownerDocument&&(elem=context.ownerDocument.getElementById(m))&&contains(context,elem)&&elem.id===m){results.push(elem);return results;}} // Speed-up: Sizzle("TAG")
}else if(match[2]){push.apply(results,slice.call(context.getElementsByTagName(selector),0));return results; // Speed-up: Sizzle(".CLASS")
}else if((m=match[3])&&support.getByClassName&&context.getElementsByClassName){push.apply(results,slice.call(context.getElementsByClassName(m),0));return results;}} // QSA path
if(support.qsa&&!rbuggyQSA.test(selector)){old=true;nid=expando;newContext=context;newSelector=nodeType===9&&selector; // qSA works strangely on Element-rooted queries
// We can work around this by specifying an extra ID on the root
// and working up from there (Thanks to Andrew Dupont for the technique)
// IE 8 doesn't work on object elements
if(nodeType===1&&context.nodeName.toLowerCase()!=="object"){groups=tokenize(selector);if(old=context.getAttribute("id")){nid=old.replace(rescape,"\\$&");}else {context.setAttribute("id",nid);}nid="[id='"+nid+"'] ";i=groups.length;while(i--){groups[i]=nid+toSelector(groups[i]);}newContext=rsibling.test(selector)&&context.parentNode||context;newSelector=groups.join(",");}if(newSelector){try{push.apply(results,slice.call(newContext.querySelectorAll(newSelector),0));return results;}catch(qsaError){}finally {if(!old){context.removeAttribute("id");}}}}} // All others
return select(selector.replace(rtrim,"$1"),context,results,seed);} /**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */isXML=Sizzle.isXML=function(elem){ // documentElement is verified for cases where it doesn't yet exist
// (such as loading iframes in IE - #4833)
var documentElement=elem&&(elem.ownerDocument||elem).documentElement;return documentElement?documentElement.nodeName!=="HTML":false;}; /**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */setDocument=Sizzle.setDocument=function(node){var doc=node?node.ownerDocument||node:preferredDoc; // If no document and documentElement is available, return
if(doc===document||doc.nodeType!==9||!doc.documentElement){return document;} // Set our document
document=doc;docElem=doc.documentElement; // Support tests
documentIsXML=isXML(doc); // Check if getElementsByTagName("*") returns only elements
support.tagNameNoComments=assert(function(div){div.appendChild(doc.createComment(""));return !div.getElementsByTagName("*").length;}); // Check if attributes should be retrieved by attribute nodes
support.attributes=assert(function(div){div.innerHTML="<select></select>";var type=typeof div.lastChild.getAttribute("multiple"); // IE8 returns a string for some attributes even when not present
return type!=="boolean"&&type!=="string";}); // Check if getElementsByClassName can be trusted
support.getByClassName=assert(function(div){ // Opera can't find a second classname (in 9.6)
div.innerHTML="<div class='hidden e'></div><div class='hidden'></div>";if(!div.getElementsByClassName||!div.getElementsByClassName("e").length){return false;} // Safari 3.2 caches class attributes and doesn't catch changes
div.lastChild.className="e";return div.getElementsByClassName("e").length===2;}); // Check if getElementById returns elements by name
// Check if getElementsByName privileges form controls or returns elements by ID
support.getByName=assert(function(div){ // Inject content
div.id=expando+0;div.innerHTML="<a name='"+expando+"'></a><div name='"+expando+"'></div>";docElem.insertBefore(div,docElem.firstChild); // Test
var pass=doc.getElementsByName&& // buggy browsers will return fewer than the correct 2
doc.getElementsByName(expando).length===2+ // buggy browsers will return more than the correct 0
doc.getElementsByName(expando+0).length;support.getIdNotName=!doc.getElementById(expando); // Cleanup
docElem.removeChild(div);return pass;}); // IE6/7 return modified attributes
Expr.attrHandle=assert(function(div){div.innerHTML="<a href='#'></a>";return div.firstChild&&typeof div.firstChild.getAttribute!==strundefined&&div.firstChild.getAttribute("href")==="#";})?{}:{"href":function(elem){return elem.getAttribute("href",2);},"type":function(elem){return elem.getAttribute("type");}}; // ID find and filter
if(support.getIdNotName){Expr.find["ID"]=function(id,context){if(typeof context.getElementById!==strundefined&&!documentIsXML){var m=context.getElementById(id); // Check parentNode to catch when Blackberry 4.6 returns
// nodes that are no longer in the document #6963
return m&&m.parentNode?[m]:[];}};Expr.filter["ID"]=function(id){var attrId=id.replace(runescape,funescape);return function(elem){return elem.getAttribute("id")===attrId;};};}else {Expr.find["ID"]=function(id,context){if(typeof context.getElementById!==strundefined&&!documentIsXML){var m=context.getElementById(id);return m?m.id===id||typeof m.getAttributeNode!==strundefined&&m.getAttributeNode("id").value===id?[m]:undefined:[];}};Expr.filter["ID"]=function(id){var attrId=id.replace(runescape,funescape);return function(elem){var node=typeof elem.getAttributeNode!==strundefined&&elem.getAttributeNode("id");return node&&node.value===attrId;};};} // Tag
Expr.find["TAG"]=support.tagNameNoComments?function(tag,context){if(typeof context.getElementsByTagName!==strundefined){return context.getElementsByTagName(tag);}}:function(tag,context){var elem,tmp=[],i=0,results=context.getElementsByTagName(tag); // Filter out possible comments
if(tag==="*"){while(elem=results[i++]){if(elem.nodeType===1){tmp.push(elem);}}return tmp;}return results;}; // Name
Expr.find["NAME"]=support.getByName&&function(tag,context){if(typeof context.getElementsByName!==strundefined){return context.getElementsByName(name);}}; // Class
Expr.find["CLASS"]=support.getByClassName&&function(className,context){if(typeof context.getElementsByClassName!==strundefined&&!documentIsXML){return context.getElementsByClassName(className);}}; // QSA and matchesSelector support
// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
rbuggyMatches=[]; // qSa(:focus) reports false when true (Chrome 21),
// no need to also add to buggyMatches since matches checks buggyQSA
// A support test would require too much code (would include document ready)
rbuggyQSA=[":focus"];if(support.qsa=isNative(doc.querySelectorAll)){ // Build QSA regex
// Regex strategy adopted from Diego Perini
assert(function(div){ // Select is set to empty string on purpose
// This is to test IE's treatment of not explictly
// setting a boolean content attribute,
// since its presence should be enough
// http://bugs.jquery.com/ticket/12359
div.innerHTML="<select><option selected=''></option></select>"; // IE8 - Some boolean attributes are not treated correctly
if(!div.querySelectorAll("[selected]").length){rbuggyQSA.push("\\["+whitespace+"*(?:checked|disabled|ismap|multiple|readonly|selected|value)");} // Webkit/Opera - :checked should return selected option elements
// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
// IE8 throws error here and will not see later tests
if(!div.querySelectorAll(":checked").length){rbuggyQSA.push(":checked");}});assert(function(div){ // Opera 10-12/IE8 - ^= $= *= and empty values
// Should not select anything
div.innerHTML="<input type='hidden' i=''/>";if(div.querySelectorAll("[i^='']").length){rbuggyQSA.push("[*^$]="+whitespace+"*(?:\"\"|'')");} // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
// IE8 throws error here and will not see later tests
if(!div.querySelectorAll(":enabled").length){rbuggyQSA.push(":enabled",":disabled");} // Opera 10-11 does not throw on post-comma invalid pseudos
div.querySelectorAll("*,:x");rbuggyQSA.push(",.*:");});}if(support.matchesSelector=isNative(matches=docElem.matchesSelector||docElem.mozMatchesSelector||docElem.webkitMatchesSelector||docElem.oMatchesSelector||docElem.msMatchesSelector)){assert(function(div){ // Check to see if it's possible to do matchesSelector
// on a disconnected node (IE 9)
support.disconnectedMatch=matches.call(div,"div"); // This should fail with an exception
// Gecko does not error, returns false instead
matches.call(div,"[s!='']:x");rbuggyMatches.push("!=",pseudos);});}rbuggyQSA=new RegExp(rbuggyQSA.join("|"));rbuggyMatches=new RegExp(rbuggyMatches.join("|")); // Element contains another
// Purposefully does not implement inclusive descendent
// As in, an element does not contain itself
contains=isNative(docElem.contains)||docElem.compareDocumentPosition?function(a,b){var adown=a.nodeType===9?a.documentElement:a,bup=b&&b.parentNode;return a===bup||!!(bup&&bup.nodeType===1&&(adown.contains?adown.contains(bup):a.compareDocumentPosition&&a.compareDocumentPosition(bup)&16));}:function(a,b){if(b){while(b=b.parentNode){if(b===a){return true;}}}return false;}; // Document order sorting
sortOrder=docElem.compareDocumentPosition?function(a,b){var compare;if(a===b){hasDuplicate=true;return 0;}if(compare=b.compareDocumentPosition&&a.compareDocumentPosition&&a.compareDocumentPosition(b)){if(compare&1||a.parentNode&&a.parentNode.nodeType===11){if(a===doc||contains(preferredDoc,a)){return -1;}if(b===doc||contains(preferredDoc,b)){return 1;}return 0;}return compare&4?-1:1;}return a.compareDocumentPosition?-1:1;}:function(a,b){var cur,i=0,aup=a.parentNode,bup=b.parentNode,ap=[a],bp=[b]; // Exit early if the nodes are identical
if(a===b){hasDuplicate=true;return 0; // Parentless nodes are either documents or disconnected
}else if(!aup||!bup){return a===doc?-1:b===doc?1:aup?-1:bup?1:0; // If the nodes are siblings, we can do a quick check
}else if(aup===bup){return siblingCheck(a,b);} // Otherwise we need full lists of their ancestors for comparison
cur=a;while(cur=cur.parentNode){ap.unshift(cur);}cur=b;while(cur=cur.parentNode){bp.unshift(cur);} // Walk down the tree looking for a discrepancy
while(ap[i]===bp[i]){i++;}return i? // Do a sibling check if the nodes have a common ancestor
siblingCheck(ap[i],bp[i]): // Otherwise nodes in our document sort first
ap[i]===preferredDoc?-1:bp[i]===preferredDoc?1:0;}; // Always assume the presence of duplicates if sort doesn't
// pass them to our comparison function (as in Google Chrome).
hasDuplicate=false;[0,0].sort(sortOrder);support.detectDuplicates=hasDuplicate;return document;};Sizzle.matches=function(expr,elements){return Sizzle(expr,null,null,elements);};Sizzle.matchesSelector=function(elem,expr){ // Set document vars if needed
if((elem.ownerDocument||elem)!==document){setDocument(elem);} // Make sure that attribute selectors are quoted
expr=expr.replace(rattributeQuotes,"='$1']"); // rbuggyQSA always contains :focus, so no need for an existence check
if(support.matchesSelector&&!documentIsXML&&(!rbuggyMatches||!rbuggyMatches.test(expr))&&!rbuggyQSA.test(expr)){try{var ret=matches.call(elem,expr); // IE 9's matchesSelector returns false on disconnected nodes
if(ret||support.disconnectedMatch|| // As well, disconnected nodes are said to be in a document
// fragment in IE 9
elem.document&&elem.document.nodeType!==11){return ret;}}catch(e){}}return Sizzle(expr,document,null,[elem]).length>0;};Sizzle.contains=function(context,elem){ // Set document vars if needed
if((context.ownerDocument||context)!==document){setDocument(context);}return contains(context,elem);};Sizzle.attr=function(elem,name){var val; // Set document vars if needed
if((elem.ownerDocument||elem)!==document){setDocument(elem);}if(!documentIsXML){name=name.toLowerCase();}if(val=Expr.attrHandle[name]){return val(elem);}if(documentIsXML||support.attributes){return elem.getAttribute(name);}return ((val=elem.getAttributeNode(name))||elem.getAttribute(name))&&elem[name]===true?name:val&&val.specified?val.value:null;};Sizzle.error=function(msg){throw new Error("Syntax error, unrecognized expression: "+msg);}; // Document sorting and removing duplicates
Sizzle.uniqueSort=function(results){var elem,duplicates=[],i=1,j=0; // Unless we *know* we can detect duplicates, assume their presence
hasDuplicate=!support.detectDuplicates;results.sort(sortOrder);if(hasDuplicate){for(;elem=results[i];i++){if(elem===results[i-1]){j=duplicates.push(i);}}while(j--){results.splice(duplicates[j],1);}}return results;};function siblingCheck(a,b){var cur=b&&a,diff=cur&&(~b.sourceIndex||MAX_NEGATIVE)-(~a.sourceIndex||MAX_NEGATIVE); // Use IE sourceIndex if available on both nodes
if(diff){return diff;} // Check if b follows a
if(cur){while(cur=cur.nextSibling){if(cur===b){return -1;}}}return a?1:-1;} // Returns a function to use in pseudos for input types
function createInputPseudo(type){return function(elem){var name=elem.nodeName.toLowerCase();return name==="input"&&elem.type===type;};} // Returns a function to use in pseudos for buttons
function createButtonPseudo(type){return function(elem){var name=elem.nodeName.toLowerCase();return (name==="input"||name==="button")&&elem.type===type;};} // Returns a function to use in pseudos for positionals
function createPositionalPseudo(fn){return markFunction(function(argument){argument=+argument;return markFunction(function(seed,matches){var j,matchIndexes=fn([],seed.length,argument),i=matchIndexes.length; // Match elements found at the specified indexes
while(i--){if(seed[j=matchIndexes[i]]){seed[j]=!(matches[j]=seed[j]);}}});});} /**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */getText=Sizzle.getText=function(elem){var node,ret="",i=0,nodeType=elem.nodeType;if(!nodeType){ // If no nodeType, this is expected to be an array
for(;node=elem[i];i++){ // Do not traverse comment nodes
ret+=getText(node);}}else if(nodeType===1||nodeType===9||nodeType===11){ // Use textContent for elements
// innerText usage removed for consistency of new lines (see #11153)
if(typeof elem.textContent==="string"){return elem.textContent;}else { // Traverse its children
for(elem=elem.firstChild;elem;elem=elem.nextSibling){ret+=getText(elem);}}}else if(nodeType===3||nodeType===4){return elem.nodeValue;} // Do not include comment or processing instruction nodes
return ret;};Expr=Sizzle.selectors={ // Can be adjusted by the user
cacheLength:50,createPseudo:markFunction,match:matchExpr,find:{},relative:{">":{dir:"parentNode",first:true}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:true},"~":{dir:"previousSibling"}},preFilter:{"ATTR":function(match){match[1]=match[1].replace(runescape,funescape); // Move the given value to match[3] whether quoted or unquoted
match[3]=(match[4]||match[5]||"").replace(runescape,funescape);if(match[2]==="~="){match[3]=" "+match[3]+" ";}return match.slice(0,4);},"CHILD":function(match){ /* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/match[1]=match[1].toLowerCase();if(match[1].slice(0,3)==="nth"){ // nth-* requires argument
if(!match[3]){Sizzle.error(match[0]);} // numeric x and y parameters for Expr.filter.CHILD
// remember that false/true cast respectively to 0/1
match[4]=+(match[4]?match[5]+(match[6]||1):2*(match[3]==="even"||match[3]==="odd"));match[5]=+(match[7]+match[8]||match[3]==="odd"); // other types prohibit arguments
}else if(match[3]){Sizzle.error(match[0]);}return match;},"PSEUDO":function(match){var excess,unquoted=!match[5]&&match[2];if(matchExpr["CHILD"].test(match[0])){return null;} // Accept quoted arguments as-is
if(match[4]){match[2]=match[4]; // Strip excess characters from unquoted arguments
}else if(unquoted&&rpseudo.test(unquoted)&&( // Get excess from tokenize (recursively)
excess=tokenize(unquoted,true))&&( // advance to the next closing parenthesis
excess=unquoted.indexOf(")",unquoted.length-excess)-unquoted.length)){ // excess is a negative index
match[0]=match[0].slice(0,excess);match[2]=unquoted.slice(0,excess);} // Return only captures needed by the pseudo filter method (type and argument)
return match.slice(0,3);}},filter:{"TAG":function(nodeName){if(nodeName==="*"){return function(){return true;};}nodeName=nodeName.replace(runescape,funescape).toLowerCase();return function(elem){return elem.nodeName&&elem.nodeName.toLowerCase()===nodeName;};},"CLASS":function(className){var pattern=classCache[className+" "];return pattern||(pattern=new RegExp("(^|"+whitespace+")"+className+"("+whitespace+"|$)"))&&classCache(className,function(elem){return pattern.test(elem.className||typeof elem.getAttribute!==strundefined&&elem.getAttribute("class")||"");});},"ATTR":function(name,operator,check){return function(elem){var result=Sizzle.attr(elem,name);if(result==null){return operator==="!=";}if(!operator){return true;}result+="";return operator==="="?result===check:operator==="!="?result!==check:operator==="^="?check&&result.indexOf(check)===0:operator==="*="?check&&result.indexOf(check)>-1:operator==="$="?check&&result.slice(-check.length)===check:operator==="~="?(" "+result+" ").indexOf(check)>-1:operator==="|="?result===check||result.slice(0,check.length+1)===check+"-":false;};},"CHILD":function(type,what,argument,first,last){var simple=type.slice(0,3)!=="nth",forward=type.slice(-4)!=="last",ofType=what==="of-type";return first===1&&last===0? // Shortcut for :nth-*(n)
function(elem){return !!elem.parentNode;}:function(elem,context,xml){var cache,outerCache,node,diff,nodeIndex,start,dir=simple!==forward?"nextSibling":"previousSibling",parent=elem.parentNode,name=ofType&&elem.nodeName.toLowerCase(),useCache=!xml&&!ofType;if(parent){ // :(first|last|only)-(child|of-type)
if(simple){while(dir){node=elem;while(node=node[dir]){if(ofType?node.nodeName.toLowerCase()===name:node.nodeType===1){return false;}} // Reverse direction for :only-* (if we haven't yet done so)
start=dir=type==="only"&&!start&&"nextSibling";}return true;}start=[forward?parent.firstChild:parent.lastChild]; // non-xml :nth-child(...) stores cache data on `parent`
if(forward&&useCache){ // Seek `elem` from a previously-cached index
outerCache=parent[expando]||(parent[expando]={});cache=outerCache[type]||[];nodeIndex=cache[0]===dirruns&&cache[1];diff=cache[0]===dirruns&&cache[2];node=nodeIndex&&parent.childNodes[nodeIndex];while(node=++nodeIndex&&node&&node[dir]||( // Fallback to seeking `elem` from the start
diff=nodeIndex=0)||start.pop()){ // When found, cache indexes on `parent` and break
if(node.nodeType===1&&++diff&&node===elem){outerCache[type]=[dirruns,nodeIndex,diff];break;}} // Use previously-cached element index if available
}else if(useCache&&(cache=(elem[expando]||(elem[expando]={}))[type])&&cache[0]===dirruns){diff=cache[1]; // xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
}else { // Use the same loop as above to seek `elem` from the start
while(node=++nodeIndex&&node&&node[dir]||(diff=nodeIndex=0)||start.pop()){if((ofType?node.nodeName.toLowerCase()===name:node.nodeType===1)&&++diff){ // Cache the index of each encountered element
if(useCache){(node[expando]||(node[expando]={}))[type]=[dirruns,diff];}if(node===elem){break;}}}} // Incorporate the offset, then check against cycle size
diff-=last;return diff===first||diff%first===0&&diff/first>=0;}};},"PSEUDO":function(pseudo,argument){ // pseudo-class names are case-insensitive
// http://www.w3.org/TR/selectors/#pseudo-classes
// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
// Remember that setFilters inherits from pseudos
var args,fn=Expr.pseudos[pseudo]||Expr.setFilters[pseudo.toLowerCase()]||Sizzle.error("unsupported pseudo: "+pseudo); // The user may use createPseudo to indicate that
// arguments are needed to create the filter function
// just as Sizzle does
if(fn[expando]){return fn(argument);} // But maintain support for old signatures
if(fn.length>1){args=[pseudo,pseudo,"",argument];return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase())?markFunction(function(seed,matches){var idx,matched=fn(seed,argument),i=matched.length;while(i--){idx=indexOf.call(seed,matched[i]);seed[idx]=!(matches[idx]=matched[i]);}}):function(elem){return fn(elem,0,args);};}return fn;}},pseudos:{ // Potentially complex pseudos
"not":markFunction(function(selector){ // Trim the selector passed to compile
// to avoid treating leading and trailing
// spaces as combinators
var input=[],results=[],matcher=compile(selector.replace(rtrim,"$1"));return matcher[expando]?markFunction(function(seed,matches,context,xml){var elem,unmatched=matcher(seed,null,xml,[]),i=seed.length; // Match elements unmatched by `matcher`
while(i--){if(elem=unmatched[i]){seed[i]=!(matches[i]=elem);}}}):function(elem,context,xml){input[0]=elem;matcher(input,null,xml,results);return !results.pop();};}),"has":markFunction(function(selector){return function(elem){return Sizzle(selector,elem).length>0;};}),"contains":markFunction(function(text){return function(elem){return (elem.textContent||elem.innerText||getText(elem)).indexOf(text)>-1;};}), // "Whether an element is represented by a :lang() selector
// is based solely on the element's language value
// being equal to the identifier C,
// or beginning with the identifier C immediately followed by "-".
// The matching of C against the element's language value is performed case-insensitively.
// The identifier C does not have to be a valid language name."
// http://www.w3.org/TR/selectors/#lang-pseudo
"lang":markFunction(function(lang){ // lang value must be a valid identifider
if(!ridentifier.test(lang||"")){Sizzle.error("unsupported lang: "+lang);}lang=lang.replace(runescape,funescape).toLowerCase();return function(elem){var elemLang;do {if(elemLang=documentIsXML?elem.getAttribute("xml:lang")||elem.getAttribute("lang"):elem.lang){elemLang=elemLang.toLowerCase();return elemLang===lang||elemLang.indexOf(lang+"-")===0;}}while((elem=elem.parentNode)&&elem.nodeType===1);return false;};}), // Miscellaneous
"target":function(elem){var hash=window.location&&window.location.hash;return hash&&hash.slice(1)===elem.id;},"root":function(elem){return elem===docElem;},"focus":function(elem){return elem===document.activeElement&&(!document.hasFocus||document.hasFocus())&&!!(elem.type||elem.href||~elem.tabIndex);}, // Boolean properties
"enabled":function(elem){return elem.disabled===false;},"disabled":function(elem){return elem.disabled===true;},"checked":function(elem){ // In CSS3, :checked should return both checked and selected elements
// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
var nodeName=elem.nodeName.toLowerCase();return nodeName==="input"&&!!elem.checked||nodeName==="option"&&!!elem.selected;},"selected":function(elem){ // Accessing this property makes selected-by-default
// options in Safari work properly
if(elem.parentNode){elem.parentNode.selectedIndex;}return elem.selected===true;}, // Contents
"empty":function(elem){ // http://www.w3.org/TR/selectors/#empty-pseudo
// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
//   not comment, processing instructions, or others
// Thanks to Diego Perini for the nodeName shortcut
//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
for(elem=elem.firstChild;elem;elem=elem.nextSibling){if(elem.nodeName>"@"||elem.nodeType===3||elem.nodeType===4){return false;}}return true;},"parent":function(elem){return !Expr.pseudos["empty"](elem);}, // Element/input types
"header":function(elem){return rheader.test(elem.nodeName);},"input":function(elem){return rinputs.test(elem.nodeName);},"button":function(elem){var name=elem.nodeName.toLowerCase();return name==="input"&&elem.type==="button"||name==="button";},"text":function(elem){var attr; // IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
// use getAttribute instead to test this case
return elem.nodeName.toLowerCase()==="input"&&elem.type==="text"&&((attr=elem.getAttribute("type"))==null||attr.toLowerCase()===elem.type);}, // Position-in-collection
"first":createPositionalPseudo(function(){return [0];}),"last":createPositionalPseudo(function(matchIndexes,length){return [length-1];}),"eq":createPositionalPseudo(function(matchIndexes,length,argument){return [argument<0?argument+length:argument];}),"even":createPositionalPseudo(function(matchIndexes,length){var i=0;for(;i<length;i+=2){matchIndexes.push(i);}return matchIndexes;}),"odd":createPositionalPseudo(function(matchIndexes,length){var i=1;for(;i<length;i+=2){matchIndexes.push(i);}return matchIndexes;}),"lt":createPositionalPseudo(function(matchIndexes,length,argument){var i=argument<0?argument+length:argument;for(;--i>=0;){matchIndexes.push(i);}return matchIndexes;}),"gt":createPositionalPseudo(function(matchIndexes,length,argument){var i=argument<0?argument+length:argument;for(;++i<length;){matchIndexes.push(i);}return matchIndexes;})}}; // Add button/input type pseudos
for(i in {radio:true,checkbox:true,file:true,password:true,image:true}){Expr.pseudos[i]=createInputPseudo(i);}for(i in {submit:true,reset:true}){Expr.pseudos[i]=createButtonPseudo(i);}function tokenize(selector,parseOnly){var matched,match,tokens,type,soFar,groups,preFilters,cached=tokenCache[selector+" "];if(cached){return parseOnly?0:cached.slice(0);}soFar=selector;groups=[];preFilters=Expr.preFilter;while(soFar){ // Comma and first run
if(!matched||(match=rcomma.exec(soFar))){if(match){ // Don't consume trailing commas as valid
soFar=soFar.slice(match[0].length)||soFar;}groups.push(tokens=[]);}matched=false; // Combinators
if(match=rcombinators.exec(soFar)){matched=match.shift();tokens.push({value:matched, // Cast descendant combinators to space
type:match[0].replace(rtrim," ")});soFar=soFar.slice(matched.length);} // Filters
for(type in Expr.filter){if((match=matchExpr[type].exec(soFar))&&(!preFilters[type]||(match=preFilters[type](match)))){matched=match.shift();tokens.push({value:matched,type:type,matches:match});soFar=soFar.slice(matched.length);}}if(!matched){break;}} // Return the length of the invalid excess
// if we're just parsing
// Otherwise, throw an error or return tokens
return parseOnly?soFar.length:soFar?Sizzle.error(selector): // Cache the tokens
tokenCache(selector,groups).slice(0);}function toSelector(tokens){var i=0,len=tokens.length,selector="";for(;i<len;i++){selector+=tokens[i].value;}return selector;}function addCombinator(matcher,combinator,base){var dir=combinator.dir,checkNonElements=base&&dir==="parentNode",doneName=done++;return combinator.first? // Check against closest ancestor/preceding element
function(elem,context,xml){while(elem=elem[dir]){if(elem.nodeType===1||checkNonElements){return matcher(elem,context,xml);}}}: // Check against all ancestor/preceding elements
function(elem,context,xml){var data,cache,outerCache,dirkey=dirruns+" "+doneName; // We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
if(xml){while(elem=elem[dir]){if(elem.nodeType===1||checkNonElements){if(matcher(elem,context,xml)){return true;}}}}else {while(elem=elem[dir]){if(elem.nodeType===1||checkNonElements){outerCache=elem[expando]||(elem[expando]={});if((cache=outerCache[dir])&&cache[0]===dirkey){if((data=cache[1])===true||data===cachedruns){return data===true;}}else {cache=outerCache[dir]=[dirkey];cache[1]=matcher(elem,context,xml)||cachedruns;if(cache[1]===true){return true;}}}}}};}function elementMatcher(matchers){return matchers.length>1?function(elem,context,xml){var i=matchers.length;while(i--){if(!matchers[i](elem,context,xml)){return false;}}return true;}:matchers[0];}function condense(unmatched,map,filter,context,xml){var elem,newUnmatched=[],i=0,len=unmatched.length,mapped=map!=null;for(;i<len;i++){if(elem=unmatched[i]){if(!filter||filter(elem,context,xml)){newUnmatched.push(elem);if(mapped){map.push(i);}}}}return newUnmatched;}function setMatcher(preFilter,selector,matcher,postFilter,postFinder,postSelector){if(postFilter&&!postFilter[expando]){postFilter=setMatcher(postFilter);}if(postFinder&&!postFinder[expando]){postFinder=setMatcher(postFinder,postSelector);}return markFunction(function(seed,results,context,xml){var temp,i,elem,preMap=[],postMap=[],preexisting=results.length, // Get initial elements from seed or context
elems=seed||multipleContexts(selector||"*",context.nodeType?[context]:context,[]), // Prefilter to get matcher input, preserving a map for seed-results synchronization
matcherIn=preFilter&&(seed||!selector)?condense(elems,preMap,preFilter,context,xml):elems,matcherOut=matcher? // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
postFinder||(seed?preFilter:preexisting||postFilter)? // ...intermediate processing is necessary
[]: // ...otherwise use results directly
results:matcherIn; // Find primary matches
if(matcher){matcher(matcherIn,matcherOut,context,xml);} // Apply postFilter
if(postFilter){temp=condense(matcherOut,postMap);postFilter(temp,[],context,xml); // Un-match failing elements by moving them back to matcherIn
i=temp.length;while(i--){if(elem=temp[i]){matcherOut[postMap[i]]=!(matcherIn[postMap[i]]=elem);}}}if(seed){if(postFinder||preFilter){if(postFinder){ // Get the final matcherOut by condensing this intermediate into postFinder contexts
temp=[];i=matcherOut.length;while(i--){if(elem=matcherOut[i]){ // Restore matcherIn since elem is not yet a final match
temp.push(matcherIn[i]=elem);}}postFinder(null,matcherOut=[],temp,xml);} // Move matched elements from seed to results to keep them synchronized
i=matcherOut.length;while(i--){if((elem=matcherOut[i])&&(temp=postFinder?indexOf.call(seed,elem):preMap[i])>-1){seed[temp]=!(results[temp]=elem);}}} // Add elements to results, through postFinder if defined
}else {matcherOut=condense(matcherOut===results?matcherOut.splice(preexisting,matcherOut.length):matcherOut);if(postFinder){postFinder(null,results,matcherOut,xml);}else {push.apply(results,matcherOut);}}});}function matcherFromTokens(tokens){var checkContext,matcher,j,len=tokens.length,leadingRelative=Expr.relative[tokens[0].type],implicitRelative=leadingRelative||Expr.relative[" "],i=leadingRelative?1:0, // The foundational matcher ensures that elements are reachable from top-level context(s)
matchContext=addCombinator(function(elem){return elem===checkContext;},implicitRelative,true),matchAnyContext=addCombinator(function(elem){return indexOf.call(checkContext,elem)>-1;},implicitRelative,true),matchers=[function(elem,context,xml){return !leadingRelative&&(xml||context!==outermostContext)||((checkContext=context).nodeType?matchContext(elem,context,xml):matchAnyContext(elem,context,xml));}];for(;i<len;i++){if(matcher=Expr.relative[tokens[i].type]){matchers=[addCombinator(elementMatcher(matchers),matcher)];}else {matcher=Expr.filter[tokens[i].type].apply(null,tokens[i].matches); // Return special upon seeing a positional matcher
if(matcher[expando]){ // Find the next relative operator (if any) for proper handling
j=++i;for(;j<len;j++){if(Expr.relative[tokens[j].type]){break;}}return setMatcher(i>1&&elementMatcher(matchers),i>1&&toSelector(tokens.slice(0,i-1)).replace(rtrim,"$1"),matcher,i<j&&matcherFromTokens(tokens.slice(i,j)),j<len&&matcherFromTokens(tokens=tokens.slice(j)),j<len&&toSelector(tokens));}matchers.push(matcher);}}return elementMatcher(matchers);}function matcherFromGroupMatchers(elementMatchers,setMatchers){ // A counter to specify which element is currently being matched
var matcherCachedRuns=0,bySet=setMatchers.length>0,byElement=elementMatchers.length>0,superMatcher=function(seed,context,xml,results,expandContext){var elem,j,matcher,setMatched=[],matchedCount=0,i="0",unmatched=seed&&[],outermost=expandContext!=null,contextBackup=outermostContext, // We must always have either seed elements or context
elems=seed||byElement&&Expr.find["TAG"]("*",expandContext&&context.parentNode||context), // Use integer dirruns iff this is the outermost matcher
dirrunsUnique=dirruns+=contextBackup==null?1:Math.random()||0.1;if(outermost){outermostContext=context!==document&&context;cachedruns=matcherCachedRuns;} // Add elements passing elementMatchers directly to results
// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
for(;(elem=elems[i])!=null;i++){if(byElement&&elem){j=0;while(matcher=elementMatchers[j++]){if(matcher(elem,context,xml)){results.push(elem);break;}}if(outermost){dirruns=dirrunsUnique;cachedruns=++matcherCachedRuns;}} // Track unmatched elements for set filters
if(bySet){ // They will have gone through all possible matchers
if(elem=!matcher&&elem){matchedCount--;} // Lengthen the array for every element, matched or not
if(seed){unmatched.push(elem);}}} // Apply set filters to unmatched elements
matchedCount+=i;if(bySet&&i!==matchedCount){j=0;while(matcher=setMatchers[j++]){matcher(unmatched,setMatched,context,xml);}if(seed){ // Reintegrate element matches to eliminate the need for sorting
if(matchedCount>0){while(i--){if(!(unmatched[i]||setMatched[i])){setMatched[i]=pop.call(results);}}} // Discard index placeholder values to get only actual matches
setMatched=condense(setMatched);} // Add matches to results
push.apply(results,setMatched); // Seedless set matches succeeding multiple successful matchers stipulate sorting
if(outermost&&!seed&&setMatched.length>0&&matchedCount+setMatchers.length>1){Sizzle.uniqueSort(results);}} // Override manipulation of globals by nested matchers
if(outermost){dirruns=dirrunsUnique;outermostContext=contextBackup;}return unmatched;};return bySet?markFunction(superMatcher):superMatcher;}compile=Sizzle.compile=function(selector,group /* Internal Use Only */){var i,setMatchers=[],elementMatchers=[],cached=compilerCache[selector+" "];if(!cached){ // Generate a function of recursive functions that can be used to check each element
if(!group){group=tokenize(selector);}i=group.length;while(i--){cached=matcherFromTokens(group[i]);if(cached[expando]){setMatchers.push(cached);}else {elementMatchers.push(cached);}} // Cache the compiled function
cached=compilerCache(selector,matcherFromGroupMatchers(elementMatchers,setMatchers));}return cached;};function multipleContexts(selector,contexts,results){var i=0,len=contexts.length;for(;i<len;i++){Sizzle(selector,contexts[i],results);}return results;}function select(selector,context,results,seed){var i,tokens,token,type,find,match=tokenize(selector);if(!seed){ // Try to minimize operations if there is only one group
if(match.length===1){ // Take a shortcut and set the context if the root selector is an ID
tokens=match[0]=match[0].slice(0);if(tokens.length>2&&(token=tokens[0]).type==="ID"&&context.nodeType===9&&!documentIsXML&&Expr.relative[tokens[1].type]){context=Expr.find["ID"](token.matches[0].replace(runescape,funescape),context)[0];if(!context){return results;}selector=selector.slice(tokens.shift().value.length);} // Fetch a seed set for right-to-left matching
i=matchExpr["needsContext"].test(selector)?0:tokens.length;while(i--){token=tokens[i]; // Abort if we hit a combinator
if(Expr.relative[type=token.type]){break;}if(find=Expr.find[type]){ // Search, expanding context for leading sibling combinators
if(seed=find(token.matches[0].replace(runescape,funescape),rsibling.test(tokens[0].type)&&context.parentNode||context)){ // If seed is empty or no tokens remain, we can return early
tokens.splice(i,1);selector=seed.length&&toSelector(tokens);if(!selector){push.apply(results,slice.call(seed,0));return results;}break;}}}}} // Compile and execute a filtering function
// Provide `match` to avoid retokenization if we modified the selector above
compile(selector,match)(seed,context,documentIsXML,results,rsibling.test(selector));return results;} // Deprecated
Expr.pseudos["nth"]=Expr.pseudos["eq"]; // Easy API for creating new setFilters
function setFilters(){}Expr.filters=setFilters.prototype=Expr.pseudos;Expr.setFilters=new setFilters(); // Initialize with the default document
setDocument(); // Override sizzle attribute retrieval
Sizzle.attr=jQuery.attr;jQuery.find=Sizzle;jQuery.expr=Sizzle.selectors;jQuery.expr[":"]=jQuery.expr.pseudos;jQuery.unique=Sizzle.uniqueSort;jQuery.text=Sizzle.getText;jQuery.isXMLDoc=Sizzle.isXML;jQuery.contains=Sizzle.contains;})(window);var runtil=/Until$/,rparentsprev=/^(?:parents|prev(?:Until|All))/,isSimple=/^.[^:#\[\.,]*$/,rneedsContext=jQuery.expr.match.needsContext, // methods guaranteed to produce a unique set when starting from a unique set
guaranteedUnique={children:true,contents:true,next:true,prev:true};jQuery.fn.extend({find:function(selector){var i,ret,self,len=this.length;if(typeof selector!=="string"){self=this;return this.pushStack(jQuery(selector).filter(function(){for(i=0;i<len;i++){if(jQuery.contains(self[i],this)){return true;}}}));}ret=[];for(i=0;i<len;i++){jQuery.find(selector,this[i],ret);} // Needed because $( selector, context ) becomes $( context ).find( selector )
ret=this.pushStack(len>1?jQuery.unique(ret):ret);ret.selector=(this.selector?this.selector+" ":"")+selector;return ret;},has:function(target){var i,targets=jQuery(target,this),len=targets.length;return this.filter(function(){for(i=0;i<len;i++){if(jQuery.contains(this,targets[i])){return true;}}});},not:function(selector){return this.pushStack(winnow(this,selector,false));},filter:function(selector){return this.pushStack(winnow(this,selector,true));},is:function(selector){return !!selector&&(typeof selector==="string"? // If this is a positional/relative selector, check membership in the returned set
// so $("p:first").is("p:last") won't return true for a doc with two "p".
rneedsContext.test(selector)?jQuery(selector,this.context).index(this[0])>=0:jQuery.filter(selector,this).length>0:this.filter(selector).length>0);},closest:function(selectors,context){var cur,i=0,l=this.length,ret=[],pos=rneedsContext.test(selectors)||typeof selectors!=="string"?jQuery(selectors,context||this.context):0;for(;i<l;i++){cur=this[i];while(cur&&cur.ownerDocument&&cur!==context&&cur.nodeType!==11){if(pos?pos.index(cur)>-1:jQuery.find.matchesSelector(cur,selectors)){ret.push(cur);break;}cur=cur.parentNode;}}return this.pushStack(ret.length>1?jQuery.unique(ret):ret);}, // Determine the position of an element within
// the matched set of elements
index:function(elem){ // No argument, return index in parent
if(!elem){return this[0]&&this[0].parentNode?this.first().prevAll().length:-1;} // index in selector
if(typeof elem==="string"){return jQuery.inArray(this[0],jQuery(elem));} // Locate the position of the desired element
return jQuery.inArray( // If it receives a jQuery object, the first element is used
elem.jquery?elem[0]:elem,this);},add:function(selector,context){var set=typeof selector==="string"?jQuery(selector,context):jQuery.makeArray(selector&&selector.nodeType?[selector]:selector),all=jQuery.merge(this.get(),set);return this.pushStack(jQuery.unique(all));},addBack:function(selector){return this.add(selector==null?this.prevObject:this.prevObject.filter(selector));}});jQuery.fn.andSelf=jQuery.fn.addBack;function sibling(cur,dir){do {cur=cur[dir];}while(cur&&cur.nodeType!==1);return cur;}jQuery.each({parent:function(elem){var parent=elem.parentNode;return parent&&parent.nodeType!==11?parent:null;},parents:function(elem){return jQuery.dir(elem,"parentNode");},parentsUntil:function(elem,i,until){return jQuery.dir(elem,"parentNode",until);},next:function(elem){return sibling(elem,"nextSibling");},prev:function(elem){return sibling(elem,"previousSibling");},nextAll:function(elem){return jQuery.dir(elem,"nextSibling");},prevAll:function(elem){return jQuery.dir(elem,"previousSibling");},nextUntil:function(elem,i,until){return jQuery.dir(elem,"nextSibling",until);},prevUntil:function(elem,i,until){return jQuery.dir(elem,"previousSibling",until);},siblings:function(elem){return jQuery.sibling((elem.parentNode||{}).firstChild,elem);},children:function(elem){return jQuery.sibling(elem.firstChild);},contents:function(elem){return jQuery.nodeName(elem,"iframe")?elem.contentDocument||elem.contentWindow.document:jQuery.merge([],elem.childNodes);}},function(name,fn){jQuery.fn[name]=function(until,selector){var ret=jQuery.map(this,fn,until);if(!runtil.test(name)){selector=until;}if(selector&&typeof selector==="string"){ret=jQuery.filter(selector,ret);}ret=this.length>1&&!guaranteedUnique[name]?jQuery.unique(ret):ret;if(this.length>1&&rparentsprev.test(name)){ret=ret.reverse();}return this.pushStack(ret);};});jQuery.extend({filter:function(expr,elems,not){if(not){expr=":not("+expr+")";}return elems.length===1?jQuery.find.matchesSelector(elems[0],expr)?[elems[0]]:[]:jQuery.find.matches(expr,elems);},dir:function(elem,dir,until){var matched=[],cur=elem[dir];while(cur&&cur.nodeType!==9&&(until===undefined||cur.nodeType!==1||!jQuery(cur).is(until))){if(cur.nodeType===1){matched.push(cur);}cur=cur[dir];}return matched;},sibling:function(n,elem){var r=[];for(;n;n=n.nextSibling){if(n.nodeType===1&&n!==elem){r.push(n);}}return r;}}); // Implement the identical functionality for filter and not
function winnow(elements,qualifier,keep){ // Can't pass null or undefined to indexOf in Firefox 4
// Set to 0 to skip string check
qualifier=qualifier||0;if(jQuery.isFunction(qualifier)){return jQuery.grep(elements,function(elem,i){var retVal=!!qualifier.call(elem,i,elem);return retVal===keep;});}else if(qualifier.nodeType){return jQuery.grep(elements,function(elem){return elem===qualifier===keep;});}else if(typeof qualifier==="string"){var filtered=jQuery.grep(elements,function(elem){return elem.nodeType===1;});if(isSimple.test(qualifier)){return jQuery.filter(qualifier,filtered,!keep);}else {qualifier=jQuery.filter(qualifier,filtered);}}return jQuery.grep(elements,function(elem){return jQuery.inArray(elem,qualifier)>=0===keep;});}function createSafeFragment(document){var list=nodeNames.split("|"),safeFrag=document.createDocumentFragment();if(safeFrag.createElement){while(list.length){safeFrag.createElement(list.pop());}}return safeFrag;}var nodeNames="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|"+"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",rinlinejQuery=/ jQuery\d+="(?:null|\d+)"/g,rnoshimcache=new RegExp("<(?:"+nodeNames+")[\\s/>]","i"),rleadingWhitespace=/^\s+/,rxhtmlTag=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,rtagName=/<([\w:]+)/,rtbody=/<tbody/i,rhtml=/<|&#?\w+;/,rnoInnerhtml=/<(?:script|style|link)/i,manipulation_rcheckableType=/^(?:checkbox|radio)$/i, // checked="checked" or checked
rchecked=/checked\s*(?:[^=]|=\s*.checked.)/i,rscriptType=/^$|\/(?:java|ecma)script/i,rscriptTypeMasked=/^true\/(.*)/,rcleanScript=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, // We have to close these tags to support XHTML (#13200)
wrapMap={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"], // IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
// unless wrapped in a div with non-breaking characters in front of it.
_default:jQuery.support.htmlSerialize?[0,"",""]:[1,"X<div>","</div>"]},safeFragment=createSafeFragment(document),fragmentDiv=safeFragment.appendChild(document.createElement("div"));wrapMap.optgroup=wrapMap.option;wrapMap.tbody=wrapMap.tfoot=wrapMap.colgroup=wrapMap.caption=wrapMap.thead;wrapMap.th=wrapMap.td;jQuery.fn.extend({text:function(value){return jQuery.access(this,function(value){return value===undefined?jQuery.text(this):this.empty().append((this[0]&&this[0].ownerDocument||document).createTextNode(value));},null,value,arguments.length);},wrapAll:function(html){if(jQuery.isFunction(html)){return this.each(function(i){jQuery(this).wrapAll(html.call(this,i));});}if(this[0]){ // The elements to wrap the target around
var wrap=jQuery(html,this[0].ownerDocument).eq(0).clone(true);if(this[0].parentNode){wrap.insertBefore(this[0]);}wrap.map(function(){var elem=this;while(elem.firstChild&&elem.firstChild.nodeType===1){elem=elem.firstChild;}return elem;}).append(this);}return this;},wrapInner:function(html){if(jQuery.isFunction(html)){return this.each(function(i){jQuery(this).wrapInner(html.call(this,i));});}return this.each(function(){var self=jQuery(this),contents=self.contents();if(contents.length){contents.wrapAll(html);}else {self.append(html);}});},wrap:function(html){var isFunction=jQuery.isFunction(html);return this.each(function(i){jQuery(this).wrapAll(isFunction?html.call(this,i):html);});},unwrap:function(){return this.parent().each(function(){if(!jQuery.nodeName(this,"body")){jQuery(this).replaceWith(this.childNodes);}}).end();},append:function(){return this.domManip(arguments,true,function(elem){if(this.nodeType===1||this.nodeType===11||this.nodeType===9){this.appendChild(elem);}});},prepend:function(){return this.domManip(arguments,true,function(elem){if(this.nodeType===1||this.nodeType===11||this.nodeType===9){this.insertBefore(elem,this.firstChild);}});},before:function(){return this.domManip(arguments,false,function(elem){if(this.parentNode){this.parentNode.insertBefore(elem,this);}});},after:function(){return this.domManip(arguments,false,function(elem){if(this.parentNode){this.parentNode.insertBefore(elem,this.nextSibling);}});}, // keepData is for internal use only--do not document
remove:function(selector,keepData){var elem,i=0;for(;(elem=this[i])!=null;i++){if(!selector||jQuery.filter(selector,[elem]).length>0){if(!keepData&&elem.nodeType===1){jQuery.cleanData(getAll(elem));}if(elem.parentNode){if(keepData&&jQuery.contains(elem.ownerDocument,elem)){setGlobalEval(getAll(elem,"script"));}elem.parentNode.removeChild(elem);}}}return this;},empty:function(){var elem,i=0;for(;(elem=this[i])!=null;i++){ // Remove element nodes and prevent memory leaks
if(elem.nodeType===1){jQuery.cleanData(getAll(elem,false));} // Remove any remaining nodes
while(elem.firstChild){elem.removeChild(elem.firstChild);} // If this is a select, ensure that it displays empty (#12336)
// Support: IE<9
if(elem.options&&jQuery.nodeName(elem,"select")){elem.options.length=0;}}return this;},clone:function(dataAndEvents,deepDataAndEvents){dataAndEvents=dataAndEvents==null?false:dataAndEvents;deepDataAndEvents=deepDataAndEvents==null?dataAndEvents:deepDataAndEvents;return this.map(function(){return jQuery.clone(this,dataAndEvents,deepDataAndEvents);});},html:function(value){return jQuery.access(this,function(value){var elem=this[0]||{},i=0,l=this.length;if(value===undefined){return elem.nodeType===1?elem.innerHTML.replace(rinlinejQuery,""):undefined;} // See if we can take a shortcut and just use innerHTML
if(typeof value==="string"&&!rnoInnerhtml.test(value)&&(jQuery.support.htmlSerialize||!rnoshimcache.test(value))&&(jQuery.support.leadingWhitespace||!rleadingWhitespace.test(value))&&!wrapMap[(rtagName.exec(value)||["",""])[1].toLowerCase()]){value=value.replace(rxhtmlTag,"<$1></$2>");try{for(;i<l;i++){ // Remove element nodes and prevent memory leaks
elem=this[i]||{};if(elem.nodeType===1){jQuery.cleanData(getAll(elem,false));elem.innerHTML=value;}}elem=0; // If using innerHTML throws an exception, use the fallback method
}catch(e){}}if(elem){this.empty().append(value);}},null,value,arguments.length);},replaceWith:function(value){var isFunc=jQuery.isFunction(value); // Make sure that the elements are removed from the DOM before they are inserted
// this can help fix replacing a parent with child elements
if(!isFunc&&typeof value!=="string"){value=jQuery(value).not(this).detach();}return this.domManip([value],true,function(elem){var next=this.nextSibling,parent=this.parentNode;if(parent){jQuery(this).remove();parent.insertBefore(elem,next);}});},detach:function(selector){return this.remove(selector,true);},domManip:function(args,table,callback){ // Flatten any nested arrays
args=core_concat.apply([],args);var first,node,hasScripts,scripts,doc,fragment,i=0,l=this.length,set=this,iNoClone=l-1,value=args[0],isFunction=jQuery.isFunction(value); // We can't cloneNode fragments that contain checked, in WebKit
if(isFunction||!(l<=1||typeof value!=="string"||jQuery.support.checkClone||!rchecked.test(value))){return this.each(function(index){var self=set.eq(index);if(isFunction){args[0]=value.call(this,index,table?self.html():undefined);}self.domManip(args,table,callback);});}if(l){fragment=jQuery.buildFragment(args,this[0].ownerDocument,false,this);first=fragment.firstChild;if(fragment.childNodes.length===1){fragment=first;}if(first){table=table&&jQuery.nodeName(first,"tr");scripts=jQuery.map(getAll(fragment,"script"),disableScript);hasScripts=scripts.length; // Use the original fragment for the last item instead of the first because it can end up
// being emptied incorrectly in certain situations (#8070).
for(;i<l;i++){node=fragment;if(i!==iNoClone){node=jQuery.clone(node,true,true); // Keep references to cloned scripts for later restoration
if(hasScripts){jQuery.merge(scripts,getAll(node,"script"));}}callback.call(table&&jQuery.nodeName(this[i],"table")?findOrAppend(this[i],"tbody"):this[i],node,i);}if(hasScripts){doc=scripts[scripts.length-1].ownerDocument; // Reenable scripts
jQuery.map(scripts,restoreScript); // Evaluate executable scripts on first document insertion
for(i=0;i<hasScripts;i++){node=scripts[i];if(rscriptType.test(node.type||"")&&!jQuery._data(node,"globalEval")&&jQuery.contains(doc,node)){if(node.src){ // Hope ajax is available...
jQuery.ajax({url:node.src,type:"GET",dataType:"script",async:false,global:false,"throws":true});}else {jQuery.globalEval((node.text||node.textContent||node.innerHTML||"").replace(rcleanScript,""));}}}} // Fix #11809: Avoid leaking memory
fragment=first=null;}}return this;}});function findOrAppend(elem,tag){return elem.getElementsByTagName(tag)[0]||elem.appendChild(elem.ownerDocument.createElement(tag));} // Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript(elem){var attr=elem.getAttributeNode("type");elem.type=(attr&&attr.specified)+"/"+elem.type;return elem;}function restoreScript(elem){var match=rscriptTypeMasked.exec(elem.type);if(match){elem.type=match[1];}else {elem.removeAttribute("type");}return elem;} // Mark scripts as having already been evaluated
function setGlobalEval(elems,refElements){var elem,i=0;for(;(elem=elems[i])!=null;i++){jQuery._data(elem,"globalEval",!refElements||jQuery._data(refElements[i],"globalEval"));}}function cloneCopyEvent(src,dest){if(dest.nodeType!==1||!jQuery.hasData(src)){return;}var type,i,l,oldData=jQuery._data(src),curData=jQuery._data(dest,oldData),events=oldData.events;if(events){delete curData.handle;curData.events={};for(type in events){for(i=0,l=events[type].length;i<l;i++){jQuery.event.add(dest,type,events[type][i]);}}} // make the cloned public data object a copy from the original
if(curData.data){curData.data=jQuery.extend({},curData.data);}}function fixCloneNodeIssues(src,dest){var nodeName,e,data; // We do not need to do anything for non-Elements
if(dest.nodeType!==1){return;}nodeName=dest.nodeName.toLowerCase(); // IE6-8 copies events bound via attachEvent when using cloneNode.
if(!jQuery.support.noCloneEvent&&dest[jQuery.expando]){data=jQuery._data(dest);for(e in data.events){jQuery.removeEvent(dest,e,data.handle);} // Event data gets referenced instead of copied if the expando gets copied too
dest.removeAttribute(jQuery.expando);} // IE blanks contents when cloning scripts, and tries to evaluate newly-set text
if(nodeName==="script"&&dest.text!==src.text){disableScript(dest).text=src.text;restoreScript(dest); // IE6-10 improperly clones children of object elements using classid.
// IE10 throws NoModificationAllowedError if parent is null, #12132.
}else if(nodeName==="object"){if(dest.parentNode){dest.outerHTML=src.outerHTML;} // This path appears unavoidable for IE9. When cloning an object
// element in IE9, the outerHTML strategy above is not sufficient.
// If the src has innerHTML and the destination does not,
// copy the src.innerHTML into the dest.innerHTML. #10324
if(jQuery.support.html5Clone&&src.innerHTML&&!jQuery.trim(dest.innerHTML)){dest.innerHTML=src.innerHTML;}}else if(nodeName==="input"&&manipulation_rcheckableType.test(src.type)){ // IE6-8 fails to persist the checked state of a cloned checkbox
// or radio button. Worse, IE6-7 fail to give the cloned element
// a checked appearance if the defaultChecked value isn't also set
dest.defaultChecked=dest.checked=src.checked; // IE6-7 get confused and end up setting the value of a cloned
// checkbox/radio button to an empty string instead of "on"
if(dest.value!==src.value){dest.value=src.value;} // IE6-8 fails to return the selected option to the default selected
// state when cloning options
}else if(nodeName==="option"){dest.defaultSelected=dest.selected=src.defaultSelected; // IE6-8 fails to set the defaultValue to the correct value when
// cloning other types of input fields
}else if(nodeName==="input"||nodeName==="textarea"){dest.defaultValue=src.defaultValue;}}jQuery.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(name,original){jQuery.fn[name]=function(selector){var elems,i=0,ret=[],insert=jQuery(selector),last=insert.length-1;for(;i<=last;i++){elems=i===last?this:this.clone(true);jQuery(insert[i])[original](elems); // Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
core_push.apply(ret,elems.get());}return this.pushStack(ret);};});function getAll(context,tag){var elems,elem,i=0,found=typeof context.getElementsByTagName!==core_strundefined?context.getElementsByTagName(tag||"*"):typeof context.querySelectorAll!==core_strundefined?context.querySelectorAll(tag||"*"):undefined;if(!found){for(found=[],elems=context.childNodes||context;(elem=elems[i])!=null;i++){if(!tag||jQuery.nodeName(elem,tag)){found.push(elem);}else {jQuery.merge(found,getAll(elem,tag));}}}return tag===undefined||tag&&jQuery.nodeName(context,tag)?jQuery.merge([context],found):found;} // Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked(elem){if(manipulation_rcheckableType.test(elem.type)){elem.defaultChecked=elem.checked;}}jQuery.extend({clone:function(elem,dataAndEvents,deepDataAndEvents){var destElements,node,clone,i,srcElements,inPage=jQuery.contains(elem.ownerDocument,elem);if(jQuery.support.html5Clone||jQuery.isXMLDoc(elem)||!rnoshimcache.test("<"+elem.nodeName+">")){clone=elem.cloneNode(true); // IE<=8 does not properly clone detached, unknown element nodes
}else {fragmentDiv.innerHTML=elem.outerHTML;fragmentDiv.removeChild(clone=fragmentDiv.firstChild);}if((!jQuery.support.noCloneEvent||!jQuery.support.noCloneChecked)&&(elem.nodeType===1||elem.nodeType===11)&&!jQuery.isXMLDoc(elem)){ // We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
destElements=getAll(clone);srcElements=getAll(elem); // Fix all IE cloning issues
for(i=0;(node=srcElements[i])!=null;++i){ // Ensure that the destination node is not null; Fixes #9587
if(destElements[i]){fixCloneNodeIssues(node,destElements[i]);}}} // Copy the events from the original to the clone
if(dataAndEvents){if(deepDataAndEvents){srcElements=srcElements||getAll(elem);destElements=destElements||getAll(clone);for(i=0;(node=srcElements[i])!=null;i++){cloneCopyEvent(node,destElements[i]);}}else {cloneCopyEvent(elem,clone);}} // Preserve script evaluation history
destElements=getAll(clone,"script");if(destElements.length>0){setGlobalEval(destElements,!inPage&&getAll(elem,"script"));}destElements=srcElements=node=null; // Return the cloned set
return clone;},buildFragment:function(elems,context,scripts,selection){var j,elem,contains,tmp,tag,tbody,wrap,l=elems.length, // Ensure a safe fragment
safe=createSafeFragment(context),nodes=[],i=0;for(;i<l;i++){elem=elems[i];if(elem||elem===0){ // Add nodes directly
if(jQuery.type(elem)==="object"){jQuery.merge(nodes,elem.nodeType?[elem]:elem); // Convert non-html into a text node
}else if(!rhtml.test(elem)){nodes.push(context.createTextNode(elem)); // Convert html into DOM nodes
}else {tmp=tmp||safe.appendChild(context.createElement("div")); // Deserialize a standard representation
tag=(rtagName.exec(elem)||["",""])[1].toLowerCase();wrap=wrapMap[tag]||wrapMap._default;tmp.innerHTML=wrap[1]+elem.replace(rxhtmlTag,"<$1></$2>")+wrap[2]; // Descend through wrappers to the right content
j=wrap[0];while(j--){tmp=tmp.lastChild;} // Manually add leading whitespace removed by IE
if(!jQuery.support.leadingWhitespace&&rleadingWhitespace.test(elem)){nodes.push(context.createTextNode(rleadingWhitespace.exec(elem)[0]));} // Remove IE's autoinserted <tbody> from table fragments
if(!jQuery.support.tbody){ // String was a <table>, *may* have spurious <tbody>
elem=tag==="table"&&!rtbody.test(elem)?tmp.firstChild: // String was a bare <thead> or <tfoot>
wrap[1]==="<table>"&&!rtbody.test(elem)?tmp:0;j=elem&&elem.childNodes.length;while(j--){if(jQuery.nodeName(tbody=elem.childNodes[j],"tbody")&&!tbody.childNodes.length){elem.removeChild(tbody);}}}jQuery.merge(nodes,tmp.childNodes); // Fix #12392 for WebKit and IE > 9
tmp.textContent=""; // Fix #12392 for oldIE
while(tmp.firstChild){tmp.removeChild(tmp.firstChild);} // Remember the top-level container for proper cleanup
tmp=safe.lastChild;}}} // Fix #11356: Clear elements from fragment
if(tmp){safe.removeChild(tmp);} // Reset defaultChecked for any radios and checkboxes
// about to be appended to the DOM in IE 6/7 (#8060)
if(!jQuery.support.appendChecked){jQuery.grep(getAll(nodes,"input"),fixDefaultChecked);}i=0;while(elem=nodes[i++]){ // #4087 - If origin and destination elements are the same, and this is
// that element, do not do anything
if(selection&&jQuery.inArray(elem,selection)!==-1){continue;}contains=jQuery.contains(elem.ownerDocument,elem); // Append to fragment
tmp=getAll(safe.appendChild(elem),"script"); // Preserve script evaluation history
if(contains){setGlobalEval(tmp);} // Capture executables
if(scripts){j=0;while(elem=tmp[j++]){if(rscriptType.test(elem.type||"")){scripts.push(elem);}}}}tmp=null;return safe;},cleanData:function(elems, /* internal */acceptData){var elem,type,id,data,i=0,internalKey=jQuery.expando,cache=jQuery.cache,deleteExpando=jQuery.support.deleteExpando,special=jQuery.event.special;for(;(elem=elems[i])!=null;i++){if(acceptData||jQuery.acceptData(elem)){id=elem[internalKey];data=id&&cache[id];if(data){if(data.events){for(type in data.events){if(special[type]){jQuery.event.remove(elem,type); // This is a shortcut to avoid jQuery.event.remove's overhead
}else {jQuery.removeEvent(elem,type,data.handle);}}} // Remove cache only if it was not already removed by jQuery.event.remove
if(cache[id]){delete cache[id]; // IE does not allow us to delete expando properties from nodes,
// nor does it have a removeAttribute function on Document nodes;
// we must handle all of these cases
if(deleteExpando){delete elem[internalKey];}else if(typeof elem.removeAttribute!==core_strundefined){elem.removeAttribute(internalKey);}else {elem[internalKey]=null;}core_deletedIds.push(id);}}}}}});var iframe,getStyles,curCSS,ralpha=/alpha\([^)]*\)/i,ropacity=/opacity\s*=\s*([^)]*)/,rposition=/^(top|right|bottom|left)$/, // swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
rdisplayswap=/^(none|table(?!-c[ea]).+)/,rmargin=/^margin/,rnumsplit=new RegExp("^("+core_pnum+")(.*)$","i"),rnumnonpx=new RegExp("^("+core_pnum+")(?!px)[a-z%]+$","i"),rrelNum=new RegExp("^([+-])=("+core_pnum+")","i"),elemdisplay={BODY:"block"},cssShow={position:"absolute",visibility:"hidden",display:"block"},cssNormalTransform={letterSpacing:0,fontWeight:400},cssExpand=["Top","Right","Bottom","Left"],cssPrefixes=["Webkit","O","Moz","ms"]; // return a css property mapped to a potentially vendor prefixed property
function vendorPropName(style,name){ // shortcut for names that are not vendor prefixed
if(name in style){return name;} // check for vendor prefixed names
var capName=name.charAt(0).toUpperCase()+name.slice(1),origName=name,i=cssPrefixes.length;while(i--){name=cssPrefixes[i]+capName;if(name in style){return name;}}return origName;}function isHidden(elem,el){ // isHidden might be called from jQuery#filter function;
// in that case, element will be second argument
elem=el||elem;return jQuery.css(elem,"display")==="none"||!jQuery.contains(elem.ownerDocument,elem);}function showHide(elements,show){var display,elem,hidden,values=[],index=0,length=elements.length;for(;index<length;index++){elem=elements[index];if(!elem.style){continue;}values[index]=jQuery._data(elem,"olddisplay");display=elem.style.display;if(show){ // Reset the inline display of this element to learn if it is
// being hidden by cascaded rules or not
if(!values[index]&&display==="none"){elem.style.display="";} // Set elements which have been overridden with display: none
// in a stylesheet to whatever the default browser style is
// for such an element
if(elem.style.display===""&&isHidden(elem)){values[index]=jQuery._data(elem,"olddisplay",css_defaultDisplay(elem.nodeName));}}else {if(!values[index]){hidden=isHidden(elem);if(display&&display!=="none"||!hidden){jQuery._data(elem,"olddisplay",hidden?display:jQuery.css(elem,"display"));}}}} // Set the display of most of the elements in a second loop
// to avoid the constant reflow
for(index=0;index<length;index++){elem=elements[index];if(!elem.style){continue;}if(!show||elem.style.display==="none"||elem.style.display===""){elem.style.display=show?values[index]||"":"none";}}return elements;}jQuery.fn.extend({css:function(name,value){return jQuery.access(this,function(elem,name,value){var len,styles,map={},i=0;if(jQuery.isArray(name)){styles=getStyles(elem);len=name.length;for(;i<len;i++){map[name[i]]=jQuery.css(elem,name[i],false,styles);}return map;}return value!==undefined?jQuery.style(elem,name,value):jQuery.css(elem,name);},name,value,arguments.length>1);},show:function(){return showHide(this,true);},hide:function(){return showHide(this);},toggle:function(state){var bool=typeof state==="boolean";return this.each(function(){if(bool?state:isHidden(this)){jQuery(this).show();}else {jQuery(this).hide();}});}});jQuery.extend({ // Add in style property hooks for overriding the default
// behavior of getting and setting a style property
cssHooks:{opacity:{get:function(elem,computed){if(computed){ // We should always get a number back from opacity
var ret=curCSS(elem,"opacity");return ret===""?"1":ret;}}}}, // Exclude the following css properties to add px
cssNumber:{"columnCount":true,"fillOpacity":true,"fontWeight":true,"lineHeight":true,"opacity":true,"orphans":true,"widows":true,"zIndex":true,"zoom":true}, // Add in properties whose names you wish to fix before
// setting or getting the value
cssProps:{ // normalize float css property
"float":jQuery.support.cssFloat?"cssFloat":"styleFloat"}, // Get and set the style property on a DOM Node
style:function(elem,name,value,extra){ // Don't set styles on text and comment nodes
if(!elem||elem.nodeType===3||elem.nodeType===8||!elem.style){return;} // Make sure that we're working with the right name
var ret,type,hooks,origName=jQuery.camelCase(name),style=elem.style;name=jQuery.cssProps[origName]||(jQuery.cssProps[origName]=vendorPropName(style,origName)); // gets hook for the prefixed version
// followed by the unprefixed version
hooks=jQuery.cssHooks[name]||jQuery.cssHooks[origName]; // Check if we're setting a value
if(value!==undefined){type=typeof value; // convert relative number strings (+= or -=) to relative numbers. #7345
if(type==="string"&&(ret=rrelNum.exec(value))){value=(ret[1]+1)*ret[2]+parseFloat(jQuery.css(elem,name)); // Fixes bug #9237
type="number";} // Make sure that NaN and null values aren't set. See: #7116
if(value==null||type==="number"&&isNaN(value)){return;} // If a number was passed in, add 'px' to the (except for certain CSS properties)
if(type==="number"&&!jQuery.cssNumber[origName]){value+="px";} // Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
// but it would mean to define eight (for every problematic property) identical functions
if(!jQuery.support.clearCloneStyle&&value===""&&name.indexOf("background")===0){style[name]="inherit";} // If a hook was provided, use that value, otherwise just set the specified value
if(!hooks||!("set" in hooks)||(value=hooks.set(elem,value,extra))!==undefined){ // Wrapped to prevent IE from throwing errors when 'invalid' values are provided
// Fixes bug #5509
try{style[name]=value;}catch(e){}}}else { // If a hook was provided get the non-computed value from there
if(hooks&&"get" in hooks&&(ret=hooks.get(elem,false,extra))!==undefined){return ret;} // Otherwise just get the value from the style object
return style[name];}},css:function(elem,name,extra,styles){var num,val,hooks,origName=jQuery.camelCase(name); // Make sure that we're working with the right name
name=jQuery.cssProps[origName]||(jQuery.cssProps[origName]=vendorPropName(elem.style,origName)); // gets hook for the prefixed version
// followed by the unprefixed version
hooks=jQuery.cssHooks[name]||jQuery.cssHooks[origName]; // If a hook was provided get the computed value from there
if(hooks&&"get" in hooks){val=hooks.get(elem,true,extra);} // Otherwise, if a way to get the computed value exists, use that
if(val===undefined){val=curCSS(elem,name,styles);} //convert "normal" to computed value
if(val==="normal"&&name in cssNormalTransform){val=cssNormalTransform[name];} // Return, converting to number if forced or a qualifier was provided and val looks numeric
if(extra===""||extra){num=parseFloat(val);return extra===true||jQuery.isNumeric(num)?num||0:val;}return val;}, // A method for quickly swapping in/out CSS properties to get correct calculations
swap:function(elem,options,callback,args){var ret,name,old={}; // Remember the old values, and insert the new ones
for(name in options){old[name]=elem.style[name];elem.style[name]=options[name];}ret=callback.apply(elem,args||[]); // Revert the old values
for(name in options){elem.style[name]=old[name];}return ret;}}); // NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if(window.getComputedStyle){getStyles=function(elem){return window.getComputedStyle(elem,null);};curCSS=function(elem,name,_computed){var width,minWidth,maxWidth,computed=_computed||getStyles(elem), // getPropertyValue is only needed for .css('filter') in IE9, see #12537
ret=computed?computed.getPropertyValue(name)||computed[name]:undefined,style=elem.style;if(computed){if(ret===""&&!jQuery.contains(elem.ownerDocument,elem)){ret=jQuery.style(elem,name);} // A tribute to the "awesome hack by Dean Edwards"
// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
if(rnumnonpx.test(ret)&&rmargin.test(name)){ // Remember the original values
width=style.width;minWidth=style.minWidth;maxWidth=style.maxWidth; // Put in the new values to get a computed value out
style.minWidth=style.maxWidth=style.width=ret;ret=computed.width; // Revert the changed values
style.width=width;style.minWidth=minWidth;style.maxWidth=maxWidth;}}return ret;};}else if(document.documentElement.currentStyle){getStyles=function(elem){return elem.currentStyle;};curCSS=function(elem,name,_computed){var left,rs,rsLeft,computed=_computed||getStyles(elem),ret=computed?computed[name]:undefined,style=elem.style; // Avoid setting ret to empty string here
// so we don't default to auto
if(ret==null&&style&&style[name]){ret=style[name];} // From the awesome hack by Dean Edwards
// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
// If we're not dealing with a regular pixel number
// but a number that has a weird ending, we need to convert it to pixels
// but not position css attributes, as those are proportional to the parent element instead
// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
if(rnumnonpx.test(ret)&&!rposition.test(name)){ // Remember the original values
left=style.left;rs=elem.runtimeStyle;rsLeft=rs&&rs.left; // Put in the new values to get a computed value out
if(rsLeft){rs.left=elem.currentStyle.left;}style.left=name==="fontSize"?"1em":ret;ret=style.pixelLeft+"px"; // Revert the changed values
style.left=left;if(rsLeft){rs.left=rsLeft;}}return ret===""?"auto":ret;};}function setPositiveNumber(elem,value,subtract){var matches=rnumsplit.exec(value);return matches? // Guard against undefined "subtract", e.g., when used as in cssHooks
Math.max(0,matches[1]-(subtract||0))+(matches[2]||"px"):value;}function augmentWidthOrHeight(elem,name,extra,isBorderBox,styles){var i=extra===(isBorderBox?"border":"content")? // If we already have the right measurement, avoid augmentation
4: // Otherwise initialize for horizontal or vertical properties
name==="width"?1:0,val=0;for(;i<4;i+=2){ // both box models exclude margin, so add it if we want it
if(extra==="margin"){val+=jQuery.css(elem,extra+cssExpand[i],true,styles);}if(isBorderBox){ // border-box includes padding, so remove it if we want content
if(extra==="content"){val-=jQuery.css(elem,"padding"+cssExpand[i],true,styles);} // at this point, extra isn't border nor margin, so remove border
if(extra!=="margin"){val-=jQuery.css(elem,"border"+cssExpand[i]+"Width",true,styles);}}else { // at this point, extra isn't content, so add padding
val+=jQuery.css(elem,"padding"+cssExpand[i],true,styles); // at this point, extra isn't content nor padding, so add border
if(extra!=="padding"){val+=jQuery.css(elem,"border"+cssExpand[i]+"Width",true,styles);}}}return val;}function getWidthOrHeight(elem,name,extra){ // Start with offset property, which is equivalent to the border-box value
var valueIsBorderBox=true,val=name==="width"?elem.offsetWidth:elem.offsetHeight,styles=getStyles(elem),isBorderBox=jQuery.support.boxSizing&&jQuery.css(elem,"boxSizing",false,styles)==="border-box"; // some non-html elements return undefined for offsetWidth, so check for null/undefined
// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
if(val<=0||val==null){ // Fall back to computed then uncomputed css if necessary
val=curCSS(elem,name,styles);if(val<0||val==null){val=elem.style[name];} // Computed unit is not pixels. Stop here and return.
if(rnumnonpx.test(val)){return val;} // we need the check for style in case a browser which returns unreliable values
// for getComputedStyle silently falls back to the reliable elem.style
valueIsBorderBox=isBorderBox&&(jQuery.support.boxSizingReliable||val===elem.style[name]); // Normalize "", auto, and prepare for extra
val=parseFloat(val)||0;} // use the active box-sizing model to add/subtract irrelevant styles
return val+augmentWidthOrHeight(elem,name,extra||(isBorderBox?"border":"content"),valueIsBorderBox,styles)+"px";} // Try to determine the default display value of an element
function css_defaultDisplay(nodeName){var doc=document,display=elemdisplay[nodeName];if(!display){display=actualDisplay(nodeName,doc); // If the simple way fails, read from inside an iframe
if(display==="none"||!display){ // Use the already-created iframe if possible
iframe=(iframe||jQuery("<iframe frameborder='0' width='0' height='0'/>").css("cssText","display:block !important")).appendTo(doc.documentElement); // Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
doc=(iframe[0].contentWindow||iframe[0].contentDocument).document;doc.write("<!doctype html><html><body>");doc.close();display=actualDisplay(nodeName,doc);iframe.detach();} // Store the correct default display
elemdisplay[nodeName]=display;}return display;} // Called ONLY from within css_defaultDisplay
function actualDisplay(name,doc){var elem=jQuery(doc.createElement(name)).appendTo(doc.body),display=jQuery.css(elem[0],"display");elem.remove();return display;}jQuery.each(["height","width"],function(i,name){jQuery.cssHooks[name]={get:function(elem,computed,extra){if(computed){ // certain elements can have dimension info if we invisibly show them
// however, it must have a current display style that would benefit from this
return elem.offsetWidth===0&&rdisplayswap.test(jQuery.css(elem,"display"))?jQuery.swap(elem,cssShow,function(){return getWidthOrHeight(elem,name,extra);}):getWidthOrHeight(elem,name,extra);}},set:function(elem,value,extra){var styles=extra&&getStyles(elem);return setPositiveNumber(elem,value,extra?augmentWidthOrHeight(elem,name,extra,jQuery.support.boxSizing&&jQuery.css(elem,"boxSizing",false,styles)==="border-box",styles):0);}};});if(!jQuery.support.opacity){jQuery.cssHooks.opacity={get:function(elem,computed){ // IE uses filters for opacity
return ropacity.test((computed&&elem.currentStyle?elem.currentStyle.filter:elem.style.filter)||"")?0.01*parseFloat(RegExp.$1)+"":computed?"1":"";},set:function(elem,value){var style=elem.style,currentStyle=elem.currentStyle,opacity=jQuery.isNumeric(value)?"alpha(opacity="+value*100+")":"",filter=currentStyle&&currentStyle.filter||style.filter||""; // IE has trouble with opacity if it does not have layout
// Force it by setting the zoom level
style.zoom=1; // if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
// if value === "", then remove inline opacity #12685
if((value>=1||value==="")&&jQuery.trim(filter.replace(ralpha,""))===""&&style.removeAttribute){ // Setting style.filter to null, "" & " " still leave "filter:" in the cssText
// if "filter:" is present at all, clearType is disabled, we want to avoid this
// style.removeAttribute is IE Only, but so apparently is this code path...
style.removeAttribute("filter"); // if there is no filter style applied in a css rule or unset inline opacity, we are done
if(value===""||currentStyle&&!currentStyle.filter){return;}} // otherwise, set new filter values
style.filter=ralpha.test(filter)?filter.replace(ralpha,opacity):filter+" "+opacity;}};} // These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function(){if(!jQuery.support.reliableMarginRight){jQuery.cssHooks.marginRight={get:function(elem,computed){if(computed){ // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
// Work around by temporarily setting element display to inline-block
return jQuery.swap(elem,{"display":"inline-block"},curCSS,[elem,"marginRight"]);}}};} // Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// getComputedStyle returns percent when specified for top/left/bottom/right
// rather than make the css module depend on the offset module, we just check for it here
if(!jQuery.support.pixelPosition&&jQuery.fn.position){jQuery.each(["top","left"],function(i,prop){jQuery.cssHooks[prop]={get:function(elem,computed){if(computed){computed=curCSS(elem,prop); // if curCSS returns percentage, fallback to offset
return rnumnonpx.test(computed)?jQuery(elem).position()[prop]+"px":computed;}}};});}});if(jQuery.expr&&jQuery.expr.filters){jQuery.expr.filters.hidden=function(elem){ // Support: Opera <= 12.12
// Opera reports offsetWidths and offsetHeights less than zero on some elements
return elem.offsetWidth<=0&&elem.offsetHeight<=0||!jQuery.support.reliableHiddenOffsets&&(elem.style&&elem.style.display||jQuery.css(elem,"display"))==="none";};jQuery.expr.filters.visible=function(elem){return !jQuery.expr.filters.hidden(elem);};} // These hooks are used by animate to expand properties
jQuery.each({margin:"",padding:"",border:"Width"},function(prefix,suffix){jQuery.cssHooks[prefix+suffix]={expand:function(value){var i=0,expanded={}, // assumes a single number if not a string
parts=typeof value==="string"?value.split(" "):[value];for(;i<4;i++){expanded[prefix+cssExpand[i]+suffix]=parts[i]||parts[i-2]||parts[0];}return expanded;}};if(!rmargin.test(prefix)){jQuery.cssHooks[prefix+suffix].set=setPositiveNumber;}});var r20=/%20/g,rbracket=/\[\]$/,rCRLF=/\r?\n/g,rsubmitterTypes=/^(?:submit|button|image|reset|file)$/i,rsubmittable=/^(?:input|select|textarea|keygen)/i;jQuery.fn.extend({serialize:function(){return jQuery.param(this.serializeArray());},serializeArray:function(){return this.map(function(){ // Can add propHook for "elements" to filter or add form elements
var elements=jQuery.prop(this,"elements");return elements?jQuery.makeArray(elements):this;}).filter(function(){var type=this.type; // Use .is(":disabled") so that fieldset[disabled] works
return this.name&&!jQuery(this).is(":disabled")&&rsubmittable.test(this.nodeName)&&!rsubmitterTypes.test(type)&&(this.checked||!manipulation_rcheckableType.test(type));}).map(function(i,elem){var val=jQuery(this).val();return val==null?null:jQuery.isArray(val)?jQuery.map(val,function(val){return {name:elem.name,value:val.replace(rCRLF,"\r\n")};}):{name:elem.name,value:val.replace(rCRLF,"\r\n")};}).get();}}); //Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param=function(a,traditional){var prefix,s=[],add=function(key,value){ // If value is a function, invoke it and return its value
value=jQuery.isFunction(value)?value():value==null?"":value;s[s.length]=encodeURIComponent(key)+"="+encodeURIComponent(value);}; // Set traditional to true for jQuery <= 1.3.2 behavior.
if(traditional===undefined){traditional=jQuery.ajaxSettings&&jQuery.ajaxSettings.traditional;} // If an array was passed in, assume that it is an array of form elements.
if(jQuery.isArray(a)||a.jquery&&!jQuery.isPlainObject(a)){ // Serialize the form elements
jQuery.each(a,function(){add(this.name,this.value);});}else { // If traditional, encode the "old" way (the way 1.3.2 or older
// did it), otherwise encode params recursively.
for(prefix in a){buildParams(prefix,a[prefix],traditional,add);}} // Return the resulting serialization
return s.join("&").replace(r20,"+");};function buildParams(prefix,obj,traditional,add){var name;if(jQuery.isArray(obj)){ // Serialize array item.
jQuery.each(obj,function(i,v){if(traditional||rbracket.test(prefix)){ // Treat each array item as a scalar.
add(prefix,v);}else { // Item is non-scalar (array or object), encode its numeric index.
buildParams(prefix+"["+(typeof v==="object"?i:"")+"]",v,traditional,add);}});}else if(!traditional&&jQuery.type(obj)==="object"){ // Serialize object item.
for(name in obj){buildParams(prefix+"["+name+"]",obj[name],traditional,add);}}else { // Serialize scalar item.
add(prefix,obj);}}jQuery.each(("blur focus focusin focusout load resize scroll unload click dblclick "+"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave "+"change select submit keydown keypress keyup error contextmenu").split(" "),function(i,name){ // Handle event binding
jQuery.fn[name]=function(data,fn){return arguments.length>0?this.on(name,null,data,fn):this.trigger(name);};});jQuery.fn.hover=function(fnOver,fnOut){return this.mouseenter(fnOver).mouseleave(fnOut||fnOver);};var  // Document location
ajaxLocParts,ajaxLocation,ajax_nonce=jQuery.now(),ajax_rquery=/\?/,rhash=/#.*$/,rts=/([?&])_=[^&]*/,rheaders=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
// #7653, #8125, #8152: local protocol detection
rlocalProtocol=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,rnoContent=/^(?:GET|HEAD)$/,rprotocol=/^\/\//,rurl=/^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/, // Keep a copy of the old load method
_load=jQuery.fn.load, /* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */prefilters={}, /* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */transports={}, // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
allTypes="*/".concat("*"); // #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try{ajaxLocation=location.href;}catch(e){ // Use the href attribute of an A element
// since IE will modify it given document.location
ajaxLocation=document.createElement("a");ajaxLocation.href="";ajaxLocation=ajaxLocation.href;} // Segment location into parts
ajaxLocParts=rurl.exec(ajaxLocation.toLowerCase())||[]; // Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports(structure){ // dataTypeExpression is optional and defaults to "*"
return function(dataTypeExpression,func){if(typeof dataTypeExpression!=="string"){func=dataTypeExpression;dataTypeExpression="*";}var dataType,i=0,dataTypes=dataTypeExpression.toLowerCase().match(core_rnotwhite)||[];if(jQuery.isFunction(func)){ // For each dataType in the dataTypeExpression
while(dataType=dataTypes[i++]){ // Prepend if requested
if(dataType[0]==="+"){dataType=dataType.slice(1)||"*";(structure[dataType]=structure[dataType]||[]).unshift(func); // Otherwise append
}else {(structure[dataType]=structure[dataType]||[]).push(func);}}}};} // Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports(structure,options,originalOptions,jqXHR){var inspected={},seekingTransport=structure===transports;function inspect(dataType){var selected;inspected[dataType]=true;jQuery.each(structure[dataType]||[],function(_,prefilterOrFactory){var dataTypeOrTransport=prefilterOrFactory(options,originalOptions,jqXHR);if(typeof dataTypeOrTransport==="string"&&!seekingTransport&&!inspected[dataTypeOrTransport]){options.dataTypes.unshift(dataTypeOrTransport);inspect(dataTypeOrTransport);return false;}else if(seekingTransport){return !(selected=dataTypeOrTransport);}});return selected;}return inspect(options.dataTypes[0])||!inspected["*"]&&inspect("*");} // A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend(target,src){var deep,key,flatOptions=jQuery.ajaxSettings.flatOptions||{};for(key in src){if(src[key]!==undefined){(flatOptions[key]?target:deep||(deep={}))[key]=src[key];}}if(deep){jQuery.extend(true,target,deep);}return target;}jQuery.fn.load=function(url,params,callback){if(typeof url!=="string"&&_load){return _load.apply(this,arguments);}var selector,response,type,self=this,off=url.indexOf(" ");if(off>=0){selector=url.slice(off,url.length);url=url.slice(0,off);} // If it's a function
if(jQuery.isFunction(params)){ // We assume that it's the callback
callback=params;params=undefined; // Otherwise, build a param string
}else if(params&&typeof params==="object"){type="POST";} // If we have elements to modify, make the request
if(self.length>0){jQuery.ajax({url:url, // if "type" variable is undefined, then "GET" method will be used
type:type,dataType:"html",data:params}).done(function(responseText){ // Save response for use in complete callback
response=arguments;self.html(selector? // If a selector was specified, locate the right elements in a dummy div
// Exclude scripts to avoid IE 'Permission Denied' errors
jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector): // Otherwise use the full result
responseText);}).complete(callback&&function(jqXHR,status){self.each(callback,response||[jqXHR.responseText,status,jqXHR]);});}return this;}; // Attach a bunch of functions for handling common AJAX events
jQuery.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(i,type){jQuery.fn[type]=function(fn){return this.on(type,fn);};});jQuery.each(["get","post"],function(i,method){jQuery[method]=function(url,data,callback,type){ // shift arguments if data argument was omitted
if(jQuery.isFunction(data)){type=type||callback;callback=data;data=undefined;}return jQuery.ajax({url:url,type:method,dataType:type,data:data,success:callback});};});jQuery.extend({ // Counter for holding the number of active queries
active:0, // Last-Modified header cache for next request
lastModified:{},etag:{},ajaxSettings:{url:ajaxLocation,type:"GET",isLocal:rlocalProtocol.test(ajaxLocParts[1]),global:true,processData:true,async:true,contentType:"application/x-www-form-urlencoded; charset=UTF-8", /*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/accepts:{"*":allTypes,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"}, // Data converters
// Keys separate source (or catchall "*") and destination types with a single space
converters:{ // Convert anything to text
"* text":window.String, // Text to html (true = no transformation)
"text html":true, // Evaluate text as a json expression
"text json":jQuery.parseJSON, // Parse text as xml
"text xml":jQuery.parseXML}, // For options that shouldn't be deep extended:
// you can add your own custom options here if
// and when you create one that shouldn't be
// deep extended (see ajaxExtend)
flatOptions:{url:true,context:true}}, // Creates a full fledged settings object into target
// with both ajaxSettings and settings fields.
// If target is omitted, writes into ajaxSettings.
ajaxSetup:function(target,settings){return settings? // Building a settings object
ajaxExtend(ajaxExtend(target,jQuery.ajaxSettings),settings): // Extending ajaxSettings
ajaxExtend(jQuery.ajaxSettings,target);},ajaxPrefilter:addToPrefiltersOrTransports(prefilters),ajaxTransport:addToPrefiltersOrTransports(transports), // Main method
ajax:function(url,options){ // If url is an object, simulate pre-1.5 signature
if(typeof url==="object"){options=url;url=undefined;} // Force options to be an object
options=options||{};var  // Cross-domain detection vars
parts, // Loop variable
i, // URL without anti-cache param
cacheURL, // Response headers as string
responseHeadersString, // timeout handle
timeoutTimer, // To know if global events are to be dispatched
fireGlobals,transport, // Response headers
responseHeaders, // Create the final options object
s=jQuery.ajaxSetup({},options), // Callbacks context
callbackContext=s.context||s, // Context for global events is callbackContext if it is a DOM node or jQuery collection
globalEventContext=s.context&&(callbackContext.nodeType||callbackContext.jquery)?jQuery(callbackContext):jQuery.event, // Deferreds
deferred=jQuery.Deferred(),completeDeferred=jQuery.Callbacks("once memory"), // Status-dependent callbacks
statusCode=s.statusCode||{}, // Headers (they are sent all at once)
requestHeaders={},requestHeadersNames={}, // The jqXHR state
state=0, // Default abort message
strAbort="canceled", // Fake xhr
jqXHR={readyState:0, // Builds headers hashtable if needed
getResponseHeader:function(key){var match;if(state===2){if(!responseHeaders){responseHeaders={};while(match=rheaders.exec(responseHeadersString)){responseHeaders[match[1].toLowerCase()]=match[2];}}match=responseHeaders[key.toLowerCase()];}return match==null?null:match;}, // Raw string
getAllResponseHeaders:function(){return state===2?responseHeadersString:null;}, // Caches the header
setRequestHeader:function(name,value){var lname=name.toLowerCase();if(!state){name=requestHeadersNames[lname]=requestHeadersNames[lname]||name;requestHeaders[name]=value;}return this;}, // Overrides response content-type header
overrideMimeType:function(type){if(!state){s.mimeType=type;}return this;}, // Status-dependent callbacks
statusCode:function(map){var code;if(map){if(state<2){for(code in map){ // Lazy-add the new callback in a way that preserves old ones
statusCode[code]=[statusCode[code],map[code]];}}else { // Execute the appropriate callbacks
jqXHR.always(map[jqXHR.status]);}}return this;}, // Cancel the request
abort:function(statusText){var finalText=statusText||strAbort;if(transport){transport.abort(finalText);}done(0,finalText);return this;}}; // Attach deferreds
deferred.promise(jqXHR).complete=completeDeferred.add;jqXHR.success=jqXHR.done;jqXHR.error=jqXHR.fail; // Remove hash character (#7531: and string promotion)
// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
// Handle falsy url in the settings object (#10093: consistency with old signature)
// We also use the url parameter if available
s.url=((url||s.url||ajaxLocation)+"").replace(rhash,"").replace(rprotocol,ajaxLocParts[1]+"//"); // Alias method option to type as per ticket #12004
s.type=options.method||options.type||s.method||s.type; // Extract dataTypes list
s.dataTypes=jQuery.trim(s.dataType||"*").toLowerCase().match(core_rnotwhite)||[""]; // A cross-domain request is in order when we have a protocol:host:port mismatch
if(s.crossDomain==null){parts=rurl.exec(s.url.toLowerCase());s.crossDomain=!!(parts&&(parts[1]!==ajaxLocParts[1]||parts[2]!==ajaxLocParts[2]||(parts[3]||(parts[1]==="http:"?80:443))!=(ajaxLocParts[3]||(ajaxLocParts[1]==="http:"?80:443))));} // Convert data if not already a string
if(s.data&&s.processData&&typeof s.data!=="string"){s.data=jQuery.param(s.data,s.traditional);} // Apply prefilters
inspectPrefiltersOrTransports(prefilters,s,options,jqXHR); // If request was aborted inside a prefilter, stop there
if(state===2){return jqXHR;} // We can fire global events as of now if asked to
fireGlobals=s.global; // Watch for a new set of requests
if(fireGlobals&&jQuery.active++===0){jQuery.event.trigger("ajaxStart");} // Uppercase the type
s.type=s.type.toUpperCase(); // Determine if request has content
s.hasContent=!rnoContent.test(s.type); // Save the URL in case we're toying with the If-Modified-Since
// and/or If-None-Match header later on
cacheURL=s.url; // More options handling for requests with no content
if(!s.hasContent){ // If data is available, append data to url
if(s.data){cacheURL=s.url+=(ajax_rquery.test(cacheURL)?"&":"?")+s.data; // #9682: remove data so that it's not used in an eventual retry
delete s.data;} // Add anti-cache in url if needed
if(s.cache===false){s.url=rts.test(cacheURL)? // If there is already a '_' parameter, set its value
cacheURL.replace(rts,"$1_="+ajax_nonce++): // Otherwise add one to the end
cacheURL+(ajax_rquery.test(cacheURL)?"&":"?")+"_="+ajax_nonce++;}} // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
if(s.ifModified){if(jQuery.lastModified[cacheURL]){jqXHR.setRequestHeader("If-Modified-Since",jQuery.lastModified[cacheURL]);}if(jQuery.etag[cacheURL]){jqXHR.setRequestHeader("If-None-Match",jQuery.etag[cacheURL]);}} // Set the correct header, if data is being sent
if(s.data&&s.hasContent&&s.contentType!==false||options.contentType){jqXHR.setRequestHeader("Content-Type",s.contentType);} // Set the Accepts header for the server, depending on the dataType
jqXHR.setRequestHeader("Accept",s.dataTypes[0]&&s.accepts[s.dataTypes[0]]?s.accepts[s.dataTypes[0]]+(s.dataTypes[0]!=="*"?", "+allTypes+"; q=0.01":""):s.accepts["*"]); // Check for headers option
for(i in s.headers){jqXHR.setRequestHeader(i,s.headers[i]);} // Allow custom headers/mimetypes and early abort
if(s.beforeSend&&(s.beforeSend.call(callbackContext,jqXHR,s)===false||state===2)){ // Abort if not done already and return
return jqXHR.abort();} // aborting is no longer a cancellation
strAbort="abort"; // Install callbacks on deferreds
for(i in {success:1,error:1,complete:1}){jqXHR[i](s[i]);} // Get transport
transport=inspectPrefiltersOrTransports(transports,s,options,jqXHR); // If no transport, we auto-abort
if(!transport){done(-1,"No Transport");}else {jqXHR.readyState=1; // Send global event
if(fireGlobals){globalEventContext.trigger("ajaxSend",[jqXHR,s]);} // Timeout
if(s.async&&s.timeout>0){timeoutTimer=setTimeout(function(){jqXHR.abort("timeout");},s.timeout);}try{state=1;transport.send(requestHeaders,done);}catch(e){ // Propagate exception as error if not done
if(state<2){done(-1,e); // Simply rethrow otherwise
}else {throw e;}}} // Callback for when everything is done
function done(status,nativeStatusText,responses,headers){var isSuccess,success,error,response,modified,statusText=nativeStatusText; // Called once
if(state===2){return;} // State is "done" now
state=2; // Clear timeout if it exists
if(timeoutTimer){clearTimeout(timeoutTimer);} // Dereference transport for early garbage collection
// (no matter how long the jqXHR object will be used)
transport=undefined; // Cache response headers
responseHeadersString=headers||""; // Set readyState
jqXHR.readyState=status>0?4:0; // Get response data
if(responses){response=ajaxHandleResponses(s,jqXHR,responses);} // If successful, handle type chaining
if(status>=200&&status<300||status===304){ // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
if(s.ifModified){modified=jqXHR.getResponseHeader("Last-Modified");if(modified){jQuery.lastModified[cacheURL]=modified;}modified=jqXHR.getResponseHeader("etag");if(modified){jQuery.etag[cacheURL]=modified;}} // if no content
if(status===204){isSuccess=true;statusText="nocontent"; // if not modified
}else if(status===304){isSuccess=true;statusText="notmodified"; // If we have data, let's convert it
}else {isSuccess=ajaxConvert(s,response);statusText=isSuccess.state;success=isSuccess.data;error=isSuccess.error;isSuccess=!error;}}else { // We extract error from statusText
// then normalize statusText and status for non-aborts
error=statusText;if(status||!statusText){statusText="error";if(status<0){status=0;}}} // Set data for the fake xhr object
jqXHR.status=status;jqXHR.statusText=(nativeStatusText||statusText)+""; // Success/Error
if(isSuccess){deferred.resolveWith(callbackContext,[success,statusText,jqXHR]);}else {deferred.rejectWith(callbackContext,[jqXHR,statusText,error]);} // Status-dependent callbacks
jqXHR.statusCode(statusCode);statusCode=undefined;if(fireGlobals){globalEventContext.trigger(isSuccess?"ajaxSuccess":"ajaxError",[jqXHR,s,isSuccess?success:error]);} // Complete
completeDeferred.fireWith(callbackContext,[jqXHR,statusText]);if(fireGlobals){globalEventContext.trigger("ajaxComplete",[jqXHR,s]); // Handle the global AJAX counter
if(! --jQuery.active){jQuery.event.trigger("ajaxStop");}}}return jqXHR;},getScript:function(url,callback){return jQuery.get(url,undefined,callback,"script");},getJSON:function(url,data,callback){return jQuery.get(url,data,callback,"json");}}); /* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */function ajaxHandleResponses(s,jqXHR,responses){var firstDataType,ct,finalDataType,type,contents=s.contents,dataTypes=s.dataTypes,responseFields=s.responseFields; // Fill responseXXX fields
for(type in responseFields){if(type in responses){jqXHR[responseFields[type]]=responses[type];}} // Remove auto dataType and get content-type in the process
while(dataTypes[0]==="*"){dataTypes.shift();if(ct===undefined){ct=s.mimeType||jqXHR.getResponseHeader("Content-Type");}} // Check if we're dealing with a known content-type
if(ct){for(type in contents){if(contents[type]&&contents[type].test(ct)){dataTypes.unshift(type);break;}}} // Check to see if we have a response for the expected dataType
if(dataTypes[0] in responses){finalDataType=dataTypes[0];}else { // Try convertible dataTypes
for(type in responses){if(!dataTypes[0]||s.converters[type+" "+dataTypes[0]]){finalDataType=type;break;}if(!firstDataType){firstDataType=type;}} // Or just use first one
finalDataType=finalDataType||firstDataType;} // If we found a dataType
// We add the dataType to the list if needed
// and return the corresponding response
if(finalDataType){if(finalDataType!==dataTypes[0]){dataTypes.unshift(finalDataType);}return responses[finalDataType];}} // Chain conversions given the request and the original response
function ajaxConvert(s,response){var conv2,current,conv,tmp,converters={},i=0, // Work with a copy of dataTypes in case we need to modify it for conversion
dataTypes=s.dataTypes.slice(),prev=dataTypes[0]; // Apply the dataFilter if provided
if(s.dataFilter){response=s.dataFilter(response,s.dataType);} // Create converters map with lowercased keys
if(dataTypes[1]){for(conv in s.converters){converters[conv.toLowerCase()]=s.converters[conv];}} // Convert to each sequential dataType, tolerating list modification
for(;current=dataTypes[++i];){ // There's only work to do if current dataType is non-auto
if(current!=="*"){ // Convert response if prev dataType is non-auto and differs from current
if(prev!=="*"&&prev!==current){ // Seek a direct converter
conv=converters[prev+" "+current]||converters["* "+current]; // If none found, seek a pair
if(!conv){for(conv2 in converters){ // If conv2 outputs current
tmp=conv2.split(" ");if(tmp[1]===current){ // If prev can be converted to accepted input
conv=converters[prev+" "+tmp[0]]||converters["* "+tmp[0]];if(conv){ // Condense equivalence converters
if(conv===true){conv=converters[conv2]; // Otherwise, insert the intermediate dataType
}else if(converters[conv2]!==true){current=tmp[0];dataTypes.splice(i--,0,current);}break;}}}} // Apply converter (if not an equivalence)
if(conv!==true){ // Unless errors are allowed to bubble, catch and return them
if(conv&&s["throws"]){response=conv(response);}else {try{response=conv(response);}catch(e){return {state:"parsererror",error:conv?e:"No conversion from "+prev+" to "+current};}}}} // Update prev for next iteration
prev=current;}}return {state:"success",data:response};} // Install script dataType
jQuery.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(text){jQuery.globalEval(text);return text;}}}); // Handle cache's special case and global
jQuery.ajaxPrefilter("script",function(s){if(s.cache===undefined){s.cache=false;}if(s.crossDomain){s.type="GET";s.global=false;}}); // Bind script tag hack transport
jQuery.ajaxTransport("script",function(s){ // This transport only deals with cross domain requests
if(s.crossDomain){var script,head=document.head||jQuery("head")[0]||document.documentElement;return {send:function(_,callback){script=document.createElement("script");script.async=true;if(s.scriptCharset){script.charset=s.scriptCharset;}script.src=s.url; // Attach handlers for all browsers
script.onload=script.onreadystatechange=function(_,isAbort){if(isAbort||!script.readyState||/loaded|complete/.test(script.readyState)){ // Handle memory leak in IE
script.onload=script.onreadystatechange=null; // Remove the script
if(script.parentNode){script.parentNode.removeChild(script);} // Dereference the script
script=null; // Callback if not abort
if(!isAbort){callback(200,"success");}}}; // Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
// Use native DOM manipulation to avoid our domManip AJAX trickery
head.insertBefore(script,head.firstChild);},abort:function(){if(script){script.onload(undefined,true);}}};}});var oldCallbacks=[],rjsonp=/(=)\?(?=&|$)|\?\?/; // Default jsonp settings
jQuery.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var callback=oldCallbacks.pop()||jQuery.expando+"_"+ajax_nonce++;this[callback]=true;return callback;}}); // Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter("json jsonp",function(s,originalSettings,jqXHR){var callbackName,overwritten,responseContainer,jsonProp=s.jsonp!==false&&(rjsonp.test(s.url)?"url":typeof s.data==="string"&&!(s.contentType||"").indexOf("application/x-www-form-urlencoded")&&rjsonp.test(s.data)&&"data"); // Handle iff the expected data type is "jsonp" or we have a parameter to set
if(jsonProp||s.dataTypes[0]==="jsonp"){ // Get callback name, remembering preexisting value associated with it
callbackName=s.jsonpCallback=jQuery.isFunction(s.jsonpCallback)?s.jsonpCallback():s.jsonpCallback; // Insert callback into url or form data
if(jsonProp){s[jsonProp]=s[jsonProp].replace(rjsonp,"$1"+callbackName);}else if(s.jsonp!==false){s.url+=(ajax_rquery.test(s.url)?"&":"?")+s.jsonp+"="+callbackName;} // Use data converter to retrieve json after script execution
s.converters["script json"]=function(){if(!responseContainer){jQuery.error(callbackName+" was not called");}return responseContainer[0];}; // force json dataType
s.dataTypes[0]="json"; // Install callback
overwritten=window[callbackName];window[callbackName]=function(){responseContainer=arguments;}; // Clean-up function (fires after converters)
jqXHR.always(function(){ // Restore preexisting value
window[callbackName]=overwritten; // Save back as free
if(s[callbackName]){ // make sure that re-using the options doesn't screw things around
s.jsonpCallback=originalSettings.jsonpCallback; // save the callback name for future use
oldCallbacks.push(callbackName);} // Call if it was a function and we have a response
if(responseContainer&&jQuery.isFunction(overwritten)){overwritten(responseContainer[0]);}responseContainer=overwritten=undefined;}); // Delegate to script
return "script";}});var xhrCallbacks,xhrSupported,xhrId=0, // #5280: Internet Explorer will keep connections alive if we don't abort on unload
xhrOnUnloadAbort=window.ActiveXObject&&function(){ // Abort all pending requests
var key;for(key in xhrCallbacks){xhrCallbacks[key](undefined,true);}}; // Functions to create xhrs
function createStandardXHR(){try{return new window.XMLHttpRequest();}catch(e){}}function createActiveXHR(){try{return new window.ActiveXObject("Microsoft.XMLHTTP");}catch(e){}} // Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr=window.ActiveXObject? /* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */function(){return !this.isLocal&&createStandardXHR()||createActiveXHR();}: // For all other browsers, use the standard XMLHttpRequest object
createStandardXHR; // Determine support properties
xhrSupported=jQuery.ajaxSettings.xhr();jQuery.support.cors=!!xhrSupported&&"withCredentials" in xhrSupported;xhrSupported=jQuery.support.ajax=!!xhrSupported; // Create transport if the browser can provide an xhr
if(xhrSupported){jQuery.ajaxTransport(function(s){ // Cross domain only allowed if supported through XMLHttpRequest
if(!s.crossDomain||jQuery.support.cors){var callback;return {send:function(headers,complete){ // Get a new xhr
var handle,i,xhr=s.xhr(); // Open the socket
// Passing null username, generates a login popup on Opera (#2865)
if(s.username){xhr.open(s.type,s.url,s.async,s.username,s.password);}else {xhr.open(s.type,s.url,s.async);} // Apply custom fields if provided
if(s.xhrFields){for(i in s.xhrFields){xhr[i]=s.xhrFields[i];}} // Override mime type if needed
if(s.mimeType&&xhr.overrideMimeType){xhr.overrideMimeType(s.mimeType);} // X-Requested-With header
// For cross-domain requests, seeing as conditions for a preflight are
// akin to a jigsaw puzzle, we simply never set it to be sure.
// (it can always be set on a per-request basis or even using ajaxSetup)
// For same-domain requests, won't change header if already provided.
if(!s.crossDomain&&!headers["X-Requested-With"]){headers["X-Requested-With"]="XMLHttpRequest";} // Need an extra try/catch for cross domain requests in Firefox 3
try{for(i in headers){xhr.setRequestHeader(i,headers[i]);}}catch(err){} // Do send the request
// This may raise an exception which is actually
// handled in jQuery.ajax (so no try/catch here)
xhr.send(s.hasContent&&s.data||null); // Listener
callback=function(_,isAbort){var status,responseHeaders,statusText,responses; // Firefox throws exceptions when accessing properties
// of an xhr when a network error occurred
// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
try{ // Was never called and is aborted or complete
if(callback&&(isAbort||xhr.readyState===4)){ // Only called once
callback=undefined; // Do not keep as active anymore
if(handle){xhr.onreadystatechange=jQuery.noop;if(xhrOnUnloadAbort){delete xhrCallbacks[handle];}} // If it's an abort
if(isAbort){ // Abort it manually if needed
if(xhr.readyState!==4){xhr.abort();}}else {responses={};status=xhr.status;responseHeaders=xhr.getAllResponseHeaders(); // When requesting binary data, IE6-9 will throw an exception
// on any attempt to access responseText (#11426)
if(typeof xhr.responseText==="string"){responses.text=xhr.responseText;} // Firefox throws an exception when accessing
// statusText for faulty cross-domain requests
try{statusText=xhr.statusText;}catch(e){ // We normalize with Webkit giving an empty statusText
statusText="";} // Filter status for non standard behaviors
// If the request is local and we have data: assume a success
// (success with no data won't get notified, that's the best we
// can do given current implementations)
if(!status&&s.isLocal&&!s.crossDomain){status=responses.text?200:404; // IE - #1450: sometimes returns 1223 when it should be 204
}else if(status===1223){status=204;}}}}catch(firefoxAccessException){if(!isAbort){complete(-1,firefoxAccessException);}} // Call complete if needed
if(responses){complete(status,statusText,responses,responseHeaders);}};if(!s.async){ // if we're in sync mode we fire the callback
callback();}else if(xhr.readyState===4){ // (IE6 & IE7) if it's in cache and has been
// retrieved directly we need to fire the callback
setTimeout(callback);}else {handle=++xhrId;if(xhrOnUnloadAbort){ // Create the active xhrs callbacks list if needed
// and attach the unload handler
if(!xhrCallbacks){xhrCallbacks={};jQuery(window).unload(xhrOnUnloadAbort);} // Add to list of active xhrs callbacks
xhrCallbacks[handle]=callback;}xhr.onreadystatechange=callback;}},abort:function(){if(callback){callback(undefined,true);}}};}});}var fxNow,timerId,rfxtypes=/^(?:toggle|show|hide)$/,rfxnum=new RegExp("^(?:([+-])=|)("+core_pnum+")([a-z%]*)$","i"),rrun=/queueHooks$/,animationPrefilters=[defaultPrefilter],tweeners={"*":[function(prop,value){var end,unit,tween=this.createTween(prop,value),parts=rfxnum.exec(value),target=tween.cur(),start=+target||0,scale=1,maxIterations=20;if(parts){end=+parts[2];unit=parts[3]||(jQuery.cssNumber[prop]?"":"px"); // We need to compute starting value
if(unit!=="px"&&start){ // Iteratively approximate from a nonzero starting point
// Prefer the current property, because this process will be trivial if it uses the same units
// Fallback to end or a simple constant
start=jQuery.css(tween.elem,prop,true)||end||1;do { // If previous iteration zeroed out, double until we get *something*
// Use a string for doubling factor so we don't accidentally see scale as unchanged below
scale=scale||".5"; // Adjust and apply
start=start/scale;jQuery.style(tween.elem,prop,start+unit); // Update scale, tolerating zero or NaN from tween.cur()
// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
}while(scale!==(scale=tween.cur()/target)&&scale!==1&&--maxIterations);}tween.unit=unit;tween.start=start; // If a +=/-= token was provided, we're doing a relative animation
tween.end=parts[1]?start+(parts[1]+1)*end:end;}return tween;}]}; // Animations created synchronously will run synchronously
function createFxNow(){setTimeout(function(){fxNow=undefined;});return fxNow=jQuery.now();}function createTweens(animation,props){jQuery.each(props,function(prop,value){var collection=(tweeners[prop]||[]).concat(tweeners["*"]),index=0,length=collection.length;for(;index<length;index++){if(collection[index].call(animation,prop,value)){ // we're done with this property
return;}}});}function Animation(elem,properties,options){var result,stopped,index=0,length=animationPrefilters.length,deferred=jQuery.Deferred().always(function(){ // don't match elem in the :animated selector
delete tick.elem;}),tick=function(){if(stopped){return false;}var currentTime=fxNow||createFxNow(),remaining=Math.max(0,animation.startTime+animation.duration-currentTime), // archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
temp=remaining/animation.duration||0,percent=1-temp,index=0,length=animation.tweens.length;for(;index<length;index++){animation.tweens[index].run(percent);}deferred.notifyWith(elem,[animation,percent,remaining]);if(percent<1&&length){return remaining;}else {deferred.resolveWith(elem,[animation]);return false;}},animation=deferred.promise({elem:elem,props:jQuery.extend({},properties),opts:jQuery.extend(true,{specialEasing:{}},options),originalProperties:properties,originalOptions:options,startTime:fxNow||createFxNow(),duration:options.duration,tweens:[],createTween:function(prop,end){var tween=jQuery.Tween(elem,animation.opts,prop,end,animation.opts.specialEasing[prop]||animation.opts.easing);animation.tweens.push(tween);return tween;},stop:function(gotoEnd){var index=0, // if we are going to the end, we want to run all the tweens
// otherwise we skip this part
length=gotoEnd?animation.tweens.length:0;if(stopped){return this;}stopped=true;for(;index<length;index++){animation.tweens[index].run(1);} // resolve when we played the last frame
// otherwise, reject
if(gotoEnd){deferred.resolveWith(elem,[animation,gotoEnd]);}else {deferred.rejectWith(elem,[animation,gotoEnd]);}return this;}}),props=animation.props;propFilter(props,animation.opts.specialEasing);for(;index<length;index++){result=animationPrefilters[index].call(animation,elem,props,animation.opts);if(result){return result;}}createTweens(animation,props);if(jQuery.isFunction(animation.opts.start)){animation.opts.start.call(elem,animation);}jQuery.fx.timer(jQuery.extend(tick,{elem:elem,anim:animation,queue:animation.opts.queue})); // attach callbacks from options
return animation.progress(animation.opts.progress).done(animation.opts.done,animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);}function propFilter(props,specialEasing){var value,name,index,easing,hooks; // camelCase, specialEasing and expand cssHook pass
for(index in props){name=jQuery.camelCase(index);easing=specialEasing[name];value=props[index];if(jQuery.isArray(value)){easing=value[1];value=props[index]=value[0];}if(index!==name){props[name]=value;delete props[index];}hooks=jQuery.cssHooks[name];if(hooks&&"expand" in hooks){value=hooks.expand(value);delete props[name]; // not quite $.extend, this wont overwrite keys already present.
// also - reusing 'index' from above because we have the correct "name"
for(index in value){if(!(index in props)){props[index]=value[index];specialEasing[index]=easing;}}}else {specialEasing[name]=easing;}}}jQuery.Animation=jQuery.extend(Animation,{tweener:function(props,callback){if(jQuery.isFunction(props)){callback=props;props=["*"];}else {props=props.split(" ");}var prop,index=0,length=props.length;for(;index<length;index++){prop=props[index];tweeners[prop]=tweeners[prop]||[];tweeners[prop].unshift(callback);}},prefilter:function(callback,prepend){if(prepend){animationPrefilters.unshift(callback);}else {animationPrefilters.push(callback);}}});function defaultPrefilter(elem,props,opts){ /*jshint validthis:true */var prop,index,length,value,dataShow,toggle,tween,hooks,oldfire,anim=this,style=elem.style,orig={},handled=[],hidden=elem.nodeType&&isHidden(elem); // handle queue: false promises
if(!opts.queue){hooks=jQuery._queueHooks(elem,"fx");if(hooks.unqueued==null){hooks.unqueued=0;oldfire=hooks.empty.fire;hooks.empty.fire=function(){if(!hooks.unqueued){oldfire();}};}hooks.unqueued++;anim.always(function(){ // doing this makes sure that the complete handler will be called
// before this completes
anim.always(function(){hooks.unqueued--;if(!jQuery.queue(elem,"fx").length){hooks.empty.fire();}});});} // height/width overflow pass
if(elem.nodeType===1&&("height" in props||"width" in props)){ // Make sure that nothing sneaks out
// Record all 3 overflow attributes because IE does not
// change the overflow attribute when overflowX and
// overflowY are set to the same value
opts.overflow=[style.overflow,style.overflowX,style.overflowY]; // Set display property to inline-block for height/width
// animations on inline elements that are having width/height animated
if(jQuery.css(elem,"display")==="inline"&&jQuery.css(elem,"float")==="none"){ // inline-level elements accept inline-block;
// block-level elements need to be inline with layout
if(!jQuery.support.inlineBlockNeedsLayout||css_defaultDisplay(elem.nodeName)==="inline"){style.display="inline-block";}else {style.zoom=1;}}}if(opts.overflow){style.overflow="hidden";if(!jQuery.support.shrinkWrapBlocks){anim.always(function(){style.overflow=opts.overflow[0];style.overflowX=opts.overflow[1];style.overflowY=opts.overflow[2];});}} // show/hide pass
for(index in props){value=props[index];if(rfxtypes.exec(value)){delete props[index];toggle=toggle||value==="toggle";if(value===(hidden?"hide":"show")){continue;}handled.push(index);}}length=handled.length;if(length){dataShow=jQuery._data(elem,"fxshow")||jQuery._data(elem,"fxshow",{});if("hidden" in dataShow){hidden=dataShow.hidden;} // store state if its toggle - enables .stop().toggle() to "reverse"
if(toggle){dataShow.hidden=!hidden;}if(hidden){jQuery(elem).show();}else {anim.done(function(){jQuery(elem).hide();});}anim.done(function(){var prop;jQuery._removeData(elem,"fxshow");for(prop in orig){jQuery.style(elem,prop,orig[prop]);}});for(index=0;index<length;index++){prop=handled[index];tween=anim.createTween(prop,hidden?dataShow[prop]:0);orig[prop]=dataShow[prop]||jQuery.style(elem,prop);if(!(prop in dataShow)){dataShow[prop]=tween.start;if(hidden){tween.end=tween.start;tween.start=prop==="width"||prop==="height"?1:0;}}}}}function Tween(elem,options,prop,end,easing){return new Tween.prototype.init(elem,options,prop,end,easing);}jQuery.Tween=Tween;Tween.prototype={constructor:Tween,init:function(elem,options,prop,end,easing,unit){this.elem=elem;this.prop=prop;this.easing=easing||"swing";this.options=options;this.start=this.now=this.cur();this.end=end;this.unit=unit||(jQuery.cssNumber[prop]?"":"px");},cur:function(){var hooks=Tween.propHooks[this.prop];return hooks&&hooks.get?hooks.get(this):Tween.propHooks._default.get(this);},run:function(percent){var eased,hooks=Tween.propHooks[this.prop];if(this.options.duration){this.pos=eased=jQuery.easing[this.easing](percent,this.options.duration*percent,0,1,this.options.duration);}else {this.pos=eased=percent;}this.now=(this.end-this.start)*eased+this.start;if(this.options.step){this.options.step.call(this.elem,this.now,this);}if(hooks&&hooks.set){hooks.set(this);}else {Tween.propHooks._default.set(this);}return this;}};Tween.prototype.init.prototype=Tween.prototype;Tween.propHooks={_default:{get:function(tween){var result;if(tween.elem[tween.prop]!=null&&(!tween.elem.style||tween.elem.style[tween.prop]==null)){return tween.elem[tween.prop];} // passing an empty string as a 3rd parameter to .css will automatically
// attempt a parseFloat and fallback to a string if the parse fails
// so, simple values such as "10px" are parsed to Float.
// complex values such as "rotate(1rad)" are returned as is.
result=jQuery.css(tween.elem,tween.prop,""); // Empty strings, null, undefined and "auto" are converted to 0.
return !result||result==="auto"?0:result;},set:function(tween){ // use step hook for back compat - use cssHook if its there - use .style if its
// available and use plain properties where available
if(jQuery.fx.step[tween.prop]){jQuery.fx.step[tween.prop](tween);}else if(tween.elem.style&&(tween.elem.style[jQuery.cssProps[tween.prop]]!=null||jQuery.cssHooks[tween.prop])){jQuery.style(tween.elem,tween.prop,tween.now+tween.unit);}else {tween.elem[tween.prop]=tween.now;}}}}; // Remove in 2.0 - this supports IE8's panic based approach
// to setting things on disconnected nodes
Tween.propHooks.scrollTop=Tween.propHooks.scrollLeft={set:function(tween){if(tween.elem.nodeType&&tween.elem.parentNode){tween.elem[tween.prop]=tween.now;}}};jQuery.each(["toggle","show","hide"],function(i,name){var cssFn=jQuery.fn[name];jQuery.fn[name]=function(speed,easing,callback){return speed==null||typeof speed==="boolean"?cssFn.apply(this,arguments):this.animate(genFx(name,true),speed,easing,callback);};});jQuery.fn.extend({fadeTo:function(speed,to,easing,callback){ // show any hidden elements after setting opacity to 0
return this.filter(isHidden).css("opacity",0).show() // animate to the value specified
.end().animate({opacity:to},speed,easing,callback);},animate:function(prop,speed,easing,callback){var empty=jQuery.isEmptyObject(prop),optall=jQuery.speed(speed,easing,callback),doAnimation=function(){ // Operate on a copy of prop so per-property easing won't be lost
var anim=Animation(this,jQuery.extend({},prop),optall);doAnimation.finish=function(){anim.stop(true);}; // Empty animations, or finishing resolves immediately
if(empty||jQuery._data(this,"finish")){anim.stop(true);}};doAnimation.finish=doAnimation;return empty||optall.queue===false?this.each(doAnimation):this.queue(optall.queue,doAnimation);},stop:function(type,clearQueue,gotoEnd){var stopQueue=function(hooks){var stop=hooks.stop;delete hooks.stop;stop(gotoEnd);};if(typeof type!=="string"){gotoEnd=clearQueue;clearQueue=type;type=undefined;}if(clearQueue&&type!==false){this.queue(type||"fx",[]);}return this.each(function(){var dequeue=true,index=type!=null&&type+"queueHooks",timers=jQuery.timers,data=jQuery._data(this);if(index){if(data[index]&&data[index].stop){stopQueue(data[index]);}}else {for(index in data){if(data[index]&&data[index].stop&&rrun.test(index)){stopQueue(data[index]);}}}for(index=timers.length;index--;){if(timers[index].elem===this&&(type==null||timers[index].queue===type)){timers[index].anim.stop(gotoEnd);dequeue=false;timers.splice(index,1);}} // start the next in the queue if the last step wasn't forced
// timers currently will call their complete callbacks, which will dequeue
// but only if they were gotoEnd
if(dequeue||!gotoEnd){jQuery.dequeue(this,type);}});},finish:function(type){if(type!==false){type=type||"fx";}return this.each(function(){var index,data=jQuery._data(this),queue=data[type+"queue"],hooks=data[type+"queueHooks"],timers=jQuery.timers,length=queue?queue.length:0; // enable finishing flag on private data
data.finish=true; // empty the queue first
jQuery.queue(this,type,[]);if(hooks&&hooks.cur&&hooks.cur.finish){hooks.cur.finish.call(this);} // look for any active animations, and finish them
for(index=timers.length;index--;){if(timers[index].elem===this&&timers[index].queue===type){timers[index].anim.stop(true);timers.splice(index,1);}} // look for any animations in the old queue and finish them
for(index=0;index<length;index++){if(queue[index]&&queue[index].finish){queue[index].finish.call(this);}} // turn off finishing flag
delete data.finish;});}}); // Generate parameters to create a standard animation
function genFx(type,includeWidth){var which,attrs={height:type},i=0; // if we include width, step value is 1 to do all cssExpand values,
// if we don't include width, step value is 2 to skip over Left and Right
includeWidth=includeWidth?1:0;for(;i<4;i+=2-includeWidth){which=cssExpand[i];attrs["margin"+which]=attrs["padding"+which]=type;}if(includeWidth){attrs.opacity=attrs.width=type;}return attrs;} // Generate shortcuts for custom animations
jQuery.each({slideDown:genFx("show"),slideUp:genFx("hide"),slideToggle:genFx("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(name,props){jQuery.fn[name]=function(speed,easing,callback){return this.animate(props,speed,easing,callback);};});jQuery.speed=function(speed,easing,fn){var opt=speed&&typeof speed==="object"?jQuery.extend({},speed):{complete:fn||!fn&&easing||jQuery.isFunction(speed)&&speed,duration:speed,easing:fn&&easing||easing&&!jQuery.isFunction(easing)&&easing};opt.duration=jQuery.fx.off?0:typeof opt.duration==="number"?opt.duration:opt.duration in jQuery.fx.speeds?jQuery.fx.speeds[opt.duration]:jQuery.fx.speeds._default; // normalize opt.queue - true/undefined/null -> "fx"
if(opt.queue==null||opt.queue===true){opt.queue="fx";} // Queueing
opt.old=opt.complete;opt.complete=function(){if(jQuery.isFunction(opt.old)){opt.old.call(this);}if(opt.queue){jQuery.dequeue(this,opt.queue);}};return opt;};jQuery.easing={linear:function(p){return p;},swing:function(p){return 0.5-Math.cos(p*Math.PI)/2;}};jQuery.timers=[];jQuery.fx=Tween.prototype.init;jQuery.fx.tick=function(){var timer,timers=jQuery.timers,i=0;fxNow=jQuery.now();for(;i<timers.length;i++){timer=timers[i]; // Checks the timer has not already been removed
if(!timer()&&timers[i]===timer){timers.splice(i--,1);}}if(!timers.length){jQuery.fx.stop();}fxNow=undefined;};jQuery.fx.timer=function(timer){if(timer()&&jQuery.timers.push(timer)){jQuery.fx.start();}};jQuery.fx.interval=13;jQuery.fx.start=function(){if(!timerId){timerId=setInterval(jQuery.fx.tick,jQuery.fx.interval);}};jQuery.fx.stop=function(){clearInterval(timerId);timerId=null;};jQuery.fx.speeds={slow:600,fast:200, // Default speed
_default:400}; // Back Compat <1.8 extension point
jQuery.fx.step={};if(jQuery.expr&&jQuery.expr.filters){jQuery.expr.filters.animated=function(elem){return jQuery.grep(jQuery.timers,function(fn){return elem===fn.elem;}).length;};}jQuery.fn.offset=function(options){if(arguments.length){return options===undefined?this:this.each(function(i){jQuery.offset.setOffset(this,options,i);});}var docElem,win,box={top:0,left:0},elem=this[0],doc=elem&&elem.ownerDocument;if(!doc){return;}docElem=doc.documentElement; // Make sure it's not a disconnected DOM node
if(!jQuery.contains(docElem,elem)){return box;} // If we don't have gBCR, just use 0,0 rather than error
// BlackBerry 5, iOS 3 (original iPhone)
if(typeof elem.getBoundingClientRect!==core_strundefined){box=elem.getBoundingClientRect();}win=getWindow(doc);return {top:box.top+(win.pageYOffset||docElem.scrollTop)-(docElem.clientTop||0),left:box.left+(win.pageXOffset||docElem.scrollLeft)-(docElem.clientLeft||0)};};jQuery.offset={setOffset:function(elem,options,i){var position=jQuery.css(elem,"position"); // set position first, in-case top/left are set even on static elem
if(position==="static"){elem.style.position="relative";}var curElem=jQuery(elem),curOffset=curElem.offset(),curCSSTop=jQuery.css(elem,"top"),curCSSLeft=jQuery.css(elem,"left"),calculatePosition=(position==="absolute"||position==="fixed")&&jQuery.inArray("auto",[curCSSTop,curCSSLeft])>-1,props={},curPosition={},curTop,curLeft; // need to be able to calculate position if either top or left is auto and position is either absolute or fixed
if(calculatePosition){curPosition=curElem.position();curTop=curPosition.top;curLeft=curPosition.left;}else {curTop=parseFloat(curCSSTop)||0;curLeft=parseFloat(curCSSLeft)||0;}if(jQuery.isFunction(options)){options=options.call(elem,i,curOffset);}if(options.top!=null){props.top=options.top-curOffset.top+curTop;}if(options.left!=null){props.left=options.left-curOffset.left+curLeft;}if("using" in options){options.using.call(elem,props);}else {curElem.css(props);}}};jQuery.fn.extend({position:function(){if(!this[0]){return;}var offsetParent,offset,parentOffset={top:0,left:0},elem=this[0]; // fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
if(jQuery.css(elem,"position")==="fixed"){ // we assume that getBoundingClientRect is available when computed position is fixed
offset=elem.getBoundingClientRect();}else { // Get *real* offsetParent
offsetParent=this.offsetParent(); // Get correct offsets
offset=this.offset();if(!jQuery.nodeName(offsetParent[0],"html")){parentOffset=offsetParent.offset();} // Add offsetParent borders
parentOffset.top+=jQuery.css(offsetParent[0],"borderTopWidth",true);parentOffset.left+=jQuery.css(offsetParent[0],"borderLeftWidth",true);} // Subtract parent offsets and element margins
// note: when an element has margin: auto the offsetLeft and marginLeft
// are the same in Safari causing offset.left to incorrectly be 0
return {top:offset.top-parentOffset.top-jQuery.css(elem,"marginTop",true),left:offset.left-parentOffset.left-jQuery.css(elem,"marginLeft",true)};},offsetParent:function(){return this.map(function(){var offsetParent=this.offsetParent||document.documentElement;while(offsetParent&&!jQuery.nodeName(offsetParent,"html")&&jQuery.css(offsetParent,"position")==="static"){offsetParent=offsetParent.offsetParent;}return offsetParent||document.documentElement;});}}); // Create scrollLeft and scrollTop methods
jQuery.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(method,prop){var top=/Y/.test(prop);jQuery.fn[method]=function(val){return jQuery.access(this,function(elem,method,val){var win=getWindow(elem);if(val===undefined){return win?prop in win?win[prop]:win.document.documentElement[method]:elem[method];}if(win){win.scrollTo(!top?val:jQuery(win).scrollLeft(),top?val:jQuery(win).scrollTop());}else {elem[method]=val;}},method,val,arguments.length,null);};});function getWindow(elem){return jQuery.isWindow(elem)?elem:elem.nodeType===9?elem.defaultView||elem.parentWindow:false;} // Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each({Height:"height",Width:"width"},function(name,type){jQuery.each({padding:"inner"+name,content:type,"":"outer"+name},function(defaultExtra,funcName){ // margin is only for outerHeight, outerWidth
jQuery.fn[funcName]=function(margin,value){var chainable=arguments.length&&(defaultExtra||typeof margin!=="boolean"),extra=defaultExtra||(margin===true||value===true?"margin":"border");return jQuery.access(this,function(elem,type,value){var doc;if(jQuery.isWindow(elem)){ // As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
// isn't a whole lot we can do. See pull request at this URL for discussion:
// https://github.com/jquery/jquery/pull/764
return elem.document.documentElement["client"+name];} // Get document width or height
if(elem.nodeType===9){doc=elem.documentElement; // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
return Math.max(elem.body["scroll"+name],doc["scroll"+name],elem.body["offset"+name],doc["offset"+name],doc["client"+name]);}return value===undefined? // Get width or height on the element, requesting but not forcing parseFloat
jQuery.css(elem,type,extra): // Set width or height on the element
jQuery.style(elem,type,value,extra);},type,chainable?margin:undefined,chainable,null);};});}); // Limit scope pollution from any deprecated API
// (function() {
// })();
// Expose jQuery to the global object
window.jQuery=window.$=jQuery; // Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if(typeof define==="function"&&define.amd&&define.amd.jQuery){define("jquery",[],function(){return jQuery;});}})(window);
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports === "object") {
    var randomColor = factory();if (typeof module === "object" && module && module.exports) {
      exports = module.exports = randomColor;
    }exports.randomColor = randomColor;
  } else {
    root.randomColor = factory();
  }
})(this, function () {
  var seed = null;var colorDictionary = {};loadColorBounds();var randomColor = function (options) {
    options = options || {};if (options.seed && options.seed === parseInt(options.seed, 10)) {
      seed = options.seed;
    } else if (typeof options.seed === "string") {
      seed = stringToInteger(options.seed);
    } else if (options.seed !== undefined && options.seed !== null) {
      throw new TypeError("The seed value must be an integer");
    } else {
      seed = null;
    }var H, S, B;if (options.count !== null && options.count !== undefined) {
      var totalColors = options.count,
          colors = [];options.count = null;while (totalColors > colors.length) {
        if (seed && options.seed) options.seed += 1;colors.push(randomColor(options));
      }options.count = totalColors;return colors;
    }H = pickHue(options);S = pickSaturation(H, options);B = pickBrightness(H, S, options);return setFormat([H, S, B], options);
  };function pickHue(options) {
    var hueRange = getHueRange(options.hue),
        hue = randomWithin(hueRange);if (hue < 0) {
      hue = 360 + hue;
    }return hue;
  }function pickSaturation(hue, options) {
    if (options.luminosity === "random") {
      return randomWithin([0, 100]);
    }if (options.hue === "monochrome") {
      return 0;
    }var saturationRange = getSaturationRange(hue);var sMin = saturationRange[0],
        sMax = saturationRange[1];switch (options.luminosity) {case "bright":
        sMin = 55;break;case "dark":
        sMin = sMax - 10;break;case "light":
        sMax = 55;break;}return randomWithin([sMin, sMax]);
  }function pickBrightness(H, S, options) {
    var bMin = getMinimumBrightness(H, S),
        bMax = 100;switch (options.luminosity) {case "dark":
        bMax = bMin + 20;break;case "light":
        bMin = (bMax + bMin) / 2;break;case "random":
        bMin = 0;bMax = 100;break;}return randomWithin([bMin, bMax]);
  }function setFormat(hsv, options) {
    switch (options.format) {case "hsvArray":
        return hsv;case "hslArray":
        return HSVtoHSL(hsv);case "hsl":
        var hsl = HSVtoHSL(hsv);return "hsl(" + hsl[0] + ", " + hsl[1] + "%, " + hsl[2] + "%)";case "hsla":
        var hslColor = HSVtoHSL(hsv);return "hsla(" + hslColor[0] + ", " + hslColor[1] + "%, " + hslColor[2] + "%, " + Math.random() + ")";case "rgbArray":
        return HSVtoRGB(hsv);case "rgb":
        var rgb = HSVtoRGB(hsv);return "rgb(" + rgb.join(", ") + ")";case "rgba":
        var rgbColor = HSVtoRGB(hsv);return "rgba(" + rgbColor.join(", ") + ", " + Math.random() + ")";default:
        return HSVtoHex(hsv);}
  }function getMinimumBrightness(H, S) {
    var lowerBounds = getColorInfo(H).lowerBounds;for (var i = 0; i < lowerBounds.length - 1; i++) {
      var s1 = lowerBounds[i][0],
          v1 = lowerBounds[i][1];var s2 = lowerBounds[i + 1][0],
          v2 = lowerBounds[i + 1][1];if (S >= s1 && S <= s2) {
        var m = (v2 - v1) / (s2 - s1),
            b = v1 - m * s1;return m * S + b;
      }
    }return 0;
  }function getHueRange(colorInput) {
    if (typeof parseInt(colorInput) === "number") {
      var number = parseInt(colorInput);if (number < 360 && number > 0) {
        return [number, number];
      }
    }if (typeof colorInput === "string") {
      if (colorDictionary[colorInput]) {
        var color = colorDictionary[colorInput];if (color.hueRange) {
          return color.hueRange;
        }
      }
    }return [0, 360];
  }function getSaturationRange(hue) {
    return getColorInfo(hue).saturationRange;
  }function getColorInfo(hue) {
    if (hue >= 334 && hue <= 360) {
      hue -= 360;
    }for (var colorName in colorDictionary) {
      var color = colorDictionary[colorName];if (color.hueRange && hue >= color.hueRange[0] && hue <= color.hueRange[1]) {
        return colorDictionary[colorName];
      }
    }return "Color not found";
  }function randomWithin(range) {
    if (seed === null) {
      return Math.floor(range[0] + Math.random() * (range[1] + 1 - range[0]));
    } else {
      var max = range[1] || 1;var min = range[0] || 0;seed = (seed * 9301 + 49297) % 233280;var rnd = seed / 233280;return Math.floor(min + rnd * (max - min));
    }
  }function HSVtoHex(hsv) {
    var rgb = HSVtoRGB(hsv);function componentToHex(c) {
      var hex = c.toString(16);return hex.length == 1 ? "0" + hex : hex;
    }var hex = "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);return hex;
  }function defineColor(name, hueRange, lowerBounds) {
    var sMin = lowerBounds[0][0],
        sMax = lowerBounds[lowerBounds.length - 1][0],
        bMin = lowerBounds[lowerBounds.length - 1][1],
        bMax = lowerBounds[0][1];colorDictionary[name] = { hueRange: hueRange, lowerBounds: lowerBounds, saturationRange: [sMin, sMax], brightnessRange: [bMin, bMax] };
  }function loadColorBounds() {
    defineColor("monochrome", null, [[0, 0], [100, 0]]);defineColor("red", [-26, 18], [[20, 100], [30, 92], [40, 89], [50, 85], [60, 78], [70, 70], [80, 60], [90, 55], [100, 50]]);defineColor("orange", [19, 46], [[20, 100], [30, 93], [40, 88], [50, 86], [60, 85], [70, 70], [100, 70]]);defineColor("yellow", [47, 62], [[25, 100], [40, 94], [50, 89], [60, 86], [70, 84], [80, 82], [90, 80], [100, 75]]);defineColor("green", [63, 178], [[30, 100], [40, 90], [50, 85], [60, 81], [70, 74], [80, 64], [90, 50], [100, 40]]);defineColor("blue", [179, 257], [[20, 100], [30, 86], [40, 80], [50, 74], [60, 60], [70, 52], [80, 44], [90, 39], [100, 35]]);defineColor("purple", [258, 282], [[20, 100], [30, 87], [40, 79], [50, 70], [60, 65], [70, 59], [80, 52], [90, 45], [100, 42]]);defineColor("pink", [283, 334], [[20, 100], [30, 90], [40, 86], [60, 84], [80, 80], [90, 75], [100, 73]]);
  }function HSVtoRGB(hsv) {
    var h = hsv[0];if (h === 0) {
      h = 1;
    }if (h === 360) {
      h = 359;
    }h = h / 360;var s = hsv[1] / 100,
        v = hsv[2] / 100;var h_i = Math.floor(h * 6),
        f = h * 6 - h_i,
        p = v * (1 - s),
        q = v * (1 - f * s),
        t = v * (1 - (1 - f) * s),
        r = 256,
        g = 256,
        b = 256;switch (h_i) {case 0:
        r = v;g = t;b = p;break;case 1:
        r = q;g = v;b = p;break;case 2:
        r = p;g = v;b = t;break;case 3:
        r = p;g = q;b = v;break;case 4:
        r = t;g = p;b = v;break;case 5:
        r = v;g = p;b = q;break;}var result = [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];return result;
  }function HSVtoHSL(hsv) {
    var h = hsv[0],
        s = hsv[1] / 100,
        v = hsv[2] / 100,
        k = (2 - s) * v;return [h, Math.round(s * v / (k < 1 ? k : 2 - k) * 1e4) / 100, k / 2 * 100];
  }function stringToInteger(string) {
    var total = 0;for (var i = 0; i !== string.length; i++) {
      if (total >= Number.MAX_SAFE_INTEGER) break;total += string.charCodeAt(i);
    }return total;
  }return randomColor;
});
/*!
* @license SoundJS
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2011-2015 gskinner.com, inc.
*
* Distributed under the terms of the MIT license.
* http://www.opensource.org/licenses/mit-license.html
*
* This notice shall be included in all copies or substantial portions of the Software.
*/

/**!
 * SoundJS FlashAudioPlugin also includes swfobject (http://code.google.com/p/swfobject/)
 */

this.createjs = this.createjs || {}, function () {
  var a = createjs.SoundJS = createjs.SoundJS || {};a.version = "0.6.2", a.buildDate = "Thu, 26 Nov 2015 20:44:31 GMT";
}(), this.createjs = this.createjs || {}, createjs.extend = function (a, b) {
  "use strict";
  function c() {
    this.constructor = a;
  }return c.prototype = b.prototype, a.prototype = new c();
}, this.createjs = this.createjs || {}, createjs.promote = function (a, b) {
  "use strict";
  var c = a.prototype,
      d = Object.getPrototypeOf && Object.getPrototypeOf(c) || c.__proto__;if (d) {
    c[(b += "_") + "constructor"] = d.constructor;for (var e in d) c.hasOwnProperty(e) && "function" == typeof d[e] && (c[b + e] = d[e]);
  }return a;
}, this.createjs = this.createjs || {}, createjs.indexOf = function (a, b) {
  "use strict";
  for (var c = 0, d = a.length; d > c; c++) if (b === a[c]) return c;return -1;
}, this.createjs = this.createjs || {}, function () {
  "use strict";
  createjs.proxy = function (a, b) {
    var c = Array.prototype.slice.call(arguments, 2);return function () {
      return a.apply(b, Array.prototype.slice.call(arguments, 0).concat(c));
    };
  };
}(), this.createjs = this.createjs || {}, function () {
  "use strict";
  function BrowserDetect() {
    throw "BrowserDetect cannot be instantiated";
  }var a = BrowserDetect.agent = window.navigator.userAgent;BrowserDetect.isWindowPhone = a.indexOf("IEMobile") > -1 || a.indexOf("Windows Phone") > -1, BrowserDetect.isFirefox = a.indexOf("Firefox") > -1, BrowserDetect.isOpera = null != window.opera, BrowserDetect.isChrome = a.indexOf("Chrome") > -1, BrowserDetect.isIOS = (a.indexOf("iPod") > -1 || a.indexOf("iPhone") > -1 || a.indexOf("iPad") > -1) && !BrowserDetect.isWindowPhone, BrowserDetect.isAndroid = a.indexOf("Android") > -1 && !BrowserDetect.isWindowPhone, BrowserDetect.isBlackberry = a.indexOf("Blackberry") > -1, createjs.BrowserDetect = BrowserDetect;
}(), this.createjs = this.createjs || {}, function () {
  "use strict";
  function EventDispatcher() {
    this._listeners = null, this._captureListeners = null;
  }var a = EventDispatcher.prototype;EventDispatcher.initialize = function (b) {
    b.addEventListener = a.addEventListener, b.on = a.on, b.removeEventListener = b.off = a.removeEventListener, b.removeAllEventListeners = a.removeAllEventListeners, b.hasEventListener = a.hasEventListener, b.dispatchEvent = a.dispatchEvent, b._dispatchEvent = a._dispatchEvent, b.willTrigger = a.willTrigger;
  }, a.addEventListener = function (a, b, c) {
    var d;d = c ? this._captureListeners = this._captureListeners || {} : this._listeners = this._listeners || {};var e = d[a];return e && this.removeEventListener(a, b, c), e = d[a], e ? e.push(b) : d[a] = [b], b;
  }, a.on = function (a, b, c, d, e, f) {
    return b.handleEvent && (c = c || b, b = b.handleEvent), c = c || this, this.addEventListener(a, function (a) {
      b.call(c, a, e), d && a.remove();
    }, f);
  }, a.removeEventListener = function (a, b, c) {
    var d = c ? this._captureListeners : this._listeners;if (d) {
      var e = d[a];if (e) for (var f = 0, g = e.length; g > f; f++) if (e[f] == b) {
        1 == g ? delete d[a] : e.splice(f, 1);break;
      }
    }
  }, a.off = a.removeEventListener, a.removeAllEventListeners = function (a) {
    a ? (this._listeners && delete this._listeners[a], this._captureListeners && delete this._captureListeners[a]) : this._listeners = this._captureListeners = null;
  }, a.dispatchEvent = function (a, b, c) {
    if ("string" == typeof a) {
      var d = this._listeners;if (!(b || d && d[a])) return !0;a = new createjs.Event(a, b, c);
    } else a.target && a.clone && (a = a.clone());try {
      a.target = this;
    } catch (e) {}if (a.bubbles && this.parent) {
      for (var f = this, g = [f]; f.parent;) g.push(f = f.parent);var h,
          i = g.length;for (h = i - 1; h >= 0 && !a.propagationStopped; h--) g[h]._dispatchEvent(a, 1 + (0 == h));for (h = 1; i > h && !a.propagationStopped; h++) g[h]._dispatchEvent(a, 3);
    } else this._dispatchEvent(a, 2);return !a.defaultPrevented;
  }, a.hasEventListener = function (a) {
    var b = this._listeners,
        c = this._captureListeners;return !!(b && b[a] || c && c[a]);
  }, a.willTrigger = function (a) {
    for (var b = this; b;) {
      if (b.hasEventListener(a)) return !0;b = b.parent;
    }return !1;
  }, a.toString = function () {
    return "[EventDispatcher]";
  }, a._dispatchEvent = function (a, b) {
    var c,
        d = 1 == b ? this._captureListeners : this._listeners;if (a && d) {
      var e = d[a.type];if (!e || !(c = e.length)) return;try {
        a.currentTarget = this;
      } catch (f) {}try {
        a.eventPhase = b;
      } catch (f) {}a.removed = !1, e = e.slice();for (var g = 0; c > g && !a.immediatePropagationStopped; g++) {
        var h = e[g];h.handleEvent ? h.handleEvent(a) : h(a), a.removed && (this.off(a.type, h, 1 == b), a.removed = !1);
      }
    }
  }, createjs.EventDispatcher = EventDispatcher;
}(), this.createjs = this.createjs || {}, function () {
  "use strict";
  function Event(a, b, c) {
    this.type = a, this.target = null, this.currentTarget = null, this.eventPhase = 0, this.bubbles = !!b, this.cancelable = !!c, this.timeStamp = new Date().getTime(), this.defaultPrevented = !1, this.propagationStopped = !1, this.immediatePropagationStopped = !1, this.removed = !1;
  }var a = Event.prototype;a.preventDefault = function () {
    this.defaultPrevented = this.cancelable && !0;
  }, a.stopPropagation = function () {
    this.propagationStopped = !0;
  }, a.stopImmediatePropagation = function () {
    this.immediatePropagationStopped = this.propagationStopped = !0;
  }, a.remove = function () {
    this.removed = !0;
  }, a.clone = function () {
    return new Event(this.type, this.bubbles, this.cancelable);
  }, a.set = function (a) {
    for (var b in a) this[b] = a[b];return this;
  }, a.toString = function () {
    return "[Event (type=" + this.type + ")]";
  }, createjs.Event = Event;
}(), this.createjs = this.createjs || {}, function () {
  "use strict";
  function ErrorEvent(a, b, c) {
    this.Event_constructor("error"), this.title = a, this.message = b, this.data = c;
  }var a = createjs.extend(ErrorEvent, createjs.Event);a.clone = function () {
    return new createjs.ErrorEvent(this.title, this.message, this.data);
  }, createjs.ErrorEvent = createjs.promote(ErrorEvent, "Event");
}(), this.createjs = this.createjs || {}, function () {
  "use strict";
  function ProgressEvent(a, b) {
    this.Event_constructor("progress"), this.loaded = a, this.total = null == b ? 1 : b, this.progress = 0 == b ? 0 : this.loaded / this.total;
  }var a = createjs.extend(ProgressEvent, createjs.Event);a.clone = function () {
    return new createjs.ProgressEvent(this.loaded, this.total);
  }, createjs.ProgressEvent = createjs.promote(ProgressEvent, "Event");
}(window), this.createjs = this.createjs || {}, function () {
  "use strict";
  function LoadItem() {
    this.src = null, this.type = null, this.id = null, this.maintainOrder = !1, this.callback = null, this.data = null, this.method = createjs.LoadItem.GET, this.values = null, this.headers = null, this.withCredentials = !1, this.mimeType = null, this.crossOrigin = null, this.loadTimeout = b.LOAD_TIMEOUT_DEFAULT;
  }var a = LoadItem.prototype = {},
      b = LoadItem;b.LOAD_TIMEOUT_DEFAULT = 8e3, b.create = function (a) {
    if ("string" == typeof a) {
      var c = new LoadItem();return c.src = a, c;
    }if (a instanceof b) return a;if (a instanceof Object && a.src) return null == a.loadTimeout && (a.loadTimeout = b.LOAD_TIMEOUT_DEFAULT), a;throw new Error("Type not recognized.");
  }, a.set = function (a) {
    for (var b in a) this[b] = a[b];return this;
  }, createjs.LoadItem = b;
}(), function () {
  var a = {};a.ABSOLUTE_PATT = /^(?:\w+:)?\/{2}/i, a.RELATIVE_PATT = /^[.\/]*?\//i, a.EXTENSION_PATT = /\/?[^\/]+\.(\w{1,5})$/i, a.parseURI = function (b) {
    var c = { absolute: !1, relative: !1 };if (null == b) return c;var d = b.indexOf("?");d > -1 && (b = b.substr(0, d));var e;return a.ABSOLUTE_PATT.test(b) ? c.absolute = !0 : a.RELATIVE_PATT.test(b) && (c.relative = !0), (e = b.match(a.EXTENSION_PATT)) && (c.extension = e[1].toLowerCase()), c;
  }, a.formatQueryString = function (a, b) {
    if (null == a) throw new Error("You must specify data.");var c = [];for (var d in a) c.push(d + "=" + escape(a[d]));return b && (c = c.concat(b)), c.join("&");
  }, a.buildPath = function (a, b) {
    if (null == b) return a;var c = [],
        d = a.indexOf("?");if (-1 != d) {
      var e = a.slice(d + 1);c = c.concat(e.split("&"));
    }return -1 != d ? a.slice(0, d) + "?" + this.formatQueryString(b, c) : a + "?" + this.formatQueryString(b, c);
  }, a.isCrossDomain = function (a) {
    var b = document.createElement("a");b.href = a.src;var c = document.createElement("a");c.href = location.href;var d = "" != b.hostname && (b.port != c.port || b.protocol != c.protocol || b.hostname != c.hostname);return d;
  }, a.isLocal = function (a) {
    var b = document.createElement("a");return b.href = a.src, "" == b.hostname && "file:" == b.protocol;
  }, a.isBinary = function (a) {
    switch (a) {case createjs.AbstractLoader.IMAGE:case createjs.AbstractLoader.BINARY:
        return !0;default:
        return !1;}
  }, a.isImageTag = function (a) {
    return a instanceof HTMLImageElement;
  }, a.isAudioTag = function (a) {
    return window.HTMLAudioElement ? a instanceof HTMLAudioElement : !1;
  }, a.isVideoTag = function (a) {
    return window.HTMLVideoElement ? a instanceof HTMLVideoElement : !1;
  }, a.isText = function (a) {
    switch (a) {case createjs.AbstractLoader.TEXT:case createjs.AbstractLoader.JSON:case createjs.AbstractLoader.MANIFEST:case createjs.AbstractLoader.XML:case createjs.AbstractLoader.CSS:case createjs.AbstractLoader.SVG:case createjs.AbstractLoader.JAVASCRIPT:case createjs.AbstractLoader.SPRITESHEET:
        return !0;default:
        return !1;}
  }, a.getTypeByExtension = function (a) {
    if (null == a) return createjs.AbstractLoader.TEXT;switch (a.toLowerCase()) {case "jpeg":case "jpg":case "gif":case "png":case "webp":case "bmp":
        return createjs.AbstractLoader.IMAGE;case "ogg":case "mp3":case "webm":
        return createjs.AbstractLoader.SOUND;case "mp4":case "webm":case "ts":
        return createjs.AbstractLoader.VIDEO;case "json":
        return createjs.AbstractLoader.JSON;case "xml":
        return createjs.AbstractLoader.XML;case "css":
        return createjs.AbstractLoader.CSS;case "js":
        return createjs.AbstractLoader.JAVASCRIPT;case "svg":
        return createjs.AbstractLoader.SVG;default:
        return createjs.AbstractLoader.TEXT;}
  }, createjs.RequestUtils = a;
}(), this.createjs = this.createjs || {}, function () {
  "use strict";
  function AbstractLoader(a, b, c) {
    this.EventDispatcher_constructor(), this.loaded = !1, this.canceled = !1, this.progress = 0, this.type = c, this.resultFormatter = null, this._item = a ? createjs.LoadItem.create(a) : null, this._preferXHR = b, this._result = null, this._rawResult = null, this._loadedItems = null, this._tagSrcAttribute = null, this._tag = null;
  }var a = createjs.extend(AbstractLoader, createjs.EventDispatcher),
      b = AbstractLoader;b.POST = "POST", b.GET = "GET", b.BINARY = "binary", b.CSS = "css", b.IMAGE = "image", b.JAVASCRIPT = "javascript", b.JSON = "json", b.JSONP = "jsonp", b.MANIFEST = "manifest", b.SOUND = "sound", b.VIDEO = "video", b.SPRITESHEET = "spritesheet", b.SVG = "svg", b.TEXT = "text", b.XML = "xml", a.getItem = function () {
    return this._item;
  }, a.getResult = function (a) {
    return a ? this._rawResult : this._result;
  }, a.getTag = function () {
    return this._tag;
  }, a.setTag = function (a) {
    this._tag = a;
  }, a.load = function () {
    this._createRequest(), this._request.on("complete", this, this), this._request.on("progress", this, this), this._request.on("loadStart", this, this), this._request.on("abort", this, this), this._request.on("timeout", this, this), this._request.on("error", this, this);var a = new createjs.Event("initialize");a.loader = this._request, this.dispatchEvent(a), this._request.load();
  }, a.cancel = function () {
    this.canceled = !0, this.destroy();
  }, a.destroy = function () {
    this._request && (this._request.removeAllEventListeners(), this._request.destroy()), this._request = null, this._item = null, this._rawResult = null, this._result = null, this._loadItems = null, this.removeAllEventListeners();
  }, a.getLoadedItems = function () {
    return this._loadedItems;
  }, a._createRequest = function () {
    this._request = this._preferXHR ? new createjs.XHRRequest(this._item) : new createjs.TagRequest(this._item, this._tag || this._createTag(), this._tagSrcAttribute);
  }, a._createTag = function () {
    return null;
  }, a._sendLoadStart = function () {
    this._isCanceled() || this.dispatchEvent("loadstart");
  }, a._sendProgress = function (a) {
    if (!this._isCanceled()) {
      var b = null;"number" == typeof a ? (this.progress = a, b = new createjs.ProgressEvent(this.progress)) : (b = a, this.progress = a.loaded / a.total, b.progress = this.progress, (isNaN(this.progress) || 1 / 0 == this.progress) && (this.progress = 0)), this.hasEventListener("progress") && this.dispatchEvent(b);
    }
  }, a._sendComplete = function () {
    if (!this._isCanceled()) {
      this.loaded = !0;var a = new createjs.Event("complete");a.rawResult = this._rawResult, null != this._result && (a.result = this._result), this.dispatchEvent(a);
    }
  }, a._sendError = function (a) {
    !this._isCanceled() && this.hasEventListener("error") && (null == a && (a = new createjs.ErrorEvent("PRELOAD_ERROR_EMPTY")), this.dispatchEvent(a));
  }, a._isCanceled = function () {
    return null == window.createjs || this.canceled ? !0 : !1;
  }, a.resultFormatter = null, a.handleEvent = function (a) {
    switch (a.type) {case "complete":
        this._rawResult = a.target._response;var b = this.resultFormatter && this.resultFormatter(this);b instanceof Function ? b.call(this, createjs.proxy(this._resultFormatSuccess, this), createjs.proxy(this._resultFormatFailed, this)) : (this._result = b || this._rawResult, this._sendComplete());break;case "progress":
        this._sendProgress(a);break;case "error":
        this._sendError(a);break;case "loadstart":
        this._sendLoadStart();break;case "abort":case "timeout":
        this._isCanceled() || this.dispatchEvent(new createjs.ErrorEvent("PRELOAD_" + a.type.toUpperCase() + "_ERROR"));}
  }, a._resultFormatSuccess = function (a) {
    this._result = a, this._sendComplete();
  }, a._resultFormatFailed = function (a) {
    this._sendError(a);
  }, a.buildPath = function (a, b) {
    return createjs.RequestUtils.buildPath(a, b);
  }, a.toString = function () {
    return "[PreloadJS AbstractLoader]";
  }, createjs.AbstractLoader = createjs.promote(AbstractLoader, "EventDispatcher");
}(), this.createjs = this.createjs || {}, function () {
  "use strict";
  function AbstractMediaLoader(a, b, c) {
    this.AbstractLoader_constructor(a, b, c), this.resultFormatter = this._formatResult, this._tagSrcAttribute = "src", this.on("initialize", this._updateXHR, this);
  }var a = createjs.extend(AbstractMediaLoader, createjs.AbstractLoader);a.load = function () {
    this._tag || (this._tag = this._createTag(this._item.src)), this._tag.preload = "auto", this._tag.load(), this.AbstractLoader_load();
  }, a._createTag = function () {}, a._createRequest = function () {
    this._request = this._preferXHR ? new createjs.XHRRequest(this._item) : new createjs.MediaTagRequest(this._item, this._tag || this._createTag(), this._tagSrcAttribute);
  }, a._updateXHR = function (a) {
    a.loader.setResponseType && a.loader.setResponseType("blob");
  }, a._formatResult = function (a) {
    if (this._tag.removeEventListener && this._tag.removeEventListener("canplaythrough", this._loadedHandler), this._tag.onstalled = null, this._preferXHR) {
      var b = window.URL || window.webkitURL,
          c = a.getResult(!0);a.getTag().src = b.createObjectURL(c);
    }return a.getTag();
  }, createjs.AbstractMediaLoader = createjs.promote(AbstractMediaLoader, "AbstractLoader");
}(), this.createjs = this.createjs || {}, function () {
  "use strict";
  var AbstractRequest = function (a) {
    this._item = a;
  },
      a = createjs.extend(AbstractRequest, createjs.EventDispatcher);a.load = function () {}, a.destroy = function () {}, a.cancel = function () {}, createjs.AbstractRequest = createjs.promote(AbstractRequest, "EventDispatcher");
}(), this.createjs = this.createjs || {}, function () {
  "use strict";
  function TagRequest(a, b, c) {
    this.AbstractRequest_constructor(a), this._tag = b, this._tagSrcAttribute = c, this._loadedHandler = createjs.proxy(this._handleTagComplete, this), this._addedToDOM = !1, this._startTagVisibility = null;
  }var a = createjs.extend(TagRequest, createjs.AbstractRequest);a.load = function () {
    this._tag.onload = createjs.proxy(this._handleTagComplete, this), this._tag.onreadystatechange = createjs.proxy(this._handleReadyStateChange, this), this._tag.onerror = createjs.proxy(this._handleError, this);var a = new createjs.Event("initialize");a.loader = this._tag, this.dispatchEvent(a), this._hideTag(), this._loadTimeout = setTimeout(createjs.proxy(this._handleTimeout, this), this._item.loadTimeout), this._tag[this._tagSrcAttribute] = this._item.src, null == this._tag.parentNode && (window.document.body.appendChild(this._tag), this._addedToDOM = !0);
  }, a.destroy = function () {
    this._clean(), this._tag = null, this.AbstractRequest_destroy();
  }, a._handleReadyStateChange = function () {
    clearTimeout(this._loadTimeout);var a = this._tag;("loaded" == a.readyState || "complete" == a.readyState) && this._handleTagComplete();
  }, a._handleError = function () {
    this._clean(), this.dispatchEvent("error");
  }, a._handleTagComplete = function () {
    this._rawResult = this._tag, this._result = this.resultFormatter && this.resultFormatter(this) || this._rawResult, this._clean(), this._showTag(), this.dispatchEvent("complete");
  }, a._handleTimeout = function () {
    this._clean(), this.dispatchEvent(new createjs.Event("timeout"));
  }, a._clean = function () {
    this._tag.onload = null, this._tag.onreadystatechange = null, this._tag.onerror = null, this._addedToDOM && null != this._tag.parentNode && this._tag.parentNode.removeChild(this._tag), clearTimeout(this._loadTimeout);
  }, a._hideTag = function () {
    this._startTagVisibility = this._tag.style.visibility, this._tag.style.visibility = "hidden";
  }, a._showTag = function () {
    this._tag.style.visibility = this._startTagVisibility;
  }, a._handleStalled = function () {}, createjs.TagRequest = createjs.promote(TagRequest, "AbstractRequest");
}(), this.createjs = this.createjs || {}, function () {
  "use strict";
  function MediaTagRequest(a, b, c) {
    this.AbstractRequest_constructor(a), this._tag = b, this._tagSrcAttribute = c, this._loadedHandler = createjs.proxy(this._handleTagComplete, this);
  }var a = createjs.extend(MediaTagRequest, createjs.TagRequest);a.load = function () {
    var a = createjs.proxy(this._handleStalled, this);this._stalledCallback = a;var b = createjs.proxy(this._handleProgress, this);this._handleProgress = b, this._tag.addEventListener("stalled", a), this._tag.addEventListener("progress", b), this._tag.addEventListener && this._tag.addEventListener("canplaythrough", this._loadedHandler, !1), this.TagRequest_load();
  }, a._handleReadyStateChange = function () {
    clearTimeout(this._loadTimeout);var a = this._tag;("loaded" == a.readyState || "complete" == a.readyState) && this._handleTagComplete();
  }, a._handleStalled = function () {}, a._handleProgress = function (a) {
    if (a && !(a.loaded > 0 && 0 == a.total)) {
      var b = new createjs.ProgressEvent(a.loaded, a.total);this.dispatchEvent(b);
    }
  }, a._clean = function () {
    this._tag.removeEventListener && this._tag.removeEventListener("canplaythrough", this._loadedHandler), this._tag.removeEventListener("stalled", this._stalledCallback), this._tag.removeEventListener("progress", this._progressCallback), this.TagRequest__clean();
  }, createjs.MediaTagRequest = createjs.promote(MediaTagRequest, "TagRequest");
}(), this.createjs = this.createjs || {}, function () {
  "use strict";
  function XHRRequest(a) {
    this.AbstractRequest_constructor(a), this._request = null, this._loadTimeout = null, this._xhrLevel = 1, this._response = null, this._rawResponse = null, this._canceled = !1, this._handleLoadStartProxy = createjs.proxy(this._handleLoadStart, this), this._handleProgressProxy = createjs.proxy(this._handleProgress, this), this._handleAbortProxy = createjs.proxy(this._handleAbort, this), this._handleErrorProxy = createjs.proxy(this._handleError, this), this._handleTimeoutProxy = createjs.proxy(this._handleTimeout, this), this._handleLoadProxy = createjs.proxy(this._handleLoad, this), this._handleReadyStateChangeProxy = createjs.proxy(this._handleReadyStateChange, this), !this._createXHR(a);
  }var a = createjs.extend(XHRRequest, createjs.AbstractRequest);XHRRequest.ACTIVEX_VERSIONS = ["Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], a.getResult = function (a) {
    return a && this._rawResponse ? this._rawResponse : this._response;
  }, a.cancel = function () {
    this.canceled = !0, this._clean(), this._request.abort();
  }, a.load = function () {
    if (null == this._request) return void this._handleError();null != this._request.addEventListener ? (this._request.addEventListener("loadstart", this._handleLoadStartProxy, !1), this._request.addEventListener("progress", this._handleProgressProxy, !1), this._request.addEventListener("abort", this._handleAbortProxy, !1), this._request.addEventListener("error", this._handleErrorProxy, !1), this._request.addEventListener("timeout", this._handleTimeoutProxy, !1), this._request.addEventListener("load", this._handleLoadProxy, !1), this._request.addEventListener("readystatechange", this._handleReadyStateChangeProxy, !1)) : (this._request.onloadstart = this._handleLoadStartProxy, this._request.onprogress = this._handleProgressProxy, this._request.onabort = this._handleAbortProxy, this._request.onerror = this._handleErrorProxy, this._request.ontimeout = this._handleTimeoutProxy, this._request.onload = this._handleLoadProxy, this._request.onreadystatechange = this._handleReadyStateChangeProxy), 1 == this._xhrLevel && (this._loadTimeout = setTimeout(createjs.proxy(this._handleTimeout, this), this._item.loadTimeout));try {
      this._item.values && this._item.method != createjs.AbstractLoader.GET ? this._item.method == createjs.AbstractLoader.POST && this._request.send(createjs.RequestUtils.formatQueryString(this._item.values)) : this._request.send();
    } catch (a) {
      this.dispatchEvent(new createjs.ErrorEvent("XHR_SEND", null, a));
    }
  }, a.setResponseType = function (a) {
    "blob" === a && (a = window.URL ? "blob" : "arraybuffer", this._responseType = a), this._request.responseType = a;
  }, a.getAllResponseHeaders = function () {
    return this._request.getAllResponseHeaders instanceof Function ? this._request.getAllResponseHeaders() : null;
  }, a.getResponseHeader = function (a) {
    return this._request.getResponseHeader instanceof Function ? this._request.getResponseHeader(a) : null;
  }, a._handleProgress = function (a) {
    if (a && !(a.loaded > 0 && 0 == a.total)) {
      var b = new createjs.ProgressEvent(a.loaded, a.total);this.dispatchEvent(b);
    }
  }, a._handleLoadStart = function () {
    clearTimeout(this._loadTimeout), this.dispatchEvent("loadstart");
  }, a._handleAbort = function (a) {
    this._clean(), this.dispatchEvent(new createjs.ErrorEvent("XHR_ABORTED", null, a));
  }, a._handleError = function (a) {
    this._clean(), this.dispatchEvent(new createjs.ErrorEvent(a.message));
  }, a._handleReadyStateChange = function () {
    4 == this._request.readyState && this._handleLoad();
  }, a._handleLoad = function () {
    if (!this.loaded) {
      this.loaded = !0;var a = this._checkError();if (a) return void this._handleError(a);if (this._response = this._getResponse(), "arraybuffer" === this._responseType) try {
        this._response = new Blob([this._response]);
      } catch (b) {
        if (window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder, "TypeError" === b.name && window.BlobBuilder) {
          var c = new BlobBuilder();c.append(this._response), this._response = c.getBlob();
        }
      }this._clean(), this.dispatchEvent(new createjs.Event("complete"));
    }
  }, a._handleTimeout = function (a) {
    this._clean(), this.dispatchEvent(new createjs.ErrorEvent("PRELOAD_TIMEOUT", null, a));
  }, a._checkError = function () {
    var a = parseInt(this._request.status);switch (a) {case 404:case 0:
        return new Error(a);}return null;
  }, a._getResponse = function () {
    if (null != this._response) return this._response;if (null != this._request.response) return this._request.response;try {
      if (null != this._request.responseText) return this._request.responseText;
    } catch (a) {}try {
      if (null != this._request.responseXML) return this._request.responseXML;
    } catch (a) {}return null;
  }, a._createXHR = function (a) {
    var b = createjs.RequestUtils.isCrossDomain(a),
        c = {},
        d = null;if (window.XMLHttpRequest) d = new XMLHttpRequest(), b && void 0 === d.withCredentials && window.XDomainRequest && (d = new XDomainRequest());else {
      for (var e = 0, f = s.ACTIVEX_VERSIONS.length; f > e; e++) {
        var g = s.ACTIVEX_VERSIONS[e];try {
          d = new ActiveXObject(g);break;
        } catch (h) {}
      }if (null == d) return !1;
    }null == a.mimeType && createjs.RequestUtils.isText(a.type) && (a.mimeType = "text/plain; charset=utf-8"), a.mimeType && d.overrideMimeType && d.overrideMimeType(a.mimeType), this._xhrLevel = "string" == typeof d.responseType ? 2 : 1;var i = null;if (i = a.method == createjs.AbstractLoader.GET ? createjs.RequestUtils.buildPath(a.src, a.values) : a.src, d.open(a.method || createjs.AbstractLoader.GET, i, !0), b && d instanceof XMLHttpRequest && 1 == this._xhrLevel && (c.Origin = location.origin), a.values && a.method == createjs.AbstractLoader.POST && (c["Content-Type"] = "application/x-www-form-urlencoded"), b || c["X-Requested-With"] || (c["X-Requested-With"] = "XMLHttpRequest"), a.headers) for (var j in a.headers) c[j] = a.headers[j];for (j in c) d.setRequestHeader(j, c[j]);return d instanceof XMLHttpRequest && void 0 !== a.withCredentials && (d.withCredentials = a.withCredentials), this._request = d, !0;
  }, a._clean = function () {
    clearTimeout(this._loadTimeout), null != this._request.removeEventListener ? (this._request.removeEventListener("loadstart", this._handleLoadStartProxy), this._request.removeEventListener("progress", this._handleProgressProxy), this._request.removeEventListener("abort", this._handleAbortProxy), this._request.removeEventListener("error", this._handleErrorProxy), this._request.removeEventListener("timeout", this._handleTimeoutProxy), this._request.removeEventListener("load", this._handleLoadProxy), this._request.removeEventListener("readystatechange", this._handleReadyStateChangeProxy)) : (this._request.onloadstart = null, this._request.onprogress = null, this._request.onabort = null, this._request.onerror = null, this._request.ontimeout = null, this._request.onload = null, this._request.onreadystatechange = null);
  }, a.toString = function () {
    return "[PreloadJS XHRRequest]";
  }, createjs.XHRRequest = createjs.promote(XHRRequest, "AbstractRequest");
}(), this.createjs = this.createjs || {}, function () {
  "use strict";
  function SoundLoader(a, b) {
    this.AbstractMediaLoader_constructor(a, b, createjs.AbstractLoader.SOUND), createjs.RequestUtils.isAudioTag(a) ? this._tag = a : createjs.RequestUtils.isAudioTag(a.src) ? this._tag = a : createjs.RequestUtils.isAudioTag(a.tag) && (this._tag = createjs.RequestUtils.isAudioTag(a) ? a : a.src), null != this._tag && (this._preferXHR = !1);
  }var a = createjs.extend(SoundLoader, createjs.AbstractMediaLoader),
      b = SoundLoader;b.canLoadItem = function (a) {
    return a.type == createjs.AbstractLoader.SOUND;
  }, a._createTag = function (a) {
    var b = document.createElement("audio");return b.autoplay = !1, b.preload = "none", b.src = a, b;
  }, createjs.SoundLoader = createjs.promote(SoundLoader, "AbstractMediaLoader");
}(), this.createjs = this.createjs || {}, function () {
  "use strict";
  var PlayPropsConfig = function () {
    this.interrupt = null, this.delay = null, this.offset = null, this.loop = null, this.volume = null, this.pan = null, this.startTime = null, this.duration = null;
  },
      a = PlayPropsConfig.prototype = {},
      b = PlayPropsConfig;b.create = function (a) {
    if (a instanceof b || a instanceof Object) {
      var c = new createjs.PlayPropsConfig();return c.set(a), c;
    }throw new Error("Type not recognized.");
  }, a.set = function (a) {
    for (var b in a) this[b] = a[b];return this;
  }, a.toString = function () {
    return "[PlayPropsConfig]";
  }, createjs.PlayPropsConfig = b;
}(), this.createjs = this.createjs || {}, function () {
  "use strict";
  function Sound() {
    throw "Sound cannot be instantiated";
  }function a(a, b) {
    this.init(a, b);
  }var b = Sound;b.INTERRUPT_ANY = "any", b.INTERRUPT_EARLY = "early", b.INTERRUPT_LATE = "late", b.INTERRUPT_NONE = "none", b.PLAY_INITED = "playInited", b.PLAY_SUCCEEDED = "playSucceeded", b.PLAY_INTERRUPTED = "playInterrupted", b.PLAY_FINISHED = "playFinished", b.PLAY_FAILED = "playFailed", b.SUPPORTED_EXTENSIONS = ["mp3", "ogg", "opus", "mpeg", "wav", "m4a", "mp4", "aiff", "wma", "mid"], b.EXTENSION_MAP = { m4a: "mp4" }, b.FILE_PATTERN = /^(?:(\w+:)\/{2}(\w+(?:\.\w+)*\/?))?([\/.]*?(?:[^?]+)?\/)?((?:[^\/?]+)\.(\w+))(?:\?(\S+)?)?$/, b.defaultInterruptBehavior = b.INTERRUPT_NONE, b.alternateExtensions = [], b.activePlugin = null, b._masterVolume = 1, Object.defineProperty(b, "volume", { get: function () {
      return this._masterVolume;
    }, set: function (a) {
      if (null == Number(a)) return !1;if (a = Math.max(0, Math.min(1, a)), b._masterVolume = a, !this.activePlugin || !this.activePlugin.setVolume || !this.activePlugin.setVolume(a)) for (var c = this._instances, d = 0, e = c.length; e > d; d++) c[d].setMasterVolume(a);
    } }), b._masterMute = !1, Object.defineProperty(b, "muted", { get: function () {
      return this._masterMute;
    }, set: function (a) {
      if (null == a) return !1;if (this._masterMute = a, !this.activePlugin || !this.activePlugin.setMute || !this.activePlugin.setMute(a)) for (var b = this._instances, c = 0, d = b.length; d > c; c++) b[c].setMasterMute(a);return !0;
    } }), Object.defineProperty(b, "capabilities", { get: function () {
      return null == b.activePlugin ? null : b.activePlugin._capabilities;
    }, set: function () {
      return !1;
    } }), b._pluginsRegistered = !1, b._lastID = 0, b._instances = [], b._idHash = {}, b._preloadHash = {}, b._defaultPlayPropsHash = {}, b.addEventListener = null, b.removeEventListener = null, b.removeAllEventListeners = null, b.dispatchEvent = null, b.hasEventListener = null, b._listeners = null, createjs.EventDispatcher.initialize(b), b.getPreloadHandlers = function () {
    return { callback: createjs.proxy(b.initLoad, b), types: ["sound"], extensions: b.SUPPORTED_EXTENSIONS };
  }, b._handleLoadComplete = function (a) {
    var c = a.target.getItem().src;if (b._preloadHash[c]) for (var d = 0, e = b._preloadHash[c].length; e > d; d++) {
      var f = b._preloadHash[c][d];if (b._preloadHash[c][d] = !0, b.hasEventListener("fileload")) {
        var a = new createjs.Event("fileload");a.src = f.src, a.id = f.id, a.data = f.data, a.sprite = f.sprite, b.dispatchEvent(a);
      }
    }
  }, b._handleLoadError = function (a) {
    var c = a.target.getItem().src;if (b._preloadHash[c]) for (var d = 0, e = b._preloadHash[c].length; e > d; d++) {
      var f = b._preloadHash[c][d];if (b._preloadHash[c][d] = !1, b.hasEventListener("fileerror")) {
        var a = new createjs.Event("fileerror");a.src = f.src, a.id = f.id, a.data = f.data, a.sprite = f.sprite, b.dispatchEvent(a);
      }
    }
  }, b._registerPlugin = function (a) {
    return a.isSupported() ? (b.activePlugin = new a(), !0) : !1;
  }, b.registerPlugins = function (a) {
    b._pluginsRegistered = !0;for (var c = 0, d = a.length; d > c; c++) if (b._registerPlugin(a[c])) return !0;return !1;
  }, b.initializeDefaultPlugins = function () {
    return null != b.activePlugin ? !0 : b._pluginsRegistered ? !1 : b.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin]) ? !0 : !1;
  }, b.isReady = function () {
    return null != b.activePlugin;
  }, b.getCapabilities = function () {
    return null == b.activePlugin ? null : b.activePlugin._capabilities;
  }, b.getCapability = function (a) {
    return null == b.activePlugin ? null : b.activePlugin._capabilities[a];
  }, b.initLoad = function (a) {
    return b._registerSound(a);
  }, b._registerSound = function (c) {
    if (!b.initializeDefaultPlugins()) return !1;var d;if (c.src instanceof Object ? (d = b._parseSrc(c.src), d.src = c.path + d.src) : d = b._parsePath(c.src), null == d) return !1;c.src = d.src, c.type = "sound";var e = c.data,
        f = null;if (null != e && (isNaN(e.channels) ? isNaN(e) || (f = parseInt(e)) : f = parseInt(e.channels), e.audioSprite)) for (var g, h = e.audioSprite.length; h--;) g = e.audioSprite[h], b._idHash[g.id] = { src: c.src, startTime: parseInt(g.startTime), duration: parseInt(g.duration) }, g.defaultPlayProps && (b._defaultPlayPropsHash[g.id] = createjs.PlayPropsConfig.create(g.defaultPlayProps));null != c.id && (b._idHash[c.id] = { src: c.src });var i = b.activePlugin.register(c);return a.create(c.src, f), null != e && isNaN(e) ? c.data.channels = f || a.maxPerChannel() : c.data = f || a.maxPerChannel(), i.type && (c.type = i.type), c.defaultPlayProps && (b._defaultPlayPropsHash[c.src] = createjs.PlayPropsConfig.create(c.defaultPlayProps)), i;
  }, b.registerSound = function (a, c, d, e, f) {
    var g = { src: a, id: c, data: d, defaultPlayProps: f };a instanceof Object && a.src && (e = c, g = a), g = createjs.LoadItem.create(g), g.path = e, null == e || g.src instanceof Object || (g.src = e + a);var h = b._registerSound(g);if (!h) return !1;if (b._preloadHash[g.src] || (b._preloadHash[g.src] = []), b._preloadHash[g.src].push(g), 1 == b._preloadHash[g.src].length) h.on("complete", createjs.proxy(this._handleLoadComplete, this)), h.on("error", createjs.proxy(this._handleLoadError, this)), b.activePlugin.preload(h);else if (1 == b._preloadHash[g.src][0]) return !0;return g;
  }, b.registerSounds = function (a, b) {
    var c = [];a.path && (b ? b += a.path : b = a.path, a = a.manifest);for (var d = 0, e = a.length; e > d; d++) c[d] = createjs.Sound.registerSound(a[d].src, a[d].id, a[d].data, b, a[d].defaultPlayProps);return c;
  }, b.removeSound = function (c, d) {
    if (null == b.activePlugin) return !1;c instanceof Object && c.src && (c = c.src);var e;if (c instanceof Object ? e = b._parseSrc(c) : (c = b._getSrcById(c).src, e = b._parsePath(c)), null == e) return !1;c = e.src, null != d && (c = d + c);for (var f in b._idHash) b._idHash[f].src == c && delete b._idHash[f];return a.removeSrc(c), delete b._preloadHash[c], b.activePlugin.removeSound(c), !0;
  }, b.removeSounds = function (a, b) {
    var c = [];a.path && (b ? b += a.path : b = a.path, a = a.manifest);for (var d = 0, e = a.length; e > d; d++) c[d] = createjs.Sound.removeSound(a[d].src, b);return c;
  }, b.removeAllSounds = function () {
    b._idHash = {}, b._preloadHash = {}, a.removeAll(), b.activePlugin && b.activePlugin.removeAllSounds();
  }, b.loadComplete = function (a) {
    if (!b.isReady()) return !1;var c = b._parsePath(a);return a = c ? b._getSrcById(c.src).src : b._getSrcById(a).src, void 0 == b._preloadHash[a] ? !1 : 1 == b._preloadHash[a][0];
  }, b._parsePath = function (a) {
    "string" != typeof a && (a = a.toString());var c = a.match(b.FILE_PATTERN);if (null == c) return !1;for (var d = c[4], e = c[5], f = b.capabilities, g = 0; !f[e];) if (e = b.alternateExtensions[g++], g > b.alternateExtensions.length) return null;a = a.replace("." + c[5], "." + e);var h = { name: d, src: a, extension: e };return h;
  }, b._parseSrc = function (a) {
    var c = { name: void 0, src: void 0, extension: void 0 },
        d = b.capabilities;for (var e in a) if (a.hasOwnProperty(e) && d[e]) {
      c.src = a[e], c.extension = e;break;
    }if (!c.src) return !1;var f = c.src.lastIndexOf("/");return c.name = -1 != f ? c.src.slice(f + 1) : c.src, c;
  }, b.play = function (a, c, d, e, f, g, h, i, j) {
    var k;k = createjs.PlayPropsConfig.create(c instanceof Object || c instanceof createjs.PlayPropsConfig ? c : { interrupt: c, delay: d, offset: e, loop: f, volume: g, pan: h, startTime: i, duration: j });var l = b.createInstance(a, k.startTime, k.duration),
        m = b._playInstance(l, k);return m || l._playFailed(), l;
  }, b.createInstance = function (c, d, e) {
    if (!b.initializeDefaultPlugins()) return new createjs.DefaultSoundInstance(c, d, e);var f = b._defaultPlayPropsHash[c];c = b._getSrcById(c);var g = b._parsePath(c.src),
        h = null;
    return null != g && null != g.src ? (a.create(g.src), null == d && (d = c.startTime), h = b.activePlugin.create(g.src, d, e || c.duration), f = f || b._defaultPlayPropsHash[g.src], f && h.applyPlayProps(f)) : h = new createjs.DefaultSoundInstance(c, d, e), h.uniqueId = b._lastID++, h;
  }, b.stop = function () {
    for (var a = this._instances, b = a.length; b--;) a[b].stop();
  }, b.setVolume = function (a) {
    if (null == Number(a)) return !1;if (a = Math.max(0, Math.min(1, a)), b._masterVolume = a, !this.activePlugin || !this.activePlugin.setVolume || !this.activePlugin.setVolume(a)) for (var c = this._instances, d = 0, e = c.length; e > d; d++) c[d].setMasterVolume(a);
  }, b.getVolume = function () {
    return this._masterVolume;
  }, b.setMute = function (a) {
    if (null == a) return !1;if (this._masterMute = a, !this.activePlugin || !this.activePlugin.setMute || !this.activePlugin.setMute(a)) for (var b = this._instances, c = 0, d = b.length; d > c; c++) b[c].setMasterMute(a);return !0;
  }, b.getMute = function () {
    return this._masterMute;
  }, b.setDefaultPlayProps = function (a, c) {
    a = b._getSrcById(a), b._defaultPlayPropsHash[b._parsePath(a.src).src] = createjs.PlayPropsConfig.create(c);
  }, b.getDefaultPlayProps = function (a) {
    return a = b._getSrcById(a), b._defaultPlayPropsHash[b._parsePath(a.src).src];
  }, b._playInstance = function (a, c) {
    var d = b._defaultPlayPropsHash[a.src] || {};if (null == c.interrupt && (c.interrupt = d.interrupt || b.defaultInterruptBehavior), null == c.delay && (c.delay = d.delay || 0), null == c.offset && (c.offset = a.getPosition()), null == c.loop && (c.loop = a.loop), null == c.volume && (c.volume = a.volume), null == c.pan && (c.pan = a.pan), 0 == c.delay) {
      var e = b._beginPlaying(a, c);if (!e) return !1;
    } else {
      var f = setTimeout(function () {
        b._beginPlaying(a, c);
      }, c.delay);a.delayTimeoutId = f;
    }return this._instances.push(a), !0;
  }, b._beginPlaying = function (b, c) {
    if (!a.add(b, c.interrupt)) return !1;var d = b._beginPlaying(c);if (!d) {
      var e = createjs.indexOf(this._instances, b);return e > -1 && this._instances.splice(e, 1), !1;
    }return !0;
  }, b._getSrcById = function (a) {
    return b._idHash[a] || { src: a };
  }, b._playFinished = function (b) {
    a.remove(b);var c = createjs.indexOf(this._instances, b);c > -1 && this._instances.splice(c, 1);
  }, createjs.Sound = Sound, a.channels = {}, a.create = function (b, c) {
    var d = a.get(b);return null == d ? (a.channels[b] = new a(b, c), !0) : !1;
  }, a.removeSrc = function (b) {
    var c = a.get(b);return null == c ? !1 : (c._removeAll(), delete a.channels[b], !0);
  }, a.removeAll = function () {
    for (var b in a.channels) a.channels[b]._removeAll();a.channels = {};
  }, a.add = function (b, c) {
    var d = a.get(b.src);return null == d ? !1 : d._add(b, c);
  }, a.remove = function (b) {
    var c = a.get(b.src);return null == c ? !1 : (c._remove(b), !0);
  }, a.maxPerChannel = function () {
    return c.maxDefault;
  }, a.get = function (b) {
    return a.channels[b];
  };var c = a.prototype;c.constructor = a, c.src = null, c.max = null, c.maxDefault = 100, c.length = 0, c.init = function (a, b) {
    this.src = a, this.max = b || this.maxDefault, -1 == this.max && (this.max = this.maxDefault), this._instances = [];
  }, c._get = function (a) {
    return this._instances[a];
  }, c._add = function (a, b) {
    return this._getSlot(b, a) ? (this._instances.push(a), this.length++, !0) : !1;
  }, c._remove = function (a) {
    var b = createjs.indexOf(this._instances, a);return -1 == b ? !1 : (this._instances.splice(b, 1), this.length--, !0);
  }, c._removeAll = function () {
    for (var a = this.length - 1; a >= 0; a--) this._instances[a].stop();
  }, c._getSlot = function (a) {
    var b, c;if (a != Sound.INTERRUPT_NONE && (c = this._get(0), null == c)) return !0;for (var d = 0, e = this.max; e > d; d++) {
      if (b = this._get(d), null == b) return !0;if (b.playState == Sound.PLAY_FINISHED || b.playState == Sound.PLAY_INTERRUPTED || b.playState == Sound.PLAY_FAILED) {
        c = b;break;
      }a != Sound.INTERRUPT_NONE && (a == Sound.INTERRUPT_EARLY && b.getPosition() < c.getPosition() || a == Sound.INTERRUPT_LATE && b.getPosition() > c.getPosition()) && (c = b);
    }return null != c ? (c._interrupt(), this._remove(c), !0) : !1;
  }, c.toString = function () {
    return "[Sound SoundChannel]";
  };
}(), this.createjs = this.createjs || {}, function () {
  "use strict";
  var AbstractSoundInstance = function (a, b, c, d) {
    this.EventDispatcher_constructor(), this.src = a, this.uniqueId = -1, this.playState = null, this.delayTimeoutId = null, this._volume = 1, Object.defineProperty(this, "volume", { get: this.getVolume, set: this.setVolume }), this._pan = 0, Object.defineProperty(this, "pan", { get: this.getPan, set: this.setPan }), this._startTime = Math.max(0, b || 0), Object.defineProperty(this, "startTime", { get: this.getStartTime, set: this.setStartTime }), this._duration = Math.max(0, c || 0), Object.defineProperty(this, "duration", { get: this.getDuration, set: this.setDuration }), this._playbackResource = null, Object.defineProperty(this, "playbackResource", { get: this.getPlaybackResource, set: this.setPlaybackResource }), d !== !1 && d !== !0 && this.setPlaybackResource(d), this._position = 0, Object.defineProperty(this, "position", { get: this.getPosition, set: this.setPosition }), this._loop = 0, Object.defineProperty(this, "loop", { get: this.getLoop, set: this.setLoop }), this._muted = !1, Object.defineProperty(this, "muted", { get: this.getMuted, set: this.setMuted }), this._paused = !1, Object.defineProperty(this, "paused", { get: this.getPaused, set: this.setPaused });
  },
      a = createjs.extend(AbstractSoundInstance, createjs.EventDispatcher);a.play = function (a, b, c, d, e, f) {
    var g;return g = createjs.PlayPropsConfig.create(a instanceof Object || a instanceof createjs.PlayPropsConfig ? a : { interrupt: a, delay: b, offset: c, loop: d, volume: e, pan: f }), this.playState == createjs.Sound.PLAY_SUCCEEDED ? (this.applyPlayProps(g), void (this._paused && this.setPaused(!1))) : (this._cleanUp(), createjs.Sound._playInstance(this, g), this);
  }, a.stop = function () {
    return this._position = 0, this._paused = !1, this._handleStop(), this._cleanUp(), this.playState = createjs.Sound.PLAY_FINISHED, this;
  }, a.destroy = function () {
    this._cleanUp(), this.src = null, this.playbackResource = null, this.removeAllEventListeners();
  }, a.applyPlayProps = function (a) {
    return null != a.offset && this.setPosition(a.offset), null != a.loop && this.setLoop(a.loop), null != a.volume && this.setVolume(a.volume), null != a.pan && this.setPan(a.pan), null != a.startTime && (this.setStartTime(a.startTime), this.setDuration(a.duration)), this;
  }, a.toString = function () {
    return "[AbstractSoundInstance]";
  }, a.getPaused = function () {
    return this._paused;
  }, a.setPaused = function (a) {
    return a !== !0 && a !== !1 || this._paused == a || 1 == a && this.playState != createjs.Sound.PLAY_SUCCEEDED ? void 0 : (this._paused = a, a ? this._pause() : this._resume(), clearTimeout(this.delayTimeoutId), this);
  }, a.setVolume = function (a) {
    return a == this._volume ? this : (this._volume = Math.max(0, Math.min(1, a)), this._muted || this._updateVolume(), this);
  }, a.getVolume = function () {
    return this._volume;
  }, a.setMuted = function (a) {
    return a === !0 || a === !1 ? (this._muted = a, this._updateVolume(), this) : void 0;
  }, a.getMuted = function () {
    return this._muted;
  }, a.setPan = function (a) {
    return a == this._pan ? this : (this._pan = Math.max(-1, Math.min(1, a)), this._updatePan(), this);
  }, a.getPan = function () {
    return this._pan;
  }, a.getPosition = function () {
    return this._paused || this.playState != createjs.Sound.PLAY_SUCCEEDED || (this._position = this._calculateCurrentPosition()), this._position;
  }, a.setPosition = function (a) {
    return this._position = Math.max(0, a), this.playState == createjs.Sound.PLAY_SUCCEEDED && this._updatePosition(), this;
  }, a.getStartTime = function () {
    return this._startTime;
  }, a.setStartTime = function (a) {
    return a == this._startTime ? this : (this._startTime = Math.max(0, a || 0), this._updateStartTime(), this);
  }, a.getDuration = function () {
    return this._duration;
  }, a.setDuration = function (a) {
    return a == this._duration ? this : (this._duration = Math.max(0, a || 0), this._updateDuration(), this);
  }, a.setPlaybackResource = function (a) {
    return this._playbackResource = a, 0 == this._duration && this._setDurationFromSource(), this;
  }, a.getPlaybackResource = function () {
    return this._playbackResource;
  }, a.getLoop = function () {
    return this._loop;
  }, a.setLoop = function (a) {
    null != this._playbackResource && (0 != this._loop && 0 == a ? this._removeLooping(a) : 0 == this._loop && 0 != a && this._addLooping(a)), this._loop = a;
  }, a._sendEvent = function (a) {
    var b = new createjs.Event(a);this.dispatchEvent(b);
  }, a._cleanUp = function () {
    clearTimeout(this.delayTimeoutId), this._handleCleanUp(), this._paused = !1, createjs.Sound._playFinished(this);
  }, a._interrupt = function () {
    this._cleanUp(), this.playState = createjs.Sound.PLAY_INTERRUPTED, this._sendEvent("interrupted");
  }, a._beginPlaying = function (a) {
    return this.setPosition(a.offset), this.setLoop(a.loop), this.setVolume(a.volume), this.setPan(a.pan), null != a.startTime && (this.setStartTime(a.startTime), this.setDuration(a.duration)), null != this._playbackResource && this._position < this._duration ? (this._paused = !1, this._handleSoundReady(), this.playState = createjs.Sound.PLAY_SUCCEEDED, this._sendEvent("succeeded"), !0) : (this._playFailed(), !1);
  }, a._playFailed = function () {
    this._cleanUp(), this.playState = createjs.Sound.PLAY_FAILED, this._sendEvent("failed");
  }, a._handleSoundComplete = function () {
    return this._position = 0, 0 != this._loop ? (this._loop--, this._handleLoop(), void this._sendEvent("loop")) : (this._cleanUp(), this.playState = createjs.Sound.PLAY_FINISHED, void this._sendEvent("complete"));
  }, a._handleSoundReady = function () {}, a._updateVolume = function () {}, a._updatePan = function () {}, a._updateStartTime = function () {}, a._updateDuration = function () {}, a._setDurationFromSource = function () {}, a._calculateCurrentPosition = function () {}, a._updatePosition = function () {}, a._removeLooping = function () {}, a._addLooping = function () {}, a._pause = function () {}, a._resume = function () {}, a._handleStop = function () {}, a._handleCleanUp = function () {}, a._handleLoop = function () {}, createjs.AbstractSoundInstance = createjs.promote(AbstractSoundInstance, "EventDispatcher"), createjs.DefaultSoundInstance = createjs.AbstractSoundInstance;
}(), this.createjs = this.createjs || {}, function () {
  "use strict";
  var AbstractPlugin = function () {
    this._capabilities = null, this._loaders = {}, this._audioSources = {}, this._soundInstances = {}, this._volume = 1, this._loaderClass, this._soundInstanceClass;
  },
      a = AbstractPlugin.prototype;AbstractPlugin._capabilities = null, AbstractPlugin.isSupported = function () {
    return !0;
  }, a.register = function (a) {
    var b = this._loaders[a.src];return b && !b.canceled ? this._loaders[a.src] : (this._audioSources[a.src] = !0, this._soundInstances[a.src] = [], b = new this._loaderClass(a), b.on("complete", this._handlePreloadComplete, this), this._loaders[a.src] = b, b);
  }, a.preload = function (a) {
    a.on("error", this._handlePreloadError, this), a.load();
  }, a.isPreloadStarted = function (a) {
    return null != this._audioSources[a];
  }, a.isPreloadComplete = function (a) {
    return !(null == this._audioSources[a] || 1 == this._audioSources[a]);
  }, a.removeSound = function (a) {
    if (this._soundInstances[a]) {
      for (var b = this._soundInstances[a].length; b--;) {
        var c = this._soundInstances[a][b];c.destroy();
      }delete this._soundInstances[a], delete this._audioSources[a], this._loaders[a] && this._loaders[a].destroy(), delete this._loaders[a];
    }
  }, a.removeAllSounds = function () {
    for (var a in this._audioSources) this.removeSound(a);
  }, a.create = function (a, b, c) {
    this.isPreloadStarted(a) || this.preload(this.register(a));var d = new this._soundInstanceClass(a, b, c, this._audioSources[a]);return this._soundInstances[a].push(d), d;
  }, a.setVolume = function (a) {
    return this._volume = a, this._updateVolume(), !0;
  }, a.getVolume = function () {
    return this._volume;
  }, a.setMute = function () {
    return this._updateVolume(), !0;
  }, a.toString = function () {
    return "[AbstractPlugin]";
  }, a._handlePreloadComplete = function (a) {
    var b = a.target.getItem().src;this._audioSources[b] = a.result;for (var c = 0, d = this._soundInstances[b].length; d > c; c++) {
      var e = this._soundInstances[b][c];e.setPlaybackResource(this._audioSources[b]);
    }
  }, a._handlePreloadError = function () {}, a._updateVolume = function () {}, createjs.AbstractPlugin = AbstractPlugin;
}(), this.createjs = this.createjs || {}, function () {
  "use strict";
  function a(a) {
    this.AbstractLoader_constructor(a, !0, createjs.AbstractLoader.SOUND);
  }var b = createjs.extend(a, createjs.AbstractLoader);a.context = null, b.toString = function () {
    return "[WebAudioLoader]";
  }, b._createRequest = function () {
    this._request = new createjs.XHRRequest(this._item, !1), this._request.setResponseType("arraybuffer");
  }, b._sendComplete = function () {
    a.context.decodeAudioData(this._rawResult, createjs.proxy(this._handleAudioDecoded, this), createjs.proxy(this._sendError, this));
  }, b._handleAudioDecoded = function (a) {
    this._result = a, this.AbstractLoader__sendComplete();
  }, createjs.WebAudioLoader = createjs.promote(a, "AbstractLoader");
}(), this.createjs = this.createjs || {}, function () {
  "use strict";
  function WebAudioSoundInstance(a, c, d, e) {
    this.AbstractSoundInstance_constructor(a, c, d, e), this.gainNode = b.context.createGain(), this.panNode = b.context.createPanner(), this.panNode.panningModel = b._panningModel, this.panNode.connect(this.gainNode), this._updatePan(), this.sourceNode = null, this._soundCompleteTimeout = null, this._sourceNodeNext = null, this._playbackStartTime = 0, this._endedHandler = createjs.proxy(this._handleSoundComplete, this);
  }var a = createjs.extend(WebAudioSoundInstance, createjs.AbstractSoundInstance),
      b = WebAudioSoundInstance;b.context = null, b._scratchBuffer = null, b.destinationNode = null, b._panningModel = "equalpower", a.destroy = function () {
    this.AbstractSoundInstance_destroy(), this.panNode.disconnect(0), this.panNode = null, this.gainNode.disconnect(0), this.gainNode = null;
  }, a.toString = function () {
    return "[WebAudioSoundInstance]";
  }, a._updatePan = function () {
    this.panNode.setPosition(this._pan, 0, -.5);
  }, a._removeLooping = function () {
    this._sourceNodeNext = this._cleanUpAudioNode(this._sourceNodeNext);
  }, a._addLooping = function () {
    this.playState == createjs.Sound.PLAY_SUCCEEDED && (this._sourceNodeNext = this._createAndPlayAudioNode(this._playbackStartTime, 0));
  }, a._setDurationFromSource = function () {
    this._duration = 1e3 * this.playbackResource.duration;
  }, a._handleCleanUp = function () {
    this.sourceNode && this.playState == createjs.Sound.PLAY_SUCCEEDED && (this.sourceNode = this._cleanUpAudioNode(this.sourceNode), this._sourceNodeNext = this._cleanUpAudioNode(this._sourceNodeNext)), 0 != this.gainNode.numberOfOutputs && this.gainNode.disconnect(0), clearTimeout(this._soundCompleteTimeout), this._playbackStartTime = 0;
  }, a._cleanUpAudioNode = function (a) {
    if (a) {
      a.stop(0), a.disconnect(0);try {
        a.buffer = b._scratchBuffer;
      } catch (c) {}a = null;
    }return a;
  }, a._handleSoundReady = function () {
    this.gainNode.connect(b.destinationNode);var a = .001 * this._duration,
        c = .001 * this._position;c > a && (c = a), this.sourceNode = this._createAndPlayAudioNode(b.context.currentTime - a, c), this._playbackStartTime = this.sourceNode.startTime - c, this._soundCompleteTimeout = setTimeout(this._endedHandler, 1e3 * (a - c)), 0 != this._loop && (this._sourceNodeNext = this._createAndPlayAudioNode(this._playbackStartTime, 0));
  }, a._createAndPlayAudioNode = function (a, c) {
    var d = b.context.createBufferSource();d.buffer = this.playbackResource, d.connect(this.panNode);var e = .001 * this._duration;return d.startTime = a + e, d.start(d.startTime, c + .001 * this._startTime, e - c), d;
  }, a._pause = function () {
    this._position = 1e3 * (b.context.currentTime - this._playbackStartTime), this.sourceNode = this._cleanUpAudioNode(this.sourceNode), this._sourceNodeNext = this._cleanUpAudioNode(this._sourceNodeNext), 0 != this.gainNode.numberOfOutputs && this.gainNode.disconnect(0), clearTimeout(this._soundCompleteTimeout);
  }, a._resume = function () {
    this._handleSoundReady();
  }, a._updateVolume = function () {
    var a = this._muted ? 0 : this._volume;a != this.gainNode.gain.value && (this.gainNode.gain.value = a);
  }, a._calculateCurrentPosition = function () {
    return 1e3 * (b.context.currentTime - this._playbackStartTime);
  }, a._updatePosition = function () {
    this.sourceNode = this._cleanUpAudioNode(this.sourceNode), this._sourceNodeNext = this._cleanUpAudioNode(this._sourceNodeNext), clearTimeout(this._soundCompleteTimeout), this._paused || this._handleSoundReady();
  }, a._handleLoop = function () {
    this._cleanUpAudioNode(this.sourceNode), this.sourceNode = this._sourceNodeNext, this._playbackStartTime = this.sourceNode.startTime, this._sourceNodeNext = this._createAndPlayAudioNode(this._playbackStartTime, 0), this._soundCompleteTimeout = setTimeout(this._endedHandler, this._duration);
  }, a._updateDuration = function () {
    this.playState == createjs.Sound.PLAY_SUCCEEDED && (this._pause(), this._resume());
  }, createjs.WebAudioSoundInstance = createjs.promote(WebAudioSoundInstance, "AbstractSoundInstance");
}(), this.createjs = this.createjs || {}, function () {
  "use strict";
  function WebAudioPlugin() {
    this.AbstractPlugin_constructor(), this._panningModel = b._panningModel, this.context = b.context, this.dynamicsCompressorNode = this.context.createDynamicsCompressor(), this.dynamicsCompressorNode.connect(this.context.destination), this.gainNode = this.context.createGain(), this.gainNode.connect(this.dynamicsCompressorNode), createjs.WebAudioSoundInstance.destinationNode = this.gainNode, this._capabilities = b._capabilities, this._loaderClass = createjs.WebAudioLoader, this._soundInstanceClass = createjs.WebAudioSoundInstance, this._addPropsToClasses();
  }var a = createjs.extend(WebAudioPlugin, createjs.AbstractPlugin),
      b = WebAudioPlugin;b._capabilities = null, b._panningModel = "equalpower", b.context = null, b._scratchBuffer = null, b._unlocked = !1, b.isSupported = function () {
    var a = createjs.BrowserDetect.isIOS || createjs.BrowserDetect.isAndroid || createjs.BrowserDetect.isBlackberry;return "file:" != location.protocol || a || this._isFileXHRSupported() ? (b._generateCapabilities(), null == b.context ? !1 : !0) : !1;
  }, b.playEmptySound = function () {
    if (null != b.context) {
      var a = b.context.createBufferSource();a.buffer = b._scratchBuffer, a.connect(b.context.destination), a.start(0, 0, 0);
    }
  }, b._isFileXHRSupported = function () {
    var a = !0,
        b = new XMLHttpRequest();try {
      b.open("GET", "WebAudioPluginTest.fail", !1);
    } catch (c) {
      return a = !1;
    }b.onerror = function () {
      a = !1;
    }, b.onload = function () {
      a = 404 == this.status || 200 == this.status || 0 == this.status && "" != this.response;
    };try {
      b.send();
    } catch (c) {
      a = !1;
    }return a;
  }, b._generateCapabilities = function () {
    if (null == b._capabilities) {
      var a = document.createElement("audio");if (null == a.canPlayType) return null;if (null == b.context) if (window.AudioContext) b.context = new AudioContext();else {
        if (!window.webkitAudioContext) return null;b.context = new webkitAudioContext();
      }null == b._scratchBuffer && (b._scratchBuffer = b.context.createBuffer(1, 1, 22050)), b._compatibilitySetUp(), "ontouchstart" in window && "running" != b.context.state && (b._unlock(), document.addEventListener("mousedown", b._unlock, !0), document.addEventListener("touchend", b._unlock, !0)), b._capabilities = { panning: !0, volume: !0, tracks: -1 };for (var c = createjs.Sound.SUPPORTED_EXTENSIONS, d = createjs.Sound.EXTENSION_MAP, e = 0, f = c.length; f > e; e++) {
        var g = c[e],
            h = d[g] || g;b._capabilities[g] = "no" != a.canPlayType("audio/" + g) && "" != a.canPlayType("audio/" + g) || "no" != a.canPlayType("audio/" + h) && "" != a.canPlayType("audio/" + h);
      }b.context.destination.numberOfChannels < 2 && (b._capabilities.panning = !1);
    }
  }, b._compatibilitySetUp = function () {
    if (b._panningModel = "equalpower", !b.context.createGain) {
      b.context.createGain = b.context.createGainNode;var a = b.context.createBufferSource();a.__proto__.start = a.__proto__.noteGrainOn, a.__proto__.stop = a.__proto__.noteOff, b._panningModel = 0;
    }
  }, b._unlock = function () {
    b._unlocked || (b.playEmptySound(), "running" == b.context.state && (document.removeEventListener("mousedown", b._unlock, !0), document.removeEventListener("touchend", b._unlock, !0), b._unlocked = !0));
  }, a.toString = function () {
    return "[WebAudioPlugin]";
  }, a._addPropsToClasses = function () {
    var a = this._soundInstanceClass;a.context = this.context, a._scratchBuffer = b._scratchBuffer, a.destinationNode = this.gainNode, a._panningModel = this._panningModel, this._loaderClass.context = this.context;
  }, a._updateVolume = function () {
    var a = createjs.Sound._masterMute ? 0 : this._volume;a != this.gainNode.gain.value && (this.gainNode.gain.value = a);
  }, createjs.WebAudioPlugin = createjs.promote(WebAudioPlugin, "AbstractPlugin");
}(), this.createjs = this.createjs || {}, function () {
  "use strict";
  function HTMLAudioTagPool() {
    throw "HTMLAudioTagPool cannot be instantiated";
  }function a() {
    this._tags = [];
  }var b = HTMLAudioTagPool;b._tags = {}, b._tagPool = new a(), b._tagUsed = {}, b.get = function (a) {
    var c = b._tags[a];return null == c ? (c = b._tags[a] = b._tagPool.get(), c.src = a) : b._tagUsed[a] ? (c = b._tagPool.get(), c.src = a) : b._tagUsed[a] = !0, c;
  }, b.set = function (a, c) {
    c == b._tags[a] ? b._tagUsed[a] = !1 : b._tagPool.set(c);
  }, b.remove = function (a) {
    var c = b._tags[a];return null == c ? !1 : (b._tagPool.set(c), delete b._tags[a], delete b._tagUsed[a], !0);
  }, b.getDuration = function (a) {
    var c = b._tags[a];return null != c && c.duration ? 1e3 * c.duration : 0;
  }, createjs.HTMLAudioTagPool = HTMLAudioTagPool;var c = a.prototype;c.constructor = a, c.get = function () {
    var a;return a = 0 == this._tags.length ? this._createTag() : this._tags.pop(), null == a.parentNode && document.body.appendChild(a), a;
  }, c.set = function (a) {
    var b = createjs.indexOf(this._tags, a);-1 == b && (this._tags.src = null, this._tags.push(a));
  }, c.toString = function () {
    return "[TagPool]";
  }, c._createTag = function () {
    var a = document.createElement("audio");return a.autoplay = !1, a.preload = "none", a;
  };
}(), this.createjs = this.createjs || {}, function () {
  "use strict";
  function HTMLAudioSoundInstance(a, b, c, d) {
    this.AbstractSoundInstance_constructor(a, b, c, d), this._audioSpriteStopTime = null, this._delayTimeoutId = null, this._endedHandler = createjs.proxy(this._handleSoundComplete, this), this._readyHandler = createjs.proxy(this._handleTagReady, this), this._stalledHandler = createjs.proxy(this._playFailed, this), this._audioSpriteEndHandler = createjs.proxy(this._handleAudioSpriteLoop, this), this._loopHandler = createjs.proxy(this._handleSoundComplete, this), c ? this._audioSpriteStopTime = .001 * (b + c) : this._duration = createjs.HTMLAudioTagPool.getDuration(this.src);
  }var a = createjs.extend(HTMLAudioSoundInstance, createjs.AbstractSoundInstance);a.setMasterVolume = function () {
    this._updateVolume();
  }, a.setMasterMute = function () {
    this._updateVolume();
  }, a.toString = function () {
    return "[HTMLAudioSoundInstance]";
  }, a._removeLooping = function () {
    null != this._playbackResource && (this._playbackResource.loop = !1, this._playbackResource.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._loopHandler, !1));
  }, a._addLooping = function () {
    null == this._playbackResource || this._audioSpriteStopTime || (this._playbackResource.addEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._loopHandler, !1), this._playbackResource.loop = !0);
  }, a._handleCleanUp = function () {
    var a = this._playbackResource;if (null != a) {
      a.pause(), a.loop = !1, a.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_ENDED, this._endedHandler, !1), a.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_READY, this._readyHandler, !1), a.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_STALLED, this._stalledHandler, !1), a.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._loopHandler, !1), a.removeEventListener(createjs.HTMLAudioPlugin._TIME_UPDATE, this._audioSpriteEndHandler, !1);try {
        a.currentTime = this._startTime;
      } catch (b) {}createjs.HTMLAudioTagPool.set(this.src, a), this._playbackResource = null;
    }
  }, a._beginPlaying = function (a) {
    return this._playbackResource = createjs.HTMLAudioTagPool.get(this.src), this.AbstractSoundInstance__beginPlaying(a);
  }, a._handleSoundReady = function () {
    if (4 !== this._playbackResource.readyState) {
      var a = this._playbackResource;return a.addEventListener(createjs.HTMLAudioPlugin._AUDIO_READY, this._readyHandler, !1), a.addEventListener(createjs.HTMLAudioPlugin._AUDIO_STALLED, this._stalledHandler, !1), a.preload = "auto", void a.load();
    }this._updateVolume(), this._playbackResource.currentTime = .001 * (this._startTime + this._position), this._audioSpriteStopTime ? this._playbackResource.addEventListener(createjs.HTMLAudioPlugin._TIME_UPDATE, this._audioSpriteEndHandler, !1) : (this._playbackResource.addEventListener(createjs.HTMLAudioPlugin._AUDIO_ENDED, this._endedHandler, !1), 0 != this._loop && (this._playbackResource.addEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._loopHandler, !1), this._playbackResource.loop = !0)), this._playbackResource.play();
  }, a._handleTagReady = function () {
    this._playbackResource.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_READY, this._readyHandler, !1), this._playbackResource.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_STALLED, this._stalledHandler, !1), this._handleSoundReady();
  }, a._pause = function () {
    this._playbackResource.pause();
  }, a._resume = function () {
    this._playbackResource.play();
  }, a._updateVolume = function () {
    if (null != this._playbackResource) {
      var a = this._muted || createjs.Sound._masterMute ? 0 : this._volume * createjs.Sound._masterVolume;a != this._playbackResource.volume && (this._playbackResource.volume = a);
    }
  }, a._calculateCurrentPosition = function () {
    return 1e3 * this._playbackResource.currentTime - this._startTime;
  }, a._updatePosition = function () {
    this._playbackResource.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._loopHandler, !1), this._playbackResource.addEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._handleSetPositionSeek, !1);try {
      this._playbackResource.currentTime = .001 * (this._position + this._startTime);
    } catch (a) {
      this._handleSetPositionSeek(null);
    }
  }, a._handleSetPositionSeek = function () {
    null != this._playbackResource && (this._playbackResource.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._handleSetPositionSeek, !1), this._playbackResource.addEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._loopHandler, !1));
  }, a._handleAudioSpriteLoop = function () {
    this._playbackResource.currentTime <= this._audioSpriteStopTime || (this._playbackResource.pause(), 0 == this._loop ? this._handleSoundComplete(null) : (this._position = 0, this._loop--, this._playbackResource.currentTime = .001 * this._startTime, this._paused || this._playbackResource.play(), this._sendEvent("loop")));
  }, a._handleLoop = function () {
    0 == this._loop && (this._playbackResource.loop = !1, this._playbackResource.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED, this._loopHandler, !1));
  }, a._updateStartTime = function () {
    this._audioSpriteStopTime = .001 * (this._startTime + this._duration), this.playState == createjs.Sound.PLAY_SUCCEEDED && (this._playbackResource.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_ENDED, this._endedHandler, !1), this._playbackResource.addEventListener(createjs.HTMLAudioPlugin._TIME_UPDATE, this._audioSpriteEndHandler, !1));
  }, a._updateDuration = function () {
    this._audioSpriteStopTime = .001 * (this._startTime + this._duration), this.playState == createjs.Sound.PLAY_SUCCEEDED && (this._playbackResource.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_ENDED, this._endedHandler, !1), this._playbackResource.addEventListener(createjs.HTMLAudioPlugin._TIME_UPDATE, this._audioSpriteEndHandler, !1));
  }, a._setDurationFromSource = function () {
    this._duration = createjs.HTMLAudioTagPool.getDuration(this.src), this._playbackResource = null;
  }, createjs.HTMLAudioSoundInstance = createjs.promote(HTMLAudioSoundInstance, "AbstractSoundInstance");
}(), this.createjs = this.createjs || {}, function () {
  "use strict";
  function HTMLAudioPlugin() {
    this.AbstractPlugin_constructor(), this.defaultNumChannels = 2, this._capabilities = b._capabilities, this._loaderClass = createjs.SoundLoader, this._soundInstanceClass = createjs.HTMLAudioSoundInstance;
  }var a = createjs.extend(HTMLAudioPlugin, createjs.AbstractPlugin),
      b = HTMLAudioPlugin;b.MAX_INSTANCES = 30, b._AUDIO_READY = "canplaythrough", b._AUDIO_ENDED = "ended", b._AUDIO_SEEKED = "seeked", b._AUDIO_STALLED = "stalled", b._TIME_UPDATE = "timeupdate", b._capabilities = null, b.isSupported = function () {
    return b._generateCapabilities(), null != b._capabilities;
  }, b._generateCapabilities = function () {
    if (null == b._capabilities) {
      var a = document.createElement("audio");if (null == a.canPlayType) return null;b._capabilities = { panning: !1, volume: !0, tracks: -1 };for (var c = createjs.Sound.SUPPORTED_EXTENSIONS, d = createjs.Sound.EXTENSION_MAP, e = 0, f = c.length; f > e; e++) {
        var g = c[e],
            h = d[g] || g;b._capabilities[g] = "no" != a.canPlayType("audio/" + g) && "" != a.canPlayType("audio/" + g) || "no" != a.canPlayType("audio/" + h) && "" != a.canPlayType("audio/" + h);
      }
    }
  }, a.register = function (a) {
    var b = createjs.HTMLAudioTagPool.get(a.src),
        c = this.AbstractPlugin_register(a);return c.setTag(b), c;
  }, a.removeSound = function (a) {
    this.AbstractPlugin_removeSound(a), createjs.HTMLAudioTagPool.remove(a);
  }, a.create = function (a, b, c) {
    var d = this.AbstractPlugin_create(a, b, c);return d.setPlaybackResource(null), d;
  }, a.toString = function () {
    return "[HTMLAudioPlugin]";
  }, a.setVolume = a.getVolume = a.setMute = null, createjs.HTMLAudioPlugin = createjs.promote(HTMLAudioPlugin, "AbstractPlugin");
}();
/**
 * @author sole / http://soledadpenades.com
 * @author mrdoob / http://mrdoob.com
 * @author Robert Eisele / http://www.xarg.org
 * @author Philippe / http://philippe.elsass.me
 * @author Robert Penner / http://www.robertpenner.com/easing_terms_of_use.html
 * @author Paul Lewis / http://www.aerotwist.com/
 * @author lechecacharro
 * @author Josh Faul / http://jocafa.com/
 * @author egraether / http://egraether.com/
 * @author jonobr1 / http://jonobr1.com/
 */

var TWEEN = TWEEN || function () {

	var _tweens = {},
	    _id = 0;

	return {

		REVISION: '10-br1',

		generateId: function () {

			var result = _id;
			_id++;
			return result;
		},

		getAll: function () {

			return _tweens;
		},

		removeAll: function () {

			_tweens = {};
		},

		add: function (tween) {

			_tweens[tween.id] = tween;
		},

		remove: function (tween) {

			delete _tweens[tween.id];
		},

		update: function (time) {

			time = time !== undefined ? time : window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now();

			for (var i in _tweens) {

				if (_tweens[i].update(time)) {

					i++;
				} else {

					delete _tweens[i];
				}
			}

			return true;
		}
	};
}();

TWEEN.Tween = function (object) {

	var _object = object;
	var _valuesStart = {};
	var _valuesEnd = {};
	var _valuesStartRepeat = {};
	var _duration = 1000;
	var _repeat = 0;
	var _delayTime = 0;
	var _startTime = null;
	var _easingFunction = TWEEN.Easing.Linear.None;
	var _interpolationFunction = TWEEN.Interpolation.Linear;
	var _chainedTweens = [];
	var _onStartCallback = null;
	var _onStartCallbackFired = false;
	var _onUpdateCallback = null;
	var _onCompleteCallback = null;

	this.id = TWEEN.generateId();

	this.to = function (properties, duration) {

		if (duration !== undefined) {

			_duration = duration;
		}

		_valuesEnd = properties;

		return this;
	};

	this.start = function (time) {

		TWEEN.add(this);

		_onStartCallbackFired = false;

		_startTime = time !== undefined ? time : window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now();
		_startTime += _delayTime;

		for (var property in _valuesEnd) {

			// This prevents the interpolation of null values or of non-existing properties
			if (property in _object === false || _object[property] === null) {

				continue;
			}

			// check if an Array was provided as property value
			if (_valuesEnd[property] instanceof Array) {

				if (_valuesEnd[property].length === 0) {

					continue;
				}

				// create a local copy of the Array with the start value at the front
				_valuesEnd[property] = [_object[property]].concat(_valuesEnd[property]);
			}

			_valuesStart[property] = _object[property];

			if (_valuesStart[property] instanceof Array == false) {
				_valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
			}

			_valuesStartRepeat[property] = _valuesStart[property];
		}

		return this;
	};

	this.stop = function () {

		TWEEN.remove(this);
		return this;
	};

	this.delay = function (amount) {

		_delayTime = amount;
		return this;
	};

	this.repeat = function (times) {

		_repeat = times;
		return this;
	};

	this.easing = function (easing) {

		_easingFunction = easing;
		return this;
	};

	this.interpolation = function (interpolation) {

		_interpolationFunction = interpolation;
		return this;
	};

	this.chain = function () {

		_chainedTweens = arguments;
		return this;
	};

	this.onStart = function (callback) {

		_onStartCallback = callback;
		return this;
	};

	this.onUpdate = function (callback) {

		_onUpdateCallback = callback;
		return this;
	};

	this.onComplete = function (callback) {

		_onCompleteCallback = callback;
		return this;
	};

	this.getObject = function () {

		return _object;
	};

	this.getOnComplete = function () {

		return _onCompleteCallback;
	};

	this.update = function (time) {

		if (time < _startTime) {

			return true;
		}

		if (_onStartCallbackFired === false) {

			if (_onStartCallback !== null) {

				_onStartCallback.call(_object);
			}

			_onStartCallbackFired = true;
		}

		var elapsed = (time - _startTime) / _duration;
		elapsed = elapsed > 1 ? 1 : elapsed;

		var value = _easingFunction(elapsed);

		for (var property in _valuesStart) {

			var start = _valuesStart[property];
			var end = _valuesEnd[property];

			if (end instanceof Array) {

				_object[property] = _interpolationFunction(end, value);
			} else {

				_object[property] = start + (end - start) * value;
			}
		}

		if (_onUpdateCallback !== null) {

			_onUpdateCallback.call(_object, value);
		}

		if (elapsed == 1) {

			if (_repeat > 0) {

				if (isFinite(_repeat)) {
					_repeat--;
				}

				// reassign starting values, restart by making startTime = now
				for (var property in _valuesStartRepeat) {
					_valuesStart[property] = _valuesStartRepeat[property];
				}
				_startTime = time + _delayTime;

				return true;
			} else {

				if (_onCompleteCallback !== null) {

					_onCompleteCallback.call(_object);
				}

				for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {

					_chainedTweens[i].start(time);
				}

				return false;
			}
		}

		return true;
	};
};

TWEEN.Easing = {

	Linear: {

		None: function (k) {

			return k;
		}

	},

	Quadratic: {

		In: function (k) {

			return k * k;
		},

		Out: function (k) {

			return k * (2 - k);
		},

		InOut: function (k) {

			if ((k *= 2) < 1) return 0.5 * k * k;
			return -0.5 * (--k * (k - 2) - 1);
		}

	},

	Cubic: {

		In: function (k) {

			return k * k * k;
		},

		Out: function (k) {

			return --k * k * k + 1;
		},

		InOut: function (k) {

			if ((k *= 2) < 1) return 0.5 * k * k * k;
			return 0.5 * ((k -= 2) * k * k + 2);
		}

	},

	Quartic: {

		In: function (k) {

			return k * k * k * k;
		},

		Out: function (k) {

			return 1 - --k * k * k * k;
		},

		InOut: function (k) {

			if ((k *= 2) < 1) return 0.5 * k * k * k * k;
			return -0.5 * ((k -= 2) * k * k * k - 2);
		}

	},

	Quintic: {

		In: function (k) {

			return k * k * k * k * k;
		},

		Out: function (k) {

			return --k * k * k * k * k + 1;
		},

		InOut: function (k) {

			if ((k *= 2) < 1) return 0.5 * k * k * k * k * k;
			return 0.5 * ((k -= 2) * k * k * k * k + 2);
		}

	},

	Sinusoidal: {

		In: function (k) {

			return 1 - Math.cos(k * Math.PI / 2);
		},

		Out: function (k) {

			return Math.sin(k * Math.PI / 2);
		},

		InOut: function (k) {

			return 0.5 * (1 - Math.cos(Math.PI * k));
		}

	},

	Exponential: {

		In: function (k) {

			return k === 0 ? 0 : Math.pow(1024, k - 1);
		},

		Out: function (k) {

			return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
		},

		InOut: function (k) {

			if (k === 0) return 0;
			if (k === 1) return 1;
			if ((k *= 2) < 1) return 0.5 * Math.pow(1024, k - 1);
			return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
		}

	},

	Circular: {

		In: function (k) {

			return 1 - Math.sqrt(1 - k * k);
		},

		Out: function (k) {

			return Math.sqrt(1 - --k * k);
		},

		InOut: function (k) {

			if ((k *= 2) < 1) return -0.5 * (Math.sqrt(1 - k * k) - 1);
			return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
		}

	},

	Elastic: {

		In: function (k) {

			var s,
			    a = 0.1,
			    p = 0.4;
			if (k === 0) return 0;
			if (k === 1) return 1;
			if (!a || a < 1) {
				a = 1;s = p / 4;
			} else s = p * Math.asin(1 / a) / (2 * Math.PI);
			return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
		},

		Out: function (k) {

			var s,
			    a = 0.1,
			    p = 0.4;
			if (k === 0) return 0;
			if (k === 1) return 1;
			if (!a || a < 1) {
				a = 1;s = p / 4;
			} else s = p * Math.asin(1 / a) / (2 * Math.PI);
			return a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1;
		},

		InOut: function (k) {

			var s,
			    a = 0.1,
			    p = 0.4;
			if (k === 0) return 0;
			if (k === 1) return 1;
			if (!a || a < 1) {
				a = 1;s = p / 4;
			} else s = p * Math.asin(1 / a) / (2 * Math.PI);
			if ((k *= 2) < 1) return -0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
			return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
		}

	},

	Back: {

		In: function (k) {

			var s = 1.70158;
			return k * k * ((s + 1) * k - s);
		},

		Out: function (k) {

			var s = 1.70158;
			return --k * k * ((s + 1) * k + s) + 1;
		},

		InOut: function (k) {

			var s = 1.70158 * 1.525;
			if ((k *= 2) < 1) return 0.5 * (k * k * ((s + 1) * k - s));
			return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
		}

	},

	Bounce: {

		In: function (k) {

			return 1 - TWEEN.Easing.Bounce.Out(1 - k);
		},

		Out: function (k) {

			if (k < 1 / 2.75) {

				return 7.5625 * k * k;
			} else if (k < 2 / 2.75) {

				return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
			} else if (k < 2.5 / 2.75) {

				return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
			} else {

				return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
			}
		},

		InOut: function (k) {

			if (k < 0.5) return TWEEN.Easing.Bounce.In(k * 2) * 0.5;
			return TWEEN.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
		}

	}

};

TWEEN.Interpolation = {

	Linear: function (v, k) {

		var m = v.length - 1,
		    f = m * k,
		    i = Math.floor(f),
		    fn = TWEEN.Interpolation.Utils.Linear;

		if (k < 0) return fn(v[0], v[1], f);
		if (k > 1) return fn(v[m], v[m - 1], m - f);

		return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
	},

	Bezier: function (v, k) {

		var b = 0,
		    n = v.length - 1,
		    pw = Math.pow,
		    bn = TWEEN.Interpolation.Utils.Bernstein,
		    i;

		for (i = 0; i <= n; i++) {
			b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
		}

		return b;
	},

	CatmullRom: function (v, k) {

		var m = v.length - 1,
		    f = m * k,
		    i = Math.floor(f),
		    fn = TWEEN.Interpolation.Utils.CatmullRom;

		if (v[0] === v[m]) {

			if (k < 0) i = Math.floor(f = m * (1 + k));

			return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
		} else {

			if (k < 0) return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
			if (k > 1) return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);

			return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
		}
	},

	Utils: {

		Linear: function (p0, p1, t) {

			return (p1 - p0) * t + p0;
		},

		Bernstein: function (n, i) {

			var fc = TWEEN.Interpolation.Utils.Factorial;
			return fc(n) / fc(i) / fc(n - i);
		},

		Factorial: function () {

			var a = [1];

			return function (n) {

				var s = 1,
				    i;
				if (a[n]) return a[n];
				for (i = n; i > 1; i--) s *= i;
				return a[n] = s;
			};
		}(),

		CatmullRom: function (p0, p1, p2, p3, t) {

			var v0 = (p2 - p0) * 0.5,
			    v1 = (p3 - p1) * 0.5,
			    t2 = t * t,
			    t3 = t * t2;
			return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
		}

	}

};
/**
 * two.js
 * a two-dimensional drawing api meant for modern browsers. It is renderer
 * agnostic enabling the same api for rendering in multiple contexts: webgl,
 * canvas2d, and svg.
 *
 * Copyright (c) 2012 - 2013 jonobr1 / http://jonobr1.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */ //     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
(function(){ // Baseline setup
// --------------
// Establish the root object, `window` in the browser, or `exports` on the server.
var root=this; // Save the previous value of the `_` variable.
var previousUnderscore=root._; // Save bytes in the minified (but not gzipped) version:
var ArrayProto=Array.prototype,ObjProto=Object.prototype,FuncProto=Function.prototype; // Create quick reference variables for speed access to core prototypes.
var push=ArrayProto.push,slice=ArrayProto.slice,toString=ObjProto.toString,hasOwnProperty=ObjProto.hasOwnProperty; // All **ECMAScript 5** native function implementations that we hope to use
// are declared here.
var nativeIsArray=Array.isArray,nativeKeys=Object.keys,nativeBind=FuncProto.bind,nativeCreate=Object.create; // Naked function reference for surrogate-prototype-swapping.
var Ctor=function(){}; // Create a safe reference to the Underscore object for use below.
var _=function(obj){if(obj instanceof _)return obj;if(!(this instanceof _))return new _(obj);this._wrapped=obj;}; // Export the Underscore object for **Node.js**, with
// backwards-compatibility for the old `require()` API. If we're in
// the browser, add `_` as a global object.
if(typeof exports!=='undefined'){if(typeof module!=='undefined'&&module.exports){exports=module.exports=_;}exports._=_;}else {root._=_;} // Current version.
_.VERSION='1.8.3'; // Internal function that returns an efficient (for current engines) version
// of the passed-in callback, to be repeatedly applied in other Underscore
// functions.
var optimizeCb=function(func,context,argCount){if(context===void 0)return func;switch(argCount==null?3:argCount){case 1:return function(value){return func.call(context,value);};case 2:return function(value,other){return func.call(context,value,other);};case 3:return function(value,index,collection){return func.call(context,value,index,collection);};case 4:return function(accumulator,value,index,collection){return func.call(context,accumulator,value,index,collection);};}return function(){return func.apply(context,arguments);};}; // A mostly-internal function to generate callbacks that can be applied
// to each element in a collection, returning the desired result — either
// identity, an arbitrary callback, a property matcher, or a property accessor.
var cb=function(value,context,argCount){if(value==null)return _.identity;if(_.isFunction(value))return optimizeCb(value,context,argCount);if(_.isObject(value))return _.matcher(value);return _.property(value);};_.iteratee=function(value,context){return cb(value,context,Infinity);}; // An internal function for creating assigner functions.
var createAssigner=function(keysFunc,undefinedOnly){return function(obj){var length=arguments.length;if(length<2||obj==null)return obj;for(var index=1;index<length;index++){var source=arguments[index],keys=keysFunc(source),l=keys.length;for(var i=0;i<l;i++){var key=keys[i];if(!undefinedOnly||obj[key]===void 0)obj[key]=source[key];}}return obj;};}; // An internal function for creating a new object that inherits from another.
var baseCreate=function(prototype){if(!_.isObject(prototype))return {};if(nativeCreate)return nativeCreate(prototype);Ctor.prototype=prototype;var result=new Ctor();Ctor.prototype=null;return result;};var property=function(key){return function(obj){return obj==null?void 0:obj[key];};}; // Helper for collection methods to determine whether a collection
// should be iterated as an array or as an object
// Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
// Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
var MAX_ARRAY_INDEX=Math.pow(2,53)-1;var getLength=property('length');var isArrayLike=function(collection){var length=getLength(collection);return typeof length=='number'&&length>=0&&length<=MAX_ARRAY_INDEX;}; // Collection Functions
// --------------------
// The cornerstone, an `each` implementation, aka `forEach`.
// Handles raw objects in addition to array-likes. Treats all
// sparse array-likes as if they were dense.
_.each=_.forEach=function(obj,iteratee,context){iteratee=optimizeCb(iteratee,context);var i,length;if(isArrayLike(obj)){for(i=0,length=obj.length;i<length;i++){iteratee(obj[i],i,obj);}}else {var keys=_.keys(obj);for(i=0,length=keys.length;i<length;i++){iteratee(obj[keys[i]],keys[i],obj);}}return obj;}; // Return the results of applying the iteratee to each element.
_.map=_.collect=function(obj,iteratee,context){iteratee=cb(iteratee,context);var keys=!isArrayLike(obj)&&_.keys(obj),length=(keys||obj).length,results=Array(length);for(var index=0;index<length;index++){var currentKey=keys?keys[index]:index;results[index]=iteratee(obj[currentKey],currentKey,obj);}return results;}; // Create a reducing function iterating left or right.
function createReduce(dir){ // Optimized iterator function as using arguments.length
// in the main function will deoptimize the, see #1991.
function iterator(obj,iteratee,memo,keys,index,length){for(;index>=0&&index<length;index+=dir){var currentKey=keys?keys[index]:index;memo=iteratee(memo,obj[currentKey],currentKey,obj);}return memo;}return function(obj,iteratee,memo,context){iteratee=optimizeCb(iteratee,context,4);var keys=!isArrayLike(obj)&&_.keys(obj),length=(keys||obj).length,index=dir>0?0:length-1; // Determine the initial value if none is provided.
if(arguments.length<3){memo=obj[keys?keys[index]:index];index+=dir;}return iterator(obj,iteratee,memo,keys,index,length);};} // **Reduce** builds up a single result from a list of values, aka `inject`,
// or `foldl`.
_.reduce=_.foldl=_.inject=createReduce(1); // The right-associative version of reduce, also known as `foldr`.
_.reduceRight=_.foldr=createReduce(-1); // Return the first value which passes a truth test. Aliased as `detect`.
_.find=_.detect=function(obj,predicate,context){var key;if(isArrayLike(obj)){key=_.findIndex(obj,predicate,context);}else {key=_.findKey(obj,predicate,context);}if(key!==void 0&&key!==-1)return obj[key];}; // Return all the elements that pass a truth test.
// Aliased as `select`.
_.filter=_.select=function(obj,predicate,context){var results=[];predicate=cb(predicate,context);_.each(obj,function(value,index,list){if(predicate(value,index,list))results.push(value);});return results;}; // Return all the elements for which a truth test fails.
_.reject=function(obj,predicate,context){return _.filter(obj,_.negate(cb(predicate)),context);}; // Determine whether all of the elements match a truth test.
// Aliased as `all`.
_.every=_.all=function(obj,predicate,context){predicate=cb(predicate,context);var keys=!isArrayLike(obj)&&_.keys(obj),length=(keys||obj).length;for(var index=0;index<length;index++){var currentKey=keys?keys[index]:index;if(!predicate(obj[currentKey],currentKey,obj))return false;}return true;}; // Determine if at least one element in the object matches a truth test.
// Aliased as `any`.
_.some=_.any=function(obj,predicate,context){predicate=cb(predicate,context);var keys=!isArrayLike(obj)&&_.keys(obj),length=(keys||obj).length;for(var index=0;index<length;index++){var currentKey=keys?keys[index]:index;if(predicate(obj[currentKey],currentKey,obj))return true;}return false;}; // Determine if the array or object contains a given item (using `===`).
// Aliased as `includes` and `include`.
_.contains=_.includes=_.include=function(obj,item,fromIndex,guard){if(!isArrayLike(obj))obj=_.values(obj);if(typeof fromIndex!='number'||guard)fromIndex=0;return _.indexOf(obj,item,fromIndex)>=0;}; // Invoke a method (with arguments) on every item in a collection.
_.invoke=function(obj,method){var args=slice.call(arguments,2);var isFunc=_.isFunction(method);return _.map(obj,function(value){var func=isFunc?method:value[method];return func==null?func:func.apply(value,args);});}; // Convenience version of a common use case of `map`: fetching a property.
_.pluck=function(obj,key){return _.map(obj,_.property(key));}; // Convenience version of a common use case of `filter`: selecting only objects
// containing specific `key:value` pairs.
_.where=function(obj,attrs){return _.filter(obj,_.matcher(attrs));}; // Convenience version of a common use case of `find`: getting the first object
// containing specific `key:value` pairs.
_.findWhere=function(obj,attrs){return _.find(obj,_.matcher(attrs));}; // Return the maximum element (or element-based computation).
_.max=function(obj,iteratee,context){var result=-Infinity,lastComputed=-Infinity,value,computed;if(iteratee==null&&obj!=null){obj=isArrayLike(obj)?obj:_.values(obj);for(var i=0,length=obj.length;i<length;i++){value=obj[i];if(value>result){result=value;}}}else {iteratee=cb(iteratee,context);_.each(obj,function(value,index,list){computed=iteratee(value,index,list);if(computed>lastComputed||computed===-Infinity&&result===-Infinity){result=value;lastComputed=computed;}});}return result;}; // Return the minimum element (or element-based computation).
_.min=function(obj,iteratee,context){var result=Infinity,lastComputed=Infinity,value,computed;if(iteratee==null&&obj!=null){obj=isArrayLike(obj)?obj:_.values(obj);for(var i=0,length=obj.length;i<length;i++){value=obj[i];if(value<result){result=value;}}}else {iteratee=cb(iteratee,context);_.each(obj,function(value,index,list){computed=iteratee(value,index,list);if(computed<lastComputed||computed===Infinity&&result===Infinity){result=value;lastComputed=computed;}});}return result;}; // Shuffle a collection, using the modern version of the
// [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
_.shuffle=function(obj){var set=isArrayLike(obj)?obj:_.values(obj);var length=set.length;var shuffled=Array(length);for(var index=0,rand;index<length;index++){rand=_.random(0,index);if(rand!==index)shuffled[index]=shuffled[rand];shuffled[rand]=set[index];}return shuffled;}; // Sample **n** random values from a collection.
// If **n** is not specified, returns a single random element.
// The internal `guard` argument allows it to work with `map`.
_.sample=function(obj,n,guard){if(n==null||guard){if(!isArrayLike(obj))obj=_.values(obj);return obj[_.random(obj.length-1)];}return _.shuffle(obj).slice(0,Math.max(0,n));}; // Sort the object's values by a criterion produced by an iteratee.
_.sortBy=function(obj,iteratee,context){iteratee=cb(iteratee,context);return _.pluck(_.map(obj,function(value,index,list){return {value:value,index:index,criteria:iteratee(value,index,list)};}).sort(function(left,right){var a=left.criteria;var b=right.criteria;if(a!==b){if(a>b||a===void 0)return 1;if(a<b||b===void 0)return -1;}return left.index-right.index;}),'value');}; // An internal function used for aggregate "group by" operations.
var group=function(behavior){return function(obj,iteratee,context){var result={};iteratee=cb(iteratee,context);_.each(obj,function(value,index){var key=iteratee(value,index,obj);behavior(result,value,key);});return result;};}; // Groups the object's values by a criterion. Pass either a string attribute
// to group by, or a function that returns the criterion.
_.groupBy=group(function(result,value,key){if(_.has(result,key))result[key].push(value);else result[key]=[value];}); // Indexes the object's values by a criterion, similar to `groupBy`, but for
// when you know that your index values will be unique.
_.indexBy=group(function(result,value,key){result[key]=value;}); // Counts instances of an object that group by a certain criterion. Pass
// either a string attribute to count by, or a function that returns the
// criterion.
_.countBy=group(function(result,value,key){if(_.has(result,key))result[key]++;else result[key]=1;}); // Safely create a real, live array from anything iterable.
_.toArray=function(obj){if(!obj)return [];if(_.isArray(obj))return slice.call(obj);if(isArrayLike(obj))return _.map(obj,_.identity);return _.values(obj);}; // Return the number of elements in an object.
_.size=function(obj){if(obj==null)return 0;return isArrayLike(obj)?obj.length:_.keys(obj).length;}; // Split a collection into two arrays: one whose elements all satisfy the given
// predicate, and one whose elements all do not satisfy the predicate.
_.partition=function(obj,predicate,context){predicate=cb(predicate,context);var pass=[],fail=[];_.each(obj,function(value,key,obj){(predicate(value,key,obj)?pass:fail).push(value);});return [pass,fail];}; // Array Functions
// ---------------
// Get the first element of an array. Passing **n** will return the first N
// values in the array. Aliased as `head` and `take`. The **guard** check
// allows it to work with `_.map`.
_.first=_.head=_.take=function(array,n,guard){if(array==null)return void 0;if(n==null||guard)return array[0];return _.initial(array,array.length-n);}; // Returns everything but the last entry of the array. Especially useful on
// the arguments object. Passing **n** will return all the values in
// the array, excluding the last N.
_.initial=function(array,n,guard){return slice.call(array,0,Math.max(0,array.length-(n==null||guard?1:n)));}; // Get the last element of an array. Passing **n** will return the last N
// values in the array.
_.last=function(array,n,guard){if(array==null)return void 0;if(n==null||guard)return array[array.length-1];return _.rest(array,Math.max(0,array.length-n));}; // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
// Especially useful on the arguments object. Passing an **n** will return
// the rest N values in the array.
_.rest=_.tail=_.drop=function(array,n,guard){return slice.call(array,n==null||guard?1:n);}; // Trim out all falsy values from an array.
_.compact=function(array){return _.filter(array,_.identity);}; // Internal implementation of a recursive `flatten` function.
var flatten=function(input,shallow,strict,startIndex){var output=[],idx=0;for(var i=startIndex||0,length=getLength(input);i<length;i++){var value=input[i];if(isArrayLike(value)&&(_.isArray(value)||_.isArguments(value))){ //flatten current level of array or arguments object
if(!shallow)value=flatten(value,shallow,strict);var j=0,len=value.length;output.length+=len;while(j<len){output[idx++]=value[j++];}}else if(!strict){output[idx++]=value;}}return output;}; // Flatten out an array, either recursively (by default), or just one level.
_.flatten=function(array,shallow){return flatten(array,shallow,false);}; // Return a version of the array that does not contain the specified value(s).
_.without=function(array){return _.difference(array,slice.call(arguments,1));}; // Produce a duplicate-free version of the array. If the array has already
// been sorted, you have the option of using a faster algorithm.
// Aliased as `unique`.
_.uniq=_.unique=function(array,isSorted,iteratee,context){if(!_.isBoolean(isSorted)){context=iteratee;iteratee=isSorted;isSorted=false;}if(iteratee!=null)iteratee=cb(iteratee,context);var result=[];var seen=[];for(var i=0,length=getLength(array);i<length;i++){var value=array[i],computed=iteratee?iteratee(value,i,array):value;if(isSorted){if(!i||seen!==computed)result.push(value);seen=computed;}else if(iteratee){if(!_.contains(seen,computed)){seen.push(computed);result.push(value);}}else if(!_.contains(result,value)){result.push(value);}}return result;}; // Produce an array that contains the union: each distinct element from all of
// the passed-in arrays.
_.union=function(){return _.uniq(flatten(arguments,true,true));}; // Produce an array that contains every item shared between all the
// passed-in arrays.
_.intersection=function(array){var result=[];var argsLength=arguments.length;for(var i=0,length=getLength(array);i<length;i++){var item=array[i];if(_.contains(result,item))continue;for(var j=1;j<argsLength;j++){if(!_.contains(arguments[j],item))break;}if(j===argsLength)result.push(item);}return result;}; // Take the difference between one array and a number of other arrays.
// Only the elements present in just the first array will remain.
_.difference=function(array){var rest=flatten(arguments,true,true,1);return _.filter(array,function(value){return !_.contains(rest,value);});}; // Zip together multiple lists into a single array -- elements that share
// an index go together.
_.zip=function(){return _.unzip(arguments);}; // Complement of _.zip. Unzip accepts an array of arrays and groups
// each array's elements on shared indices
_.unzip=function(array){var length=array&&_.max(array,getLength).length||0;var result=Array(length);for(var index=0;index<length;index++){result[index]=_.pluck(array,index);}return result;}; // Converts lists into objects. Pass either a single array of `[key, value]`
// pairs, or two parallel arrays of the same length -- one of keys, and one of
// the corresponding values.
_.object=function(list,values){var result={};for(var i=0,length=getLength(list);i<length;i++){if(values){result[list[i]]=values[i];}else {result[list[i][0]]=list[i][1];}}return result;}; // Generator function to create the findIndex and findLastIndex functions
function createPredicateIndexFinder(dir){return function(array,predicate,context){predicate=cb(predicate,context);var length=getLength(array);var index=dir>0?0:length-1;for(;index>=0&&index<length;index+=dir){if(predicate(array[index],index,array))return index;}return -1;};} // Returns the first index on an array-like that passes a predicate test
_.findIndex=createPredicateIndexFinder(1);_.findLastIndex=createPredicateIndexFinder(-1); // Use a comparator function to figure out the smallest index at which
// an object should be inserted so as to maintain order. Uses binary search.
_.sortedIndex=function(array,obj,iteratee,context){iteratee=cb(iteratee,context,1);var value=iteratee(obj);var low=0,high=getLength(array);while(low<high){var mid=Math.floor((low+high)/2);if(iteratee(array[mid])<value)low=mid+1;else high=mid;}return low;}; // Generator function to create the indexOf and lastIndexOf functions
function createIndexFinder(dir,predicateFind,sortedIndex){return function(array,item,idx){var i=0,length=getLength(array);if(typeof idx=='number'){if(dir>0){i=idx>=0?idx:Math.max(idx+length,i);}else {length=idx>=0?Math.min(idx+1,length):idx+length+1;}}else if(sortedIndex&&idx&&length){idx=sortedIndex(array,item);return array[idx]===item?idx:-1;}if(item!==item){idx=predicateFind(slice.call(array,i,length),_.isNaN);return idx>=0?idx+i:-1;}for(idx=dir>0?i:length-1;idx>=0&&idx<length;idx+=dir){if(array[idx]===item)return idx;}return -1;};} // Return the position of the first occurrence of an item in an array,
// or -1 if the item is not included in the array.
// If the array is large and already in sort order, pass `true`
// for **isSorted** to use binary search.
_.indexOf=createIndexFinder(1,_.findIndex,_.sortedIndex);_.lastIndexOf=createIndexFinder(-1,_.findLastIndex); // Generate an integer Array containing an arithmetic progression. A port of
// the native Python `range()` function. See
// [the Python documentation](http://docs.python.org/library/functions.html#range).
_.range=function(start,stop,step){if(stop==null){stop=start||0;start=0;}step=step||1;var length=Math.max(Math.ceil((stop-start)/step),0);var range=Array(length);for(var idx=0;idx<length;idx++,start+=step){range[idx]=start;}return range;}; // Function (ahem) Functions
// ------------------
// Determines whether to execute a function as a constructor
// or a normal function with the provided arguments
var executeBound=function(sourceFunc,boundFunc,context,callingContext,args){if(!(callingContext instanceof boundFunc))return sourceFunc.apply(context,args);var self=baseCreate(sourceFunc.prototype);var result=sourceFunc.apply(self,args);if(_.isObject(result))return result;return self;}; // Create a function bound to a given object (assigning `this`, and arguments,
// optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
// available.
_.bind=function(func,context){if(nativeBind&&func.bind===nativeBind)return nativeBind.apply(func,slice.call(arguments,1));if(!_.isFunction(func))throw new TypeError('Bind must be called on a function');var args=slice.call(arguments,2);var bound=function(){return executeBound(func,bound,context,this,args.concat(slice.call(arguments)));};return bound;}; // Partially apply a function by creating a version that has had some of its
// arguments pre-filled, without changing its dynamic `this` context. _ acts
// as a placeholder, allowing any combination of arguments to be pre-filled.
_.partial=function(func){var boundArgs=slice.call(arguments,1);var bound=function(){var position=0,length=boundArgs.length;var args=Array(length);for(var i=0;i<length;i++){args[i]=boundArgs[i]===_?arguments[position++]:boundArgs[i];}while(position<arguments.length)args.push(arguments[position++]);return executeBound(func,bound,this,this,args);};return bound;}; // Bind a number of an object's methods to that object. Remaining arguments
// are the method names to be bound. Useful for ensuring that all callbacks
// defined on an object belong to it.
_.bindAll=function(obj){var i,length=arguments.length,key;if(length<=1)throw new Error('bindAll must be passed function names');for(i=1;i<length;i++){key=arguments[i];obj[key]=_.bind(obj[key],obj);}return obj;}; // Memoize an expensive function by storing its results.
_.memoize=function(func,hasher){var memoize=function(key){var cache=memoize.cache;var address=''+(hasher?hasher.apply(this,arguments):key);if(!_.has(cache,address))cache[address]=func.apply(this,arguments);return cache[address];};memoize.cache={};return memoize;}; // Delays a function for the given number of milliseconds, and then calls
// it with the arguments supplied.
_.delay=function(func,wait){var args=slice.call(arguments,2);return setTimeout(function(){return func.apply(null,args);},wait);}; // Defers a function, scheduling it to run after the current call stack has
// cleared.
_.defer=_.partial(_.delay,_,1); // Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
_.throttle=function(func,wait,options){var context,args,result;var timeout=null;var previous=0;if(!options)options={};var later=function(){previous=options.leading===false?0:_.now();timeout=null;result=func.apply(context,args);if(!timeout)context=args=null;};return function(){var now=_.now();if(!previous&&options.leading===false)previous=now;var remaining=wait-(now-previous);context=this;args=arguments;if(remaining<=0||remaining>wait){if(timeout){clearTimeout(timeout);timeout=null;}previous=now;result=func.apply(context,args);if(!timeout)context=args=null;}else if(!timeout&&options.trailing!==false){timeout=setTimeout(later,remaining);}return result;};}; // Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
_.debounce=function(func,wait,immediate){var timeout,args,context,timestamp,result;var later=function(){var last=_.now()-timestamp;if(last<wait&&last>=0){timeout=setTimeout(later,wait-last);}else {timeout=null;if(!immediate){result=func.apply(context,args);if(!timeout)context=args=null;}}};return function(){context=this;args=arguments;timestamp=_.now();var callNow=immediate&&!timeout;if(!timeout)timeout=setTimeout(later,wait);if(callNow){result=func.apply(context,args);context=args=null;}return result;};}; // Returns the first function passed as an argument to the second,
// allowing you to adjust arguments, run code before and after, and
// conditionally execute the original function.
_.wrap=function(func,wrapper){return _.partial(wrapper,func);}; // Returns a negated version of the passed-in predicate.
_.negate=function(predicate){return function(){return !predicate.apply(this,arguments);};}; // Returns a function that is the composition of a list of functions, each
// consuming the return value of the function that follows.
_.compose=function(){var args=arguments;var start=args.length-1;return function(){var i=start;var result=args[start].apply(this,arguments);while(i--)result=args[i].call(this,result);return result;};}; // Returns a function that will only be executed on and after the Nth call.
_.after=function(times,func){return function(){if(--times<1){return func.apply(this,arguments);}};}; // Returns a function that will only be executed up to (but not including) the Nth call.
_.before=function(times,func){var memo;return function(){if(--times>0){memo=func.apply(this,arguments);}if(times<=1)func=null;return memo;};}; // Returns a function that will be executed at most one time, no matter how
// often you call it. Useful for lazy initialization.
_.once=_.partial(_.before,2); // Object Functions
// ----------------
// Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
var hasEnumBug=!{toString:null}.propertyIsEnumerable('toString');var nonEnumerableProps=['valueOf','isPrototypeOf','toString','propertyIsEnumerable','hasOwnProperty','toLocaleString'];function collectNonEnumProps(obj,keys){var nonEnumIdx=nonEnumerableProps.length;var constructor=obj.constructor;var proto=_.isFunction(constructor)&&constructor.prototype||ObjProto; // Constructor is a special case.
var prop='constructor';if(_.has(obj,prop)&&!_.contains(keys,prop))keys.push(prop);while(nonEnumIdx--){prop=nonEnumerableProps[nonEnumIdx];if(prop in obj&&obj[prop]!==proto[prop]&&!_.contains(keys,prop)){keys.push(prop);}}} // Retrieve the names of an object's own properties.
// Delegates to **ECMAScript 5**'s native `Object.keys`
_.keys=function(obj){if(!_.isObject(obj))return [];if(nativeKeys)return nativeKeys(obj);var keys=[];for(var key in obj)if(_.has(obj,key))keys.push(key); // Ahem, IE < 9.
if(hasEnumBug)collectNonEnumProps(obj,keys);return keys;}; // Retrieve all the property names of an object.
_.allKeys=function(obj){if(!_.isObject(obj))return [];var keys=[];for(var key in obj)keys.push(key); // Ahem, IE < 9.
if(hasEnumBug)collectNonEnumProps(obj,keys);return keys;}; // Retrieve the values of an object's properties.
_.values=function(obj){var keys=_.keys(obj);var length=keys.length;var values=Array(length);for(var i=0;i<length;i++){values[i]=obj[keys[i]];}return values;}; // Returns the results of applying the iteratee to each element of the object
// In contrast to _.map it returns an object
_.mapObject=function(obj,iteratee,context){iteratee=cb(iteratee,context);var keys=_.keys(obj),length=keys.length,results={},currentKey;for(var index=0;index<length;index++){currentKey=keys[index];results[currentKey]=iteratee(obj[currentKey],currentKey,obj);}return results;}; // Convert an object into a list of `[key, value]` pairs.
_.pairs=function(obj){var keys=_.keys(obj);var length=keys.length;var pairs=Array(length);for(var i=0;i<length;i++){pairs[i]=[keys[i],obj[keys[i]]];}return pairs;}; // Invert the keys and values of an object. The values must be serializable.
_.invert=function(obj){var result={};var keys=_.keys(obj);for(var i=0,length=keys.length;i<length;i++){result[obj[keys[i]]]=keys[i];}return result;}; // Return a sorted list of the function names available on the object.
// Aliased as `methods`
_.functions=_.methods=function(obj){var names=[];for(var key in obj){if(_.isFunction(obj[key]))names.push(key);}return names.sort();}; // Extend a given object with all the properties in passed-in object(s).
_.extend=createAssigner(_.allKeys); // Assigns a given object with all the own properties in the passed-in object(s)
// (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
_.extendOwn=_.assign=createAssigner(_.keys); // Returns the first key on an object that passes a predicate test
_.findKey=function(obj,predicate,context){predicate=cb(predicate,context);var keys=_.keys(obj),key;for(var i=0,length=keys.length;i<length;i++){key=keys[i];if(predicate(obj[key],key,obj))return key;}}; // Return a copy of the object only containing the whitelisted properties.
_.pick=function(object,oiteratee,context){var result={},obj=object,iteratee,keys;if(obj==null)return result;if(_.isFunction(oiteratee)){keys=_.allKeys(obj);iteratee=optimizeCb(oiteratee,context);}else {keys=flatten(arguments,false,false,1);iteratee=function(value,key,obj){return key in obj;};obj=Object(obj);}for(var i=0,length=keys.length;i<length;i++){var key=keys[i];var value=obj[key];if(iteratee(value,key,obj))result[key]=value;}return result;}; // Return a copy of the object without the blacklisted properties.
_.omit=function(obj,iteratee,context){if(_.isFunction(iteratee)){iteratee=_.negate(iteratee);}else {var keys=_.map(flatten(arguments,false,false,1),String);iteratee=function(value,key){return !_.contains(keys,key);};}return _.pick(obj,iteratee,context);}; // Fill in a given object with default properties.
_.defaults=createAssigner(_.allKeys,true); // Creates an object that inherits from the given prototype object.
// If additional properties are provided then they will be added to the
// created object.
_.create=function(prototype,props){var result=baseCreate(prototype);if(props)_.extendOwn(result,props);return result;}; // Create a (shallow-cloned) duplicate of an object.
_.clone=function(obj){if(!_.isObject(obj))return obj;return _.isArray(obj)?obj.slice():_.extend({},obj);}; // Invokes interceptor with the obj, and then returns obj.
// The primary purpose of this method is to "tap into" a method chain, in
// order to perform operations on intermediate results within the chain.
_.tap=function(obj,interceptor){interceptor(obj);return obj;}; // Returns whether an object has a given set of `key:value` pairs.
_.isMatch=function(object,attrs){var keys=_.keys(attrs),length=keys.length;if(object==null)return !length;var obj=Object(object);for(var i=0;i<length;i++){var key=keys[i];if(attrs[key]!==obj[key]||!(key in obj))return false;}return true;}; // Internal recursive comparison function for `isEqual`.
var eq=function(a,b,aStack,bStack){ // Identical objects are equal. `0 === -0`, but they aren't identical.
// See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
if(a===b)return a!==0||1/a===1/b; // A strict comparison is necessary because `null == undefined`.
if(a==null||b==null)return a===b; // Unwrap any wrapped objects.
if(a instanceof _)a=a._wrapped;if(b instanceof _)b=b._wrapped; // Compare `[[Class]]` names.
var className=toString.call(a);if(className!==toString.call(b))return false;switch(className){ // Strings, numbers, regular expressions, dates, and booleans are compared by value.
case '[object RegExp]': // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
case '[object String]': // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
// equivalent to `new String("5")`.
return ''+a===''+b;case '[object Number]': // `NaN`s are equivalent, but non-reflexive.
// Object(NaN) is equivalent to NaN
if(+a!==+a)return +b!==+b; // An `egal` comparison is performed for other numeric values.
return +a===0?1/+a===1/b:+a===+b;case '[object Date]':case '[object Boolean]': // Coerce dates and booleans to numeric primitive values. Dates are compared by their
// millisecond representations. Note that invalid dates with millisecond representations
// of `NaN` are not equivalent.
return +a===+b;}var areArrays=className==='[object Array]';if(!areArrays){if(typeof a!='object'||typeof b!='object')return false; // Objects with different constructors are not equivalent, but `Object`s or `Array`s
// from different frames are.
var aCtor=a.constructor,bCtor=b.constructor;if(aCtor!==bCtor&&!(_.isFunction(aCtor)&&aCtor instanceof aCtor&&_.isFunction(bCtor)&&bCtor instanceof bCtor)&&'constructor' in a&&'constructor' in b){return false;}} // Assume equality for cyclic structures. The algorithm for detecting cyclic
// structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
// Initializing stack of traversed objects.
// It's done here since we only need them for objects and arrays comparison.
aStack=aStack||[];bStack=bStack||[];var length=aStack.length;while(length--){ // Linear search. Performance is inversely proportional to the number of
// unique nested structures.
if(aStack[length]===a)return bStack[length]===b;} // Add the first object to the stack of traversed objects.
aStack.push(a);bStack.push(b); // Recursively compare objects and arrays.
if(areArrays){ // Compare array lengths to determine if a deep comparison is necessary.
length=a.length;if(length!==b.length)return false; // Deep compare the contents, ignoring non-numeric properties.
while(length--){if(!eq(a[length],b[length],aStack,bStack))return false;}}else { // Deep compare objects.
var keys=_.keys(a),key;length=keys.length; // Ensure that both objects contain the same number of properties before comparing deep equality.
if(_.keys(b).length!==length)return false;while(length--){ // Deep compare each member
key=keys[length];if(!(_.has(b,key)&&eq(a[key],b[key],aStack,bStack)))return false;}} // Remove the first object from the stack of traversed objects.
aStack.pop();bStack.pop();return true;}; // Perform a deep comparison to check if two objects are equal.
_.isEqual=function(a,b){return eq(a,b);}; // Is a given array, string, or object empty?
// An "empty" object has no enumerable own-properties.
_.isEmpty=function(obj){if(obj==null)return true;if(isArrayLike(obj)&&(_.isArray(obj)||_.isString(obj)||_.isArguments(obj)))return obj.length===0;return _.keys(obj).length===0;}; // Is a given value a DOM element?
_.isElement=function(obj){return !!(obj&&obj.nodeType===1);}; // Is a given value an array?
// Delegates to ECMA5's native Array.isArray
_.isArray=nativeIsArray||function(obj){return toString.call(obj)==='[object Array]';}; // Is a given variable an object?
_.isObject=function(obj){var type=typeof obj;return type==='function'||type==='object'&&!!obj;}; // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
_.each(['Arguments','Function','String','Number','Date','RegExp','Error'],function(name){_['is'+name]=function(obj){return toString.call(obj)==='[object '+name+']';};}); // Define a fallback version of the method in browsers (ahem, IE < 9), where
// there isn't any inspectable "Arguments" type.
if(!_.isArguments(arguments)){_.isArguments=function(obj){return _.has(obj,'callee');};} // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
// IE 11 (#1621), and in Safari 8 (#1929).
if(typeof /./!='function'&&typeof Int8Array!='object'){_.isFunction=function(obj){return typeof obj=='function'||false;};} // Is a given object a finite number?
_.isFinite=function(obj){return isFinite(obj)&&!isNaN(parseFloat(obj));}; // Is the given value `NaN`? (NaN is the only number which does not equal itself).
_.isNaN=function(obj){return _.isNumber(obj)&&obj!==+obj;}; // Is a given value a boolean?
_.isBoolean=function(obj){return obj===true||obj===false||toString.call(obj)==='[object Boolean]';}; // Is a given value equal to null?
_.isNull=function(obj){return obj===null;}; // Is a given variable undefined?
_.isUndefined=function(obj){return obj===void 0;}; // Shortcut function for checking if an object has a given property directly
// on itself (in other words, not on a prototype).
_.has=function(obj,key){return obj!=null&&hasOwnProperty.call(obj,key);}; // Utility Functions
// -----------------
// Run Underscore.js in *noConflict* mode, returning the `_` variable to its
// previous owner. Returns a reference to the Underscore object.
_.noConflict=function(){root._=previousUnderscore;return this;}; // Keep the identity function around for default iteratees.
_.identity=function(value){return value;}; // Predicate-generating functions. Often useful outside of Underscore.
_.constant=function(value){return function(){return value;};};_.noop=function(){};_.property=property; // Generates a function for a given object that returns a given property.
_.propertyOf=function(obj){return obj==null?function(){}:function(key){return obj[key];};}; // Returns a predicate for checking whether an object has a given set of
// `key:value` pairs.
_.matcher=_.matches=function(attrs){attrs=_.extendOwn({},attrs);return function(obj){return _.isMatch(obj,attrs);};}; // Run a function **n** times.
_.times=function(n,iteratee,context){var accum=Array(Math.max(0,n));iteratee=optimizeCb(iteratee,context,1);for(var i=0;i<n;i++)accum[i]=iteratee(i);return accum;}; // Return a random integer between min and max (inclusive).
_.random=function(min,max){if(max==null){max=min;min=0;}return min+Math.floor(Math.random()*(max-min+1));}; // A (possibly faster) way to get the current timestamp as an integer.
_.now=Date.now||function(){return new Date().getTime();}; // List of HTML entities for escaping.
var escapeMap={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#x27;','`':'&#x60;'};var unescapeMap=_.invert(escapeMap); // Functions for escaping and unescaping strings to/from HTML interpolation.
var createEscaper=function(map){var escaper=function(match){return map[match];}; // Regexes for identifying a key that needs to be escaped
var source='(?:'+_.keys(map).join('|')+')';var testRegexp=RegExp(source);var replaceRegexp=RegExp(source,'g');return function(string){string=string==null?'':''+string;return testRegexp.test(string)?string.replace(replaceRegexp,escaper):string;};};_.escape=createEscaper(escapeMap);_.unescape=createEscaper(unescapeMap); // If the value of the named `property` is a function then invoke it with the
// `object` as context; otherwise, return it.
_.result=function(object,property,fallback){var value=object==null?void 0:object[property];if(value===void 0){value=fallback;}return _.isFunction(value)?value.call(object):value;}; // Generate a unique integer id (unique within the entire client session).
// Useful for temporary DOM ids.
var idCounter=0;_.uniqueId=function(prefix){var id=++idCounter+'';return prefix?prefix+id:id;}; // By default, Underscore uses ERB-style template delimiters, change the
// following template settings to use alternative delimiters.
_.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g}; // When customizing `templateSettings`, if you don't want to define an
// interpolation, evaluation or escaping regex, we need one that is
// guaranteed not to match.
var noMatch=/(.)^/; // Certain characters need to be escaped so that they can be put into a
// string literal.
var escapes={"'":"'",'\\':'\\','\r':'r','\n':'n','\u2028':'u2028','\u2029':'u2029'};var escaper=/\\|'|\r|\n|\u2028|\u2029/g;var escapeChar=function(match){return '\\'+escapes[match];}; // JavaScript micro-templating, similar to John Resig's implementation.
// Underscore templating handles arbitrary delimiters, preserves whitespace,
// and correctly escapes quotes within interpolated code.
// NB: `oldSettings` only exists for backwards compatibility.
_.template=function(text,settings,oldSettings){if(!settings&&oldSettings)settings=oldSettings;settings=_.defaults({},settings,_.templateSettings); // Combine delimiters into one regular expression via alternation.
var matcher=RegExp([(settings.escape||noMatch).source,(settings.interpolate||noMatch).source,(settings.evaluate||noMatch).source].join('|')+'|$','g'); // Compile the template source, escaping string literals appropriately.
var index=0;var source="__p+='";text.replace(matcher,function(match,escape,interpolate,evaluate,offset){source+=text.slice(index,offset).replace(escaper,escapeChar);index=offset+match.length;if(escape){source+="'+\n((__t=("+escape+"))==null?'':_.escape(__t))+\n'";}else if(interpolate){source+="'+\n((__t=("+interpolate+"))==null?'':__t)+\n'";}else if(evaluate){source+="';\n"+evaluate+"\n__p+='";} // Adobe VMs need the match returned to produce the correct offest.
return match;});source+="';\n"; // If a variable is not specified, place data values in local scope.
if(!settings.variable)source='with(obj||{}){\n'+source+'}\n';source="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+source+'return __p;\n';try{var render=new Function(settings.variable||'obj','_',source);}catch(e){e.source=source;throw e;}var template=function(data){return render.call(this,data,_);}; // Provide the compiled source as a convenience for precompilation.
var argument=settings.variable||'obj';template.source='function('+argument+'){\n'+source+'}';return template;}; // Add a "chain" function. Start chaining a wrapped Underscore object.
_.chain=function(obj){var instance=_(obj);instance._chain=true;return instance;}; // OOP
// ---------------
// If Underscore is called as a function, it returns a wrapped object that
// can be used OO-style. This wrapper holds altered versions of all the
// underscore functions. Wrapped objects may be chained.
// Helper function to continue chaining intermediate results.
var result=function(instance,obj){return instance._chain?_(obj).chain():obj;}; // Add your own custom functions to the Underscore object.
_.mixin=function(obj){_.each(_.functions(obj),function(name){var func=_[name]=obj[name];_.prototype[name]=function(){var args=[this._wrapped];push.apply(args,arguments);return result(this,func.apply(_,args));};});}; // Add all of the Underscore functions to the wrapper object.
_.mixin(_); // Add all mutator Array functions to the wrapper.
_.each(['pop','push','reverse','shift','sort','splice','unshift'],function(name){var method=ArrayProto[name];_.prototype[name]=function(){var obj=this._wrapped;method.apply(obj,arguments);if((name==='shift'||name==='splice')&&obj.length===0)delete obj[0];return result(this,obj);};}); // Add all accessor Array functions to the wrapper.
_.each(['concat','join','slice'],function(name){var method=ArrayProto[name];_.prototype[name]=function(){return result(this,method.apply(this._wrapped,arguments));};}); // Extracts the result from a wrapped and chained object.
_.prototype.value=function(){return this._wrapped;}; // Provide unwrapping proxy for some methods used in engine operations
// such as arithmetic and JSON stringification.
_.prototype.valueOf=_.prototype.toJSON=_.prototype.value;_.prototype.toString=function(){return ''+this._wrapped;}; // AMD registration happens at the end for compatibility with AMD loaders
// that may not enforce next-turn semantics on modules. Even though general
// practice for AMD registration is to be anonymous, underscore registers
// as a named module because, like jQuery, it is a base library that is
// popular enough to be bundled in a third party lib, but not be part of
// an AMD load request. Those cases could generate an error when an
// anonymous define() is called outside of a loader request.
if(typeof define==='function'&&define.amd){define('underscore',[],function(){return _;});}}).call(this); /**
 * The Events module pulled from [Backbone.js](http://backbonejs.org/)
 * Stripped and modified to work with node.js and optimize types of calls
 * for animation based events.
 */(function(){var root=this;var Backbone=root.Backbone||{};root.Backbone=Backbone;var array=[];var slice=array.slice; // Backbone.Events
// ---------------
// Regular expression used to split event strings.
var eventSplitter=/\s+/; /**
   * Events API deprecated because of additional calls and checks
   * multiple times a frame tick in two.js
   */ // Optimized internal dispatch function for triggering events. Tries to
// keep the usual cases speedy (most Backbone events have 3 arguments).
var triggerEvents=function(obj,events,args){var ev,i=-1,l=events.length;switch(args.length){case 0:while(++i<l)(ev=events[i]).callback.call(ev.ctx);return;case 1:while(++i<l)(ev=events[i]).callback.call(ev.ctx,args[0]);return;case 2:while(++i<l)(ev=events[i]).callback.call(ev.ctx,args[0],args[1]);return;case 3:while(++i<l)(ev=events[i]).callback.call(ev.ctx,args[0],args[1],args[2]);return;default:while(++i<l)(ev=events[i]).callback.apply(ev.ctx,args);}};var Events=Backbone.Events={ // Bind one or more space separated events, or an events map,
// to a `callback` function. Passing `"all"` will bind the callback to
// all events fired.
on:function(name,callback,context){ // if (!(eventsApi(this, 'on', name, [callback, context]) && callback)) return this;
this._events||(this._events={});var list=this._events[name]||(this._events[name]=[]);list.push({callback:callback,context:context,ctx:context||this});return this;}, // Bind events to only be triggered a single time. After the first time
// the callback is invoked, it will be removed.
once:function(name,callback,context){ // if (!(eventsApi(this, 'once', name, [callback, context]) && callback)) return this;
var self=this;var once=_.once(function(){self.off(name,once);callback.apply(this,arguments);});once._callback=callback;this.on(name,once,context);return this;}, // Remove one or many callbacks. If `context` is null, removes all
// callbacks with that function. If `callback` is null, removes all
// callbacks for the event. If `events` is null, removes all bound
// callbacks for all events.
off:function(name,callback,context){var list,ev,events,names,i,l,j,k;if(!this._events /** || !eventsApi(this, 'off', name, [callback, context])**/)return this;if(!name&&!callback&&!context){this._events={};return this;}names=name?[name]:_.keys(this._events);for(i=0,l=names.length;i<l;i++){name=names[i];if(list=this._events[name]){events=[];if(callback||context){for(j=0,k=list.length;j<k;j++){ev=list[j];if(callback&&callback!==(ev.callback._callback||ev.callback)||context&&context!==ev.context){events.push(ev);}}}this._events[name]=events;}}return this;}, // Trigger one or many events, firing all bound callbacks. Callbacks are
// passed the same arguments as `trigger` is, apart from the event name
// (unless you're listening on `"all"`, which will cause your callback to
// receive the true name of the event as the first argument).
trigger:function(name){if(!this._events)return this;var args=slice.call(arguments,1); // if (!eventsApi(this, 'trigger', name, args)) return this;
var events=this._events[name];var allEvents=this._events.all;if(events)triggerEvents(this,events,args);if(allEvents)triggerEvents(this,allEvents,arguments);return this;}, // An inversion-of-control version of `on`. Tell *this* object to listen to
// an event in another object ... keeping track of what it's listening to.
listenTo:function(object,events,callback){var listeners=this._listeners||(this._listeners={});var id=object._listenerId||(object._listenerId=_.uniqueId('l'));listeners[id]=object;object.on(events,callback||this,this);return this;}, // Tell this object to stop listening to either specific events ... or
// to every object it's currently listening to.
stopListening:function(object,events,callback){var listeners=this._listeners;if(!listeners)return;if(object){object.off(events,callback,this);if(!events&&!callback)delete listeners[object._listenerId];}else {for(var id in listeners){listeners[id].off(null,null,this);}this._listeners={};}return this;}}; // Aliases for backwards compatibility.
Events.bind=Events.on;Events.unbind=Events.off;if(typeof exports!=='undefined'){if(typeof module!=='undefined'&&module.exports){exports=module.exports=Backbone;}exports.Backbone=Backbone;}else {root.Backbone=Backbone;}if(typeof define==='function'&&define.amd){define('backbone',[],function(){return Backbone;});}})(); /**
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * And modified to work with node.js
 */(function(){var root=this;var lastTime=0;var vendors=['ms','moz','webkit','o'];for(var x=0;x<vendors.length&&!root.requestAnimationFrame;++x){root.requestAnimationFrame=root[vendors[x]+'RequestAnimationFrame'];root.cancelAnimationFrame=root[vendors[x]+'CancelAnimationFrame']||root[vendors[x]+'CancelRequestAnimationFrame'];}if(!root.requestAnimationFrame)root.requestAnimationFrame=raf;if(!root.cancelAnimationFrame)root.cancelAnimationFrame=function(id){clearTimeout(id);};if(typeof exports!=='undefined'){if(typeof module!=='undefined'&&module.exports){exports=module.exports=root.requestAnimationFrame;}exports.requestAnimationFrame=root.requestAnimationFrame;}else {root.requestAnimationFrame=root.requestAnimationFrame;}if(typeof define==='function'&&define.amd){define('requestAnimationFrame',[],function(){return root.requestAnimationFrame;});}function raf(callback,element){var currTime=new Date().getTime();var timeToCall=Math.max(0,16-(currTime-lastTime));var id=root.setTimeout(function(){callback(currTime+timeToCall);},timeToCall);lastTime=currTime+timeToCall;return id;}})();(function(previousTwo,_,Backbone,requestAnimationFrame){var root=this; /**
   * Constants
   */var sin=Math.sin,cos=Math.cos,atan2=Math.atan2,sqrt=Math.sqrt,round=Math.round,abs=Math.abs,PI=Math.PI,TWO_PI=PI*2,HALF_PI=PI/2,pow=Math.pow,min=Math.min,max=Math.max; /**
   * Localized variables
   */var count=0; /**
   * Cross browser dom events.
   */var dom={temp:document.createElement('div'),hasEventListeners:_.isFunction(root.addEventListener),bind:function(elem,event,func,bool){if(this.hasEventListeners){elem.addEventListener(event,func,!!bool);}else {elem.attachEvent('on'+event,func);}return this;},unbind:function(elem,event,func,bool){if(this.hasEventListeners){elem.removeEventListeners(event,func,!!bool);}else {elem.detachEvent('on'+event,func);}return this;}}; /**
   * @class
   */var Two=root.Two=function(options){ // Determine what Renderer to use and setup a scene.
var params=_.defaults(options||{},{fullscreen:false,width:640,height:480,type:Two.Types.svg,autostart:false});_.each(params,function(v,k){if(k==='fullscreen'||k==='width'||k==='height'||k==='autostart'){return;}this[k]=v;},this); // Specified domElement overrides type declaration only if the element does not support declared renderer type.
if(_.isElement(params.domElement)){var tagName=params.domElement.tagName.toLowerCase();if(!/^(CanvasRenderer-canvas|WebGLRenderer-canvas|SVGRenderer-svg)$/.test(this.type+'-'+tagName)){this.type=Two.Types[tagName];}}this.renderer=new Two[this.type](this);Two.Utils.setPlaying.call(this,params.autostart);this.frameCount=0;if(params.fullscreen){var fitted=_.bind(fitToWindow,this);_.extend(document.body.style,{overflow:'hidden',margin:0,padding:0,top:0,left:0,right:0,bottom:0,position:'fixed'});_.extend(this.renderer.domElement.style,{display:'block',top:0,left:0,right:0,bottom:0,position:'fixed'});dom.bind(root,'resize',fitted);fitted();}else if(!_.isElement(params.domElement)){this.renderer.setSize(params.width,params.height,this.ratio);this.width=params.width;this.height=params.height;}this.scene=this.renderer.scene;Two.Instances.push(this);};_.extend(Two,{ /**
     * Primitive
     */Array:root.Float32Array||Array,Types:{webgl:'WebGLRenderer',svg:'SVGRenderer',canvas:'CanvasRenderer'},Version:'v0.6.0',Identifier:'two_',Properties:{hierarchy:'hierarchy',demotion:'demotion'},Events:{play:'play',pause:'pause',update:'update',render:'render',resize:'resize',change:'change',remove:'remove',insert:'insert',order:'order'},Commands:{move:'M',line:'L',curve:'C',close:'Z'},Resolution:8,Instances:[],noConflict:function(){root.Two=previousTwo;return this;},uniqueId:function(){var id=count;count++;return id;},Utils:{defineProperty:function(property){var object=this;var secret='_'+property;var flag='_flag'+property.charAt(0).toUpperCase()+property.slice(1);Object.defineProperty(object,property,{get:function(){return this[secret];},set:function(v){this[secret]=v;this[flag]=true;}});}, /**
       * Release an arbitrary class' events from the two.js corpus and recurse
       * through its children and or vertices.
       */release:function(obj){if(!_.isObject(obj)){return;}if(_.isFunction(obj.unbind)){obj.unbind();}if(obj.vertices){if(_.isFunction(obj.vertices.unbind)){obj.vertices.unbind();}_.each(obj.vertices,function(v){if(_.isFunction(v.unbind)){v.unbind();}});}if(obj.children){_.each(obj.children,function(obj){Two.Utils.release(obj);});}},xhr:function(path,callback){var xhr=new XMLHttpRequest();xhr.open('GET',path);xhr.onreadystatechange=function(){if(xhr.readyState===4&&xhr.status===200){callback(xhr.responseText);}};xhr.send();return xhr;},Curve:{CollinearityEpsilon:pow(10,-30),RecursionLimit:16,CuspLimit:0,Tolerance:{distance:0.25,angle:0,epsilon:0.01}, // Lookup tables for abscissas and weights with values for n = 2 .. 16.
// As values are symmetric, only store half of them and adapt algorithm
// to factor in symmetry.
abscissas:[[0.5773502691896257645091488],[0,0.7745966692414833770358531],[0.3399810435848562648026658,0.8611363115940525752239465],[0,0.5384693101056830910363144,0.9061798459386639927976269],[0.2386191860831969086305017,0.6612093864662645136613996,0.9324695142031520278123016],[0,0.4058451513773971669066064,0.7415311855993944398638648,0.9491079123427585245261897],[0.1834346424956498049394761,0.5255324099163289858177390,0.7966664774136267395915539,0.9602898564975362316835609],[0,0.3242534234038089290385380,0.6133714327005903973087020,0.8360311073266357942994298,0.9681602395076260898355762],[0.1488743389816312108848260,0.4333953941292471907992659,0.6794095682990244062343274,0.8650633666889845107320967,0.9739065285171717200779640],[0,0.2695431559523449723315320,0.5190961292068118159257257,0.7301520055740493240934163,0.8870625997680952990751578,0.9782286581460569928039380],[0.1252334085114689154724414,0.3678314989981801937526915,0.5873179542866174472967024,0.7699026741943046870368938,0.9041172563704748566784659,0.9815606342467192506905491],[0,0.2304583159551347940655281,0.4484927510364468528779129,0.6423493394403402206439846,0.8015780907333099127942065,0.9175983992229779652065478,0.9841830547185881494728294],[0.1080549487073436620662447,0.3191123689278897604356718,0.5152486363581540919652907,0.6872929048116854701480198,0.8272013150697649931897947,0.9284348836635735173363911,0.9862838086968123388415973],[0,0.2011940939974345223006283,0.3941513470775633698972074,0.5709721726085388475372267,0.7244177313601700474161861,0.8482065834104272162006483,0.9372733924007059043077589,0.9879925180204854284895657],[0.0950125098376374401853193,0.2816035507792589132304605,0.4580167776572273863424194,0.6178762444026437484466718,0.7554044083550030338951012,0.8656312023878317438804679,0.9445750230732325760779884,0.9894009349916499325961542]],weights:[[1],[0.8888888888888888888888889,0.5555555555555555555555556],[0.6521451548625461426269361,0.3478548451374538573730639],[0.5688888888888888888888889,0.4786286704993664680412915,0.2369268850561890875142640],[0.4679139345726910473898703,0.3607615730481386075698335,0.1713244923791703450402961],[0.4179591836734693877551020,0.3818300505051189449503698,0.2797053914892766679014678,0.1294849661688696932706114],[0.3626837833783619829651504,0.3137066458778872873379622,0.2223810344533744705443560,0.1012285362903762591525314],[0.3302393550012597631645251,0.3123470770400028400686304,0.2606106964029354623187429,0.1806481606948574040584720,0.0812743883615744119718922],[0.2955242247147528701738930,0.2692667193099963550912269,0.2190863625159820439955349,0.1494513491505805931457763,0.0666713443086881375935688],[0.2729250867779006307144835,0.2628045445102466621806889,0.2331937645919904799185237,0.1862902109277342514260976,0.1255803694649046246346943,0.0556685671161736664827537],[0.2491470458134027850005624,0.2334925365383548087608499,0.2031674267230659217490645,0.1600783285433462263346525,0.1069393259953184309602547,0.0471753363865118271946160],[0.2325515532308739101945895,0.2262831802628972384120902,0.2078160475368885023125232,0.1781459807619457382800467,0.1388735102197872384636018,0.0921214998377284479144218,0.0404840047653158795200216],[0.2152638534631577901958764,0.2051984637212956039659241,0.1855383974779378137417166,0.1572031671581935345696019,0.1215185706879031846894148,0.0801580871597602098056333,0.0351194603317518630318329],[0.2025782419255612728806202,0.1984314853271115764561183,0.1861610000155622110268006,0.1662692058169939335532009,0.1395706779261543144478048,0.1071592204671719350118695,0.0703660474881081247092674,0.0307532419961172683546284],[0.1894506104550684962853967,0.1826034150449235888667637,0.1691565193950025381893121,0.1495959888165767320815017,0.1246289712555338720524763,0.0951585116824927848099251,0.0622535239386478928628438,0.0271524594117540948517806]]}, /**
       * Account for high dpi rendering.
       * http://www.html5rocks.com/en/tutorials/canvas/hidpi/
       */devicePixelRatio:root.devicePixelRatio||1,getBackingStoreRatio:function(ctx){return ctx.webkitBackingStorePixelRatio||ctx.mozBackingStorePixelRatio||ctx.msBackingStorePixelRatio||ctx.oBackingStorePixelRatio||ctx.backingStorePixelRatio||1;},getRatio:function(ctx){return Two.Utils.devicePixelRatio/getBackingStoreRatio(ctx);}, /**
       * Properly defer play calling until after all objects
       * have been updated with their newest styles.
       */setPlaying:function(b){this.playing=!!b;return this;}, /**
       * Return the computed matrix of a nested object.
       * TODO: Optimize traversal.
       */getComputedMatrix:function(object,matrix){matrix=matrix&&matrix.identity()||new Two.Matrix();var parent=object,matrices=[];while(parent&&parent._matrix){matrices.push(parent._matrix);parent=parent.parent;}matrices.reverse();_.each(matrices,function(m){var e=m.elements;matrix.multiply(e[0],e[1],e[2],e[3],e[4],e[5],e[6],e[7],e[8],e[9]);});return matrix;},deltaTransformPoint:function(matrix,x,y){var dx=x*matrix.a+y*matrix.c+0;var dy=x*matrix.b+y*matrix.d+0;return new Two.Vector(dx,dy);}, /**
       * https://gist.github.com/2052247
       */decomposeMatrix:function(matrix){ // calculate delta transform point
var px=Two.Utils.deltaTransformPoint(matrix,0,1);var py=Two.Utils.deltaTransformPoint(matrix,1,0); // calculate skew
var skewX=180/Math.PI*Math.atan2(px.y,px.x)-90;var skewY=180/Math.PI*Math.atan2(py.y,py.x);return {translateX:matrix.e,translateY:matrix.f,scaleX:Math.sqrt(matrix.a*matrix.a+matrix.b*matrix.b),scaleY:Math.sqrt(matrix.c*matrix.c+matrix.d*matrix.d),skewX:skewX,skewY:skewY,rotation:skewX // rotation is the same as skew x
};}, /**
       * Walk through item properties and pick the ones of interest.
       * Will try to resolve styles applied via CSS
       *
       * TODO: Reverse calculate `Two.Gradient`s for fill / stroke
       * of any given path.
       */applySvgAttributes:function(node,elem){var attributes={},styles={},i,key,value,attr; // Not available in non browser environments
if(getComputedStyle){ // Convert CSSStyleDeclaration to a normal object
var computedStyles=getComputedStyle(node);i=computedStyles.length;while(i--){key=computedStyles[i];value=computedStyles[key]; // Gecko returns undefined for unset properties
// Webkit returns the default value
if(value!==undefined){styles[key]=value;}}} // Convert NodeMap to a normal object
i=node.attributes.length;while(i--){attr=node.attributes[i];attributes[attr.nodeName]=attr.value;} // Getting the correct opacity is a bit tricky, since SVG path elements don't
// support opacity as an attribute, but you can apply it via CSS.
// So we take the opacity and set (stroke/fill)-opacity to the same value.
if(!_.isUndefined(styles.opacity)){styles['stroke-opacity']=styles.opacity;styles['fill-opacity']=styles.opacity;} // Merge attributes and applied styles (attributes take precedence)
_.extend(styles,attributes); // Similarly visibility is influenced by the value of both display and visibility.
// Calculate a unified value here which defaults to `true`.
styles.visible=!(_.isUndefined(styles.display)&&styles.display==='none')||_.isUndefined(styles.visibility)&&styles.visibility==='hidden'; // Now iterate the whole thing
for(key in styles){value=styles[key];switch(key){case 'transform': // TODO: Check this out https://github.com/paperjs/paper.js/blob/master/src/svg/SVGImport.js#L313
if(value==='none')break;var m=node.getCTM(); // Might happen when transform string is empty or not valid.
if(m===null)break; // // Option 1: edit the underlying matrix and don't force an auto calc.
// var m = node.getCTM();
// elem._matrix.manual = true;
// elem._matrix.set(m.a, m.b, m.c, m.d, m.e, m.f);
// Option 2: Decompose and infer Two.js related properties.
var transforms=Two.Utils.decomposeMatrix(node.getCTM());elem.translation.set(transforms.translateX,transforms.translateY);elem.rotation=transforms.rotation; // Warning: Two.js elements only support uniform scalars...
elem.scale=transforms.scaleX; // Override based on attributes.
if(styles.x){elem.translation.x=styles.x;}if(styles.y){elem.translation.y=styles.y;}break;case 'visible':elem.visible=value;break;case 'stroke-linecap':elem.cap=value;break;case 'stroke-linejoin':elem.join=value;break;case 'stroke-miterlimit':elem.miter=value;break;case 'stroke-width':elem.linewidth=parseFloat(value);break;case 'stroke-opacity':case 'fill-opacity':case 'opacity':elem.opacity=parseFloat(value);break;case 'fill':case 'stroke':if(/url\(\#.*\)/i.test(value)){elem[key]=this.getById(value.replace(/url\(\#(.*)\)/i,'$1'));}else {elem[key]=value==='none'?'transparent':value;}break;case 'id':elem.id=value;break;case 'class':elem.classList=value.split(' ');break;}}return elem;}, /**
       * Read any number of SVG node types and create Two equivalents of them.
       */read:{svg:function(){return Two.Utils.read.g.apply(this,arguments);},g:function(node){var group=new Two.Group(); // Switched up order to inherit more specific styles
Two.Utils.applySvgAttributes.call(this,node,group);for(var i=0,l=node.childNodes.length;i<l;i++){var n=node.childNodes[i];var tag=n.nodeName;if(!tag)return;var tagName=tag.replace(/svg\:/ig,'').toLowerCase();if(tagName in Two.Utils.read){var o=Two.Utils.read[tagName].call(group,n);group.add(o);}}return group;},polygon:function(node,open){var points=node.getAttribute('points');var verts=[];points.replace(/(-?[\d\.?]+),(-?[\d\.?]+)/g,function(match,p1,p2){verts.push(new Two.Anchor(parseFloat(p1),parseFloat(p2)));});var poly=new Two.Path(verts,!open).noStroke();poly.fill='black';return Two.Utils.applySvgAttributes.call(this,node,poly);},polyline:function(node){return Two.Utils.read.polygon.call(this,node,true);},path:function(node){var path=node.getAttribute('d'); // Create a Two.Path from the paths.
var coord=new Two.Anchor();var control,coords;var closed=false,relative=false;var commands=path.match(/[a-df-z][^a-df-z]*/ig);var last=commands.length-1; // Split up polybeziers
_.each(commands.slice(0),function(command,i){var type=command[0];var lower=type.toLowerCase();var items=command.slice(1).trim().split(/[\s,]+|(?=\s?[+\-])/);var pre,post,result=[],bin;if(i<=0){commands=[];}switch(lower){case 'h':case 'v':if(items.length>1){bin=1;}break;case 'm':case 'l':case 't':if(items.length>2){bin=2;}break;case 's':case 'q':if(items.length>4){bin=4;}break;case 'c':if(items.length>6){bin=6;}break;case 'a': // TODO: Handle Ellipses
break;}if(bin){for(var j=0,l=items.length,times=0;j<l;j+=bin){var ct=type;if(times>0){switch(type){case 'm':ct='l';break;case 'M':ct='L';break;}}result.push([ct].concat(items.slice(j,j+bin)).join(' '));times++;}commands=Array.prototype.concat.apply(commands,result);}else {commands.push(command);}}); // Create the vertices for our Two.Path
var points=_.flatten(_.map(commands,function(command,i){var result,x,y;var type=command[0];var lower=type.toLowerCase();coords=command.slice(1).trim();coords=coords.replace(/(-?\d+(?:\.\d*)?)[eE]([+\-]?\d+)/g,function(match,n1,n2){return parseFloat(n1)*pow(10,n2);});coords=coords.split(/[\s,]+|(?=\s?[+\-])/);relative=type===lower;var x1,y1,x2,y2,x3,y3,x4,y4,reflection;switch(lower){case 'z':if(i>=last){closed=true;}else {x=coord.x;y=coord.y;result=new Two.Anchor(x,y,undefined,undefined,undefined,undefined,Two.Commands.close);}break;case 'm':case 'l':x=parseFloat(coords[0]);y=parseFloat(coords[1]);result=new Two.Anchor(x,y,undefined,undefined,undefined,undefined,lower==='m'?Two.Commands.move:Two.Commands.line);if(relative){result.addSelf(coord);} // result.controls.left.copy(result);
// result.controls.right.copy(result);
coord=result;break;case 'h':case 'v':var a=lower==='h'?'x':'y';var b=a==='x'?'y':'x';result=new Two.Anchor(undefined,undefined,undefined,undefined,undefined,undefined,Two.Commands.line);result[a]=parseFloat(coords[0]);result[b]=coord[b];if(relative){result[a]+=coord[a];} // result.controls.left.copy(result);
// result.controls.right.copy(result);
coord=result;break;case 'c':case 's':x1=coord.x;y1=coord.y;if(!control){control=new Two.Vector(); //.copy(coord);
}if(lower==='c'){x2=parseFloat(coords[0]);y2=parseFloat(coords[1]);x3=parseFloat(coords[2]);y3=parseFloat(coords[3]);x4=parseFloat(coords[4]);y4=parseFloat(coords[5]);}else { // Calculate reflection control point for proper x2, y2
// inclusion.
reflection=getReflection(coord,control,relative);x2=reflection.x;y2=reflection.y;x3=parseFloat(coords[0]);y3=parseFloat(coords[1]);x4=parseFloat(coords[2]);y4=parseFloat(coords[3]);}if(relative){x2+=x1;y2+=y1;x3+=x1;y3+=y1;x4+=x1;y4+=y1;}if(!_.isObject(coord.controls)){Two.Anchor.AppendCurveProperties(coord);}coord.controls.right.set(x2-coord.x,y2-coord.y);result=new Two.Anchor(x4,y4,x3-x4,y3-y4,undefined,undefined,Two.Commands.curve);coord=result;control=result.controls.left;break;case 't':case 'q':x1=coord.x;y1=coord.y;if(!control){control=new Two.Vector(); //.copy(coord);
}if(control.isZero()){x2=x1;y2=y1;}else {x2=control.x;y1=control.y;}if(lower==='q'){x3=parseFloat(coords[0]);y3=parseFloat(coords[1]);x4=parseFloat(coords[1]);y4=parseFloat(coords[2]);}else {reflection=getReflection(coord,control,relative);x3=reflection.x;y3=reflection.y;x4=parseFloat(coords[0]);y4=parseFloat(coords[1]);}if(relative){x2+=x1;y2+=y1;x3+=x1;y3+=y1;x4+=x1;y4+=y1;}if(!_.isObject(coord.controls)){Two.Anchor.AppendCurveProperties(coord);}coord.controls.right.set(x2-coord.x,y2-coord.y);result=new Two.Anchor(x4,y4,x3-x4,y3-y4,undefined,undefined,Two.Commands.curve);coord=result;control=result.controls.left;break;case 'a': // throw new Two.Utils.Error('not yet able to interpret Elliptical Arcs.');
x1=coord.x;y1=coord.y;var rx=parseFloat(coords[0]);var ry=parseFloat(coords[1]);var xAxisRotation=parseFloat(coords[2])*Math.PI/180;var largeArcFlag=parseFloat(coords[3]);var sweepFlag=parseFloat(coords[4]);x4=parseFloat(coords[5]);y4=parseFloat(coords[6]);if(relative){x4+=x1;y4+=y1;} // http://www.w3.org/TR/SVG/implnote.html#ArcConversionEndpointToCenter
// Calculate midpoint mx my
var mx=(x4-x1)/2;var my=(y4-y1)/2; // Calculate x1' y1' F.6.5.1
var _x=mx*Math.cos(xAxisRotation)+my*Math.sin(xAxisRotation);var _y=-mx*Math.sin(xAxisRotation)+my*Math.cos(xAxisRotation);var rx2=rx*rx;var ry2=ry*ry;var _x2=_x*_x;var _y2=_y*_y; // adjust radii
var l=_x2/rx2+_y2/ry2;if(l>1){rx*=Math.sqrt(l);ry*=Math.sqrt(l);}var amp=Math.sqrt((rx2*ry2-rx2*_y2-ry2*_x2)/(rx2*_y2+ry2*_x2));if(_.isNaN(amp)){amp=0;}else if(largeArcFlag!=sweepFlag&&amp>0){amp*=-1;} // Calculate cx' cy' F.6.5.2
var _cx=amp*rx*_y/ry;var _cy=-amp*ry*_x/rx; // Calculate cx cy F.6.5.3
var cx=_cx*Math.cos(xAxisRotation)-_cy*Math.sin(xAxisRotation)+(x1+x4)/2;var cy=_cx*Math.sin(xAxisRotation)+_cy*Math.cos(xAxisRotation)+(y1+y4)/2; // vector magnitude
var m=function(v){return Math.sqrt(Math.pow(v[0],2)+Math.pow(v[1],2));}; // ratio between two vectors
var r=function(u,v){return (u[0]*v[0]+u[1]*v[1])/(m(u)*m(v));}; // angle between two vectors
var a=function(u,v){return (u[0]*v[1]<u[1]*v[0]?-1:1)*Math.acos(r(u,v));}; // Calculate theta1 and delta theta F.6.5.4 + F.6.5.5
var t1=a([1,0],[(_x-_cx)/rx,(_y-_cy)/ry]);var u=[(_x-_cx)/rx,(_y-_cy)/ry];var v=[(-_x-_cx)/rx,(-_y-_cy)/ry];var dt=a(u,v);if(r(u,v)<=-1)dt=Math.PI;if(r(u,v)>=1)dt=0; // F.6.5.6
if(largeArcFlag){dt=mod(dt,Math.PI*2);}if(sweepFlag&&dt>0){dt-=Math.PI*2;}var length=Two.Resolution; // Save a projection of our rotation and translation to apply
// to the set of points.
var projection=new Two.Matrix().translate(cx,cy).rotate(xAxisRotation); // Create a resulting array of Two.Anchor's to export to the
// the path.
result=_.map(_.range(length),function(i){var pct=1-i/(length-1);var theta=pct*dt+t1;var x=rx*Math.cos(theta);var y=ry*Math.sin(theta);var projected=projection.multiply(x,y,1);return new Two.Anchor(projected.x,projected.y,false,false,false,false,Two.Commands.line);;});result.push(new Two.Anchor(x4,y4,false,false,false,false,Two.Commands.line));coord=result[result.length-1];control=coord.controls.left;break;}return result;}));if(points.length<=1){return;}points=_.compact(points);var poly=new Two.Path(points,closed,undefined,true).noStroke();poly.fill='black';return Two.Utils.applySvgAttributes.call(this,node,poly);},circle:function(node){var x=parseFloat(node.getAttribute('cx'));var y=parseFloat(node.getAttribute('cy'));var r=parseFloat(node.getAttribute('r'));var amount=Two.Resolution;var points=_.map(_.range(amount),function(i){var pct=i/amount;var theta=pct*TWO_PI;var x=r*cos(theta);var y=r*sin(theta);return new Two.Anchor(x,y);});var circle=new Two.Path(points,true,true).noStroke();circle.translation.set(x,y);circle.fill='black';return Two.Utils.applySvgAttributes.call(this,node,circle);},ellipse:function(node){var x=parseFloat(node.getAttribute('cx'));var y=parseFloat(node.getAttribute('cy'));var width=parseFloat(node.getAttribute('rx'));var height=parseFloat(node.getAttribute('ry'));var amount=Two.Resolution;var points=_.map(_.range(amount),function(i){var pct=i/amount;var theta=pct*TWO_PI;var x=width*cos(theta);var y=height*sin(theta);return new Two.Anchor(x,y);});var ellipse=new Two.Path(points,true,true).noStroke();ellipse.translation.set(x,y);ellipse.fill='black';return Two.Utils.applySvgAttributes.call(this,node,ellipse);},rect:function(node){var x=parseFloat(node.getAttribute('x'))||0;var y=parseFloat(node.getAttribute('y'))||0;var width=parseFloat(node.getAttribute('width'));var height=parseFloat(node.getAttribute('height'));var w2=width/2;var h2=height/2;var points=[new Two.Anchor(w2,h2),new Two.Anchor(-w2,h2),new Two.Anchor(-w2,-h2),new Two.Anchor(w2,-h2)];var rect=new Two.Path(points,true).noStroke();rect.translation.set(x+w2,y+h2);rect.fill='black';return Two.Utils.applySvgAttributes.call(this,node,rect);},line:function(node){var x1=parseFloat(node.getAttribute('x1'));var y1=parseFloat(node.getAttribute('y1'));var x2=parseFloat(node.getAttribute('x2'));var y2=parseFloat(node.getAttribute('y2'));var width=x2-x1;var height=y2-y1;var w2=width/2;var h2=height/2;var points=[new Two.Anchor(-w2,-h2),new Two.Anchor(w2,h2)]; // Center line and translate to desired position.
var line=new Two.Path(points).noFill();line.translation.set(x1+w2,y1+h2);return Two.Utils.applySvgAttributes.call(this,node,line);},lineargradient:function(node){var x1=parseFloat(node.getAttribute('x1'));var y1=parseFloat(node.getAttribute('y1'));var x2=parseFloat(node.getAttribute('x2'));var y2=parseFloat(node.getAttribute('y2'));var ox=(x2+x1)/2;var oy=(y2+y1)/2;var stops=[];for(var i=0;i<node.children.length;i++){var child=node.children[i];var offset=parseFloat(child.getAttribute('offset'));var color=child.getAttribute('stop-color');var opacity=child.getAttribute('stop-opacity');var style=child.getAttribute('style');if(_.isNull(color)){var matches=style.match(/stop\-color\:\s?([\#a-fA-F0-9]*)/);color=matches&&matches.length>1?matches[1]:undefined;}if(_.isNull(opacity)){var matches=style.match(/stop\-opacity\:\s?([0-1\.\-]*)/);opacity=matches&&matches.length>1?parseFloat(matches[1]):1;}stops.push(new Two.Gradient.Stop(offset,color,opacity));}var gradient=new Two.LinearGradient(x1-ox,y1-oy,x2-ox,y2-oy,stops);return Two.Utils.applySvgAttributes.call(this,node,gradient);},radialgradient:function(node){var cx=parseFloat(node.getAttribute('cx'))||0;var cy=parseFloat(node.getAttribute('cy'))||0;var r=parseFloat(node.getAttribute('r'));var fx=parseFloat(node.getAttribute('fx'));var fy=parseFloat(node.getAttribute('fy'));if(_.isNaN(fx)){fx=cx;}if(_.isNaN(fy)){fy=cy;}var ox=Math.abs(cx+fx)/2;var oy=Math.abs(cy+fy)/2;var stops=[];for(var i=0;i<node.children.length;i++){var child=node.children[i];var offset=parseFloat(child.getAttribute('offset'));var color=child.getAttribute('stop-color');var opacity=child.getAttribute('stop-opacity');var style=child.getAttribute('style');if(_.isNull(color)){var matches=style.match(/stop\-color\:\s?([\#a-fA-F0-9]*)/);color=matches&&matches.length>1?matches[1]:undefined;}if(_.isNull(opacity)){var matches=style.match(/stop\-opacity\:\s?([0-1\.\-]*)/);opacity=matches&&matches.length>1?parseFloat(matches[1]):1;}stops.push(new Two.Gradient.Stop(offset,color,opacity));}var gradient=new Two.RadialGradient(cx-ox,cy-oy,r,stops,fx-ox,fy-oy);return Two.Utils.applySvgAttributes.call(this,node,gradient);}}, /**
       * Given 2 points (a, b) and corresponding control point for each
       * return an array of points that represent points plotted along
       * the curve. Number points determined by limit.
       */subdivide:function(x1,y1,x2,y2,x3,y3,x4,y4,limit){limit=limit||Two.Utils.Curve.RecursionLimit;var amount=limit+1; // TODO: Issue 73
// Don't recurse if the end points are identical
if(x1===x4&&y1===y4){return [new Two.Anchor(x4,y4)];}return _.map(_.range(0,amount),function(i){var t=i/amount;var x=getPointOnCubicBezier(t,x1,x2,x3,x4);var y=getPointOnCubicBezier(t,y1,y2,y3,y4);return new Two.Anchor(x,y);});},getPointOnCubicBezier:function(t,a,b,c,d){var k=1-t;return k*k*k*a+3*k*k*t*b+3*k*t*t*c+t*t*t*d;}, /**
       * Given 2 points (a, b) and corresponding control point for each
       * return a float that represents the length of the curve using
       * Gauss-Legendre algorithm. Limit iterations of calculation by `limit`.
       */getCurveLength:function(x1,y1,x2,y2,x3,y3,x4,y4,limit){ // TODO: Better / fuzzier equality check
// Linear calculation
if(x1===x2&&y1===y2&&x3===x4&&y3===y4){var dx=x4-x1;var dy=y4-y1;return sqrt(dx*dx+dy*dy);} // Calculate the coefficients of a Bezier derivative.
var ax=9*(x2-x3)+3*(x4-x1),bx=6*(x1+x3)-12*x2,cx=3*(x2-x1),ay=9*(y2-y3)+3*(y4-y1),by=6*(y1+y3)-12*y2,cy=3*(y2-y1);var integrand=function(t){ // Calculate quadratic equations of derivatives for x and y
var dx=(ax*t+bx)*t+cx,dy=(ay*t+by)*t+cy;return sqrt(dx*dx+dy*dy);};return integrate(integrand,0,1,limit||Two.Utils.Curve.RecursionLimit);}, /**
       * Integration for `getCurveLength` calculations. Referenced from
       * Paper.js: https://github.com/paperjs/paper.js/blob/master/src/util/Numerical.js#L101
       */integrate:function(f,a,b,n){var x=Two.Utils.Curve.abscissas[n-2],w=Two.Utils.Curve.weights[n-2],A=0.5*(b-a),B=A+a,i=0,m=n+1>>1,sum=n&1?w[i++]*f(B):0; // Handle odd n
while(i<m){var Ax=A*x[i];sum+=w[i++]*(f(B+Ax)+f(B-Ax));}return A*sum;}, /**
       * Creates a set of points that have u, v values for anchor positions
       */getCurveFromPoints:function(points,closed){var l=points.length,last=l-1;for(var i=0;i<l;i++){var point=points[i];if(!_.isObject(point.controls)){Two.Anchor.AppendCurveProperties(point);}var prev=closed?mod(i-1,l):max(i-1,0);var next=closed?mod(i+1,l):min(i+1,last);var a=points[prev];var b=point;var c=points[next];getControlPoints(a,b,c);b._command=i===0?Two.Commands.move:Two.Commands.curve;b.controls.left.x=_.isNumber(b.controls.left.x)?b.controls.left.x:b.x;b.controls.left.y=_.isNumber(b.controls.left.y)?b.controls.left.y:b.y;b.controls.right.x=_.isNumber(b.controls.right.x)?b.controls.right.x:b.x;b.controls.right.y=_.isNumber(b.controls.right.y)?b.controls.right.y:b.y;}}, /**
       * Given three coordinates return the control points for the middle, b,
       * vertex.
       */getControlPoints:function(a,b,c){var a1=angleBetween(a,b);var a2=angleBetween(c,b);var d1=distanceBetween(a,b);var d2=distanceBetween(c,b);var mid=(a1+a2)/2; // So we know which angle corresponds to which side.
b.u=_.isObject(b.controls.left)?b.controls.left:new Two.Vector(0,0);b.v=_.isObject(b.controls.right)?b.controls.right:new Two.Vector(0,0); // TODO: Issue 73
if(d1<0.0001||d2<0.0001){if(!b._relative){b.controls.left.copy(b);b.controls.right.copy(b);}return b;}d1*=0.33; // Why 0.33?
d2*=0.33;if(a2<a1){mid+=HALF_PI;}else {mid-=HALF_PI;}b.controls.left.x=cos(mid)*d1;b.controls.left.y=sin(mid)*d1;mid-=PI;b.controls.right.x=cos(mid)*d2;b.controls.right.y=sin(mid)*d2;if(!b._relative){b.controls.left.x+=b.x;b.controls.left.y+=b.y;b.controls.right.x+=b.x;b.controls.right.y+=b.y;}return b;}, /**
       * Get the reflection of a point "b" about point "a". Where "a" is in
       * absolute space and "b" is relative to "a".
       *
       * http://www.w3.org/TR/SVG11/implnote.html#PathElementImplementationNotes
       */getReflection:function(a,b,relative){return new Two.Vector(2*a.x-(b.x+a.x)-(relative?a.x:0),2*a.y-(b.y+a.y)-(relative?a.y:0));},getAnchorsFromArcData:function(center,xAxisRotation,rx,ry,ts,td,ccw){var matrix=new Two.Matrix().translate(center.x,center.y).rotate(xAxisRotation);var l=Two.Resolution; // console.log(arguments);
return _.map(_.range(l),function(i){var pct=(i+1)/l;if(!!ccw){pct=1-pct;}var theta=pct*td+ts;var x=rx*Math.cos(theta);var y=ry*Math.sin(theta); // x += center.x;
// y += center.y;
var anchor=new Two.Anchor(x,y);Two.Anchor.AppendCurveProperties(anchor);anchor.command=Two.Commands.line; // TODO: Calculate control points here...
return anchor;});},ratioBetween:function(A,B){return (A.x*B.x+A.y*B.y)/(A.length()*B.length());},angleBetween:function(A,B){var dx,dy;if(arguments.length>=4){dx=arguments[0]-arguments[2];dy=arguments[1]-arguments[3];return atan2(dy,dx);}dx=A.x-B.x;dy=A.y-B.y;return atan2(dy,dx);},distanceBetweenSquared:function(p1,p2){var dx=p1.x-p2.x;var dy=p1.y-p2.y;return dx*dx+dy*dy;},distanceBetween:function(p1,p2){return sqrt(distanceBetweenSquared(p1,p2));}, // A pretty fast toFixed(3) alternative
// See http://jsperf.com/parsefloat-tofixed-vs-math-round/18
toFixed:function(v){return Math.floor(v*1000)/1000;},mod:function(v,l){while(v<0){v+=l;}return v%l;}, /**
       * Array like collection that triggers inserted and removed events
       * removed : pop / shift / splice
       * inserted : push / unshift / splice (with > 2 arguments)
       */Collection:function(){Array.call(this);if(arguments.length>1){Array.prototype.push.apply(this,arguments);}else if(arguments[0]&&Array.isArray(arguments[0])){Array.prototype.push.apply(this,arguments[0]);}}, // Custom Error Throwing for Two.js
Error:function(message){this.name='two.js';this.message=message;}}});Two.Utils.Error.prototype=new Error();Two.Utils.Error.prototype.constructor=Two.Utils.Error;Two.Utils.Collection.prototype=new Array();Two.Utils.Collection.constructor=Two.Utils.Collection;_.extend(Two.Utils.Collection.prototype,Backbone.Events,{pop:function(){var popped=Array.prototype.pop.apply(this,arguments);this.trigger(Two.Events.remove,[popped]);return popped;},shift:function(){var shifted=Array.prototype.shift.apply(this,arguments);this.trigger(Two.Events.remove,[shifted]);return shifted;},push:function(){var pushed=Array.prototype.push.apply(this,arguments);this.trigger(Two.Events.insert,arguments);return pushed;},unshift:function(){var unshifted=Array.prototype.unshift.apply(this,arguments);this.trigger(Two.Events.insert,arguments);return unshifted;},splice:function(){var spliced=Array.prototype.splice.apply(this,arguments);var inserted;this.trigger(Two.Events.remove,spliced);if(arguments.length>2){inserted=this.slice(arguments[0],arguments.length-2);this.trigger(Two.Events.insert,inserted);this.trigger(Two.Events.order);}return spliced;},sort:function(){Array.prototype.sort.apply(this,arguments);this.trigger(Two.Events.order);return this;},reverse:function(){Array.prototype.reverse.apply(this,arguments);this.trigger(Two.Events.order);return this;}}); // Localize utils
var distanceBetween=Two.Utils.distanceBetween,getAnchorsFromArcData=Two.Utils.getAnchorsFromArcData,distanceBetweenSquared=Two.Utils.distanceBetweenSquared,ratioBetween=Two.Utils.ratioBetween,angleBetween=Two.Utils.angleBetween,getControlPoints=Two.Utils.getControlPoints,getCurveFromPoints=Two.Utils.getCurveFromPoints,solveSegmentIntersection=Two.Utils.solveSegmentIntersection,decoupleShapes=Two.Utils.decoupleShapes,mod=Two.Utils.mod,getBackingStoreRatio=Two.Utils.getBackingStoreRatio,getPointOnCubicBezier=Two.Utils.getPointOnCubicBezier,getCurveLength=Two.Utils.getCurveLength,integrate=Two.Utils.integrate,getReflection=Two.Utils.getReflection;_.extend(Two.prototype,Backbone.Events,{appendTo:function(elem){elem.appendChild(this.renderer.domElement);return this;},play:function(){Two.Utils.setPlaying.call(this,true);return this.trigger(Two.Events.play);},pause:function(){this.playing=false;return this.trigger(Two.Events.pause);}, /**
     * Update positions and calculations in one pass before rendering.
     */update:function(){var animated=!!this._lastFrame;var now=getNow();this.frameCount++;if(animated){this.timeDelta=parseFloat((now-this._lastFrame).toFixed(3));}this._lastFrame=now;var width=this.width;var height=this.height;var renderer=this.renderer; // Update width / height for the renderer
if(width!==renderer.width||height!==renderer.height){renderer.setSize(width,height,this.ratio);}this.trigger(Two.Events.update,this.frameCount,this.timeDelta);return this.render();}, /**
     * Render all drawable - visible objects of the scene.
     */render:function(){this.renderer.render();return this.trigger(Two.Events.render,this.frameCount);}, /**
     * Convenience Methods
     */add:function(o){var objects=o;if(!(objects instanceof Array)){objects=_.toArray(arguments);}this.scene.add(objects);return this;},remove:function(o){var objects=o;if(!(objects instanceof Array)){objects=_.toArray(arguments);}this.scene.remove(objects);return this;},clear:function(){this.scene.remove(_.toArray(this.scene.children));return this;},makeLine:function(x1,y1,x2,y2){var line=new Two.Line(x1,y1,x2,y2);this.scene.add(line);return line;},makeRectangle:function(x,y,width,height){var rect=new Two.Rectangle(x,y,width,height);this.scene.add(rect);return rect;},makeRoundedRectangle:function(x,y,width,height,sides){var rect=new Two.RoundedRectangle(x,y,width,height,sides);this.scene.add(rect);return rect;},makeCircle:function(ox,oy,r){return this.makeEllipse(ox,oy,r,r);},makeEllipse:function(ox,oy,rx,ry){var ellipse=new Two.Ellipse(ox,oy,rx,ry);this.scene.add(ellipse);return ellipse;},makeStar:function(ox,oy,or,ir,sides){var star=new Two.Star(ox,oy,or,ir,sides);this.scene.add(star);return star;},makeCurve:function(p){var l=arguments.length,points=p;if(!_.isArray(p)){points=[];for(var i=0;i<l;i+=2){var x=arguments[i];if(!_.isNumber(x)){break;}var y=arguments[i+1];points.push(new Two.Anchor(x,y));}}var last=arguments[l-1];var curve=new Two.Path(points,!(_.isBoolean(last)?last:undefined),true);var rect=curve.getBoundingClientRect();curve.center().translation.set(rect.left+rect.width/2,rect.top+rect.height/2);this.scene.add(curve);return curve;},makePolygon:function(ox,oy,r,sides){var poly=new Two.Polygon(ox,oy,r,sides);this.scene.add(poly);return poly;}, /*
    * Make an Arc Segment
    */makeArcSegment:function(ox,oy,ir,or,sa,ea,res){var arcSegment=new Two.ArcSegment(ox,oy,ir,or,sa,ea,res);this.scene.add(arcSegment);return arcSegment;}, /**
     * Convenience method to make and draw a Two.Path.
     */makePath:function(p){var l=arguments.length,points=p;if(!_.isArray(p)){points=[];for(var i=0;i<l;i+=2){var x=arguments[i];if(!_.isNumber(x)){break;}var y=arguments[i+1];points.push(new Two.Anchor(x,y));}}var last=arguments[l-1];var path=new Two.Path(points,!(_.isBoolean(last)?last:undefined));var rect=path.getBoundingClientRect();path.center().translation.set(rect.left+rect.width/2,rect.top+rect.height/2);this.scene.add(path);return path;}, /**
     * Convenience method to make and add a Two.Text.
     */makeText:function(message,x,y,styles){var text=new Two.Text(message,x,y,styles);this.add(text);return text;}, /**
     * Convenience method to make and add a Two.LinearGradient.
     */makeLinearGradient:function(x1,y1,x2,y2 /* stops */){var stops=Array.prototype.slice.call(arguments,4);var gradient=new Two.LinearGradient(x1,y1,x2,y2,stops);this.add(gradient);return gradient;}, /**
     * Convenience method to make and add a Two.RadialGradient.
     */makeRadialGradient:function(x1,y1,r /* stops */){var stops=Array.prototype.slice.call(arguments,3);var gradient=new Two.RadialGradient(x1,y1,r,stops);this.add(gradient);return gradient;},makeGroup:function(o){var objects=o;if(!(objects instanceof Array)){objects=_.toArray(arguments);}var group=new Two.Group();this.scene.add(group);group.add(objects);return group;}, /**
     * Interpret an SVG Node and add it to this instance's scene. The
     * distinction should be made that this doesn't `import` svg's, it solely
     * interprets them into something compatible for Two.js — this is slightly
     * different than a direct transcription.
     *
     * @param {Object} svgNode - The node to be parsed
     * @param {Boolean} shallow - Don't create a top-most group but
     *                                    append all contents directly
     */interpret:function(svgNode,shallow){var tag=svgNode.tagName.toLowerCase();if(!(tag in Two.Utils.read)){return null;}var node=Two.Utils.read[tag].call(this,svgNode);if(shallow&&node instanceof Two.Group){this.add(node.children);}else {this.add(node);}return node;}, /**
     * Load an SVG file / text and interpret.
     */load:function(text,callback){var nodes=[],elem,i;if(/.*\.svg/ig.test(text)){Two.Utils.xhr(text,_.bind(function(data){dom.temp.innerHTML=data;for(i=0;i<dom.temp.children.length;i++){elem=dom.temp.children[i];nodes.push(this.interpret(elem));}callback(nodes.length<=1?nodes[0]:nodes,dom.temp.children.length<=1?dom.temp.children[0]:dom.temp.children);},this));return this;}dom.temp.innerHTML=text;for(i=0;i<dom.temp.children.length;i++){elem=dom.temp.children[i];nodes.push(this.interpret(elem));}callback(nodes.length<=1?nodes[0]:nodes,dom.temp.children.length<=1?dom.temp.children[0]:dom.temp.children);return this;}});function fitToWindow(){var wr=document.body.getBoundingClientRect();var width=this.width=wr.width;var height=this.height=wr.height;this.renderer.setSize(width,height,this.ratio);this.trigger(Two.Events.resize,width,height);}function getNow(){return (root.performance&&root.performance.now?root.performance:Date).now();} // Request Animation Frame
(function(){requestAnimationFrame(arguments.callee);Two.Instances.forEach(function(t){if(t.playing){t.update();}});})(); //exports to multiple environments
if(typeof define==='function'&&define.amd) //AMD
define(function(){return Two;});else if(typeof module!="undefined"&&module.exports) //Node
module.exports=Two;})(this.Two,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('underscore'):this._,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('../../node_modules/backbone/backbone-min.js'):this.Backbone,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('requestAnimationFrame'):this.requestAnimationFrame);(function(Two,_,Backbone,requestAnimationFrame){var Vector=Two.Vector=function(x,y){this.x=x||0;this.y=y||0;};_.extend(Vector,{zero:new Two.Vector()});_.extend(Vector.prototype,Backbone.Events,{set:function(x,y){this.x=x;this.y=y;return this;},copy:function(v){this.x=v.x;this.y=v.y;return this;},clear:function(){this.x=0;this.y=0;return this;},clone:function(){return new Vector(this.x,this.y);},add:function(v1,v2){this.x=v1.x+v2.x;this.y=v1.y+v2.y;return this;},addSelf:function(v){this.x+=v.x;this.y+=v.y;return this;},sub:function(v1,v2){this.x=v1.x-v2.x;this.y=v1.y-v2.y;return this;},subSelf:function(v){this.x-=v.x;this.y-=v.y;return this;},multiplySelf:function(v){this.x*=v.x;this.y*=v.y;return this;},multiplyScalar:function(s){this.x*=s;this.y*=s;return this;},divideScalar:function(s){if(s){this.x/=s;this.y/=s;}else {this.set(0,0);}return this;},negate:function(){return this.multiplyScalar(-1);},dot:function(v){return this.x*v.x+this.y*v.y;},lengthSquared:function(){return this.x*this.x+this.y*this.y;},length:function(){return Math.sqrt(this.lengthSquared());},normalize:function(){return this.divideScalar(this.length());},distanceTo:function(v){return Math.sqrt(this.distanceToSquared(v));},distanceToSquared:function(v){var dx=this.x-v.x,dy=this.y-v.y;return dx*dx+dy*dy;},setLength:function(l){return this.normalize().multiplyScalar(l);},equals:function(v,eps){eps=typeof eps==='undefined'?0.0001:eps;return this.distanceTo(v)<eps;},lerp:function(v,t){var x=(v.x-this.x)*t+this.x;var y=(v.y-this.y)*t+this.y;return this.set(x,y);},isZero:function(eps){eps=typeof eps==='undefined'?0.0001:eps;return this.length()<eps;},toString:function(){return this.x+','+this.y;},toObject:function(){return {x:this.x,y:this.y};}});var BoundProto={set:function(x,y){this._x=x;this._y=y;return this.trigger(Two.Events.change);},copy:function(v){this._x=v.x;this._y=v.y;return this.trigger(Two.Events.change);},clear:function(){this._x=0;this._y=0;return this.trigger(Two.Events.change);},clone:function(){return new Vector(this._x,this._y);},add:function(v1,v2){this._x=v1.x+v2.x;this._y=v1.y+v2.y;return this.trigger(Two.Events.change);},addSelf:function(v){this._x+=v.x;this._y+=v.y;return this.trigger(Two.Events.change);},sub:function(v1,v2){this._x=v1.x-v2.x;this._y=v1.y-v2.y;return this.trigger(Two.Events.change);},subSelf:function(v){this._x-=v.x;this._y-=v.y;return this.trigger(Two.Events.change);},multiplySelf:function(v){this._x*=v.x;this._y*=v.y;return this.trigger(Two.Events.change);},multiplyScalar:function(s){this._x*=s;this._y*=s;return this.trigger(Two.Events.change);},divideScalar:function(s){if(s){this._x/=s;this._y/=s;return this.trigger(Two.Events.change);}return this.clear();},negate:function(){return this.multiplyScalar(-1);},dot:function(v){return this._x*v.x+this._y*v.y;},lengthSquared:function(){return this._x*this._x+this._y*this._y;},length:function(){return Math.sqrt(this.lengthSquared());},normalize:function(){return this.divideScalar(this.length());},distanceTo:function(v){return Math.sqrt(this.distanceToSquared(v));},distanceToSquared:function(v){var dx=this._x-v.x,dy=this._y-v.y;return dx*dx+dy*dy;},setLength:function(l){return this.normalize().multiplyScalar(l);},equals:function(v,eps){eps=typeof eps==='undefined'?0.0001:eps;return this.distanceTo(v)<eps;},lerp:function(v,t){var x=(v.x-this._x)*t+this._x;var y=(v.y-this._y)*t+this._y;return this.set(x,y);},isZero:function(eps){eps=typeof eps==='undefined'?0.0001:eps;return this.length()<eps;},toString:function(){return this._x+','+this._y;},toObject:function(){return {x:this._x,y:this._y};}};var xgs={get:function(){return this._x;},set:function(v){this._x=v;this.trigger(Two.Events.change,'x');}};var ygs={get:function(){return this._y;},set:function(v){this._y=v;this.trigger(Two.Events.change,'y');}}; /**
   * Override Backbone bind / on in order to add properly broadcasting.
   * This allows Two.Vector to not broadcast events unless event listeners
   * are explicity bound to it.
   */Two.Vector.prototype.bind=Two.Vector.prototype.on=function(){if(!this._bound){this._x=this.x;this._y=this.y;Object.defineProperty(this,'x',xgs);Object.defineProperty(this,'y',ygs);_.extend(this,BoundProto);this._bound=true; // Reserved for event initialization check
}Backbone.Events.bind.apply(this,arguments);return this;};})(this.Two,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('underscore'):this._,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('backbone'):this.Backbone,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('requestAnimationFrame'):this.requestAnimationFrame);(function(Two,_,Backbone,requestAnimationFrame){ // Localized variables
var commands=Two.Commands; /**
   * An object that holds 3 `Two.Vector`s, the anchor point and its
   * corresponding handles: `left` and `right`.
   */var Anchor=Two.Anchor=function(x,y,ux,uy,vx,vy,command){Two.Vector.call(this,x,y);this._broadcast=_.bind(function(){this.trigger(Two.Events.change);},this);this._command=command||commands.move;this._relative=true;if(!command){return this;}Anchor.AppendCurveProperties(this);if(_.isNumber(ux)){this.controls.left.x=ux;}if(_.isNumber(uy)){this.controls.left.y=uy;}if(_.isNumber(vx)){this.controls.right.x=vx;}if(_.isNumber(vy)){this.controls.right.y=vy;}};_.extend(Anchor,{AppendCurveProperties:function(anchor){anchor.controls={left:new Two.Vector(0,0),right:new Two.Vector(0,0)};}});var AnchorProto={listen:function(){if(!_.isObject(this.controls)){Anchor.AppendCurveProperties(this);}this.controls.left.bind(Two.Events.change,this._broadcast);this.controls.right.bind(Two.Events.change,this._broadcast);return this;},ignore:function(){this.controls.left.unbind(Two.Events.change,this._broadcast);this.controls.right.unbind(Two.Events.change,this._broadcast);return this;},clone:function(){var controls=this.controls;var clone=new Two.Anchor(this.x,this.y,controls&&controls.left.x,controls&&controls.left.y,controls&&controls.right.x,controls&&controls.right.y,this.command);clone.relative=this._relative;return clone;},toObject:function(){var o={x:this.x,y:this.y};if(this._command){o.command=this._command;}if(this._relative){o.relative=this._relative;}if(this.controls){o.controls={left:this.controls.left.toObject(),right:this.controls.right.toObject()};}return o;}};Object.defineProperty(Anchor.prototype,'command',{get:function(){return this._command;},set:function(c){this._command=c;if(this._command===commands.curve&&!_.isObject(this.controls)){Anchor.AppendCurveProperties(this);}return this.trigger(Two.Events.change);}});Object.defineProperty(Anchor.prototype,'relative',{get:function(){return this._relative;},set:function(b){if(this._relative==b){return this;}this._relative=!!b;return this.trigger(Two.Events.change);}});_.extend(Anchor.prototype,Two.Vector.prototype,AnchorProto); // Make it possible to bind and still have the Anchor specific
// inheritance from Two.Vector
Two.Anchor.prototype.bind=Two.Anchor.prototype.on=function(){Two.Vector.prototype.bind.apply(this,arguments);_.extend(this,AnchorProto);};Two.Anchor.prototype.unbind=Two.Anchor.prototype.off=function(){Two.Vector.prototype.unbind.apply(this,arguments);_.extend(this,AnchorProto);};})(this.Two,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('underscore'):this._,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('backbone'):this.Backbone,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('requestAnimationFrame'):this.requestAnimationFrame);(function(Two,_,Backbone,requestAnimationFrame){ /**
   * Constants
   */var cos=Math.cos,sin=Math.sin,tan=Math.tan; /**
   * Two.Matrix contains an array of elements that represent
   * the two dimensional 3 x 3 matrix as illustrated below:
   *
   * =====
   * a b c
   * d e f
   * g h i  // this row is not really used in 2d transformations
   * =====
   *
   * String order is for transform strings: a, d, b, e, c, f
   *
   * @class
   */var Matrix=Two.Matrix=function(a,b,c,d,e,f){this.elements=new Two.Array(9);var elements=a;if(!_.isArray(elements)){elements=_.toArray(arguments);} // initialize the elements with default values.
this.identity().set(elements);};_.extend(Matrix,{Identity:[1,0,0,0,1,0,0,0,1], /**
     * Multiply two matrix 3x3 arrays
     */Multiply:function(A,B,C){if(B.length<=3){ // Multiply Vector
var x,y,z,e=A;var a=B[0]||0,b=B[1]||0,c=B[2]||0; // Go down rows first
// a, d, g, b, e, h, c, f, i
x=e[0]*a+e[1]*b+e[2]*c;y=e[3]*a+e[4]*b+e[5]*c;z=e[6]*a+e[7]*b+e[8]*c;return {x:x,y:y,z:z};}var A0=A[0],A1=A[1],A2=A[2];var A3=A[3],A4=A[4],A5=A[5];var A6=A[6],A7=A[7],A8=A[8];var B0=B[0],B1=B[1],B2=B[2];var B3=B[3],B4=B[4],B5=B[5];var B6=B[6],B7=B[7],B8=B[8];C=C||new Two.Array(9);C[0]=A0*B0+A1*B3+A2*B6;C[1]=A0*B1+A1*B4+A2*B7;C[2]=A0*B2+A1*B5+A2*B8;C[3]=A3*B0+A4*B3+A5*B6;C[4]=A3*B1+A4*B4+A5*B7;C[5]=A3*B2+A4*B5+A5*B8;C[6]=A6*B0+A7*B3+A8*B6;C[7]=A6*B1+A7*B4+A8*B7;C[8]=A6*B2+A7*B5+A8*B8;return C;}});_.extend(Matrix.prototype,Backbone.Events,{ /**
     * Takes an array of elements or the arguments list itself to
     * set and update the current matrix's elements. Only updates
     * specified values.
     */set:function(a){var elements=a;if(!_.isArray(elements)){elements=_.toArray(arguments);}_.extend(this.elements,elements);return this.trigger(Two.Events.change);}, /**
     * Turn matrix to identity, like resetting.
     */identity:function(){this.set(Matrix.Identity);return this;}, /**
     * Multiply scalar or multiply by another matrix.
     */multiply:function(a,b,c,d,e,f,g,h,i){var elements=arguments,l=elements.length; // Multiply scalar
if(l<=1){_.each(this.elements,function(v,i){this.elements[i]=v*a;},this);return this.trigger(Two.Events.change);}if(l<=3){ // Multiply Vector
var x,y,z;a=a||0;b=b||0;c=c||0;e=this.elements; // Go down rows first
// a, d, g, b, e, h, c, f, i
x=e[0]*a+e[1]*b+e[2]*c;y=e[3]*a+e[4]*b+e[5]*c;z=e[6]*a+e[7]*b+e[8]*c;return {x:x,y:y,z:z};} // Multiple matrix
var A=this.elements;var B=elements;var A0=A[0],A1=A[1],A2=A[2];var A3=A[3],A4=A[4],A5=A[5];var A6=A[6],A7=A[7],A8=A[8];var B0=B[0],B1=B[1],B2=B[2];var B3=B[3],B4=B[4],B5=B[5];var B6=B[6],B7=B[7],B8=B[8];this.elements[0]=A0*B0+A1*B3+A2*B6;this.elements[1]=A0*B1+A1*B4+A2*B7;this.elements[2]=A0*B2+A1*B5+A2*B8;this.elements[3]=A3*B0+A4*B3+A5*B6;this.elements[4]=A3*B1+A4*B4+A5*B7;this.elements[5]=A3*B2+A4*B5+A5*B8;this.elements[6]=A6*B0+A7*B3+A8*B6;this.elements[7]=A6*B1+A7*B4+A8*B7;this.elements[8]=A6*B2+A7*B5+A8*B8;return this.trigger(Two.Events.change);},inverse:function(out){var a=this.elements;out=out||new Two.Matrix();var a00=a[0],a01=a[1],a02=a[2];var a10=a[3],a11=a[4],a12=a[5];var a20=a[6],a21=a[7],a22=a[8];var b01=a22*a11-a12*a21;var b11=-a22*a10+a12*a20;var b21=a21*a10-a11*a20; // Calculate the determinant
var det=a00*b01+a01*b11+a02*b21;if(!det){return null;}det=1.0/det;out.elements[0]=b01*det;out.elements[1]=(-a22*a01+a02*a21)*det;out.elements[2]=(a12*a01-a02*a11)*det;out.elements[3]=b11*det;out.elements[4]=(a22*a00-a02*a20)*det;out.elements[5]=(-a12*a00+a02*a10)*det;out.elements[6]=b21*det;out.elements[7]=(-a21*a00+a01*a20)*det;out.elements[8]=(a11*a00-a01*a10)*det;return out;}, /**
     * Set a scalar onto the matrix.
     */scale:function(sx,sy){var l=arguments.length;if(l<=1){sy=sx;}return this.multiply(sx,0,0,0,sy,0,0,0,1);}, /**
     * Rotate the matrix.
     */rotate:function(radians){var c=cos(radians);var s=sin(radians);return this.multiply(c,-s,0,s,c,0,0,0,1);}, /**
     * Translate the matrix.
     */translate:function(x,y){return this.multiply(1,0,x,0,1,y,0,0,1);}, /*
     * Skew the matrix by an angle in the x axis direction.
     */skewX:function(radians){var a=tan(radians);return this.multiply(1,a,0,0,1,0,0,0,1);}, /*
     * Skew the matrix by an angle in the y axis direction.
     */skewY:function(radians){var a=tan(radians);return this.multiply(1,0,0,a,1,0,0,0,1);}, /**
     * Create a transform string to be used with rendering apis.
     */toString:function(fullMatrix){var temp=[];this.toArray(fullMatrix,temp);return temp.join(' ');}, /**
     * Create a transform array to be used with rendering apis.
     */toArray:function(fullMatrix,output){var elements=this.elements;var hasOutput=!!output;var a=parseFloat(elements[0].toFixed(3));var b=parseFloat(elements[1].toFixed(3));var c=parseFloat(elements[2].toFixed(3));var d=parseFloat(elements[3].toFixed(3));var e=parseFloat(elements[4].toFixed(3));var f=parseFloat(elements[5].toFixed(3));if(!!fullMatrix){var g=parseFloat(elements[6].toFixed(3));var h=parseFloat(elements[7].toFixed(3));var i=parseFloat(elements[8].toFixed(3));if(hasOutput){output[0]=a;output[1]=d;output[2]=g;output[3]=b;output[4]=e;output[5]=h;output[6]=c;output[7]=f;output[8]=i;return;}return [a,d,g,b,e,h,c,f,i];}if(hasOutput){output[0]=a;output[1]=d;output[2]=b;output[3]=e;output[4]=c;output[5]=f;return;}return [a,d,b,e,c,f // Specific format see LN:19
];}, /**
     * Clone the current matrix.
     */clone:function(){var a,b,c,d,e,f,g,h,i;a=this.elements[0];b=this.elements[1];c=this.elements[2];d=this.elements[3];e=this.elements[4];f=this.elements[5];g=this.elements[6];h=this.elements[7];i=this.elements[8];return new Two.Matrix(a,b,c,d,e,f,g,h,i);}});})(this.Two,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('underscore'):this._,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('backbone'):this.Backbone,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('requestAnimationFrame'):this.requestAnimationFrame);(function(Two,_,Backbone,requestAnimationFrame){ // Localize variables
var mod=Two.Utils.mod,toFixed=Two.Utils.toFixed;var svg={version:1.1,ns:'http://www.w3.org/2000/svg',xlink:'http://www.w3.org/1999/xlink',alignments:{left:'start',center:'middle',right:'end'}, /**
     * Create an svg namespaced element.
     */createElement:function(name,attrs){var tag=name;var elem=document.createElementNS(this.ns,tag);if(tag==='svg'){attrs=_.defaults(attrs||{},{version:this.version});}if(!_.isEmpty(attrs)){svg.setAttributes(elem,attrs);}return elem;}, /**
     * Add attributes from an svg element.
     */setAttributes:function(elem,attrs){var keys=Object.keys(attrs);for(var i=0;i<keys.length;i++){elem.setAttribute(keys[i],attrs[keys[i]]);}return this;}, /**
     * Remove attributes from an svg element.
     */removeAttributes:function(elem,attrs){for(var key in attrs){elem.removeAttribute(key);}return this;}, /**
     * Turn a set of vertices into a string for the d property of a path
     * element. It is imperative that the string collation is as fast as
     * possible, because this call will be happening multiple times a
     * second.
     */toString:function(points,closed){var l=points.length,last=l-1,d, // The elusive last Two.Commands.move point
ret='';for(var i=0;i<l;i++){var b=points[i];var command;var prev=closed?mod(i-1,l):Math.max(i-1,0);var next=closed?mod(i+1,l):Math.min(i+1,last);var a=points[prev];var c=points[next];var vx,vy,ux,uy,ar,bl,br,cl; // Access x and y directly,
// bypassing the getter
var x=toFixed(b._x);var y=toFixed(b._y);switch(b._command){case Two.Commands.close:command=Two.Commands.close;break;case Two.Commands.curve:ar=a.controls&&a.controls.right||a;bl=b.controls&&b.controls.left||b;if(a._relative){vx=toFixed(ar.x+a.x);vy=toFixed(ar.y+a.y);}else {vx=toFixed(ar.x);vy=toFixed(ar.y);}if(b._relative){ux=toFixed(bl.x+b.x);uy=toFixed(bl.y+b.y);}else {ux=toFixed(bl.x);uy=toFixed(bl.y);}command=(i===0?Two.Commands.move:Two.Commands.curve)+' '+vx+' '+vy+' '+ux+' '+uy+' '+x+' '+y;break;case Two.Commands.move:d=b;command=Two.Commands.move+' '+x+' '+y;break;default:command=b._command+' '+x+' '+y;} // Add a final point and close it off
if(i>=last&&closed){if(b._command===Two.Commands.curve){ // Make sure we close to the most previous Two.Commands.move
c=d;br=b.controls&&b.controls.right||b;cl=c.controls&&c.controls.left||c;if(b._relative){vx=toFixed(br.x+b.x);vy=toFixed(br.y+b.y);}else {vx=toFixed(br.x);vy=toFixed(br.y);}if(c._relative){ux=toFixed(cl.x+c.x);uy=toFixed(cl.y+c.y);}else {ux=toFixed(cl.x);uy=toFixed(cl.y);}x=toFixed(c.x);y=toFixed(c.y);command+=' C '+vx+' '+vy+' '+ux+' '+uy+' '+x+' '+y;}command+=' Z';}ret+=command+' ';}return ret;},getClip:function(shape){var clip=shape._renderer.clip;if(!clip){var root=shape;while(root.parent){root=root.parent;}clip=shape._renderer.clip=svg.createElement('clipPath');root.defs.appendChild(clip);}return clip;},group:{ // TODO: Can speed up.
// TODO: How does this effect a f
appendChild:function(object){var elem=object._renderer.elem;if(!elem){return;}var tag=elem.nodeName;if(!tag||/(radial|linear)gradient/i.test(tag)||object._clip){return;}this.elem.appendChild(elem);},removeChild:function(object){var elem=object._renderer.elem;if(!elem||elem.parentNode!=this.elem){return;}var tag=elem.nodeName;if(!tag){return;} // Defer subtractions while clipping.
if(object._clip){return;}this.elem.removeChild(elem);},orderChild:function(object){this.elem.appendChild(object._renderer.elem);},renderChild:function(child){svg[child._renderer.type].render.call(child,this);},render:function(domElement){this._update(); // Shortcut for hidden objects.
// Doesn't reset the flags, so changes are stored and
// applied once the object is visible again
if(this._opacity===0&&!this._flagOpacity){return this;}if(!this._renderer.elem){this._renderer.elem=svg.createElement('g',{id:this.id});domElement.appendChild(this._renderer.elem);} // _Update styles for the <g>
var flagMatrix=this._matrix.manual||this._flagMatrix;var context={domElement:domElement,elem:this._renderer.elem};if(flagMatrix){this._renderer.elem.setAttribute('transform','matrix('+this._matrix.toString()+')');}for(var i=0;i<this.children.length;i++){var child=this.children[i];svg[child._renderer.type].render.call(child,domElement);}if(this._flagOpacity){this._renderer.elem.setAttribute('opacity',this._opacity);}if(this._flagAdditions){this.additions.forEach(svg.group.appendChild,context);}if(this._flagSubtractions){this.subtractions.forEach(svg.group.removeChild,context);}if(this._flagOrder){this.children.forEach(svg.group.orderChild,context);} /**
         * Commented two-way functionality of clips / masks with groups and
         * polygons. Uncomment when this bug is fixed:
         * https://code.google.com/p/chromium/issues/detail?id=370951
         */ // if (this._flagClip) {
//   clip = svg.getClip(this);
//   elem = this._renderer.elem;
//   if (this._clip) {
//     elem.removeAttribute('id');
//     clip.setAttribute('id', this.id);
//     clip.appendChild(elem);
//   } else {
//     clip.removeAttribute('id');
//     elem.setAttribute('id', this.id);
//     this.parent._renderer.elem.appendChild(elem); // TODO: should be insertBefore
//   }
// }
if(this._flagMask){if(this._mask){this._renderer.elem.setAttribute('clip-path','url(#'+this._mask.id+')');}else {this._renderer.elem.removeAttribute('clip-path');}}return this.flagReset();}},path:{render:function(domElement){this._update(); // Shortcut for hidden objects.
// Doesn't reset the flags, so changes are stored and
// applied once the object is visible again
if(this._opacity===0&&!this._flagOpacity){return this;} // Collect any attribute that needs to be changed here
var changed={};var flagMatrix=this._matrix.manual||this._flagMatrix;if(flagMatrix){changed.transform='matrix('+this._matrix.toString()+')';}if(this._flagVertices){var vertices=svg.toString(this._vertices,this._closed);changed.d=vertices;}if(this._flagFill){if(this._fill&&this._fill._renderer){svg[this._fill._renderer.type].render.call(this._fill,domElement);}changed.fill=this._fill&&this._fill.id?'url(#'+this._fill.id+')':this._fill;}if(this._flagStroke){if(this._stroke&&this._stroke._renderer){svg[this._stroke._renderer.type].render.call(this._stroke,domElement);}changed.stroke=this._stroke&&this._stroke.id?'url(#'+this._stroke.id+')':this._stroke;}if(this._flagLinewidth){changed['stroke-width']=this._linewidth;}if(this._flagOpacity){changed['stroke-opacity']=this._opacity;changed['fill-opacity']=this._opacity;}if(this._flagVisible){changed.visibility=this._visible?'visible':'hidden';}if(this._flagCap){changed['stroke-linecap']=this._cap;}if(this._flagJoin){changed['stroke-linejoin']=this._join;}if(this._flagMiter){changed['stroke-miterlimit']=this._miter;} // If there is no attached DOM element yet,
// create it with all necessary attributes.
if(!this._renderer.elem){changed.id=this.id;this._renderer.elem=svg.createElement('path',changed);domElement.appendChild(this._renderer.elem); // Otherwise apply all pending attributes
}else {svg.setAttributes(this._renderer.elem,changed);}if(this._flagClip){var clip=svg.getClip(this);var elem=this._renderer.elem;if(this._clip){elem.removeAttribute('id');clip.setAttribute('id',this.id);clip.appendChild(elem);}else {clip.removeAttribute('id');elem.setAttribute('id',this.id);this.parent._renderer.elem.appendChild(elem); // TODO: should be insertBefore
}} /**
         * Commented two-way functionality of clips / masks with groups and
         * polygons. Uncomment when this bug is fixed:
         * https://code.google.com/p/chromium/issues/detail?id=370951
         */ // if (this._flagMask) {
//   if (this._mask) {
//     elem.setAttribute('clip-path', 'url(#' + this._mask.id + ')');
//   } else {
//     elem.removeAttribute('clip-path');
//   }
// }
return this.flagReset();}},text:{render:function(domElement){this._update();var changed={};var flagMatrix=this._matrix.manual||this._flagMatrix;if(flagMatrix){changed.transform='matrix('+this._matrix.toString()+')';}if(this._flagFamily){changed['font-family']=this._family;}if(this._flagSize){changed['font-size']=this._size;}if(this._flagLeading){changed['line-height']=this._leading;}if(this._flagAlignment){changed['text-anchor']=svg.alignments[this._alignment]||this._alignment;}if(this._flagBaseline){changed['alignment-baseline']=changed['dominant-baseline']=this._baseline;}if(this._flagStyle){changed['font-style']=this._style;}if(this._flagWeight){changed['font-weight']=this._weight;}if(this._flagDecoration){changed['text-decoration']=this._decoration;}if(this._flagFill){changed.fill=this._fill&&this._fill.id?'url(#'+this._fill.id+')':this._fill;}if(this._flagStroke){changed.stroke=this._stroke&&this._stroke.id?'url(#'+this._stroke.id+')':this._stroke;}if(this._flagLinewidth){changed['stroke-width']=this._linewidth;}if(this._flagOpacity){changed.opacity=this._opacity;}if(this._flagVisible){changed.visibility=this._visible?'visible':'hidden';}if(!this._renderer.elem){changed.id=this.id;this._renderer.elem=svg.createElement('text',changed);domElement.defs.appendChild(this._renderer.elem);}else {svg.setAttributes(this._renderer.elem,changed);}if(this._flagClip){var clip=svg.getClip(this);var elem=this._renderer.elem;if(this._clip){elem.removeAttribute('id');clip.setAttribute('id',this.id);clip.appendChild(elem);}else {clip.removeAttribute('id');elem.setAttribute('id',this.id);this.parent._renderer.elem.appendChild(elem); // TODO: should be insertBefore
}}if(this._flagValue){this._renderer.elem.textContent=this._value;}return this.flagReset();}},'linear-gradient':{render:function(domElement){this._update();var changed={};if(this._flagEndPoints){changed.x1=this.left._x;changed.y1=this.left._y;changed.x2=this.right._x;changed.y2=this.right._y;}if(this._flagSpread){changed.spreadMethod=this._spread;} // If there is no attached DOM element yet,
// create it with all necessary attributes.
if(!this._renderer.elem){changed.id=this.id;changed.gradientUnits='userSpaceOnUse';this._renderer.elem=svg.createElement('linearGradient',changed);domElement.defs.appendChild(this._renderer.elem); // Otherwise apply all pending attributes
}else {svg.setAttributes(this._renderer.elem,changed);}if(this._flagStops){this._renderer.elem.childNodes.length=0;for(var i=0;i<this.stops.length;i++){var stop=this.stops[i];var attrs={};if(stop._flagOffset){attrs.offset=100*stop._offset+'%';}if(stop._flagColor){attrs['stop-color']=stop._color;}if(stop._flagOpacity){attrs['stop-opacity']=stop._opacity;}if(!stop._renderer.elem){stop._renderer.elem=svg.createElement('stop',attrs);}else {svg.setAttributes(stop._renderer.elem,attrs);}this._renderer.elem.appendChild(stop._renderer.elem);stop.flagReset();}}return this.flagReset();}},'radial-gradient':{render:function(domElement){this._update();var changed={};if(this._flagCenter){changed.cx=this.center._x;changed.cy=this.center._y;}if(this._flagFocal){changed.fx=this.focal._x;changed.fy=this.focal._y;}if(this._flagRadius){changed.r=this._radius;}if(this._flagSpread){changed.spreadMethod=this._spread;} // If there is no attached DOM element yet,
// create it with all necessary attributes.
if(!this._renderer.elem){changed.id=this.id;changed.gradientUnits='userSpaceOnUse';this._renderer.elem=svg.createElement('radialGradient',changed);domElement.defs.appendChild(this._renderer.elem); // Otherwise apply all pending attributes
}else {svg.setAttributes(this._renderer.elem,changed);}if(this._flagStops){this._renderer.elem.childNodes.length=0;for(var i=0;i<this.stops.length;i++){var stop=this.stops[i];var attrs={};if(stop._flagOffset){attrs.offset=100*stop._offset+'%';}if(stop._flagColor){attrs['stop-color']=stop._color;}if(stop._flagOpacity){attrs['stop-opacity']=stop._opacity;}if(!stop._renderer.elem){stop._renderer.elem=svg.createElement('stop',attrs);}else {svg.setAttributes(stop._renderer.elem,attrs);}this._renderer.elem.appendChild(stop._renderer.elem);stop.flagReset();}}return this.flagReset();}}}; /**
   * @class
   */var Renderer=Two[Two.Types.svg]=function(params){this.domElement=params.domElement||svg.createElement('svg');this.scene=new Two.Group();this.scene.parent=this;this.defs=svg.createElement('defs');this.domElement.appendChild(this.defs);this.domElement.defs=this.defs;this.domElement.style.overflow='hidden';};_.extend(Renderer,{Utils:svg});_.extend(Renderer.prototype,Backbone.Events,{setSize:function(width,height){this.width=width;this.height=height;svg.setAttributes(this.domElement,{width:width,height:height});return this;},render:function(){svg.group.render.call(this.scene,this.domElement);return this;}});})(this.Two,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('underscore'):this._,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('backbone'):this.Backbone,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('requestAnimationFrame'):this.requestAnimationFrame);(function(Two,_,Backbone,requestAnimationFrame){ /**
   * Constants
   */var mod=Two.Utils.mod,toFixed=Two.Utils.toFixed;var getRatio=Two.Utils.getRatio; // Returns true if this is a non-transforming matrix
var isDefaultMatrix=function(m){return m[0]==1&&m[3]==0&&m[1]==0&&m[4]==1&&m[2]==0&&m[5]==0;};var canvas={isHidden:/(none|transparent)/i,alignments:{left:'start',middle:'center',right:'end'},group:{renderChild:function(child){canvas[child._renderer.type].render.call(child,this.ctx,true,this.clip);},render:function(ctx){ // TODO: Add a check here to only invoke _update if need be.
this._update();var matrix=this._matrix.elements;var parent=this.parent;this._renderer.opacity=this._opacity*(parent&&parent._renderer?parent._renderer.opacity:1);var defaultMatrix=isDefaultMatrix(matrix);var mask=this._mask; // var clip = this._clip;
if(!this._renderer.context){this._renderer.context={};}this._renderer.context.ctx=ctx; // this._renderer.context.clip = clip;
if(!defaultMatrix){ctx.save();ctx.transform(matrix[0],matrix[3],matrix[1],matrix[4],matrix[2],matrix[5]);}if(mask){canvas[mask._renderer.type].render.call(mask,ctx,true);}for(var i=0;i<this.children.length;i++){var child=this.children[i];canvas[child._renderer.type].render.call(child,ctx);}if(!defaultMatrix){ctx.restore();} /**
         * Commented two-way functionality of clips / masks with groups and
         * polygons. Uncomment when this bug is fixed:
         * https://code.google.com/p/chromium/issues/detail?id=370951
         */ // if (clip) {
//   ctx.clip();
// }
return this.flagReset();}},path:{render:function(ctx,forced,parentClipped){var matrix,stroke,linewidth,fill,opacity,visible,cap,join,miter,closed,commands,length,last,next,prev,a,b,c,d,ux,uy,vx,vy,ar,bl,br,cl,x,y,mask,clip,defaultMatrix; // TODO: Add a check here to only invoke _update if need be.
this._update();matrix=this._matrix.elements;stroke=this._stroke;linewidth=this._linewidth;fill=this._fill;opacity=this._opacity*this.parent._renderer.opacity;visible=this._visible;cap=this._cap;join=this._join;miter=this._miter;closed=this._closed;commands=this._vertices; // Commands
length=commands.length;last=length-1;defaultMatrix=isDefaultMatrix(matrix); // mask = this._mask;
clip=this._clip;if(!forced&&(!visible||clip)){return this;} // Transform
if(!defaultMatrix){ctx.save();ctx.transform(matrix[0],matrix[3],matrix[1],matrix[4],matrix[2],matrix[5]);} /**
         * Commented two-way functionality of clips / masks with groups and
         * polygons. Uncomment when this bug is fixed:
         * https://code.google.com/p/chromium/issues/detail?id=370951
         */ // if (mask) {
//   canvas[mask._renderer.type].render.call(mask, ctx, true);
// }
// Styles
if(fill){if(_.isString(fill)){ctx.fillStyle=fill;}else {canvas[fill._renderer.type].render.call(fill,ctx);ctx.fillStyle=fill._renderer.gradient;}}if(stroke){if(_.isString(stroke)){ctx.strokeStyle=stroke;}else {canvas[stroke._renderer.type].render.call(stroke,ctx);ctx.strokeStyle=stroke._renderer.gradient;}}if(linewidth){ctx.lineWidth=linewidth;}if(miter){ctx.miterLimit=miter;}if(join){ctx.lineJoin=join;}if(cap){ctx.lineCap=cap;}if(_.isNumber(opacity)){ctx.globalAlpha=opacity;}ctx.beginPath();for(var i=0;i<commands.length;i++){b=commands[i];x=toFixed(b._x);y=toFixed(b._y);switch(b._command){case Two.Commands.close:ctx.closePath();break;case Two.Commands.curve:prev=closed?mod(i-1,length):Math.max(i-1,0);next=closed?mod(i+1,length):Math.min(i+1,last);a=commands[prev];c=commands[next];ar=a.controls&&a.controls.right||a;bl=b.controls&&b.controls.left||b;if(a._relative){vx=ar.x+toFixed(a._x);vy=ar.y+toFixed(a._y);}else {vx=toFixed(ar.x);vy=toFixed(ar.y);}if(b._relative){ux=bl.x+toFixed(b._x);uy=bl.y+toFixed(b._y);}else {ux=toFixed(bl.x);uy=toFixed(bl.y);}ctx.bezierCurveTo(vx,vy,ux,uy,x,y);if(i>=last&&closed){c=d;br=b.controls&&b.controls.right||b;cl=c.controls&&c.controls.left||c;if(b._relative){vx=br.x+toFixed(b._x);vy=br.y+toFixed(b._y);}else {vx=toFixed(br.x);vy=toFixed(br.y);}if(c._relative){ux=cl.x+toFixed(c._x);uy=cl.y+toFixed(c._y);}else {ux=toFixed(cl.x);uy=toFixed(cl.y);}x=toFixed(c._x);y=toFixed(c._y);ctx.bezierCurveTo(vx,vy,ux,uy,x,y);}break;case Two.Commands.line:ctx.lineTo(x,y);break;case Two.Commands.move:d=b;ctx.moveTo(x,y);break;}} // Loose ends
if(closed){ctx.closePath();}if(!clip&&!parentClipped){if(!canvas.isHidden.test(fill))ctx.fill();if(!canvas.isHidden.test(stroke))ctx.stroke();}if(!defaultMatrix){ctx.restore();}if(clip&&!parentClipped){ctx.clip();}return this.flagReset();}},'linear-gradient':{render:function(ctx){this._update();if(!this._renderer.gradient||this._flagEndPoints||this._flagStops){this._renderer.gradient=ctx.createLinearGradient(this.left._x,this.left._y,this.right._x,this.right._y);for(var i=0;i<this.stops.length;i++){var stop=this.stops[i];this._renderer.gradient.addColorStop(stop._offset,stop._color);}}return this.flagReset();}},text:{render:function(ctx,forced,parentClipped){ // TODO: Add a check here to only invoke _update if need be.
this._update();var matrix=this._matrix.elements;var stroke=this._stroke;var linewidth=this._linewidth;var fill=this._fill;var opacity=this._opacity*this.parent._renderer.opacity;var visible=this._visible;var defaultMatrix=isDefaultMatrix(matrix); // mask = this._mask;
var clip=this._clip;if(!forced&&(!visible||clip)){return this;} // Transform
if(!defaultMatrix){ctx.save();ctx.transform(matrix[0],matrix[3],matrix[1],matrix[4],matrix[2],matrix[5]);} /**
         * Commented two-way functionality of clips / masks with groups and
         * polygons. Uncomment when this bug is fixed:
         * https://code.google.com/p/chromium/issues/detail?id=370951
         */ // if (mask) {
//   canvas[mask._renderer.type].render.call(mask, ctx, true);
// }
ctx.font=[this._style,this._weight,this._size+'px/'+this._leading+'px',this._family].join(' ');ctx.textAlign=canvas.alignments[this._alignment]||this._alignment;ctx.textBaseline=this._baseline; // Styles
if(fill){if(_.isString(fill)){ctx.fillStyle=fill;}else {canvas[fill._renderer.type].render.call(fill,ctx);ctx.fillStyle=fill._renderer.gradient;}}if(stroke){if(_.isString(stroke)){ctx.strokeStyle=stroke;}else {canvas[stroke._renderer.type].render.call(stroke,ctx);ctx.strokeStyle=stroke._renderer.gradient;}}if(linewidth){ctx.lineWidth=linewidth;}if(_.isNumber(opacity)){ctx.globalAlpha=opacity;}if(!clip&&!parentClipped){if(!canvas.isHidden.test(fill))ctx.fillText(this.value,0,0);if(!canvas.isHidden.test(stroke))ctx.strokeText(this.value,0,0);}if(!defaultMatrix){ctx.restore();} // TODO: Test for text
if(clip&&!parentClipped){ctx.clip();}return this.flagReset();}},'radial-gradient':{render:function(ctx){this._update();if(!this._renderer.gradient||this._flagCenter||this._flagFocal||this._flagRadius||this._flagStops){this._renderer.gradient=ctx.createRadialGradient(this.center._x,this.center._y,0,this.focal._x,this.focal._y,this._radius);for(var i=0;i<this.stops.length;i++){var stop=this.stops[i];this._renderer.gradient.addColorStop(stop._offset,stop._color);}}return this.flagReset();}}};var Renderer=Two[Two.Types.canvas]=function(params){ // Smoothing property. Defaults to true
// Set it to false when working with pixel art.
// false can lead to better performance, since it would use a cheaper interpolation algorithm.
// It might not make a big difference on GPU backed canvases.
var smoothing=params.smoothing!==false;this.domElement=params.domElement||document.createElement('canvas');this.ctx=this.domElement.getContext('2d');this.overdraw=params.overdraw||false;this.ctx.imageSmoothingEnabled=smoothing;this.ctx.mozImageSmoothingEnabled=smoothing;this.ctx.oImageSmoothingEnabled=smoothing;this.ctx.webkitImageSmoothingEnabled=smoothing;this.ctx.imageSmoothingEnabled=smoothing; // Everything drawn on the canvas needs to be added to the scene.
this.scene=new Two.Group();this.scene.parent=this;};_.extend(Renderer,{Utils:canvas});_.extend(Renderer.prototype,Backbone.Events,{setSize:function(width,height,ratio){this.width=width;this.height=height;this.ratio=_.isUndefined(ratio)?getRatio(this.ctx):ratio;this.domElement.width=width*this.ratio;this.domElement.height=height*this.ratio;_.extend(this.domElement.style,{width:width+'px',height:height+'px'});return this;},render:function(){var isOne=this.ratio===1;if(!isOne){this.ctx.save();this.ctx.scale(this.ratio,this.ratio);}if(!this.overdraw){this.ctx.clearRect(0,0,this.width,this.height);}canvas.group.render.call(this.scene,this.ctx);if(!isOne){this.ctx.restore();}return this;}});function resetTransform(ctx){ctx.setTransform(1,0,0,1,0,0);}})(this.Two,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('underscore'):this._,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('backbone'):this.Backbone,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('requestAnimationFrame'):this.requestAnimationFrame);(function(Two,_,Backbone,requestAnimationFrame){ /**
   * Constants
   */var multiplyMatrix=Two.Matrix.Multiply,mod=Two.Utils.mod,identity=[1,0,0,0,1,0,0,0,1],transformation=new Two.Array(9),getRatio=Two.Utils.getRatio,getComputedMatrix=Two.Utils.getComputedMatrix,toFixed=Two.Utils.toFixed;var webgl={isHidden:/(none|transparent)/i,canvas:document.createElement('canvas'),alignments:{left:'start',middle:'center',right:'end'},matrix:new Two.Matrix(),uv:new Two.Array([0,0,1,0,0,1,0,1,1,0,1,1]),group:{removeChild:function(child,gl){if(child.children){for(var i=0;i<child.children.length;i++){webgl.group.removeChild(child.children[i],gl);}return;} // Deallocate texture to free up gl memory.
gl.deleteTexture(child._renderer.texture);delete child._renderer.texture;},renderChild:function(child){webgl[child._renderer.type].render.call(child,this.gl,this.program);},render:function(gl,program){this._update();var parent=this.parent;var flagParentMatrix=parent._matrix&&parent._matrix.manual||parent._flagMatrix;var flagMatrix=this._matrix.manual||this._flagMatrix;if(flagParentMatrix||flagMatrix){if(!this._renderer.matrix){this._renderer.matrix=new Two.Array(9);} // Reduce amount of object / array creation / deletion
this._matrix.toArray(true,transformation);multiplyMatrix(transformation,parent._renderer.matrix,this._renderer.matrix);this._renderer.scale=this._scale*parent._renderer.scale;if(flagParentMatrix){this._flagMatrix=true;}}if(this._mask){gl.enable(gl.STENCIL_TEST);gl.stencilFunc(gl.ALWAYS,1,1);gl.colorMask(false,false,false,true);gl.stencilOp(gl.KEEP,gl.KEEP,gl.INCR);webgl[this._mask._renderer.type].render.call(this._mask,gl,program,this);gl.colorMask(true,true,true,true);gl.stencilFunc(gl.NOTEQUAL,0,1);gl.stencilOp(gl.KEEP,gl.KEEP,gl.KEEP);}this._flagOpacity=parent._flagOpacity||this._flagOpacity;this._renderer.opacity=this._opacity*(parent&&parent._renderer?parent._renderer.opacity:1);if(this._flagSubtractions){for(var i=0;i<this.subtractions.length;i++){webgl.group.removeChild(this.subtractions[i],gl);}}this.children.forEach(webgl.group.renderChild,{gl:gl,program:program});if(this._mask){gl.colorMask(false,false,false,false);gl.stencilOp(gl.KEEP,gl.KEEP,gl.DECR);webgl[this._mask._renderer.type].render.call(this._mask,gl,program,this);gl.colorMask(true,true,true,true);gl.stencilFunc(gl.NOTEQUAL,0,1);gl.stencilOp(gl.KEEP,gl.KEEP,gl.KEEP);gl.disable(gl.STENCIL_TEST);}return this.flagReset();}},path:{updateCanvas:function(elem){var next,prev,a,c,ux,uy,vx,vy,ar,bl,br,cl,x,y;var commands=elem._vertices;var canvas=this.canvas;var ctx=this.ctx; // Styles
var scale=elem._renderer.scale;var stroke=elem._stroke;var linewidth=elem._linewidth;var fill=elem._fill;var opacity=elem._renderer.opacity||elem._opacity;var cap=elem._cap;var join=elem._join;var miter=elem._miter;var closed=elem._closed;var length=commands.length;var last=length-1;canvas.width=Math.max(Math.ceil(elem._renderer.rect.width*scale),1);canvas.height=Math.max(Math.ceil(elem._renderer.rect.height*scale),1);var centroid=elem._renderer.rect.centroid;var cx=centroid.x;var cy=centroid.y;ctx.clearRect(0,0,canvas.width,canvas.height);if(fill){if(_.isString(fill)){ctx.fillStyle=fill;}else {webgl[fill._renderer.type].render.call(fill,ctx,elem);ctx.fillStyle=fill._renderer.gradient;}}if(stroke){if(_.isString(stroke)){ctx.strokeStyle=stroke;}else {webgl[stroke._renderer.type].render.call(stroke,ctx,elem);ctx.strokeStyle=stroke._renderer.gradient;}}if(linewidth){ctx.lineWidth=linewidth;}if(miter){ctx.miterLimit=miter;}if(join){ctx.lineJoin=join;}if(cap){ctx.lineCap=cap;}if(_.isNumber(opacity)){ctx.globalAlpha=opacity;}var d;ctx.save();ctx.scale(scale,scale);ctx.translate(cx,cy);ctx.beginPath();for(var i=0;i<commands.length;i++){b=commands[i];x=toFixed(b._x);y=toFixed(b._y);switch(b._command){case Two.Commands.close:ctx.closePath();break;case Two.Commands.curve:prev=closed?mod(i-1,length):Math.max(i-1,0);next=closed?mod(i+1,length):Math.min(i+1,last);a=commands[prev];c=commands[next];ar=a.controls&&a.controls.right||a;bl=b.controls&&b.controls.left||b;if(a._relative){vx=toFixed(ar.x+a._x);vy=toFixed(ar.y+a._y);}else {vx=toFixed(ar.x);vy=toFixed(ar.y);}if(b._relative){ux=toFixed(bl.x+b._x);uy=toFixed(bl.y+b._y);}else {ux=toFixed(bl.x);uy=toFixed(bl.y);}ctx.bezierCurveTo(vx,vy,ux,uy,x,y);if(i>=last&&closed){c=d;br=b.controls&&b.controls.right||b;cl=c.controls&&c.controls.left||c;if(b._relative){vx=toFixed(br.x+b._x);vy=toFixed(br.y+b._y);}else {vx=toFixed(br.x);vy=toFixed(br.y);}if(c._relative){ux=toFixed(cl.x+c._x);uy=toFixed(cl.y+c._y);}else {ux=toFixed(cl.x);uy=toFixed(cl.y);}x=toFixed(c._x);y=toFixed(c._y);ctx.bezierCurveTo(vx,vy,ux,uy,x,y);}break;case Two.Commands.line:ctx.lineTo(x,y);break;case Two.Commands.move:d=b;ctx.moveTo(x,y);break;}} // Loose ends
if(closed){ctx.closePath();}if(!webgl.isHidden.test(fill))ctx.fill();if(!webgl.isHidden.test(stroke))ctx.stroke();ctx.restore();}, /**
       * Returns the rect of a set of verts. Typically takes vertices that are
       * "centered" around 0 and returns them to be anchored upper-left.
       */getBoundingClientRect:function(vertices,border,rect){var left=Infinity,right=-Infinity,top=Infinity,bottom=-Infinity,width,height;vertices.forEach(function(v){var x=v.x,y=v.y,controls=v.controls;var a,b,c,d,cl,cr;top=Math.min(y,top);left=Math.min(x,left);right=Math.max(x,right);bottom=Math.max(y,bottom);if(!v.controls){return;}cl=controls.left;cr=controls.right;if(!cl||!cr){return;}a=v._relative?cl.x+x:cl.x;b=v._relative?cl.y+y:cl.y;c=v._relative?cr.x+x:cr.x;d=v._relative?cr.y+y:cr.y;if(!a||!b||!c||!d){return;}top=Math.min(b,d,top);left=Math.min(a,c,left);right=Math.max(a,c,right);bottom=Math.max(b,d,bottom);}); // Expand borders
if(_.isNumber(border)){top-=border;left-=border;right+=border;bottom+=border;}width=right-left;height=bottom-top;rect.top=top;rect.left=left;rect.right=right;rect.bottom=bottom;rect.width=width;rect.height=height;if(!rect.centroid){rect.centroid={};}rect.centroid.x=-left;rect.centroid.y=-top;},render:function(gl,program,forcedParent){if(!this._visible||!this._opacity){return this;} // Calculate what changed
var parent=this.parent;var flagParentMatrix=parent._matrix.manual||parent._flagMatrix;var flagMatrix=this._matrix.manual||this._flagMatrix;var flagTexture=this._flagVertices||this._flagFill||this._fill instanceof Two.LinearGradient&&(this._fill._flagSpread||this._fill._flagStops||this._fill._flagEndPoints)||this._fill instanceof Two.RadialGradient&&(this._fill._flagSpread||this._fill._flagStops||this._fill._flagRadius||this._fill._flagCenter||this._fill._flagFocal)||this._stroke instanceof Two.LinearGradient&&(this._stroke._flagSpread||this._stroke._flagStops||this._stroke._flagEndPoints)||this._stroke instanceof Two.RadialGradient&&(this._stroke._flagSpread||this._stroke._flagStops||this._stroke._flagRadius||this._stroke._flagCenter||this._stroke._flagFocal)||this._flagStroke||this._flagLinewidth||this._flagOpacity||parent._flagOpacity||this._flagVisible||this._flagCap||this._flagJoin||this._flagMiter||this._flagScale||!this._renderer.texture;this._update();if(flagParentMatrix||flagMatrix){if(!this._renderer.matrix){this._renderer.matrix=new Two.Array(9);} // Reduce amount of object / array creation / deletion
this._matrix.toArray(true,transformation);multiplyMatrix(transformation,parent._renderer.matrix,this._renderer.matrix);this._renderer.scale=this._scale*parent._renderer.scale;}if(flagTexture){if(!this._renderer.rect){this._renderer.rect={};}if(!this._renderer.triangles){this._renderer.triangles=new Two.Array(12);}this._renderer.opacity=this._opacity*parent._renderer.opacity;webgl.path.getBoundingClientRect(this._vertices,this._linewidth,this._renderer.rect);webgl.getTriangles(this._renderer.rect,this._renderer.triangles);webgl.updateBuffer.call(webgl,gl,this,program);webgl.updateTexture.call(webgl,gl,this);} // if (this._mask) {
//   webgl[this._mask._renderer.type].render.call(mask, gl, program, this);
// }
if(this._clip&&!forcedParent){return;} // Draw Texture
gl.bindBuffer(gl.ARRAY_BUFFER,this._renderer.textureCoordsBuffer);gl.vertexAttribPointer(program.textureCoords,2,gl.FLOAT,false,0,0);gl.bindTexture(gl.TEXTURE_2D,this._renderer.texture); // Draw Rect
gl.uniformMatrix3fv(program.matrix,false,this._renderer.matrix);gl.bindBuffer(gl.ARRAY_BUFFER,this._renderer.buffer);gl.vertexAttribPointer(program.position,2,gl.FLOAT,false,0,0);gl.drawArrays(gl.TRIANGLES,0,6);return this.flagReset();}},text:{updateCanvas:function(elem){var canvas=this.canvas;var ctx=this.ctx; // Styles
var scale=elem._renderer.scale;var stroke=elem._stroke;var linewidth=elem._linewidth*scale;var fill=elem._fill;var opacity=elem._renderer.opacity||elem._opacity;canvas.width=Math.max(Math.ceil(elem._renderer.rect.width*scale),1);canvas.height=Math.max(Math.ceil(elem._renderer.rect.height*scale),1);var centroid=elem._renderer.rect.centroid;var cx=centroid.x;var cy=centroid.y;ctx.clearRect(0,0,canvas.width,canvas.height);ctx.font=[elem._style,elem._weight,elem._size+'px/'+elem._leading+'px',elem._family].join(' ');ctx.textAlign='center';ctx.textBaseline='middle'; // Styles
if(fill){if(_.isString(fill)){ctx.fillStyle=fill;}else {webgl[fill._renderer.type].render.call(fill,ctx,elem);ctx.fillStyle=fill._renderer.gradient;}}if(stroke){if(_.isString(stroke)){ctx.strokeStyle=stroke;}else {webgl[stroke._renderer.type].render.call(stroke,ctx,elem);ctx.strokeStyle=stroke._renderer.gradient;}}if(linewidth){ctx.lineWidth=linewidth;}if(_.isNumber(opacity)){ctx.globalAlpha=opacity;}ctx.save();ctx.scale(scale,scale);ctx.translate(cx,cy);if(!webgl.isHidden.test(fill))ctx.fillText(elem.value,0,0);if(!webgl.isHidden.test(stroke))ctx.strokeText(elem.value,0,0);ctx.restore();},getBoundingClientRect:function(elem,rect){var ctx=webgl.ctx;ctx.font=[elem._style,elem._weight,elem._size+'px/'+elem._leading+'px',elem._family].join(' ');ctx.textAlign='center';ctx.textBaseline=elem._baseline; // TODO: Estimate this better
var width=ctx.measureText(elem._value).width;var height=Math.max(elem._size||elem._leading);if(this._linewidth&&!webgl.isHidden.test(this._stroke)){ // width += this._linewidth; // TODO: Not sure if the `measure` calcs this.
height+=this._linewidth;}var w=width/2;var h=height/2;switch(webgl.alignments[elem._alignment]||elem._alignment){case webgl.alignments.left:rect.left=0;rect.right=width;break;case webgl.alignments.right:rect.left=-width;rect.right=0;break;default:rect.left=-w;rect.right=w;} // TODO: Gradients aren't inherited...
switch(elem._baseline){case 'bottom':rect.top=-height;rect.bottom=0;break;case 'top':rect.top=0;rect.bottom=height;break;default:rect.top=-h;rect.bottom=h;}rect.width=width;rect.height=height;if(!rect.centroid){rect.centroid={};} // TODO:
rect.centroid.x=w;rect.centroid.y=h;},render:function(gl,program,forcedParent){if(!this._visible||!this._opacity){return this;} // Calculate what changed
var parent=this.parent;var flagParentMatrix=parent._matrix.manual||parent._flagMatrix;var flagMatrix=this._matrix.manual||this._flagMatrix;var flagTexture=this._flagVertices||this._flagFill||this._fill instanceof Two.LinearGradient&&(this._fill._flagSpread||this._fill._flagStops||this._fill._flagEndPoints)||this._fill instanceof Two.RadialGradient&&(this._fill._flagSpread||this._fill._flagStops||this._fill._flagRadius||this._fill._flagCenter||this._fill._flagFocal)||this._stroke instanceof Two.LinearGradient&&(this._stroke._flagSpread||this._stroke._flagStops||this._stroke._flagEndPoints)||this._stroke instanceof Two.RadialGradient&&(this._stroke._flagSpread||this._stroke._flagStops||this._stroke._flagRadius||this._stroke._flagCenter||this._stroke._flagFocal)||this._flagStroke||this._flagLinewidth||this._flagOpacity||parent._flagOpacity||this._flagVisible||this._flagScale||this._flagValue||this._flagFamily||this._flagSize||this._flagLeading||this._flagAlignment||this._flagBaseline||this._flagStyle||this._flagWeight||this._flagDecoration||!this._renderer.texture;this._update();if(flagParentMatrix||flagMatrix){if(!this._renderer.matrix){this._renderer.matrix=new Two.Array(9);} // Reduce amount of object / array creation / deletion
this._matrix.toArray(true,transformation);multiplyMatrix(transformation,parent._renderer.matrix,this._renderer.matrix);this._renderer.scale=this._scale*parent._renderer.scale;}if(flagTexture){if(!this._renderer.rect){this._renderer.rect={};}if(!this._renderer.triangles){this._renderer.triangles=new Two.Array(12);}this._renderer.opacity=this._opacity*parent._renderer.opacity;webgl.text.getBoundingClientRect(this,this._renderer.rect);webgl.getTriangles(this._renderer.rect,this._renderer.triangles);webgl.updateBuffer.call(webgl,gl,this,program);webgl.updateTexture.call(webgl,gl,this);} // if (this._mask) {
//   webgl[this._mask._renderer.type].render.call(mask, gl, program, this);
// }
if(this._clip&&!forcedParent){return;} // Draw Texture
gl.bindBuffer(gl.ARRAY_BUFFER,this._renderer.textureCoordsBuffer);gl.vertexAttribPointer(program.textureCoords,2,gl.FLOAT,false,0,0);gl.bindTexture(gl.TEXTURE_2D,this._renderer.texture); // Draw Rect
gl.uniformMatrix3fv(program.matrix,false,this._renderer.matrix);gl.bindBuffer(gl.ARRAY_BUFFER,this._renderer.buffer);gl.vertexAttribPointer(program.position,2,gl.FLOAT,false,0,0);gl.drawArrays(gl.TRIANGLES,0,6);return this.flagReset();}},'linear-gradient':{render:function(ctx,elem){if(!ctx.canvas.getContext('2d')){return;}this._update();if(!this._renderer.gradient||this._flagEndPoints||this._flagStops){this._renderer.gradient=ctx.createLinearGradient(this.left._x,this.left._y,this.right._x,this.right._y);for(var i=0;i<this.stops.length;i++){var stop=this.stops[i];this._renderer.gradient.addColorStop(stop._offset,stop._color);}}return this.flagReset();}},'radial-gradient':{render:function(ctx,elem){if(!ctx.canvas.getContext('2d')){return;}this._update();if(!this._renderer.gradient||this._flagCenter||this._flagFocal||this._flagRadius||this._flagStops){this._renderer.gradient=ctx.createRadialGradient(this.center._x,this.center._y,0,this.focal._x,this.focal._y,this._radius);for(var i=0;i<this.stops.length;i++){var stop=this.stops[i];this._renderer.gradient.addColorStop(stop._offset,stop._color);}}return this.flagReset();}},getTriangles:function(rect,triangles){var top=rect.top,left=rect.left,right=rect.right,bottom=rect.bottom; // First Triangle
triangles[0]=left;triangles[1]=top;triangles[2]=right;triangles[3]=top;triangles[4]=left;triangles[5]=bottom; // Second Triangle
triangles[6]=left;triangles[7]=bottom;triangles[8]=right;triangles[9]=top;triangles[10]=right;triangles[11]=bottom;},updateTexture:function(gl,elem){this[elem._renderer.type].updateCanvas.call(webgl,elem);if(elem._renderer.texture){gl.deleteTexture(elem._renderer.texture);}gl.bindBuffer(gl.ARRAY_BUFFER,elem._renderer.textureCoordsBuffer);elem._renderer.texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,elem._renderer.texture); // Set the parameters so we can render any size image.
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR); // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
if(this.canvas.width<=0||this.canvas.height<=0){return;} // Upload the image into the texture.
gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,this.canvas);},updateBuffer:function(gl,elem,program){if(_.isObject(elem._renderer.buffer)){gl.deleteBuffer(elem._renderer.buffer);}elem._renderer.buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,elem._renderer.buffer);gl.enableVertexAttribArray(program.position);gl.bufferData(gl.ARRAY_BUFFER,elem._renderer.triangles,gl.STATIC_DRAW);if(_.isObject(elem._renderer.textureCoordsBuffer)){gl.deleteBuffer(elem._renderer.textureCoordsBuffer);}elem._renderer.textureCoordsBuffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,elem._renderer.textureCoordsBuffer);gl.enableVertexAttribArray(program.textureCoords);gl.bufferData(gl.ARRAY_BUFFER,this.uv,gl.STATIC_DRAW);},program:{create:function(gl,shaders){var program,linked,error;program=gl.createProgram();_.each(shaders,function(s){gl.attachShader(program,s);});gl.linkProgram(program);linked=gl.getProgramParameter(program,gl.LINK_STATUS);if(!linked){error=gl.getProgramInfoLog(program);gl.deleteProgram(program);throw new Two.Utils.Error('unable to link program: '+error);}return program;}},shaders:{create:function(gl,source,type){var shader,compiled,error;shader=gl.createShader(gl[type]);gl.shaderSource(shader,source);gl.compileShader(shader);compiled=gl.getShaderParameter(shader,gl.COMPILE_STATUS);if(!compiled){error=gl.getShaderInfoLog(shader);gl.deleteShader(shader);throw new Two.Utils.Error('unable to compile shader '+shader+': '+error);}return shader;},types:{vertex:'VERTEX_SHADER',fragment:'FRAGMENT_SHADER'},vertex:['attribute vec2 a_position;','attribute vec2 a_textureCoords;','','uniform mat3 u_matrix;','uniform vec2 u_resolution;','','varying vec2 v_textureCoords;','','void main() {','   vec2 projected = (u_matrix * vec3(a_position, 1.0)).xy;','   vec2 normal = projected / u_resolution;','   vec2 clipspace = (normal * 2.0) - 1.0;','','   gl_Position = vec4(clipspace * vec2(1.0, -1.0), 0.0, 1.0);','   v_textureCoords = a_textureCoords;','}'].join('\n'),fragment:['precision mediump float;','','uniform sampler2D u_image;','varying vec2 v_textureCoords;','','void main() {','  gl_FragColor = texture2D(u_image, v_textureCoords);','}'].join('\n')}};webgl.ctx=webgl.canvas.getContext('2d');var Renderer=Two[Two.Types.webgl]=function(options){var params,gl,vs,fs;this.domElement=options.domElement||document.createElement('canvas'); // Everything drawn on the canvas needs to come from the stage.
this.scene=new Two.Group();this.scene.parent=this;this._renderer={matrix:new Two.Array(identity),scale:1,opacity:1};this._flagMatrix=true; // http://games.greggman.com/game/webgl-and-alpha/
// http://www.khronos.org/registry/webgl/specs/latest/#5.2
params=_.defaults(options||{},{antialias:false,alpha:true,premultipliedAlpha:true,stencil:true,preserveDrawingBuffer:true,overdraw:false});this.overdraw=params.overdraw;gl=this.ctx=this.domElement.getContext('webgl',params)||this.domElement.getContext('experimental-webgl',params);if(!this.ctx){throw new Two.Utils.Error('unable to create a webgl context. Try using another renderer.');} // Compile Base Shaders to draw in pixel space.
vs=webgl.shaders.create(gl,webgl.shaders.vertex,webgl.shaders.types.vertex);fs=webgl.shaders.create(gl,webgl.shaders.fragment,webgl.shaders.types.fragment);this.program=webgl.program.create(gl,[vs,fs]);gl.useProgram(this.program); // Create and bind the drawing buffer
// look up where the vertex data needs to go.
this.program.position=gl.getAttribLocation(this.program,'a_position');this.program.matrix=gl.getUniformLocation(this.program,'u_matrix');this.program.textureCoords=gl.getAttribLocation(this.program,'a_textureCoords'); // Copied from Three.js WebGLRenderer
gl.disable(gl.DEPTH_TEST); // Setup some initial statements of the gl context
gl.enable(gl.BLEND); // https://code.google.com/p/chromium/issues/detail?id=316393
// gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, gl.TRUE);
gl.blendEquationSeparate(gl.FUNC_ADD,gl.FUNC_ADD);gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,gl.ONE,gl.ONE_MINUS_SRC_ALPHA);};_.extend(Renderer.prototype,Backbone.Events,{setSize:function(width,height,ratio){this.width=width;this.height=height;this.ratio=_.isUndefined(ratio)?getRatio(this.ctx):ratio;this.domElement.width=width*this.ratio;this.domElement.height=height*this.ratio;_.extend(this.domElement.style,{width:width+'px',height:height+'px'});width*=this.ratio;height*=this.ratio; // Set for this.stage parent scaling to account for HDPI
this._renderer.matrix[0]=this._renderer.matrix[4]=this._renderer.scale=this.ratio;this._flagMatrix=true;this.ctx.viewport(0,0,width,height);var resolutionLocation=this.ctx.getUniformLocation(this.program,'u_resolution');this.ctx.uniform2f(resolutionLocation,width,height);return this;},render:function(){var gl=this.ctx;if(!this.overdraw){gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);}webgl.group.render.call(this.scene,gl,this.program);this._flagMatrix=false;return this;}});})(this.Two,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('underscore'):this._,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('backbone'):this.Backbone,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('requestAnimationFrame'):this.requestAnimationFrame);(function(Two,_,Backbone,requestAnimationFrame){var Shape=Two.Shape=function(){ // Private object for renderer specific variables.
this._renderer={};this.id=Two.Identifier+Two.uniqueId();this.classList=[]; // Define matrix properties which all inherited
// objects of Shape have.
this._matrix=new Two.Matrix();this.translation=new Two.Vector();this.translation.bind(Two.Events.change,_.bind(Shape.FlagMatrix,this));this.rotation=0;this.scale=1;};_.extend(Shape,Backbone.Events,{FlagMatrix:function(){this._flagMatrix=true;},MakeObservable:function(object){Object.defineProperty(object,'rotation',{get:function(){return this._rotation;},set:function(v){this._rotation=v;this._flagMatrix=true;}});Object.defineProperty(object,'scale',{get:function(){return this._scale;},set:function(v){this._scale=v;this._flagMatrix=true;this._flagScale=true;}});}});_.extend(Shape.prototype,{ // Flags
_flagMatrix:true, // _flagMask: false,
// _flagClip: false,
// Underlying Properties
_rotation:0,_scale:1, // _mask: null,
// _clip: false,
addTo:function(group){group.add(this);return this;},clone:function(){var clone=new Shape();clone.translation.copy(this.translation);clone.rotation=this.rotation;clone.scale=this.scale;_.each(Shape.Properties,function(k){clone[k]=this[k];},this);return clone._update();}, /**
     * To be called before render that calculates and collates all information
     * to be as up-to-date as possible for the render. Called once a frame.
     */_update:function(deep){if(!this._matrix.manual&&this._flagMatrix){this._matrix.identity().translate(this.translation.x,this.translation.y).scale(this.scale).rotate(this.rotation);}if(deep){ // Bubble up to parents mainly for `getBoundingClientRect` method.
if(this.parent&&this.parent._update){this.parent._update();}}return this;},flagReset:function(){this._flagMatrix=this._flagScale=false;return this;}});Shape.MakeObservable(Shape.prototype);})(this.Two,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('underscore'):this._,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('backbone'):this.Backbone,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('requestAnimationFrame'):this.requestAnimationFrame);(function(Two,_,Backbone,requestAnimationFrame){ /**
   * Constants
   */var min=Math.min,max=Math.max,round=Math.round,getComputedMatrix=Two.Utils.getComputedMatrix;var commands={};_.each(Two.Commands,function(v,k){commands[k]=new RegExp(v);});var Path=Two.Path=function(vertices,closed,curved,manual){Two.Shape.call(this);this._renderer.type='path';this._closed=!!closed;this._curved=!!curved;this.beginning=0;this.ending=1; // Style properties
this.fill='#fff';this.stroke='#000';this.linewidth=1.0;this.opacity=1.0;this.visible=true;this.cap='butt'; // Default of Adobe Illustrator
this.join='miter'; // Default of Adobe Illustrator
this.miter=4; // Default of Adobe Illustrator
this._vertices=[];this.vertices=vertices; // Determines whether or not two.js should calculate curves, lines, and
// commands automatically for you or to let the developer manipulate them
// for themselves.
this.automatic=!manual;};_.extend(Path,{Properties:['fill','stroke','linewidth','opacity','visible','cap','join','miter','closed','curved','automatic','beginning','ending'],FlagVertices:function(){this._flagVertices=true;this._flagLength=true;},MakeObservable:function(object){Two.Shape.MakeObservable(object); // Only the first 8 properties are flagged like this. The subsequent
// properties behave differently and need to be hand written.
_.each(Path.Properties.slice(0,8),function(property){var secret='_'+property;var flag='_flag'+property.charAt(0).toUpperCase()+property.slice(1);Object.defineProperty(object,property,{get:function(){return this[secret];},set:function(v){this[secret]=v;this[flag]=true;}});});Object.defineProperty(object,'length',{get:function(){if(this._flagLength){this._updateLength();}return this._length;}});Object.defineProperty(object,'closed',{get:function(){return this._closed;},set:function(v){this._closed=!!v;this._flagVertices=true;}});Object.defineProperty(object,'curved',{get:function(){return this._curved;},set:function(v){this._curved=!!v;this._flagVertices=true;}});Object.defineProperty(object,'automatic',{get:function(){return this._automatic;},set:function(v){if(v===this._automatic){return;}this._automatic=!!v;var method=this._automatic?'ignore':'listen';_.each(this.vertices,function(v){v[method]();});}});Object.defineProperty(object,'beginning',{get:function(){return this._beginning;},set:function(v){this._beginning=min(max(v,0.0),this._ending);this._flagVertices=true;}});Object.defineProperty(object,'ending',{get:function(){return this._ending;},set:function(v){this._ending=min(max(v,this._beginning),1.0);this._flagVertices=true;}});Object.defineProperty(object,'vertices',{get:function(){return this._collection;},set:function(vertices){var updateVertices=_.bind(Path.FlagVertices,this);var bindVerts=_.bind(function(items){ // This function is called a lot
// when importing a large SVG
var i=items.length;while(i--){items[i].bind(Two.Events.change,updateVertices);}updateVertices();},this);var unbindVerts=_.bind(function(items){_.each(items,function(v){v.unbind(Two.Events.change,updateVertices);},this);updateVertices();},this); // Remove previous listeners
if(this._collection){this._collection.unbind();} // Create new Collection with copy of vertices
this._collection=new Two.Utils.Collection((vertices||[]).slice(0)); // Listen for Collection changes and bind / unbind
this._collection.bind(Two.Events.insert,bindVerts);this._collection.bind(Two.Events.remove,unbindVerts); // Bind Initial Vertices
bindVerts(this._collection);}});Object.defineProperty(object,'clip',{get:function(){return this._clip;},set:function(v){this._clip=v;this._flagClip=true;}});}});_.extend(Path.prototype,Two.Shape.prototype,{ // Flags
// http://en.wikipedia.org/wiki/Flag
_flagVertices:true,_flagLength:true,_flagFill:true,_flagStroke:true,_flagLinewidth:true,_flagOpacity:true,_flagVisible:true,_flagCap:true,_flagJoin:true,_flagMiter:true,_flagClip:false, // Underlying Properties
_length:0,_fill:'#fff',_stroke:'#000',_linewidth:1.0,_opacity:1.0,_visible:true,_cap:'round',_join:'round',_miter:4,_closed:true,_curved:false,_automatic:true,_beginning:0,_ending:1.0,_clip:false,clone:function(parent){parent=parent||this.parent;var points=_.map(this.vertices,function(v){return v.clone();});var clone=new Path(points,this.closed,this.curved,!this.automatic);_.each(Two.Path.Properties,function(k){clone[k]=this[k];},this);clone.translation.copy(this.translation);clone.rotation=this.rotation;clone.scale=this.scale;parent.add(clone);return clone;},toObject:function(){var result={vertices:_.map(this.vertices,function(v){return v.toObject();})};_.each(Two.Shape.Properties,function(k){result[k]=this[k];},this);result.translation=this.translation.toObject;result.rotation=this.rotation;result.scale=this.scale;return result;},noFill:function(){this.fill='transparent';return this;},noStroke:function(){this.stroke='transparent';return this;}, /**
     * Orient the vertices of the shape to the upper lefthand
     * corner of the path.
     */corner:function(){var rect=this.getBoundingClientRect(true);rect.centroid={x:rect.left+rect.width/2,y:rect.top+rect.height/2};_.each(this.vertices,function(v){v.addSelf(rect.centroid);});return this;}, /**
     * Orient the vertices of the shape to the center of the
     * path.
     */center:function(){var rect=this.getBoundingClientRect(true);rect.centroid={x:rect.left+rect.width/2,y:rect.top+rect.height/2};_.each(this.vertices,function(v){v.subSelf(rect.centroid);}); // this.translation.addSelf(rect.centroid);
return this;}, /**
     * Remove self from the scene / parent.
     */remove:function(){if(!this.parent){return this;}this.parent.remove(this);return this;}, /**
     * Return an object with top, left, right, bottom, width, and height
     * parameters of the group.
     */getBoundingClientRect:function(shallow){var matrix,border,l,x,y,i,v;var left=Infinity,right=-Infinity,top=Infinity,bottom=-Infinity; // TODO: Update this to not __always__ update. Just when it needs to.
this._update(true);matrix=!!shallow?this._matrix:getComputedMatrix(this);border=this.linewidth/2;l=this._vertices.length;for(i=0;i<l;i++){v=this._vertices[i];x=v.x;y=v.y;v=matrix.multiply(x,y,1);top=min(v.y-border,top);left=min(v.x-border,left);right=max(v.x+border,right);bottom=max(v.y+border,bottom);}return {top:top,left:left,right:right,bottom:bottom,width:right-left,height:bottom-top};}, /**
     * Given a float `t` from 0 to 1, return a point or assign a passed `obj`'s
     * coordinates to that percentage on this Two.Path's curve.
     */getPointAt:function(t,obj){var x,x1,x2,x3,x4,y,y1,y2,y3,y4,left,right;var target=this.length*Math.min(Math.max(t,0),1);var length=this.vertices.length;var last=length-1;var a=null;var b=null;for(var i=0,l=this._lengths.length,sum=0;i<l;i++){if(sum+this._lengths[i]>target){a=this.vertices[this.closed?Two.Utils.mod(i,length):i];b=this.vertices[Math.min(Math.max(i-1,0),last)];target-=sum;t=target/this._lengths[i];break;}sum+=this._lengths[i];}if(_.isNull(a)||_.isNull(b)){return null;}right=b.controls&&b.controls.right;left=a.controls&&a.controls.left;x1=b.x;y1=b.y;x2=(right||b).x;y2=(right||b).y;x3=(left||a).x;y3=(left||a).y;x4=a.x;y4=a.y;if(right&&b._relative){x2+=b.x;y2+=b.y;}if(left&&a._relative){x3+=a.x;y3+=a.y;}x=Two.Utils.getPointOnCubicBezier(t,x1,x2,x3,x4);y=Two.Utils.getPointOnCubicBezier(t,y1,y2,y3,y4);if(_.isObject(obj)){obj.x=x;obj.y=y;return obj;}return new Two.Vector(x,y);}, /**
     * Based on closed / curved and sorting of vertices plot where all points
     * should be and where the respective handles should be too.
     */plot:function(){if(this.curved){Two.Utils.getCurveFromPoints(this._vertices,this.closed);return this;}for(var i=0;i<this._vertices.length;i++){this._vertices[i]._command=i===0?Two.Commands.move:Two.Commands.line;}return this;},subdivide:function(limit){ //TODO: DRYness (function below)
this._update();var last=this.vertices.length-1;var b=this.vertices[last];var closed=this._closed||this.vertices[last]._command===Two.Commands.close;var points=[];_.each(this.vertices,function(a,i){if(i<=0&&!closed){b=a;return;}if(a.command===Two.Commands.move){points.push(new Two.Anchor(b.x,b.y));if(i>0){points[points.length-1].command=Two.Commands.line;}b=a;return;}var verts=getSubdivisions(a,b,limit);points=points.concat(verts); // Assign commands to all the verts
_.each(verts,function(v,i){if(i<=0&&b.command===Two.Commands.move){v.command=Two.Commands.move;}else {v.command=Two.Commands.line;}});if(i>=last){ // TODO: Add check if the two vectors in question are the same values.
if(this._closed&&this._automatic){b=a;verts=getSubdivisions(a,b,limit);points=points.concat(verts); // Assign commands to all the verts
_.each(verts,function(v,i){if(i<=0&&b.command===Two.Commands.move){v.command=Two.Commands.move;}else {v.command=Two.Commands.line;}});}else if(closed){points.push(new Two.Anchor(a.x,a.y));}points[points.length-1].command=closed?Two.Commands.close:Two.Commands.line;}b=a;},this);this._automatic=false;this._curved=false;this.vertices=points;return this;},_updateLength:function(limit){ //TODO: DRYness (function above)
this._update();var last=this.vertices.length-1;var b=this.vertices[last];var closed=this._closed||this.vertices[last]._command===Two.Commands.close;var sum=0;if(_.isUndefined(this._lengths)){this._lengths=[];}_.each(this.vertices,function(a,i){if(i<=0&&!closed||a.command===Two.Commands.move){b=a;this._lengths[i]=0;return;}this._lengths[i]=getCurveLength(a,b,limit);sum+=this._lengths[i];if(i>=last&&closed){b=a;this._lengths[i+1]=getCurveLength(a,b,limit);sum+=this._lengths[i+1];}b=a;},this);this._length=sum;return this;},_update:function(){if(this._flagVertices){var l=this.vertices.length;var last=l-1,v;var ia=round(this._beginning*last);var ib=round(this._ending*last);this._vertices.length=0;for(var i=ia;i<ib+1;i++){v=this.vertices[i];this._vertices.push(v);}if(this._automatic){this.plot();}}Two.Shape.prototype._update.apply(this,arguments);return this;},flagReset:function(){this._flagVertices=this._flagFill=this._flagStroke=this._flagLinewidth=this._flagOpacity=this._flagVisible=this._flagCap=this._flagJoin=this._flagMiter=this._flagClip=false;Two.Shape.prototype.flagReset.call(this);return this;}});Path.MakeObservable(Path.prototype); /**
   * Utility functions
   */function getCurveLength(a,b,limit){ // TODO: DRYness
var x1,x2,x3,x4,y1,y2,y3,y4;var right=b.controls&&b.controls.right;var left=a.controls&&a.controls.left;x1=b.x;y1=b.y;x2=(right||b).x;y2=(right||b).y;x3=(left||a).x;y3=(left||a).y;x4=a.x;y4=a.y;if(right&&b._relative){x2+=b.x;y2+=b.y;}if(left&&a._relative){x3+=a.x;y3+=a.y;}return Two.Utils.getCurveLength(x1,y1,x2,y2,x3,y3,x4,y4,limit);}function getSubdivisions(a,b,limit){ // TODO: DRYness
var x1,x2,x3,x4,y1,y2,y3,y4;var right=b.controls&&b.controls.right;var left=a.controls&&a.controls.left;x1=b.x;y1=b.y;x2=(right||b).x;y2=(right||b).y;x3=(left||a).x;y3=(left||a).y;x4=a.x;y4=a.y;if(right&&b._relative){x2+=b.x;y2+=b.y;}if(left&&a._relative){x3+=a.x;y3+=a.y;}return Two.Utils.subdivide(x1,y1,x2,y2,x3,y3,x4,y4,limit);}})(this.Two,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('underscore'):this._,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('backbone'):this.Backbone,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('requestAnimationFrame'):this.requestAnimationFrame);(function(Two,_,Backbone,requestAnimationFrame){var Path=Two.Path;var Line=Two.Line=function(x1,y1,x2,y2){var width=x2-x1;var height=y2-y1;var w2=width/2;var h2=height/2;Path.call(this,[new Two.Anchor(-w2,-h2),new Two.Anchor(w2,h2)]);this.translation.set(x1+w2,y1+h2);};_.extend(Line.prototype,Path.prototype);Path.MakeObservable(Line.prototype);})(this.Two,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('underscore'):this._,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('backbone'):this.Backbone,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('requestAnimationFrame'):this.requestAnimationFrame);(function(Two,_,Backbone,requestAnimationFrame){var Path=Two.Path;var Rectangle=Two.Rectangle=function(x,y,width,height){var w2=width/2;var h2=height/2;Path.call(this,[new Two.Anchor(-w2,-h2),new Two.Anchor(w2,-h2),new Two.Anchor(w2,h2),new Two.Anchor(-w2,h2)],true);this.translation.set(x,y);};_.extend(Rectangle.prototype,Path.prototype);Path.MakeObservable(Rectangle.prototype);})(this.Two,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('underscore'):this._,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('backbone'):this.Backbone,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('requestAnimationFrame'):this.requestAnimationFrame);(function(Two,_,Backbone,requestAnimationFrame){var Path=Two.Path,TWO_PI=Math.PI*2,cos=Math.cos,sin=Math.sin;var Ellipse=Two.Ellipse=function(ox,oy,rx,ry){if(!_.isNumber(ry)){ry=rx;}var amount=Two.Resolution;var points=_.map(_.range(amount),function(i){var pct=i/amount;var theta=pct*TWO_PI;var x=rx*cos(theta);var y=ry*sin(theta);return new Two.Anchor(x,y);},this);Path.call(this,points,true,true);this.translation.set(ox,oy);};_.extend(Ellipse.prototype,Path.prototype);Path.MakeObservable(Ellipse.prototype);})(this.Two,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('underscore'):this._,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('backbone'):this.Backbone,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('requestAnimationFrame'):this.requestAnimationFrame);(function(Two,_,Backbone,requestAnimationFrame){var Path=Two.Path,TWO_PI=Math.PI*2,cos=Math.cos,sin=Math.sin;var Polygon=Two.Polygon=function(ox,oy,r,sides){sides=Math.max(sides||0,3);var points=_.map(_.range(sides),function(i){var pct=(i+0.5)/sides;var theta=TWO_PI*pct+Math.PI/2;var x=r*cos(theta);var y=r*sin(theta);return new Two.Anchor(x,y);});Path.call(this,points,true);this.translation.set(ox,oy);};_.extend(Polygon.prototype,Path.prototype);Path.MakeObservable(Polygon.prototype);})(this.Two,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('underscore'):this._,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('backbone'):this.Backbone,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('requestAnimationFrame'):this.requestAnimationFrame);(function(Two,_,Backbone,requestAnimationFrame){var Path=Two.Path,PI=Math.PI,TWO_PI=Math.PI*2,HALF_PI=Math.PI/2,cos=Math.cos,sin=Math.sin,abs=Math.abs; /*
  @class ArcSegment
    ox : Origin X
    oy : Origin Y
    ir : Inner Radius
    or : Outer Radius
    sa : Starting Angle
    ea : Ending Angle
    res : Resolution
  */var ArcSegment=Two.ArcSegment=function(ox,oy,ir,or,sa,ea,res){if(sa>ea){ea+=Math.PI*2;}res=res||8;var rot=sa;var ta=ea-sa;var angleStep=ta/res;var command=Two.Commands.move;var points=[];points.push(new Two.Anchor(Math.sin(0)*or,Math.cos(0)*or,0,0,0,0,command));var theta,x,y,lx,ly,rx,ry;command=Two.Commands.curve; //Do Outer Edge
for(var i=0;i<res+1;i++){theta=i*angleStep;x=sin(theta)*or;y=cos(theta)*or;lx=sin(theta-HALF_PI)*(angleStep/PI)*or;ly=cos(theta-HALF_PI)*(angleStep/PI)*or;rx=sin(theta+HALF_PI)*(angleStep/PI)*or;ry=cos(theta+HALF_PI)*(angleStep/PI)*or;if(i===0){lx=ly=0;}if(i===res){rx=ry=0;}points.push(new Two.Anchor(x,y,lx,ly,rx,ry,command));} //Do Inner Edge
for(var j=0;j<res+1;j++){theta=ta-angleStep*j;x=sin(theta)*ir;y=cos(theta)*ir;lx=sin(theta-PI*1.5)*(angleStep/PI)*ir;ly=cos(theta-PI*1.5)*(angleStep/PI)*ir;rx=sin(theta+PI*1.5)*(angleStep/PI)*ir;ry=cos(theta+PI*1.5)*(angleStep/PI)*ir;if(j===0){lx=ly=0;}if(j===res){rx=ry=0;}points.push(new Two.Anchor(x,y,lx,ly,rx,ry,command));}command=Two.Commands.close;points.push(new Two.Anchor(Math.sin(0)*or,Math.cos(0)*or,0,0,0,0,command));Path.call(this,points,true,false,true);this.rotation=sa;this.translation.set(ox,oy);};_.extend(ArcSegment.prototype,Path.prototype);Path.MakeObservable(ArcSegment.prototype);})(this.Two,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('underscore'):this._,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('backbone'):this.Backbone,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('requestAnimationFrame'):this.requestAnimationFrame);(function(Two,_,Backbone,requestAnimationFrame){var Path=Two.Path,PI=Math.PI,TWO_PI=Math.PI*2,cos=Math.cos,sin=Math.sin,abs=Math.abs;var SineRing=Two.SineRing=function(ox,oy,r,periods,amplitude,mod){var size=periods*2+1;var angleStep=Math.PI/periods;var bezierDelta=PI*r/periods/2;mod=mod||1;var points=[];var theta=PI,x,y,lx,ly,rx,ry;points.push(new Two.Anchor(sin(theta)*(r+amplitude/2),cos(theta)*(r+amplitude/2),0,0,0,0,Two.Commands.move));for(var i=0;i<size;i++){theta=angleStep*i+PI;if(i%2===0){x=Math.sin(theta)*(r+amplitude/2);y=Math.cos(theta)*(r+amplitude/2);}else {x=Math.sin(theta)*(r-amplitude/2);y=Math.cos(theta)*(r-amplitude/2);}lx=Math.sin(theta-Math.PI/2)*bezierDelta*mod;ly=Math.cos(theta-Math.PI/2)*bezierDelta*mod;rx=Math.sin(theta+Math.PI/2)*bezierDelta*mod;ry=Math.cos(theta+Math.PI/2)*bezierDelta*mod;if(i===0){lx=ly=0;}if(i===size-1){rx=ry=0;}points.push(new Two.Anchor(x,y,lx,ly,rx,ry,Two.Commands.curve));}Path.call(this,points,true,false,true);this.translation.set(ox,oy);};_.extend(SineRing.prototype,Path.prototype);Path.MakeObservable(SineRing.prototype);})(this.Two,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('underscore'):this._,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('backbone'):this.Backbone,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('requestAnimationFrame'):this.requestAnimationFrame);(function(Two,_,Backbone,requestAnimationFrame){var Path=Two.Path,TWO_PI=Math.PI*2,cos=Math.cos,sin=Math.sin;var Star=Two.Star=function(ox,oy,or,ir,sides){if(!_.isNumber(ir)){ir=or/2;}if(!_.isNumber(sides)||sides<=0){sides=5;}var length=sides*2;var points=_.map(_.range(length),function(i){var pct=(i-0.5)/length;var theta=pct*TWO_PI;var r=i%2?ir:or;var x=r*cos(theta);var y=r*sin(theta);return new Two.Anchor(x,y);});Path.call(this,points,true);this.translation.set(ox,oy);};_.extend(Star.prototype,Path.prototype);Path.MakeObservable(Star.prototype);})(this.Two,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('underscore'):this._,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('backbone'):this.Backbone,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('requestAnimationFrame'):this.requestAnimationFrame);(function(Two,_,Backbone,requestAnimationFrame){var Path=Two.Path;var RoundedRectangle=Two.RoundedRectangle=function(ox,oy,width,height,radius){var w2=width/2;var h2=height/2;var x,y;if(!_.isNumber(radius)){radius=Math.floor(Math.min(width,height)/12);}var points=[new Two.Anchor(-w2+radius,-h2),new Two.Anchor(w2-radius,-h2)];x=w2;y=-h2;points=roundCorner(points,x,y,radius,1);points.push(new Two.Anchor(w2,h2-radius));x=w2;y=h2;points=roundCorner(points,x,y,radius,4);points.push(new Two.Anchor(-w2+radius,h2));x=-w2;y=h2;points=roundCorner(points,x,y,radius,3);points.push(new Two.Anchor(-w2,-h2+radius));x=-w2;y=-h2;points=roundCorner(points,x,y,radius,2);points.pop();Path.call(this,points,true);this.translation.set(ox,oy);};_.extend(RoundedRectangle.prototype,Path.prototype);Path.MakeObservable(RoundedRectangle.prototype);function roundCorner(points,x,y,radius,quadrant){var start=0,end=0;var length=Two.Resolution;var a=points[points.length-1];var b=new Two.Anchor(x,y);var xr=x<0?-radius:radius;var yr=y<0?-radius:radius;switch(quadrant){case 1:start=-Math.PI/2;end=0;break;case 2:start=-Math.PI;end=-Math.PI/2;break;case 3:start=-Math.PI*1.5;end=-Math.PI;break;case 4:start=0;end=Math.PI/2;break;}var curve=_.map(_.range(length),function(i){var theta=map(length-i,0,length,start,end);var tx=radius*Math.cos(theta)+x-xr;var ty=radius*Math.sin(theta)+y-yr;var anchor=new Two.Anchor(tx,ty);return anchor;}).reverse();return points.concat(curve);}function map(v,i1,i2,o1,o2){return o1+(o2-o1)*((v-i1)/(i2-i1));}})(this.Two,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('underscore'):this._,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('backbone'):this.Backbone,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('requestAnimationFrame'):this.requestAnimationFrame);(function(Two,_,Backbone,requestAnimationFrame){var getComputedMatrix=Two.Utils.getComputedMatrix;var canvas=document.createElement('canvas');var ctx=canvas.getContext('2d');Two.Text=function(message,x,y,styles){Two.Shape.call(this);this._renderer.type='text';this.value=message;if(_.isNumber(x)){this.translation.x=x;}if(_.isNumber(y)){this.translation.y=y;}if(!_.isObject(styles)){return this;}_.each(Two.Text.Properties,function(property){if(property in styles){this[property]=styles[property];}},this);};_.extend(Two.Text,{Properties:['value','family','size','leading','alignment','fill','stroke','linewidth','style','weight','decoration','baseline','opacity','visible'],MakeObservable:function(object){Two.Shape.MakeObservable(object);_.each(Two.Text.Properties,function(property){var secret='_'+property;var flag='_flag'+property.charAt(0).toUpperCase()+property.slice(1);Object.defineProperty(object,property,{get:function(){return this[secret];},set:function(v){this[secret]=v;this[flag]=true;}});});Object.defineProperty(object,'clip',{get:function(){return this._clip;},set:function(v){this._clip=v;this._flagClip=true;}});}});_.extend(Two.Text.prototype,Two.Shape.prototype,{ // Flags
// http://en.wikipedia.org/wiki/Flag
_flagValue:true,_flagFamily:true,_flagSize:true,_flagLeading:true,_flagAlignment:true,_flagBaseline:true,_flagStyle:true,_flagWeight:true,_flagDecoration:true,_flagFill:true,_flagStroke:true,_flagLinewidth:true,_flagOpacity:true,_flagVisible:true,_flagClip:false, // Underlying Properties
_value:'',_family:'sans-serif',_size:13,_leading:17,_alignment:'center',_baseline:'middle',_style:'normal',_weight:500,_decoration:'none',_fill:'#000',_stroke:'transparent',_linewidth:1,_opacity:1,_visible:true,_clip:false,clone:function(parent){var parent=parent||this.parent;var clone=new Two.Text(this.value);clone.translation.copy(this.translation);clone.rotation=this.rotation;clone.scale=this.scale;_.each(Two.Text.Properties,function(property){clone[property]=this[property];},this);parent.add(clone);return clone;},toObject:function(){var result={translation:this.translation.toObject(),rotation:this.rotation,scale:this.scale};_.each(Two.Text.Properties,function(property){result[property]=this[property];},this);return result;},noStroke:function(){this.stroke='transparent';return this;},noFill:function(){this.fill='transparent';return this;}, /**
     * A shim to not break `getBoundingClientRect` calls. TODO: Implement a
     * way to calculate proper bounding boxes of `Two.Text`.
     */getBoundingClientRect:function(shallow){var matrix,border,l,x,y,i,v;var left=Infinity,right=-Infinity,top=Infinity,bottom=-Infinity; // TODO: Update this to not __always__ update. Just when it needs to.
this._update(true);matrix=!!shallow?this._matrix:getComputedMatrix(this);v=matrix.multiply(0,0,1);return {top:v.x,left:v.y,right:v.x,bottom:v.y,width:0,height:0};},flagReset:function(){this._flagValue=this._flagFamily=this._flagSize=this._flagLeading=this._flagAlignment=this._flagFill=this._flagStroke=this._flagLinewidth=this._flagOpaicty=this._flagVisible=this._flagClip=this._flagDecoration=this._flagBaseline=false;Two.Shape.prototype.flagReset.call(this);return this;}});Two.Text.MakeObservable(Two.Text.prototype);})(Two,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('underscore'):_,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('backbone'):Backbone,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('requestAnimationFrame'):requestAnimationFrame);(function(Two,_,Backbone,requestAnimationFrame){var Stop=Two.Stop=function(offset,color,opacity){this._renderer={};this.offset=_.isNumber(offset)?offset:Stop.Index<=0?0:1;this.opacity=_.isNumber(opacity)?opacity:1;this.color=_.isString(color)?color:Stop.Index<=0?'#fff':'#000';Stop.Index=(Stop.Index+1)%2;};_.extend(Stop,{Index:0,Properties:['offset','opacity','color'],MakeObservable:function(object){_.each(Stop.Properties,function(property){var secret='_'+property;var flag='_flag'+property.charAt(0).toUpperCase()+property.slice(1);Object.defineProperty(object,property,{get:function(){return this[secret];},set:function(v){this[secret]=v;this[flag]=true;this.trigger(Two.Events.change); // Unique to Gradient.Stop
}});});}});_.extend(Stop.prototype,Backbone.Events,{clone:function(){var clone=new Stop();_.each(Stop.Properties,function(property){clone[property]=this[property];},this);return clone;},toObject:function(){var result={};_.each(Stop.Properties,function(k){result[k]=this[k];},this);return result;},flagReset:function(){this._flagOffset=this._flagColor=this._flagOpacity=false;return this;}});Stop.MakeObservable(Stop.prototype);var Gradient=Two.Gradient=function(stops){Two.Shape.call(this);this._renderer.type='gradient';this.spread='pad';this.stops=stops;};_.extend(Gradient,{Stop:Stop,Properties:['spread'],MakeObservable:function(object){Two.Shape.MakeObservable(object);_.each(Gradient.Properties,Two.Utils.defineProperty,object);Object.defineProperty(object,'stops',{get:function(){return this._stops;},set:function(stops){var updateStops=_.bind(Gradient.FlagStops,this);var bindStops=_.bind(function(items){ // This function is called a lot
// when importing a large SVG
var i=items.length;while(i--){items[i].bind(Two.Events.change,updateStops);}updateStops();},this);var unbindStops=_.bind(function(items){_.each(items,function(v){v.unbind(Two.Events.change,updateStops);},this);updateStops();},this); // Remove previous listeners
if(this._stops){this._stops.unbind();} // Create new Collection with copy of Stops
this._stops=new Two.Utils.Collection((stops||[]).slice(0)); // Listen for Collection changes and bind / unbind
this._stops.bind(Two.Events.insert,bindStops);this._stops.bind(Two.Events.remove,unbindStops); // Bind Initial Stops
bindStops(this._stops);}});},FlagStops:function(){this._flagStops=true;}});_.extend(Gradient.prototype,Two.Shape.prototype,{clone:function(parent){parent=parent||this.parent;var stops=_.map(this.stops,function(s){return s.clone();});var clone=new Gradient(stops);_.each(Two.Gradient.Properties,function(k){clone[k]=this[k];},this);clone.translation.copy(this.translation);clone.rotation=this.rotation;clone.scale=this.scale;parent.add(clone);return clone;},toObject:function(){var result={stops:_.map(this.stops,function(s){return s.toObject();})};_.each(Gradient.Properties,function(k){result[k]=this[k];},this);return result;},flagReset:function(){this._flagSpread=this._flagStops=false;Two.Shape.prototype.flagReset.call(this);return this;}});Gradient.MakeObservable(Gradient.prototype);})(this.Two,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('underscore'):this._,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('backbone'):this.Backbone,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('requestAnimationFrame'):this.requestAnimationFrame);(function(Two,_,Backbone,requestAnimationFrame){var LinearGradient=Two.LinearGradient=function(x1,y1,x2,y2,stops){Two.Gradient.call(this,stops);this._renderer.type='linear-gradient';var flagEndPoints=_.bind(LinearGradient.FlagEndPoints,this);this.left=new Two.Vector().bind(Two.Events.change,flagEndPoints);this.right=new Two.Vector().bind(Two.Events.change,flagEndPoints);if(_.isNumber(x1)){this.left.x=x1;}if(_.isNumber(y1)){this.left.y=y1;}if(_.isNumber(x2)){this.right.x=x2;}if(_.isNumber(y2)){this.right.y=y2;}};_.extend(LinearGradient,{Stop:Two.Gradient.Stop,MakeObservable:function(object){Two.Gradient.MakeObservable(object);},FlagEndPoints:function(){this._flagEndPoints=true;}});_.extend(LinearGradient.prototype,Two.Gradient.prototype,{_flagEndPoints:false,clone:function(parent){parent=parent||this.parent;var stops=_.map(this.stops,function(stop){return stop.clone();});var clone=new LinearGradient(this.left._x,this.left._y,this.right._x,this.right._y,stops);_.each(Two.Gradient.Properties,function(k){clone[k]=this[k];},this);parent.add(clone);return clone;},toObject:function(){var result=Two.Gradient.prototype.toObject.call(this);result.left=this.left.toObject();result.right=this.right.toObject();return result;},flagReset:function(){this._flagEndPoints=false;Two.Gradient.prototype.flagReset.call(this);return this;}});LinearGradient.MakeObservable(LinearGradient.prototype);})(this.Two,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('underscore'):this._,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('backbone'):this.Backbone,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('requestAnimationFrame'):this.requestAnimationFrame);(function(Two,_,Backbone,requestAnimationFrame){var RadialGradient=Two.RadialGradient=function(cx,cy,r,stops,fx,fy){Two.Gradient.call(this,stops);this._renderer.type='radial-gradient';this.center=new Two.Vector().bind(Two.Events.change,_.bind(function(){this._flagCenter=true;},this));this.radius=_.isNumber(r)?r:20;this.focal=new Two.Vector().bind(Two.Events.change,_.bind(function(){this._flagFocal=true;},this));if(_.isNumber(cx)){this.center.x=cx;}if(_.isNumber(cy)){this.center.y=cy;}this.focal.copy(this.center);if(_.isNumber(fx)){this.focal.x=fx;}if(_.isNumber(fy)){this.focal.y=fy;}};_.extend(RadialGradient,{Stop:Two.Gradient.Stop,Properties:['radius'],MakeObservable:function(object){Two.Gradient.MakeObservable(object);_.each(RadialGradient.Properties,Two.Utils.defineProperty,object);}});_.extend(RadialGradient.prototype,Two.Gradient.prototype,{_flagEndPoints:false,clone:function(parent){parent=parent||this.parent;var stops=_.map(this.stops,function(stop){return stop.clone();});var clone=new RadialGradient(this.center._x,this.center._y,this._radius,stops,this.focal._x,this.focal._y);_.each(Two.Gradient.Properties.concat(RadialGradient.Properties),function(k){clone[k]=this[k];},this);parent.add(clone);return clone;},toObject:function(){var result=Two.Gradient.prototype.toObject.call(this);_.each(RadialGradient.Properties,function(k){result[k]=this[k];},this);result.center=this.center.toObject();result.focal=this.focal.toObject();return result;},flagReset:function(){this._flagRadius=this._flagCenter=this._flagFocal=false;Two.Gradient.prototype.flagReset.call(this);return this;}});RadialGradient.MakeObservable(RadialGradient.prototype);})(this.Two,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('underscore'):this._,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('backbone'):this.Backbone,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('requestAnimationFrame'):this.requestAnimationFrame);(function(Two,_,Backbone,requestAnimationFrame){ /**
   * Constants
   */var min=Math.min,max=Math.max; /**
   * A children collection which is accesible both by index and by object id
   * @constructor
   */var Children=function(){Two.Utils.Collection.apply(this,arguments);Object.defineProperty(this,'_events',{value:{},enumerable:false});this.ids={};this.on(Two.Events.insert,this.attach);this.on(Two.Events.remove,this.detach);Children.prototype.attach.apply(this,arguments);};Children.prototype=new Two.Utils.Collection();Children.constructor=Children;_.extend(Children.prototype,{attach:function(children){for(var i=0;i<children.length;i++){this.ids[children[i].id]=children[i];}return this;},detach:function(children){for(var i=0;i<children.length;i++){delete this.ids[children[i].id];}return this;}});var Group=Two.Group=function(){Two.Shape.call(this,true);this._renderer.type='group';this.additions=[];this.subtractions=[];this._children=[];this.children=arguments;};_.extend(Group,{Children:Children,InsertChildren:function(children){for(var i=0;i<children.length;i++){replaceParent.call(this,children[i],this);}},RemoveChildren:function(children){for(var i=0;i<children.length;i++){replaceParent.call(this,children[i]);}},OrderChildren:function(children){this._flagOrder=true;},MakeObservable:function(object){var properties=Two.Path.Properties.slice(0);var oi=_.indexOf(properties,'opacity');if(oi>=0){properties.splice(oi,1);Object.defineProperty(object,'opacity',{get:function(){return this._opacity;},set:function(v){ // Only set flag if there is an actual difference
this._flagOpacity=this._opacity!=v;this._opacity=v;}});}Two.Shape.MakeObservable(object);Group.MakeGetterSetters(object,properties);Object.defineProperty(object,'children',{get:function(){return this._collection;},set:function(children){var insertChildren=_.bind(Group.InsertChildren,this);var removeChildren=_.bind(Group.RemoveChildren,this);var orderChildren=_.bind(Group.OrderChildren,this);if(this._collection){this._collection.unbind();}this._collection=new Children(children);this._collection.bind(Two.Events.insert,insertChildren);this._collection.bind(Two.Events.remove,removeChildren);this._collection.bind(Two.Events.order,orderChildren);}});Object.defineProperty(object,'mask',{get:function(){return this._mask;},set:function(v){this._mask=v;this._flagMask=true;if(!v.clip){v.clip=true;}}});},MakeGetterSetters:function(group,properties){if(!_.isArray(properties)){properties=[properties];}_.each(properties,function(k){Group.MakeGetterSetter(group,k);});},MakeGetterSetter:function(group,k){var secret='_'+k;Object.defineProperty(group,k,{get:function(){return this[secret];},set:function(v){this[secret]=v;_.each(this.children,function(child){ // Trickle down styles
child[k]=v;});}});}});_.extend(Group.prototype,Two.Shape.prototype,{ // Flags
// http://en.wikipedia.org/wiki/Flag
_flagAdditions:false,_flagSubtractions:false,_flagOrder:false,_flagOpacity:true,_flagMask:false, // Underlying Properties
_fill:'#fff',_stroke:'#000',_linewidth:1.0,_opacity:1.0,_visible:true,_cap:'round',_join:'round',_miter:4,_closed:true,_curved:false,_automatic:true,_beginning:0,_ending:1.0,_mask:null, /**
     * TODO: Group has a gotcha in that it's at the moment required to be bound to
     * an instance of two in order to add elements correctly. This needs to
     * be rethought and fixed.
     */clone:function(parent){parent=parent||this.parent;var group=new Group();parent.add(group);var children=_.map(this.children,function(child){return child.clone(group);});group.translation.copy(this.translation);group.rotation=this.rotation;group.scale=this.scale;return group;}, /**
     * Export the data from the instance of Two.Group into a plain JavaScript
     * object. This also makes all children plain JavaScript objects. Great
     * for turning into JSON and storing in a database.
     */toObject:function(){var result={children:{},translation:this.translation.toObject(),rotation:this.rotation,scale:this.scale};_.each(this.children,function(child,i){result.children[i]=child.toObject();},this);return result;}, /**
     * Anchor all children to the upper left hand corner
     * of the group.
     */corner:function(){var rect=this.getBoundingClientRect(true),corner={x:rect.left,y:rect.top};this.children.forEach(function(child){child.translation.subSelf(corner);});return this;}, /**
     * Anchors all children around the center of the group,
     * effectively placing the shape around the unit circle.
     */center:function(){var rect=this.getBoundingClientRect(true);rect.centroid={x:rect.left+rect.width/2,y:rect.top+rect.height/2};this.children.forEach(function(child){child.translation.subSelf(rect.centroid);}); // this.translation.copy(rect.centroid);
return this;}, /**
     * Recursively search for id. Returns the first element found.
     * Returns null if none found.
     */getById:function(id){var search=function(node,id){if(node.id===id){return node;}else if(node.children){var i=node.children.length;while(i--){var found=search(node.children[i],id);if(found)return found;}}};return search(this,id)||null;}, /**
     * Recursively search for classes. Returns an array of matching elements.
     * Empty array if none found.
     */getByClassName:function(cl){var found=[];var search=function(node,cl){if(node.classList.indexOf(cl)!=-1){found.push(node);}else if(node.children){node.children.forEach(function(child){search(child,cl);});}return found;};return search(this,cl);}, /**
     * Recursively search for children of a specific type,
     * e.g. Two.Polygon. Pass a reference to this type as the param.
     * Returns an empty array if none found.
     */getByType:function(type){var found=[];var search=function(node,type){for(var id in node.children){if(node.children[id] instanceof type){found.push(node.children[id]);}else if(node.children[id] instanceof Two.Group){search(node.children[id],type);}}return found;};return search(this,type);}, /**
     * Add objects to the group.
     */add:function(objects){ // Allow to pass multiple objects either as array or as multiple arguments
// If it's an array also create copy of it in case we're getting passed
// a childrens array directly.
if(!(objects instanceof Array)){objects=_.toArray(arguments);}else {objects=objects.slice();} // Add the objects
for(var i=0;i<objects.length;i++){if(!(objects[i]&&objects[i].id))continue;this.children.push(objects[i]);}return this;}, /**
     * Remove objects from the group.
     */remove:function(objects){var l=arguments.length,grandparent=this.parent; // Allow to call remove without arguments
// This will detach the object from the scene.
if(l<=0&&grandparent){grandparent.remove(this);return this;} // Allow to pass multiple objects either as array or as multiple arguments
// If it's an array also create copy of it in case we're getting passed
// a childrens array directly.
if(!(objects instanceof Array)){objects=_.toArray(arguments);}else {objects=objects.slice();} // Remove the objects
for(var i=0;i<objects.length;i++){if(!objects[i]||!this.children.ids[objects[i].id])continue;this.children.splice(_.indexOf(this.children,objects[i]),1);}return this;}, /**
     * Return an object with top, left, right, bottom, width, and height
     * parameters of the group.
     */getBoundingClientRect:function(shallow){var rect; // TODO: Update this to not __always__ update. Just when it needs to.
this._update(true); // Variables need to be defined here, because of nested nature of groups.
var left=Infinity,right=-Infinity,top=Infinity,bottom=-Infinity;this.children.forEach(function(child){if(/(linear-gradient|radial-gradient|gradient)/.test(child._renderer.type)){return;}rect=child.getBoundingClientRect(shallow);if(!_.isNumber(rect.top)||!_.isNumber(rect.left)||!_.isNumber(rect.right)||!_.isNumber(rect.bottom)){return;}top=min(rect.top,top);left=min(rect.left,left);right=max(rect.right,right);bottom=max(rect.bottom,bottom);},this);return {top:top,left:left,right:right,bottom:bottom,width:right-left,height:bottom-top};}, /**
     * Trickle down of noFill
     */noFill:function(){this.children.forEach(function(child){child.noFill();});return this;}, /**
     * Trickle down of noStroke
     */noStroke:function(){this.children.forEach(function(child){child.noStroke();});return this;}, /**
     * Trickle down subdivide
     */subdivide:function(){var args=arguments;this.children.forEach(function(child){child.subdivide.apply(child,args);});return this;},flagReset:function(){if(this._flagAdditions){this.additions.length=0;this._flagAdditions=false;}if(this._flagSubtractions){this.subtractions.length=0;this._flagSubtractions=false;}this._flagOrder=this._flagMask=this._flagOpacity=false;Two.Shape.prototype.flagReset.call(this);return this;}});Group.MakeObservable(Group.prototype); /**
   * Helper function used to sync parent-child relationship within the
   * `Two.Group.children` object.
   *
   * Set the parent of the passed object to another object
   * and updates parent-child relationships
   * Calling with one arguments will simply remove the parenting
   */function replaceParent(child,newParent){var parent=child.parent;var index;if(parent&&parent.children.ids[child.id]){index=_.indexOf(parent.children,child);parent.children.splice(index,1); // If we're passing from one parent to another...
index=_.indexOf(parent.additions,child);if(index>=0){parent.additions.splice(index,1);}else {parent.subtractions.push(child);parent._flagSubtractions=true;}}if(newParent){child.parent=newParent;this.additions.push(child);this._flagAdditions=true;return;} // If we're passing from one parent to another...
index=_.indexOf(this.additions,child);if(index>=0){this.additions.splice(index,1);}else {this.subtractions.push(child);this._flagSubtractions=true;}delete child.parent;}})(this.Two,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('underscore'):this._,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('backbone'):this.Backbone,typeof require==='function'&&!(typeof define==='function'&&define.amd)?require('requestAnimationFrame'):this.requestAnimationFrame);
(function (url) {

  var result = {},
      hashLoc = url.indexOf('#');

  url.substring(url.indexOf('?')).replace(/([^?=&]+)(=([^&]+))?/g, function ($0, $1, $2, $3) {
    result[$1] = $3;
  });

  result['boolean'] = function (name, defaultValue) {
    if (!result.hasOwnProperty(name)) return defaultValue;
    return result[name] !== 'false';
  };

  result['float'] = function (name, defaultValue) {
    var r = parseFloat(result[name]);
    if (r != r) return defaultValue;
    return r;
  };

  result['int'] = function (name, defaultValue) {
    var r = parseInt(result[name], 10);
    if (r != r) return defaultValue;
    return r;
  };

  result['hash'] = hashLoc == -1 ? undefined : url.substring(hashLoc + 1);

  result['setUrl'] = arguments.callee;

  window['url'] = result;
})(location.href);
