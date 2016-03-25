var info = document.getElementById('info');
var idleTime = 0;

function showInfo() {
    info.classList.add('show');
}
function hideInfo() {
    idleTime = 0;
    info.classList.remove('show');
}
window.addEventListener("mousemove", function(e){
    idleTime = 0;
    showInfo();
});

window.addEventListener("keypress", function(e){
    idleTime = 0;
});

function timerIncrement() {
    console.log(idleTime);
    idleTime++;
    if (idleTime > 5) { // 20 minutes
        hideInfo()
    }
}

(function(){
    setInterval(timerIncrement, 1000); // 1 second
})();
