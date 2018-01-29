// JavaScript Document

/*-------------------banner轮播---------------------*/


$(function() {
	setBannerL();
	
	function setBannerL(){
		//clearInterval(timer);
		var timer = null;
		var num=0;
		var speed=300;
		var len = $('.newBanner ul li').length || 0;//判断banner图个数
		var _ww = $(window).width() || 0;//获取电脑的宽度
		//console.log(_ww);
		if(len > 0){$('.newBanner ul li').width(_ww);}//页面加载时给赋值
		$('.newBanner ul').animate({left:0}, 0);
		function autoPlay(){
			if(len <= 1){return false;}
			num++;
			//console.log(111);
			if(num>=len){num=0;}
			//$('.newBanner ul').animate({left:-num*_ww}, speed);
			fanzhuan(num);//banner图切换
			$('.panelList .pl').eq(num).addClass('active').siblings('.pl').removeClass('active');
		}
		timer=setInterval(autoPlay, 5000);

		//$('.newBanner .commonnewBtn').hide();
		$('.newBanner').hover(function() {
			//console.log(123);
			clearInterval(timer);
			if(len > 1){$('.newBanner .commonnewBtn').show();}
		}, function() {
			//console.log(321);
			clearInterval(timer);
			timer=setInterval(autoPlay, 5000);
			$('.newBanner .commonnewBtn').hide();
		}); 
		//右侧按钮点击
		$('.newBanner .commonnewBtn:eq(1)').unbind().bind('click',function(event) {
			autoPlay();
		});
		//
		/* $('.newBanner .commonnewBtn').hover(function(){
			 $(this).stop().fadeTo(300,1)
		}, function() {
			$(this).stop().fadeTo(300,1)
		}); */
		//左侧按钮点击
		$('.newBanner .commonnewBtn:eq(0)').unbind().bind('click',function(event) {
			num--;
			if(num <0){num=len-1;}
			//$('.newBanner ul').animate({left:-num*_ww}, speed);
			fanzhuan(num);//banner图切换
			$('.panelList .pl').eq(num).addClass('active').siblings('.pl').removeClass('active');
		});
		//底部点点点击
		$('.panelList .pl').unbind().bind('click',function(event) {
			var num=$(this).index();
			//$('.newBanner ul').animate({left:-num*_ww}, speed);
			fanzhuan(num);//banner图切换
			$(this).addClass('active').siblings('.pl').removeClass('active');
		});
		//banner图切换
		function fanzhuan(num){
			//$('.newBanner ul').animate({left:-num*_ww}, speed);
			//$($('.newBanner ul').find('li')[num]).parents('a').siblings('a').find('li').css('z-index','2').fadeOut();
			//$('.newBanner ul').find('li').css('z-index','1');
			$($('.newBanner ul').find('li')[num]).css('z-index','3').parents('a').siblings('a').find('li').css('z-index','1');
		}
	}
	window.setBannerL = setBannerL;

});


/*-------------------最新活动轮播图---------------------*/

//$(function() {
//		var timer=null;
//		var num=1;
//		var speed=300;
//
//
//		function autoPlay(){
//			num++;
//			if(num>4){
//				num=0;
//			}
//			$('.activity ul').animate({left:-num*279}, speed);
//
//			$('.activity ol li').eq(num).addClass('cur').siblings('li').removeClass('cur');
//		}
//		
//		timer=setInterval(autoPlay, 2000);
//		$('.activity ol li').click(function(event) {
//			var num=$(this).index();
//			$('.activity ul').animate({left:-num*279}, speed);
//			$(this).addClass('cur').siblings('li').removeClass('cur');
//		});
//
//});
//
//
 /*-------------------最新活动轮播图---------------------*/
 
$(function() {

		
		var timer=null;
		var num=0;
		var speed=300;


		function autoPlay(){
			num++;
			if(num>3){
				num=0;
			}
			$('.mana ul').animate({left:-num*236}, speed);

			
		}
		timer=setInterval(autoPlay, 2000);


		$('.mana').hover(function() {
			clearInterval(timer);
			$('.mana span').show();
		}, function() {
			clearInterval(timer);
			timer=setInterval(autoPlay, 2000);
			$('.mana span').hide();
		});

		$('.mana span:eq(1)').click(function(event) {
			autoPlay();
		});

		$('.mana span').hover(function() {
			 $(this).stop().fadeTo(300,1)
		}, function() {
			$(this).stop().fadeTo(300,1)
		});

		$('.mana span:eq(0)').click(function(event) {
			num--;
			if(num <0){
				num=3;
			}
			$('.mana ul').animate({left:-num*236}, speed);

			
		});
		$('.mana ol li').click(function(event) {
			var num=$(this).index();
			$('.mana ul').animate({left:-num*236}, speed);
			$(this).addClass('cur').siblings('li').removeClass('cur');
		});
});
	











 $(function () {
            $("#sliderA").excoloSlider();
        });




	
