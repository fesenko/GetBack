define(['utils/strings'], function(strings) {

    function News(data) {
        data = data || {};
        this.date = data.date;
        this.link = data.link;
        this.title = data.title;
        this.message = data.message;
        this.id = data.id || strings.guid();
        this.iconUrl = data.icon || News.DEFAULT_ICON;
    };

    News.DEFAULT_ICON = '/images/128/loop_gray.png';

    News.prototype = {
        get icon() {
            return this.iconUrl;
        },
        set icon(iconUrl) {
            this.iconUrl = iconUrl;
        }
    };

    News.create = function(data) {
        return new News(data);
    };

    return News;
});

