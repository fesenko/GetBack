define(['storage', 'core/ChannelList', 'core/Channel'], function(storage, ChannelList, Channel) {
    "use strict";

    suite('ChannelList', function() {
        setup(function() {
            this.subscriptions = new ChannelList();
        });

        test('create', function() {
            assert.ok(this.subscriptions);
        });

        test('add/remove', function(done) {
            var channel = new Channel({
                src: 'http://lenta.ru/rss',
                title: 'Lenta.ru : Новости'
            });

            var changeCounter = 0;
            var subs = this.subscriptions;
            var channels = subs.channels();

            subs.on('change', function() {
                changeCounter++;
            });

            assert.equal(channels.length, 0);

            subs.add(channel);

            assert.equal(channels.length, 1);
            assert.equal(changeCounter, 1);

            async(20, done, [
                function() {
                    channel.lastNewsDate(Date.now());
                },
                function() {
                    assert.equal(changeCounter, 2);
                },
                function() {
                    subs.remove(channel);
                },
                function() {
                    assert.equal(channels.length, 0);
                    assert.equal(changeCounter, 3);
                },
                function() {
                    channel.lastNewsDate(Date.now());
                    assert.equal(changeCounter, 3);
                }
            ]);
        });

        test('forEach', function() {
            var lenta = new Channel({
                src: 'http://lenta.ru/rss',
                title: 'Lenta.ru : Новости'
            });
            var vedomosti = new Channel({
                src: 'http://vedomosti.ru/rss',
                title: 'vedomosti.ru : Новости'
            });

            var sources = [];
            var subs = this.subscriptions;

            subs.add(lenta);
            subs.add(vedomosti);

            subs.forEach(function(channel) {
                sources.push(channel.title);
            });

            assert.equal(sources.length, 2);
        });
    });
});

