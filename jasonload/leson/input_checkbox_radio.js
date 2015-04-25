define("leson/input_checkbox_radio",["jquery","./css/checkbox_radio.css"],function(require,exports,module){

	var $ = require("jquery");

	$.fn.hcheckbox=function(options){
		var opt=$.extend({},{clickCallback:function(){return true;}},options);
		
		$(':checkbox+label',this).each(function(){
			$(this).addClass('leson_web_checkbox');
			if($(this).prev().is(':disabled')==false){
				if($(this).prev().is(':checked'))
					$(this).addClass("leson_web_checked");
			}else{
				$(this).addClass('leson_web_disabled');
			}
		}).click(function(event){
			if(opt.clickCallback(this)!==false){
				if(!$(this).prev().is(':checked')){
					$(this).addClass("leson_web_checked");
					$(this).prev()[0].checked = true;
				}else{
					$(this).removeClass('leson_web_checked');
					$(this).prev()[0].checked = false;
				}
				event.stopPropagation();
			}
		}).prev().hide();
	};

	$.fn.hradio = function(options){
		var self = this;
		var opt=$.extend({},{clickCallback:function(){return true;}},options);
		return $(':radio+label',self).each(function(){
			$obj=$(this);
			$obj.addClass('leson_web_hRadio');
			if($obj.prev().is(":checked")&&!$obj.hasClass("leson_web_hRadio_Checked")){
				$obj.addClass('leson_web_hRadio_Checked');
			}
		}).click(function(event){
			var $obj=$(this);
			if(opt.clickCallback(this)!==false){
				var $name = $obj.attr("group");
				var $groups = $(self).find("label[group='" + $name +"']");
				$groups.each(function(){
					$(self).find("label[group='" + $name +"']").removeClass("leson_web_hRadio_Checked");
					$obj.addClass("leson_web_hRadio_Checked");
				})
				
				/*$obj.siblings().removeClass("leson_web_hRadio_Checked");
				if(!$obj.prev().is(':checked')){
					$obj.addClass("leson_web_hRadio_Checked");
					$obj.prev()[0].checked = true;
				}*/
				event.stopPropagation();
			}
		}).prev().hide();
	}


	module.exports = $;
})