/* github functionality */
const URL = "https://api.github.com/repos/TerryRPatterson/didactic-bassoon";
const GITHUB_TOKEN = localStorage.getItem("GitToken");
console.log(GITHUB_TOKEN);

let githubData = {};

/**
 * Function creates a Date object from an Unix time stamp. In order to
 * present human readable form of time.
 * @param {int} timestamp - An Unix time stamp.
 * @return {string} The current time.
 */
let convertUnixTime = function(timestamp) {
  return new Date(timestamp * 1000);
};

/**
 * Retrieves and displays information about rate limits for requests of the
 * GitHub api.
 */
let getRateLimit = function() {
  let urlRequest = "https://api.github.com/rate_limit";
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
 * Function retrieves and displays information on issues in this
 * repository.
 */
let listIssues = function(time) {
  let urlRequest = URL + "/issues";
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




/**
 * Function retrieves and displays information about pull requests in this
 * repository.
 */
let listPullRequests = function(time) {
  let urlRequest = URL + "/pulls";
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
let getPullIssueComments = function(commentUrl) {
  let urlRequest = commentUrl;
  // fetch returns array of json objects
  let comments = [];
  // fetch returns array of json objects
  return fetch(urlRequest, {
    headers: {
      authorization: "token " + GITHUB_TOKEN
    }
  })
    .then(function(response) {
      let jsonArray = response.json();
      return jsonArray;
    })
    .then(function(jsonArray) {
      //console.log(jsonArray);
      for (let i = 0; i < jsonArray.length; i++) {
        let tuple = {};
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
let generatePullIssueObj = function(pullIssueObj={}){
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
      let pullNumbers = [];
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

export {generatePullIssueObj as generateGitHubObj};
export {getPullIssueComments, listPullRequests, listIssues};
