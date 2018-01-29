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
	var _th,_nu;//存放选中的输入框
	/*......................lodding.......................................*/
	
	
	
	
	
	/*......................setting.......................................*/
	

	//获取iframe 参数
	window.getString = function(name){
		var name = name || '';
		var iframe = parent.document.getElementById("iframeObj") || {};
		var _href = iframe.src || '';
		if(_href == '' || _href.indexOf('?') < 0){return false;}
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = _href.split('?')[1].match(reg);
		if (r != null && typeof r != "undefined"){
			return unescape(r[2]);
		}
		else{
			return "";
		}
	}
	//公共返回方法
	$('.goback').on('click',function(){
		var page = $(this).attr('back') || '';
		if(page == ''){window.history.go(-1);return false;}
		parent.document.getElementById("iframeObj").src = page;
		
	});
	
	//公共复选框
	$('.check_box').on('click',function(){
		var _this = $(this) || {};
		if(_this.hasClass('active')){_this.removeClass('active')}else{_this.addClass('active')}
	});
	
		//转日期格式
	function getDate(date,type){
		var date = date || '';
		var type = type || '';
		if(date == ''){return '';}
		var newDate = new Date();
		newDate.setTime(date);
		var res = newDate.format('yyyy-MM-dd hh:mm:ss') || '';
		if(type == '2'){res = newDate.format('yyyy-MM-dd') || '';}
		if(type == '3'){res = newDate.format('hh:mm:ss') || '';}
		return res;
	}
	
	
	//定义 下拉的可以多选
	function setMoreSlide(id,boxid){
		var id = id || '';//'.class' or '#id' 
		var boxid = boxid || '';'';//'.class' or '#id' 
		if(!$(id).hasClass('input_select')){$(id).addClass('input_select')}
		$(id).click(function(e){
			var choiseLi = $(boxid+' li');
			var _is = $(this);
			var xx = _is.offset().left || 0;
			var yy = _is.offset().top || 0;
			var _top = yy + _is.height() -9;
			//初始给选项 增加选中项
			var _isval = _is.val() || '';
			if(_isval != ''){
				choiseLi.each(function(){
					var _tti = $(this);
					var _ttival = _tti.val() || '';
					if(_tti.hasClass('active') && _ttival == ''){
						if(_isval.indexOf(_ttival) > -1){_tti.addClass('active');}
					}
				});
			}
			$('.choiseDanwei').hide();
			$(boxid).show().css({"left":xx,"top":_top});
			choiseLi.off().on('click',function(e){
				var _tis = $(this);
				if(_tis.hasClass('active')){_tis.removeClass('active');}else{_tis.addClass('active');}
				var _vdan= _tis.html() || '';
				var _ttval = '';
				choiseLi.each(function(){
					var _tti = $(this);
					if(_tti.hasClass('active')){
						_ttval = _ttval == '' ? _tti.html() : _ttval + ',' + _tti.html();
					}
				});
				_is.val(_ttval);
				//_tis.parents('.choiseDanwei').hide();
				stopPropagation(e);
			});
			stopPropagation(e);
		});
	}
		
	
	//定义既可以下来 又可以搜索的下拉的选框
	function setGetSearchInput(id,boxid){
		var id = id || '';//'.class' or '#id' 
		var boxid = boxid || '';'';//'.class' or '#id' 
		if(id == '' || boxid == ''){return false;}
		//定义搜索
		if(!$(id).hasClass('input_select')){$(id).addClass('input_select')}
		$(id).keyup(function(){
			var _vth = $(this);
			var _li = $(boxid+' li');
			var _val = _vth.val() || '';
			if(_val == '' || _li.length <= 0){return false;}
			_li.show();
			_li.each(function(){//循环搜索
				var _tt = $(this);
				var _val2 = _tt.html() || '';
				var _if = _val2.indexOf(_val);
				if(_if <= -1){//不符合
					_tt.hide();
				}else{_tt.show();}
			});
		});
		//下拉选择
		$(id).click(function(e){
			var _is = $(this);
			var xx = _is.offset().left || 0;
			var yy = _is.offset().top || 0;
			var _top = yy + _is.height() -9;
			$(boxid+' li').show();
			$('.choiseDanwei').hide();
			$(boxid).css({"left":xx,"top":_top}).slideToggle();
			$(boxid+' li').on('click',function(e){
				var _tis = $(this);
				var _vdan= _tis.html() || '';
				var _vtip= _tis.attr('tip') || '';
				_is.val(_vdan).parents('td').attr('title',_vtip);
				_is.attr('tipid',_vtip);
				_tis.parents('.choiseDanwei').hide();
				stopPropagation(e);
			});
			stopPropagation(e);
		});
		
	}
	//给下来多选框赋值
	function valchoiseDanwei(clas,value){
		var clas = clas || '';//弹窗class
		var value = value || '';//需要赋的值
		if(value == "" || clas == ''){return false;}
		var vs = value.indexOf(',') > -1 ? value.split(',') : value;
		var choiseLi = $(clas+' li');
			choiseLi.each(function(){
				var _tti = $(this);
				var _ttival = _tti.html() || '';
				var isin = $.inArray(_ttival, vs);
				if(_ttival != '' && isin > -1){
					_tti.addClass('active');
				}
			});
	}
	//验证密码6-16
	function validPwd(pwd){
		var pwd = pwd || "";
		if((pwd.length < 6 || pwd.length > 20) || pwd == ""){
			Utils.alert("密码输入错误");
			return false;
		}else{
			return true;
		}
	}
	/* 校验手机号 */
	function validPhone(phone){
		var phone = phone || "";
		var reg = /^1[3,4,5,7,8]\d{9}$/g;
		if(phone !== ""){
			if(!reg.test(phone)){
				Utils.alert("手机号输入错误");
				//$("#userPhone").focus();
				return false;
			}else{
				return true;
			}
		}else{
			Utils.alert("请输入手机号");
			return false;
		}
	}
	
	//关闭弹窗
	$('html').on('click','.stip_box .stip_content',function(e){
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
	
	//公共返回方法
	$('.goback').on('click',function(){
		var page = $(this).attr('back') || '';
		if(page == ''){window.history.go(-1);return false;}
		parent.document.getElementById("iframeObj").src = page;
		
	});
	//关闭弹窗
	$(document).click(function(e){
		$('.choiseDanwei').hide();
		$('.hmi_ul',parent.document).hide();
		stopPropagation(e);
	});
	$('.sbox').click(function(e){
		$('.choiseDanwei').hide();
		stopPropagation(e);
	});
	//公共复选框
	$('.xiangmuguanli').on('click','.check_box',function(){
		var _this = $(this) || {};
		if(_this.hasClass('active')){_this.removeClass('active')}else{_this.addClass('active')}
	});
	$('.sbox').on('click','.check_box',function(){
		var _this = $(this) || {};
		if(_this.hasClass('active')){_this.removeClass('active')}else{_this.addClass('active')}
	});
	
	//设置或获取复选框集合的 值 id => .class / #id value => '0,0,1,0'
	function setGetCheckValue(id,value){
		var id = id || '';
		var value = value || '';
		var obj = $(id).find('.check_box') || {};
		if(obj.length <= 0){return ret;}
		if(value == ''){//获取选中值
			var ret = '';
			obj.each(function(n){
				var _this = $(this) || {};
				var _html = _this.html() || '';
				var _text = _html.split('</i>')[1] || '';
				var _val = _this.hasClass('active') ? '1' : '0' ;
				if(_val == '1'){
					if(ret == ''){
						ret = _text;
					}else{
						ret = ret + ',' + _text;
					}
				}	
			});
			return ret;
		}else{//设置选中值
			var zu = value.split(',') || [];
			if(zu.length <= 0){return false;}
			obj.each(function(n){
				var _this = $(this) || {};
				var _html = _this.html() || '';
				var _text = _html.split('</i>')[1] || '';
				//var _val = zu[n] || '0';
				var is = $.inArray(_text, zu);
				if(is <= -1){
					_this.removeClass('active');
				}else{
					_this.addClass('active');
				}
			});
		}
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
	//去两边空格
	function trim2(str) {
		//return str.replace(/^\s+|\s+$/gm,'');
		str = str.replace(/&nbsp;/ig,'');
		return str.replace(/(^\s*)|(\s*$)/g, "");
	}
	
	
	window.stopPropagation = stopPropagation;
	window.setGetCheckValue = setGetCheckValue;
	window.validPhone = validPhone;
	window.validPwd = validPwd;
	window.valchoiseDanwei = valchoiseDanwei;
	window.setGetSearchInput = setGetSearchInput;
	window.getDate = getDate;
	window.setMoreSlide = setMoreSlide;
	window.trim2 = trim2;
});

