 //***********************
 //leson 双日历插件 
 //2014-11-11
 //
 //调用方式：
 //javascript: $('.doubledate').kuiDate({className: 'doubledate',isDisabled: "1"});
 //html: <input type="text" readonly="readonly" class="doubledate ipticon"/>
 //
 //isDisabled为可选参数，“0”表示今日之前不可选，“1”标志今日之前可选
 //
 //***********************
define("leson/doubledate",["jquery","./css/doubledate.css"],function(require,exports,module){
     var $ = require("jquery");

     var jqObj = []; //保存对象，便于点击时做操作
     $.fn.kuiDate = function(k_date){
        //重写k_date的参数，把所有的值初始化
        k_date = {
            isDisabled : k_date.isDisabled || '0',
            maxDate : k_date.maxDate || '',
            minDate : k_date.minDate || '',
            className : k_date.className,
            box:$(k_date.box),
            left:k_date.left?k_date.left:0,//left和top只有在存在box时起作用，就相对于box的位置
            top:k_date.top?k_date.top:0,
            callback:k_date.callback
        };
        var kDate;
        $(this).live('click',function(e){
            $('#popup_frame,#popup_pane,#a_tips_frame,#air_down_tips').hide();
            kDate = $(this);
            kui_date();
            if(typeof(k_date.callback)=="function"){
                k_date.callback();
            }
        }).live('focus',function(e){
            $('#popup_frame,#popup_pane,#a_tips_frame,#air_down_tips').hide();
            kDate = $(this);
            kui_date();
        });
        
        //清空按钮
        $('.leson_web_kui_date_reset span.off').click(function(){
            //清空文本框内容
            jqObj[0].val('');
            //$('#kui_d_pane').hide();
            $('#kui_d_pane').remove();
        })  
        
        //关闭按钮
        $('.leson_web_kui_date_reset span.close').click(function(){
            //清空文本框内容
            //$('#kui_d_pane').hide();
            $('#kui_d_pane').remove();
        })  

        function kui_date(){
            if($("#kui_d_pane").length>0){
                $('#kui_d_pane').remove();
            }
            // 日期插件的HTML元素 
            var kui_div_date = '<div class="leson_web_kui_d_pane" id="kui_d_pane" style="display:none;"><iframe id="kui_frame_d" width="470" height="260" frameborder="0"></iframe></iframe><div class="leson_web_kui_data_content_pane"><div class="leson_web_kui_prev_next_month"><a href="javascript:;" class="leson_web_kui_prev_m"></a><span class="leson_web_kui_today"></span><a href="javascript:;" class="leson_web_kui_next_m"></a><span class="leson_web_kui_tomorrow"></span></div><div id="left_table"><dl class="leson_web_kui_data_tab"><dt>日</dt><dt>一</dt><dt>二</dt><dt>三</dt><dt>四</dt><dt>五</dt><dt>六</dt></dl><dl class="leson_web_kui_date_info" id="kui_left_t"></dl></div><div id="right_table"><dl class="leson_web_kui_data_tab"><dt>日</dt><dt>一</dt><dt>二</dt><dt>三</dt><dt>四</dt><dt>五</dt><dt>六</dt></dl><dl class="leson_web_kui_date_info" id="kui_right_t"></dl></div><div class="leson_web_kui_date_reset"><span class="off">清空</span><span class="close">关闭</span></div></div></div>';
            if(k_date.box.length>0){
                //保证box定位方式至少是relative
                if(k_date.box.css("position")!="absolute"&&k_date.box.css("position")!="fixed"){
                    k_date.box.css("position","relative");
                }
                k_date.box.append(kui_div_date);
            }else{
                $('body').append(kui_div_date);
            }
            // 给日期插件定位 
            if(k_date.box.length>0){
                var txt_left = k_date.left;
                var txt_top = k_date.top;
            }else{
                var txt_left = kDate.offset().left;
                var txt_top = kDate.offset().top + kDate.outerHeight();
            }
            var txt_wid = kDate.outerWidth();
            var scrollWidth = $(window).width();
            if(txt_left + 370 < scrollWidth){
                // 判断文本框的下方是否够显示弹出框的高度
                if($(document).clientHeight - txt_top < 217 && $(document).clientHeight > 217){
                    $('#kui_d_pane').attr('style','left:'+ txt_left +'px; top:'+ (kDate.offset().top - 197) +'px;');
                }
                else{
                    $('#kui_d_pane').attr('style','left:'+ txt_left +'px; top:'+ txt_top +'px;');
                }
            }
            else{
                $('#kui_d_pane').attr('style','left:'+(txt_left+txt_wid-370)+'px; top:'+ txt_top +'px;');
            }
            $('#kui_d_pane').show();

            // 获取当前系统时间
            var kui_dd = new Date();
            var kui_year = kui_dd.getFullYear();
            var kui_month = kui_dd.getMonth()+1;
            var kui_date = kui_dd.getDate();
            var kui_day = kui_dd.getDay();
            var kui_hours = kui_dd.getHours();
            var kui_minutes = kui_dd.getMinutes();
            var kui_seconds = kui_dd.getSeconds();
            var n_time = kui_dd.getTime();
            var vals = kDate.val();
            var now_year = $.trim(vals) == '' ? kui_year : $.trim(vals).substring(0,4);
            var now_month = $.trim(vals) == '' ? kui_month : $.trim(vals).substring(5,7);
            var now_d =  $.trim(vals) == '' ? kui_date : $.trim(vals).substring(8,10);
            $('.leson_web_kui_today').text(now_year+'年'+now_month+'月');

            // 上月下月
            $('a.leson_web_kui_prev_m').click(function(){
                var kui_y = now_year;
                var kui_m = now_month;
                if(kui_m==1){
                    now_year = kui_y-1;
                    now_month = '12';
                }
                if(kui_m>1 && kui_m <11){
                    now_month = '0'+(kui_m-1);
                }
                if(kui_m>10 && kui_m <13){
                    now_month = kui_m-1;
                }
                $('.leson_web_kui_today').text(now_year+'年'+now_month+'月');
                change_date('left');
                change_date('right');
                kui_click_event_();
            });
            $('a.leson_web_kui_next_m').click(function(){
                var kui_y = now_year;
                var kui_m = now_month;
                if(kui_m>0 && kui_m <9){
                    now_month = '0'+(parseInt(kui_m,10)+1);
                }
                if(kui_m>8 && kui_m <12){
                    now_month = parseInt(kui_m,10)+1;
                }
                if(kui_m==12){
                    now_year ++;
                    now_month = '01';
                }
                $('.leson_web_kui_today').text(now_year+'年'+now_month+'月');
                change_date('left');
                change_date('right');
                kui_click_event_();
            });
            change_date('left');
            change_date('right');
            // 日期变化函数 
            function change_date(dir){ 
                jqObj.pop(); jqObj.push(kDate);
                // 日期 -- 根据年和月计算出来 
                var kui_y = now_year;
                var kui_m = now_month;
                if(dir == 'right'){
                    if(kui_m == 12){
                        kui_y ++;
                        kui_m = '01';
                    }
                    else{
                        kui_m++;
                        if(kui_m<10){
                            kui_m = '0'+kui_m;
                        }
                    }
                    $('.leson_web_kui_tomorrow').text(kui_y+'年'+kui_m+'月');
                }
                else{
                    kui_m = (kui_m < 10) ? '0'+parseInt(kui_m,10) : kui_m;
                }
                var kui_d = now_d;
                var now_date = '';
                
                if(vals == ''){
                    now_date = kui_y+'-'+kui_m+'-'+kui_d;
                }
                else{
                    now_date = $.trim(vals);
                }
                var kui_max_date = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
                if (((kui_y % 4 == 0) && (kui_y % 100 != 0)) || (kui_y % 400 == 0)){
                    kui_max_date[1] = 29;
                }
                var this_max_date = kui_max_date[kui_m-1];
                // 计算星期数 
                var C = 1;  // C是从这一年的元旦算起到这一天为止（包括这一天是内）的天数
                for(var i=0;i < kui_m - 1;i++){
                    C += kui_max_date[i];
                }
                var kui_si = ((kui_y - 1)%4) == 0 ? ((kui_y - 1)/4) : ((kui_y - 1 - (kui_y - 1)%4)/4);
                var kui_yibai = ((kui_y - 1)%100) == 0 ? ((kui_y - 1)/100) : ((kui_y - 1 - (kui_y - 1)%100)/100);
                var kui_sibai = ((kui_y - 1)%400) == 0 ? ((kui_y - 1)/400) : ((kui_y - 1 - (kui_y - 1)%400)/400);
                var S= kui_y - 1 + kui_si - kui_yibai + kui_sibai + C; //求出S的值之后，除以7，余几就是星期几；除尽了就是星期日 
                var aa = (kui_date - 1)%7;
                var bb = S%7; // 每月1号的星期数
                // TD表格的行数
                var kui_td_lines = (bb + this_max_date)%7 == 0 ? (bb + this_max_date)/7 : (bb + this_max_date - (bb + this_max_date)%7)/7 +1;
                
                //动态添加表格数据
                var kui_tbody;
                if(dir == 'left'){
                    kui_tbody = $('#kui_left_t');
                }
                else{
                    kui_tbody = $('#kui_right_t');
                }
                kui_tbody.html('');
                var arr_tr = [];
                for(var i=0;i<kui_td_lines;i++){
                    var m_ = kui_month < 10 ? '0'+kui_month : kui_month;
                    var k_d_ = kui_date < 10 ? '0'+kui_date : kui_date;
                    var dd1 = kui_year+'-'+m_+'-'+k_d_; //拼接当前系统时间的年月日
                    if(i%7 != 0){
                        arr_tr.push('<p></p>');
                    }
                    if(i == 0){
                        // 第一行中有空白的单元格
                        for(var j = 1;j < bb+1;j ++){
                            arr_tr.push('<dt class="leson_web_kui_td_kong">&nbsp;</dt>');
                        }
                        // 第一行中有值单元格
                        var kui_i = 1;
                        for(var j=bb+1;j<=7;j++){
                            var d_ = (7*i+kui_i) < 10 ? '0'+(7*i+kui_i) : (7*i+kui_i);
                            var mm_ = kui_m < 10 ? '0'+parseInt(kui_m,10) : kui_m;
                            var dd2 = kui_y+'-'+mm_+'-'+d_;
                            var cla = '';
                            if(dd2 >= dd1){
                                if(vals == ''){
                                    cla = 'leson_web_kui_not_kong';
                                    if(kui_d == d_ && dir == 'left'){
                                        cla = 'leson_web_kui_not_kong leson_web_td_select';
                                    }
                                }
                                else if(vals == dd2){
                                    cla = 'leson_web_kui_not_kong leson_web_td_select';
                                }
                                else{
                                    cla = 'leson_web_kui_not_kong';
                                }
                            }
                            else{
                                if(k_date.isDisabled == '1'){
                                    if(vals == ''){
                                        cla = 'leson_web_kui_not_kong';
                                        if(kui_d == d_ && dir == 'left'){
                                            cla = 'kui_not_kong leson_web_td_select';
                                        }
                                    }
                                    else if(vals == dd2){
                                        cla = 'leson_web_kui_not_kong leson_web_td_select';
                                    }
                                    else{
                                        cla = 'leson_web_kui_not_kong';
                                    }
                                }
                                else{
                                    cla = 'leson_web_kui_td_hui';
                                }
                            }
                            //arr_tr.push('<dt class="'+cla+'" onmouseover="kui_mouseover_(this)" onmouseout="kui_mouseout_(this)" onclick="kui_click_(this,'+now_date+','+kui_y+','+kui_m+','+kui_d+');">'+(7*i+kui_i)+'</dt>');
                            arr_tr.push('<dt class="'+cla+' claclick"  data-nowdate='+now_date+' data-kuiy='+kui_y+' data-kuim='+kui_m+' data-kuid='+kui_d+' >'+(7*i+kui_i)+'</dt>');
                            kui_i++;
                        }
                        $('.leson_web_kui_top_tr').removeClass('leson_web_kui_top_tr');
                    }
                    else if(i==kui_td_lines-1){
                        var kui_i = 8-bb;
                        for(var j=1;j<=7;j++){
                            var dd2 = kui_y+'-'+kui_m+'-'+(7*(i-1)+kui_i);
                            var cla = '';
                            if((7*(i-1)+kui_i) > this_max_date){
                                arr_tr.push('<dt class="leson_web_kui_td_kong">&nbsp;</dt>');
                            }
                            else{
                                if(dd2 >= dd1){
                                    if(vals == ''){
                                        cla = 'leson_web_kui_not_kong';
                                        if(kui_d == (7*(i-1)+kui_i) && dir == 'left'){
                                            cla = 'leson_web_kui_not_kong leson_web_td_select';
                                        }
                                    }
                                    else if(vals == dd2){
                                        cla = 'leson_web_kui_not_kong leson_web_td_select';
                                    }
                                    else{
                                        cla = 'leson_web_kui_not_kong';
                                    }
                                }
                                else{
                                    if(k_date.isDisabled == '1'){
                                        if(vals == ''){
                                            cla = 'leson_web_kui_not_kong';
                                            if(kui_d == (7*(i-1)+kui_i) && dir == 'left'){
                                                cla = 'leson_web_kui_not_kong leson_web_td_select';
                                            }
                                        }
                                        else if(vals == dd2){
                                            cla = 'leson_web_kui_not_kong leson_web_td_select';
                                        }
                                        else{
                                            cla = 'leson_web_kui_not_kong';
                                        }
                                    }
                                    else{
                                        cla = 'leson_web_kui_td_hui';
                                    }
                                }
                                //arr_tr.push('<dt class="'+cla+'" onmouseover="kui_mouseover_(this)" onmouseout="kui_mouseout_(this)" onclick="kui_click_(this,'+now_date+','+kui_y+','+kui_m+','+kui_d+');">'+(7*(i-1)+kui_i)+'</dt>');
                                arr_tr.push('<dt class="'+cla+' claclick"  data-nowdate='+now_date+' data-kuiy='+kui_y+' data-kuim='+kui_m+' data-kuid='+kui_d+' >'+(7*(i-1)+kui_i)+'</dt>');
                            }
                            kui_i++;
                        }
                    }
                    else{
                        var kui_i = 8 - bb;
                        for(var j=1;j<=7;j++){
                            var d_ = (7*(i-1)+kui_i) < 10 ? '0'+(7*(i-1)+kui_i) : (7*(i-1)+kui_i);
                            var mm_ = kui_m < 10 ? '0'+parseInt(kui_m,10) : kui_m;
                            var dd2 = kui_y+'-'+mm_+'-'+d_;
                            var cla = '';
                            if(dd2 >= dd1){
                                if(vals == ''){
                                    cla = 'leson_web_kui_not_kong';
                                    if(kui_d == d_ && dir == 'left'){
                                        cla = 'leson_web_kui_not_kong leson_web_td_select';
                                    }
                                }
                                else if(vals == dd2){
                                    cla = 'leson_web_kui_not_kong leson_web_td_select';
                                }
                                else{
                                    cla = 'leson_web_kui_not_kong';
                                }
                            }
                            else{
                                if(k_date.isDisabled == '1'){
                                    if(vals == ''){
                                        cla = 'leson_web_kui_not_kong';
                                        if(kui_d == d_ && dir == 'left'){
                                            cla = 'leson_web_kui_not_kong leson_web_td_select';
                                        }
                                    }
                                    else if(vals == dd2){
                                        cla = 'leson_web_kui_not_kong leson_web_td_select';
                                    }
                                    else{
                                        cla = 'leson_web_kui_not_kong';
                                    }
                                }
                                else{
                                    cla = 'leson_web_kui_td_hui';
                                }
                            }
                            //arr_tr.push('<dt class="'+cla+'" onmouseover="kui_mouseover_(this)" onmouseout="kui_mouseout_(this)" onclick="kui_click_(this,'+now_date+','+kui_y+','+kui_m+','+kui_d+',1);">'+(7*(i-1)+kui_i)+'</dt>');
                            arr_tr.push('<dt class="'+cla+' claclick" data-nowdate='+now_date+' data-kuiy='+kui_y+' data-kuim='+kui_m+' data-kuid='+kui_d+' >'+(7*(i-1)+kui_i)+'</dt>');
                            kui_i++;
                        }
                    }
                }
                kui_tbody.html(arr_tr.join(''));
            }
            // 清除日期按钮
            $('.leson_web_kui_clean_btn').click(function(){
                kDate.val('');
            });
            // 关闭日期插件
            $('.leson_web_kui_close_btn').click(function(){
                //$('#kui_d_pane').hide();
                $('#kui_d_pane').remove();
            });
            //var t = new Date().getTime();
            //alert(t-d);
            //console.log($(".claclick"))

            
           //注册事件
            function kui_click_event_(){
                //鼠标移开事件
                $(".claclick").mouseover(function(){
                    var obj = $(this)
                    if(!$(obj).hasClass("leson_web_kui_td_kong")){
                        $(obj).addClass('leson_web_td_hover');
                    }
                });
                //鼠标移开事件
                $(".claclick").mouseout(function(){
                    var obj = $(this)
                    $(obj).removeClass('leson_web_td_hover');
                });
                 //点击选中日期
                $(".claclick").click(function(){
                    //var cla = obj.className;

                    var cla = this.className;
                    var obj = $(this);
                    var now_date = obj.data("nowdate"),
                        kui_y = obj.data("kuiy"),
                        kui_m = obj.data("kuim"),
                        kui_d = obj.data("kuid"),
                        now_date = obj.data("kuione");
                    if(cla.indexOf('leson_web_kui_td_hui') < 0){
                        var now_month;
                        if(kui_m < 10){
                            now_month = '0'+parseInt(kui_m,10);
                        }
                        else{
                            now_month = kui_m;
                        }
                        kui_d = $(obj).html() == null ? now_date.substring(8,10) : ($(obj).html() < 10 ? 0 + $(obj).html() : $(obj).html());
                        jqObj[0].val(kui_y +'-'+ now_month +'-'+ kui_d);
                        //$('#kui_d_pane').hide();
                        $('#kui_d_pane').remove();
                        jqObj[0].change();
                    }
                })
           }
            kui_click_event_();

            //取消事件冒泡 ----- jquery 1.1.4不需要冒泡，更换成jquery1.7.2必须要有冒泡事件，要不然，会有异常
             var e=arguments.callee.caller.arguments[0]||event; //若省略此句，下面的e改为event，IE运行可以，但是其他浏览器就不兼容
             if (e && e.stopPropagation) { 
              // this code is for Mozilla and Opera wibkit
              e.stopPropagation(); 
             } else if (window.event) { 
              // this code is for IE 
              window.event.cancelBubble = true; 
             } 
        }
    }
    // 点击文档的其它地方让日期插件关闭
    $(function(){
        $(document).click(function(e){

            var data_pane = $(e.target).closest('.leson_web_kui_data_content_pane'); 
            var t_id = $(e.target).attr('t_id');
            if(t_id == 'kui_date'){

            }
            else if(typeof(data_pane[0]) == 'undefined'){
                //$('#kui_d_pane').hide();
                $('#kui_d_pane').remove();
            }
        });
    });
    /*$(function(){
        // 日期插件的HTML元素 
        var kui_div_date = '<div class="leson_web_kui_d_pane" id="kui_d_pane" style="display:none;"><iframe id="kui_frame_d" width="470" height="260" frameborder="0"></iframe></iframe><div class="leson_web_kui_data_content_pane"><div class="leson_web_kui_prev_next_month"><a href="javascript:;" class="leson_web_kui_prev_m"></a><span class="leson_web_kui_today"></span><a href="javascript:;" class="leson_web_kui_next_m"></a><span class="leson_web_kui_tomorrow"></span></div><div id="left_table"><dl class="leson_web_kui_data_tab"><dt>日</dt><dt>一</dt><dt>二</dt><dt>三</dt><dt>四</dt><dt>五</dt><dt>六</dt></dl><dl class="leson_web_kui_date_info" id="kui_left_t"></dl></div><div id="right_table"><dl class="leson_web_kui_data_tab"><dt>日</dt><dt>一</dt><dt>二</dt><dt>三</dt><dt>四</dt><dt>五</dt><dt>六</dt></dl><dl class="leson_web_kui_date_info" id="kui_right_t"></dl></div><div class="leson_web_kui_date_reset"><span class="off">清空</span><span class="close">关闭</span></div></div></div>';
        if(k_date.box.length>0){
            //保证box定位方式至少是relative
            if(k_date.box.css("position")!="absolute"&&k_date.box.css("position")!="fixed"){
                k_date.box.css("position","relative");
            }
            k_date.box.append(kui_div_date);
        }else{
            $('body').append(kui_div_date);
        }

    })*/
    //鼠标移上
   /* function kui_mouseover_(obj){
        if(!$(obj).hasClass("leson_web_kui_td_kong")){
            $(obj).addClass('leson_web_td_hover');
        }
    }
    //鼠标移走
    function kui_mouseout_(obj){
        $(obj).removeClass('leson_web_td_hover');
    }*/
    //点击事件
    /*function kui_click_(obj,now_date,kui_y,kui_m,kui_d){
        var cla = obj.className;
        if(cla.indexOf('leson_web_kui_td_hui') < 0){
            var now_month;
            if(kui_m < 10){
                now_month = '0'+parseInt(kui_m,10);
            }
            else{
                now_month = kui_m;
            }
            kui_d = $(obj).html() == null ? now_date.substring(8,10) : ($(obj).html() < 10 ? 0 + $(obj).html() : $(obj).html());
            jqObj[0].val(kui_y +'-'+ now_month +'-'+ kui_d);
            //$('#kui_d_pane').hide();
            $('#kui_d_pane').remove();
            jqObj[0].change();
        }
    }*/


    ///////////////
    module.exports = $;

})