define(['zepto', 'core/News'], function($, News) {
    function FeedParser() {

    }

    FeedParser.parse = function(doc) {
        var news = [];
        var entries = $('entry', doc);
        var title = $('feed > title', doc).text();

        for (var i = 0, n = entries.length; i < n; i++) {
            var entry = entries[i];
            var updated = $('updated', entry).text();
            var textContent = $('content[type="html"]', entry).text();
            var content = $(textContent);
            var options = {
                message: title,
                date: Date.parse(updated),
                title: $('title', entry).text(),
                link: $('link', entry).attr('href'),
                icon: $('img', content).attr('src')
            };

            news.push(new News(options));
        }

        return {
            channel: {
                title: title
            },
            news: news
        };
    };

    return FeedParser;
});