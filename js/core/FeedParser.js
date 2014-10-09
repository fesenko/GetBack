define(['core/AtomFeedParser', 'core/RssFeedParser'], function(AtomFeedParser, RssFeedParser) {

    function FeedParser() {

    }

    FeedParser.parse = function(doc) {
        if (doc.childElementCount != 1) {
            return;
        }

        var data = null;
        var parsers = {
            'rss': RssFeedParser,
            'feed': AtomFeedParser
        };

        var rootTagName = doc.children[0].tagName;
        var parser = parsers[rootTagName];

        if (parser != null) {
            data = parser.parse(doc);
        }

        return data;
    };

    return FeedParser;
});
