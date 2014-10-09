define('utils/Cache', [], function() {
    "use strict";

    /**
     * Кэш данных.
     *
     * @constructor
     * @class
     *
     * @example
     * var cache = new utils.Cache();
     * cache.set("foo", "Bar");
     * cache.get("foo");
     * // -> "Bar"
     *
     * cache.has("foo");
     * // -> true
     *
     * cache.hasNot("baz");
     * // -> true
     *
     * cache.remove("foo");
     * cache.has("foo");
     * // -> false
     *
     */
    function Cache() {
        // объект для хранения данных
        this.data = {};
    };

    Cache.prototype = {
        /**
         * Возвращает данные из кэша.
         * @param {String} key уникальный ключ
         * @return {Object | undefined} данные из кэша
         */
        get: function(key) {
            return this.data[key] || null;
        },

        /**
         * Помещает данные в кэш или удаляет, если value undefined или null.
         * @param {String} key уникальный ключ
         * @param {Object} value объект
         * @return {Object} объект помещенный в кэш
         */
        set: function(key, value) {
            if (value == null) {
                this.remove(key);
                return value;
            }

            return this.data[key] = value;
        },

        /**
         * Помещает данные в кэш, если значение в кеше не найдено.
         * @param {String} key уникальный ключ
         * @param {Function} callback возвращает новое значение
         * @return {Object} объект помещенный в кэш
         */
        setIfNot: function(key, callback) {
            if (this.hasNot(key)) {
                return this.set(key, callback());
            }

            return this.get(key);
        },

        /**
         * Проверяет, что данные содержатся в кэше.
         * @param {String} key уникальный ключ
         * @return {Boolean} результат проверки
         */
        has: function(key) {
            return this.data[key] !== undefined;
        },

        /**
         * Проверяет, что данные отсутствуют в кэше.
         * @param {String} key уникальный ключ
         * @return {Boolean} результат проверки
         */
        hasNot: function(key) {
            return !this.has(key);
        },

        /**
         * Удаляет данные из кэша.
         * @param {String} key уникальный ключ
         */
        remove: function(key) {
            delete this.data[key];
        },

        /**
         * Очищает кэш.
         */
        clear: function() {
            this.data = {};

            return this;
        },

        /**
         * Перебирает все сохраненные данные.
         */
        each: function(callback) {
            var data = this.data;

            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    callback(key, data[key], this);
                }
            }

            return this;
        },

        getThenRemove: function(key) {
            var value = this.get(key);

            if (value !== null) {
                this.remove(key);
            }

            return value;
        }
    };

    return Cache;
});
