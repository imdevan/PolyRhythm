var soundController={dict:{kick:kick,snare:snare,droplet:droplet,carSound:carSound,pikaHi:pikaHi,pikaLow:pikaLow,kirby:kirby,iphone:iphone},init:function(){$.each(this.dict,function(i,n){console.log(n),n.init()})},trigger:function(i){var n=this;_.each(i,function(i){sound=n.dict[i],sound&&sound.play()})}};soundController.init();