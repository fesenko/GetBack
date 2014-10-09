define(['zepto', 'core/RssFeedParser'], function($, RssFeedParser) {
    "use strict";

    suite('RssFeedParser', function() {
        setup(function() {
            this.xmlDoc = getFeed();
        });

        test('parse', function() {
            var data = RssFeedParser.parse(this.xmlDoc);
            var news = data.news;

            assert.equal(data.channel.icon, 'http://www.vedomosti.ru/img/vedomosti_rss_logo.gif');
            assert.equal(news.length, 20);

            var first = news[0];

            assert.equal(first.title, 'РЖД заработает на солярке ');
            assert.equal(first.date, Date.parse('Wed, 20 Nov 2013 04:57:17 +0400'));
            assert.equal(first.link, 'http://www.vedomosti.ru/companies/news/18984481/rzhd-zarabotaet-na-dizele');
        });
    });

    function getFeed() {
        var doc;

        $.ajax({
            url: 'fixtures/rss_feed.xml',
            dataType: 'xml',
            async: false,
            success: function(data) {
                doc = data;
            }
        });

        return doc;
    }
});