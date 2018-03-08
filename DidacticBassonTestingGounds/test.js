/*global $*/



let methods = [
    "auth.test",/*Requires only auth token*/
    "channels.list",/*Requires only auth token*/
    "chat.postMessage",/*Requires target channel, authtoken, and as user*/
    "conversations.list",/*Requries only authToken*/

];
let url = function url(method){
    let url = "https://my-little-cors-proxy.herokuapp.com/https://slack.com/api/";
    // url = "https://slack.com/api/";
    let authToken = localStorage["token"];
    return url+methods[method]+"/?token="+authToken;
};

$.ajax(url(2),{
    method:"GET",
    header:{
        "Content-type":"application/x-www-form-urlencoded"
    },
    data:$.param({
        "channel":"C9K0QKN3T",
        "as_user":true,
        "text":"Test"
    })

});
