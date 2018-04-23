import react from "react";
import moment from "moment";


let message = (messageObject) => {
    let {ts, type} = messageObject;
    let displayBody;
    let source;
    switch (type) {
    case "slack":
        displayBody = `User ${messageObject["user"]}`+
            ` title: ${messageObject["text"]} \n`;
        source="Slack_Icon.png";
        break;
    case "pull":
        displayBody =`User ${messageObject["user"]["login"]}`+
            ` title: ${messageObject["title"]} \n`;
        source="Git_Merge_Icon.png";
        break;
    case "issue":
        displayBody = `User ${messageObject["user"]["login"]}`+
            ` title: ${messageObject["title"]} \n`;
        source = "Git_Issuse_Icon.png";
        break;
    case "comment":
        displayBody = `User: ${messageObject["author"]} ` +
            `Message: ${messageObject["message"]}\n`;
        source = "Git_Comment_Icon.png";
        break;
    }
    return(
        <li className="feedItem card">
            <img src={source} className="icon"/>,
            <p>{displayBody}</p>
            <time dateTime={moment(ts).format("YYYY-MM-DDTHH:mm:ssZ")}
                className="timestamp">
                {moment(ts).fromNow()}</time>
        </li>
    );
};

export default message;
