

let updateGitHubData = (state, action) => {
  let githubData = action["state"];
  return {...state, githubData};
};

export default updateGitHubData;
