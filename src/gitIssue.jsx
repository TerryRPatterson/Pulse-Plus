import react from "react";
import moment from "moment";
import modalToggle from "./modalToggleIssue";

//Ask about git form

let gitIssue = ({number, html_url, title}) => {

    return(
        <li>
            <div className="card ghfeed blue-grey darken-1"> {/*outerDiv*/}
                <div className="card-content white-text">{/*titleCardDiv*/}
                    <span className="card-title">{/*span*/}
                        {`Issue# ${number}"`}
                    </span>
                    <p>{title}</p>{/*para*/}
                </div>
                <div className="card-action">{/*actionCardDiv| V$aHrefGithub*/}
                    <a href={html_url} target="_blank" rel="noopener noreferrer">
                        "Open on Github"
                    </a>
                    <a className="open_modal" id={number} href="#"
                        onClick={modalToggle}>
                            "Inspect"
                        </a>
                </div>
            </div>
        </li>

}

export default gitIssue;
