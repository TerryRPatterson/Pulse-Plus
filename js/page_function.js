var issues_panel = document.querySelector(".issues_icon");
var pulls_panel = document.querySelector(".pulls_icon");
var feed_panel = document.querySelector(".feed_icon");

var issues = document.querySelector(".issues").classList;
var pulls = document.querySelector(".pulls").classList;
var feed = document.querySelector(".feed").classList;

issues_panel.addEventListener("click", () => {
    issues.remove("hidden");
    pulls.add("hidden");
    feed.add("hidden");
});

pulls_panel.addEventListener("click", () => {
    pulls.remove("hidden");
    issues.add("hidden");
    feed.add("hidden");
});

feed_panel.addEventListener("click", () => {
    feed.remove("hidden");
    issues.add("hidden");
    pulls.add("hidden");
});