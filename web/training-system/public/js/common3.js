/**
 * file:page
 * author:lixianqi
 * date:2017-5-3
*/

//页面初始化
$(function(){
	var g = {};
	g.login_token = Utils.offLineStore.get("token",false) || "";
	

	/*......................lodding.......................................*/
	
	//公共头部
	$('.com_header').load('header.html');

	
	/*......................setting.......................................*/

	
	
	//定义 class为 clicksrc 的 点击跳转
	$('.usr_common_body').on('click','.clicksrc',function(){
		var _href = $(this).attr('sc') || '';
		if(_href == ''){return false;}
		parent.document.location.href=_href;
	});
	


});

