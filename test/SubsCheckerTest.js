define(['core/SubscriptionsChecker', 'core/Channel', 'storage'], function(SubscriptionsChecker, Channel, storage) {
    "use strict";

    suite('SubsChecker', function() {
        setup(function() {
            this.checker = SubscriptionsChecker.create({
                timeout: 50,
                notifications: true
            });
        });

        teardown(function() {
            this.checker.stop();
            storage.remove('subscriptions');
        });

        test('create', function() {
            assert.ok(this.checker);
        });

        test('start/stop', function(done) {
            var checker = this.checker;
            var updates = [];

            checker.on('update', function(news) {
                updates.push.apply(updates, news);
            });

            var channel = new Channel({
                src: 'fixtures/channel',
                title: 'Новости Lenta.ru'
            });

            checker.addSubscription(channel);

            channel.lastNewsDate(1383307960999);

            async(70, done, [
                function() {
                    checker.launch();
                },
                function() {
                    assert.equal(updates.length, 10);
                    checker.stop();
                },
                function() {
                    assert.isNull(checker.timeoutId);
                }
            ]);
        });

        test('enable/disable notifications', function(done) {
            var checker = this.checker;
            var updateCount = 0;

            checker.on('update', function() {
                updateCount++;
            });

            var channel = new Channel({
                src: 'fixtures/channel',
                title: 'Новости Lenta.ru'
            });

            checker.addSubscription(channel);

            channel.lastNewsDate(1383307960999);

            async(40, done, [
                function() {
                    checker.launch();
                },
                function() {
                    assert.isTrue(checker.notifications());
                    checker.notifications(false);
                },
                function() {
                    assert.isNull(checker.timeoutId);
                    checker.notifications(true);
                },
                function() {
                    assert.isNotNull(checker.timeoutId);
                },
                function() {
                    assert.equal(updateCount, 1);
                }
            ]);
        });

    });

});