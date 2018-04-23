import sortByTime from "./sortByTime";


let modalToggleIssue = (event) => {
    var lightbox = document.querySelector(".lightbox").classList;
    let title = document.getElementById("modal-title");
    let number = event.target.getAttribute("id");
    let comments = document.getElementById("commentthread");
    while (comments.lastChild){
        comments.removeChild(comments.lastChild);
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
    comments = messages.map((message) => {
        return <li>{
        if (message["type"] === "slack"){
                `${message["user"]}: ${message["text"]}`
            }
        else if (message["type"] === "comment"){
                `${message["author"]}: ${message["message"]}`
            }
        }</li>
    });
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
    lightbox.toggle("modalhide");
};


export default modalToggleIssue;
