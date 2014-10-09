define(['knockout', 'core/Channel'], function(ko, Channel) {

    function Resource(data) {
        data = data || {};
        this.title = data.title;
        this.host = data.host;

        var channels = (data.channels || []).map(function(data) {
            return Channel.create(data);
        });

        this.channels = ko.observableArray(channels);
        this.readed = ko.computed(function() {
            var channels = this.channels();

            if (channels.length == 0) return;

            for (var i = 0, n = channels.length; i < n; i++) {
                if (channels[i].readed()) return true;
            }

            return false;
        }, this);
    };

    Resource.mock = new Resource();

    return Resource;
});

