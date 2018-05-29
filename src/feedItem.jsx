import React from "react";
import moment from "moment";


let message = (messageObject) => {
    let {ts, type} = messageObject;
    let displayBody;
    let source;
    let alt;
    switch (type) {
    case "Slack":
        displayBody = `User ${messageObject["user"]}`+
            ` | Title: ${messageObject["text"]} \n`;
        source="Slack_Icon.png";
        alt="Slack pound sign icon";
        break;
    case "Pull":
        displayBody =`User ${messageObject["user"]["login"]}`+
            ` | Title: ${messageObject["title"]} \n`;
        source="Git_Merge_Icon.png";
        alt="Github merge icon";
        break;
    case "Issue":
        displayBody = `User ${messageObject["user"]["login"]}`+
            ` | Title: ${messageObject["title"]} \n`;
        source = "Git_Issuse_Icon.png";
        alt="Github issue icon";
        break;
    case "Comment":
        displayBody = `User: ${messageObject["author"]} ` +
            ` | Message: ${messageObject["message"]}\n`;
        source = "Git_Comment_Icon.png";
        alt="Github comment icon";
        break;
    default:
        throw new Error("Type of message object not recongized");
    }
    return(
        <li className="feedItem card">
            <img src={source} alt={alt} className="icon"/>
            <p>{displayBody}</p>
            <time dateTime={moment(ts).format("YYYY-MM-DDTHH:mm:ssZ")}
                className="timestamp">
                {moment(ts).fromNow()}</time>
        </li>
    );
};

export default message;
