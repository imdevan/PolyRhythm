var animationController={dict:{81:centerCircle,87:veil,69:ufo,82:dotted_spiral,84:clay,65:strike,83:squiggle,68:flash,70:pistons},init:function(){rectSpin.init(),$.each(this.dict,function(i,t){console.log(i),console.log(t)})},reset:function(){},trigger:function(i){var t=this.dict[i];81===i?t.start():t&&(t.playing()&&t.clear(),t.start(void 0,void 0))}};two.bind("update",function(){TWEEN.update()}).play(),animationController.init();