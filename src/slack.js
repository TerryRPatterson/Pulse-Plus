


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
