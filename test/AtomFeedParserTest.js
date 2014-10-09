define(['zepto', 'core/AtomFeedParser'], function($, AtomFeedParser) {
    "use strict";

    suite('AtomFeedParser', function() {
        setup(function() {
            this.xmlDoc = getFeed();
        });

        test('parse', function() {
            var data = AtomFeedParser.parse(this.xmlDoc);
            var news = data.news;

            assert.equal(news.length, 20);

            var first = news[0];

            assert.equal(first.title, '«Местная еда» запустила службу кейтеринга');
            assert.equal(first.date, Date.parse('2013-11-19T11:38:51+04:00'));
            assert.equal(first.link, 'http://www.the-village.ru/village/food/food/134809-localfood?utm_source=feed&utm_medium=posts&utm_content=link');
        });
    });

    function getFeed() {
        var doc;

        $.ajax({
            url: 'fixtures/atom_feed.xml',
            dataType: 'xml',
            async: false,
            success: function(data) {
                doc = data;
            }
        });

        return doc;
    }
});