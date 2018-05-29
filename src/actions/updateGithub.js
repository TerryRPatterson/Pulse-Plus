import {getPullIssueComments, listPullRequests, listIssues} from "../gitHub.js";
import deepClone from "lodash/cloneDeep";


let updateGitHub = (lastUpdate, gitHubState={}) => {
  let clonedState = deepClone(gitHubState);
  return Promise.all([listPullRequests(lastUpdate), listIssues(lastUpdate)])
    .then(function(results) {
      let pullNumbers = [];
      let promises = [];
      for(let i = 0; i < results[0].length; i++) {
        //this should create timestamp property from updated date
        clonedState[results[0][i]["number"]] = results[0][i];
        clonedState[results[0][i]["number"]]["type"] = "pull";
        clonedState[results[0][i]["number"]]["ts"] = Date.parse(results[0][i]["updated_at"]) / 1000;
        promises.push(getPullIssueComments(results[0][i]["comments_url"])
          .then(function (result) {
            clonedState[results[0][i]["number"]]["comments"] = result;
          }));
        pullNumbers.push(results[0][i]["number"]);
      }
      for(let i = 0; i < results[1].length; i++) {
        //this should create timestamp property from update date
        if (pullNumbers.includes(!results[1][i]["number"])) {
          clonedState[results[1][i]["number"]] = results[1][i];
          clonedState[results[1][i]["number"]]["type"] = "issue";
          clonedState[results[1][i]["number"]]["ts"] = Date.parse(results[1][i]["updated_at"]) / 1000;
          promises.push(getPullIssueComments(results[1][i]["comments_url"])
            .then(function (result) {
              clonedState[results[1][i]["number"]]["comments"] = result;
            }));
        }
      }
      return Promise.all(promises);
    }).then(function(){
      return {type:"newGithub",state:clonedState};
    });
};
updateGitHub.toString = () => "GITHUB/UPDATE";

export default updateGitHub;
