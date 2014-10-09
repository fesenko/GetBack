mocha.setup('tdd');
window.assert = chai.assert;

require([
    '../js/utils/array',
    '../test/NewsTest',
    '../test/ChannelTest.js',
    //'../test/ObserverTest.js',
    '../test/FeedParserTest.js',
    '../test/RssFeedParserTest.js',
    '../test/AtomFeedParserTest.js',
    '../test/ChannelListTest.js',
    '../test/SubsCheckerTest.js',
    '../test/NotificationCenterTest.js',
    '../test/i18nTest.js'
], function(array) {

    this.async = function(timeout, callback, operations) {
        array.asyncForeach(operations, function(operation, index, next_operation) {
            var delay = (operation() || {}).timeout;
            setTimeout(next_operation, delay != null ? delay : timeout);
        }, function() {
            callback();
        });
    };

    mocha.ignoreLeaks();
    mocha.run();
});
