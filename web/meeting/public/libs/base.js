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
	//var serverUrl = "http://192.168.1.80:80/3audit/";
	var serverUrl = "http://conference.3audit.com/3audit/";
	var imgUrl = "/api/public/api/image";
	var imgUrl2 = "/api/public/api/image2";
	
	
	Base.http = 'http://127.0.0.1/';
	Base.userName = userName;
	Base.phoneNumber = phoneNumber;
	Base.urlPort = urlPort;
	Base.maskTimeOut = maskTimeOut;
	Base.serverUrl = serverUrl;
	Base.imgUrl = imgUrl;
	Base.imgUrl2 = imgUrl2;
	//扫码登录 - 二维码生成路径
	Base.http4 = 'http%3a%2f%2fapi.3audit.cn%2f3audit-open%2flogin%2fwechat';
	Base.yiqi = 'http://a.eqxiu.com/s/mGJ5mQ3z?eqrcode=1&share_level=15&from_user=45ff1584-7d29-4750-8602-105a2c6a6adf&from_id=c1d0d07f-707a-4b07-9abd-322ecfc5d254&share_time=1508667697949&from=timeline&isappinstalled=0';
	
	
}(window));












