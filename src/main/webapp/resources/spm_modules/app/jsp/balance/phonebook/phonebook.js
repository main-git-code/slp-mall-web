//通讯录详情 table 点击变换div
$(document).ready(function(){
$(".account-table .click").click(function(){
  $(this).parent().parent().parent().children(".hover").show();
  $(this).parent().parent(".current").hide();
});

$(".account-table .mail-btn").click(function(){
  $(this).parent().parent().parent().children(".current").show();
  $(this).parent().parent(".hover").hide();
});

})
;	
//通讯录详情 批量删除弹出	
jQuery(document).ready(function($) {
//	$('.click-close').click(function(){
//	$('.eject-mask').fadeIn(100);
//	$('.eject-samll').slideDown(200);
//	})
	$('.eject-samll-title .img').click(function(){
	$('.eject-mask').fadeOut(100);
	$('.eject-samll').slideUp(150);
	})
	$('.eject-samll-confirm .close-btn').click(function(){
	$('.eject-mask').fadeOut(100);
	$('.eject-samll').slideUp(150);
	})
})
//通讯录详情 批量导入弹出
jQuery(document).ready(function($) {
	$('.batch').click(function(){
	$('.eject-mask').fadeIn(100);
	$('.eject-medium').slideDown(200);
	})
	$('.eject-medium-title .img').click(function(){
	$('.eject-mask').fadeOut(100);
	$('.eject-medium').slideUp(150);
	})
})	
//通讯录详情 添加弹出弹出
jQuery(document).ready(function($) {
	$('.add').click(function(){
	$('.eject-mask').fadeIn(100);
	$('.eject-large').slideDown(200);
	})
	$('.eject-large-title .img').click(function(){
	$('.eject-mask').fadeOut(100);
	$('.eject-large').slideUp(150);
	})
})	

//查询信息 结果弹出框
jQuery(document).ready(function($) {
	$('.eject-paging').click(function(){
	$('.eject-mask').fadeIn(100);
	$('.eject-large-paging').slideDown(200);
	})
	$('.eject-large-title .img').click(function(){
	$('.eject-mask').fadeOut(100);
	$('.eject-large-paging').slideUp(150);
	})
})	
//搜索 结果弹出框
jQuery(document).ready(function($) {
	$('.eject-query').click(function(){
	$('.eject-mask').fadeIn(100);
	$('.eject-large-query').slideDown(200);
	})
	$('.eject-large-title .img').click(function(){
	$('.eject-mask').fadeOut(100);
	$('.eject-large-query').slideUp(150);
	})
})
jQuery(document).ready(function($) {
	$('.multi-line').click(function(){
	$('.eject-mask1').fadeIn(100);
	$('#samll-block').slideDown(200);
	})
	$('.samll-block-title .img').click(function(){
	$('.eject-mask1').fadeOut(100);
	$('#samll-block').slideUp(150);
	})
	$('.eject-samll-confirm .close-btn1').click(function(){
	$('#samll-block').slideUp(150);
	})
})	
//通讯录管理 删除弹出	
jQuery(document).ready(function($) {
	$('.trash-close').click(function(){
	$('.eject-mask').fadeIn(100);
	$('.eject-samll').slideDown(200);
	})
	$('.eject-samll-title .img').click(function(){
	$('.eject-mask').fadeOut(100);
	$('.eject-samll').slideUp(150);
	})
	$('.eject-samll-confirm .close-btn').click(function(){
	$('.eject-mask').fadeOut(100);
	$('.eject-samll').slideUp(150);
	})
})
//弹出框带图标 删除弹出	
jQuery(document).ready(function($) {
	$('.eject-icon').click(function(){
	$('.eject-mask').fadeIn(100);
	$('.eject-samll-icon').slideDown(200);
	})
	$('.eject-samll-title .img').click(function(){
	$('.eject-mask').fadeOut(100);
	$('.eject-samll-icon').slideUp(150);
	})
	$('.eject-samll-confirm .close-btn').click(function(){
	$('.eject-mask').fadeOut(100);
	$('.eject-samll-icon').slideUp(150);
	})
})
//通讯录管理 充流量弹出
jQuery(document).ready(function($) {
	$('.charge-flow').click(function(){
	$('.eject-mask').fadeIn(100);
	$('.eject-large').slideDown(200);
	})
	$('.eject-large-title .img').click(function(){
	$('.eject-mask').fadeOut(100);
	$('.eject-large').slideUp(150);
	})
})	
//通讯录管理 充话费弹出
jQuery(document).ready(function($) {
	$('.charge-phone').click(function(){
	$('.eject-mask').fadeIn(100);
	$('#eject-iphone').slideDown(200);
	})
	$('.eject-large-title .img').click(function(){
	$('.eject-mask').fadeOut(100);
	$('#eject-iphone').slideUp(150);
	})
})

 $(function () {
    var st = 100;
    $('.icon-envelope-alt').mouseenter(function () {
		$('.onclick-email').show(1);
    })
		$(".icon-envelope-alt").click(function () {
                $(this).hide(1);
           });
	
		$('.icon-envelope-alt').mouseleave(function () {
        $('.onclick-email').hide(1);
    });
    
    $('.icon-tablet').mouseenter(function () {
		$('.onclick').show(1);
    })
		$(".icon-tablet").click(function () {
                $(this).hide(1);
           });
	
		$('.icon-tablet').mouseleave(function () {
        $('.onclick').hide(1);
    });	
 });
 
/**限制字数个数**/


(function($) {	
	$.fn.fonts = function(option){
		option = $.extend({},$.fn.fonts.option,option);
		return this.each(function(){
		var objString = $(this).text(),
		    objLength = $(this).text().length,
			num = option.fontNum;
		if(objLength > num){
            objString = $(this).text(objString.substring(0,num) + "…");
		}
		 })
	}
	// default options
	$.fn.fonts.option = {
	fontNum:100 //font num
	};
})(jQuery);