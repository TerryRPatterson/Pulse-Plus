import React from "react";

let modal = ({history}) => {
    console.log(history);
    return (
        <div className="lightbox modal">
            <div className="card">
                <button type="button" onClick={history.goBack}>
                    <i className="far fa-times-circle"></i>
                </button>
                <div className="card-content">
                    <h3 id="modal-title">Issue #23</h3>
                    <h6 id="modal-desc">Need to make sure Time parameter works properly in slack api call function #23</h6>
                </div>
                <div className="card-tabs commentthread" >
                    <ul className="" id="commentthread">
                    </ul>
                </div>
                <form className="card-content grey lighten-4" id="GitForm">
                    <button className="btn ghcomment waves-effect waves-light" id="ghcomment" type="submit" name="action">
                        <i className="fab fa-github"></i> Comment
                    </button>
                    <div className="inputwrap">
                        <input placeholder="Comment" id="gh_msg" type="text" className="validate"></input>
                    </div>
                    <div className="bottombtns">
                        <button className="btn ghopen waves-effect waves-light" id="ghopen" type="submit" name="action">
                            Open on GitHub
                        </button>
                        <button className="btn ghcloseissue waves-effect waves-light" id="ghcloseissue" type="submit" name="action">
                            Close Issue
                        </button>
                    </div>
                </form>
            </div>
        </div>);
};

export default modal;
