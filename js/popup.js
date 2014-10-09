(function() {
    var backgroundPage = chrome.extension.getBackgroundPage();
    var channels = backgroundPage.app.getChannelsData();

    function onChange(channel) {
        var action = channel.readed ? 'unsubscribe' : 'subscribe';

        chrome.runtime.sendMessage({
            message: action,
            target: 'browserAction',
            data: channel
        });
    }

    ko.applyBindings({
        channels: channels,
        onChange: onChange
    });
})();



