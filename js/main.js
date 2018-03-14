/* main.js */
/*global $*/
/* eslint no-console:0
no-unused-vars:0 */
/* github functionality */
const URL = "https://api.github.com/repos/TerryRPatterson/didactic-bassoon";
const GITHUB_TOKEN = localStorage.getItem("GitToken");

let githubData = {};
let watchedChannels = ["C9K0QKN3T","G9M6ERE94"];
let refresh;//this is a function created later;
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
 * Function returns an array of objects with two properties, author and
 * message.
 */
var getPullIssueComments = function(commentUrl) {
    var urlRequest = commentUrl;
    // fetch returns array of json objects
    var comments = [];
    // fetch returns array of json objects
    return fetch(urlRequest, {
        headers: {
            authorization: "token " + GITHUB_TOKEN
        }
    })
        .then(function(response) {
            var jsonArray = response.json();
            return jsonArray;
        })
        .then(function(jsonArray) {
            //console.log(jsonArray);
            for (var i = 0; i < jsonArray.length; i++) {
                var tuple = {};
                tuple["author"] = jsonArray[i].user.login;
                tuple["message"] = jsonArray[i].body;
                tuple["ts"] = Date.parse(jsonArray[i].updated_at) / 1000;
                comments.push(tuple);
            }
            //console.log(comments);
            return comments;
        });
};



/**
 * Function creates one big object containing all issues and pull requests.
 * form {
 *       number: {issue or pull request object}
 *       ts : timestamp
 *       type: pull or issue
 *       comments: [
 *                  {},
 *                  {},
 *                 ]
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
            var pullNumbers = [];
            let promises = [];
            for(let i = 0; i < results[0].length; i++) {
                //this should create timestamp property from updated date
                pullIssueObj[results[0][i]["number"]] = results[0][i];
                pullIssueObj[results[0][i]["number"]]["type"] = "pull";
                pullIssueObj[results[0][i]["number"]]["ts"] = Date.parse(results[0][i]["updated_at"]) / 1000;
                promises.push(getPullIssueComments(results[0][i]["comments_url"])
                    .then(function (result) {
                        pullIssueObj[results[0][i]["number"]]["comments"] = result;
                    }));
                pullNumbers.push(results[0][i]["number"]);
            }
            for(let i = 0; i < results[1].length; i++) {
                //this should create timestamp property from update date
                if (pullNumbers.includes(results[1][i]["number"]) != true) {
                    pullIssueObj[results[1][i]["number"]] = results[1][i];
                    pullIssueObj[results[1][i]["number"]]["type"] = "issue";
                    pullIssueObj[results[1][i]["number"]]["ts"] = Date.parse(results[1][i]["updated_at"]) / 1000;
                    promises.push(getPullIssueComments(results[1][i]["comments_url"])
                        .then(function (result) {
                            pullIssueObj[results[1][i]["number"]]["comments"] = result;
                        }));
                }
            }
            return Promise.all(promises);
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
let modalToggleIssue = (event) => {
    var lightbox = document.querySelector('.lightbox').classList;
    console.log(lightbox);
        let title = document.getElementById("modal-title");
        let number = event.target.getAttribute("id");
        let comments = document.getElementById("commentthread");
        while (comments.lastChild){
            comments.removeChild(comments.lastChild)
        }
        let commentsString = "";
        let messages = [];
        let gitObject = githubData[number];
        gitObject["comments"].forEach(function(message){
            messages.push(message);
        });
        if (gitObject["slackMessages"] !== undefined){
            gitObject["slackMessges"].forEach(function(message){
                messages.push(message);
            });
        }
        sortByTime(messages);
        messages.forEach(function(message){
            let li = document.createElement("li");
            if (message["type"] === "slack"){
                li.textContent = `${message["user"]}: ${message["text"]}`;
            }
            if (message["type"] === "comment"){
                li.textContent = `${message["author"]}: ${message["message"]}`;
            }
            comments.appendChild(li);
        });
        gitObject[""];
        title.textContent = `Issue #${number}`;
        console.log(number);
        $("#GitForm").submit(function(){$.ajax(`${URL}/issues/${number}/comments`,{
            headers:{authorization: "token " + GITHUB_TOKEN},
            method:"POST",
            data:JSON.stringify({body:$("#gh_msg").val()})
        }).then(function(){
            refresh().then(function(){$("#GitForm").reset();});
        });

    });
    lightbox.toggle('modalhide');
};

let modalTogglePull = (event) => {
    var lightbox = document.querySelector('.lightbox').classList;
    console.log(lightbox);
        let title = document.getElementById("modal-title");
        let number = event.target.getAttribute("id");
        let comments = document.getElementById("commentthread");
        while (comments.lastChild){
            comments.removeChild(comments.lastChild)
        }
        let gitObject = githubData[number];
        let commentsString = "";
        let messages = [];
        gitObject["comments"].forEach(function(message){
            messages.push(message);
        });
        if (gitObject["slackMessages"] !== undefined){
            gitObject["slackMessages"].forEach(function(message){
                messages.push(message);
            });
        }
        sortByTime(messages);
        messages.forEach(function(message){
            let li = document.createElement("li");
            if (message["type"] === "slack"){
                li.textContent = `${message["user"]}: ${message["text"]}`;
            }
            if (message["type"] === "comment"){
                li.textContent = `${message["author"]}: ${message["message"]}`;
            }
            comments.appendChild(li);
        });
        gitObject[""];
        title.textContent = `Pull #${number}`;
        console.log(number);
        $("#GitForm").submit(function(){$.ajax(`${URL}/issues/${number}/comments`,{
            headers:{authorization: "token " + GITHUB_TOKEN},
            method:"POST",
            data:JSON.stringify({body:$("#gh_msg").val()})
        }).then(function(){
            let comments = document.getElementById("commentthread");
            let li = document.createElement("li");
            li.textContent = `You: ${$("#gh_msg").val()}`;
            comments.appendChild(li);
            refresh().then(function(){$("#GitForm").reset();});
        });

    });
    lightbox.toggle('modalhide');
};
// functions for populating list on page with issues ect

/**
 * Function appends <li> element with data from issue onto page.
 * @param {object} issue - An issue object from GitHub.
 */
