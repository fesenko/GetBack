define(['zepto'], function($) {
    "use strict";

    var getMessage = chrome.i18n.getMessage;
    var REGEX_I18N_MSG = /__MSG_([a-zA-Z0-9_]+)__/g;

    var i18n = {
        m: getMessage,

        ma: function(key) {
            var message = this.m(key) || '';

            return message.split(/\s*\|\s*/);
        },

        replaceNode: function(node) {
            var walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);

            while (walker.nextNode()) {
                var node = walker.currentNode;
                var text = node.data;;
                var is_replaced = false;

                text = text.replace(REGEX_I18N_MSG, function(_, key) {
                    is_replaced = true;

                    return getMessage(key);
                });

                if (is_replaced) {
                    var replacementNode = document.createTextNode(text);

                    node.parentNode.replaceChild(replacementNode, node);

                    walker.currentNode = replacementNode;
                }
            }

        },

        replacePage: function() {
            var title = document.getElementsByTagName('title')[0];

            if (title) {
                this.replaceNode(title);
            }

            this.replaceNode(document.body);
        },

        localizePage: function() {
            $(function() {
                i18n.replacePage();
                $('body').addClass('done');
            });
        }
    };

    return i18n;
});
