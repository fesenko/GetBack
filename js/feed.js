define(['knockout', 'core/NewsFeed'], function(ko, NewsFeed) {
    var feed = new NewsFeed();

    ko.applyBindings(feed);

    function hideOverlay() {
        top.postMessage("hide-overlay", "*");
    }

    function onKeyUp(event) {
        if (event.keyCode == 27) {
            hideOverlay();
        }
    }

    function onMessage(event) {
        feed.prepend(event.data);
    }

    document.addEventListener('keyup', onKeyUp, false);
    document.addEventListener('click', hideOverlay, false);
    window.addEventListener("message", onMessage, false);
});
