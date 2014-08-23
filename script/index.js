//
//
//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//
//
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//               佛祖保佑         永无BUG
//
//
//      PKUSPOT.ORG
//      Kyle He (admin@hk1229.cn)
//      2014/08/23 15:27
//
//
(function($) {
    /**
     * Body Handler
     * @type {jQueryElements}
     */
    var $body = $('body');

    /**
     * 是否为移动设备
     * @type {Boolean}
     */
    var isMobileDevice = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
    window['mobile'] = isMobileDevice;

    /**
     * Left Logo Handler
     * @type {jQueryElements}
     */
    var $logo = $('.big-logo');
    /**
     * Left Logo Classname
     * @type {String}
     */
    var showClassName = 'show-qrcode';
    /**
     * 微信图标与左侧二维码联动
     */
    $('.icon.weixin').hover(function() {
        $logo.addClass(showClassName);
    }, function() {
        $logo.removeClass(showClassName);
    });

    /**
     * 为移动设备添加标志
     * 为PC平台绑定浮层
     */
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

    /**
     * 最新一集 Podcast HTML 模版
     * @type {string}
     */
    var podcast_tpl = $('#js-latest-podcast-tpl').html();
    /**
     * Podcast 列表 HTML 模版
     * @type {string}
     */
    var all_podcasts_tpl = $('#js-all-podcasts-tpl').html();
    /**
     * 格式化日期
     * @param  {stirng} pubdate 通用时间格式字符串
     * @return {string}         
     */
    function formatDate(pubdate) {
        var pd = new Date(pubdate);
        var td = new Date();
        var diff = (td.getTime() - pd.getTime()) / 1000;
        if (diff / 3600 / 24 > 99) {
            return (pd.getMonth() + 1) + '月' + pd.getDate() + '日';
        } else if (diff / 3600 / 24 >= 1) {
            return Math.round(diff / 3600 / 24) + '天前';
        } else if (diff / 3600 >= 1) {
            return Math.round(diff / 3600) + '小时前';
        } else if (diff / 60 >= 1) {
            return Math.round(diff / 60) + '分钟前';
        } else {
            return Math.round(diff) + '秒前';
        }
    }
    /**
     * 渲染 Podcast 播放器
     * @param  {Object} data Podcast 数据
     * @return 
     */
    function renderPodcastPlayer(data) {
        $('#js-latest-podcast').html(Mustache.render(podcast_tpl, data));
    }
    /**
     * 获取最新一期数据
     */
    $.get('api/get-last-program.php', function(xhr) {
        xhr.pubdate = formatDate(xhr.pubdate);
        renderPodcastPlayer(xhr);
        $('.latest-podcast').slideDown();
    });

    /**
     * Podcast 列表是否已经加载
     * @type {Boolean}
     */
    var isAllPodcastsLoaded = false;

    /**
     * Podcast 列表数据
     * @type {Object}
     */
    var podcastsData;

    /**
     * 渲染 Podcast 列表
     * @return 
     */
    function renderAllPodcasts() {
        if (!isAllPodcastsLoaded) {
            $.get('api/get-all-programs.php', function(xhr) {
                for (var i = 0; i < xhr.length; i++) {
                    xhr[i]['id'] = i + 1;
                    xhr[i]['pubdate'] = formatDate(xhr[i]['pubdate']);
                }
                $('#js-all-podcasts').html(Mustache.render(all_podcasts_tpl, {
                    'podcasts': xhr
                }));
                podcastsData = xhr;
            });
            isAllPodcastsLoaded = true;
        }
    }

    var hashPrefix = '#!/';
    /**
     * 右侧栏Hash标志
     * @type {String}
     */
    var rightBannerHashTag = 'right-banner';
    /**
     * 右侧栏打开/关闭按钮
     * @return 
     */
    function toggleRightBanner() {
        var hash = location.hash.substr(hashPrefix.length);
        if (hash.indexOf(rightBannerHashTag) >= 0) {
            $body.addClass('show-banner');
        } else {
            $body.removeClass('show-banner');
        }
        if ($body.hasClass('show-banner')) {
            renderAllPodcasts();
        }
    }
    /**
     * 获取目标Hash
     * @return {string}
     */
    function getRightBannerToggleSwitchBtnHref() {
        return hashPrefix + (location.hash.indexOf(rightBannerHashTag) >= 0 ? '' : rightBannerHashTag);
    }
    window['getRightBannerToggleSwitchBtnHref'] = getRightBannerToggleSwitchBtnHref;
    
    $('.right-banner-toggle-switch-btn').click(function(event) {
        $(this).attr('href', getRightBannerToggleSwitchBtnHref());
    });

    toggleRightBanner();
    $(window).hashchange(toggleRightBanner);
    
    /**
     * 右侧边栏
     * @type {jQueryElements}
     */
    var $rightVerticalBanner = $('.right-vertical-banner');
    $rightVerticalBanner.delegate('.podcast-list-play-btn', 'click', function(event) {
        event.preventDefault();
        var id = parseInt($(this).data('id'), 10) - 1;
        if (podcastsData[id]) {
            podcastsData[id]['autoplay'] = true;
            renderPodcastPlayer(podcastsData[id]);
        }
        $('.latest-podcast .title span').html('第 ' + (podcastsData.length - id) + ' 期');
    }).delegate('.banner-navi-podcast-btn', 'click', function(event) {
        event.preventDefault();
        $rightVerticalBanner.removeClass('show-help').addClass('show-podcast-list');
    }).delegate('.banner-navi-help-btn', 'click', function(event) {
        event.preventDefault();
        $rightVerticalBanner.removeClass('show-podcast-list').addClass('show-help');
    });

})(jQuery);


// 绑定快捷键
(function($, T) {
    // 右侧栏
    T.bind(['i', 'I'], function() {
        location.hash = getRightBannerToggleSwitchBtnHref();
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



/**
 * 百度分享参数
 * @type {Object}
 */
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

