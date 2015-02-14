/*
 * 模拟网页中所有的下拉列表select
 */
String.prototype.replaceAll = function(s1,s2) {
    return this.replace(new RegExp(s1,"gm"),s2);
}

function initSelectModel(context) {
    var $box;
    if (context) {
        $box = $('div.model-select-box', context);
    } else {
        $box = $('div.model-select-box');
    }
    var $option = $('ul.model-select-option', $box);
    var $txt = $('div.model-select-text', $box);
    var speed = 10;
    /*
     * 当机某个下拉列表时，显示当前下拉列表的下拉列表框
     * 并隐藏页面中其他下拉列表
     */
    $txt.click(function (e) {
        if($(this).parents(".model-select-box").attr("disabled")) return false;
        $option.not($(this).siblings('ul.model-select-option')).slideUp(speed, function () {
            int($(this));
        });
        $(this).siblings('ul.model-select-option').slideToggle(speed, function () {
            $(this).css("overflow", "auto").css("overflow-x", "hidden");
            int($(this));
        });
        return false;
    });
    //点击选择，关闭其他下拉
    /*
     * 为每个下拉列表框中的选项设置默认选中标识 data-selected
     * 点击下拉列表框中的选项时，将选项的 data-option 属性的属性值赋给下拉列表的 data-value 属性，并改变默认选中标识 data-selected
     * 为选项添加 mouseover 事件
     */
    $option.find('li')
        .each(function (index, element) {
            if ($(this).hasClass('seleced')) {
                $(this).addClass('data-selected');
            }
        }).live("click",function () {
            //赋值操作
            var val = $(this).text();
            if($(this).attr("render")) {
                /*
                var items = Number($(this).prev().attr("data-value"));
                var cli = $(this).prev().prop('outerHTML');
                var thistext = "";
                for(var i = items+1; i<items+11; i++){
                    thistext += cli.replaceAll(items,i);
                }*/
                var render = $(this).attr("render");
                if(render){
                    if(render.indexOf("(") >= 0){
                        eval($(this).attr("render"));
                    } else {
                        eval($(this).attr("render") + "(this)");
                    }
                }
                //$(this).before(thistext);
            }
            if($(this).attr("chain") != "false" ){
                $(this).parent().siblings('div.model-select-text').text($(this).text())
                    .attr('data-value', $(this).attr('data-option'));
                //追加input
                var name = $(this).parents('.model-select-box').attr("data-name");
                if(name){
                    var input = $(this).parents('.model-select-box').find("input[name="+name+"]");
                    if(input.length > 0) {
                        $(input).val($(this).attr('data-option'));
                    } else {
                        $(this).parents('.model-select-box').append("<input type='hidden' name='" + name + "' value='" + $(this).attr('data-option') + "'/>");
                    }
                }

                $(this).parent().slideUp(speed, function () {
                    int($(this));
                });
                $(this).addClass('seleced data-selected').siblings('li').removeClass('seleced data-selected');
            }
            $(this).parents('.model-select-box').mousedown();
            return false;
        }).live("mouseover",function () {
            $(this).addClass('seleced').siblings('li').removeClass('seleced');
        });

    //点击文档，隐藏所有下拉
    $(document).click(function (e) {
        $option.slideUp(speed, function () {
            int($(this));
        });
    });

    //初始化默认选择
    function int(obj) {
        obj.find('li.data-selected').addClass('seleced').siblings('li').removeClass('seleced');
    }
}


//扩展下拉框的方法
(function($) {
    $.extend($.fn, {
        //获取下拉框的值
        getSelVal: function(){
            return $(".model-select-text",this).attr("data-value");
        },
        //获取下拉框的文本
        getSelText: function(){
            return $(".model-select-text",this).text();
        },
        clearSel: function(){
            $(".model-select-text",this).text('').attr("data-value","");
            $("ul",this).html('');
            return this;
        },
        //下拉框赋值
        setSelVal: function(val){
            var li = $("ul",this).find("li[data-value='"+val+"']");
            if(li.length == 0){
                li = $("ul",this).find("li[data-option='"+val+"']");
            }
            if(li.length == 0)return false;

            var text = $(li).html();
            $(".model-select-text",this).attr("data-value", val).text(text);
            //追加input
            var name = $(this).attr("data-name");
            if(name){
                var input = $(this).find("input[name="+name+"]");
                if(input.length > 0) {
                    $(input).val($(li).attr('data-value')|$(li).attr('data-option')|text);
                } else {
                    $(this).append("<input type='hidden' name='" + name + "' value='" + val + "'/>");
                }
            }
            return this;
        },
        setSelDisabled: function(){
            $(this).attr("disabled",true).addClass("modelBg");
            return this;
        },
        setSelEnabled: function(){
            $(this).attr("disabled",false).removeClass("modelBg");
            return this;
        }
    });
})(jQuery);

$(function () {
    initSelectModel();
})