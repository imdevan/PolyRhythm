<<<<<<< HEAD
var animationController={dict:{87:veil,69:ufo,79:dotted_spiral,80:clay,84:highRise,83:circlePop,81:audienceShape,86:sqaureExplode,65:strike,82:squiggle,68:flash,70:pistons,circle:centerCircle},trigger:function(o,e){var i=soundController.dict[o];console.log("soundcont",soundController);var l=this.dict[o];if(i&&e&&i.play(),81===o){console.log("I'm in");var r=l("square",randomColor());r.start()}else l&&(l.playing()&&l.clear(),l.start(void 0,void 0))}};two.bind("update",function(){TWEEN.update()}).play();
=======
var animationController={dict:{87:veil,69:ufo,79:dotted_spiral,80:clay,84:highRise,83:circlePop,81:audienceShape,86:sqaureExplode,65:strike,82:squiggle,68:flash,70:pistons,circle:centerCircle},trigger:function(i){var e=this.dict[i];if(81===i){console.log("I'm in");var a=e("square",randomColor());a.start()}else e&&(e.playing()&&e.clear(),e.start(void 0,void 0))}};two.bind("update",function(){TWEEN.update()}).play();
>>>>>>> 344526929059807cc2273d54472b85eadf6038ef
