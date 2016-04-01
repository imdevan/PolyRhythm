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