/**
 * 需要实现的功能：
 *      1. 倒计时
 *      2. 替换文字
 *      3. phoneNum 缓存
 * 参数：
 *      1. 倒计时的时间 totalTime
 *      2. 倒计时起始时间key startTimeKey
 *      3. 倒计时经过时间 timeKey
 *      4. 是否自动开启 autoStart
 * 调用方式：
 *      1. $(selector).countDown(options,callback)
 * 逻辑：
 *      1. 在初始化的时候需要去读取对应的key值，如果存在，继续倒计时
 *      2. 暴露接口:start
 */

(function ($) {
    // 插件代码

    var DEFAULTS = {
        timeKey: 'timeCount',
        startTimeKey: 'startTime',
        totalTime: 60,
        callback: function () { // 回调
            console.log("time end");
        }
    };

    function CountDownTimer(elem, options) {
        // 初始化参数
        this.options = $.extend({}, DEFAULTS, options);
        this.timeKey = this.options.timeKey;
        this.startTimeKey = this.options.startTimeKey;
        this.autoStart = this.options.autoStart;
        this.totalTime = this.options.totalTime;
        this.startTime = parseInt(new Date().getTime() / 1000); // 当前时间
        this.callback = this.options.callback;
        this.elem = elem;
        this.timer = 0;
        this.init();

    }

    CountDownTimer.prototype.init = function () {
        var that = this;
        // 缓存时间
        var cacheTime = localStorage.getItem(this.timeKey);
        // 如果有缓存，直接开始倒计时
        if (cacheTime && cacheTime > 0) {
            this.countDown();// 直接倒计时
        }
    };

    // 给外部开始倒计时的接口
    CountDownTimer.prototype.start = function () {
        this.startTime = parseInt(new Date().getTime() / 1000);
        localStorage.setItem(this.startTimeKey, this.startTime);
        localStorage.setItem(this.timeKey, this.totalTime);
        this.countDown()
    };


    CountDownTimer.prototype.countDown = function () {
        var that = this;
        // 当前时间
        var currentTime = parseInt(new Date().getTime() / 1000);
        // 仍需等待的时间
        var waitTime = parseInt(localStorage.getItem(this.timeKey));
        // 开始倒计时的时间
        var startTime = this.startTime;

        // 解决页面跳转出去或者关闭倒计时暂停问题，正常情况下pastTime每秒减一，页面跳转出去的就是减去中间间隔时间
        var pastTime = currentTime - startTime; // 已经经过的时间
        if (!isNaN(waitTime) && waitTime > 0 && pastTime < this.totalTime) {
            waitTime = this.totalTime - pastTime; // 已经等待的时间
            this.elem.text("重新获取(" + waitTime + 's)').attr('disabled', 'true');
            //让设置的cookie值实质发生变化，不是单纯的数字减少。
            localStorage.setItem(this.timeKey, waitTime); // 更新还需要等待的时间
            this.timer = setTimeout(function () {
                that.countDown(); // 每隔1s执行一次此方法
            }, 1000);
        } else {
            localStorage.setItem(this.timeKey, 0); // 更新还需要等待的时间
            this.elem.text('获取验证码').removeAttr('disabled');
            clearTimeout(this.timer);
            this.callback();
        }
    };


    $.fn.countDown = function (options) {
        var elem = this;
        return new CountDownTimer(elem, options)
    }
})(Zepto);