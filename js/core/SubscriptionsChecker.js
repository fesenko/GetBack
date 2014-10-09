define(['knockout', 'utils/emitter', 'core/ChannelList', 'core/Channel', 'storage'],
    function(ko, emitter, ChannelList, Channel, storage) {

    var storageKeys = {
        subscriptions: 'subscriptions',
        notifications: 'notifications'
    };

    function SubscriptionsChecker(options) {
        options = options || {};

        this.timeoutId = null;
        this.timeout = options.timeout || 3 * 60 * 1000;
        this.subscriptions = new ChannelList({
            channels: this.restoreSubscriptions()
        });
        this.subscriptions.on('change', this.saveSubscriptions);
        this.notifications = ko.observable(this.restoreNotifications(options));
        this.notifications.subscribe(this.onChangeNotifications.bind(this));
        chrome.runtime.onMessage.addListener(this.onMessage.bind(this));
        chrome.idle.setDetectionInterval(120);
        chrome.idle.onStateChanged.addListener(this.onIdleStateChange.bind(this));

        emitter(this, ['update']);
    }

    SubscriptionsChecker.prototype = {
        restoreSubscriptions: function() {
            var data = storage.get(storageKeys.subscriptions) || [];
            var instances = data.map(function(item) {
                return Channel.create(item);
            });

            return instances;
        },

        saveSubscriptions: function(channels) {
            storage.set(storageKeys.subscriptions, ko.toJS(channels));
        },

        restoreNotifications: function(options) {
            var key = storageKeys.notifications;
            var notifications = storage.has(key);

            if (key in options) {
                notifications = options[key];
            }

            return notifications;
        },

        onChangeNotifications: function(notifications) {
            var key = storageKeys.notifications;

            if (notifications) {
                storage.set(key, notifications);
                this.start();
            } else {
                storage.remove(key);
                this.stop();
            }
        },

        addSubscription: function(channel) {
            channel.setLastNewsDate();
            this.subscriptions.add(channel);
        },

        removeSubscription: function(channel) {
            channel.resetLastNewsDate();
            this.subscriptions.remove(channel);
        },

        onIdleStateChange: function(state) {
            switch(state) {
                case 'idle':
                case 'locked':
                    this.stop();
                    break;
                case 'active':
                    this.launch();
                    break;
            }
        },

        onMessage: function(request) {
            var data = request.data;
            var channel;

            switch(request.message) {
                case 'subscribe':
                    channel = Channel.create(data);
                    this.addSubscription(channel);
                    break;
                case 'unsubscribe':
                    channel = Channel.create(data);
                    this.removeSubscription(channel);
                    break;
                case 'notifications':
                    if (data === true) {
                        this.subscriptions.forEach(function(channel) {
                            channel.setLastNewsDate();
                        });
                    }
                    this.notifications(data);
                    break;
                default:
                    break;
            }
        },

        checkSubscriptions: function() {
            this.subscriptions.forEach(function(channel) {
                this.readChannel(channel);
            }.bind(this));
        },

        readChannel: function(channel) {
            channel.read(function(news) {
                if (news.length > 0) {
                    this.emit('update', news, channel);
                }
            }.bind(this));
        },

        start: function() {
            this.timeoutId = setInterval(this.checkSubscriptions.bind(this), this.timeout);
        },

        stop: function() {
            clearInterval(this.timeoutId);
            this.timeoutId = null;
        },

        launch: function() {
            if (this.notifications()) {
                this.start();
            }
        },

        destroy: function() {
            this.stop();
            instance = null;
        }
    };

    var instance;

    SubscriptionsChecker.create = function(options) {
        if (instance == null) {
            instance = new SubscriptionsChecker(options);
        }

        return instance;
    };

    return SubscriptionsChecker;
});