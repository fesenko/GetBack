define('App', ['zepto', 'knockout', 'core/Observer', 'core/SubscriptionsChecker', 'core/Resource', 'core/NotificationCenter',
    'core/attendance', 'utils/metric', 'i18n'],
    function($, ko, Observer, SubscriptionsChecker, Resource, NotificationCenter, attendance, metric, i18n) {

        var chromeTabs = chrome.tabs;

        function App() {
            this.resource = ko.observable(Resource.mock);
            this.icon = ko.computed(this.getIcon, this);
            this.noticeCenter = new NotificationCenter();
            this.observer = this.initObserver();
            this.checker = this.initSubscriptionsChecker();
            this.icon.subscribe(this.onIconChange);
            this.resource.subscribe(this.onResourceChange.bind(this));
            chrome.browserAction.onClicked.addListener(this.onIconClick.bind(this));
            chrome.runtime.onMessage.addListener(this.onMessage.bind(this));

        };

        App.prototype = {
            initObserver: function() {
                var self = this;
                var observer = new Observer();

                observer.on('resource-activated', function(activeResource) {
                    self.resource(activeResource);
                });

                observer.listen();

                return observer;
            },

            initSubscriptionsChecker: function() {
                var self = this;
                var checker = SubscriptionsChecker.create();

                checker.on('update', function(news, channel) {
                    self.noticeCenter.add(channel, news);
                });

                checker.launch();

                return checker;
            },

            onResourceChange: function(resource) {
                var channelsCount = resource.channels().length;

                chrome.browserAction.setPopup({
                    popup: channelsCount > 1 ? 'popup.html' : ''
                });

                var host = resource.host;

                if (resource.readed() === false &&
                    host &&
                    attendance.needOffer(host) ) {
                        this.showOffer();
                }
            },

            onIconChange: function(icon) {
                chrome.browserAction.setIcon({
                    path: icon
                });
            },

            onIconClick: function() {
                var checker = this.checker;
                var resource = this.resource();
                var channel = resource.channels()[0];

                if (channel == null) return;

                if (resource.readed()) {
                    checker.removeSubscription(channel);
                } else {
                    checker.addSubscription(channel);
                }
            },

            getIcon: function() {
                var iconName;

                switch(this.resource().readed()) {
                    case true:
                        iconName ='check';
                        break;
                    case false:
                        iconName ='heart';
                        break;
                    default:
                        iconName ='loop';
                }

                return '/images/24/' + iconName + '.png';
            },

            getChannelsData: function() {
                var channels = this.resource().channels();

                return channels.map(function(channel) {
                    return {
                        src: channel.src,
                        host: channel.host,
                        title: channel.title(),
                        readed: channel.readed()
                    };
                });
            },

            showOffer: function() {
                var resource = this.resource();
                var channel = resource.channels()[0];

                if (channel == null) {
                    return;
                }

                chromeTabs.query({active: true, currentWindow: true}, function(tabs) {
                    var tab = tabs[0];

                    chromeTabs.sendMessage(tab.id, {
                        message: 'show-stripe',
                        data: ko.toJS(channel),
                        offer: {
                            question: i18n.m('offer_to_subscribe'),
                            yes: i18n.m('yes'),
                            no: i18n.m('no')
                        }
                    });
                });
            },

            onMessage: function(request) {
                var data = request.data || {};
                var host = data.host;

                switch (request.message) {
                    case 'subscribe':
                        attendance.resetVisits(host);

                        var target = request.target;

                        switch (target) {
                            case 'browserAction':
                                metric.subscription();
                                break;
                            case 'stripe':
                                metric.acceptOffer();
                                break;
                        }

                        break;
                    case 'reject-stripe':
                        attendance.rejectOffer(host);
                        metric.rejectOffer();
                        break;
                    case 'show-offer':
                        metric.showOffer();
                        break;
                    case 'createTab':
                        chrome.tabs.create({
                            url: data
                        }, function(tab) {
                            chrome.windows.update(tab.windowId, {
                                focused: true
                            });
                        })
                        break;
                }
            }
        };

        return App;
    });