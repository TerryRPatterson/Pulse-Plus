import React from "react";


//Need to think of better name
//Ask about git form

let gitFeedItem = ({number, html_url, title, type}) => {

    return(
        <li>
            <div className="card ghfeed blue-grey darken-1"> {/*outerDiv*/}
                <div className="card-content white-text">{/*titleCardDiv*/}
                    <span className="card-title">{/*span*/}
                        {`${type}# ${number}`}
                    </span>
                    <p>{title}</p>{/*para*/}
                </div>
                <div className="card-action">{/*actionCardDiv| V$aHrefGithub*/}
                    <a href={html_url} target="_blank" rel="noopener noreferrer">
                        "Open on Github"
                    </a>
                    <a className="open_modal" id={number} href="#OpenModal"
                        onClick={console.log}>{/*Need to set up modal state*/}
                            "Inspect"
                    </a>
                </div>
            </div>
        </li>
    );

};

export default gitFeedItem;
