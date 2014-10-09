(function(window, document) {
    var elemId = '__nr-bar__container';
    var closeBtnId = '__nr-bar__close';
    var subBtnId = '__nr-bar__sub';
    var runtime = chrome.runtime;

    function getStripe() {
        return document.getElementById(elemId);
    }

    function getStripeHtml(host, offer) {
        return '<div id="' + elemId + '" class="__nr-bar__container">' +
                    '<span class="__nr-bar__caption">' + offer.question + ' ' + host + '?</span>' +
                    '<button id="' + subBtnId + '" class="__nr-bar__button">' + offer.yes + '</button>' +
                    '<a id="' + closeBtnId + '" href="#" class="__nr-bar__close">' + offer.no + '</a>' +
               '</div>';
    }

    function createStripe(channel, offer) {
        var stripe = getStripe();

        if (!stripe) {
            document.body.insertAdjacentHTML('afterbegin', getStripeHtml(channel.host, offer));

            runtime.sendMessage({message: 'show-offer'});

            var closeBtn = document.getElementById(closeBtnId);

            closeBtn.onclick = function() {
                runtime.sendMessage({
                    message: 'reject-stripe',
                    data: channel
                });
                destroyStripe();
            };

            var subBtn = document.getElementById(subBtnId);

            subBtn.onclick = function() {
                runtime.sendMessage({
                    message: 'subscribe',
                    target: 'stripe',
                    data: channel
                });
                destroyStripe();
            };
        }
    }

    function destroyStripe() {
        var stripe = getStripe();

        stripe.parentNode.removeChild(stripe);
    }

    runtime.onMessage.addListener(function(request) {
        if (request.message == 'show-stripe') {
            var channel = request.data;
            var offer = request.offer;

            createStripe(channel, offer);
        }
    });
})(window, document);