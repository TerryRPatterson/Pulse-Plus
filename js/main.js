/* main.js */
/*global $*/
/* eslint no-console:0
no-unused-vars:0 */
/* github functionality */
const URL = "https://api.github.com/repos/TerryRPatterson/didactic-bassoon";
const GITHUB_TOKEN = localStorage.getItem("GitToken");

let githubData = {};
let watchedChannels = ["C9K0QKN3T","G9M6ERE94"];
/**
 * Function creates a Date object from an Unix time stamp. In order to
 * present human readable form of time.
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
    fetch(urlRequest, {
        headers: {
            authorization: "token " + GITHUB_TOKEN
        }
    })
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
    fetch(urlRequest, {
        headers: {
            authorization: "token " + GITHUB_TOKEN
        }
    })
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
var listIssues = function(time) {
    var urlRequest = URL + "/issues";
    if (time !== undefined) {
        let datestring = convertUnixTime(time);
        urlRequest += "?since=" + datestring;
    }
    // fetch returns array of json objects
    return fetch(urlRequest, {
        headers: {
            authorization: "token " + GITHUB_TOKEN
        }
    })
        .then(function(response) {
            return response.json();
        });
};
/*
var listIssues = function() {
    var urlRequest = URL + "/issues";
    // fetch returns array of json objects
    return fetch(urlRequest)
        .then(function(response) {
            return response.json();
        });
};
*/

// listIssues();

/**
 * Function retrieves and displays information about commits made to this
 * repository.
 */
