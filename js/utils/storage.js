(function(exports) {
    var storage = {
        get: function(key) {
            var value = null;

            if (key in localStorage) {
                try {
                    value = JSON.parse(localStorage[key]);
                } catch(ex) {}
            }

            return value;
        },

        set: function(key, value) {
            localStorage[key] = JSON.stringify(value);
        },

        has: function(key) {
            return key in localStorage;
        },

        remove: function(key) {
            localStorage.removeItem(key);
        }
    };

    exports.storage = storage;
})(window);


