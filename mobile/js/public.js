/**
 * Created by meme on 2017/7/19.
 */

var base = {
    //显示弹出
    tipsShow: function (msg) {
        layer.open({
            content: msg,
            skin: 'msg',
            time: 3 //3秒后自动关闭
        });
    },
    tipsHide: function () {
        layer.closeAll();
        return false;
    },
    // btn波纹效果
    btnRipple: function () {
        var $ripple = $('.action-btn');
        var $span = $('<span class="a-ripple">');
        $ripple.append($span);

        $ripple.on('touchend', function (e) {

            var $this = $(this);
            var $offset = $this.parent().offset();

            var $span = $this.find('.a-ripple');

            var x = e.changedTouches[0].pageX - $offset.left;
            var y = e.changedTouches[0].pageY - $offset.top;

            $span.css({
                top: y + 'px',
                left: x + 'px'
            });

            $this.addClass('is-active');

        });
        $ripple.on('animationend webkitAnimationEnd oanimationend MSAnimationEnd', function (e) {
            $(this).removeClass('is-active');
        });
    },
    timeCountDown: function (target, options, callback) {
        var timer = 0;
        // 默认配置
        var DEFAULTS = {
            timeKey: 'timeCount',
            startTimeKey: 'timePassed', // 过去的时间
            callback: function () { // 回调
                console.log("time end");
            }
        };

        DEFAULTS.totalTime = localStorage.getItem(DEFAULTS.timeKey) || 60; // 倒计时的总时间

        target = $(target); // 元素
        options = $.extend({}, DEFAULTS, options);

        var timeKey = options.timeKey;
        var startTimeKey = options.startTimeKey;
        var totalTime = options.totalTime;

        localStorage.setItem(timeKey, totalTime); // 设置总时间
        localStorage.setItem(startTimeKey, (Date.parse(new Date().toISOString())) / 1000); // 设置起始时间
        countDown(); // 第一次调用

        function countDown() {
            var waitTime = parseInt(localStorage.getItem(timeKey)); // 仍需等待的时间
            var currentTime = parseInt((Date.parse(new Date().toISOString())) / 1000); // 当前时间
            var startTime = parseInt(localStorage.getItem(startTimeKey)); // 开始倒计时的时间

            // 解决页面跳转出去或者关闭倒计时暂定问题，正常情况下diffTime每秒减一，页面跳转出去的就是减去中间间隔时间
            var pastTime = currentTime - startTime; // 已经经过的时间
            if (!isNaN(waitTime) && waitTime > 0 && pastTime <= totalTime) {
                waitTime = totalTime - pastTime; // 已经等待的时间
                target.text("重新获取(" + waitTime + 's)').attr('disabled', 'true');
                //让设置的cookie值实质发生变化，不是单纯的数字减少。
                localStorage.setItem(timeKey, waitTime); // 更新还需要等待的时间
                timer = setTimeout(function () {
                    countDown(); // 每隔1s执行一次此方法
                }, 1000);
            } else {
                target.text('获取验证码').removeAttr('disabled');
                clearTimeout(timer);
                options.callback();
            }
        }
    }
};


$(function ($) {
    //公用去除loading
    $(".preloading").hide();
    //fastclick
    if (window.FastClick) {
        FastClick.attach(document.body);
    }
    base.btnRipple();

    // 当页面ready的时候，执行回调:
    $(document).on("touchstart", ".action-btn:not(.disable)", function (e) {
        var $this = $(this);
        var flag = true;
        //遍历子类
        $this.find("*").each(function () {
            //查看有没有子类触发过active动作
            if ($(this).hasClass("active")) flag = false;
        });
        //如果子类已经触发了active动作，父类则取消active触发操作
        if (flag) $this.addClass("active");
    });
    $(document).on("touchmove", ".action-btn:not(.disable)", function (e) {
        if ($(this).hasClass("active")) $(this).removeClass("active");
    });
    $(document).on("touchend", ".action-btn:not(.disable)", function (e) {
        if ($(this).hasClass("active")) $(this).removeClass("active");
    });

    $("#btnback").on("touchend", pageBack)
});

//定义返回方法
function pageBack() {
    window.history.back();
}


