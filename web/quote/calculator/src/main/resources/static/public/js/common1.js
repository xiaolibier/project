/**
 * file:page
 * author:lixianqi
 * date:2017-5-3
*/

//页面初始化
$(function(){
	var g = {};
	g.login_token = Utils.offLineStore.get("token",false) || "";
	g.serTT = Utils.offLineStore.get("serTT",false) || "";//从home 页面获取 按钮权限集合
	g.f_id = Utils.getQueryString("f_id") || "";
	g.httpTip = new Utils.httpTip({});

	/*......................lodding.......................................*/
	
	//公共头部
	$('.com_header').load('header.html');
	
	/*......................setting.......................................*/
	
	
	//定义 class为 clicksrc 的 点击跳转
	$('.projectLs').on('click','.clicksrc',function(){
		var _href = $(this).attr('sc') || '';
		if(_href == ''){return false;}
		parent.document.location.href=_href;
	});
	
	//过滤非法字符
	function replaceCode(str){
		var preg = /<(?!\/?BR|\/?IMG)[^<>]*>/ig ;
		var preg2 = /&lt;(?!\/?BR|\/?IMG)[^<>]*&gt;/ig ;
		//$preg2 = /&lt;(.[^(br|img)][^>]*)&gt;/i ;
		var dd = str.replace(preg, "");
		//var dds = dd.replace(/ /g, "");//dds为得到后的内容
		var dds = dd.replace(preg2, "");//替换带转义字符的<>
		return dds;
	}
	
	//解锁基本信息
	function unLockBaseInfo(id){
		var id = id || '';
		var condi = {};
		condi.task_module_id = id;
		var url = Base.serverUrl + "task/module/unlock";
		//g.httpTip.show();
		$.ajax({
			url:url,
			data:condi,
			timeout: 30000, //超时时间设置，单位毫秒
			type:"POST",
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
			dataType:'json',
			context:this,
			success: function(data){
				var status = data.success || false;
				if(status){
					
				}
				else{
					var msg = data.message || "失败";
					//Utils.alert(msg);
				}
				//g.httpTip.hide();
			},
			error:function(data,status){
				//g.httpTip.hide();
				if(status=='timeout'){
		　　　　　  //Utils.alert("超时");
		　　　　}
			}
		});
	}
	//解锁发现
	function unLockFaXian(id){
		var id = id || '';
		var condi = {};
		condi.id = id;
		var url = Base.serverUrl + "discovery/unlock";
		//g.httpTip.show();
		$.ajax({
			url:url,
			data:condi,
			timeout: 30000, //超时时间设置，单位毫秒
			type:"POST",
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
			dataType:'json',
			context:this,
			success: function(data){
				var status = data.success || false;
				if(status){
					
				}
				else{
					var msg = data.message || "失败";
					//Utils.alert(msg);
				}
				//g.httpTip.hide();
			},
			error:function(data,status){
				//g.httpTip.hide();
				if(status=='timeout'){
		　　　　　  //Utils.alert("超时");
		　　　　}
			}
		});
	}
	
	$('.upserBtn').on('click',function(){
		$(this).toggleClass('up');
		if($(this).hasClass('up')){
			$(this).html('收起');
			//$('.search_table tr:nth-child(1) td:nth-child(4)').find(',input').fadeIn(300);
		}else{
			$(this).html('更多');
			//$('.search_table tr:nth-child(1) td:nth-child(4)').find('input').fadeOut(300);
		}
		$('.search_table tr:nth-child(2),.search_table tr:nth-child(3),.search_table tr:nth-child(4)').slideToggle(300);
		
	});
	//loadAjax();
	//判断用户有没有登录 判断ajax请求返回参数
	function loadAjax(){
		$(document).ajaxComplete(function(e, xhr, settings){
			if (xhr.status === 203) {
				// 未登录的跳转页面
				rText = xhr.responseText;
				console.log(rText);
				var obj =  JSON.parse(rText);
				url = obj["result"];
				console.log(url);
				parent.window.location.href = url;
			} else if (xhr.status === 208) {
				// 去登录
				var condi = {};
				var url = Base.serverUrl + "login";
				//g.httpTip.show();
				$.ajax({
					url:url,
					data:condi,
					timeout: 30000, //超时时间设置，单位毫秒
					type:"POST",
					xhrFields: {
						withCredentials: true
					},
					beforeSend: function(xhr) {
					xhr.setRequestHeader('JWCQ', 'JWCQ');
					},
					crossDomain: true,
					dataType:'json',
					context:this,
					success: function(data){
						var status = data.success || false;
						if(status){
							

						}
						else{
							var msg = data.message || "失败";
							//Utils.alert(msg);
						}
						//g.httpTip.hide();
					},
					error:function(data,status){
						//g.httpTip.hide();
						if(status=='timeout'){
				　　　　　  //Utils.alert("超时");
				　　　　}
					}
				});
			}
		});
	}

	
	
	//判断权限 公共方法
	function is_show(res){
		var res = res || '';
		var result = false;
		if(res == ''){Utils.alert('权限参数为空！');return false;}
		if(g.serTT != ''){
			var abs = [];
			if(g.serTT.indexOf(',') > -1){
				abs = g.serTT.split(',');
			}else{
				abs.push(g.serTT);
			}
			res = trim2(res);
			var res2 = res.indexOf('.') > -1 ? res.split('.')[1] : res ;
			res2 = res2.indexOf('#') > -1 ? res2.split('#')[1] : res2 ;
			for(var i=0,len=abs.length;i<len;i++){
				var k = abs[i] || '';
				if(k == res2){result = true;}
			}
		}
		if(!result){$(res).remove();}
	}

	//通过部门 填充查询下拉框
	function setSearchBuMen(id1,role,type1,huoqu){
		var id1 = id1 || '';
		var role = role || '';
		var type1 = type1 || '';
		var huoqu = huoqu || '';
		var condi = {};
		condi.number = 1000;//每页显示行数
		condi.department = role;
		var url = Base.serverUrl + "user/getUsersByDepartment";
		//g.httpTip.show();
		$.ajax({
			url:url,
			data:condi,
			timeout: 30000, //超时时间设置，单位毫秒
			type:"POST",
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
			dataType:'json',
			context:this,
			success: function(data){
				var status = data.success || false;
				if(status){
					var data = data.result || [];
					var data = data || [];
					var html = '',
					html2 = '';
					for(var i=0,len=data.length;i<len;i++){
						var d = data[i] || [];
						var id = d.id || '';
						var name = d.name || '';
						var code = d.code || '';
						if(huoqu == 'name'){id = name;}//获取value也是name
						html += '<li tip="'+id+'">'+name+'</li>';
						html2 += '<option value="'+id+'">'+name+'</option>';
					}
					if(type1 == 'li'){$(id1).html(html);}else{$(id1).html(html2);}
					if(!$(id1).hasClass('input_select')){$(id).addClass('input_select')}
				}
				else{
					var msg = data.message || "失败";
					//Utils.alert(msg);
				}
				//g.httpTip.hide();
			},
			error:function(data,status){
				//g.httpTip.hide();
				if(status=='timeout'){
		　　　　　  //Utils.alert("超时");
		　　　　}
			}
		});
	}	
	//通过角色 填充查询下拉框
	function setSearchRole(id1,role,type1,huoqu){
		var id1 = id1 || '';
		var role = role || '';
		var type1 = type1 || '';
		var huoqu = huoqu || '';
		var condi = {};
		condi.number = 1000;//每页显示行数
		condi.roleName = role;
		var url = Base.serverUrl + "user/getUserByRoleName";
		//g.httpTip.show();
		$.ajax({
			url:url,
			data:condi,
			timeout: 30000, //超时时间设置，单位毫秒
			type:"POST",
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
			dataType:'json',
			context:this,
			success: function(data){
				var status = data.success || false;
				if(status){
					var data = data.result || [];
					var data = data || [];
					var html = '',
					html2 = '';
					for(var i=0,len=data.length;i<len;i++){
						var d = data[i] || [];
						var id = d.id || '';
						var name = d.name || '';
						var code = d.code || '';
						if(huoqu == 'name'){id = name;}//获取value也是name
						html += '<li tip="'+id+'">'+name+'</li>';
						html2 += '<option value="'+id+'">'+name+'</option>';
					}
					if(type1 == 'li'){$(id1).html(html);}else{$(id1).html(html2);}
					if(!$(id1).hasClass('input_select')){$(id).addClass('input_select')}

				}
				else{
					var msg = data.message || "失败";
					//Utils.alert(msg);
				}
				//g.httpTip.hide();
			},
			error:function(data,status){
				//g.httpTip.hide();
				if(status=='timeout'){
		　　　　　  //Utils.alert("超时");
		　　　　}
			}
		});
	}
	
	
	
	//计算相差时间
	function getLessDate(date1){
		var date1= date1 || '';  //开始时间
		if(date1 == ''){return '';}
        var date2 = new Date();    //结束时间
        var date3 = date2.getTime() - new Date(date1).getTime();   //时间差的毫秒数      
        //------------------------------
        //计算出相差天数
        var days=Math.floor(date3/(24*3600*1000));
  
        //计算出小时数
        var leave1=date3%(24*3600*1000);    //计算天数后剩余的毫秒数
        var hours=Math.floor(leave1/(3600*1000));
        //计算相差分钟数
        var leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
        var minutes=Math.floor(leave2/(60*1000));
        //计算相差秒数
        var leave3=leave2%(60*1000);  //计算分钟数后剩余的毫秒数
        var seconds=Math.round(leave3/1000);
		var res = '';
		if(days > 0){res += days+"天 ";}
		if(hours > 0){res += hours+"小时 ";}
		if(minutes > 0){res += minutes+" 分钟";}
		//if(seconds != 0){res += seconds+" 秒";}
		if(days <= 0 && hours >= 0 && minutes <= 5){res='刚刚';}
		if(days > 0){res = days+"天 ";}
		
        return res;
	}
	
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
	//千分符
	function comdify(num){
		return (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
	}
	window.stopPropagation = stopPropagation;
	window.setGetCheckValue = setGetCheckValue;
	window.validPhone = validPhone;
	window.validPwd = validPwd;
	window.valchoiseDanwei = valchoiseDanwei;
	window.setGetSearchInput = setGetSearchInput;
	window.getDate = getDate;
	window.setSearchRole = setSearchRole;
	window.setMoreSlide = setMoreSlide;
	window.trim2 = trim2;
	window.is_show = is_show;
	window.setSearchBuMen = setSearchBuMen;
	window.unLockFaXian = unLockFaXian;
	window.unLockBaseInfo = unLockBaseInfo;
	window.getLessDate = getLessDate;
	window.replaceCode = replaceCode;
	window.comdify = comdify;
});

