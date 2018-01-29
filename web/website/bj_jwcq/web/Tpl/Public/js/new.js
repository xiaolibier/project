// JavaScript Document
$(function() {
	
	
	
	
	//banner图左右按钮鼠标经过
	$('.commonnewBtn').hover(function(){
		if($(this).hasClass('newLeftBtn')){//左按钮
			$(this).find('.btn_img').attr('src','/web/Tpl/Public/newImg/left1.png');
		}else if($(this).hasClass('newRightBtn')){//右按钮
			$(this).find('.btn_img').attr('src','/web/Tpl/Public/newImg/right1.png');
		}
	},function(){
		if($(this).hasClass('newLeftBtn')){//左按钮
			$(this).find('.btn_img').attr('src','/web/Tpl/Public/newImg/left0.png');
		}else if($(this).hasClass('newRightBtn')){//右按钮
			$(this).find('.btn_img').attr('src','/web/Tpl/Public/newImg/right0.png');
		}
	});
	
		
		

});

