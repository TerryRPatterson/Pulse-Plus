//eslint-disable-next-line
import React, { Component } from "react";


import moment from "moment";
import {HashRouter as Router, Route, Switch} from "react-router-dom";
import {Provider} from "react-redux";
import {createStore, applyMiddleware, compose} from "redux";
import thunk from "redux-thunk";

//Custom Components
import Modal from "./modal";
import GitFeed from "./gitFeed";
import p404 from "./404";
import FeedItem from "./gitFeedItem";
import SlackMessage from "./feedItem";

//Custom functions
import {generateGitHubObj} from "./gitHub";


import "./App.css";
import "./css/bootstrap.css";
import "./css/materialize.css";
import "./css/styles.css";

let reducerRouter = {
  "gitHub":null,
  "slack":null
};

let determineReducer = (type) => {
  for (let routePrefix in reducerRouter) {
    if (type.startsWith(routePrefix)) {
      return reducerRouter[routePrefix];
    }
  }
  if (type === "@@INIT"){
    return state => state;
  }
  else {
    throw new Error(`Action ${type} in found for store!`);
  }
};
let intialState = {
  gitMessages:{},
  slackMessages:{},
  slackChannels:{},
  slackUsers:{},
  watchedChannels:[],
  postingChannel:null
};

let reducer = (oldState=intialState, action) => {
  let type = action["type"];
  return determineReducer(type)(oldState,action);
};

//                                  /*Make sure to remove in production*/
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(
  applyMiddleware(thunk)
));



let App = () =>{
  return (
    <Provider store={store} key="Provider">
      <Router>
        <main>
          <Switch>
            <Route exact path="/(home)?" render={() =>{
              return (
                <div>
                  <GitFeed type="pull">
                    <FeedItem type="Pull" number="1" title="Test"/>
                  </GitFeed>
                  <GitFeed type="issue">
                    <FeedItem type="Issue" number="2" title="Test"/>
                  </GitFeed>}
                </div>
              );}}/>
            <Route path="/Modal" component={Modal}/>
            <Route component={p404}/>
          </Switch>
        </main>
      </Router>
    </Provider>
  );
};
window.addEventListener("load", async () => {
  let github = await generateGitHubObj();

});

export default App;
