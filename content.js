function sendMessage(userId,to,mid) {
  chrome.runtime.sendMessage({
    type: "fwd",
    userId: userId,
    to: to,
    mid: mid
    }, function(response) {
        console.log(response);
    });
}

InboxSDK.load('1.0', 'sdk_noonic_e4e65714db').then(function (sdk) {
    // TODO Register list view handler to show button on inbox page when emails are selected
    sdk.Conversations.registerThreadViewHandler(function (threadView) {
        var to = localStorage.getItem("fwdfav");
        // TODO Retrieve multiple contacts
        // TODO Send message to background script to fetch contact details to show avatar
        var elem = document.createElement("button");
        elem.innerHTML = "Fwd";
        elem.onclick = function (e) {
            var mviews = threadView.getMessageViews();
            var last = mviews[mviews.length - 1];
            sendMessage('me', to, last.getMessageID());
        }
        threadView.addSidebarContentPanel({
            el: elem,
            title: "1-click Fwd",
            iconUrl: 'http://www.free-icons-download.net/images/forward-button-icon-64364.png'
        });
    });
});

