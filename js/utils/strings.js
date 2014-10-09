define(function() {
    "use strict";

    var EMPTY = '';
    var FormatRegexp = /\{(\w+)\}/g;

    var strings = {
        guid: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },

        format: function(format, data) {
            return format.replace(FormatRegexp, function(_, expr) {
                return data.hasOwnProperty(expr) ? data[expr] : EMPTY;
            });
        },

        plural: (function() {
            function format(num, form, html) {
                return strings.format(form, { n: (html ? '<span>' + num + '</span>' : num) });
            }

            return function(num, forms, html) {
                var res = 2;
                var num_10 = num % 10;
                var num_100 = num % 100;

                if (num == 0) {
                    // если задана форма для нулевого значения, то выводим только его
                    if (forms[3]) {
                        res = 3;
                    }
                } else {
                    if (num_100 < 5 || num_100 > 20) {
                        if (num_10 == 1) {
                            res = 0;
                        } else {
                            if (num_10 >= 2 && num_10 <= 4) {
                                res = 1;
                            }
                        }
                    }
                }

                return format(num, forms[res], html);
            };
        })()
    };

    return strings;
});
