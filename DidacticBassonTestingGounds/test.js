/*global $*/
"use strict";


let methods = {
    Test:"auth.test",/*Requires only auth token*/
    ListChannels:"channels.list",/*Requires only auth token*/
    postMessage:"chat.postMessage",/*Requires target channel, authtoken, and as user*/
    ListMessages:"conversations.list",/*Requries only authToken*/
    ListPrivate:"groups.list"

};
let url = function url(method){
    let url = "https://my-little-cors-proxy.herokuapp.com/https://slack.com/api/";
    // url = "https://slack.com/api/";
    return url+methods[method];
};
let slack = function slack(method, channel, asUser, text){
    let payload = {};
    if (channel){
        payload["channel"] = channel;
    }
    if (asUser ===  true){
        payload["as_user"] = true;
    }
    if (text){
        payload["text"] = text;
    }
    payload["token"] = localStorage["token"];
    $.ajax(url(method),{
        method:"POST",
        header:{
            "content-type":"application/x-www-form-urlencoded"
        },
        data:$.param(payload)
    }).then(function(data){
        console.log(data);
    });
};
slack("postMessage","C9K0QKN3T",true, "test 4");
