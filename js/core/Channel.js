define(['zepto', 'core/FeedParser', 'knockout', 'utils/Cache'], function($, FeedParser, ko, Cache) {

    var cache = new Cache();

    function Channel(options) {
        this.src = options.src;
        this.host = options.host;
        this.title = ko.observable(options.title);
        this.lastNewsDate = ko.observable(options.lastNewsDate);
        this.icon = ko.observable(options.icon || '/images/128/loop_gray.png');
        this.readed = ko.computed(function() {
            return this.lastNewsDate() != null;
        }, this);
    };

    Channel.prototype = {
        read: function(callback) {

            function onSuccess(response) {
                var data = FeedParser.parse(response);
                var updates = this.getUpdates(data.news);

                updateModel(this, data.channel);
                callback(updates);
            }

            $.ajax({
                url: this.src,
                dataType: 'xml',
                success: onSuccess.bind(this)
            });
        },

        getUpdates: function(news) {
            var updates = [];
            var latestDate = this.lastNewsDate();
            var maxNewsDate = latestDate;

            news.forEach(function(item) {
                var itemDate = item.date;

                if (itemDate <= latestDate) {
                    return;
                }

                maxNewsDate = Math.max(maxNewsDate, itemDate);
                updates.push(item);
            });

            this.lastNewsDate(maxNewsDate);

            return updates;
        },

        setLastNewsDate: function() {
            this.lastNewsDate(Date.now());
        },

        resetLastNewsDate: function() {
            this.lastNewsDate(null);
        }
    };

    Channel.create = function(options) {
        var update = true;
        var Constructor = this;
        var instance = cache.setIfNot(options.src, function() {
            update = false;
            return new Constructor(options);
        });

        if (update) {
            updateModel(instance, options);
        }

        return instance;
    };

    function updateModel(model, options) {
        var prop, value, modelValue;

        for (prop in options) {
            value = options[prop];
            modelValue = model[prop];

            if (prop in model && value != null && !ko.isComputed(modelValue)) {
                modelValue = model[prop];

                if (ko.isObservable(modelValue)) {
                    modelValue(value);
                } else {
                    model[prop] = value;
                }
            }
        }
    }

    return Channel;
});


