define(function() {
    "use strict";

    return {
        /**
         * Обрабатывает каждый элемент массива асинхронно, сохраняя при этом последовательность обработки.
         * @param {Array} items Массив.
         * @param {Function} item_callback Обработчик элемента.
         * @param {Function?} final_callback Финальный обработчик.
         * @example
         * asyncForeach([1, 2, 3], function(item, index, next_cb) {
         *     console.log(item);
         *     setTimeout(next_cb, 100);
         * }, function() {
         *     console.log('end');
         * });
         *
         * => 1
         * => 2
         * => 3
         * => "end"
         */
        asyncForeach: function(items, item_callback, final_callback) {
            var index = 0;
            var len = items.length;

            function inner() {
                if (index === len) {
                    if (final_callback instanceof Function) {
                        final_callback();
                    }
                    return;
                }
                item_callback(items[index], index++, inner);
            }

            inner();
        },

        toArray: function(value) {
            var type = ({}).toString.call(value).slice(8, -1);

            switch (type) {
                case 'Arguments':
                    return Array.prototype.slice.call(value);
                case 'Array':
                    return value;
                default:
                    return [value];
            }
        }
    };
});

