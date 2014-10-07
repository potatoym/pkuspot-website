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
//      
//      Background Canvas
//      
//      Kyle He (admin@hk1229.cn)
//      2014/10/08 02:33
//
//
(function(win, doc, $) {
    var $canvas = $('#canvas-background');
    var canvas = $canvas.get(0);
    if (!canvas || !canvas.getContext || !win.requestAnimationFrame) return ;

    var canvasSize = {};
    resizeCanvas();
    $(window).resize(resizeCanvas);

    var context = canvas.getContext('2d');
    var animateTimer;
    var points = [];

    $(doc).on('click touchend', function(evt) {
        if (!points.length) {
            startAnimate();
        }
        var point = {
            r: rand(4, 20),
            c: getRandomColor(),
            t: (new Date()).getTime()
        };
        if (evt.type == 'touchend') {
            evt = evt.originalEvent;
            evt = (evt.changedTouches || evt.touches)[0];
        }
        point.x = evt.clientX;
        point.y = evt.clientY;
        points.push(point);
        // console.log(point);
    });

    function animate() {
        context.clearRect(0, 0, canvasSize.width, canvasSize.height);
        if (!points.length) {
            stopAnimate();
            return ;
        }
        var diffSeconds = 4444;
        var deadline = (new Date()).getTime() - diffSeconds;
        var i, point, opacity;
        for (i = points.length - 1; i >= 0; --i) {
            point = points[i];
            if (point.t < deadline) {
                points.splice(0, i + 1);
                break;
            }
            opacity = (point.t - deadline) / diffSeconds;
            context.fillStyle = 'rgba(' + point.c + ',' + opacity + ')';
            context.beginPath();
            context.arc(point.x, point.y, point.r, 0, Math.PI * 2);
            context.closePath();
            context.fill();
        }

        animateTimer = requestAnimationFrame(animate);
    }

    function startAnimate() {
        stopAnimate();
        animateTimer = requestAnimationFrame(animate);
    }

    function stopAnimate() {
        cancelAnimationFrame(animateTimer);
    }

    function resizeCanvas() {
        canvasSize.width = $(win).width();
        canvasSize.height = $(win).height();
        $canvas.attr(canvasSize);
    }

    function rand(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    function getRandomColor() {
        return rand(128, 255) + ',' + rand(128, 255) + ',' + rand(128, 255);
    }

})(window, document, jQuery);
