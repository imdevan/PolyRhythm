function capitalizeFirstLetter(t){return t.charAt(0).toUpperCase()+t.slice(1)}function setButtonHeightWidth(){var t=window.innerHeight,e=window.innerWidth,o=0,n=0;t>e?(n=.6*e,o=n):(n=.6*t,o=n),button.style.width=n+"px",button.style.height=o+"px",button.style.lineHeight=o+"px";var i=capitalizeFirstLetter(shape);button.innerHTML=i+"!"}function send(){var t=Math.sqrt(acc.acceleration.x*acc.acceleration.x+acc.acceleration.y*acc.acceleration.y+acc.acceleration.z*acc.acceleration.z);socket.emit("audience_acceleration",t)}function buttonPress(t){for(console.log("in here"),button.classList.add("active"),clearTimeout(mytimeout),mytimeout=setTimeout(removeActive,1e3);;)socket.emit("audience_shape",{shape:shape,color:color})}function removeActive(){button.classList.remove("active")}var socket=io();socket.emit("audience_init"),shapes=["sqaure","circle","triangle","star"],shape=shapes[Math.floor(Math.random()*shapes.length)],color=randomColor();var acc=null,button=document.getElementById("button");window.onload=setButtonHeightWidth,window.onresize=setButtonHeightWidth,setInterval(send,750),window.addEventListener("devicemotion",function(t){acc=t});var button=document.getElementById("button");button.style.backgroundColor=color;var mytimeout=null;button.addEventListener("touchstart",buttonPress,!1);