define(['knockout', 'storage', 'i18n'], function(ko, storage, i18n) {
    var subscriptions = storage.get('subscriptions') || [];
    var sendMessage = chrome.runtime.sendMessage;
    var notifications = storage.has('notifications');

    var model = {
        notifications: ko.observable(notifications),
        channels: ko.observableArray(subscriptions),
        remove: function(channel) {
            this.channels.remove(channel);

            sendMessage({
                message: 'unsubscribe',
                data: channel
            });
        }
    };

    model.notifications.subscribe(function(notifications) {
        sendMessage({
            message: 'notifications',
            data: notifications
        });
    });

    ko.applyBindings(model);
    i18n.localizePage();
});