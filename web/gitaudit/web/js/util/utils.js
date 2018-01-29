/**
 * 工具类
 * 需要引入 /fe/js/dayangit/prototype-patch.js 来保证字符串的一些方法生效
 */
var Utils = function(){
	
	return {
		/**
		 * java日期对象转换成日期字符串
		 */
		dateRenderer: function(v){
			if(v && v.time){
				var d = new Date(v.time);
				var month = parseInt(d.getMonth()) + 1;
				var Str = d.getFullYear() + "-" + month + "-" + d.getDate();
				return Str;
			} else if ( v && v.indexOf("T") != -1 ){
				return v.replaceAll('T', ' ');
			} else {
                return v;
            }
				
		},
		
		/**
		 * java日期对象转换成日期和时间字符串
		 */
		dateTimeRenderer: function(v){
			var c = Utils;
			if(v && v.time){
				var d = new Date(v.time);
				var month = parseInt(d.getMonth()) + 1;
				var Str = d.getFullYear() + "-" + c.appendZero(month) + "-" + c.appendZero(d.getDate()) + " " + c.appendZero(d.getHours()) + ":" + c.appendZero(d.getMinutes()) + ":" + c.appendZero(d.getSeconds());
				Str = Str.replaceAll('T', ' ');
				return Str;
			} else if ( v && v.indexOf("T") != -1 ){
				return v.replaceAll('T', ' ');
			} else {
				return v;
			}
				
		},
		
		/**
		 * 日期补零
		 */
		appendZero: function(v){
			if(v < 10){
				return "0" + v;
			}else{
				return v;
			}
		},
		
		/**
		 * 帧数转换成时码
		 */
		frameRenderer: function(v){
			return Utils.frameToTimeCode(v, 1)
		},
		
		/**
		 * 节目/任务名称renderer，如果记录中包含objectid，则可以显示肖像缩略图
		 */
		nameRenderer: function(v, md, r){
			var objectId = r.get('objectId');
			var ccid = r.get('ccid');
			
			//如果状态是被之后的环节打回，则名称标红显示；如果是被当前环节打回，则名称标蓝(修改单元格css)
			if(Global.isCCTVMode){
				var backFromActivityType = r.get('backFromActivityType');
				var currentActivityType = Global.getCurrentActivityType();
				if (backFromActivityType && (backFromActivityType == currentActivityType)) {
					md.css = 'blueFont';
				}
				if (backFromActivityType && (backFromActivityType > currentActivityType)) {
					md.css = 'redFont';
				}
			} else {
				var status = r.get('status');
				if(status == 3)	md.css = 'redFont';
				if(status == 5)	md.css = 'blueFont';
			}
			
			if(objectId){
				md.attr += 'ext:qtip="<img src=' + Utils.getIconUrl(objectId, ccid) + ' border=0  width=90 height=72>"';
				return v;
			} else {
				md.attr += 'ext:qtip="' + v + '"';
				return v;
			}
		},
		/**
		 * 帧数转换为时码,第二个参数为制式，如果不填，则默认PAL制
		 */
		frameToTimeCode: function(frameCount, videoStandard){
			var timeCode = "";
			
			if (videoStandard == undefined || videoStandard == null) {
				videoStandard = 1;
			}
			
			/**
			 * 根据时分秒帧返回对应的时码字符串
			 */
			var buildTimeCodeString = function(h, m, s, f){
				h = Math.floor(h) + '';
				m = Math.floor(m) + '';
				s = Math.floor(s) + '';
				f = Math.floor(f) + '';
				
				if (h.length < 2)
					h = "0" + h;
				if (m.length < 2)
					m = "0" + m;
				if (s.length < 2)
					s = "0" + s;
				if (f.length < 2) {
					f = "0" + f;
				}
				var timeCode = h + ":" + m + ":" + s + ":" + f;
				return timeCode;
			}
			
		    var scale = Utils.getVideoScale(videoStandard);
		    var rate = Utils.getVideoRate(videoStandard);
			if (rate == 0) {
				return frameCount;
			}
		
		    if (rate * 1001 == scale * 24000) {
		      var hour = frameCount / 86400;
		      var dwReste = frameCount % 86400;
		      var minute = dwReste / 1440;
		      dwReste %= 1440;
		      return buildTimeCodeString(hour, minute, dwReste / 24, dwReste % 24);
		    }if (rate * 1 == scale * 24) {
		      var hour = frameCount / 86400;
		      var dwReste = frameCount % 86400;
		      var minute = dwReste / 1440;
		      dwReste %= 1440;
		      return buildTimeCodeString(hour, minute, dwReste / 24, dwReste % 24);
		    }if (rate * 1 == scale * 25) {
		      var hour = frameCount / 90000;
		      var dwReste = frameCount % 90000;
		      var minute = dwReste / 1500;
		      dwReste %= 1500;
		      return buildTimeCodeString(hour, minute, dwReste / 25, dwReste % 25);
		    }if (rate * 1001 == scale * 30000) {
		      var hour = frameCount / 107892;
		      var dwReste = frameCount % 107892;
		      var minute = 10 * (dwReste / 17982);
		      dwReste %= 17982;
		      if (dwReste >= 1800) {
		        dwReste -= 1800;
		        minute += 1 + dwReste / 1798;
		        dwReste %= 1798;
		        dwReste += 2;
		      }
		      return buildTimeCodeString(hour, minute, dwReste / 30, dwReste % 30);
		    }if (rate * 1 == scale * 30) {
		      var hour = frameCount / 108000;
		      var dwReste = frameCount % 108000;
		      var minute = dwReste / 1800;
		      dwReste %= 1800;
		      return buildTimeCodeString(hour, minute, dwReste / 30, dwReste % 30);
		    }
		    if (rate * 1 == scale * 48) {
		      var hour = frameCount / 172800;
		      var dwReste = frameCount % 172800;
		      var minute = dwReste / 2880;
		      dwReste %= 2880;
		      return buildTimeCodeString(hour, minute, dwReste / 48, dwReste % 48);
		    }if (rate * 1 == scale * 50) {
		      var hour = frameCount / 180000;
		      var dwReste = frameCount % 180000;
		      var minute = dwReste / 3000;
		      dwReste %= 3000;
		      return buildTimeCodeString(hour, minute, dwReste / 50, dwReste % 50);
		    }if (rate * 1001 == scale * 60000) {
		      var hour = frameCount / 215784;
		      var dwReste = frameCount % 215784;
		      var minute = 10 * (dwReste / 35964);
		      dwReste %= 35964;
		      if (dwReste >= 3600) {
		        dwReste -= 3600;
		        minute += 1 + dwReste / 3596;
		        dwReste %= 3596;
		        dwReste += 2;
		      }
		      return buildTimeCodeString(hour, minute, dwReste / 60, dwReste % 60);
		    }if (rate * 1 == scale * 60) {
		      var hour = frameCount / 216000;
		      var dwReste = frameCount % 216000;
		      var minute = dwReste / 3600;
		      dwReste %= 3600;
		      return buildTimeCodeString(hour, minute, dwReste / 60, dwReste % 60);
		    }

			return frameCount;
		},
		
		
		/**
		 * 时码转帧
		 */
	  	timeCodeToFrame : function(timeCodeStr, videoStandard) {
			if (!timeCodeStr) {
				return 0;
			}
			
			if (videoStandard == undefined || videoStandard == null) {
				videoStandard = 1;
			}
			
		    var scale = Utils.getVideoScale(videoStandard);
		    var rate = Utils.getVideoRate(videoStandard);
			if (rate == 0) {
				return 0;
			}
			
			timeCodeStr = timeCodeStr.replaceAll(';', ':');
			var timeCode = timeCodeStr.split(':');
			var hour = parseInt(timeCode[0]);
			var minute = parseInt(timeCode[1]);
			var sec = parseInt(timeCode[2]);
			var frame = parseInt(timeCode[3]);

			if (rate * 1001 == scale * 24000)
				return hour * 1440 + minute * 1440 + sec * 24 + frame;
			if (rate * 1 == scale * 24)
				return hour * 1440 + minute * 1440 + sec * 24 + frame;
			if (rate * 1 == scale * 25)
				return hour * 90000 + minute * 1500 + sec * 25 + frame;
			if (rate * 1001 == scale * 30000) {
				if ((minute % 10 != 0) && (sec == 0) && (((frame == 0) || (frame == 1)))) {
					frame = 2;
				}
				return hour * 107892 + minute / 10 * 17982 + minute % 10 * 1798 + sec * 30 + frame;
			}
			if (rate * 1 == scale * 30)
				return hour * 108000 + minute * 1800 + sec * 30 + frame;
			if (rate * 1 == scale * 48)
				return hour * 172800 + minute * 2880 + sec * 48 + frame;
			if (rate * 1 == scale * 50)
				return hour * 180000 + minute * 3000 + sec * 50 + frame;
			if (rate * 1001 == scale * 60000) {
				if ((minute % 10 != 0) && (sec == 0) && (((frame == 0) || (frame == 1)))) {
					frame = 2;
				}
				return hour * 215784 + minute / 10 * 35964 + minute % 10 * 3596 + sec * 60 + frame;
			}
			if (rate * 1 == scale * 60) {
				return hour * 216000 + minute * 3600 + sec * 60 + frame;
			}
			return 0;
		},
		/**
		 * 帧数转换为时码
		 */
		/*frameToTimeCode: function(frameCount, videoStandard){
			var timeCode = "";
			
			var sHour = null;
			var sMinute = null;
			var sSecond = null;
			var sFrame = null;
			switch (videoStandard) {
				case 2 :
				case 32 :
				case 2048 :
				case 65536 :
				case 4194304 :
				case 268435456 :
					var hour = Math.floor(frameCount / 107892);
					var dwReste = frameCount % 107892;
					var minute = 10 * Math.floor(dwReste / 17982);
					dwReste %= 17982;
					if (dwReste >= 1800) {
						dwReste -= 1800;
						minute += 1 + Math.floor(dwReste / 1798);
						dwReste %= 1798;
						dwReste += 2;
					}
					sHour = '' + (hour);
					sMinute = '' + (minute);
					sSecond = '' + Math.floor(dwReste / 30);
					sFrame = '' + (dwReste % 30);
					break;
				case 4 :
				case 64 :
				case 131072 :
				case 8388608 :
				case 536870912 :
					var hour = Math.floor(frameCount / 108000);
					var dwReste = frameCount % 108000;
					var minute = Math.floor(dwReste / 1800);
					dwReste %= 1800;

					sHour = '' + (hour);
					sMinute = '' + (minute);
					sSecond = '' + Math.floor(dwReste / 30);
					sFrame = '' + (dwReste % 30);
					break;
				case 1 :
				case 8 :
				case 16 :
				case 1024 :
				case 32768 :
				case 2097152 :
				case 134217728 :
					var hour = Math.floor(frameCount / 90000);
					var dwReste = frameCount % 90000;
					var minute = Math.floor(dwReste / 1500);
					dwReste %= 1500;

					sHour = '' + (hour);
					sMinute = '' + (minute);
					sSecond = '' + Math.floor(dwReste / 25);
					sFrame = '' + (dwReste % 25);
					break;
				case 256 :
				case 512 :
				case 8192 :
				case 16384 :
				case 524288 :
				case 1048576 :
				case 33554432 :
					var hour = Math.floor(frameCount / 86400);
					var dwReste = frameCount % 86400;
					var minute = Math.floor(dwReste / 1440);
					dwReste %= 1440;

					sHour = '' + (hour);
					sMinute = '' + (minute);
					sSecond = '' + Math.floor(dwReste / 24);
					sFrame = '' + (dwReste % 24);
			}

			if (sHour.length < 2)
				sHour = "0" + sHour;
			if (sMinute.length < 2)
				sMinute = "0" + sMinute;
			if (sSecond.length < 2)
				sSecond = "0" + sSecond;
			if (sFrame.length < 2) {
				sFrame = "0" + sFrame;
			}
			timeCode = sHour + ":" + sMinute + ":" + sSecond + ":" + sFrame;
			return timeCode;
		},*/
		
		/**
		 * 从地址栏获取指定参数
		 * @param arg 要获取的参数名称
		 */
		getParams: function(arg){
			//alert("href:"+window.location.href);
			var uri = location.search || '';
			return Utils.getParamsFromSearch(uri, arg);
		},
		
		/**
		 * url查询部分（?后的部分）获取指定参数的值
		 * @param arg 要获取的参数名称
		 */
		getParamsFromSearch: function(uri, arg){
			var uri = uri || '';
			if(uri.indexOf('?') == 0){
				uri = uri.substring(1);
			}
			var params = uri.split('&');
			for(var i = 0; i < params.length; i++){
				var param = params[i];
				var pair = param.split('=');
				if(pair[0] == arg && pair.length == 2){
					return pair[1];
				}
			}
			return null;
		},
		
		/**
		 * 构建分页栏
		 */
		buildPagingBar: function(store){
			return new Ext.PagingToolbar({
				store: store,
				pageSize: Global.pageSize || 20,
				displayInfo : true,
				autoWidth: true,				
				displayMsg: D["pub.page.display.order.number"] + ' {0} - {1} '+ D["pub.word.total.find.footer"] + ', '+ D["pub.word.total"] + ' {2} ' + D["pub.word.total.find.footer"],
				emptyMsg: D['pub.word.empty']
			});
		},
		
		/**
		 * 去除Loading动画
		 */
		hideLoadingPicture: function(){
			var loadingIcon = document.getElementById('loadingIcon');
			loadingIcon.style.display = 'none';
		},
		
		/**
		 * 用客户端程序打开文件
		 */
		openWithShell: function(path){
			if(!path){
				Global.alert(D["pub.tip.file.path.empty"] + '!');
				return;
			}
			try{
				var fileExist = true;	//先假设文件是存在的
				if(fso){
					fileExist = fso.FileExists(path);
				}
				if(!fileExist){
					Global.alert(D["pub.tip.file.not.exist"] + '!');
					return;
				}
				
				var shell = new ActiveXObject("WScript.Shell");
				shell.Run('"' + path + '"');
			} catch (e){
				var idx = path.lastIndexOf('.');
				var postFix = path.substring(idx);
				Global.alert(D["error.message.file.open"] + '!<br>' + D["error.message.file.check.open.related.program"] + '[' + postFix + ']' + D["error.message.file.format"] + '。');
			}
		},

        buildNameByIndex: function(name, index, median){
            return name + " " + Utils.padLeft(index + "", median)
        },

        padLeft: function(input, length){
            if(input.length >= length)
                return input;
            else
                return Utils.padLeft("0" + input, length);
        },

        getObjectNamesFromItems: function(items, preFix, postFix, font){
            var names = "";
            if ( !items || items.length == 0 )
                return names;
            if ( items.length > 1 )
                return Utils.getSummaryObjectNamesFromItems(items, preFix, postFix, font);

            for ( var i=0; i<items.length; i++ ){
                var oneName = items[i].name;
                if ( preFix && preFix.length > 0)
                    oneName = preFix + oneName;
                if ( postFix && postFix.length > 0 )
                    oneName = oneName + postFix;
                if ( font && font.length > 0 )
                    oneName = "<font color=" + font + ">" + oneName + "</font>";
                names = names + oneName + ",";
            }
            if ( names.length > 1 )
                names = names.substring(0, names.length-1);

            names = "<font color=blue>" + names + "</font>";
            return names;
        },

        getSummaryObjectNamesFromItems: function(items, preFix, postFix, font){
            var names = "";
            if ( !items || items.length == 0 )
                return names;

            for ( var i=0; i<1; i++ ){
                var oneName = items[i].name;
                if ( preFix && preFix.length > 0)
                    oneName = preFix + oneName;
                if ( postFix && postFix.length > 0 )
                    oneName = oneName + postFix;
                if ( font && font.length > 0 )
                    oneName = "<font color=" + font + ">" + oneName + "</font>";
                names = names + oneName;
            }

            names = "<font color=blue>" + names + "</font>" + D['pub.word.omit'] + items.length + D['pub.word.item2'];
            return names;
        },
        
        /**
         * Simple format for a file size (xxx bytes, xxx KB, xxx MB)
         * @param {Number/String} size The numeric value to format
         * @return {String} The formatted file size
         */
        fileSizeRender : function(size) {
            if (size < 1024) {
                return size + " bytes";
            } else if (size < 1048576) {
                return (Math.round(((size*10) / 1024))/10) + " KB";
            } else {
                return (Math.round(((size*10) / 1048576))/10) + " MB";
            }
        },
        
        fileTypeRender:function(fileType){
        	var fileTypeStr = "";
        	
        	if (fileType == '0') {
        		fileTypeStr = '标清视频';
        	} else if (fileType == "1") {
        		fileTypeStr = '单声道音频';
        	} else if (fileType == "2") {
        		fileTypeStr = '低码率';
        	} else if (fileType == "3") {
        		fileTypeStr = '服务器';
        	} else if (fileType == "4") {
        		fileTypeStr = '关键帧';
        	} else if (fileType == "5") {
        		fileTypeStr = '高清视频';
        	} else if (fileType == "6") {
        		fileTypeStr = '立体声音频';
        	} else if (fileType == "7") {
        		fileTypeStr = '图文';
        	} else if (fileType == "8") {
        		fileTypeStr = "Zxcel2k";
        	} else if (fileType == "9") {
        		fileTypeStr = '图片';
        	} else if (fileType == "10") {
        		fileTypeStr = '肖像';
        	} else if (fileType == "11") {
        		fileTypeStr = '字幕';
        	} else if (fileType == "12") {
        		fileTypeStr = '文档';
        	} else if (fileType == "100") {
        		fileTypeStr = '其它';
        	} else {
        		fileTypeStr = '无此格式';
        	}
        	return fileTypeStr;
        },
        
        fileStatusRender:function(status){
        	var statusStr = "";
        	
        	if (status == '0') {
        		statusStr = '不存在';
        	} else if (status == "1") {
        		statusStr = '在线';
        	} else if (status == "2") {
        		statusStr = '在线+近线';
        	} else if (status == "3") {
        		statusStr = '近线';
        	} else if (status == "4") {
        		statusStr = '离线';
        	} else if (status == "5") {
        		statusStr = '在线+离线';
        	} else if (status == "10") {
        		statusStr = '转码错误';
        	} else if (status == "11") {
        		statusStr = '访问错误';
        	} else if (status == "12") {
        		statusStr = '无权访问';
        	} else {
        		statusStr = '未知';
        	}
        	return statusStr;
        },
        
        fileStatusIconClassRender:function(status){
        	var statusIconClass = "";
        	
        	if (status == '0') {
        		statusIconClass = "fa fa-exclamation";
        	}else if (status == "1") {//在线
        		statusIconClass = "fa fa-lightbulb-o icon-success";
        	} else if (status == "2") {//近线
        		statusIconClass = "fa fa-lightbulb-o icon-warning";
        	} else if (status == "3") {//在线+近线
        		statusIconClass = "fa fa-lightbulb-o icon-success";
        	} else if (status == "4") {//离线
        		statusIconClass = "fa fa-lightbulb-o icon-danger";
        	} else if (status == "5") {//在线+离线
        		statusIconClass ="fa fa-lightbulb-o icon-success";
        	} else if (status == "11") {//访问错误
        		statusIconClass = "fa fa-frown-o";
        	} else {//未知
        		statusIconClass = "fa fa-question";
        	}
        	return statusIconClass;
        },

        /**
         * 资源类型renderer
         */
        resourceTypeRender:function(type){
        	var str = '';
        	
        	if (type== -1) {
        		str= D['resource.pub.type.special.item'];
        	} else if (type== 0) {
        		str= D['resource.pub.type.video'];
        	} else if (type== 1) {
        		str= D['resource.pub.type.audio'];
        	} else if (type== 2) {
        		str= D['resource.pub.type.collection'];
        	} else if (type== 3) {
        		str= D['resource.pub.type.image1'];
        	} else if (type== 4) {
        		str= D['resource.pub.type.document1'];
        	} else if (type== 5) {
        		str= D['resource.pub.type.complex'];
        	} else if (type== 6) {
        		str= D['resource.pub.type.subject'];
        	} else if (type== 7) {
        		str= D['resource.pub.type.project'];
        	}
        	return str;
        },

        /**
         * 获取对象所含属性个数
         */
        getObjectAttributeCount: function(o){
        	if (!o) {
        		return 0;
        	}
        	var count = 0;
        	for (var p in o) {
        		count++;
        	}
        	return count;
        },

        newGUID: function(){
            var guid = "";
            for (var i = 1; i <= 32; i++){
                var n = Math.floor(Math.random()*16.0).toString(16);
                guid += n;
                //if((i==8)||(i==12)||(i==16)||(i==20))
                //    guid += "-";
            }
            return guid.toUpperCase();
        },

        /**
         * 文件状态图标路径renderer
         */
 		fileStatusSrcRenderer: function(fileStatus){
 			var fileName = '';
 			
 			if (fileStatus == 0) fileName = 'notready.png';
 			if (fileStatus == 1) fileName = 'online.png';
 			if (fileStatus == 2) fileName = 'online.png';
 			if (fileStatus == 3) fileName = 'nearline.png';
 			if (fileStatus == 4) fileName = 'online.png';
 			if (fileStatus == 5) fileName = 'offline.png';
 			
 			if (fileName) {
 				return '/fe/images/dayangit/filestatus/' + fileName;
 			} else {
 				return '';
 			}
 		},
 		
 		/**
 		 * 检索结果文件状态文字renderer
 		 */
 		fileStatusTextRenderer: function(fileStatus){
 			var text = '';
 			if (fileStatus == 0) text = '不存在';
 			if (fileStatus == 1) text = '在线';
 			if (fileStatus == 2) text = '在线+近线';
 			if (fileStatus == 3) text = '近线';
 			if (fileStatus == 4) text = '在线+离线';
 			if (fileStatus == 5) text = '离线';
 			
			return text;
 		},
 		
 		/**
 		 * 高标清图片路径renderer
 		 */
 		HDFlagSrcRenderer: function(hdFlag){
 			var fileName = '';
 			if (hdFlag == 0) fileName = 'sd.png'; 
 			if (hdFlag == 1) fileName = 'hd.png'; 
 			
 			if (fileName) {
 				return '/fe/images/dayangit/hdflag/' + fileName;
 			} else {
 				return '';
 			}
 		},
 		
 		/**
 		 * 高标清文字renderer
 		 */
 		HDFlagTextRenderer: function(hdFlag){
 			var text = '';
 			if (hdFlag == 0) text = '标清'; 
 			if (hdFlag == 1) text = '高清'; 
 			
			return text;
 		},
         	
 		/**
 		 * 等比例缩放图片到指定宽高，借鉴了jquery.ae.image.resize的代码
 		 */
 		resizeImage: function(img, width, height){
			var aspectRatio = 0;
	
			// We cannot do much unless we have one of these
			if ( !height && !width ) {
				return this;
			}
	
			// Calculate aspect ratio now, if possible
			if ( height && width ) {
				aspectRatio = width / height;
			}

			// Remove all attributes and CSS rules
			img.removeAttribute( "height" );
			img.removeAttribute( "width" );
			img.style.height = img.style.width = "";

			var imgHeight = img.height , imgWidth = img.width;
			if (imgHeight < height && imgWidth < width) {
				var multi = Math.ceil(Math.min(width / imgWidth, height / imgHeight));
				imgWidth *= multi;
				imgHeight *= multi;
			}
			
			var imgAspectRatio = imgWidth / imgHeight
				, bxHeight = height
				, bxWidth = width
				, bxAspectRatio = aspectRatio;

			// Work the magic!
			// If one parameter is missing, we just force calculate it
			if ( !bxAspectRatio ) {
				if ( bxHeight ) {
					bxAspectRatio = imgAspectRatio + 1;
				} else {
					bxAspectRatio = imgAspectRatio - 1;
				}
			}

			// Only resize the images that need resizing
			if ( (bxHeight && imgHeight > bxHeight) || (bxWidth && imgWidth > bxWidth) ) {

				if ( imgAspectRatio > bxAspectRatio ) {
					bxHeight = ~~ ( imgHeight / imgWidth * bxWidth );
				} else {
					bxWidth = ~~ ( imgWidth / imgHeight * bxHeight );
				}

				img.style.height = bxHeight + 'px';
				img.style.width = bxWidth + 'px';
			}
 		},
 		
 		/**
 		 * 为符合条件的元素添加回车事件
 		 */
 		addEnterEvent: function(selector, fn){
 			 $(selector).keypress(function(event){
                if ( event.keyCode == 13 ){
                    fn();
                }
            });
 		},
 		/**
		 * 根据制式获取对应的rate
		 * 使用后台的TimeCodeUtil.main() 可以生成以下代码
		 */
		getVideoScale: function(v){
			if(v == 0)	return 0;
			if(v == 1)	return 1;
			if(v == 2)	return 1001;
			if(v == 4)	return 1;
			if(v == 16)	return 1;
			if(v == 32)	return 1001;
			if(v == 64)	return 1;
			if(v == 128)	return 1001;
			if(v == 512)	return 1;
			if(v == 256)	return 1;
			if(v == 4096)	return 1001;
			if(v == 8)	return 1;
			if(v == 1024)	return 1;
			if(v == 2048)	return 1001;
			if(v == 262144)	return 1;
			if(v == 8192)	return 1001;
			if(v == 16384)	return 1;
			if(v == 32768)	return 1;
			if(v == 65536)	return 1001;
			if(v == 131072)	return 1;
			if(v == 524288)	return 1001;
			if(v == 1048576)	return 1;
			if(v == 2097152)	return 1;
			if(v == 4194304)	return 1001;
			if(v == 8388608)	return 1;
			if(v == 1090519040)	return 1;
			if(v == 1107296256)	return 1001;
			if(v == 1124073472)	return 1;
			if(v == 1157627904)	return 1001;
			if(v == 1174405120)	return 1;
			if(v == 1191182336)	return 1;
			if(v == -2130706432)	return 1001;
			if(v == -2113929216)	return 1;
			if(v == -2097152000)	return 1001;
			if(v == -2080374784)	return 1;
			if(v == -2063597568)	return 1001;
			if(v == -2046820352)	return 1;
			if(v == -2030043136)	return 1;
			if(v == 33554432)	return 1001;
			if(v == 50331648)	return 1001;
			if(v == 67108864)	return 1;
			if(v == 83886080)	return 1;
			if(v == 100663296)	return 1;
			if(v == 117440512)	return 1;
			if(v == 134217728)	return 1;
			if(v == 268435456)	return 1001;
			if(v == -1073741824)	return 1001;
			if(v == -1056964608)	return 1001;
			if(v == 536870912)	return 1;
			if(v == -1040187392)	return 1;
			if(v == -1023410176)	return 1;
			if(v == -1006632960)	return 1;
			if(v == -989855744)	return 1;
			if(v == -973078528)	return 1001;
			if(v == -956301312)	return 1;
			
			return 0;
		},
		
		/**
		 * 根据制式获取rate
		 * 使用后台的TimeCodeUtil.main() 可以生成以下代码
		 */
		getVideoRate: function(v){
			if(v == 0)	return 0;
			if(v == 1)	return 25;
			if(v == 2)	return 30000;
			if(v == 4)	return 30;
			if(v == 16)	return 25;
			if(v == 32)	return 30000;
			if(v == 64)	return 30;
			if(v == 128)	return 24000;
			if(v == 512)	return 24;
			if(v == 256)	return 25;
			if(v == 4096)	return 30000;
			if(v == 8)		return 30;
			if(v == 1024)	return 50;
			if(v == 2048)	return 60000;
			if(v == 262144)	return 60;
			if(v == 8192)	return 24000;
			if(v == 16384)	return 24;
			if(v == 32768)	return 25;
			if(v == 65536)	return 30000;
			if(v == 131072)	return 30;
			if(v == 524288)	return 24000;
			if(v == 1048576)	return 24;
			if(v == 2097152)	return 25;
			if(v == 4194304)	return 30000;
			if(v == 8388608)	return 30;
			if(v == 1090519040)	return 50;
			if(v == 1107296256)	return 60000;
			if(v == 1124073472)	return 60;
			if(v == 1157627904)	return 24000;
			if(v == 1174405120)	return 24;
			if(v == 1191182336)	return 48;
			if(v == -2130706432)	return 24000;
			if(v == -2113929216)	return 24;
			if(v == -2097152000)	return 24000;
			if(v == -2080374784)	return 24;
			if(v == -2063597568)	return 24000;
			if(v == -2046820352)	return 24;
			if(v == -2030043136)	return 24;
			if(v == 33554432)	return 24000;
			if(v == 50331648)	return 24000;
			if(v == 67108864)	return 24;
			if(v == 83886080)	return 24;
			if(v == 100663296)	return 25;
			if(v == 117440512)	return 25;
			if(v == 134217728)	return 25;
			if(v == 268435456)	return 30000;
			if(v == -1073741824)	return 30000;
			if(v == -1056964608)	return 30000;
			if(v == 536870912)	return 30;
			if(v == -1040187392)	return 30;
			if(v == -1023410176)	return 30;
			if(v == -1006632960)	return 48;
			if(v == -989855744)	return 50;
			if(v == -973078528)	return 60000;
			if(v == -956301312)	return 60;
			
			return 0;
		},
		
		/**
		 * 更新浏览器窗口的标题
		 */
		setWindowTitle: function(text){
			document.title = text || '';
		},
		
		/**
		 * 对两个datepicker控件的最早日期和最晚日期做限制
		 */
		limitDatePicker: function(date1, date2){
			var $date1 = $(date1);
			var $date2 = $(date2);
			$date1.change(function() {
				var val = $(this).val();
				if (val) {
					$date2.datepicker("option", "minDate", val);
				} else {
					$date2.datepicker("option", "minDate", null);
				}
			});
			$date2.change(function() {
				var val = $(this).val();
				if (val) {
					$date1.datepicker("option", "maxDate", val);
				} else {
					$date1.datepicker("option", "maxDate", null);
				}
			});
		},
		 /**
		 * 获取下载提交form 
		 */
		getForm: function(formId,actionUrl){
			var form = document.getElementById(formId);
			
			if (!form) {
				var $form = $('<form action="'+actionUrl+'" method="post" id="'+formId+'" target="_blank">' +
								'<input type="hidden" name="ids" value="" />' +
								'<input type="hidden" name="targetType" value="" />' +
							'</form>');
				$('body').append($form);
				
				form = $form[0];
			}
			
			return form;
		},

		/**
		 * 校验是否已加载了某个jquery插件
		 */
		hasJQueryPlugin: function(name){
			return !!$.prototype[name] || window[name];
		},

		/**
		 * 校验某个jquery组件或闭包类是否存在，如果不存在，加载其对应js、css文件。
         * 这个函数和之前Global里的同名函数有些区别，包括支持加载完毕后的回调函数
		 * @param para 包含name、jsFiles、cssFiles属性，name是组件名称，后两个是文件路径数组
		 */
		checkAndLoadFileAsync: function(para){
			var name = para.name;

			if (Utils.hasJQueryPlugin(name)) {
                if (para.callback)
                    para.callback(para.callbackPara);
				return;
			}

			var jsFiles = para.jsFiles;
			var cssFiles = para.cssFiles;
			if (jsFiles && jsFiles.length > 0) {
                Utils.loadScriptFiles(jsFiles, 0, para.callback, para.callbackPara);
//				for (var i = 0; i < jsFiles.length; i++) {
//					var file = jsFiles[i];
//					Utils.loadScriptFile(file)
//				}
			}
			if (cssFiles) {
				for (var i = 0; i < cssFiles.length; i++) {
					var file = cssFiles[i];
					Utils.loadStyleFile(file)
				}
			}
		},

        loadScriptFiles: function(files, index, callback, callbackPara) {
            Utils.loadScriptFile(files[index], function() {
                index ++;
                if (index < files.length)
                    Utils.loadScriptFiles(files, index);
                else {
                    if (callback)
                        callback(callbackPara);
                }
            });
        },

		/**
		 * 动态、异步地加载某个js文件
		 */
		loadScriptFile : function(src, callback, callbackPara) {
            //先判断插件是否已经加载过了，引入一个变量来存储素所有加载过的插件
            if (Utils.scripts == undefined) {
                Utils.scripts = {};
            }
            if (Utils.scripts[src] != undefined)
                return;
            Utils.scripts[src] = true;

			var oHead = document.getElementsByTagName('HEAD').item(0);
			var oScript = document.createElement("script");
			oScript.type = "text/javascript";
			oScript.src = src;
            oScript.onload = function() {
                if (callback)
                    callback(callbackPara);
            };
			oHead.appendChild(oScript);
		},
		
		/**
		 * 动态、异步地加载某个css文件
		 */
		loadStyleFile : function(src) {
			var oHead = document.getElementsByTagName('HEAD').item(0);
			var oLink = document.createElement("link");
			oLink.type = "text/css";
			oLink.rel = "stylesheet";
			oLink.href = src;
			oHead.appendChild(oLink);
		},

        // Handles custom checkboxes & radios using jQuery Uniform plugin
        handleUniform: function() {
            if (!jQuery().uniform) {
                return;
            }
            var test = $("input[type=checkbox]:not(.toggle, .make-switch), input[type=radio]:not(.toggle, .star, .make-switch)");
            if (test.size() > 0) {
                test.each(function () {
                    if ($(this).parents(".checker").size() == 0) {
                        $(this).show();
                        $(this).uniform();
                    }
                });
            }
        },
        getResourceAttribute: function(extendAttribute, basicMetadataName){
            var basicMetadataValue;
            $.each(extendAttribute, function(index, attr){
                if (attr.name == basicMetadataName) {
                    basicMetadataValue = attr.value;
                }
            });
            return basicMetadataValue;
        },

        changeCheckBoxValue: function($checkbox, value) {
            $checkbox.prop("checked", value);
            if (jQuery().uniform) {
                $.uniform.update($checkbox);
            }
        },

        changeRadioValue: function($radio, value) {
            $radio.prop("checked", value);
            if (jQuery().uniform) {
                $.uniform.update($radio);
            }
        },

        handleElementUniform: function($target) {
            $.uniform.restore($target);
            $target.uniform();
        },

        empty: null
	};
}();

