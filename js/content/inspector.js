(function(document) {
    var channelNodes = document.querySelectorAll('link[rel="alternate"][type="application/rss+xml"]');
    var host = document.location.host;
    var node, title, channels = [];

    for (var i = 0, n = channelNodes.length; i < n; i++) {
        node = channelNodes[i];
        title = node.title;

        if (title == null || title == '') {
            continue;
        }

        channels.push({
            src: node.href,
            title: title,
            host: host
        });
    }

    var iconNode = document.querySelector('link[rel="apple-touch-icon"]');
    var icon = iconNode && iconNode.href;

    chrome.runtime.sendMessage({
        message: 'resource',
        data: {
            channels: channels,
            icon: icon,
            host: host
        }
    });
})(document);
