'use strict';

var infoPopUp = document.querySelector('.info--popup');
var infoWindow = document.querySelector('.info--window');
var idleTime = 0;

function showInfo() {
    idleTime = 0;
    infoPopUp.classList.add('show');
    infoWindow.classList.add('show');
}
function hideInfo() {
    infoPopUp.classList.remove('show');
    infoWindow.classList.remove('show');
}

window.addEventListener("mousemove", function (e) {
    showInfo();
});

window.addEventListener("keydown", function (e) {
    hideInfo();
});

function timerIncrement() {
    idleTime++;
    if (idleTime > 2) {
        hideInfo();
    }
}

(function () {
    setInterval(timerIncrement, 1000); // 1 second
})();