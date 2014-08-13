(function($, M) {

    function getDateAndTime(pubdate) {
        var d = new Date(pubdate);
        return {
            'year': d.getFullYear(),
            'month': d.getMonth() + 1,
            'day': d.getDate(),
            'hour': d.getHours()
        };
    }

    function renderPodcastList(data) {
        $podcastList.html(M(podcastListTpl, {
            'podcasts' : data
        }));
    }

    function renderPodcastPlayer(data) {
        $player.html(M(playerTpl, data));
    }

    function playPodcastById(id) {
        if (!podcastData[id]) return -1;
        renderPodcastPlayer(podcastData[id]);
        checkAudioPlayerCompatibility();
        currentPlayingPodcastId = id;
        return id;
    }

    function checkAudioPlayerCompatibility() {
        var $audio = $('#js-audio-player');
        if (!$audio.get(0).play) {
            $player.html($('#js-upgrade-browser-message-tpl').html());
        }
    }

    var podcastData;
    var currentPlayingPodcastId = -1;

    var playerTpl = $('#js-player-tpl').html();
    var podcastListTpl = $('#js-podcast-list-tpl').html();

    var $player = $('#js-player');
    var $podcastList = $('#js-podcast-list');
    var $filterText = $('#js-podcast-filter-text');
    var $filterButton = $('#js-podcast-filter-button');

    $.get('api/get-all-programs.php').then(function(xhr) {
        podcastData = xhr;
        for (var i = podcastData.length - 1; i >= 0; i--) {
            podcastData[i]['id'] = i;
            podcastData[i]['pubdate'] = getDateAndTime(podcastData[i]['pubdate']);
        };
        renderPodcastList(podcastData);
    });

    $filterButton.click(function() {
        var pattern = $.trim($filterText.val());
        var matched = [];
        var current;
        for (var i = 0; i < podcastData.length; i++) {
            current = podcastData[i];
            if (current['title'].indexOf(pattern) >= 0
             || current['description'].indexOf(pattern) >= 0) {
                matched.push(current);
            }
        };
        renderPodcastList(matched);
    });

    $filterText.keydown(function(evt) {
        if (evt.keyCode === 13) {
            $filterButton.click();
        }
    });

    
    $('body').delegate('.podcast-item', 'click', function() {
        var id = $(this).data('id');
        playPodcastById(parseInt(id, 10));
    });

})(jQuery, Mustache.render);