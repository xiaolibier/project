<?php if (!defined('THINK_PATH')) exit();?><!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" type="text/css" href="__SYSWEB__/images/right.css"/><title>商学院</title></head><script>   function tick() {
   var hours, minutes, seconds, xfile;
   var intHours, intMinutes, intSeconds;
   var today, theday;
   today = new Date();
   function initArray(){
   this.length=initArray.arguments.length
   for(var i=0;i<this.length;i++)
   this[i+1]=initArray.arguments[i] }
   var d=new initArray(
   " 星期日",
   " 星期一",
   " 星期二",
   " 星期三",
   " 星期四",
   " 星期五",
   " 星期六");
   theday = [today.getYear()]+"年" + [today.getMonth()+1]+"月" +today.getDate()+"日" + d[today.getDay()+1];
   intHours = today.getHours();
   intMinutes = today.getMinutes();
   intSeconds = today.getSeconds();
   if (intHours == 0) {
   hours = "12:";
   xfile = " 午夜好！ ";
   } else if (intHours < 12) {
   hours = intHours+":";
   xfile = " 上午好！ ";
   } else if (intHours == 12) {
   hours = "12:";
   xfile = " 正午好！ ";
   } else {
   intHours = intHours - 12
   hours = intHours + ":";
   xfile = " 下午好！ ";
   }
   if (intMinutes < 10) {
   minutes = "0"+intMinutes+":";
   } else {
   minutes = intMinutes+":";
   }
   if (intSeconds < 10) {
   seconds = "0"+intSeconds+" ";
   } else {
   seconds = intSeconds+" ";
   }
   timeString = theday+xfile+hours+minutes+seconds;
   Clock.innerHTML = timeString;
   window.setTimeout("tick();", 100);
   }
   window.onload = tick;
</script><body><div><div class="wecome"><img src="__SYSWEB__/images/welcome.gif"></div><div class="wecome1"><p id="Clock"></p><br/></div><table class="table1"><tr bgcolor="#a9b9d2" style="width:100%"><td style="text-align:center; color:#fff; font-size:12px; font-weight:bold;width:100% ">服务器信息</td></tr><?php if(is_array($info)): $i = 0; $__LIST__ = $info;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$v): $mod = ($i % 2 );++$i;?><tr><td bgcolor="#e3effd" style="text-align:right; color:#1c466e"><?php echo ($key); ?>：</td><td>&nbsp;&nbsp;<?php echo ($v); ?></td></tr><?php endforeach; endif; else: echo "" ;endif; ?><tr bgcolor="#a9b9d2" style="width:100%"><td></td></tr></table></div></body></html>