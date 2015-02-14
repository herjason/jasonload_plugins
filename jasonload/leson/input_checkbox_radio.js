;(function($){
	$.fn.hcheckbox=function(options){
		$(':checkbox+label',this).each(function(){
			$(this).addClass('leson_web_checkbox');
			if($(this).prev().is(':disabled')==false){
				if($(this).prev().is(':checked'))
					$(this).addClass("leson_web_checked");
			}else{
				$(this).addClass('leson_web_disabled');
			}
		}).click(function(event){
			if(!$(this).prev().is(':checked')){
				$(this).addClass("leson_web_checked");
				$(this).prev()[0].checked = true;
			}else{
				$(this).removeClass('leson_web_checked');
				$(this).prev()[0].checked = false;
			}
			event.stopPropagation();
		}).prev().hide();
	}

	$.fn.hradio = function(options){
		var self = this;
		return $(':radio+label',this).each(function(){
			$(this).addClass('leson_web_hRadio');
			if($(this).prev().is("checked"))
			$(this).addClass('leson_web_hRadio_Checked');
		}).click(function(event){
			$(this).siblings().removeClass("leson_web_hRadio_Checked");
			if(!$(this).prev().is(':checked')){
				$(this).addClass("leson_web_hRadio_Checked");
				$(this).prev()[0].checked = true;
			}
			event.stopPropagation();
		}).prev().hide();
	}
})(jQuery)