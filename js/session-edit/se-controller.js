require("./se-midi-input");

var clips = {
    midi: document.querySelectorAll('.clip-box[data-type="midi"] .clip-box'),
    phone: document.querySelectorAll('.clip-box[data-type="phone"] .clip-box'),
    keyboard: document.querySelectorAll('.clip-box[data-type="keyboard"] .clip-box')
};

var getChar = function(e) {
    console.log(String.fromCharCode(e.keyCode).toLowerCase());
    return String.fromCharCode(e.keyCode).toLowerCase()
}

var getClipBox = function (e, type) {
    return type === "keyboard" ? document.querySelector("[data-type='keyboard'][data-name='"+getChar(e)+"']"):
        document.querySelector("[data-type="+ type +"][data-name='"+e+"']")
}

window.addEventListener("keydown", function (e, data){
    var clipBox = getClipBox(e, "keyboard");
    if(clipBox)
        clipBox.classList.add("active");
});

window.addEventListener("keyup", function (e, data){
    var clipBox = getClipBox(e, "keyboard");
    if(clipBox)
        clipBox.classList.remove("active");
});
