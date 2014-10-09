define(['i18n'], function(i18n) {
    "use strict";

    suite('i18n', function() {
        test('create', function() {
            assert.ok(i18n);
        });

        test('replaceNode', function() {
            var div = document.createElement(div);

            div.innerHTML = '<span>__MSG_settings__</span><b>Hello</b>';

            i18n.replaceNode(div);

            assert.equal(div.innerHTML, '<span>Настройки</span><b>Hello</b>');
        });
    });
});
