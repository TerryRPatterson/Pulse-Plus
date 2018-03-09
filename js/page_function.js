var issues_panel = document.querySelector(".issues_icon");
var pulls_panel = document.querySelector(".pulls_icon");
var feed_panel = document.querySelector(".feed_icon");

var issues = document.querySelector(".issues").classList;
var pulls = document.querySelector(".pulls").classList;
var feed = document.querySelector(".feed").classList;

issues_panel.addEventListener("click", () => {
    pulls.toggle("hidden");
    feed.toggle("hidden");
});

pulls_panel.addEventListener("click", () => {
    issues.toggle("hidden");
    feed.toggle("hidden");
});

feed_panel.addEventListener("click", () => {
    issues.toggle("hidden");
    pulls.toggle("hidden");
});