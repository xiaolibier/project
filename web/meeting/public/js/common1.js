/**
 * file:page
 * author:lixianqi
 * date:2017-5-3
*/

//页面初始化
$(function(){
	var g = {};
	g.login_token = Utils.offLineStore.get("logintoken",false) || "";
	g.serTT = Utils.offLineStore.get("serTT",false) || "";//从home 页面获取 按钮权限集合
	g.f_id = Utils.getQueryString("f_id") || "";
	g.httpTip = new Utils.httpTip({});
	g.gotopage = 'index.html';//存储登陆后需要跳转到的页面

	/*......................lodding.......................................*/
	
	//公共头部

	$('#login_out').on('click',loginOutfunc);
	$('.common_login_btn').on('click',loginFunc);
	$('.common_reg_btn').on('click',regFunc);
	$('.btnSendCode').on('click',btnSendCodeFunc);
	$('#resetpass').on('click',resetpassFunc);
	$('.close_common_btn').on('click',function(){//关闭弹窗按钮
		closeSbox();
	});
	loadpage();//加载页面
	
	/*......................setting.......................................*/
	
	//加载页面
	function loadpage(){
		
		//判断用户是否登录
		if(g.login_token == ''){
			$('.usr_hh_phone').hide();
			$('#login_out').hide();
			$('#login_abtn').show();
		}else{
			$('.usr_hh_phone').show();
			$('#login_out').show();
			$('#login_abtn').hide();
		}
		getUserInfoFunc();//获取用户信息
	}
	
	
	//跳转易企秀
	$('.gotoyiqixiu').on('click',function(){
		location.href = Base.yiqi;
	});
	
	//判断浏览器 手机型号等
	var browser = {
		versions : function () {
			var u = navigator.userAgent,
			app = navigator.appVersion;
			return {
				trident : u.indexOf('Trident') > -1,
				presto : u.indexOf('Presto') > -1,
				webKit : u.indexOf('AppleWebKit') > -1,
				gecko : u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
				mobile : !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/),
				ios : !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
				android : u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
				iPhone : u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1,
				iPad : u.indexOf('iPad') > -1,
				webApp : u.indexOf('Safari') == -1,
				QQbrw : u.indexOf('MQQBrowser') > -1,
				weiXin : u.indexOf('MicroMessenger') > -1,
				ucLowEnd : u.indexOf('UCWEB7.') > -1,
				ucSpecial : u.indexOf('rv:1.2.3.4') > -1,
				ucweb : function () {
					try {
						return parseFloat(u.match(/ucweb\d+\.\d+/gi).toString().match(/\d+\.\d+/).toString()) >= 8.2
					} catch (e) {
						if (u.indexOf('UC') > -1) {
							return true;
						} else {
							return false;
						}
					}
				}
				(),
				Symbian : u.indexOf('Symbian') > -1,
				ucSB : u.indexOf('Firefox/1.') > -1
			};
		}
		()
	}
	
	
	//返回首页
	$('.gotoHome').on('click',function(){
		location.href="index.html";
		
	});
	
	//发送验证----------------------------begin---------------------------
	var InterValObj; //timer变量，控制时间
	var count = 30; //间隔函数，1秒执行
	var curCount;//当前剩余秒数
	
	//timer处理函数
	function SetRemainTime(obj) {
		var obj = obj || '';
		if(obj == ''){Utils.alert('获取对象失败！');return false;}
		if (curCount == 1) {                
			window.clearInterval(InterValObj);//停止计时器
			obj.find(".btnSendCode").removeClass("disabled");//启用按钮
			obj.find(".btnSendCode").html("重新发送");
			obj.find('.btnSendCode').on('click',btnSendCodeFunc);
		}
		else {
			curCount--;
			obj.find(".btnSendCode").html("" + curCount + "秒后重发");
		}
	}
	//获取验证码
	function btnSendCodeFunc(){
		var obj = $(this).parents('.login_box') || '';
		if(obj == ''){Utils.alert('获取对象失败！');return false;}
		var phoneNum = trim2(obj.find('.phoneNum').val() || '');
		if(phoneNum == ''){Utils.alert('请输入手机号！');return false;}
		if(!validPhone(phoneNum)){return false;}
		curCount = count;
	　　//设置button效果，开始计时
		 obj.find(".btnSendCode").addClass("disabled");
		 obj.find(".btnSendCode").html("" + curCount + "秒后重发");
		 obj.find('.btnSendCode').off('click');
		 InterValObj = window.setInterval(function(){SetRemainTime(obj)}, 1000); //启动计时器，1秒执行一次
		 //return false;
	　　//向后台发送处理数据
		var condi = {};
		condi.phone = phoneNum;
		var url = Base.serverUrl + "conference/short/message/getValidCode";
		//g.httpTip.show();
		$.ajax({
			url:url,
			data:condi,
			timeout: 30000, //超时时间设置，单位毫秒
			type:"GET",
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
					var msg = data.message || "获取失败";
					Utils.alert(msg);
				}
				//g.httpTip.hide();
			},
			error:function(data,status){
				//g.httpTip.hide();
				if(status=='timeout'){
		　　　　　  Utils.alert("超时");
		　　　　}
			}
		});
	}

	//发送验证--------------------------------end-----------------------
	
	//确认重置密码
	function resetpassFunc(){
		var obj = $(this).parents('.login_box') || '';
		if(obj == ''){Utils.alert('获取对象失败！');return false;}
		var phoneNum = trim2(obj.find('.phoneNum').val() || '');
		var yancode = trim2($('#yancode2').val() || '');
		var newPass = trim2($('#newPass2').val() || '');
		if(phoneNum == ''){Utils.alert('请输入手机号！');return false;}
		if(!validPhone(phoneNum)){return false;}
		if(yancode == ''){Utils.alert('验证码不能为空！');return false;}
		if(newPass == ''){Utils.alert('新密码不能为空！');return false;}
		var condi = {};
		condi.phone = phoneNum;
		condi.vCode = yancode;
		condi.newPassword = newPass;
		var url = Base.serverUrl + "conference/user/resetPassword";
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
					var data = data.result || {};
					Utils.alert('重置密码成功！');
					setTimeout(function(){
						$('.login_box_box').css('display','inline-block');
						$('.reg_box_box,.findpass_box_box').hide();
					},1000);
					
				}
				else{
					var msg = data.message || "重置失败";
					Utils.alert(msg);
				}
				//g.httpTip.hide();
			},
			error:function(data,status){
				//g.httpTip.hide();
				if(status=='timeout'){
		　　　　　  Utils.alert("超时");
		　　　　}
			}
		});
	}
	
	
	//注册
	function regFunc(){
		var obj = $(this).parents('.login_box') || '';
		if(obj == ''){Utils.alert('获取对象失败！');return false;}
		var usrName = trim2($('#usrName').val() || '');
		var phoneNum = trim2(obj.find('.phoneNum').val() || '');
		var yancode = trim2($('#yancode').val() || '');
		var newPass = trim2($('#newPass').val() || '');
		if(usrName == ''){Utils.alert('请输入用户名！');return false;}
		if(phoneNum == ''){Utils.alert('请输入手机号！');return false;}
		if(!validPhone(phoneNum)){return false;}
		if(yancode == ''){Utils.alert('验证码不能为空！');return false;}
		if(newPass == ''){Utils.alert('密码不能为空！');return false;}
		var condi = {};
		condi.name = usrName;
		condi.phone = phoneNum;
		condi.vCode = yancode;
		condi.password = newPass;
		var url = Base.serverUrl + "conference/user/join";
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
					var data = data.result || {};
					var phone = data.phone || '';
					Utils.alert('注册成功！');
					//注册成功 弹出登录窗口
					setTimeout(function(){
						$('.login_box_box').css('display','inline-block');
						$('.reg_box_box,.findpass_box_box').hide();
					},1000);
				}
				else{
					var msg = data.message || "重置失败";
					Utils.alert(msg);
				}
				//g.httpTip.hide();
			},
			error:function(data,status){
				//g.httpTip.hide();
				if(status=='timeout'){
		　　　　　  Utils.alert("超时");
		　　　　}
			}
		});
	}
	
	
	//登录
	function loginFunc(){
		var usr = $('#login_usr').val() || '';
		var pas = $('#login_pass').val() || '';
		usr = trim2(usr);
		pas = trim2(pas);
		if(usr == ''){Utils.alert('用户名不能为空！');return false;}
		if(pas == ''){Utils.alert('密码不能为空！');return false;}
		var condi = {};
		condi.username = usr;
		condi.password = pas;
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
			crossDomain: true,
			dataType:'json',
			context:this,
			success: function(data){
				var status = data.success || false;
				if(status){
					var data = data.result || '';
					var username = data.username || '';
					var userid = data.userid || '';
					if(userid != ''){Utils.offLineStore.set("logintoken",userid,false);g.login_token = userid;}//存储用户登录
					Utils.alert('登录成功！');
					setTimeout(function(){
						location.href = g.gotopage;
					},1000);
				}
				else{
					var msg = data.message || "登录失败";
					Utils.alert(msg);
				}
				//g.httpTip.hide();
			},
			error:function(data,status){
				//g.httpTip.hide();
				if(status=='timeout'){
		　　　　　  Utils.alert("超时");
		　　　　}
			}
		});
	}
	
	//获取用户信息
	function getUserInfoFunc(){
		var condi = {};
		var url = Base.serverUrl + "conference/user/currentUserInfo";
		//g.httpTip.show();
		$.ajax({
			url:url,
			data:condi,
			timeout: 30000, //超时时间设置，单位毫秒
			type:"GET",
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
			dataType:'json',
			context:this,
			success: function(data){
				var status = data.success || false;
				if(status){
					var data = data.result || {};
					var userid = data.id || '';
					var name = data.name || '';
					$('.usr_hh_phone').html(name).show();
					$('#login_out').show();
					$('#login_abtn').hide();
					
					Utils.offLineStore.set("logintoken",userid,false);//存储token
					
				}
				else{
					var msg = data.message || "失败";
					//退出状态
					$('.usr_hh_phone').hide().html('');
					$('#login_out').hide();
					$('#login_abtn').show();
					Utils.offLineStore.remove("logintoken",false);//清楚登录状态
					//Utils.alert(msg);
				}
				//g.httpTip.hide();
			},
			error:function(data,status){
				//g.httpTip.hide();
				//退出状态
				$('.usr_hh_phone').hide().html('');
				$('#login_out').hide();
				$('#login_abtn').show();
				Utils.offLineStore.remove("logintoken",false);//清楚登录状态
				if(status=='timeout'){
		　　　　　  //Utils.alert("超时");
		　　　　}
			}
		});
	}
	
	//退出登录
	function loginOutfunc(){
		if(!confirm('确认退出系统吗？')){return false;}
		var condi = {};
		//condi.page = g.nowPage;//当前页
		var url = Base.serverUrl + "logout";
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
					Utils.alert('退出成功！');
					Utils.offLineStore.remove("logintoken",false);//删除存储token
					setTimeout(function(){
						location.href = "index.html";
					},1000);
				}
				else{
					var msg = data.message || "退出失败";
					Utils.alert(msg);
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
	
	
	//登录注册窗口 跳转
	$('.common_goto_reg').on('click',function(){
		$('.login_box_box,.findpass_box_box').hide();
		$('.reg_box_box').css('display','inline-block');
	});
	$('.common_goto_login').on('click',function(){
		$('.login_box_box').css('display','inline-block');
		$('.reg_box_box,.findpass_box_box').hide();
	});
	$('.common_goto_findpass').on('click',function(){
		$('.findpass_box_box').css('display','inline-block');
		$('.reg_box_box,.login_box_box').hide();
	});
	
	//登录窗口
	$('#login_abtn').on('click',function(){
		showSbox('.login_box_box');
	});
	
	
	//大会报名
	$('.common_body').on('click','.apply_common_btn',function(){
		if(g.login_token == ''){//没登录
			//Utils.alert('请登录后操作！');
			showSbox('.reg_box_box');
			g.gotopage = "apply.html";//存储需要跳转的页面
		}else{//已经登录
			location.href = "apply.html";
		}
	});
	//点击菜单 我的订单
	$('.myorderabtn').on('click',function(){
		if(g.login_token == ''){//没登录
			//Utils.alert('请登录后操作！');
			showSbox('.reg_box_box');
			g.gotopage = "myorder.html";//存储需要跳转的页面
		}else{//已经登录
			location.href = "myorder.html";
		}
	});
	
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
			if(id == '#headInput'){_top = '29px';}
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
	window.closeSbox = function(cls){
		var cls = cls || '';
		if(cls != ''){$('.stip_bg,.stip_box,'+cls+',.choiseDanwei').fadeOut(300);return false;}
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
	$('.common_body').on('click','.check_box',function(){
		var _this = $(this) || {};
		if(_this.hasClass('active')){_this.removeClass('active')}else{_this.addClass('active')}
	});
	$('.sbox').on('click','.check_box',function(){
		var _this = $(this) || {};
		if(_this.hasClass('active')){_this.removeClass('active')}else{_this.addClass('active')}
	});
	//公共单选框
	$('.common_body').on('click','.common_radio',function(){
		var _this = $(this) || {};
		var name = _this.attr('name') || '';
		_this.siblings('.common_radio').each(function(){
			var name2 = $(this).attr('name') || '';
			if(name == name2 && name != ''){$(this).removeClass('active');}
		});
		_this.addClass('active');
	});
	$('.sbox').on('click','.common_radio',function(){
		var _this = $(this) || {};
		if(_this.hasClass('active')){_this.removeClass('active')}else{_this.addClass('active')}
	});
	
	//给单选框赋值
	function setRadioVal(id,name,val){
		var id = id || '';//父元素的id或者class
		var name = name || '';//radio 的name
		var val = val || '';//赋值
		if(id != ''){
			$(id).find('.common_radio').removeClass('active');
			$(id).find('.common_radio').each(function(){//遍历查找 name相同的
				var _name = $(this).attr('name') || '';
				var _val = $(this).attr('val') || '';
				if(_name == name && name != '' && val == _val && _val != ''){
					$(this).addClass('active');
				}
			});
			
		}else{
			$('.common_radio').each(function(){//遍历查找 name相同的
				var _name = $(this).attr('name') || '';
				var _val = $(this).attr('val') || '';
				if(_name == name && name != '' && val == _val && _val != ''){
					$(this).addClass('active').siblings('.common_radio').removeClass('active');
				}
			})
		}
	}
	//获取单选框 选中项的值
	function getRadioVal(id,name,restype){
		var id = id || '';//父元素的id或者class
		var name = name || '';//radio 的name
		var restype = restype || '';//返回类型 val
		var res = '';
		if(id != ''){
			$(id).find('.common_radio').each(function(){//遍历查找 name相同的
				var _name = $(this).attr('name') || '';
				if($(this).hasClass('active') && _name == name && name != ''){
					var _val = $(this).attr('val') || '';
					var _html = $(this).html() || '';
					var _text = _html.split('</i>')[1] || '';
					res = restype == 'val' ? _val : _text;
					
				}
			});
			
		}else{
			$('.common_radio').each(function(){//遍历查找 name相同的
				var _name = $(this).attr('name') || '';
				if($(this).hasClass('active') && _name == name && name != ''){
					var _html = $(this).html() || '';
					var _val = $(this).attr('val') || '';
					var _text = _html.split('</i>')[1] || '';
					res = restype == 'val' ? _val : _text;
				}
			})
		}
		return res;
	}
	
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
	window.getLessDate = getLessDate;
	window.replaceCode = replaceCode;
	window.getRadioVal = getRadioVal;
	window.browser = browser;
	window.setRadioVal = setRadioVal;
});

