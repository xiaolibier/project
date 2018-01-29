/**
 * 操作提示框
 * 一共提供了四种提示信息框，提示（黄色）、信息（蓝色）、成功（绿色）、失败（红色）
 * 提示框 提示（黄色）、信息（蓝色）、成功（绿色）设定为自动消失
 * 操作失败提示框设定为默认不自动消失，可以在调用是设定为默认消失
 * 
 * 调用实例:	
 * 		提示： Notify.notice("提示信息");
 * 		信息： Notify.info("消息信息");
 * 		成功： Notify.success("成功信息");
 * 
 * 		失败： Notify.error("失败信息");    // 默认不自动消失
 * 		失败： Notify.error("失败信息", true);    // 手动设置为自动消失
 * 
 * 引用：
 * <script src="/fe/thirdparty/pnotify/jquery.pnotify.js"></script>
 * <link href="/fe/thirdparty/pnotify/jquery.pnotify.default.css" rel="stylesheet" type="text/css"/>
 * <link href="/fe/thirdparty/pnotify/jquery.pnotify.default.icons.css" rel="stylesheet" type="text/css"/>
 * 
 * 
 * PS ：
 * PNOTIFY 错误提示框需要依赖 .alert-error 这个class ，但是在Bootstrap v3.1.1 中没有该类的定义，需要添加 .alert-error 的定义
 * .alert-error {    background-color: #f2dede;    border-color: #eed3d7;    color: #b94a48;}
 * .alert-error h4 {    color: #b94a48;}
 */
var Notify = function() {
	return {
		error : function(text, hide, delay) {
			var opts = {
					title : "失败",
					text : "<div style='padding-top: 10px;'>" + text + "</div>",
					addclass : "stack-topleft",
                    delay : delay || 1000,
					hide : hide == undefined ? false : hide,
					styling: 'bootstrap',
					type : 'error',
					history: false
			};
			
			Notify.open(opts);
		},
		
		notice : function(text, delay) {
			var opts = {
					title : "提示",
					text : "<div style='padding-top: 10px;'>" + text + "</div>",
					addclass : "stack-topleft",
					delay : delay || 1000,
					styling: 'bootstrap',
					type : 'notice',
					history: false
			};
			Notify.open(opts);
		},
		
		info : function(text, delay) {
			var opts = {
					title : "信息",
					text : "<div style='padding: 10px 0;'>" + text + "</div>",
					addclass : "stack-topleft",
					delay : delay || 1000,
					styling: 'bootstrap',
					type : 'info',
					history: false
			};
			Notify.open(opts);
		},
		
		success : function(text, delay) {
			var opts = {
					title : "成功",
					text : "<div style='padding: 10px 0;'>" + text + "</div>",
					addclass : "stack-topleft",
					delay : delay || 1000,
//					hide : false,
					styling: 'bootstrap',
					type : 'success',
					history: false
			};
			Notify.open(opts);
		},
		
		open : function(opts) {
			var notify = $.pnotify(opts); // 显示提示框信息
			
			/**
			 * 重新设置提示窗口的堆叠顺序
			 * angular js 的对话框默认为 10050， pnotify 的默认为 9999， 对话框会覆盖提示框的信息，所以需要重新进行设置
			 */
			notify.css({"z-index":19999}); 
		}
		
	};
}();