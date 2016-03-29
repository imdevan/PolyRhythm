
var clips = {
    midi: document.querySelectorAll('.clip-box[data-type="midi"] .clip-box'),
    phone: document.querySelectorAll('.clip-box[data-type="phone"] .clip-box'),
    keyboard: document.querySelectorAll('.clip-box[data-type="keyboard"] .clip-box')
};

var getChar = e => {
    console.log(String.fromCharCode(e.keyCode).toLowerCase());
    return String.fromCharCode(e.keyCode).toLowerCase();
};

var getClipBox = (e, type) => {
    return type === "keyboard" ? document.querySelector("[data-type='keyboard'][data-name='" + getChar(e) + "']") : document.querySelector("[data-type=" + type + "][data-name='" + e + "']");
};

window.addEventListener("keydown", (e, data) => {
    var clipBox = getClipBox(e, "keyboard");
    if (clipBox) clipBox.classList.add("active");
});

window.addEventListener("keyup", (e, data) => {
    var clipBox = getClipBox(e, "keyboard");
    if (clipBox) clipBox.classList.remove("active");
});