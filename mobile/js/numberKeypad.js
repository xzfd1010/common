/*!
 * User: http://orzhtml.github.io/
 * Date: 17-01-23 上午17:15
 * Detail: 支付密码弹窗
 */

(function ($) {
    "use strict";
    // 默认配置
    var DEFAULTS = {
        random: false, // 是否随机摆放 0-9 数字
        zIndex: 1000, // 弹窗的层级，可根据不同页面配置
        ciphertext: true, // 是否显示明文，默认 true 密文*  | false 明文
        dot: true, // 是否显示小数点
        currency: false, // 是否是货币
        max: false, // 是否有输入的最大值，默认 false 没有，如果有，写入实际数值，必须大于0，例如：0.01 | 999999999999.99
        digits: 2, // 默认小数点保留最多2位，需要几位就写
        type: 'password', // password | number
        callback: '', // 回调
        shadeClose: false
    };

    function NumberKeypad(elem, args) {
        this.options = $.extend({}, DEFAULTS, args);
        this.isPassword = this.options.type === 'password';
        this.isNumber = this.options.type === 'number';
        // this.isCurrency = this.options.currency;
        this.shadeClose = this.options.shadeClose;
        this.clickEvent = 'click';
        // 选择模板
        this.$html = this.isNumber ? $(templateNumber()) : $(templatePwd());
        this.el = elem;
        this.$body = $('body');
        this.init({num: false});
    }

    NumberKeypad.prototype.constructor = NumberKeypad;

    NumberKeypad.prototype.init = function (options) {

        var _this = this;
        this.$body.append(this.$html);

        // 绑定默认关闭按钮
        this.$html.find('[data-role="close"]').off("click").on('click', $.proxy(function () {
            this.close();
        }, this));

        this.$html.find('[data-role="ok"]').off("click").on('click', $.proxy(function () {
            this.close();
        }, this));

        // 点击遮罩层关闭
        this.$html.on('click', function (event) {
            if ($(event.target).parents('.ui-dialog-cnt').first().length) {
                return;
            }
            if (_this.shadeClose) {
                if (_this.isPassword) {
                    _this.$html.find('[data-role="close"]').trigger('click');
                } else {
                    _this.$html.find('.number-ok').trigger('click');
                }
            }
        });

        // 其他事件
        if (!options.num) {
            this.num();
        }
        this.add();
        this.del();
    };

    // 隐藏
    NumberKeypad.prototype.close = function () {
        this.$html.removeClass("show-visible");
        setTimeout($.proxy(function () {
            this.$html.removeClass('show');
            this.$html.css({'zIndex': "-1"});
            this.$body.removeClass('number-body');
        }, this), 300);
    };

    // 显示
    NumberKeypad.prototype.show = function () {
        this.$html.css({'zIndex': this.options.zIndex}).addClass('show');
        setTimeout($.proxy(function () {
            this.$html.addClass("show-visible");
            this.$body.addClass('number-body');
        }, this), 300);
    };

    // 渲染数字
    NumberKeypad.prototype.num = function () {
        var $box = this.$html.find('.number-box');
        var arr = [];
        var num;
        var flag;
        var i;
        // 随机 0-9
        if (this.options.random && this.isPassword) {
            while (arr.length < 10) {
                //取 1-9 之间的整数
                num = Math.floor(10 * Math.random());
                flag = false;
                //遍历数组找到空位
                for (i = 0; i < arr.length; i++) {
                    if (arr[i] === num) {
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    arr[arr.length] = num;
                }
            }
        } else {
            while (arr.length < 10) {
                //取 1-9 之间的整数
                num = Math.floor(10 * Math.random());
                flag = false;
                //遍历数组找到空位
                for (i = 0; i < arr.length; i++) {
                    if (arr[i] === num) {
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    arr[arr.length] = num;
                }
            }
        }
        // 渲染数字按钮
        $box.find('[data-trigger="key"]').each(function (i) {
            var $self = $(this);
            var val = arr[i] + '';
            if (val !== '') {
                $self.data('key', val).html(val);
            } else {
                $self.addClass('bg-gray').html('&nbsp;');
            }
        });
    };

    // 点击数字
    NumberKeypad.prototype.add = function () {
        var _this = this;
        var $password,$pwdVal;

        this.$html.find('[data-trigger="key"]').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
        });

        if (this.isNumber) {
            $password = _this.el; // 密码
            $pwdVal = $(".keypadfocus").find('.pwd-val'); // 密码显示文
            this.$html.find('[data-trigger="key"]').on(this.clickEvent, function () {
                var $self = $(this);
                var key = $self.data('key');
                var pwd = $password.val();
                var flag = Number($password.attr("data-flag"));
                // 超过 6 位不允许再录入
                if (pwd.length >= 6) {
                    if (flag === 1) {
                        $password.attr("data-flag", "0");
                        pwd = "";
                        $pwdVal.text(''); // 清空重新输入
                        pwd += key; // 追加输入的数字
                        $pwdVal.eq(pwd.length - 1).html('<em></em>'); // 密码
                        $password.val(pwd); // 填入隐藏域
                    }
                    // return
                } else {
                    pwd += key; // 追加输入的数字
                    $pwdVal.eq(pwd.length - 1).html('<em></em>'); // 密码
                    $password.val(pwd); // 填入隐藏域
                    if (pwd.length === 6) {
                        // 输入够6位数后立即执行需要做的事情，比如ajax提交
                        var len = $(".setpwd-keypad").length;
                        var curKeypad = $(".keypadfocus").closest(".setpwd-keypad").attr("data-rel");
                        if (curKeypad < len) {
                            var next = $(".setpwd-keypad").eq(curKeypad);
                            next.trigger("click");

                        } else {
                            $(".keypadfocus").removeClass("keypadfocus");
                            // 你的回调代码
                            _this.options.callback && _this.options.callback(_this, pwd);
                            $(".icon-ok").trigger("click");//关闭数字键盘
                        }

                    }

                }
                return false;


            });
        } else {
            $password = this.$html.find('.password'); // 密码
            $pwdVal = this.$html.find('.pwd-val'); // 密码显示文
            this.$html.find('[data-trigger="key"]').on(this.clickEvent, function () {
                var $self = $(this);
                var key = $self.data('key');
                var pwd = $password.val();
                // 超过 6 位不允许再录入
                if (pwd.length >= 6) {
                    return;
                } else {
                    pwd += key; // 追加输入的数字
                    $pwdVal.eq(pwd.length - 1).html('<em></em>'); // 密码
                    $password.val(pwd); // 填入隐藏域
                }

                // 输入够6位数后立即执行需要做的事情，比如ajax提交
                if (pwd.length === 6) {
                    //$pwdVal.eq(pwd.length - 1).html('<em></em>'); // 密文
                    // 你的回调代码
                    _this.options.callback && _this.options.callback(_this, pwd);
                }
                return false;
            });
        }
    };


    // 从右边开始删除密码
    NumberKeypad.prototype.del = function () {
        var $password, $pwdVal;
        var _this = this;

        this.$html.find('.number-delete').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
        });

        if (this.isNumber) {
            $password = _this.el; // 密码
            $pwdVal = $(".keypadfocus").find('.pwd-val'); // 密码显示文
            /*var $password = this.$html.find('.password'); // 密码
            var $pwdVal = this.$html.find('.pwd-val'); // 密码显示文*/
            this.$html.find('.number-delete').on(this.clickEvent, function () {
                var pwd = $password.val();
                // 密码为空的时候不在执行
                if (pwd !== '') {
                    pwd = pwd.slice(0, -1); // 从最右边开始截取 1 位字符
                    $password.val(pwd); // 赋值给密码框同步密码
                    $pwdVal.eq(pwd.length).text(''); // 密码明文显示从右开始清空文本
                }
            });
        } else {
            $password = this.$html.find('.password'); // 密码
            $pwdVal = this.$html.find('.pwd-val'); // 密码显示文
            this.$html.find('.number-delete').on(this.clickEvent, function () {
                var pwd = $password.val();
                // 密码为空的时候不在执行
                if (pwd !== '') {
                    pwd = pwd.slice(0, -1); // 从最右边开始截取 1 位字符
                    $password.val(pwd); // 赋值给密码框同步密码
                    $pwdVal.eq(pwd.length).text(''); // 密码明文显示从右开始清空文本
                }
            });

        }
    };

    // 清空已输入密码
    NumberKeypad.prototype.clear = function () {
        var _this = this;
        var $password = _this.$html.find('.password'); // 密码
        var $pwdVal = this.$html.find('.pwd-val');
        $pwdVal.text("");
        $password.val("")
    };

    NumberKeypad.prototype.offevent = function () {
        $('.number-flex-item').off(this.clickEvent);
    };

    // 弹出密码键盘模板
    function templatePwd() {
        return _TEXT(function () {
            /*
            <div id="NumberKeypad" class="ui-dialog ui-dialog-actions number-keypad">
	            	<div class="ui-dialog-cnt">
	            		<div class="ui-dialog-hd">
	            			<a class="icon icon-close" data-role="close"></a>
	            			<div class="title">手机支付密码</div>
	            			<span class="btn-getpwd pos_a" >忘记密码？</span>

	            		</div>
	            		<div class="ui-dialog-bd">

	            			<input type="password" class="password">
	            			<div class="pwd-box">
	            				<div class="pwd-val"></div>
	            				<div class="pwd-val"></div>
	            				<div class="pwd-val"></div>
	            				<div class="pwd-val"></div>
	            				<div class="pwd-val"></div>
	            				<div class="pwd-val"></div>
	            			</div>	            			
	            			<div class="tc payboxTips"><img src="/img/tipsLogo.png"><span>国付宝密码安全控件</span></div>
	            			<div class="number-box ui-border-t">
		            			<div class="number-flex ui-border-b">
			            			<a class="number-flex-item ui-border-r" data-trigger="key"></a>
			            			<a class="number-flex-item ui-border-r" data-trigger="key"></a>
			            			<a class="number-flex-item ui-border-r" data-trigger="key"></a>
		            			</div>
		            			<div class="number-flex ui-border-b">
			            			<a class="number-flex-item ui-border-r" data-trigger="key"></a>
			            			<a class="number-flex-item ui-border-r" data-trigger="key"></a>
			            			<a class="number-flex-item ui-border-r" data-trigger="key"></a>
		            			</div>
		            			<div class="number-flex ui-border-b">
			            			<a class="number-flex-item ui-border-r" data-trigger="key"></a>
			            			<a class="number-flex-item ui-border-r" data-trigger="key"></a>
			            			<a class="number-flex-item ui-border-r" data-trigger="key"></a>
		            			</div>
	            				<div class="number-flex ui-border-b">
	            					<a class="number-flex-item ui-border-r bg-gray">&nbsp;</a>
	            					<a class="number-flex-item ui-border-r" data-trigger="key"></a>
	            					<a class="number-flex-item ui-border-r number-delete"><i class="icon icon-delete"></i></a>
	            				</div>
	            			</div>
	            		</div>
	            	</div>
            </div>
            */
        });
    }

    //  修改密码键盘模板
    function templateNumber() {
        return _TEXT(function () {
            /*
            <div id="NumberKeypad1" class="ui-dialog ui-dialog-actions number-keypad">
	            	<div class="ui-dialog-cnt">
	            		<div class="ui-dialog-bd">	            			
	            			<div class="tc payboxTips"><img src="/img/tipsLogo.png"><span>国付宝密码安全控件</span></div>
	            			<div class="number-box ui-border-t">
		            			<div class="number-flex ui-border-b">
			            			<a class="number-flex-item ui-border-r" data-trigger="key"></a>
			            			<a class="number-flex-item ui-border-r" data-trigger="key"></a>
			            			<a class="number-flex-item ui-border-r" data-trigger="key"></a>
		            			</div>
		            			<div class="number-flex ui-border-b">
			            			<a class="number-flex-item ui-border-r" data-trigger="key"></a>
			            			<a class="number-flex-item ui-border-r" data-trigger="key"></a>
			            			<a class="number-flex-item ui-border-r" data-trigger="key"></a>
		            			</div>
		            			<div class="number-flex ui-border-b">
			            			<a class="number-flex-item ui-border-r" data-trigger="key"></a>
			            			<a class="number-flex-item ui-border-r" data-trigger="key"></a>
			            			<a class="number-flex-item ui-border-r" data-trigger="key"></a>
		            			</div>
	            				<div class="number-flex ui-border-b">
	            					<a class="number-flex-item ui-border-r bg-gray">&nbsp;</a>
	            					<a class="number-flex-item ui-border-r" data-trigger="key"></a>
	            					<a class="number-flex-item ui-border-r number-delete"><i class="icon icon-delete"></i></a>
	            				</div>
	            			</div>
	            			<a class="icon icon-ok hide" data-role="ok"></a>

	            		</div>
	            	</div>
            </div>
            */
        });
    }

    // 输出模板字符串
    function _TEXT(wrap) {
        return wrap.toString().match(/\/\*\s([\s\S]*)\s\*\//)[1];
    }

    $.fn.NumberKeypad = function (args) {
        return this.each(function () {
            var el = this;
            var plugins = new NumberKeypad($(el), args);
            $(el).data("NumberKeypad", plugins);
        });
    };
})(Zepto);