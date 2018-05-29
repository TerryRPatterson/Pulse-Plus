import react from "react";
import moment from "moment";

let slackMessaging = () => {
    return(<section>
        <div className="feed hidden" id="feedContainer">
            <ul className="feedList" id="feed">
                <SlackMessage type="Slack" ts={moment()} text="Test"
                    user="Terry"/>
                
            </ul>
        </div>
        <footer>
            <div className="input-field col s6 messaging hidden">
                <form id="slackPost">
                    <input placeholder="Message" id="slack_msg" type="text"
                        className="validate"></input>
                    <label htmlFor="slack_msg">Post to Slack</label>
                    <button className="btn slack waves-effect waves-light"
                        id="slack" type="submit" name="action">
                        <i className="fab fa-slack-hash"></i> Post to Slack
                    </button>
                </form>
            </div>
        </footer>
    </section>)

}