var makeIssueListItem = function(issue) {
    let number = issue.number;

    var $issueList = $("#issues ul");
    var $issueElement = $("<li>");
    var $outerDiv = $("<div>").addClass("card ghfeed blue-grey darken-1");
    var $titleCardDiv = $("<div>").addClass("card-content white-text");
    var $actionCardDiv = $("<div>").addClass("card-action");
    var $span = $("<span>").addClass("card-title").text("Issue# " + issue.number);
    var $para = $("<p>");
    var $aHrefGithub = $("<a>");
    var $aInspect = $("<a>").addClass("open_modal").attr("id",number);
    let $GitForm = $("#GitForm");
    $aInspect.attr("href", "#").text("Inspect").on("click",modalToggleIssue);
    $aHrefGithub.attr("href", issue.html_url).attr("target","_blank").text("Open on GitHub");

    $actionCardDiv.append($aHrefGithub).append($aInspect);
    $para.text(issue.title);
    $titleCardDiv.append($span).append($para);
    $outerDiv.append($titleCardDiv).append($actionCardDiv);
    $issueElement.append($outerDiv);
    $issueList.append($issueElement);

    $GitForm.submit();
};

/**
 * Function appends <li> element with data from pull requests onto page.
 * @param {object} pullRequest - An pull request object from GitHub.
 */
