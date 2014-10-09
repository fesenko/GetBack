define(['core/Channel'], function(Channel) {
    "use strict";

    suite('Channel', function() {
        setup(function() {
            this.channel = new Channel({
                src: 'fixtures/channel',
                title: 'Новости Lenta.ru'
            });
        });

        test('create', function() {
            assert.ok(this.channel);
        });

        test('read', function(done) {
            var channel = this.channel;

            channel.lastNewsDate(null);

            async(200, done, [
                function() {
                    channel.read(function(updates) {
                        assert.equal(updates.length, 10);
                        assert.equal(channel.lastNewsDate(), Date.parse('Fri, 01 Nov 2013 17:00:05 +0400'));
                        channel.src = 'fixtures/channel_update1';
                    });
                },
                function() {
                    channel.read(function(updates) {
                        assert.equal(updates.length, 10);
                        assert.equal(channel.lastNewsDate(), Date.parse('Fri, 01 Nov 2013 18:02:37 +0400'));
                        channel.src = 'fixtures/channel_update2';
                    });
                },
                function() {
                    channel.read(function(updates) {
                        assert.equal(updates.length, 10);
                        assert.equal(channel.lastNewsDate(), Date.parse('Fri, 01 Nov 2013 18:55:00 +0400'));
                    });
                },
                function() {
                    channel.read(function(updates) {
                        assert.equal(updates.length, 0);
                    });
                },
                function() {
                    channel.read(function(updates) {
                        assert.equal(updates.length, 0);
                    });
                }
            ]);
        });
    });
});
