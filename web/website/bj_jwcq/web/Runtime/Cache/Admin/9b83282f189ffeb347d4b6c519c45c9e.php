<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>忆思维--网站后台管理系统</title><link href="__SYSWEB__/images/index.css" rel="stylesheet" type="text/css"><body><form name="myform" action="__APP__/Admin/Sys/mlogin" method="post" onsubmit="return check_user(this)"><div class="esw_01"><div class="esw_01bc"></div><div class="esw_01lt"><img src="__SYSWEB__/images/esw_02.png"></div><div class="esw_01rt"><p class="esw_01rtp1">登录系统</p><div class="zh_01"><span>帐&nbsp;&nbsp;&nbsp;号</span><input type="text" class="zh_01p1" name="username"></div><div class="zh_01"><span>密&nbsp;&nbsp;&nbsp;码</span><input type="password" class="zh_01p1" size="20" name="password"></div><div class="zh_01"><span class="line20">验证码</span><input type="text" class="zh_01p2" name="verifycode" maxLength="4" size="10"><img src="/Admin/Sys/login?flag=createimg" width="50" height="20" onClick="loadimage()" id="vcimage"/></div><div class="zh_02"><input type="submit" value=" " class="zh_02inpu1"><input type="reset" class="zh_02inpu2" value=" "></div></div></div><p class="footp1">7×24小时全国业务受理热线：010-5720 7470 400-888-5441 售后服务邮箱：saleh@esw-vip.com.com</p></form><script type="text/javascript">function loadimage()
{
    document.getElementById("vcimage").src = "/Admin/Sys/login?flag=createimg";
  }


function check_user(theform)
{
	if(theform.username.value=="")
	{
		alert("请输入管理员姓名!");
		theform.username.focus();
		return false;
	}
	
	if(theform.password.value=="")
	{
		alert("请输入管理员密码!");
		theform.password.focus();
		return false;
	}
	if(theform.verifycode.value=="")
	{
		alert("请输入验证码!");
		theform.verifycode.focus();
		return false;
	}
}
</script>