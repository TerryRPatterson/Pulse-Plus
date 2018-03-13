var issues_panel = document.querySelector(".issues_icon");
var pulls_panel = document.querySelector(".pulls_icon");
var feed_panel = document.querySelector(".feed_icon");

var issues = document.querySelector(".issues").classList;
var pulls = document.querySelector(".pulls").classList;
var feed = document.querySelector(".feed").classList;
var messaging = document.querySelector(".messaging").classList;

issues_panel.addEventListener("click", () => {
    issues.remove("hidden");
    pulls.add("hidden");
    feed.add("hidden");
    messaging.add("hidden");
});

pulls_panel.addEventListener("click", () => {
    pulls.remove("hidden");
    issues.add("hidden");
    feed.add("hidden");
    messaging.add("hidden");
});

feed_panel.addEventListener("click", () => {
    messaging.remove("hidden");
    feed.remove("hidden");
    issues.add("hidden");
    pulls.add("hidden");
});


var closeModal = document.querySelector(".close_modal");
var lightbox = document.querySelector('.lightbox').classList;

var modalToggle = () => {
    console.log("click");
    lightbox.toggle('modalhide');
};

closeModal.addEventListener('click', modalToggle);


window.onload = function () {
    var objDiv = document.getElementById("feedContainer");
    objDiv.scrollTop = objDiv.scrollHeight;
}

var openModal = document.querySelector(".open_modal");

openModal.addEventListener('click', modalToggle);