var makePullListItem = function(pullRequest) {
    let number = pullRequest.number;
    let gitObject = githubData[number];
    var $pullList = $("#pulls ul");
    var $pullElement = $("<li>");
    var $outerDiv = $("<div>").addClass("card ghfeed indigo");
    var $titleCardDiv = $("<div>").addClass("card-content white-text");
    var $actionCardDiv = $("<div>").addClass("card-action");
    var $span = $("<span>").addClass("card-title").text("Pull Request# " + pullRequest.number);
    var $para = $("<p>").addClass("card-desc");
    var $aHrefGithub = $("<a>")
    var $aInspect = $("<a>").addClass("open_modal").on("click",modalTogglePull)
        .attr("id",number);;
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
    $("#issues ul").empty();
    var pullArray = [];
    listPullRequests()
    .then(function (results) {
        for (var i = 0; i < results.length; i++) {
            pullArray.push(results[i].number);
        }
        // grab all issues
        listIssues().then(function(results) {
            for(var i = 0; i < results.length; i++) {
            //console.log(results[i]);
                if (pullArray.includes(results[i]["number"]) != true) {
                    makeIssueListItem(results[i]);
                }
            }
        });
    });
};

/**
 * Function gets all pull requests and creates and appends <li> elements to
 * the page.
 */
var populatePullList = function() {
    $("#pulls ul").empty();
    // grab all issues
    listPullRequests().then(function(results) {
        for(var i = 0; i < results.length; i++) {
            //console.log(results[i]);
            makePullListItem(results[i]);
        }
    });
};


let refreshFunctions = function refreshFunctions(){
    let latestSlackMessage = 0;
    refresh = function refresh(){
        return generatePullIssueObj(githubData).then(function(data){
            populatePullList();
            populateIssueList();
            githubData = data;
            let gitHubMessages = createGitHubList(githubData);
            return updateAllChannels(latestSlackMessage).then(function(slackMessages){
                return (gitHubMessages.concat(slackMessages));
            });
        }).then(feedUpdate);
    };
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
        refresh();
    });
    document.querySelector("#slackPost").addEventListener("submit",function(event){
        let form = document.querySelector("#slackPost");
        let textField = form.querySelector("#slack_msg");
        slack("postMessage",{"text":textField["value"], "channel":"C9K0QKN3T",
            "asUser":true}).then(function(){
            refresh().then( function(){
                form.reset();
            });
        });
    });
    //setInterval(function(){
    //updateAllChannels(latestSlackMessage).then(feedUpdate);
    //},5000);
    refresh();
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
            if (messageObject["type"] === "slack"){
                image.setAttribute("src","Slack_Icon.png");
                mainText.textContent = `User: ${messageObject["user"]} Message: ` +
                                        `${messageObject["text"]} \n` ;
            }
            if (messageObject["type"] === "pull"){
                image.setAttribute("src","Git_Merge_Icon.png");
                mainText.textContent = `User ${messageObject["user"]["login"]}`+
                                        ` title: ${messageObject["title"]} \n`;
            }
            if (messageObject["type"] === "issue"){
                image.setAttribute("src","Git_Issuse_Icon.png");
                mainText.textContent = `User ${messageObject["user"]["login"]}`+
                                        ` title: ${messageObject["title"]} \n`;
            }
            if (messageObject["type"] === "comment"){
                image.setAttribute("src","Git_Comment_Icon.png");
                mainText.textContent =  `User: ${messageObject["author"]} ` +
                                    `Message: ${messageObject["message"]}\n`;
            }
            timestamp.textContent = `${convertUnixTime(messageObject["ts"])}`;
            timestamp.classList.add("timestamp");
            container.appendChild(image);
            container.appendChild(mainText);
            container.appendChild(timestamp);
            container.classList.add("feedItem", "card");
            feed.appendChild(container);
            var objDiv = document.getElementById("feedContainer");
            objDiv.scrollTop = objDiv.scrollHeight;
        });
    }
};
let createGitHubList = function createGitHubList(githubData){
    let messages = [];
    Object.keys(githubData).forEach(function(key){
        let gitObject = githubData[key];
        if (gitObject["comments"].length > 0){
            let comments = gitObject["comments"];
            comments.forEach(function(comment){
                comment["type"] = "comment";
                messages.push(comment);
            });
        }
        messages.push(gitObject);
    });
    return messages;
};
refreshFunctions();
