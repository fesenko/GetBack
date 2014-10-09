define('utils/emitter', [], function() {
    "use strict";

    /*
     * Emitter
     * Добавляет к экземпляру класса возможность подписываться на сообщения от экземпляра.
     * Позволяет разделить обработчики ответов.
     *
     * Пример:
     *   http.get(url, function(res) {
     *      console.log(res);
     *   }).on('error', function(err) {
     *      console.log(err);
     *   });
     *
     *   var HTTP = function() {
     *      utils.emitter(this); // <-- необходимый вызов для подключения функций
     *
     *      this.get = function(url, callback) {
     *          var self = this;
     *
     *          this.getAsync(url, function(error, result) {
     *              if (error) {
     *                  self.emit('error', error, result, someParam); // <-- эмитирует ошибку, callback не будет вызван
     *              } else {
     *                  callback(result);
     *              }
     *          });
     *
     *          return this; // <-- необходимо возвращать себя
     *      };
     *   };
     */
    var emitter = function(instance, types) {
        types = types || [];
        var typesLength = types.length;

        return (function() {
            var listeners = {};

            function isSameCallback(listener, callback) {
                if (listener === callback) {
                    return true;
                }

                if (listener) {
                    var originalCallback = listener.__emitter__originalCallback;

                    if (originalCallback) {
                        return originalCallback === callback;
                    }
                }

                return false;
            }

            function getListenersByType(type) {
                if (!listeners[type]) {
                    listeners[type] = [];
                }

                return listeners[type];
            }

            function checkEmitType(type) {
                for (var i = 0; i < typesLength; i++) {
                    var testType = types[i];

                    if (testType === type) { // string
                        return false;
                    } else if (testType.test && testType.test(type)) { // regexp
                        return false;
                    }
                }

                return true;
            }

            /**
             * Посылает сообщение.
             * @param {String} type Тип сообщения.
             * @param {...*} args Параметры сообщения.
             */
            this.emit = function(type /* args */) {
                if (types !== '*' && checkEmitType(type)) {
                    try {
                        var klass = this.constructor.name;
                        var message = 'utils.emitter: ' + klass + ' - unknown emit type "' + type + '". ';

                        if (types.length === 0) {
                            message += 'Types list not defined.';
                        } else {
                            message += 'Known types are: "' + types.join(', ') + '".';
                        }

                        throw new Error(message);
                    } catch (e) {
                        if (emitter.strict) {
                            throw e;
                        } else {
                            console.warn(e.message);
                        }
                    }
                }

                var len = arguments.length - 1;
                var args = new Array(len);

                for (var i = 0; i < len; i++) {
                    args[i] = arguments[i + 1];
                }

                getListenersByType(type).forEach(function(listener) {
                    listener && listener.apply(null, args);
                });
            };

            /**
             * Подписывается на сообщение.
             * @param {String} type Тип сообщения.
             * @param {Function} callback Функция-обработчик сообщения.
             * @return {this}
             */
            this.on = function(type, callback) {
                getListenersByType(type).push(callback);

                return this;
            };

            /**
             * Подписывается на сообщение и удаляет обработчик из подписчиков.
             * @param {String} type Тип сообщения.
             * @param {Function} callback Функция-обработчик сообщения.
             * @return {this}
             */
            this.once = function(type, callback) {
                var self = this;

                function inner() {
                    self.off(type, inner);
                    callback.apply(null, arguments);
                }

                inner.__emitter__originalCallback = callback;

                getListenersByType(type).push(inner);

                return this;
            };

            /**
             * Отписывается от приема сообщений.
             * @param {String?} type Тип сообщения.
             * @param {Function?} callback Функция-обработчик сообщения.
             * @return {this}
             */
            this.off = function(type, callback) {
                if (type === undefined) {
                    listeners = {};
                } else if (typeof callback !== 'function') {
                    listeners[type] = [];
                } else {
                    getListenersByType(type).forEach(function(listener, i, listeners) {
                        if (isSameCallback(listener, callback)) {
                            listeners[i] = null;
                        }
                    });
                }

                return this;
            };

            /**
             * Проверяет, что есть подписчик на прием сообщений.
             * @param {String} type Тип сообщения.
             * @param {Function} callback Функция-обработчик сообщения.
             * @return {Boolean}
             */
            this.has = function(type, callback) {
                return getListenersByType(type).some(function(listener) {
                    return isSameCallback(listener, callback);
                });
            };

            return this;

        }).call(instance);
    };

    // Строгий режим: при проверках выдает исключение
    emitter.strict = false;

    return emitter;
});
