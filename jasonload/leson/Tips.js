;(function($, window, undefined) {
    
    var win = $(window),
        doc = $(document),
        count = 1,
        isLock = false;

    var Tips = function(options) {
        
        this.settings = $.extend({}, Tips.defaults, options);
        
        this.init();
        
    }
    
    Tips.prototype = {
        
        /**
         * 初始化
         */
        init : function() {
            this.create();

            if (this.settings.lock) {
                this.lock();
            }
        },
        create : function(){
            var templates = "<div class='leson_web_syTipsCon'>" +
                            "<span class='leson_web_sy-tipsSpan'>" + this.settings.content + "</span>" +
                            "<span class='leson_web_sy-tipsBtn'>" +
                            "<div class='leson_web_syTipsOk'></div>" + 
                            "<div class='leson_web_syTipsCancel'></div>" + 
                            "</span>" +
                            "</div>";

            this.tips = $('<div>').addClass('leson_web_rTips').css({ zIndex : this.settings.zIndex + (count++),position: this.settings.pos,top: this.settings.top,left: this.settings.left }).html(templates).prependTo(this.settings.el);
            this.lockdiv = $('<div>').css({ zIndex : this.settings.zIndex }).addClass('leson_web_rTips-mask');

            // 设置ok按钮
            if ($.isFunction(this.settings.ok)) {
                this.ok();
            }

            // 设置cancel按钮
            if ($.isFunction(this.settings.cancel)) {
               this.cancel(); 
            }
        },
        /**
         * ok
         */
        ok : function() {
            var _this = this;
            var  footer = this.tips.find('.leson_web_syTipsOk');
                        
            $('<a>', {
                href : 'javascript:;',
                text : this.settings.okText
            }).on("click", function() {
                    var okCallback = _this.settings.ok();
                    if (okCallback == undefined || okCallback) {
                        _this.close();
                    }

            }).addClass('leson_web_sy-btnbg leson_web_sy-btn-tip').prependTo(footer);
            
        },
        
        /**
         * cancel
         */
        cancel : function() {
            var _this = this;
            var  footer = this.tips.find('.leson_web_syTipsCancel');
            
            $('<a>', {
                href : 'javascript:;',
                text : this.settings.cancelText
            }).on("click",function() {
                    var cancelCallback = _this.settings.cancel();
                    if (cancelCallback == undefined || cancelCallback) {
                        _this.close();
                    }
            }).addClass('leson_web_sy-btnbg leson_web_sy-btn-tip').prependTo(footer);
            
        },       
        /**
         * 设置锁屏
         */
        lock : function() {
            if (isLock) return;
            this.lockdiv.appendTo(this.settings.maskBind || '.leson_web_rTips');
            isLock = true;
        },
        
        /**
         * 关闭锁屏
         */
        unLock : function() {
            if (this.settings.lock) {
                if (isLock) {
                    this.lockdiv.remove();
                    isLock = false;
                }
            }
        },
        /**
         * 关闭方法
         */
        close : function() {
            this.tips.remove();
            this.unLock();
        }
        
    }
    
    /**
     * 默认配置
     */
    Tips.defaults = {
        
        // 内容
        content: '加载中...',
        
        // 标题
        title: 'load',
        
        // 宽度
        width: 'auto',
        
        // 高度
        height: 'auto',
        
        // 确定按钮回调函数
        ok: null,
        
        // 取消按钮回调函数
        cancel: null,
        
        // 确定按钮文字
        okText: '确定',
        
        // 取消按钮文字
        cancelText: '取消',
        
        // 是否锁屏
        lock: false,

        //传参
        el: null,

        //设置position
        pos: 'absolute',

        //设置浮动高度
        top: 0,

        //设置浮动坐标
        left: 0,

        // z-index值
        zIndex: 900,

        maskBind: '.leson_web_rTips'
        
    }
    
    var rTips = function(options) {
        new Tips(options);
    }
    
    window.rTips = $.rTips = $.tips = rTips;
    
})(window.jQuery || window.Zepto, window);