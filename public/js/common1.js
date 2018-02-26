/**
 * file:page
 * author:lixianqi
 * date:2017-5-3
*/

//页面初始化
$(function(){
	var g = {};
	g.login_token = Utils.offLineStore.get("token",false) || "";
	g.f_id = Utils.getQueryString("f_id") || "";
	g.httpTip = new Utils.httpTip({});

	
	
	
	/*......................lodding.......................................*/
	//menuFunction();//公共左侧菜单展开与收
	$('#slideLmenu').on('click',shouFunc);
	
	
	
	
	
	
	/*......................setting.......................................*/
	
	//验证密码6-16
	function validPwd(pwd){
		var pwd = pwd || "";
		var reg = /^[0-9a-zA-Z]+$/;
		var reg1 = new RegExp(/^[0-9A-Za-z]+$/);
		var reg2 = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
		if(pwd == "" || pwd == null){
			Utils.alert("密码不能为空！");
			return false;
		}else if(pwd.length < 8){
			Utils.alert("密码长度不能少于8位！");
			return false;
		}else if(pwd.length > 20){
			Utils.alert("密码长度不能超过20位！");
			return false;
		}else if(!reg1.test(pwd) || !reg2.test(pwd)){
			Utils.alert("密码只能由数字和字母组成！");
			return false;	
		}else{
			return true;
		}
	}
	
	loadAjax();//判断用户有没有登录 判断ajax请求返回参数
	//setAjaxData();//给所有ajax请求增加请求参数
	
	//给所有ajax请求增加请求参数
	function setAjaxData(){
		var condi = {}
		condi.vm = '1';
		$.ajaxSetup({
			data:condi
		});
	}
	
	//判断用户没有登录 登录超时等 判断ajax请求返回参数
	function loadAjax(){
		$(document).ajaxComplete(function(e, xhr, settings){
			if(xhr.status === 203 || xhr.status === 208){
				// 未登录的跳转页面
				rText = xhr.responseText;
				var obj =  JSON.parse(rText);
				url = obj["result"];
				parent.window.location.href = url;
			}
		});
	}

		
	//关闭弹窗
	$('.stip_box .stip_content').on('click',function(e){
		$('.stip_bg,.stip_box,.sbox,.choiseDanwei').fadeOut(300);
		e.stopPropagation();
	});
	//通用关闭弹窗
	window.closeSbox = function(){
		$('.stip_bg,.stip_box,.sbox,.choiseDanwei').fadeOut(300);
	}
	//通用打开弹窗
	window.showSbox = function(cls){
		var cls = cls || '';
		if(cls == ''){return false;}
		$('.stip_bg').fadeIn(300);
		$('.stip_box').css('display','table');
		$(cls).css('display','inline-block');
	}
	$('.stip_box .sbox').on('click',function(e){
		
		e.stopPropagation();
	});
	
	//左侧菜单的展开收起
	function shouFunc(){
		var _this = $(this) || {};
		if(!_this){return false;}
		if(_this.hasClass('shou')){//展开操作
			$('.logo_div').animate({'width':'13%'},'slow','swing',function(){
				//$('.logo_div').css({"background":"url('../public/img/logo.png') no-repeat scroll 32% center / auto 60%","background-color":"#495060"});
			});
			$('#common_menu').animate({'left':'0'},'slow');
			$('.frame_div').animate({'left':'13%'},'slow');
			$('#menu_show_t').animate({'width':'86%'},'slow');
			$('.sltext').fadeIn(400);
			
		}else{//收起操作
			$('.logo_div').animate({'width':'30px'},'slow','swing',function(){
				
			});
			$('#common_menu').animate({'left':'-13%'},'slow');
			$('.logo_div').css({"background":"#495060"});
			var _w = $(window).width() - 45;
			$('#menu_show_t').animate({'width':_w+'px'},'slow');
			$('.frame_div').animate({'left':'0%'},'slow');
			$('.sltext').fadeOut(200);
		}
		_this.toggleClass('shou');
	}
	/* 防止冒泡 */
	function stopPropagation(e) {  
		e = e || window.event;  
		if(e.stopPropagation) { //W3C阻止冒泡方法  
			e.stopPropagation();  
		} else {  
			e.cancelBubble = true; //IE阻止冒泡方法  
		}  
	}

	window.stopPropagation = stopPropagation;
	window.validPwd = validPwd;
});

