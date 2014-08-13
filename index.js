(function($) {

    // 微信图标与左侧二维码联动
    var $logo = $('.big-logo');
    var showClassName = 'show-qrcode';
    $('.icon.weixin').hover(function() {
        $logo.addClass(showClassName);
    }, function() {
        $logo.removeClass(showClassName);
    });

    // 捐赠浮层
    $('.icon.alipay a').fancybox({
        width: 420,
        height: 300,
        type: 'iframe'
    });

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