/* main.js */
/*global $*/
/* eslint no-console:0
no-unused-vars:0 */
/* github functionality */
const URL = "https://api.github.com/repos/TerryRPatterson/didactic-bassoon";
let githubData;

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

// getRateLimit();

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


// listContributors();


/**
 * Function retrieves and displays information on issues in this
 * repository.
 */
var listIssues = function() {
    var urlRequest = URL + "/issues";
    // fetch returns array of json objects
    return fetch(urlRequest)
        .then(function(response) {
            return response.json();
        });
};

// listIssues();

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

// listCommits();

/**
 * Function retrieves and displays information about pull requests in this
 * repository.
 */
var listPullRequests = function() {
    var urlRequest = URL + "/pulls";
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
                pullIssueObj[results[0][i]["number"]] = results[0][i];
            }
            for(var i = 0; i < results[1].length; i++) {
                pullIssueObj[results[1][i]["number"]] = results[1][i];
            }
        });
};

// listPullRequests();

let methods = {
    Test:"auth.test",/*Requires only auth token*/
    postMessage:"chat.postMessage",/*Requires target channel, authtoken, and as user*/
    ListMessages:"conversations.history",/*Requries target, auth token, accepts time*/
    ListChannels:"conversations.list",/*Requres auth token*/
};
let url = function url(method){
    let url = "https://slack.com/api/";
    return url+methods[method];
};
//takes method from method object, and an object contaning all options selected
let slack = function slack(method, options){
    //channel, asUser, text, time
    let payload = {};
    let recievedData;
    if (options["channel"]){
        payload["channel"] = options["channel"];
    }
    if (options["asUser"] ===  true){
        payload["as_user"] = true;
    }
    if (options["text"]){
        payload["text"] = options["text"];
    }
    if (Number.isInteger(options["time"])){
        payload["oldest"] = options["time"];
    }
    if (method === "ListChannels"){
        payload["types"] = "public_channel,private_channel";
    }
    payload["token"] = localStorage["token"];
    return $.ajax(url(method),{
        method:"POST",
        header:{
            "content-type":"application/x-www-form-urlencoded"
        },
        data:$.param(payload)
    });
};

/*Only pass latest changes of slack messages
Takes an array of Messages*/
let parseSlackData = function parseSlackData(slackData, githubData){
    let regExpression = /(?:\s|^)G#(\d+)(?:\s|$)/gm;
    slackData.forEach(function(message){
        let text = message["text"];
        let matchedItem = regExpression.exec(text);
        while (matchedItem !== null){
            console.log(githubData[matchedItem[1]]);
            if (githubData[matchedItem[1]] !== undefined){
                if (githubData[matchedItem[1]]["slackMessages"] !==
                undefined){
                    if (!githubData[matchedItem[1]]["slackMessages"]
                        .includes(text)){
                        githubData[matchedItem[1]]["slackMessages"].push(text);
                    }
                }
                else{
                    githubData[matchedItem[1]]["slackMessages"] = [];
                    githubData[matchedItem[1]]["slackMessages"].push(text);
                }
                matchedItem = regExpression.exec(text);
            }
        }
    });
    return githubData;
};
