<<<<<<< HEAD
var animationController={dict:{90:veil,87:ufo,69:suspension,65:highRise,83:circlePop,68:audienceShape,70:starExplode,88:strike,68:flash,86:dotted_spiral,81:centerCircle,circle:centerCircle},trigger:function(e,i){var o=soundController.dict[e];console.log("soundcont",soundController);var t=this.dict[e];o&&i?o.play():t&&(t.playing()&&t.clear(),t.start(void 0,void 0))}};two.bind("update",function(){TWEEN.update()}).play();
=======
var animationController={dict:{87:veil,69:ufo,79:dotted_spiral,80:clay,84:highRise,83:circlePop,70:horizontalLines,65:strike,82:squiggle,68:flash,circle:centerCircle},trigger:function(o,i){var l=soundController.dict[o];console.log("soundcont",soundController);var r=this.dict[o];if(l&&i&&l.play(),81===o){console.log("I'm in");var t=r("square",randomColor());t.start()}else r&&(r.playing()&&r.clear(),r.start(void 0,void 0))}};two.bind("update",function(){TWEEN.update()}).play();
>>>>>>> 2a3426983f60dc73e81842783f8816990b041d04
