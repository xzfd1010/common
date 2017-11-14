/**
 * 需要实现的功能：
 *      1. 倒计时
 *      2. 替换文字
 *      3. 解决visibilitychange的问题
 *      4. 刷新不重置
 *      5. 点击链接进入时重置
 * 参数：
 *      1. 倒计时的时间 seconds
 *      2. selector
 * 希望的调用方式：
 *      1. $(selector).countDown(seconds)
 */

(function ($) {
    // 插件代码
    $.fn.countDown = function (seconds) {
        seconds = seconds || 60;
        var $this = $(this);
        var text = $this.text();
        var timer;
        var hidden = getHiddenProp().hidden;
        var eventName = getHiddenProp().visibilityChange + " count";
        var startTime = new Date().getTime();
        var endTime = startTime + seconds * 1000;


        $this.text("重新获取("+seconds+")秒");
        $this.prop("disabled",true);

        function countEnd(){
            clearTimeout(timer);
            $this.text(text);
            $this.prop("disabled",false);
            localStorage.removeItem("count")
            $(document).off(eventName);// 卸载事件
        }

        function countDown() {
            seconds--;
            if (seconds > 0) {
                $this.text("重新获取(" + seconds + ")s");
                localStorage.setItem("count",seconds)
                timer = setTimeout(countDown, 1000)
            } else {
                countEnd();
            }
        }

        // 初始调用
        timer = setTimeout(countDown, 1000);
        $(document).on(eventName, function () {
            console.log(document[hidden]);
            if (document[hidden]) {
                clearTimeout(timer)
            }else{
                var nowTime = new Date().getTime();
                seconds = parseInt((endTime - nowTime) / 1000);
                if (seconds <= 0) {
                    countEnd();
                } else {
                    $this.text("重新获取(" + seconds + ")s");
                    timer = setTimeout(countDown, 1000)
                }
            }
        });

        return this;
    }
})(jQuery);

function getHiddenProp() {
    var prefixes = ['webkit', 'moz', 'ms', 'o'];

    // if 'hidden' is natively supported just return it
    if ('hidden' in document) return {hidden: 'hidden', visibilityChange: "visibilitychange"}

    // otherwise loop over all the known prefixes until we find one
    for (var i = 0; i < prefixes.length; i++) {
        if ((prefixes[i] + 'Hidden') in document)
            return {hidden: prefixes[i] + 'Hidden', visibilityChange: prefixes[i] + "visibilitychange"};
    }

    // otherwise it's not supported
    return null;
}
