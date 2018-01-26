/**
 * file:page
 * author:lixianqi
 * date:2017-11-8
*/

//页面初始化
$(function(){
 var mydate=new Date();
 var thisyear=mydate.getFullYear();
 var thismonth=mydate.getMonth()+1;
 var thisday=mydate.getDate();
 var mydate1=new Date();
 var thisyear1=mydate1.getFullYear();
 var thismonth1=mydate1.getMonth()+1;
 var thisday1=mydate1.getDate();
 var selectday=thisday; 
 //标记日期
 var indate=thisday; 
 //入住日期
 var inmonth=thismonth; 
 //入住月份
 var outdate=thisday+1; 
 //退房日期
 var outmonth=thismonth; 
 //退房月份
 var datetxt="datetoday";  
 var datefirst;
 var datesecond;
 function initdata(){ 
	 //日期初始填充
	 var tdheight=$(".data_table tbody tr").eq(0).find("td").height();
	 //$(".data_table tbody td").css("height",tdheight);
	 $(".selectdate").html(thisyear+"年"+thismonth+"月");
	 var days=getdaysinonemonth(thisyear,thismonth);
	 var weekday=getfirstday(thisyear,thismonth);
	 setcalender(days,weekday); //往日历中填入日期
	 markdate(thisyear,thismonth,selectday);//标记当前日期
 }
 initdata();
 
 
 function markdate(thisyear,thismonth,thisday){
	 //标记日期
	 var datetxt=thisyear+"年"+thismonth+"月";
	 var thisdatetxt=thisyear1+"年"+thismonth1+"月";
	 $(".data_table td").removeClass("tdselect");
	 if(datetxt==thisdatetxt){
		 for(var j=0;j<6;j++){
			 for(var i=0;i<7;i++){
				 var tdhtml=$(".data_table tbody tr").eq(j).find("td").eq(i).html();
				 if(tdhtml==thisday){
					$(".data_table tbody tr").eq(j).find("td").eq(i).addClass("tdselect");
				 }
			 }
		}
	 }
 }
 function getdaysinonemonth(year,month){
	 //算某个月的总天数
	 month=parseInt(month,10);
	 var d=new Date(year,month,0);
	 return d.getDate();
 }
 function getfirstday(year,month){
	 //算某个月的第一天是星期几
	 month=month-1;
	 var d=new Date(year,month,1);
	 return d.getDay();
 }
 function setcalender(days,weekday){
	 //往日历中填入日期
	 weekday -= 1;
	 var a=1,b=1;
	 //计算开始的几天
	 var lastday = getdaysinonemonth(thisyear,thismonth-1);//计算最后一天是几号
	 var mydate = new Date();
	 var nowday = mydate.getDate();
	 var nowmonth = mydate.getMonth();
	 var nowyear = mydate.getFullYear();
	 var timedate = nowyear+'-'+nowmonth+'-'+nowday;
	 for(var j=0;j<6;j++){
		 for(var i=0;i<7;i++){
			 if(j==0&&i<weekday){//月前面几天
				 var ttday = lastday - weekday + i+1;
				 $(".data_table tbody tr").eq(0).find("td").eq(i).find('.span').html(ttday);
				 $(".data_table tbody tr").eq(0).find("td").eq(i).addClass("other");
				 if(j == 0 && i == 0){//存储第一天的日期
					var ittime = thisyear+'-'+(thismonth-1)+'-'+ttday+' 00:00:00';
					//var timestamp = Date.parse(new Date(ittime));//日期时间转成时间戳
					$(".data_table tbody tr").eq(0).find("td").eq(i).attr("day",ittime).addClass("firsttd");
				 }
					var ittime = thisyear+'-'+(thismonth-1)+'-'+ttday+' 00:00:00';
					$(".data_table tbody tr").eq(0).find("td").eq(i).attr("daytime",ittime).removeClass('nowdaystyle');
					var itday = thisyear+'-'+(thismonth-1)+'-'+ttday;
					if(timedate == itday){$(".data_table tbody tr").eq(0).find("td").eq(i).addClass('nowdaystyle');}
			 }else{
				 if(a<=days){
					 $(".data_table tbody tr").eq(j).find("td").eq(i).find('.span').html(a);
					 $(".data_table tbody tr").eq(j).find("td").eq(i).removeClass("other").addClass('can');
					 if(j == 0 && i == 0){//存储第一天的日期
						var ittime = thisyear+'-'+thismonth+'-'+a+' 00:00:00';
						//var timestamp = Date.parse(new Date(ittime));//日期时间转成时间戳
						$(".data_table tbody tr").eq(j).find("td").eq(i).attr("day",ittime).addClass("firsttd");
					 }
					 if(j == 4 && i == 6){//存储最后一天的日期
						var ittime = thisyear+'-'+thismonth+'-'+a+' 00:00:00';
						//var timestamp = Date.parse(new Date(ittime));//日期时间转成时间戳
						$(".data_table tbody tr").eq(j).find("td").eq(i).attr("day",ittime).addClass("lasttd");
					 }
					 var ittime = thisyear+'-'+thismonth+'-'+a+' 00:00:00';
					 $(".data_table tbody tr").eq(j).find("td").eq(i).attr("daytime",ittime).removeClass('nowdaystyle');
					 var itday = thisyear+'-'+(thismonth-1)+'-'+a;
					 if(timedate == itday){$(".data_table tbody tr").eq(j).find("td").eq(i).addClass('nowdaystyle');}
					 a++;
				 }else{//月最后几天
					 $(".data_table tbody tr").eq(j).find("td").eq(i).find('.span').html(b);
					 $(".data_table tbody tr").eq(j).find("td").eq(i).addClass("other");
					 if(j == 4 && i == 6){//存储最后一天的日期
						var ittime = thisyear+'-'+(thismonth+1)+'-'+b+' 00:00:00';
						//var timestamp = Date.parse(new Date(ittime));//日期时间转成时间戳
						$(".data_table tbody tr").eq(j).find("td").eq(i).attr("day",ittime).addClass("lasttd");
					 }
					 var ittime = thisyear+'-'+(thismonth+1)+'-'+b+' 00:00:00';
					 $(".data_table tbody tr").eq(j).find("td").eq(i).attr("daytime",ittime).removeClass('nowdaystyle');
					 var itday = thisyear+'-'+(thismonth-1)+'-'+b;
					 if(timedate == itday){$(".data_table tbody tr").eq(j).find("td").eq(i).addClass('nowdaystyle');}
					 b++;
					 a=days+1;
				 }
			 }
		 }
	 }
 }

 
 $(".lastmonth").click(function(){ 
	//上一个月
	 thismonth--;
	 if(thismonth==0){
	 thismonth=12;
	 thisyear--;
	 }
	 initdata();
 });
 $(".nextmonth").click(function(){ 
	 //下一个月
	 thismonth++;
	 if(thismonth==13){
	 thismonth=1;
	 thisyear++;
	 }
	 initdata();
 });
 

 
});

