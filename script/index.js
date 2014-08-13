(function($) {

    /**
     * 是否为移动设备
     * @type {Boolean}
     */
    var isMobileDevice = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));

    // 微信图标与左侧二维码联动
    var $logo = $('.big-logo');
    var showClassName = 'show-qrcode';
    $('.icon.weixin').hover(function() {
        $logo.addClass(showClassName);
    }, function() {
        $logo.removeClass(showClassName);
    });

    // PC平台出浮层
    if (!isMobileDevice) {
        $('.icon.alipay a').fancybox({
            width: 420,
            height: 300,
            type: 'iframe'
        });
        $('#js-podcast-more-btn').fancybox({
            type: 'iframe'
        });
    }

    // 最新一集
    var podcast_tpl = $('#js-latest-podcast-tpl').html();
    var getDateAndTime = function(pubdate) {
        var d = new Date(pubdate);
        return {
            'year': d.getFullYear(),
            'month': d.getMonth() + 1,
            'day': d.getDate(),
            'hour': d.getHours()
        };
    };
    $.get('api/get-last-program.php', function(xhr) {
        xhr.pubdate = getDateAndTime(xhr.pubdate);
        $('#js-latest-podcast').html(Mustache.render(podcast_tpl, xhr));
        $('.latest-podcast').slideDown();
    });

})(jQuery);