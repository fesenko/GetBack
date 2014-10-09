define(function() {
    window._gaq = window._gaq || [];

    var _gaq = window._gaq;

    _gaq.push(['_setAccount', 'UA-47178812-1']);

    function trackEvent(category, action) {
        _gaq.push(['_trackEvent', category, action]);
    }

    return {
        showNotification: function() {
            trackEvent('notify', 'show');
        },

        clickNotification: function() {
            trackEvent('notify', 'click');
        },

        subscription: function() {
            trackEvent('button', 'subs');
        },

        showOffer: function() {
            trackEvent('stripe', 'show');
        },

        acceptOffer: function() {
            trackEvent('stripe', 'subs');
        },

        rejectOffer: function() {
            trackEvent('stripe', 'no');
        }
    }
});
