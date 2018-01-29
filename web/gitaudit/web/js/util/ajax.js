/**
 * Ajax调用工具类
 */
var Ajax = function(){
	
	/**
	 * 根据类名和方法名获取调用后台Action的Url
	 */
	return {
		/**
		 * 根据Action类名和方法名返回调用该方法的url
		 */
		getUrl: function(className, methodName){
			if(className && methodName){
				return 'main.do?cName=' + className + '&cMethod=' + methodName;
			} else {
				return '';
			}
		},
		
		/** 标识是否已经提示过用户已超时，避免重复弹窗 */
		hasAlertTimeOut: false,
		
		/**
		 * 调用指定的Action类中的某个方法，带参数和回调函数
		 * @param cfg 调用配置，包含以下几个属性：
         * url: 要调用的url名称，主要用于struts或者servlet(如果该参数不为空，则忽略className和methodName)
		 * className：要调用的Action类名 , 主要用于MainServlet的模式
		 * methodName：要调用的方法名 , 主要用于MainServlet的模式
		 * callPara：要传给后台的参数对象
		 * callback：调用完毕后的回调函数,包含一个data参数
		 */
		call: function(cfg){
			var c = this;

            var url = cfg.url;
            var className = cfg.className 		|| cfg.c;
			var methodName = cfg.methodName 	|| cfg.m;
			var callPara = cfg.callPara 		|| cfg.p;
			var callback = cfg.callback 		|| cfg.f;
			var scope = cfg.scope				|| cfg.s;
			var timeout = cfg.timeout			|| cfg.t || 60000;
			var method = cfg.method				|| 'POST';
            var mergePara = cfg.mergePara;
            var async = cfg.async;
            var jsonp = cfg.jsonp;

            if ( url == undefined  || url == null  )
                url = c.getUrl(className, methodName);
			if (!url) {
				return;
			}
			var para = JSON.stringify(callPara || {});
            if ( mergePara == false ){
                para = callPara;
            } else {
                para = {para: para};
            }
            if(async==undefined){
            	async=true;
            }
            var promise = $.ajax({
                url: url,
                type: method,
                data: para,
                async: async,
                timeout : timeout
            }).complete(function(data) {
                if (data.exceptionId) {
                    Notify.error("后台发生错误");
                    console.error(exception.stack);
                    return;
                }
                Ajax.callback(data, url, scope, callback);
            });

            if ( jsonp ){
                promise = $.ajax({
                    url: url,
                    type: method,
                    dataType : "jsonp",
                    jsonp:"jsonpCallback" , //服务端用于接收callback调用的函数名参数，不得修改
                    data: para,
                    async: async,
                    timeout : timeout
                }).complete(function(data) {
                    Ajax.callback(data, url, scope, callback);
                });
            }
            return promise;
        },

        popupException: function(exceptionID) {
            //var tipText = D["error.message.pub.system.exception"] + '<br><a style="text-decoration: underline" target="_blank" href="querylog?logFileName=evias.log&exception='+ exceptionID + '#' + exceptionID + '">' + D["pub.operate.break.to.view.log"] + '</a>';
//            Notify.error(tipText, true);
            Notify.error("操作失败，后台发生错误，请联系管理员!", true);
        },

        callRest: function(cfg){
            var c = this;

            var url = cfg.url;
            var callPara = cfg.callPara 		|| cfg.p;
            var callback = cfg.callback 		|| cfg.f;
            var scope = cfg.scope				|| cfg.s;
            var jsonp = cfg.jsonp;
            var timeout = cfg.timeout			|| cfg.t || 60000;

            if (!url) {
                return;
            }

            var ajaxPara = {
                url: url,
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(callPara),
                crossDomain: true,
                dataType: "json",
                timeout : timeout
            };

            if ( jsonp ){
                ajaxPara.dataType = "jsonp";
                ajaxPara.jsonp = "jsonpCallback";  //服务端用于接收callback调用的函数名参数，不得修改
            }

            var promise = $.ajax(ajaxPara).complete(function(data, aa, bb, cc, dd) {
                Ajax.callback(data, url, scope, callback);
            });
            return promise;
        },

        callback: function(data, url, scope, callbackFun){
            var responseText = data.responseText;

            if (!responseText) {
                return;
            }

            //if (responseText || responseText.length > 12){
            //    if (responseText.substring(0, 12) == "exceptionID:") {
            //        var exceptionID = responseText.substring(12);
            //        if(exceptionID=="ResourceNotExist"){
            //            Global.alert(D["error.message.resource.not.exist2"] + '！');
            //            return;
            //        }
            //
            //        Ajax.popupException(exceptionID);
            //        return;
            //    }
            //}
            var jsonObject = jQuery.parseJSON(responseText);
            if (jsonObject.exceptionId) {
                console.error(jsonObject.stack);
                Ajax.popupException(jsonObject.exceptionId);
                return;
            }
            if (jsonObject.errorMessage) {
                Notify.error(jsonObject.errorMessage, true);
                console.error(jsonObject.errorMessage);
                return;
            }
            if (jsonObject.popupMessage) {
                console.log(jsonObject.popupMessage);
                alert(jsonObject.popupMessage);
                return;
            }

            if ( jsonObject != null && jsonObject.timeout != null && jsonObject.timeout ){
                if (Ajax.hasAlertTimeOut) {
                    return;
                } else {
                    Ajax.hasAlertTimeOut = true;
                }

                //对于轮询请求，不弹出提示。
                if (url == 'loop.action') {
                    return;
                }

//                Notify.error(D['error.message.pub.connection.timeout'], true);
                Notify.error("您长时间没有操作，与服务器的连接已超时，请重新登录!", true);
                location.reload();
                return;
            }

            if ( callbackFun != null && callbackFun != undefined ){
                if(scope == null || typeof scope != 'object'){
                    callbackFun(jsonObject);
                }else{
                    callbackFun.call(scope,jsonObject);
                }
            } else {
                console.log("callback function is null!");
            }
        },

        empty: null
	};


}();