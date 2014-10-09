(function(window, document) {
    var iframeId = '__nr-overlay';

    function getOverlay() {
        return document.getElementById(iframeId);
    }

    function createOverlay() {
        var iframeSrc = chrome.extension.getURL('feed.html');
        var html = '<iframe id="' + iframeId + '" src="' + iframeSrc + '" allowtransparency="true" scrolling="no"></iframe>';

        document.body.insertAdjacentHTML('afterbegin', html);

        return getOverlay();
    }

    function destroyOverlay() {
        var overlay = getOverlay();

        overlay.parentNode.removeChild(overlay);
    }

    function postNewsToIframe(iframe, news) {
        var contentWindow = iframe.contentWindow;

        if (contentWindow) {
            contentWindow.postMessage(news, "*");
        }
    }

    function showNews(news) {
        var iframe = getOverlay();

        if (iframe) {
            postNewsToIframe(iframe, news);
        } else {
            iframe = createOverlay();
            iframe.onload = postNewsToIframe.bind(null, iframe, news);
        }
    }

    //add listeners

    window.addEventListener('message', function(event) {
        if (event.data == 'hide-overlay') {
            destroyOverlay();
        }
    }, false);

    chrome.runtime.onMessage.addListener(function(request) {
        var message = request.message;
        var news = request.data;

        if (message === 'show-news' && news) {
            showNews(news);
        }
    });

})(window, document);