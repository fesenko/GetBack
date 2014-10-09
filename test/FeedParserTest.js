define(['zepto', 'core/FeedParser'], function($, FeedParser) {
    "use strict";

    suite('FeedParser', function() {
        test('parse', function() {
            var doc = loadDoc('fixtures/atom_feed.xml');
            var data = FeedParser.parse(doc);

            assert.isNotNull(data);
            assert.equal(data.news.length, 20);

            doc = loadDoc('fixtures/rdf_feed.xml');
            data = FeedParser.parse(doc);

            assert.isNull(data);

            doc = loadDoc('fixtures/rss_feed.xml');
            data = FeedParser.parse(doc);

            assert.isNotNull(data);
            assert.equal(data.news.length, 20);
        });
    });

    function loadDoc(url) {
        var doc;

        $.ajax({
            url: url,
            dataType: 'xml',
            async: false,
            success: function(data) {
                doc = data;
            }
        });

        return doc;
    }
});