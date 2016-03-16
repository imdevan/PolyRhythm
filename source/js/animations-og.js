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

function convertHex(hex,opacity){
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0,2), 16);
    g = parseInt(hex.substring(2,4), 16);
    b = parseInt(hex.substring(4,6), 16);

    result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
    return result;
}

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
var backGround = two.makeGroup();

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

var sqaureExplode = (function() {
    var callback = _.identity;
    var playing = false;

    var shape = two.makeStar(center.x, center.y, 200, 400, 5);
    var randColor = randomColor({luminosity: 'light'});
    shape.fill = convertHex(randColor, 100);
    shape.stroke = convertHex(randColor, 100);
    shape.linewidth = 10;
    shape.visible = true;
    shape.scale = 0;

    var start = function(onComplete, silent) {
      var randColor = randomColor({luminosity: 'light'});
      shape.fill = convertHex(randColor, 100);
      shape.stroke = convertHex(randColor, 100);
      playing = true;
      shape.visible = true;
      animate_in.start();
      if (_.isFunction(onComplete)) {
          callback = onComplete;
      }
    }
    start.onComplete = reset;

    var animate_in = new TWEEN.Tween(shape)
      .to({scale: 1}, duration * .2)
      .easing(Easing.Exponential.Out)
      .onComplete(function() {
        animate_out.start();
      });
    var animate_out = new TWEEN.Tween(shape)
      .to({scale: 0}, duration * .2)
      .easing(Easing.Exponential.In)
      .onComplete(function() {
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
      playing: function() { return playing; },
    };
    return exports;
})();

// ======================================
// MIDDLE GROUND
// ======================================
var middleGround = two.makeGroup();

// ======================================
// FORE GROUND
// ======================================
var foreGround = two.makeGroup();

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

var strike = (function() {

    var playing = false;
    var callback = _.identity;

    var amount = 32;
    var distance = min_dimension * 0.5;

    var points = _.map(_.range(amount), function(i) {
        return new Two.Anchor();
    });
    var line = two.makePolygon(points, true);
        line.noFill().stroke = currentPallette[2]
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
        line.stroke = currentPallette[2];
    };

    var animate_in = new TWEEN.Tween(line)
        .to({
            ending: 1.0
        }, duration * 0.25)
        .easing(Easing.Circular.In)
        .onComplete(function() {
            console.log("End of in");
            animate_out.start();
        });

    var animate_out = new TWEEN.Tween(line)
        .to({
            beginning: 1.0
        }, duration * 0.25)
        .easing(Easing.Circular.Out)
        .onComplete(function() {
          console.log("End of out");
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