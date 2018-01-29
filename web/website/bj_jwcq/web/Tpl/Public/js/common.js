$(function(){
	
	
	
	
	//顶部菜单显示下拉框
	var objlist = $('.menuList .list') || {};
	objlist.hover(function(){
		var len = objlist.length || 0;
		var _is = $(this);
		var xx = _is.offset().left || 0;
		var yy = _is.offset().top || 0;
		var _top = yy + _is.height() -0;
		if(_top > 60){_top = 60;}//解决首页悬浮问题
		for(var i=0;i<len;i++){
			var ai = i + 1;
			var boxclass = 'choiseMenu'+ai;
			var has = 'choise'+ai;
			if(_is.hasClass(has)){
				$('.'+boxclass).css({"left":xx,"top":_top});
				$('.'+boxclass).show();
			}else{
				$('.'+boxclass).hide();
			}
		}	
	},function(){
		//$('.choiseMenu').fadeOut(500);
	});
	//顶部菜单鼠标经过
	 $('.newHeader').hover(function(){
		
	 },function(){
		$('.choiseMenu').fadeOut(0);
	 });
	
	
	
	
	
	
	
	
});