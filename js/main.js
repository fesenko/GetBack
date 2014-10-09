require(['App'], function(App) {
    var chromeTabs = chrome.tabs;
    window.app = new App();

    chromeTabs.query({}, function(tabs) {
        tabs.forEach(function(tab) {

            'js/content/inspector.js js/content/overlay.js js/content/stripe.js'.split(' ').forEach(function(file) {
                chromeTabs.executeScript(tab.id, {file: file});
            });

        });
    });
});

