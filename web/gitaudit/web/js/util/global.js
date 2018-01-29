/**
 * 全局类
 * 可以处理和存放全局配置
 */
var D = function(){return{}}();
var Global = function(){
	/** 生成id用的数字 */
	var idSeed = 0;

	/** 应用名称 */
	var applicationName = function(){
		var path = location.pathname;
		if(path.indexOf('/') == 0){
			path = path.substring(1);
		}
		return path.split('/')[0];
	}();
	
	/** 解决IE下没有console输出的问题 */
	if(!window.console){
		window.console = {
			log : function(){},
			warn : function(){},
			error : function(){}
		};
	}
	
	return {

		pageSize: 20,
		
		/** ip或域名，如 100.0.0.17 */
		host: location.hostname,
		
		/** 端口号，如 8080 */
		port: location.port,
		
		/** 应用名，如 mamplatform */
		appName: applicationName,
		
		/** 应用根路径，如 /mamplatform */
		appPath: '/' + applicationName,

		/** 定时轮询的计时器 */
		loopTimer: null,
		
		/** 是否调试模式 */
	    debug: false,
		
		/** 当前是否是手机客户端 */
		isMobile: function(){
			var u = navigator.userAgent;
			return !!u.match(/AppleWebKit.*Mobile/) || !!u.match(/Windows Phone/) || !!u.match(/Android/) || !!u.match(/MQQBrowser/)
		}(),
		
		/**
		 * 初始化方法
		 */
		init: function(){
			var c = this;
			//c.loop();
			
			//c.initUserAgent();
            c.initEvent(c);
		},

        initEvent: function(c){
            $(document).on("click",".cre-todo",function(){
                c.todo();
            });
        },
		
		/**
		 * 初始化浏览器的useragent判断结果
		 * ie11下jquery校验是否是否是msie失败，所以加上这个补丁
		 */
		initUserAgent: function(){
			var ua = navigator.userAgent || '';
			ua = ua.toLowerCase();
			if (ua.indexOf('trident') != -1) {
				$.browser.msie = true;
			}
		},
		
		/** 是否已超时 */
		hasTimeOut: false,
		
		/**
		 * 定时向后台发送轮询
		 */
		loop: function(){
			var sendRequest = function(){
				if (Global.hasTimeOut) {
					return;
				}
				Ajax.call({
					url: 'loop.action', 
					p: {timestamp: Global.timestamp},
					f: function(data){
						if (data.loopTimeOut) {
							Global.stopLoop();
						} else {
							Global.timestamp = data.timestamp;
						}
					}
				});
			};
			
			//如果没有定义过定时器，则启用一个
			if (!Global.loopTimer && !Global.hasTimeOut) {
				Global.loopTimer = setInterval(sendRequest, 30000); 
			}
		},
		
		stopLoop: function(){
			Global.hasTimeOut = true;
			if (Global.loopTimer) {
				clearInterval(Global.loopTimer);
				Global.loopTimer = null;
			}
		},
		

		/**
		 * 字符串转json对象的方法
		 */
		string2json: function(string){
			if (string == undefined || string == null) {
				return null;
			}
			return $.parseJSON(string);
		},
		
		/**
		 * json对象转字符串的方法
		 */
		json2string: function(obj){
			return JSON.stringify(obj);
		},
		/**
		 * 获取应用路径
		 * @return {TypeName} 
		 */
		getRootPath : function() {
			var strFullPath = window.document.location.href;
			var strPath = window.document.location.pathname;
			var pos = strFullPath.indexOf(strPath);
			var prePath = strFullPath.substring(0, pos);
			var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
			return (prePath + postPath + '/');
		},
		/**
		 * 图片加载失败时的处理:
		 * 1、尝试加载图片errorUrl属性对应的url
		 * 2、如果第一步尝试失败，则加载默认的图片加载失败图片
		 * PS：errorCount是计数器，避免进入死循环判断
		 */
		onImgError: function(img){
			//记录原有路径
			var originalSrc = img.getAttribute('originalSrc');
			var src = img.getAttribute('src');
			if(!originalSrc){
				img.setAttribute('originalSrc', src);
				originalSrc = src;
			}
			
			//如果是空图片，则不显示，避免显示一个很大的“图片未找到”
			if (src.indexOf('-.jpg') == src.length - 5) {
				img.style.display = 'none';
				return;
			}
			
			var noImgUrl = '/fe/images/dayangit/noimg-125x175.jpg';
			
			var errorUrl = img.getAttribute('errorUrl');
			var errorCount = parseInt(img.getAttribute('errorCount') || '0');
			if (errorCount >= 2) {
                img.src = noImgUrl;
                return;
			}
			
			img.setAttribute('errorCount', errorCount + 1);	//立即修改errorCount，img的src变了之后，如果还是加载失败，会立即调用onImgError，因此需要提前设置errorCount
			var ccIcon = Global.getCcIcon(originalSrc);
			
			if (errorCount == 0 && ccIcon) {
				img.src = ccIcon;
			} else if ((errorCount == 1 || !ccIcon) && errorUrl) {
				img.src = errorUrl;
			} else {
                img.src = noImgUrl;
			}
		},
		
        onLowImgError: function(obj, iconUrl){
            obj.src =  iconUrl;
        },
        
        /**
         * 处理异常：
         * 1、在状态栏中输出异常信息
         */
        showException: function(e){
        	if(!e){
        		return;
        	}
        	var statusText = e.name + '\t' + e.message;
        	window.status = statusText;
        },
        
        /**
		 * 判断一个字符串或数字是否在指定的范围内
		 * @param obj 要比较的字符串或数字
		 * @param values 包含多个备选比较值的数组
		 */
        inValues: function(obj, values){
			if(!values){
				return false;
			}
			for (var i = 0; i < values.length; i++) {
				if (obj == values[i]) {
					return true;
				}
			}
			return false;
		},
        
		/**
		 * 将后台返回对象中的属性复制成Global对象自己的属性
		 */
		cloneAttributes: function(attributes){
			$.extend(Global, attributes);
            if ( Global.dictionary ){
                $.extend(D, Global.dictionary);
            }

		},
		
		/**
		 * 校验是否已加载了某个jquery插件
		 */
		hasJQueryPlugin: function(name){
			return !!$.prototype[name] || window[name];
		},
		
		/**
		 * 校验某个jquery组件或闭包类是否存在，如果不存在，加载其对应js、css文件。
		 * @param para 包含name、jsFiles、cssFiles属性，name是组件名称，后两个是文件路径数组
		 */
		checkAndLoadFileAsync: function(para){
			var name = para.name;
			
			if (Global.hasJQueryPlugin(name)) {
				return;
			}
			
			var jsFiles = para.jsFiles;
			var cssFiles = para.cssFiles;
			if (jsFiles) {
				for (var i = 0; i < jsFiles.length; i++) {
					var file = jsFiles[i];
					Global.loadJsAsync(file)
				}
			}
			if (cssFiles) {
				for (var i = 0; i < cssFiles.length; i++) {
					var file = cssFiles[i];
					Global.loadCssAsync(file)
				}
			}
		},
		
		loadJsAsync: function(file){
			if (file) {
	    		document.write('<script type="text/javascript" src="' + file + '"></script>\n');
			}
		},
		
		loadCssAsync: function(file){
			if (file) {
				document.write('<link type="text/css" rel="stylesheet" href="' + file + '"/>\n');
			}
		},
		
        /**
		 * 判断字符串是否为合法字符串
		 * 合法字符串包括：空格、[]、()、""、‘’、-、下划线、数字、字母、汉字、：、.·
		 * 
		 * AHTHOR:liangyangsheng
		 * TIME:2013-07-04
		 */
        isLegitimate:function(val){
			return /^[\u0391-\uFFE5\w-\s_\(\)\[\]"'%￥@~\$,:.·]*$/.test(val);
		},
		/**
		 * 和isLegitimate配合使用找出非法字符
		 * 合法字符串包括：空格、[]、()、""、‘’、-、下划线、数字、字母、汉字、：、.·
		 * 
		 * AHTHOR:liangyangsheng
		 * TIME:2013-07-04
		 */
		getNotLegitimateStr:function(s){
		
			return s.replace(/[\u0391-\uFFE5\w-\s_\(\)\[\]"'%￥@~\$,:.·]*/g, "");
		},
		
		/**
		 * 返回字符串长度区分中英文字符
		 * @param val
		 * @returns
		 * AHTHOR:liangyangsheng 
		 * TIME:2013-09-23
		 */
		getByteLen:function(val) { 
			val = val+"";
			var len = 0; 
			var valArr = val.split("");
			for (var i = 0; i < valArr.length; i++) { 
				if (valArr[i].match(/[^x00-xff]/ig) != null) //全角 
					len += 2; 
				else 
					len += 1; 
			} 
			return len; 
		} ,
		/**
		 * 判断字符串的长度是否超过限定字符
		 * 
		 * AHTHOR:liangyangsheng 
		 * TIME:2013-09-23
		 */
		isGreaterThanLimit:function(str,limit){
			
			if(typeof(limit) == "undefined"){
				limit = 256;
			}
			str = str+"";
			if(Global.getByteLen(str) <= limit){
				return false;
			}
			return true;
		},
		
		/**
		 * 去掉字符串左侧空格
		 * 
		 * AHTHOR:liangyangsheng 
		 * TIME:2013-07-04
		 */
		Ltrim : function(s){ 
			return s.replace(/^\s+/g, "");
		},
		
		/**
		 * 普通数组排序
		 * @param array
		 * @param desc
		 * @returns
		 * AHTHOR:liangyangsheng 
		 * TIME:2013-10-15
		 */
		ArraySort:function(array,desc){
			function comparison(value1,value2){
				 	var result=0;
		            if(parseInt(value1)&&parseInt(value2))
		            {
		                result= parseInt(value1)-parseInt(value2);
		            }
		            else
		            {
		                result= value1.localeCompare(value2);
		            }
		            if(desc)
		                return result;
		            else
		                return -result;
			}
			array.sort(comparison);
		},
		
		/**
		 * 对象类型的数组排序 可以针对对象的某个属性进行排序
		 * @param array
		 * @param objAttr
		 * @param desc
		 * @returns
		 * AHTHOR:liangyangsheng 
		 * TIME:2013-10-15
		 */
		ObjArraySort:function(array,objAttr,desc){
			function comparisonObj (objAttr){
				
				return function(obj1,obj2){
					 var value1 =  obj1[objAttr];
					 var value2 =  obj2[objAttr];
					 var result=0;
			            if(parseInt(value1) && parseInt(value2)){
			                result= parseInt(value1)-parseInt(value2);
			            }else{
			                result = value1.localeCompare(value2);
			            }
			            if(desc){
			            	return result;
			            }else{
			            	return -result;
			            }
				}
			}
			array.sort(comparisonObj(objAttr));
		},
		
		/**
		 * 去掉字符串右侧空格
		 * 
		 * AHTHOR:liangyangsheng 
		 * TIME:2013-07-04
		 */
		Rtrim: function(s){ 
			return s.replace(/\s+$/g, "");
		},
		/**
		 * 判断字符串是否为空
		 * 
		 * AHTHOR:liangyangsheng 
		 * TIME:2013-07-04
		 */
       isEmptyString : function(s){
    	   s = s+"";
    	   s = $.trim(s);
    	   if(s!="")
               return false;
           return true;
        },

        getAppURL: function(){
            return location.protocol + "//" + location.host + location.pathname.substring(0, location.pathname.indexOf("/", 1)) + "/";
        },

        getAppURLById: function(appId){
            if ( !Global.appList || Global.appList.length == 0 )
                return;
            if ( !appId || appId.length == 0 )
                return;

            for ( var i=0; i<Global.appList.length; i++ ){
                var app = Global.appList[i];
                if ( app.id && app.id.toUpperCase() ==  appId.toUpperCase() ){
                    return app.url;
                }
            }
            return null;
        },

        getAppById: function(appId){
            if ( !Global.appList || Global.appList.length == 0 )
                return;
            if ( !appId || appId.length == 0 )
                return;

            for ( var i=0; i<Global.appList.length; i++ ){
                var app = Global.appList[i];
                if ( app.id && app.id.toUpperCase() ==  appId.toUpperCase() ){
                    return app;
                }
            }
            return null;
        },

        hasApp: function(appId){
            if ( !Global.appList || Global.appList.length == 0 )
                return;
            if ( !appId || appId.length == 0 )
                return;

            for ( var i=0; i<Global.appList.length; i++ ){
                var app = Global.appList[i];
                if ( app.id && app.id.toUpperCase() ==  appId.toUpperCase() ){
                    return true;
                }
            }
            return false;
        },

        initAppList: function(callbackFun){
            Ajax.callRest({
                url: "api/app/load",
                p: {applicationParas: {
                    status: 1
                }},
                f: function (response) {
                    Global.appList = response.applicationList;
                    callbackFun(Global.appList);
                }
            });
        },

        /** 获取MAMResource 中的值，存入Global.dictionaryMap中
         * 根据download.application.status，和value数组[0,1,2]两个参数得到数组对象[{key0:value0,key1:value1}]
         *  */
        getDictionaryOptions: function(enumID,optionValues){
            var dictionarys = Global.dictionaryMap;
            var dictionaryOptions = [];
            if ( !dictionarys || !optionValues)
                return [];

             for(var i = 0 ;i<optionValues.length;i++){
             	var optionkey = optionValues[i];
             	var optionvalue = dictionarys[enumID+'.'+optionkey];
             	if(optionvalue)
             		dictionaryOptions.push({'key':optionkey,'value':optionvalue})
             }
            return dictionaryOptions;
        },
        renderComboboxColumn:function (options,labelText, controllerID, conditionContainer){
    			$(conditionContainer).append('<label class="' + controllerID + '-label">' + labelText + '</label>');
	    		var columnNameSelect = $('<select id="' + controllerID + '"  class="combobox"></select>');
	    		columnNameSelect.append('<option value="">' + D["pub.operate.please.select"] + '</option>');
	    		var optionItem = '<option value ="${key}">${value}</option>';
	            $.template( "optionItem", optionItem );
	            $.tmpl("optionItem", options).appendTo(columnNameSelect);
	            
	            columnNameSelect.appendTo(conditionContainer);
	            columnNameSelect.combobox({"id": controllerID+"-input"});
    	},
    	
    	//判断是否闰年 
		isRenYear:function(year){ 
			return(0 == year%4 && (year%100 !=0 || year%400 == 0));
		},
		
		/** 验证日期格式是否正确
		 *  thisVal：日期值,hasHHmmss:是否含有时分秒
		 *  return flag - true：合法,false:不合法
		 */
		validateDateAllow:function(thisVal,hasHHmmss){
			var thisCount = thisVal.length;
			var totalCount = 10;
			if(hasHHmmss){
				totalCount = 19;
			}
			if(thisCount > totalCount){
				thisVal = thisVal.substr(0 , totalCount);
				thisCount = thisVal.length;
				return false;// 可以配合css限制输入框最大长度为totalCount,例如 maxLength=10
			}
			var thisValArr = thisVal.split("");
			var isIntReg = /^\d$/;
			var isLineReg = /^-$/;
			var isColonReg = /^:$/;
			var isBlankReg = /^\s$/;
			var flag = true;
			for(var i = 0 ; i < thisCount ; i++){
				if(i < 4){
					if(!isIntReg.test(thisValArr[i])){
						flag = false;
						break;
					}
				}else if(i == 4 || i == 7 ){
					if(!isLineReg.test(thisValArr[i])){
						flag = false;
						break;
					}
				}else if(i == 5){
					if(!isIntReg.test(thisValArr[i])){
						flag = false;
						break;
					}else if(parseInt(thisValArr[i]) == 0 || parseInt(thisValArr[i]) == 1){
						continue;
					}else{
						flag = false;
						break;
					}
				}else if(i == 6){
					if(!isIntReg.test(thisValArr[i])){
						flag = false;
						break;
					}else if(parseInt(thisValArr[5]) == 0){//前一个元素为0
						continue;
					}else if(parseInt(thisValArr[5]) == 1 && parseInt(thisValArr[i]) <= 2){//前一个元素为1
						continue;
					}else{
						flag = false;
						break;
					}
				}else if(i == 8){
					if(!isIntReg.test(thisValArr[i])){
						flag = false;
						break;
					}else if(parseInt(thisValArr[5] + thisValArr[6]) == 2 && thisValArr[i]< 3){
						continue;
					}else if(parseInt(thisValArr[5] + thisValArr[6]) != 2 && thisValArr[i] <= 3){
						continue;
					}else{
						flag = false;
						break;
					}
				}else if(i == 9){
					if(!isIntReg.test(thisValArr[i])){
						flag = false;
						break;
					}else if(parseInt(thisValArr[5] + thisValArr[6]) == 1 ||
								parseInt(thisValArr[5] + thisValArr[6]) == 3 ||
								parseInt(thisValArr[5] + thisValArr[6]) == 5 ||
								parseInt(thisValArr[5] + thisValArr[6]) == 7 ||
								parseInt(thisValArr[5] + thisValArr[6]) == 8 ||
								parseInt(thisValArr[5] + thisValArr[6]) == 10||
								parseInt(thisValArr[5] + thisValArr[6]) == 12){//31天的月
						if(parseInt(thisValArr[i-1] + thisValArr[i]) > 31){
							flag = false;
							break;
						}
						
					}else if(parseInt(thisValArr[5] + thisValArr[6]) == 2 ){//2月
						if(Global.isRenYear(parseInt(thisValArr[0] + thisValArr[1] + thisValArr[2] + thisValArr[3])) && parseInt(thisValArr[i-1] + thisValArr[i]) > 29){
							flag = false;
							break;
						}else if((!Global.isRenYear(parseInt(thisValArr[0] + thisValArr[1] + thisValArr[2] + thisValArr[3]))) && parseInt(thisValArr[i-1] + thisValArr[i]) > 28){
							flag = false;
							break;
						}
						
					}else if(parseInt(thisValArr[5] + thisValArr[6]) == 4 ||
								parseInt(thisValArr[5] + thisValArr[6]) == 6 ||
								parseInt(thisValArr[5] + thisValArr[6]) == 9 ||
								parseInt(thisValArr[5] + thisValArr[6]) == 11 ){
						if(parseInt(thisValArr[i-1] + thisValArr[i]) > 30){
							flag = false;
							break;
						}
					}
					continue;
				}else if(i == 10){
					if(!isBlankReg.test(thisValArr[i])){
						flag = false;
						break;
					}
					continue;
				}else if(i == 11){
					if(!isIntReg.test(thisValArr[i])){
						flag = false;
						break;
					}else if(parseInt(thisValArr[i]) > 2){
						flag = false;
						break;
					}
					continue;
				}else if(i == 12){
					if(!isIntReg.test(thisValArr[i])){
						flag = false;
						break;
					}else if(parseInt(thisValArr[i-1] + thisValArr[i]) > 23){
						
						flag = false;
						break;
					}
					continue;
				}else if(i == 13 || i == 16){
					if(!isColonReg.test(thisValArr[i])){
						flag = false;
						break;
					}
					continue;
				}else if(i == 14 || i == 17){
					if(!isIntReg.test(thisValArr[i])){
						flag = false;
						break;
					}else if(parseInt(thisValArr[i]) >= 6){
						flag = false;
						break;
					}
					continue;
				}else if(i == 15 || i == 18){
					if(!isIntReg.test(thisValArr[i])){
						flag = false;
						break;
					}else if(parseInt(thisValArr[i-1] + thisValArr[i]) > 59){
						flag = false;
						break;
					}
					continue;
				}
			}
			return flag;			
		},
		
		/** 验证时分秒格式是否正确
		 *  return flag - true：合法,false:不合法
		 */
		validateSimpleHHmmss:function(thisVal){
			var thisCount = thisVal.length;
			if(thisCount > 8){
				thisVal = thisVal.substr(0 , 8);
				thisCount = thisVal.length;
			}
			var thisValArr = thisVal.split("");
			var isIntReg = /^\d$/;
			var isColonReg = /^:$/;
			var flag = true;
			for(var i = 0 ; i < thisCount ; i++){
				thisIndex = i;
				if(i == 0){
					if(!isIntReg.test(thisValArr[i])){
						flag = false;
						break;
					}else if(parseInt(thisValArr[i]) > 2){
						flag = false;
						break;
					}
					continue;
				}else if(i == 1){
					if(!isIntReg.test(thisValArr[i])){
						flag = false;
						break;
					}else if(parseInt(thisValArr[i-1] + thisValArr[i]) > 23){
						
						flag = false;
						break;
					}
					continue;
				}else if(i == 2 || i == 2){
					if(!isColonReg.test(thisValArr[i])){
						flag = false;
						break;
					}
					continue;
				}else if(i == 3 || i == 6){
					if(!isIntReg.test(thisValArr[i])){
						flag = false;
						break;
					}else if(parseInt(thisValArr[i]) >= 6){
						flag = false;
						break;
					}
					continue;
				}else if(i == 4 || i == 7){
					if(!isIntReg.test(thisValArr[i])){
						flag = false;
						break;
					}else if(parseInt(thisValArr[i-1] + thisValArr[i]) > 59){
						flag = false;
						break;
					}
					continue;
				}
			}
			return flag;
		},
		
		/**
		 * 大洋播放器播放文件，支持视音频分离文件的播放
		 */
		playFilePathList: function(filePathList, inpoint, outpoint, player){
            /*待封装 jquery 1.9判断浏览器版本
            $.browser.msie = /^msie$/.test(navigator.userAgent.toLowerCase());
			if(!$.browser.msie){ //为了在firefox开发
       			return;
       		}*/
		    var pathCount = filePathList.length;
		    if (pathCount == 1) {
		    	var fullName = filePathList[0].fullPath || '';
			    player.Open(fullName || '', inpoint, outpoint);
		    } else {
		    	var isContainAudioFile = Global.isContainAudioFile(filePathList);
		    	if (isContainAudioFile) {
		    		var audioFileIndex = 1;
		    		for (var i = 0; i < filePathList.length; i++) {
		    			var file = filePathList[i];
		    			var path = file.fullPath;
		    			var fileType = file.fileType;
		    			if (path) {
		    				if (Global.isAudioFile(fileType)) {
					    		eval("player.AddFileA" + audioFileIndex++ + "(path, inpoint, outpoint)");
		    				} else {
		    					player.AddFileVideo(path, inpoint, outpoint);
		    				}
		    			}
		    		}
                	player.OpenFileList();
		    	} else {
		    		//TODO 全是视频文件，即多段文件播放，后台还未支持
		    	}
		    }
		},
		
       /**
        * 判断是否包含音频文件
        */
		isContainAudioFile: function(files){
			for (var i = 0; i < files.length; i++) {
				var fileType = files[i].fileType;
				if (Global.isAudioFile(fileType)) {	
					return true;					
				}
			}
			return false;
		},
		
		/**
		 * 判断文件类型是否是音频
		 */
		isAudioFile: function(fileType){
			return 	fileType == 1 || fileType == 6;		//单声道或立体声
		},
	
		/**
		 * 删除某个dom，jquery的remove方法删不干净
		 */
		removeDom: function(dom){
			if(dom){
				var parent = dom.parentNode;
				if (parent) {
					parent.removeChild(dom);
				}
			}
		},

        /**
         *
         */
        getResourceIdOfExtendAttributes: function(item){
            if ( !item )
                return null;

            var extendAttributes = item.extendAttributes;
            if ( !extendAttributes || extendAttributes.length == 0 )
                return;


            for ( var i=0; i<extendAttributes.length; i++ ){
                var extendAttribute = extendAttributes[i];
                if ( extendAttribute.id == "ResourceId" ){
                    return extendAttribute.value;
                }
            }

            return null;
        },

        /**
         * 提交到avid
         */
        submitToAvid: function(id){
        	if (!id) {
        		return;
        	}
        	Ajax.call({
        		url: 'submitToAvid',
        		p: {objectId: id},
        		f: function(data){
        			var status = data.status;
    				if (status == 0) {
    					Global.tip('已提交发送到Avid请求');
    				} else {
    					Global.alert('发送到Avid失败');
    				}
        		}
        	});
        },

        validateSelectItems:function(selectedItems){
            if (!selectedItems || selectedItems.length == 0 ){
            	return {allow: false, text: "请至少选择一个资源."};
            }else{
                for (var i = 0; i < selectedItems.length; i++) {
                    var item = selectedItems[i];
                    if ( item.objectType == GlobalConstants.OBJECT_TYPE_PRIVATEFOLDER ){
                    	return {allow: false, text: "不能选择文件夹，请选择资源条目进行操作."};
                    }
                }
            }
        },

        operatePretreat: function(operateId, selections, $this, $target, configData, userParams, callback){
            var simpleObjectItems = [];
            for (var i = 0; i < selections.length; i++) {
                var item = selections[i];
                var simpleObjectItem = {};
                simpleObjectItem.id = item.id;
                simpleObjectItem.name = item.name;
                simpleObjectItem.objectType = item.objectType;
                simpleObjectItem.type = item.type;
                simpleObjectItems.push(simpleObjectItem);
            }

            var needPretreat = false;
            var operateType = "";
            if ( operateId == 'RENAME_RESOURCE' || operateId == 'ADD_RESOURCE_FILE' || operateId == 'DELETE_RESOURCE_FILE' ){
                needPretreat = true;
                operateType = 'edit';
            } else if ( operateId == 'REMOVE_RESOURCE_TO_RECYCLEBIN' || operateId == 'DELETE_RESOURCE_FOREVER'
                || operateId == 'CLEAR_RECYCLEBIN' || operateId == 'DELETE_RESOURCE' || operateId == 'RECOVERY' ){
                needPretreat = true;
                operateType = 'delete';
            } else if ( operateId == 'SET_RESOURCE_ACL' || operateId == 'SET_RESOURCE_SECURITY' ){
                needPretreat = true;
                operateType = 'acl';
            } else if ( operateId == 'QUICKCUT' ){
                needPretreat = true;
                operateType = 'play';
            }

            if ( !needPretreat ){
                callback(operateId, selections, $this, $target, configData, userParams);
                return;
            }

            Ajax.call({
                url: 'userCanOperate',
                p: {objects:JSON.stringify(simpleObjectItems), operateId: operateType},
                mergePara: false,
                f: function(data){
                    var status = data.success;
                    if (status) {
                        callback(operateId, selections, $this, $target, configData, userParams);
                    } else {
                        Global.error('抱歉，您无法对此资源执行该操作.');
                    }
                }
            });
        },

        userCanOperate: function(resourceId, operateType, callback){
            var simpleObjectItems = [{
                id: resourceId
            }];
            Ajax.call({
                url: 'userCanOperate',
                p: {objects:JSON.stringify(simpleObjectItems), operateId: operateType},
                mergePara: false,
                f: function(data){
                    var status = data.success;
                    if (status) {
                        callback();
                    } else {
                        Global.error('抱歉，您无法对此资源执行该操作.');
                    }
                }
            });
        },

		getUserName: function(id) {
			var userName = Global.allUserMap[id];
			if (!userName)
				return '';
			return userName;
		},

		getMemberNames: function (memberIds) {
			var memberIdList = JSON.parse(memberIds);
			var members = [];
			for (var i = 0; i < memberIdList.length; i ++) {
				var userName = Global.allUserMap[memberIdList[i]];
				if (userName)
					members.push(userName);
				else
					members.push(memberIdList[i]);
			}
			return members.join(',');
		},

		initSelect: function($select) {
			$select.select2({
				formatNoMatches: function() {
					return "没有选项";
				},
				placeholder: "请选择...",
				minimumResultsForSearch: -1,//去掉搜索框
				allowClear: true
			});

		},

		initSelectWithSearch: function($select) {
			$select.select2({
				formatNoMatches: function() {
					return "没有选项";
				},
				placeholder: "请选择...",
				//minimumResultsForSearch: -1,//去掉搜索框
				allowClear: true
			});

		},

		initDatePicker: function($datePicker) {
			$datePicker.datetimepicker({
				pickerPosition: "bottom-left",
				minView: 2,
				format:'yyyy-mm-dd',
				language: 'zh-CN',
				todayHighlight: true,
				todayBtn: true,
				autoclose: true
			});

		},

		refreshControlsByPrivilege: function() {
			if (Global.isUserSystemAdmin())
				return;
			$("a").each(function() {
				var pid = $(this).attr("pid");
				if (!pid || pid == '')
					return;
				if (!Global.userPrivileges) {
					$(this).remove();
					return;
				}
				if (Global.userPrivileges[pid] != 1) {
					$(this).remove();
				}
			});
			$("button").each(function() {
				var pid = $(this).attr("pid");
				if (!pid || pid == '')
					return;
				if (!Global.userPrivileges) {
					$(this).remove();
					return;
				}
				if (Global.userPrivileges[pid] != 1) {
					$(this).remove();
				}
			});
		},

		isUserSystemAdmin: function() {
			if (!Global.userPrivileges)
				return false;
			if (Global.userPrivileges["SYSTEM_ADMIN"] != 1)
				return false;
			return true;
		},

		userHasPrivilege: function(privilegeId) {
			if (!Global.userPrivileges)
				return false;
			if (Global.userPrivileges[privilegeId] != 1)
				return false;
			return true;
		},

		initTableLayout: function() {
			if (!Global.pageTableConfig)
				return;
			$("table").each(function(){
				var $table = $(this);
				var tableId = $table.attr("tableId");
				var tableConfig = Global.pageTableConfig[tableId];
				if (!tableConfig)
					return;
				if (!tableConfig.columnWidths)
					return;
				var columnWidths = tableConfig.columnWidths.split(",");
				var $columns = $table.find("th");
				if (columnWidths.length != $columns.length) {
					console.log("配置文件里的列宽配置和页面的列数量不相等");
					return;
				}
				for (var i = 0; i < columnWidths.length; i ++) {
					var width = columnWidths[i];
					if (width == "0" || width == "")
						continue;
					$($columns[i]).css("width", width);
				}
			});
		},

        empty: null
	};
	
	
}();

$(function(){
	Global.init();
});
