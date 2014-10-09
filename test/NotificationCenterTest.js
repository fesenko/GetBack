define(['core/NotificationCenter', 'core/News', 'core/Channel'], function(NotificationCenter, News, Channel) {
    "use strict";

    suite('NotificationCenter', function() {
        setup(function() {
            var now = Date.now();
            this.noticeCount = 0;

            var center = new NotificationCenter({
                timeout: 70,
                displayTime: 50,
                maxNoticeCount: 2
            });

            center.on('notification', function(notice) {
                this.noticeCount++;
            }.bind(this));

            this.center = center;

            this.channels = [
                new Channel({
                    src: 'fixtures/channel',
                    title: 'Новости Mail.ru'
                }),
                new Channel({
                    src: 'fixtures/channel1',
                    title: 'Новости Lenta.ru'
                }),
                new Channel({
                    src: 'fixtures/channel2',
                    title: 'Новости rbc.ru'
                })
            ];

            this.news = [
                new News({
                    date: now,
                    link: 'http://news.sportbox.ru/Vidy_sporta/Futbol/Evropejskie_chempionaty/Germaniya/spbnews_NI419355_Riberi-podozrevaet-chto-FIFA-o',
                    title: 'Рибери подозревает, что ФИФА отдаст «Золотой мяч» Роналду'
                }),
                new News({
                    date: now,
                    link: 'http://news.mail.ru/inregions/moscow/90/economics/15836944/?frommail=1',
                    title: 'А ну-ка, убери свой чемоданчик!'
                }),
                new News({
                    date: now,
                    link: 'http://sport.rbc.ru/article/192776/',
                    title: '«Зенит» заработал в Лиге чемпионов больше «Барселоны»'
                })
            ];
        });

        test('create', function() {
            assert.ok(this.center);
        });

        test('one news', function(done) {
            var self = this;
            var channel = this.channels[0];

            async(100, done, [
                function() {
                    self.center.add(channel, self.news.slice(0,1));
                },
                function() {
                    assert.equal(self.noticeCount, 1);
                }
            ]);
        });

        test('few news one channel', function(done) {
            var self = this;
            var news = this.news;
            var center = this.center;
            var channel = this.channels[0];
            var addNews = center.add.bind(center, channel);

            async(100, done, [
                function() {
                    addNews(news.slice(0, 2), 'two news at once');
                },
                function() {
                    assert.equal(self.noticeCount, 2);
                    addNews(news, 'three news at once');
                },
                function() {
                    assert.equal(self.noticeCount, 3);
                    addNews(news.slice(0, 1), 'one news');
                    return { timeout: 50 }
                },
                function() {
                    addNews(news.slice(1), 'another news');
                },
                function() {
                    assert.equal(self.noticeCount, 4);
                }
            ]);
        });

        test('few channels', function(done) {
            var channels = this.channels;
            var center = this.center;
            var news = this.news;
            var self = this;

            async(80, done, [
                function() {
                    center.add(channels[0], news.slice(0,1));
                    return { timeout: 50 };
                },
                function() {
                    center.add(channels[1], news.slice(1,2));
                    return { timeout: 50 };
                },
                function() {
                    center.add(channels[2], news.slice(2));
                    assert.equal(self.noticeCount, 0);
                },
                function() {
                    assert.equal(self.noticeCount, 1);
                },
                function() {
                    assert.equal(self.noticeCount, 2);
                },
                function() {
                    assert.equal(self.noticeCount, 3);
                }
            ]);
        });
    });
});
