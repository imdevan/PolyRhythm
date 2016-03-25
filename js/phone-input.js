var socket = io();

var buttons = document.querySelector(".phone-container");
buttons.addEventListener("touchstart", buttonPress, false);
buttons.addEventListener("touchend", buttonPress, false);

function buttonPress(event) {
	if(event.target !== event.currentTarget) {
		var clickedItem = event.target;
		switch(event.type){
			case "touchstart":
				clickedItem.classList.add("active");
				var msg = {
					animations: [],
					audio: null
				};
				switch ( clickedItem.dataset.id) {
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
