define(['core/News'], function(News) {
    "use strict";

    suite('News', function() {
        setup(function() {
            this.news = new News();
        });

        test('create', function() {
            assert.ok(this.news);
        });
    });
});
