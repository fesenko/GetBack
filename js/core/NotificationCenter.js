define(['utils/Cache', 'core/News', 'utils/metric', 'utils/emitter', 'utils/strings', 'i18n'],
    function(Cache, News, metric, emitter, strings, i18n) {

    var chromeTabs = chrome.tabs;

    function NotificationCenter(options) {
        options = options || {};
        this.updates = {};
        this.timeoutId = null;
        this.timeout = options.timeout || 12000;
        this.displayTime = options.displayTime || 16000;
        this.maxNoticeCount = options.maxNoticeCount || 3;

        emitter(this, [
            'notification'
        ]);
    }

    NotificationCenter.prototype = {
        add: function(channel, news) {
            var src = channel.src;
            var updates = this.updates[src];

            if (updates) {
                updates.channel = channel;
                updates.news = updates.news.concat(news);
            } else {
                updates = {
                    channel: channel,
                    news: news
                };
                this.updates[src] = updates;
            }

            clearTimeout(this.timeoutId);
            this.showNoticeDelayed();
        },

        showNotice: function() {
            var updates = this.updates;
            var channelIds = Object.keys(updates);
            var channelId = channelIds[0];

            if (channelId == null) {
                return;
            }

            var update = updates[channelId];
            var channel = update.channel;
            var news = update.news;
            var newsCount = news.length;

            if (newsCount > this.maxNoticeCount) {
                var groupNews = this.createGroupNews(newsCount, channel);

                this.createNotice(groupNews, this.reportUpdates.bind(null, news));
            } else {
                news.forEach(function(item) {
                    this.createNotice(item, this.openNews.bind(null, item));
                }.bind(this));
            }

            if (channelIds.length > 1) {
                this.showNoticeDelayed();
            }

            delete updates[channelId];
        },

        openNews: function(news) {
            chrome.runtime.sendMessage({
                message: 'createTab',
                data: news.link
            });
        },

        reportUpdates: function(news) {
            chromeTabs.query({active: true, currentWindow: true}, function(tabs) {
                chromeTabs.sendMessage(tabs[0].id, { message: 'show-news', data: news} );
            });
        },

        showNoticeDelayed: function() {
            this.timeoutId = setTimeout(function() {
                this.showNotice();
            }.bind(this), this.timeout);
        },

        createNotice: function(news, clickHandler) {
            var id = news.id;
            var notification = new Notification(news.title, {
                body: news.message || '',
                icon: news.icon,
                tag: id
            });
            var displayTime = this.displayTime;

            notification.onshow = function() {
                metric.showNotification();
                setTimeout(function() {
                    notification.close();
                }, displayTime);
            };

            notification.onclick = function() {
                clickHandler();
                notification.close();
                metric.clickNotification();
            };

            this.emit('notification', notification);
        },

        createGroupNews: function(newsCount, channel) {
            var forms = i18n.ma('news_forms');
            var item = News.create({
                title: strings.plural(newsCount, forms),
                message: channel.title(),
                icon: channel.icon(),
                link: '#'
            });

            return item;
        }
    };

    return NotificationCenter;
});
