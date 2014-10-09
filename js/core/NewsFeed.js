define(['knockout'], function(ko) {

    function NewsFeed() {
        this.news = ko.observableArray();
    }

    NewsFeed.prototype = {
        prepend: function(updates) {
            updates = updates || [];

            var news = this.news;

            news.unshift.apply(news, updates);
        },

        onItemClick: function(news) {
            chrome.runtime.sendMessage({
                message: 'createTab',
                data: news.link
            });
        },

        onContainerClick: function(feed, event) {
            event.stopPropagation();
        }
    };

    return NewsFeed;
});
