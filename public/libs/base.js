/**
 * file:全局变量
 * author:ToT
 * date:2014-08-17
*/

(function(window) {
	if (typeof Base === "undefined") {
		Base = {};
	}
	//正式URL端口号为21290,测试URL端口号为8008
	var urlPort = 21290;
	//蒙版效果等待时间
	var maskTimeOut = 1000;
	//跳转延迟
	var eventDelay = 100;
	//用户名
	var userName = "";
	//用户手机号
	var phoneNumber = "";

	//请求服务地址
	//var serverUrl = "http://www.partywo.com/";
	var serverUrl = "http://192.168.1.20:8086/tax/";//
	//var serverUrl = "http://192.168.1.234:8084/3audit/";//xihai
	//var serverUrl = "http://192.168.1.181:8085/3audit/";//qiaorong
	//var serverUrl = "http://api.3audit.cn/3audit/";
	var imgUrl = "/api/public/api/image";
	var imgUrl2 = "/api/public/api/image2";
	
	
	Base.http = 'http://192.168.1.20/';
	Base.http2 = 'http://192.168.1.20/';//applyto.html //生成二维码
	Base.http3 = 'http%3a%2f%2fdownload.3audit.com%2f3audit%2fuser%2fbindWechat';//微信绑定 home.html
	Base.userName = userName;
	Base.phoneNumber = phoneNumber;
	Base.urlPort = urlPort;
	Base.maskTimeOut = maskTimeOut;
	Base.serverUrl = serverUrl;
	Base.imgUrl = imgUrl;
	Base.imgUrl2 = imgUrl2;
}(window));












