var root = '/';
var vendors = root + 'vendors';

var require = {
    baseUrl: root + 'js',
    paths: {
        knockout: vendors + '/knockout-3.0.0',
        zepto: vendors + '/zepto.min',
        storage: root + 'js/utils/storage',
        i18n: root + 'js/utils/i18n'
    },
    shim: {
        zepto: {
            exports: '$'
        },
        storage: {
            exports: 'storage'
        }
    }
};