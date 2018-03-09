/* main.js */
/* eslint no-console:0 */
/* github functionality testing */
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

//listContributors();


/**
 * Function retrieves and displays information on issues in this
 * repository.
 */
var listIssues = function(time) {
    var urlRequest = URL + "/issues";
    if (time != undefined) {
        let datestring = convertUnixTime(time);
        urlRequest += "?since=" + datestring;
    }
    // fetch returns array of json objects
    return fetch(urlRequest)
        .then(function(response) {
            return response.json();
        });
};

//listIssues();

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
//listCommits();


/**
 * Function retrieves and displays information about pull requests in this
 * repository.
 */
var listPullRequests = function(time) {
    var urlRequest = URL + "/pulls";
    if (time != undefined) {
        let datestring = convertUnixTime(time);
        urlRequest += "?since=" + datestring;
    }
    // fetch returns array of json objects
    return fetch(urlRequest)
        .then(function(response) {
            return response.json();
        });
};

/**
 * Function creates one big object containing all issues and pull requests.
 * form {
 *       number: {issue or pull request object}
 *      }
 */
var generatePullIssueObj = function() {
    var pullIssueObj = {};
    Promise.all([listPullRequests(), listIssues()])
        .then(function(results) {
            for(var i = 0; i < results[0].length; i++) {
                //this should create timestamp property from creation date
                results[0][i]['ts'] = results[0][i]['updated_at'] / 1000;
                pullIssueObj[results[0][i]['number']] = results[0][i];
            }
            for(var i = 0; i < results[1].length; i++) {
                //this should create timestamp property from creation date
                results[1][i]['ts'] = results[1][i]['updated_at'] / 1000;
                pullIssueObj[results[1][i]['number']] = results[1][i];
            }
        });
};


listPullRequests();

let methods = {
    Test:"auth.test",/*Requires only auth token*/
    ListChannels:"channels.list",/*Requires only auth token*/
    postMessage:"chat.postMessage",/*Requires target channel, authtoken, and as user*/
    ListMessages:"conversations.list",/*Requries only authToken*/
    ListPrivate:"groups.list"

};
let url = function url(method){
    let url = "https://slack.com/api/";
    return url+methods[method];
};
let slack = function slack(method, channel, asUser, text){
    let payload = {};
    if (channel){
        payload["channel"] = channel;
    }
    if (asUser ===  true){
        payload["as_user"] = true;
    }
    if (text){
        payload["text"] = text;
    }
    payload["token"] = localStorage["token"];
    $.ajax(url(method),{
        method:"POST",
        header:{
            "content-type":"application/x-www-form-urlencoded"
        },
        data:$.param(payload)
    });
};
slack("Test");
