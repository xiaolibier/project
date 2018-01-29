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
	var serverUrl = "http://127.0.0.1:8086/3audit-open/";
	//var serverUrl = "http://118.190.132.68:80/3audit/";
	// var serverUrl = "http://192.168.1.222/3audit-open/";
	//var serverUrl = "http://open.3audit.com/3audit-open/";
	var imgUrl = "/api/public/api/image";
	var imgUrl2 = "/api/public/api/image2";
	
	
	Base.userName = userName;
	Base.phoneNumber = phoneNumber;
	Base.urlPort = urlPort;
	Base.maskTimeOut = maskTimeOut;
	Base.serverUrl = serverUrl;
	Base.imgUrl = imgUrl;
	Base.imgUrl2 = imgUrl2;
	//扫码跳转到手机在线评审
	Base.http1 = 'https://open.3audit.com/view/taskMobie.html';
	//扫码跳转到手机在线评审- 生成二维码 路径
	Base.http2 = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb9b0badbc053646e&redirect_uri=https%3a%2f%2fopen.3audit.com%2f3audit-open%2flogin%2fwechat&response_type=code&scope=snsapi_login';
	//绑定微信 - 二维码生成路径
	Base.http3 = 'https%3a%2f%2fopen.3audit.com%2f3audit-open%2fopen%2fuser%2fbindWechat';
	//扫码登录 - 二维码生成路径
	Base.http4 = 'https%3a%2f%2fopen.3audit.com%2f3audit-open%2flogin%2fwechat';
	
	
	
}(window));












