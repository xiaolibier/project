$(function(){
	//初始化左边页面,现在需要在页面中调用jtree_init
	//initleftside();

	//调用jtree
	//jtree_init();
	
	movebox();
	//拖动移动窗口
	function movebox(){	
		var src_posi_Y = 0,src_posi_X = 0, dest_posi_Y = 0,dest_posi_X = 0, move_Y = 0,move_X = 0, is_mouse_down = false, destHeight = 30;
		 $(".sdv_tt")
		 .mousedown(function(e){
			 src_posi_Y = e.pageY;
			 src_posi_X = e.pageX;
			 is_mouse_down = true;
		 });
		 $(document).bind("click mouseup",function(e){
			 if(is_mouse_down){
			   is_mouse_down = false;
			 }
		 })
		 .mousemove(function(e){
			 dest_posi_Y = e.pageY;
			 dest_posi_X = e.pageX;
			 move_Y = dest_posi_Y - src_posi_Y;
			 move_X = dest_posi_X - src_posi_X;
			 src_posi_Y = dest_posi_Y;
			 src_posi_X = dest_posi_X;
			 move_Y = $(".serDv").position().top + move_Y;
			 move_X = $(".serDv").position().left + move_X;
			 if(is_mouse_down){
				 $(".serDv").css({"top":move_Y+ 'px','left':move_X+ 'px'});
			 }
			 return false;
		 });
	}
	setrightbottom();
	//向右下角拖动宽度及高度
	function setrightbottom(){	
		var src_posi_Y = 0,src_posi_X = 0, dest_posi_Y = 0,dest_posi_X = 0, move_Y = 0,move_X = 0, is_mouse_down = false, destHeight = 30, destWidth = 30;
		 $(".barcwidth3")
		 .mousedown(function(e){
			 src_posi_Y = e.pageY;
			 src_posi_X = e.pageX;
			 is_mouse_down = true;
		 });
		 $(document).bind("click mouseup",function(e){
			 if(is_mouse_down){
			   is_mouse_down = false;
			 }
		 })
		 .mousemove(function(e){
			 dest_posi_Y = e.pageY;
			 dest_posi_X = e.pageX;
			 move_Y = dest_posi_Y - src_posi_Y;
			 move_X = dest_posi_X - src_posi_X;
			 src_posi_Y = dest_posi_Y;
			 src_posi_X = dest_posi_X;
			 destHeight = $(".serDv").height() + move_Y;
			 destWidth = $(".serDv").width() + move_X;
			 if(is_mouse_down){
				 destHeight = destHeight > 200 ? destHeight : 200;
				 destWidth = destWidth > 200 ? destWidth : 200;
				 $(".serDv").css({"height":destHeight,"width":destWidth});
				 $(".sdv_conte").css({"height":destHeight,"width":destWidth});
			 }
			 return false;
		 });
	}
	settopbottom();
	//左右拖动宽度
	function settopbottom(){	
		var src_posi_Y = 0, dest_posi_Y = 0, move_Y = 0, is_mouse_down = false, destHeight = 30;
		 $(".barcwidth2")
		 .mousedown(function(e){
			 src_posi_Y = e.pageY;
			 is_mouse_down = true;
		 });
		 $(document).bind("click mouseup",function(e){
			 if(is_mouse_down){
			   is_mouse_down = false;
			 }
		 })
		 .mousemove(function(e){
			 dest_posi_Y = e.pageY;
			 move_Y = dest_posi_Y - src_posi_Y;
			 src_posi_Y = dest_posi_Y;
			 destHeight = $(".serDv").height() + move_Y;
			 if(is_mouse_down){
				 destHeight = destHeight > 200 ? destHeight : 200;
				 $(".serDv").css("height", destHeight);
				 $(".sdv_conte").css("height", destHeight);
			 }
			 return false;
		 });
	}
	setleftright();
	//左右拖动宽度
	function setleftright(){	
		var src_posi_Y = 0, dest_posi_Y = 0, move_Y = 0, is_mouse_down = false, destHeight = 30;
		 $(".barcwidth")
		 .mousedown(function(e){
			 src_posi_Y = e.pageX;
			 is_mouse_down = true;
		 });
		 $(document).bind("click mouseup",function(e){
			 if(is_mouse_down){
			   is_mouse_down = false;
			 }
		 })
		 .mousemove(function(e){
			 dest_posi_Y = e.pageX;
			 move_Y = dest_posi_Y - src_posi_Y;
			 src_posi_Y = dest_posi_Y;
			 destHeight = $(".serDv").width() + move_Y;
			 if(is_mouse_down){
				 $(".serDv,.sdv_conte").css("width", destHeight > 200 ? destHeight : 200);
				 //$('.barcwidth2').css({'width':'100%','bottom':'0px'});
			 }
			 return false;
		 });
	}
})

function jtree_init(){
	var $p = $(document);
	$("ul.tree", $p).jTree();
	// $('div.accordion', $p).each(function(){
	// var $this = $(this);
	// 	$this.accordion({
	// 		fillSpace:$this.attr("fillSpace"),
	// 		alwaysOpen:false,
	// 		active:0
	// 	});
	// });
}

//$.fn.extend({
//	size:function(){
//		return this.length;
//	}	
//})



