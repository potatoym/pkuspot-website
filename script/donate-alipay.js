var timer;
var $msg = $('#msg-container');
var client = new ZeroClipboard($('.zclip-button').get(0));
client.on('ready', function(event) {
    client.on('aftercopy', function(event) {
        clearTimeout(timer);
        $msg.fadeIn();
        timer = setTimeout(function() {
            $msg.fadeOut();
        }, 5000);
    });
});