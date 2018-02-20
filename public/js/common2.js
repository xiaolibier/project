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
	g.usrsave = Utils.offLineStore.get("usrsave",false) || "";//从home 页面获取 所有用户id和name集合
	g.f_id = Utils.getQueryString("f_id") || "";
	g.httpTip = new Utils.httpTip({});
	g.domain1 = '';//存储七牛云 domain
	g.upToken1 = '';//存储七牛云 upToken

	/*......................lodding.......................................*/
	
	
	
	
	
	
	/*......................setting.......................................*/
	
	
	//基本信息页 批量赋值
	function setCondiVal(condi,aid){
		var aid = aid || 'body';//input 容器
		var condi = condi || {};
		if(condi == ''){Utils.alert("赋值对象不能为空！");return false;}
		var tips = '';
		$(aid).find('.con_d').each(function(sn){//循环所有框
			var sk = sn + 1;
			var _t = $(this) || {};
			//获取 * 判断是否允许为空
			//var x = '';
			//if(_t.find('.x').length > 0){x = _t.find('.x').html() || '';}
			//else if(_t.find('.star').length > 0){x = _t.find('.star').html() || '';}
			//var feikong = x.indexOf('*') > -1 ? true : false;//判断非空
			
			var _input = _t.find('input,textarea,select') || [];
			//if(tips != ''){return false;}//跳出循环
			if(_t.css('display') == 'none'){return true;}//隐藏的 跳出本次循环
			if(_input.length > 0){//一般input
				_input.each(function(m){//循环所有input 传值为name > id
					var _this = $(this) || {};
					var _t1 = _this.parents('.con_d') || {};//重新定义父对象 防止闭包
					//获取标题 用于提示信息
					var _lable = _t1.find('span.lable')[m] || '';
					if(_lable == '' && m > 0){_lable = _t1.find('span.lable')[0] || '';}//防止有两个input 一个lable
					var tip_text = '第'+sk+'项能空！';//预定义一个值 防止lable为空
					if(_lable != ''){tip_text = ($(_lable).html() || '') + '不能为空！';}//定义提示值
					//var _val = _this.val() || '';
					//if(feikong && _val == ''){tips = tip_text;return false;}//判断不为为空项 为空 跳出
					//赋值
					var _v = _this.val() || '';
					var _n = _this.attr('name') || '';
					var _id = _this.attr('id') || '';
					if(_n == '' && _id == ''){tips = "第"+sk+"项搜索项有没有name和id！";console.log(tips);return true;}
					else if(_n != ''){_this.val(condi[_n] || '');}
					else if(_id != ''){_this.val(condi[_id] || '');}
					
				});
			}else{//其他输入形式 比如 checkbox radio 图像上传等

				//获取标题 用于提示信息
				var _lable = _t.find('span.lable') || '';
				var tip_text = '第'+sk+'项不能为空！';//预定义一个值 防止lable为空
				if(_lable != ''){tip_text =  (_t.find('span.lable').html() || '') + '不能为空！';}
				
				
				if(_t.find('.common_radio').length > 0){//radiobox 类型 传值名 radiobox 的name
					var _radio = _t.find('.common_radio') || {};
					var _n = _radio.attr('name') || '';
					var _value = condi[_n] || '';
					if(_n == ''){tips = "第"+sk+"项搜索项有没有name！";console.log(tips);return true;}
					_t.find('.common_radio').each(function(){//遍历查找 name相同的
						var _name = $(this).attr('name') || '';
						var _val = $(this).attr('val') || '';
						var _html = $(this).html() || '';
						var _text = _html.split('</i>')[1] || '';
						var rval = _val != '' ? _val : _text;
						if(_name == _n && _name != '' && _value == rval && rval != ''){
							_t.find('.common_radio[name="'+_name+'"]').removeClass('active');
							$(this).addClass('active');
						}
					});
					
					
				}else if(_t.find('.check_box').length > 0){//checkbox 类型 传值名 为con_d 的name
					var _check = _t.find('.check_box') || {};
					var _n = _t.attr('name') || '';
					var _value = condi[_n] || '';
					var zu = _value.indexOf(',') > -1 ? _value.split(',') || [] : _value[0] || [];
					//if(zu.length <= 0){return false;}
					_check.each(function(n){
						var _this = $(this) || {};
						var _val = _this.attr('val') || '';
						var _html = _this.html() || '';
						var _text = _html.split('</i>')[1] || '';
						var rval = _val != '' ? _val : _text;
						var is = $.inArray(rval, zu);
						if(is <= -1){
							_this.removeClass('active');
						}else{
							_this.addClass('active');
						}
					});
					
					
				}else if(_t.find('.head_img_tips').length > 0){//图片上传 类型 传值名 con_d 的name
					var _imgobj = _t.find('.head_img_tips') || {};
					var _n = _t.attr('name') || '';
					var _value = condi[_n] || '';
					var zu = _value.indexOf(',') > -1 ? _value.split(',') || [] : _value[0] || [];
					_imgobj.each(function(n){
						var _this = $(this);
						var src = zu[n] || '';
						if(src == ''){//清空
							_this.removeAttr('src');
							_this.parents('.head_img_spam').removeClass('active');
							_this.siblings('.head_imgs,.hide_head_imgs').css({'background':'url("../public/img/add1.png") no-repeat center center','background-size':'contain'});
						}else{
							_this.attr('src',src);
							_this.parents('.head_img_spam').addClass('active');
							_this.siblings('.head_imgs,.hide_head_imgs').css({'background':'url('+src+') no-repeat center center','background-size':'contain'});
						}	
					});
					
				}
				
			}
		});
	}
	
	
	//基本信息页 批量获取值
	function setInfoCondi(condi,aid){
		var aid = aid || 'body';//input 容器
		var condi = condi || {};
		//if(condi == ''){Utils.alert("condi对象不能为空！");return false;}
		var tips = '';
		$(aid).find('.con_d').each(function(sn){//循环所有框
			var sk = sn + 1;
			var _t = $(this) || {};
			//获取 * 判断是否允许为空
			var x = '';
			if(_t.find('.x').length > 0){x = _t.find('.x').html() || '';}
			else if(_t.find('.star').length > 0){x = _t.find('.star').html() || '';}
			var feikong = x.indexOf('*') > -1 ? true : false;//判断非空
			
			var _input = _t.find('input,textarea,select') || [];
			if(tips != ''){return false;}//跳出循环
			if(_t.css('display') == 'none'){return true;}//隐藏的 跳出本次循环
			if(_input.length > 0){//一般input
				_input.each(function(m){//循环所有input 传值为name > id
					var _this = $(this) || {};
					var _t = _this.parents('.con_d') || {};//重新定义父对象 防止闭包
					//获取标题 用于提示信息
					var _lable = _t.find('span.lable')[m] || '';
					if(_lable == '' && m > 0){_lable = _t.find('span.lable')[0] || '';}//防止有两个input 一个lable
					var tip_text = '第'+sk+'项不能为空！';//预定义一个值 防止lable为空
					if(_lable != ''){tip_text = ($(_lable).html() || '') + '不能为空！';}//定义提示值
					var _val = _this.val() || '';
					if(feikong && _val == ''){tips = tip_text;return false;}//判断不为为空项 为空 跳出
					//赋值
					var _v = _this.val() || '';
					var _n = _this.attr('name') || '';
					var _id = _this.attr('id') || '';
					if(_n == '' && _id == ''){tips = "第"+sk+"项搜索项有没有name和id！";return false;}
					else if(_n != ''){condi[_n] = _v;}
					else if(_id != ''){condi[_id] = _v;}
					
				});
			}else{//其他输入形式 比如 checkbox radio 图像上传等

				//获取标题 用于提示信息
				var _lable = _t.find('span.lable') || '';
				var tip_text = '第'+sk+'项不能为空！';//预定义一个值 防止lable为空
				if(_lable != ''){tip_text =  (_t.find('span.lable').html() || '') + '不能为空！';}
					
				if(_t.find('.common_radio').length > 0){//radiobox 类型 传值名 radiobox 的name
					var _radio = _t.find('.common_radio.active') || '';
					var _val = _radio.attr('val') || '';
					var _html = _radio.html() || '';
					var _text = _html.split('</i>')[1] || '';
					var rval = _val != '' ? _val : _text;
					if(feikong && (_radio == '' || rval == '')){tips = tip_text;return true;}//判断不为为空项 为空 跳出
					var _n = _radio.attr('name') || '';
					if(_n == ''){tips = "第"+sk+"项搜索项有没有name！";return true;}
					else{condi[_n] = rval;}
					
					
				}else if(_t.find('.check_box').length > 0){//checkbox 类型 传值名 为con_d 的name
					var _check = _t.find('.check_box.active') || '';
					if(feikong && _check.length <= 0){tips = tip_text;return true;}//判断不为为空项 为空 跳出
					var c_valstr = '';
					_check.each(function(){
						var _val = $(this).attr('val') || '';
						var _html = $(this).html() || '';
						var _text = _html.split('</i>')[1] || '';
						var cval = _val != '' ? _val : _text;
						c_valstr = c_valstr == '' ? cval : c_valstr+','+cval;
					})
					if(feikong && c_valstr == ''){tips = tip_text;return true;}//判断不为为空项 为空 跳出
					var _n = _t.attr('name') || '';
					if(_n == ''){tips = "第"+sk+"项搜索项有没有name！";return true;}
					else{condi[_n] = c_valstr;}
					
					
				}else if(_t.find('.head_img_tips').length > 0){//图片上传 类型 传值名 con_d 的name
					var _imgobj = _t.find('.head_img_tips') || '';
					var _src = '';
					_imgobj.each(function(){
						var _tsrc = $(this).attr('src') || '';
						_src = _src == '' ? _tsrc : _src +','+ _tsrc;
					});
					if(feikong && _src == ''){tips = tip_text;return true;}//判断不为为空项 为空 跳出
					var _n = _t.attr('name') || '';
					if(_n == ''){tips = "第"+sk+"项搜索项有没有name！";return true;}
					else{condi[_n] = _src;}
				}
				
			}
		});
		if(tips != ''){Utils.alert(tips);return false;}
		return condi;
	}
	
	//给图像赋值 
	function setImgVal(aid,src){
		var aid = aid || '';// #id 或者 .class
		var src = src || '';
		if(src == ''){//清空
			$(aid).removeAttr('src');
			$(aid).parents('.head_img_spam').removeClass('active');
			$(aid).siblings('.head_imgs,.hide_head_imgs').css({'background':'url("../public/img/add1.png") no-repeat center center','background-size':'contain'});
		}else{
			$(aid).attr('src',src);
			$(aid).parents('.head_img_spam').addClass('active');
			$(aid).siblings('.head_imgs,.hide_head_imgs').css({'background':'url('+src+') no-repeat center center','background-size':'contain'});
		}	
	}
	
	
	//加载所有搜索项
	function setCondi(condi,aid){
		var aid = aid || '.btn_div';//input 容器
		var condi = condi || '';
		if(condi == ''){Utils.alert("condi对象不能为空！");return false;}
		$(aid).find('input,select,textarea').each(function(){
			var _v = $(this).val() || '';
			var _n = $(this).attr('name') || '';
			var _id = $(this).attr('id') || '';
			if(_n == '' && _id == ''){Utils.alert("搜索项有没有name和id的项！");return false;}
			else if(_n != ''){condi[_n] = _v;}
			else if(_id != ''){condi[_id] = _v;}
			
		})
		return condi;
	}
	
	//利用后台接口 上传到七牛云
	function uploadqiniu(form_id){
		
		var form_id = form_id || '';
		if(form_id == ''){Utils.alert('上传form为空');return false;}
		var form = $(form_id);
		 var options = { 
			url: Base.serverUrl + "file/utils/uploadFile",
			xhrFields: { withCredentials: true }, 
			crossDomain: true, 
			dataType: 'json', 
			success: function(data) { 
				var src = data.result || '';
				window.qiniudata = data;
			}, 
			error: function(err) {
				Utils.alert("图片上传失败");
			} 
		 }; 
		 form.ajaxSubmit(options); 
	}


	//定义图片上传交互
	$('.xiangmuguanli').on('click','.head_img_spam .head_imgs',function(){
		$(this).siblings('.hide_head_imgs,.head_img_bg').fadeIn();
	});
	$('.xiangmuguanli').on('click','.head_img_spam .hide_head_imgs,.head_img_spam .head_img_bg',function(){
		$(this).fadeOut();
		$(this).siblings('.hide_head_imgs,.head_img_bg').fadeOut();
	});
	//给图像赋值 
	function setImgVal(aid,src){
		var aid = aid || '';// #id 或者 .class
		var src = src || '';
		if(src == ''){//清空
			$(aid).removeAttr('src');
			$(aid).parents('.head_img_spam').removeClass('active');
			$(aid).siblings('.head_imgs,.hide_head_imgs').css({'background':'url("../public/img/add1.png") no-repeat center center','background-size':'contain'});
		}else{
			$(aid).attr('src',src);
			$(aid).parents('.head_img_spam').addClass('active');
			$(aid).siblings('.head_imgs,.hide_head_imgs').css({'background':'url('+src+') no-repeat center center','background-size':'contain'});
		}	
	}
	
	
	//获取七牛云上传的地址和凭证
	//七牛云上传
	//setqiniu();
	function setqiniu(pas){
		//var bid = bid || '';//上传按钮id 不带#
		//var type = type || '';//资源类型 1课件资源 2或其他 其他资源
		var pas = pas || '';
		var condi = {};
		//condi.type = '课件资源';//type=课件资源：包括视频、音频、图片、pdf等 type=其他资源：获取碎片资源上传地址
		var url = Base.serverUrl + "project/getUploadUrl";
		if(pas == 1){url = Base.serverUrl + "auditor/getUploadUrl";}
		//g.httpTip.show();
		$.ajax({
			url:url,
			data:condi,
			timeout: 30000, //超时时间设置，单位毫秒
			type:"POST",
			async:false,
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
			dataType:'json',
			context:this,
			success: function(data){
				var status = data.success || false;
				if(status){
					var d = data.result || [];
					g.domain1 = d.domain || '';
					g.upToken1 = d.upToken || '';
					window.uptoken = g.upToken1;
					var type = d.type || '';
					
				}
				else{
					var msg = data.message || "获取项目信息失败";
					//Utils.alert(msg);
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

	//定义七牛云上传
	function uploadToQiniu(bid){
		var bid = bid || '';//上传按钮id 不带#
		//var type = type || '';//资源类型 1课件资源 2或其他 其他资源
		 window.uploader = Qiniu.uploader({
			disable_statistics_report: false,
			runtimes: 'html5,flash,html4',// 上传模式，依次退化
			browse_button: bid,// 上传选择的点选按钮，必需
			//container: 'container',// 上传区域DOM ID，默认是browser_button的父元素
			//drop_element: 'container',// 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
			max_file_size: '1000mb',// 最大文件体积限制
			unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
			//save_key: false,
			//flash_swf_url: 'bower_components/plupload/js/Moxie.swf',//引入flash，相对路径
			dragdrop: true, // 开启可拖曳上传
			chunk_size: '4mb',// 分块上传时，每块的体积
			//multi_selection: !(moxie.core.utils.Env.OS.toLowerCase() === "ios"),
			uptoken : g.upToken1, // uptoken是上传凭证，由其他程序生成
			//uptoken_url: $('#uptoken_url').val(),// Ajax请求uptoken的Url，强烈建议设置（服务端提供）
			domain: g.domain1,// bucket域名，下载资源时用到，必需
			get_new_uptoken: false,// 设置上传文件的时候是否每次都重新获取新的uptoken
			auto_start: true,// 选择文件后自动上传，若关闭需要自己绑定事件触发上传
			log_level: 5,
			init: {
			  'BeforeChunkUpload': function(up, file) {
				//console.log("before chunk upload:", file.name);
			  },
			  'FilesAdded': function(up, files) { // 文件添加进队列后，处理相关的事情
				/*$('table').show();
				$('#success').hide();
				plupload.each(files, function(file) {
				  var progress = new FileProgress(file,
					'fsUploadProgress');
				  progress.setStatus("等待...");
				  progress.bindUploadCancel(up);
				});*/
			  },
			  'BeforeUpload': function(up, file) {// 每个文件上传前，处理相关的事情
				/*console.log("this is a beforeupload function from init");
				var progress = new FileProgress(file, 'fsUploadProgress');
				var chunk_size = plupload.parseSize(this.getOption(
				  'chunk_size'));
				if (up.runtime === 'html5' && chunk_size) {
				  progress.setChunkProgess(chunk_size);
				}*/
			  },
			  'UploadProgress': function(up, file) {// 每个文件上传时，处理相关的事情
				/*var progress = new FileProgress(file, 'fsUploadProgress');
				var chunk_size = plupload.parseSize(this.getOption(
				  'chunk_size'));
				progress.setProgress(file.percent + "%", file.speed,
				  chunk_size);*/
				  //Utils.alert(file.percent+'%');
				  //显示进度条
				  if($('.ecvc_progress_div').length <= 0){
					  $('body').append('<div class="ecvc_progress_div"><div class="ecvc_progress"></div></div>');
					}
				  $('.ecvc_progress').css('width',file.percent+'%');
				  
			  },
			  'UploadComplete': function() {//队列文件处理完毕后，处理相关的事情
					
			  },
			  'FileUploaded': function(up, file, info) {// 每个文件上传成功后，处理相关的事情
				//var progress = new FileProgress(file, 'fsUploadProgress');
				//console.log("response:", info.response);
				//progress.setComplete(up, info.response);
				// 返回信息
					$('.ecvc_progress_div').remove();
					var domain = up.getOption('domain');
					var res = JSON.parse(info.response);
					var sourceLink = domain +"/"+ res.key; //获取上传成功后的文件的Url
					$('#'+bid).attr('src',sourceLink);
					$('#'+bid).siblings('.head_imgs').css({'background':'url('+sourceLink+') no-repeat center center','background-size':'contain'});
					$('#'+bid).parents('.head_img_spam').addClass('active');
					$('#'+bid).siblings('.hide_head_imgs').css({'background':'url('+sourceLink+') no-repeat center center','background-size':'contain'});
					Utils.alert('上传成功！');
			  },
			  'Error': function(up, err, errTip) {//上传出错时，处理相关的事情
				  //$('table').show();
				  //var progress = new FileProgress(err.file, 'fsUploadProgress');
				  //progress.setError();
				  //progress.setStatus(errTip);
				  Utils.alert(errTip);
				}
			}
		  });
		
	}
	
	//秒换算 时分秒 hh:mm:ss
	 function formatSeconds(time){
		var hh;
		var mm;
		var ss;
	   //传入的时间为空或小于0
		if(time==null||time<0){
			return;
		}
		//得到小时
		hh=time/3600|0;
		time=parseInt(time)-hh*3600;
		if(parseInt(hh)<10){
			  hh="0"+hh;
		}
		//得到分
		mm=time/60|0;
		//得到秒
		ss=parseInt(time)-mm*60;
		if(parseInt(mm)<10){
			 mm="0"+mm;    
		}
		if(ss<10){
			ss="0"+ss;      
		}
		return hh+":"+mm+":"+ss;
	}
	
	//版本对比 对比两个字符的差异 a是被比较者 b是比较者
	/* function compareStr(a,b){
		var a = a || '';
		var b = b || '';
		var res = '';
		if(a == '' && b != ''){
			res = b;
		}else if( a != '' && b != ''){
			var aa = a.split('');
			var bb = b.split('');
			for(var i=0,len=aa.length;i<len;i++){
				var aai = aa[i] || '';
				var bbi = bb[i] || '';
				
			}
			
		}
		
		return res;
	} */
	
	
	//解析 年-月-日 上午 下午互返
	function setgetafternoon(datetime,is){
		var datetime = trim2(datetime || '');
		var is = is || '';// time 获取年-月-日 时间 af 获取年-月-日 上午/下午
		if(datetime == ''){return '';}
		var res = '';
		if(is == '' || is == 'time'){//获取年-月-日 时间
			var ias = '';
			if(datetime.indexOf('上午') > -1){ias = ' 00:00:00';}
			else if(datetime.indexOf('下午') > -1){ias = ' 13:00:00';}
			else{return '';}
			var date = datetime.split(' ') || [];
			date = date[0] || '';
			if(date != ''){res = date + ias;}
		}else if(is == 'af'){//获取年-月-日 上午/下午
			var ias = '';
			if(datetime.indexOf('-') <= -1 && datetime.indexOf('/') <= -1){return '';}
			var dateArray = datetime.split(' ') || [];
			time = dateArray[1] || '';
			var date = dateArray[0] || '';
			var date2 = date+' 13:00:00';
			var d1 = new Date(datetime.replace(/\-/g, "\/"));
			var d2 = new Date(date2.replace(/\-/g, "\/")); 
			if(d1 >= d2){
				ias = ' 下午';
			}else{
				ias = ' 上午';
			}
			res = date + ias;
		}
		return res;
	}
	//获取数组相应值的 序号 0 1 2 3
	function getArrayNum(ary,val){
		var ary = ary || '';
		var val = val || '';
		var res = '';
		if(ary == '' || val == ''){return '';}
		for(var i=0,len=ary.length;i<len;i++){
			var name = ary[i] || '';
			if(name == val){res = i;break;}
		}
		return res;
	}
		
	//判断权限 公共方法
	function replaceName(name){
		var name = name || '';
		if(name == ''){return '';}
		if(g.usrsave != ''){
			var res = '';
			var usr = JSON.parse(g.usrsave);
			if(name.indexOf(',') > -1){//说明 里面有逗号分隔
				name = name.split(',') || [];
				for(var i=0,len=name.length;i<len;i++){
					var nn = name[i] || '';
					var it = usr[nn] || '';
					res = res == '' ? it : res +','+it;
				}
				return res;
			}
			//没有逗号分隔的
			res = usr[name] || '';
			if(res != ''){return res;}
		}
		return '';
	}

	//setAjaxData();//给所有ajax请求增加请求参数
	
	//给所有ajax请求增加请求参数
	function setAjaxData(){
		var condi = {}
		condi.vm = '1';
		$.ajaxSetup({
			data:condi
		});
	}
	//获取网址的文件名称
	function convert(url){
		url=url.replace(/(.*\/)*([^.]+).*/ig,"$2");	
		return url;
	}
	//存储搜索条件 
	function saveOrClearCookie(is,biao){
		var is = is || '';
		var biao = biao || '';//标识
		if(is == 1){//清空条件
			$('.search_table').find('.com_input,.com_select').each(function(){
				var this_id = $(this).attr('id') || '';
				Utils.offLineStore.set(biao+this_id,'',false);
			});
		}else if(is == 2){//存储
			$('.search_table').find('.com_input,.com_select').each(function(){
				var this_id = $(this).attr('id') || '';
				var _val = $(this).val() || '';
				Utils.offLineStore.set(biao+this_id,_val,false);
			});
		}else if(is == 3){//赋值
			$('.search_table').find('.com_input,.com_select').each(function(){
				var this_id = $(this).attr('id') || '';
				var _val = Utils.offLineStore.get(biao+this_id,false) || '';
				$(this).val(_val);
			});
		}
	}
	 
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
		if(!result){$(res).remove();return true;}
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
						var email = d.email || '';
						if(huoqu == 'name'){id = name;}//获取value也是name
						if(huoqu == 'id'){if(email == ''){continue;}html += '<li tip="'+name+'">'+email+'</li>';}else{
							html += '<li tip="'+id+'">'+name+'</li>';
						}
						html2 += '<option value="'+id+'">'+name+'</option>';
					}
					if(type1 == 'li'){
						$(id1).find('li').remove();
						$(id1).append(html);
					}
					else{$(id1).html(html2);}
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
		condi.position = role;
		var url = Base.serverUrl + "user/getUserByPosition";
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
					if(type1 == 'li'){
						$(id1).find('li').remove();
						$(id1).append(html);
					}
					else{$(id1).html(html2);}
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
		
	//定义既可以下来 又可以搜索的下拉的选框----改进
	function setGetSearchInput2(id,boxid){
		var id = id || '';//'.class' or '#id' 
		var boxid = boxid || '';'';//'.class' or '#id' 
		if(id == '' || boxid == ''){return false;}
		//定义搜索
		if(!$(id).hasClass('input_select')){$(id).addClass('input_select')}
		var serHtml = '<input class="serinputClass" type="text" />';
		if($(boxid).find('.serinputClass').length <= 0){
			$(boxid).prepend(serHtml);
			$(boxid).find('.serinputClass').off().on('click',function(e){return false;stopPropagation(e);});
			$(boxid).find('.serinputClass').keyup(function(e){
				var _vth = $(this);
				var _li = $(boxid+' li');
				var _val = _vth.val() || '';
				_li.css({'height':'0px','line-height':'0px','padding':'0'});
				//_li.css('display','none');
				if(_val == '' || _li.length <= 0){_li.css({'height':'17px','line-height':'17px','padding':'7px 5px'});}
				$(boxid+' li:contains('+_val+')').css({'height':'17px','line-height':'17px','padding':'7px 5px'});
				/* _li.each(function(){//循环搜索
					var _tt = $(this);
					var _val2 = _tt.html() || '';
					var _if = _val2.indexOf(_val);
					if(_if <= -1){//不符合
						_tt.hide();
					}else{_tt.show();}
				}); */
				//stopPropagation(e);
			});
		}
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
		if(cls == ''){$('.stip_bg,.stip_box,.sbox,.choiseDanwei').fadeOut(300);}
		else{$(cls).fadeOut(0);}
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
		$('.choiseDanwei,.rilicolor_box').hide();
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
	$('.sbox').on('click','.check_box .i',function(){
		var _this = $(this) || {};
		if(_this.parents('.check_box').hasClass('active')){_this.parents('.check_box').removeClass('active')}else{_this.parents('.check_box').addClass('active')}
	});
	//选择部门人员弹窗 ----------------------start------------------
	//点击父元素 展开收起
	$('.sbox.tianjiarenyuan').on('click','.check_box',function(){
		$(this).closest('.floor').children('.floor').slideToggle();
	});
	
	//点击父元素 全选或全取消
	$('.sbox.tianjiarenyuan').on('click','.check_box .i',function(){
		var _this = $(this) || {};
		var obj = $(this).closest('.floor').find('.floor') || {};
		if(_this.parents('.check_box').hasClass('active')){
			obj.find('.check_box').addClass('active');
		}else{
			obj.find('.check_box').removeClass('active');
		}
		return false;
	});
	//右边框 全选
	$('.sbox.tianjiarenyuan').on('click','.addtum .check_box .i',function(){
		var _this2 = $('.stpart.right_st') || {};
		var obj = _this2.find('.peodiv') || {};
		if($(this).parents('.check_box').hasClass('active')){
			obj.find('.peoone').find('.check_box').addClass('active');
		}else{
			obj.find('.peoone').find('.check_box').removeClass('active');
		}
	});
	//判断已添加数字
	function addedNum(){
		var _this2 = $('.stpart.right_st') || {};
		var obj = _this2.find('.peodiv') || {};
		var num = obj.find('.peoone').length || 0;
		$('#addedNum').html(num);
	}
	//搜索 左右
	$('.sbox.tianjiarenyuan').on('click','.serabtn',function(){
		var _this = $(this) || {};
		var input = _this.parents('.stpart').find('.sesinput') || {};
		var obj = _this.parents('.stpart').find('.peodiv') || {};
		var res = _this.parents('.stpart').find('.resdiv') || {};
		var val = trim2(input.val() || '');
		if(val == ''){Utils.alert('搜索内容不能为空！');return false;}
		var html = '';
		obj.find('.peoone').each(function(){
			var _tex = $(this).find('.check_box').find('.mar').html() || '';//姓名
			if(_tex.indexOf(val) > -1){html += $(this).prop('outerHTML');}
		})
		res.html(html);
	});
	//添加
	$('.sbox.tianjiarenyuan').on('click','.staddbtn.add',function(){
		var _this1 = $('.stpart.left_st') || {};
		var _this2 = $('.stpart.right_st') || {};
		var obj = _this2.find('.peodiv') || {};
		var html = '';
		var sameHtml = '';//存有多少重复的
		_this1.find('.peoone').each(function(){
			if(!$(this).find('.check_box').hasClass('active')){return true;}//未选中的跳过
			var _tex = $(this).find('.check_box').find('.mar').html() || '';//姓名
			obj.find('.peoone').each(function(){
				var _name = $(this).find('.check_box').find('.mar').html() || '';//姓名
				if(_tex == _name){sameHtml = sameHtml == '' ? _name : sameHtml+','+_name ;return false;}
			});//循环判断是否有重复项
			if(sameHtml != ''){return false;}
			html += $(this).prop('outerHTML');
		});
		if(sameHtml != ''){Utils.alert(sameHtml+' 已经添加过了！');return false;}
		if(html != '')obj.html(html);
		addedNum();//判断已添加数字
	});
	//删除
	$('.sbox.tianjiarenyuan').on('click','.staddbtn.del',function(){
		var _this2 = $('.stpart.right_st') || {};
		var obj = _this2.find('.peodiv') || {};
		obj.find('.peoone').each(function(){
			if(!$(this).find('.check_box').hasClass('active')){return true;}//未选中的跳过
			$(this).remove();
		});
		addedNum();//判断已添加数字
	});
	//获取已经添加的人员值
	function getselected(){
		var _this2 = $('.stpart.right_st') || {};
		var obj = _this2.find('.peodiv') || {};
		var valall = '';
		obj.find('.peoone').each(function(){
			if(!$(this).find('.check_box').hasClass('active')){return true;}//未选中的跳过
			var aid = $(this).find('.check_box').attr('aid') || '';
			if(aid != ''){valall = valall == '' ? aid : valall+','+aid ;}
		});
		return valall;
	}
	//选择部门人员弹窗 ----------------------end------------------
	
	
	//公共单选框
	$('.common_body,.xiangmuguanli').on('click','.common_radio',function(){
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
	window.setGetSearchInput2 = setGetSearchInput2;
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
	window.saveOrClearCookie = saveOrClearCookie;
	window.replaceName = replaceName;
	window.getRadioVal = getRadioVal;
	window.setRadioVal = setRadioVal;
	window.getArrayNum = getArrayNum;
	window.setgetafternoon = setgetafternoon;
	window.uploadToQiniu = uploadToQiniu;
	window.formatSeconds = formatSeconds;
	window.uploadqiniu = uploadqiniu;
	window.setCondi = setCondi;
	window.setCondiVal = setCondiVal;
	window.setInfoCondi = setInfoCondi;
	window.setqiniu = setqiniu;
	window.setImgVal = setImgVal;
	window.getselected = getselected;//获取选择的人员
});

