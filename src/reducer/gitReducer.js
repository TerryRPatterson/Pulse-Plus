import updateGitHubAction from "../actions/updateGithub";
import updateGitHubReducer from "./updateGitHubReducer";
let reducers = {
  [updateGitHubAction]:updateGitHubReducer,
  send:null
};

let gitReducer = (state, action) => {
  return reducers[action["type"]];
};

export default gitReducer;
