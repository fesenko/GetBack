define(['zepto', 'knockout', 'utils/Cache', 'utils/emitter'], function($, ko, Cache, emitter) {

    function ChannelList(options) {
        options = options || {};

        var self = this;
        var channels = options.channels || [];

        this.subscriptions = new Cache();
        this.channels = ko.observableArray();

        channels.forEach(function(channel) {
            self.add(channel);
        });

        emitter(this, ['change']);
        this.channels.subscribe(this.onChange.bind(this));
    }

    ChannelList.prototype = {
        add: function(channel) {
            var subscriptions = [];
            var onChange = this.onChange.bind(this);

            for (var prop in channel) {
                var value = channel[prop];
                if (ko.isObservable(value) && !ko.isComputed(value)) {
                    var subscription = value.subscribe(onChange);

                    subscriptions.push(subscription);
                }
            }

            this.channels.push(channel);
            this.subscriptions.set(channel.src, subscriptions);
        },

        remove: function(channel) {
            var subscriptions =  this.subscriptions.getThenRemove(channel.src);

            subscriptions.forEach(function(subscription) {
                subscription.dispose();
            });

            this.channels.remove(channel);
        },

        forEach: function(callback) {
            var channels = this.channels();

            channels.forEach(function(channel) {
                callback(channel);
            });
        },

        onChange: function() {
            this.emit('change', this.channels());
        }
    };

    return ChannelList;
});