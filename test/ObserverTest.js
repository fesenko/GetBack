define(['core/Observer', 'utils/array'], function(Observer, array) {
    "use strict";

    var tabs = chrome.tabs;

    suite('Observer', function() {
        setup(function() {
            this.observer = new Observer();
        });

        teardown(function() {
            this.observer.destroy();
        });

        test('create', function() {
            assert.ok(this.observer);
        });

        test('listen', function(done) {
            var observer = this.observer;
            var resource;
            var tabId;

            observer.on('resource-activated', function(res) {
                resource = res;
                //console.log(resource.channels());
            });

            function createTab(url, callback) {
                tabs.create({
                    url: url
                }, function(tab) {
                    tabId = tab.id;
                    callback();
                    /*if (tab.status === 'loading') {
                        tabId = tab.id;
                        callback();
                    }*/
                });
            }

            /*async(120, done, [
                function() {
                    observer.listen();
                    createTab(chrome.extension.getURL('/test/fixtures/mail.ru.html'));
                },
                function() {
                    //assert.equal(resource.channels().length, 0);
                    tabs.remove(tabId);
                    createTab(chrome.extension.getURL('/test/fixtures/lenta.ru.html'));
                },
                function() {
                    //assert.equal(resource.channels().length, 1);
                    //assert.equal(resource.icon, 'http://icdn.lenta.ru/lenta_touch.png');
                    tabs.remove(tabId);
                }
            ]);*/

            var tests = [
                function(next_cb) {
                    observer.listen();
                    createTab('file:///Users/fesenko/extensions/GetBack.to/test/fixtures/lenta.ru.html', next_cb);
                },
                function(next_cb) {
                    //assert.equal(resource.channels().length, 0);
                    tabs.remove(tabId);
                    next_cb();
                }
            ];

            array.asyncForeach(tests, function(item, index, next_cb) {
                item(function() { setTimeout(next_cb, 1800); });
            }, done);



        });
    });
});

