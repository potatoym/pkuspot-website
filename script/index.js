
// Main
(function($) {

    var $body = $('body');

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
    if (isMobileDevice) {
        $body.addClass('mobile');
    } else {
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
    var all_podcasts_tpl = $('#js-all-podcasts-tpl').html();
    function getDateAndTime(pubdate) {
        /*var d = new Date(pubdate);
        return {
            'year': d.getFullYear(),
            'month': d.getMonth() + 1,
            'day': d.getDate(),
            'hour': d.getHours()
        };*/
        var pd = new Date(pubdate);
        var td = new Date();
        var diff = (td.getTime() - pd.getTime()) / 1000;
        if (diff / 3600 / 24 > 99) {
            return (pd.getMonth() + 1) + '月' + pd.getDate() + '日';
        } else if (diff / 3600 / 24 > 1) {
            return Math.round(diff / 3600 / 24) + '天前';
        } else if (diff / 3600 > 1) {
            return Math.round(diff / 3600) + '小时前';
        } else if (diff / 60 > 1) {
            return Math.round(diff / 60) + '分钟前';
        } else {
            return Math.round(diff) + '秒前';
        }
    }
    function renderPodcastPlayer(data) {
        $('#js-latest-podcast').html(Mustache.render(podcast_tpl, data));
    }
    $.get('api/get-last-program.php', function(xhr) {
        xhr.pubdate = getDateAndTime(xhr.pubdate);
        renderPodcastPlayer(xhr);
        $('.latest-podcast').slideDown();
    });

    // 全部Podcast
    var isAllPodcastsLoaded = false;
    var podcastsData;
    function renderAllPodcasts() {
        if (!isAllPodcastsLoaded) {
            $.get('api/get-all-programs.php', function(xhr) {
                for (var i = 0; i < xhr.length; i++) {
                    xhr[i]['id'] = i + 1;
                    xhr[i]['pubdate'] = getDateAndTime(xhr[i]['pubdate']);
                }
                $('#js-all-podcasts').html(Mustache.render(all_podcasts_tpl, {
                    'podcasts': xhr
                }));
                podcastsData = xhr;
            });
            isAllPodcastsLoaded = true;
        }
    }

    // 打开右侧栏按钮
    var isRightBannerShowing = false;
    var rightBannerShowingAnimateTimer;
    $('.banner-switch-btn').click(function(event) {
        event.preventDefault();
        clearTimeout(rightBannerShowingAnimateTimer);
        if (!isRightBannerShowing) {
            $body.removeClass('hiding-banner');
            $body.addClass('show-banner');
            renderAllPodcasts();
        } else {
            $body.addClass('hiding-banner');
            rightBannerShowingAnimateTimer = setTimeout(function() {
                $body.removeClass('show-banner hiding-banner');
            }, 500);
        }
        isRightBannerShowing = !isRightBannerShowing;
    });
    $('.all-podcasts').delegate('.podcast-list-play-btn', 'click', function(event) {
        event.preventDefault();
        var id = parseInt($(this).data('id'), 10) - 1;
        if (podcastsData[id]) {
            podcastsData[id]['autoplay'] = true;
            renderPodcastPlayer(podcastsData[id]);
        }
        $('.latest-podcast .title span').html('第 ' + (podcastsData.length - id) + ' 期');
    });

})(jQuery);



// 绑定快捷键
(function($, T) {
    // 右侧栏
    T.bind(['i', 'I'], function() {
        $('.banner-switch-btn').click();
    });

    // Podcast 播放器
    function getPlayer() {
        return $('.podcast-player audio').get(0);
    }
    // 播放
    T.bind(['p', 'P'], function() {
        var player = getPlayer();
        player && player[ player.paused ? 'play' : 'pause' ]();
    });
    // 调速
    function setPlayerSpeed(speed, opt_is_relative) {
        if ((!opt_is_relative && speed < .5) || speed > 2) {
            return ;
        }
        var player = getPlayer();
        if (!player) {
            return ;
        }
        if (opt_is_relative) {
            player.playbackRate += speed;
        } else {
            player.playbackRate = speed;
        }
    }
    T.bind(['=', '+'], function() {
        setPlayerSpeed(.1, true);
    });
    T.bind(['-', '_'], function() {
        setPlayerSpeed(-.1, true);
    });
    T.bind('0', function() {
        setPlayerSpeed(1);
    });
    // 快进/后退
    function setPlayerCurrentTime(time, opt_is_relative) {
        var player = getPlayer();
        if (!player) {
            return ;
        }
        if ((!opt_is_relative && time < 0) || time > player.duration) {
            return ;
        }
        if (opt_is_relative) {
            player.currentTime += time;
        } else {
            player.currentTime = time;
        }
    }
    T.bind('[', function() {
        setPlayerCurrentTime(-5, true);
    });
    T.bind(']', function() {
        setPlayerCurrentTime(5, true);
    });
    T.bind('{', function() {
        setPlayerCurrentTime(-30, true);
    });
    T.bind('}', function() {
        setPlayerCurrentTime(30, true);
    });
    // 静音
    T.bind(['m', 'M'], function() {
        var player = getPlayer();
        player && (player.muted = !player.muted);
    });

})(jQuery, Mousetrap);



// 百度分享参数
window._bd_share_config = {
    "common": {
        "bdSnsKey": {},
        "bdText": "",
        "bdMini": "1",
        "bdMiniList": false,
        "bdPic": "",
        "bdStyle": "0",
        "bdSize": "16"
    },
    "share": {}
};