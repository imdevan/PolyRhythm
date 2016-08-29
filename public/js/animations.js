function angleBetween(n,t){var e=t.x-n.x,i=t.y-t.y;return Math.atan2(i,e)}var audienceShapes=function(n,t){return function(){function e(){i.visible=!0,a=!1,h.stop(),p.stop()}var i,o=_.identity,a=!1;switch(n=n||"star"){case"sqaure":i=two.makeRectangle(center.x,center.y,50,50);break;case"circle":i=two.makeCircle(center.x,center.y,25);break;case"triangle":i=two.makePolygon(center.x,center.y,25,3);break;case"star":i=two.makeStar(center.x,center.y,25,40,5)}middleGround.add(i);var r=t;i.fill=convertHex(r,50),i.stroke=convertHex(r,100),i.linewidth=5,i.visible=!0,i.rotation=Math.PI*Math.random()*10,i.scale=1;var s=Math.PI*Math.random()*10;console.log("Angle ",s);var c=Math.cos(s),l=Math.sin(s);console.log(c,l),c*=width,l*=width,c+=center.x,l+=center.y;var u=function(n,t){a=!0,i.visible=!0,h.start(),_.isFunction(n)&&(o=n)};u.onComplete=e;var d={x:c,y:l},h=new TWEEN.Tween(i.translation).to(d,4*duration).easing(Easing.Exponential.Out).onComplete(function(){p.start(),two.remove(i)}),p=new TWEEN.Tween(i).to({scale:0},1*duration).easing(Easing.Exponential.In).onComplete(function(){u.onComplete(),o()});e();var f={start:u,clear:e,playing:function(){return a}};return f}()},centerCircle=function(){function n(){l.scale=a,u.scale=r,s.visible=!0,e=!1,d.stop(),h.stop()}var t=_.identity,e=!1,i=.5,o=.5,a=i+o,r=i,s=two.makeCircle(center.x,center.y,200,200);s.fill="#FFF",s.noStroke(),s.visible=!0,s.scale=i;var c=function(n,c){var l=acceleration/40*1.5;l>2&&(l=2),l<i&&(l=i),l>r?(a=l+o,r=l):l<r&&(a=a,r=l),e=!0,s.visible=!0,d.start(),_.isFunction(n)&&(t=n)};c.onComplete=n;var l={scale:a},u={scale:r},d=new TWEEN.Tween(s).to(l,.04*duration).easing(Easing.Exponential.Out).onComplete(function(){h.start()}),h=new TWEEN.Tween(s).to(u,.04*duration).easing(Easing.Exponential.In).onComplete(function(){c.onComplete(),t()});n();var p={start:c,clear:n,playing:function(){return e}};return p}(),ufo=function(){function n(){o.visible=!1;var n=Math.random()>.5,t=Math.random()>.5;n?o.translation.x=.75*width:o.translation.x=.25*width,t?o.origin=o.translation.y=-center.y:o.origin=o.translation.y=1.5*height,o.destination.y=center.y,o.scale=1,c.stop(),l.stop()}var t=!1,e=_.identity,i=.25*min_dimension,o=two.makeCircle(0,0,i);o.noStroke().fill="#6ECCFA";var a=function(n,i){t=!0,c.start(),o.visible=!0,!i&&u.sound&&u.sound.stop().play(),_.isFunction(n)&&(e=n)};a.onComplete=n;var r=function(){o.fill="#6ECCFA"},s=function(){i=.25*min_dimension};o.destination={y:center.y};var c=new TWEEN.Tween(o.translation).to(o.destination,duration/2).easing(Easing.Circular.Out).onComplete(function(){l.start()}),l=new TWEEN.Tween(o).to({scale:0},duration/2).easing(Easing.Circular.Out).onComplete(function(){t=!1,a.onComplete(),e()});n();var u={resize:s,update:r,clear:n,start:a,playing:function(){return t},hash:"1,2",filename:"ufo"};return u}(),dotted_spiral=function(){function n(){_.each(s,v),l.rotation=Math.random()*TWO_PI,l.scale=1,m.to({rotation:l.rotation+Math.PI/8,scale:2*Math.random()+10},2*duration).stop(),t=!1}var t=!1,e=_.identity,i=120,o=min_dimension/i,a=4,r=min_dimension/2,s=_.map(_.range(i),function(n){var t=n/i,e=r*t,s=t*Math.PI*a,c=e*Math.cos(s),l=e*Math.sin(s);t=(n+.25)/i,e=r*t,s=t*Math.PI*a;var u=e*Math.cos(s),d=e*Math.sin(s),h=two.makeLine(c,l,u,d);return h.stroke=currentPallette[rand(0,currentPallette.length)],h.linewidth=(1-Math.sqrt(1-t))*o,h.cap=h.join="round",h}),c=function(n,t){var e=t/i;n.linewidth=Math.sqrt(1-e)*o};s.reverse();var l=two.makeGroup(s);l.translation.set(center.x,center.y);var u=function(n,t){m.start(),!t&&w.sound&&w.sound.stop().play(),_.isFunction(n)&&(e=n)};u.onComplete=n;var d,h,p,f=function(){l.stroke=currentPallette[rand(0,currentPallette.length)]},g=function(){l.translation.set(center.x,center.y),o=min_dimension/i,_.each(s,c)},m=new TWEEN.Tween(l).onStart(function(){t=!0}).easing(Easing.Circular.In).to({rotation:Math.PI/8,scale:8},2*duration).onUpdate(function(n){for(h=Math.min(map(n,0,.25,0,1),1),p=Math.floor(h*i),d=0;d<p;d++)s[d].visible=!0}).onComplete(function(){u.onComplete(),e()}),v=function(n){n.visible=!1};n();var w={start:u,update:f,clear:n,resize:g,playing:function(){return t},hash:"0,9",filename:"dotted-spiral"};return w}(),clay=function(){function n(){s.visible=!1,impact=new Two.Vector(Math.random()*width,Math.random()*height);var n,t,c=8*Math.random();for(s.opacity=.5,c>7?(n=center.x,t=0):c>6?(n=0,t=0):c>5?(n=0,t=center.y):c>4?(n=0,t=height):c>3?(n=center.x,t=height):c>2?(n=width,t=height):c>1?(n=width,t=center.y):(n=width,t=0),s.translation.set(n,t),y.ending=0,o=height,u=0;u<i;u++)l=r[u],pct=u/i,m=pct*TWO_PI,l.set(o*Math.cos(m),o*Math.sin(m)),g=angleBetween(l,impact)-m,d=l.distanceTo(impact),f=10*o/Math.sqrt(d),n=f*Math.cos(g)+l.x,t=f*Math.sin(g)+l.y,a[u].set(n,t);e=!1,M.stop()}var t=_.identity,e=!1,i=8*Math.floor(Math.random())+8,o=(width*Math.random(),height*Math.random(),height),a=(Math.PI/2,[]),r=_.map(_.range(i),function(n){var t=n/i,e=TWO_PI*t,r=o*Math.sin(e),s=o*Math.cos(e);return a.push(new Two.Vector(r,s)),new Two.Anchor(r,s)}),s=two.makePath(r);s.fill=currentPallette[1],s.noStroke(),r=s.vertices;var c=function(n,e){s.visible=!0,M.start(),!e&&E.sound&&E.sound.stop().play(),_.isFunction(n)&&(t=n)};c.onComplete=n;var l,u,d,h,p,f,g,m,v=function(){s.fill=currentPallette[1]},w=function(){},y={ending:0},M=new TWEEN.Tween(y).to({ending:1},.75*duration).easing(Easing.Circular.In).onStart(function(){e=!0}).onUpdate(function(){var n=y.ending;for(u=0;u<i;u++)l=r[u],d=a[u],h=lerp(l.x,d.x,n),p=lerp(l.y,d.y,n),l.set(h,p)}).onComplete(function(){c.onComplete(),t()});n();var E={start:c,update:v,clear:n,resize:w,playing:function(){return e},hash:"0,1",filename:"clay"};return E}(),strike=function(){function n(){for(t=!1,c=Math.random(),r.stroke=currentPallette[rand(0,currentPallette.length)],r.linewidth=Math.round(7*c)+3,o=Math.round(map(c,0,1,.5*height,width)),l=Math.random()*TWO_PI,w.x=o*Math.cos(l),w.y=o*Math.sin(l),l+=Math.PI,y.x=o*Math.cos(l),y.y=o*Math.sin(l),r.ending=r.beginning=0,r.visible=!1,d=0;d<i;d++)h=a[d],u=d/(i-1),h.x=lerp(w.x,y.x,u),h.y=lerp(w.y,y.y,u);g.stop(),m.stop()}var t=!1,e=_.identity,i=32,o=.5*min_dimension,a=_.map(_.range(i),function(n){return new Two.Anchor}),r=two.makePath(a,!0);r.stroke=currentPallette[rand(0,currentPallette.length)],r.translation.set(center.x,center.y),r.cap="round";var s=function(n,i){r.visible=!0,t=!0,g.start(),!i&&v.sound&&v.sound.stop().play(),_.isFunction(n)&&(e=n)};s.onComplete=n;var c,l,u,d,h,p=function(){r.translation.set(center.x,center.y)},f=function(){r.stroke=currentPallette[2]},g=new TWEEN.Tween(r).to({ending:1},.25*duration).easing(Easing.Circular.In).onComplete(function(){console.log("End of in"),m.start()}),m=new TWEEN.Tween(r).to({beginning:1},.25*duration).easing(Easing.Circular.Out).onComplete(function(){console.log("End of out"),s.onComplete(),e()}),v={start:s,update:f,clear:n,resize:p,playing:function(){return t},hash:"1,5",filename:"strike"},w={x:0,y:0},y={x:0,y:0};return n(),v}(),squiggle=function(){function n(){for(l.visible=!1,a=Math.round(6*Math.random())+1,s=Math.PI/2,l.rotation=Math.random()>.5?Math.PI:0,l.ending=l.beginning=0,d=0;d<i;d++)h=c[d],p=d/i,f=TWO_PI*a*p+s,g=map(p,0,1,-o/2,o/2),m=r*Math.sin(f),h.set(g,m);t=!1,y.stop(),M.stop()}var t=!1,e=_.identity,i=200,o=center.x,a=6,r=.33*height,s=.5*Math.PI,c=_.map(_.range(i),function(n){var t=n/i,e=TWO_PI*a*t+s,c=map(t,0,1,-o/2,o/2),l=r*Math.sin(e);return new Two.Anchor(c,l)}),l=two.makePath(c,!0);l.translation.set(center.x,center.y),l.stroke=currentPallette[1],l.linewidth=min_dimension/40,l.cap=l.join="round",l.noFill();var u=function(n,i){l.visible=!0,t=!0,y.start(),!i&&E.sound&&E.sound.stop().play(),_.isFunction(n)&&(e=n)};u.onComplete=n;var d,h,p,f,g,m,v=function(){l.stroke=currentPallette[1]},w=function(){o=center.x,r=.33*height,l.linewidth=min_dimension/40,l.translation.set(center.x,center.y)},y=new TWEEN.Tween(l).to({ending:1},duration/2).easing(Easing.Sinusoidal.Out).onComplete(function(){M.start()}),M=new TWEEN.Tween(l).to({beginning:1},duration/2).easing(Easing.Sinusoidal.In).onComplete(function(){u.onComplete(),e()});n();var E={start:u,update:v,clear:n,resize:w,playing:function(){return t},hash:"0,7",filename:"squiggle"};return E}(),pistons=function(){function n(){d.beginning=d.ending=0;var n=Math.random()>.5;for(n?(t=-s/2,e=s/2):(t=s/2,e=-s/2),i=0;i<r;i++)f=u[i],u.visible=!1,g=f.vertices,g[0].x=g[1].x=g[2].x=g[3].x=t;o=!1,w.stop(),y.stop()}var t,e,i=1,o=!1,a=_.identity,r=4*i+1,s=.75*width,c=center.y,l=two.makeGroup();l.translation.copy(center);var u=_.map(_.range(r),function(n){var t=c/r-c/(3*r),e=0,i=-c/2+(n+1)*(c/(r+1)),o=two.makeRectangle(e,i,s,t);return o.fill="#C695FA",o.noStroke(),l.add(o),o}),d={ending:0,beginning:0},h=function(n){n.visible=!0},p=function(n,t){_.each(u,h),w.start(),!t&&M.sound&&M.sound.stop().play(),_.isFunction(n)&&(a=n)};p.onComplete=n;var f,g,m=function(){for(i=0;i<r;i++)u[i].fill=currentPallette[0]},v=function(){s=.75*width,c=center.y,l.translation.copy(center)},w=new TWEEN.Tween(d).to({ending:1},.125*duration).easing(Easing.Sinusoidal.Out).onStart(function(){o=!0}).onUpdate(function(){for(i=0;i<r;i++)f=u[i],g=f.vertices,g[3].x=g[0].x=e*d.ending}).onComplete(function(){y.start()}),y=new TWEEN.Tween(d).to({beginning:1},.125*duration).easing(Easing.Sinusoidal.Out).onUpdate(function(){for(i=0;i<r;i++)f=u[i],g=f.vertices,g[1].x=g[2].x=e*d.beginning}).onComplete(function(){p.onComplete(),a()}),M={start:p,update:m,clear:n,resize:v,playing:function(){return o}};return n(),M}(),pistons=function(){function n(){d.beginning=d.ending=0;var n=Math.random()>.5;for(n?(t=-s/2,e=s/2):(t=s/2,e=-s/2),i=0;i<r;i++)f=u[i],u.visible=!1,g=f.vertices,g[0].x=g[1].x=g[2].x=g[3].x=t;o=!1,w.stop(),y.stop()}var t,e,i=1,o=!1,a=_.identity,r=4*i+1,s=.75*width,c=center.y,l=two.makeGroup();l.translation.copy(center);var u=_.map(_.range(r),function(n){var t=c/r-c/(3*r),e=0,i=-c/2+(n+1)*(c/(r+1)),o=two.makeRectangle(e,i,s,t);return o.fill="#C695FA",o.noStroke(),l.add(o),o}),d={ending:0,beginning:0},h=function(n){n.visible=!0},p=function(n,t){_.each(u,h),w.start(),!t&&M.sound&&M.sound.stop().play(),_.isFunction(n)&&(a=n)};p.onComplete=n;var f,g,m=function(){for(i=0;i<r;i++)u[i].fill=currentPallette[rand(0,currentPallette.length)]},v=function(){s=.75*width,c=center.y,l.translation.copy(center)},w=new TWEEN.Tween(d).to({ending:1},.125*duration).easing(Easing.Sinusoidal.Out).onStart(function(){o=!0}).onUpdate(function(){for(i=0;i<r;i++)f=u[i],g=f.vertices,g[3].x=g[0].x=e*d.ending}).onComplete(function(){y.start()}),y=new TWEEN.Tween(d).to({beginning:1},.125*duration).easing(Easing.Sinusoidal.Out).onUpdate(function(){for(i=0;i<r;i++)f=u[i],g=f.vertices,g[1].x=g[2].x=e*d.beginning}).onComplete(function(){p.onComplete(),a()}),M={start:p,update:m,clear:n,resize:v,playing:function(){return o}};return n(),M}();