var t = null;
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.type == "fwd") {
            sendResponse({ sent: true })
            fwdMessage(request.mid, request.to);
        }
         return true;
    });

chrome.identity.getAuthToken({ 'interactive': true },
    function (token) {
        t = token;
        var url = "https://www.googleapis.com/gmail/v1/users/me/messages/send?access_token=" + token;
        var x;
        if (chrome.runtime.lastError) {
            alert(chrome.runtime.lastError.message);
            return;
        }
        x = new XMLHttpRequest();
        x.open('GET', 'https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=' + token);
        x.onload = function () {
            alert(x.response);
        };
        x.send();
    });

gapiIsLoaded = function () {
    console.log("gapi loaded");
}

function fwdMessage(mid, receiver) {
    var headers = getClientRequestHeaders();
    var path = "gmail/v1/users/me/messages/" + mid + "?format=full&key=1014705257182-52dddl9dbiec2ln22stokphlaq0v7gor.apps.googleusercontent.com";
    gapi.client.request({
        path: path,
        method: "GET",
        headers: headers,
    }).then(function (response) {
        console.log(response);
        var message = JSON.parse(response.body);
        var part = message.payload.parts.filter(function (part) {
            return part.mimeType == 'text/html';
        });
        var content = atob(part[0].body.data.replace(/-/g, '+').replace(/_/g, '/'));
        var sender = 'me';
        var to = 'To: ' + receiver;
        var from = 'From: ' + sender;
        var subject = 'Subject: FW: ' + message.payload.headers[15].value;
        var contentType = 'Content-Type: text/html; charset=utf-8';
        var mime = 'MIME-Version: 1.0';

        var message = "";
        message += to + "\r\n";
        message += from + "\r\n";
        message += subject + "\r\n";
        message += contentType + "\r\n";
        message += mime + "\r\n";
        message += "\r\n" + content;
        // TODO Process attachments
        sendMessage(message);
    });
}

function sendMessage(message) {
    var headers = getClientRequestHeaders();
    var path = "gmail/v1/users/me/messages/send?key=1014705257182-52dddl9dbiec2ln22stokphlaq0v7gor.apps.googleusercontent.com";
    var base64EncodedEmail = btoa(message).replace(/\+/g, '-').replace(/\//g, '_');
    gapi.client.request({
        path: path,
        method: "POST",
        headers: headers,
        body: {
            'raw': base64EncodedEmail
        }
    }).then(function (response) {
        console.log(response);
    });
}

function getClientRequestHeaders() {
    var a = "Bearer " + t;
    return {
        "Authorization": a,
        "X-JavaScript-User-Agent": "Google APIs Explorer"
    };
}
