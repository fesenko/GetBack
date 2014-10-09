define(['knockout', 'zepto', 'utils/emitter', 'utils/Cache', 'core/Resource'], function(ko, $, emitter, Cache, Resource) {

    //TODO: при открытии и закрытии попапа
    var tabs = chrome.tabs;
    var resources = new Cache();

    function Observer() {
        var self = this;

        emitter(this, [
            'resource-activated'
        ]);

        this.currentResource = ko.observable(Resource.mock);

        this.currentResource.subscribe(function(resource) {
            self.emit('resource-activated', resource);
        });

        this.onMessage = this.onMessage.bind(this);
        this.onTabRemoved = this.onTabRemoved.bind(this);
        this.onTabActivated = this.onTabActivated.bind(this);
    };


    Observer.prototype = {
        listen: function() {
            chrome.runtime.onMessage.addListener(this.onMessage);
            tabs.onActivated.addListener(this.onTabActivated);
            tabs.onRemoved.addListener(this.onTabRemoved);
        },

        onMessage: function(request, sender) {
            var tab = sender.tab;

            if (tab == null || request.message !== 'resource') {
                return;
            }

            var resource = new Resource(request.data);

            resources.set(tab.id, resource);

            if (tab.active) {
                this.currentResource(resource);
            }
        },

        onTabActivated: function(activeInfo) {
            var resource = resources.get(activeInfo.tabId) || Resource.mock;

            this.currentResource(resource);
        },

        onTabRemoved: function(tabId) {
            resources.remove(tabId);
        },

        destroy: function() {
            chrome.runtime.onMessage.removeListener(this.onMessage);
            tabs.onActivated.removeListener(this.onTabActivated);
            tabs.onRemoved.removeListener(this.onTabRemoved);
        }
    };

    return Observer;
});
