/* main.js */
/* eslint no-console:0 */
/* github functionality */
var URL = "https://api.github.com/repos/TerryRPatterson/didactic-bassoon";

/**
 * Function creates a Date object from an Unix time stamp.
 * @param {int} timestamp - An Unix time stamp.
 * @return {string} The current time.
 */
var convertUnixTime = function(timestamp) {
    return new Date(timestamp * 1000);
};

/**
 * Retrieves and displays information about rate limits for requests of the
 * GitHub api.
 */
var getRateLimit = function() {
    var urlRequest = "https://api.github.com/rate_limit";
    fetch(urlRequest)
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            console.log(json);
            console.log("Api request limits...");
            console.log("limit: " + json["rate"]["limit"]);
            console.log("remaining: " + json["rate"]["remaining"]);
            console.log("Resets at...");
            console.log(convertUnixTime(json["rate"]["reset"]));
        });
};

getRateLimit();

/**
 * Function retrieves and displays information about contributors on this
 * repository.
 */
var listContributors = function() {
    var urlRequest = URL + "/stats/contributors";
    // fetch returns array of json objects
    fetch(urlRequest)
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            console.log(json);
            for (var i = 0; i < json.length; i++) {
                console.log(json[i]["author"]["login"]
                            + " total contributions: "
                            + json[i]["total"]);
            }
        });
};

listContributors();


/**
 * Function retrieves and displays information on issues in this
 * repository.
 */
var listIssues = function() {
    var urlRequest = URL + "/issues";
    // fetch returns array of json objects
    fetch(urlRequest)
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            console.log(json);
            console.log("--------------------Issues---------------------");
            for (var i = 0; i < json.length; i++) {
                console.log("#" + i + "----------------------");
                console.log("Issue #" + json[i]["number"]);
                console.log("State " + json[i]["state"]);
                console.log("Title: " + json[i]["title"]);
                console.log("Body: " + json[i]["body"]);
            }
        });
};

listIssues();

/**
 * Function retrieves and displays information about commits made to this
 * repository.
 */
var listCommits = function() {
    var urlRequest = URL + "/commits";
    // fetch returns array of json objects
    fetch(urlRequest)
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            console.log(json);
            console.log("---------------------Commits-------------------");
            for (var i = 0; i < json.length; i++) {
                console.log("#" + i + "----------------------");
                console.log("Name:" + json[i]["commit"]["author"]["name"]);
                console.log("Date:" + json[i]["commit"]["author"]["date"]);
                console.log("Title: " + json[i]["commit"]["message"]);
            }
        });
};
listCommits();


/**
 * Function retrieves and displays information about pull requests in this
 * repository.
 */
var listPullRequests = function() {
    var urlRequest = URL + "/pulls";
    // fetch returns array of json objects
    fetch(urlRequest)
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            console.log(json);
            console.log("--------------------Pull Requests--------------");
            for (var i = 0; i < json.length; i++) {
                console.log("#" + i + "----------------------");
                console.log("Number:" + json[i]["number"]);
                console.log("State:" + json[i]["state"]);
                console.log("Title:" + json[i]["title"]);
                console.log("Body:" + json[i]["body"]);

                console.log("Open Issues:" + json[i]["open_issues"]);
                console.log("Closed Issues:" + json[i]["closed_issues"]);

                console.log("Created on:" + json[i]["created_at"]);
                console.log("Updated on:" + json[i]["updated_at"]);
                console.log("Closed on:" + json[i]["closed_at"]);
                console.log("Due on:" + json[i]["due_on"]);
            }
        });
};

listPullRequests();
