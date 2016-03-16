// Environment Set Up
var type = /(canvas|webgl)/.test(url.type) ? url.type : 'svg',
    two = new Two({
       type: Two.Types[type],
       fullscreen: true
    }).appendTo(document.querySelector('#two')),
    Easing = TWEEN.Easing;

// Animation Related Variables and helpers
var width = $(window).width(), height = $(window).height();
var center = { x: width / 2, y: height / 2 };
var min_dimension = width > height ? height : width;
var TWO_PI = Math.PI * 2;
var duration = 1000;
var shortDuration = duration * 0.3;
var mediumDuration = duration * 0.75;
var rand = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var colors = {
    // inspo: https://dribbble.com/shots/2590101-BeBright-App
    morning: ["#FFE481", "#FB8C8E", "#C695FA"],
    // inspo: varying
    afternoon: ["#A6F4FE", "#E9547D", "#DFD4B8"],
    // inspo: https://dribbble.com/shots/2590588-Login-Startup-Screen
    night: ["#DE1157", "#F2A600", "#1F285E"]
};

var currentPallette = colors.afternoon;

document.querySelector('body').style.backgroundImage = 'linear-gradient(45deg'
        + ', ' + currentPallette[0] + ', ' + currentPallette[1] + ', '
        + currentPallette[2] + ')';

var midCornerPositions = [
    {
        x: width - width/3,
        y: (height / 3)/2
    },
    {
        x: width - width/3,
        y: height - (height / 3)/2
    },
    {
        x: width/3,
        y: (height / 3)/2
    },
    {
        x: width/3,
        y: height - (height / 3)/2
    },
    {
        x: width - (width/3)/2,
        y: (height / 3)
    },
    {
        x: width - (width/3)/2,
        y: height - (height / 3)
    },
    {
        x: (width/3)/2,
        y: (height / 3)
    },
    {
        x: (width/3)/2,
        y: height - (height / 3)
    }
];


// ======================================
// BACK GROUND
// ======================================
var highRise = (function(){
    var callback = _.identity,
        colCount = 5,
        playing = false,
        shape = two.makeRectangle(0, 0, (width/colCount)*1.5, height);
        shape.fill = currentPallette[0];
        shape.noStroke();
        shape.visible = true;

    var start = function(onComplete, silent) {
        playing = true;
        shape.visible = true;
        animate_in.start();

        if (_.isFunction(onComplete)) {
            callback = onComplete;
        }
    };


    start.onComplete = reset;

    var animate_in = new TWEEN.Tween(shape.translation)
        .to({y: center.y}, shortDuration)
        .easing(Easing.Cubic.Out)
        .onComplete(function() {
            animate_out.start();
        });
        console.log(Easing);
    var animate_out = new TWEEN.Tween(shape.translation)
        .to({y: height+height/2}, shortDuration)
        .easing(Easing.Cubic.Out)
        .onComplete(function() {
        start.onComplete();
            callback();
        });

    reset();

    function reset() {
        var newPos = {x: width/(rand(0, colCount)+1), y: height + height/2};
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
        playing: function() { return playing; },
    };

    return exports;

})();
// ======================================
// MIDDLE GROUND
// ======================================

var centerCircle = (function() {
    var callback = _.identity,
        playing = false,
        shape = two.makeCircle(center.x, center.y, 200, 200);
        shape.fill = "#FFF";
        shape.noStroke();
        shape.visible = true;

    var start = function(onComplete, silent) {
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


// ======================================
// FORE GROUND
// ======================================
var circlePop = (function(){
    var callback = _.identity,
        playing = false,
        shape = two.makeCircle(center.x, center.y, 200, 200);
        shape.fill = "#FFF";
        shape.noStroke();
        shape.visible = true;

    var start = function(onComplete, silent) {
        playing = true;
        shape.visible = true;
        animate_in.start();

        if (_.isFunction(onComplete)) {
            callback = onComplete;
        }
    };


    start.onComplete = reset;

    var animate_in = new TWEEN.Tween(shape)
        .to({scale: 1}, shortDuration)
        .easing(Easing.Exponential.Out)
        .onComplete(function() {
            animate_out.start();
        });

    var animate_out = new TWEEN.Tween(shape)
        .to({scale: 0}, shortDuration)
        .easing(Easing.Exponential.Out)
        .onComplete(function() {
        start.onComplete();
            callback();
        });

    reset();

    function reset() {
        var newPos = midCornerPositions[rand(0,midCornerPositions.length)];
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
        playing: function() { return playing; },
    };

    return exports;

})();

  var glimmer = (function() {

    var playing = false;
    var callback = _.identity;
    var amount = 12, r1 = height * 20 / 900, r2 = height * 40 / 900;

    var longest = 0, index;

    var circles = _.map(_.range(amount), function(i) {
      var r = Math.round(map(Math.random(), 0, 1, r1, r2));
      var delay = Math.random() * duration * 0.5;
      var circle = two.makeCircle(0, 0, r);
      circle.key = colors.getRandomKey();
      circle.stroke = colors[circle.key];
      circle.noFill();
      circle.__linewidth = Math.random() * 20 + 40;
      circle.tween = new TWEEN.Tween(circle)
        .to({ scale: 1, linewidth: 0 }, duration * 0.2)
        .easing(Easing.Sinusoidal.Out)
        .delay(delay)
        .onComplete(function() {
          circle.visible = false;
        });

      if (longest < delay) {
        longest = delay;
        index = i;
      }

      return circle;

    });

    circles[index].tween
      .onComplete(function() {
        circles[index].visible = false;
        start.onComplete();
        callback();
      });


    var group = two.makeGroup(circles);
    group.translation.set(center.x, center.y);

    var i, c;
    var start = function(onComplete, silent) {
      playing = true;
      for (i = 0; i < amount; i++) {
        c = circles[i];
        c.visible = true;
        c.tween.start();
      }
      if (!silent && exports.sound) {
        exports.sound.stop().play();
      }
      if (_.isFunction(onComplete)) {
        callback = onComplete;
      }
    }

    start.onComplete = reset;

    var update = function() {
      for (i = 0; i < amount; i++) {
        circles[i].stroke = colors[circles[i].key];
      }
    };
    var resize = function() {
      group.translation.set(center.x, center.y);
    };

    var theta, x, y;
    function reset() {

      for (i = 0; i < amount; i++) {

        c = circles[i];

        theta = TWO_PI * Math.random();

        x = Math.random() * center.y * Math.cos(theta);
        y = Math.random() * center.y * Math.sin(theta);

        c.translation.set(x, y);
        c.visible = false;
        c.scale = 0;
        c.linewidth = c.__linewidth;

        c.tween.stop();

      }

      playing = false;

    }

    reset();

    var exports = {
      start: start,
      update: update,
      clear: reset,
      resize: resize,
      playing: function() { return playing; },
    };

    return exports;
  })();


// rain
