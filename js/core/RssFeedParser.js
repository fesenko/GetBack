define(['zepto', 'core/News'], function($, News) {
    function FeedParser() {

    }

    FeedParser.parse = function(doc) {
        var news = [];
        var items = $('item', doc);
        var imgSrc = $('channel > image > url', doc).text();
        var title = $('channel > title', doc).text();

        for (var i = 0, n = items.length; i < n; i++) {
            var item = items[i];
            var pubDate = $('pubDate', item).text();
            var options = {
                link: $('link', item).text(),
                title: $('title', item).text(),
                date: pubDate && Date.parse(pubDate),
                message: title,
                icon: imgSrc
            };

            news.push(new News(options));
        }

        return {
            channel: {
                title: title,
                icon: imgSrc
            },
            news: news
        };
    };

    return FeedParser;
});