var listCommits = function() {
    var urlRequest = URL + "/commits";
    // fetch returns array of json objects
    fetch(urlRequest, {
        headers: {
            authorization: "token " + GITHUB_TOKEN
        }
    })
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
var listPullRequests = function(time) {
    var urlRequest = URL + "/pulls";
    if (time != undefined) {
        let datestring = convertUnixTime(time);
        urlRequest += "?since=" + datestring;
    }
    // fetch returns array of json objects
    return fetch(urlRequest, {
        headers: {
            authorization: "token " + GITHUB_TOKEN
        }
    })
        .then(function(response) {
            return response.json();
        });
};

/**
 * Function creates one big object containing all issues and pull requests.
 * form {
 *       number: {issue or pull request object}
 *       ts : timestamp
 *       type: pull or issue
 *      }
 */
var generatePullIssueObj = function(pullIssueObj={}){
    let lastCheck = "";
    let time;
    if (Object.keys(pullIssueObj).length !== 0){
        Object.values(pullIssueObj).forEach(function(entry){
            if (entry["updated_at"] > lastCheck){
                lastCheck = entry["updated_at"];
            }
        });
    }
    if (lastCheck){
        time = lastCheck;
    }
    return Promise.all([listPullRequests(time), listIssues(time)])
        .then(function(results) {
            for(let i = 0; i < results[0].length; i++) {
            //this should create timestamp property from updated date
                pullIssueObj[results[0]["number"]] = results[0][i];
                pullIssueObj[results[0]["number"]]["type"] = "pull";
                pullIssueObj[results[0]["number"]]["ts"] = Date.parse(results[0][i]["updated_at"]) / 1000;
            }
            for(let i = 0; i < results[1].length; i++) {
            //this should create timestamp property from update date
                pullIssueObj[results[1][i]["number"]] = results[1][i];
                pullIssueObj[results[1][i]["number"]]["type"] = "issue";
                pullIssueObj[results[1][i]["number"]]["ts"] = Date.parse(results[1][i]["updated_at"]) / 1000;
            }
        }).then(function(){
            return pullIssueObj;
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
let slack = function slack(method, options={},promiseCallback=function(data){return data;}){
    //channel, asUser, text, oldest
    let payload = {};
    if (options["channel"]){
        payload["channel"] = options["channel"];
    }
    if (options["asUser"] ===  true){
        payload["as_user"] = true;
    }
    if (options["text"]){
        payload["text"] = options["text"];
    }
    if (Number.isInteger(parseInt(options["time"]))){
        console.log(parseFloat(options["time"]));
        payload["oldest"] = parseFloat(options["time"]);
    }
    if (method === "ListChannels"){
        payload["types"] = "public_channel,private_channel";
    }
    payload["token"] = localStorage["token"];
    let recivedData = $.ajax(url(method),{
        method:"POST",
        header:{
            "content-type":"application/x-www-form-urlencoded"
        },
        data:$.param(payload)
    });
    recivedData.then(function(data){
        promiseCallback(data);
    });
    return recivedData;
};

/*Only pass latest changes of slack messages
Takes an array of Messages*/
let parseSlackData = function parseSlackData(slackData, githubData){
    let regExpression = /(?:\s|^)G#(\d+)(?:\s|$)/gm;
    slackData.forEach(function(message){
        let text = message["text"];
        let matchedItem = regExpression.exec(text);
        while (matchedItem !== null){
            if (githubData[matchedItem[1]] !== undefined){
                if (githubData[matchedItem[1]]["slackMessages"] !==
                undefined){
                    if (!githubData[matchedItem[1]]["slackMessages"]
                        .includes(text)){
                        githubData[matchedItem[1]]["slackMessages"].push(message);
                    }
                }
                else{
                    githubData[matchedItem[1]]["slackMessages"] = [];
                    githubData[matchedItem[1]]["slackMessages"].push(message);
                }
            }
            matchedItem = regExpression.exec(text);
        }
    });
    return githubData;
};
// functions for populating list on page with issues ect

/**
 * Function appends <li> element with data from issue onto page.
 * @param {object} issue - An issue object from GitHub.
 */
var makeIssueListItem = function(issue) {
    var $issueList = $("#issues ul");
    var $issueElement = $("<li>");
    var $outerDiv = $("<div>").addClass("card ghfeed blue-grey darken-1");
    var $titleCardDiv = $("<div>").addClass("card-content white-text");
    var $actionCardDiv = $("<div>").addClass("card-action");
    var $span = $("<span>").addClass("card-title").text("Issue# " + issue.number);
    var $para = $("<p>");
    var $aHrefGithub = $("<a>");
    var $aInspect = $("<a>");
    $aInspect.attr("href", "#").text("Inspect");
    $aHrefGithub.attr("href", issue.html_url).text("Open on GitHub");
    $aHrefGithub.attr("target", "_blank");

    $actionCardDiv.append($aHrefGithub).append($aInspect);
    $para.text(issue.title);
    $titleCardDiv.append($span).append($para);
    $outerDiv.append($titleCardDiv).append($actionCardDiv);
    $issueElement.append($outerDiv);
    $issueList.append($issueElement);
};

/**
 * Function appends <li> element with data from pull requests onto page.
 * @param {object} pullRequest - An pull request object from GitHub.
 */
var makePullListItem = function(pullRequest) {
    var $pullList = $("#pulls ul");
    var $pullElement = $("<li>");
    var $outerDiv = $("<div>").addClass("card ghfeed indigo");
    var $titleCardDiv = $("<div>").addClass("card-content white-text");
    var $actionCardDiv = $("<div>").addClass("card-action");
    var $span = $("<span>").addClass("card-title").text("Pull Request# " + pullRequest.number);
    var $para = $("<p>");
    var $aHrefGithub = $("<a>");
    var $aInspect = $("<a>");
    $aInspect.attr("href", "#").text("Inspect");
    $aHrefGithub.attr("href", pullRequest.html_url).text("Open on GitHub");
    $aHrefGithub.attr("target","_blank");

    $actionCardDiv.append($aHrefGithub).append($aInspect);
    $para.text(pullRequest.title);
    $titleCardDiv.append($span).append($para);
    $outerDiv.append($titleCardDiv).append($actionCardDiv);
    $pullElement.append($outerDiv);
    $pullList.append($pullElement);
};

/**
 * Function gets all issues and creates and appends <li> elements to
 * the page.
 */

var populateIssueList = function() {
    // grab all issues
    listIssues().then(function(results) {
        for(var i = 0; i < results.length; i++) {
            //console.log(results[i]);
            makeIssueListItem(results[i]);
        }
    });
};

/**
 * Function gets all pull requests and creates and appends <li> elements to
 * the page.
 */
var populatePullList = function() {
    // grab all issues
    listPullRequests().then(function(results) {
        for(var i = 0; i < results.length; i++) {
            //console.log(results[i]);
            makePullListItem(results[i]);
        }
    });
};

populateIssueList();
populatePullList();

let refreshFunctions = function refreshFunctions(){
    let latestSlackMessage = 0;
    let updateAllChannels = function updateAllChannels(timestamp){
        let promises = [];
        watchedChannels.forEach(function(channel){
            promises.push(updateChannel(channel,timestamp));
        });
        return Promise.all(promises).then(function(messageArrays){
            let combinedMessages=[];
            messageArrays.forEach(function(messages){
                messages.forEach(function(message){
                    combinedMessages.push(message);
                });
            });
            console.log(combinedMessages);
            return combinedMessages;
        });

    };
    let updateChannel = function updateChannel(channel,timestamp){
        let channelMessages = [];
        let callback = function(data){
            githubData = parseSlackData(data["messages"],githubData);
            if (data["hasMore"]){
                let numberOfMessages = data["messages"].length - 1;
                let latest = data["messages"][numberOfMessages]["ts"];
                slack("ListMessages",{"channel":channel, "time":latest},
                    callback).then(function(data){
                    channelMessages = channelMessages.concat(data["messages"]
                        .map(function(message){
                            message["type"] = "slack";
                            return message;
                        })
                    );
                });
            }
        };
        return new Promise(function(resolve){
            githubData = generatePullIssueObj(githubData);
            slack("ListMessages",{"channel":channel, "time":timestamp},callback)
                .then(function(data){
                    if (data["messages"].length > 0){
                        sortByTime(data["messages"]);
                        let numberOfMessages = data["messages"].length-1;
                        let lastReceived = data["messages"][numberOfMessages]["ts"];
                        if (latestSlackMessage < lastReceived){
                            latestSlackMessage = lastReceived;
                        }
                        channelMessages = channelMessages.concat(data["messages"]
                            .map(function(message){
                                message["type"] = "slack";
                                return message;
                            })
                        );
                    }
                    resolve(channelMessages);
                });
        });
    };
    document.querySelector(".update_icon").addEventListener("click",function(event){
        updateAllChannels(latestSlackMessage).then(function(data){
            feedUpdate(data);
        });
    });
    document.querySelector("#slackPost").addEventListener("submit",function(event){
        let form = document.querySelector("#slackPost");
        let textField = form.querySelector("#slack_msg");
        slack("postMessage",{"text":textField["value"], "channel":"C9K0QKN3T",
            "asUser":true}).then(function(){
            updateAllChannels(latestSlackMessage).then(feedUpdate).then(
                function(){
                    form.reset();
                });
        });
    });
    //setInterval(function(){
    //updateAllChannels(latestSlackMessage).then(feedUpdate);
    //},5000);
    updateAllChannels(latestSlackMessage).then(feedUpdate);
};
let sortByTime = function sortByTime(messages){
    messages.sort(function(a,b){
        if (a.ts < b.ts){
            return -1;
        }
        else if (a.ts > b.ts){
            return 1;
        }
        else if (a.ts === b.ts){
            return 0;
        }
        else {
            throw new Error("A sorting error has occured");
        }
    });
};
let feedUpdate = function feedUpdate(messages){
    if (messages.length > 0){
        let feed = document.querySelector("#feed");
        sortByTime(messages);
        messages.forEach(function(messageObject){
            let container = document.createElement("li");
            let image = document.createElement("img");
            let mainText = document.createElement("p");
            let timestamp = document.createElement("aside");
            image.classList.add("icon");
            if (messageObject["service"] === undefined){
                image.setAttribute("src","Slack_Icon.png");
                mainText.textContent = `User: ${messageObject["user"]} Message: ` +
                                        `${messageObject["text"]} \n` ;
            }
            timestamp.textContent = `${convertUnixTime(messageObject["ts"])}`;
            timestamp.classList.add("timestamp");
            container.appendChild(image);
            container.appendChild(mainText);
            container.appendChild(timestamp);
            container.classList.add("feedItem", "card");
            feed.appendChild(container);

        });
    }
};
refreshFunctions();
