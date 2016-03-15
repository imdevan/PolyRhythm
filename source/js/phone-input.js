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
				socket.emit('midi_input', clickedItem.dataset.id);
				socket.emit('animation_output', clickedItem.dataset.id);
				break;
			case "touchend":
				clickedItem.classList.remove("active");
				break;
		}
	}
	event.stopPropagation();
}