define(['zepto'], function($) {
    var attendance = {};
    var storageKey = 'attendance';
    var storageLocal = chrome.storage.local;

    storageLocal.get(storageKey, function(data) {
        attendance = data[storageKey] || {};
    }.bind(this));

    function save() {
        storageLocal.set({'attendance': attendance});
    }

    function getData(host) {
        var data = attendance[host];

        if (data == null || !$.isPlainObject(data)) {
            attendance[host] = { visits: 0 };
        }

        return attendance[host];
    }

    function isCurrentDay(ts) {
        if (!ts) {
            return false;
        }

        var date = new Date(ts);
        var now = new Date();

        return date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear();
    }

    return {
        resetVisits: function(host) {
            if (!host) return;

            var data = getData(host);

            data.visits = 0;
            data.reject = false;
            save();
        },

        rejectOffer: function(host) {
            if (!host) return;

            var data = getData(host);

            data.reject = true;
            save();
        },

        needOffer: function(host) {
            var need = false;
            var data = getData(host);

            if (data.reject || isCurrentDay(data.ts)) {
                return false;
            } else {
                ++data.visits;
                data.ts = Date.now();
                save();

                return data.visits > 3;
            }
        }
    }
});