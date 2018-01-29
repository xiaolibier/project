// JavaScript Document
var CloseTab = 1;
//进度
var PlanBar = 100;
//当前进度
var CurrPlan = 0;
//已经运行的完的时间
var TimeUsed = 0;
//页面加载标志
var loadingFlag = 0;
var HEIGHT="";
HEIGHT= 600;

var WDITH = "0";

if(window.screen.width == 1024){
	WDITH="98%";
}else{
	WDITH="99%";
}
/*************************************************************************/
var $ = function(s)
{
	return (typeof s == "object") ? s: document.getElementById(s);
};

var Browser = new Object();

Browser.ua = window.navigator.userAgent.toLowerCase();
Browser.ie = /msie/.test(Browser.ua);
Browser.moz = /gecko/.test(Browser.ua);
Browser.opera = /opera/.test(Browser.ua);
/*************************************************************************/
function Time()
{
	today = new Date();
	var hours = today.getHours();
	var Message;
	if(parseInt(hours)>=0&&parseInt(hours)<=11)
	{
		Message="早上好";
		return Message;
	}
	else if(parseInt(hours)>11&&parseInt(hours)<=13)
	{
		Message="中午好";
		return Message;				
	}
	else if(parseInt(hours)>13&&parseInt(hours)<=17)
	{
		Message="下午好";
		return Message;	
	}
	else if(parseInt(hours)>17)
	{
		Message="晚上好";
		return Message;	
	}
}

function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_showHideLayers() { //v6.0
  var i,p,v,obj,args=MM_showHideLayers.arguments;
  for (i=0; i<(args.length-2); i+=1) if ((obj=MM_findObj(args[i]))!=null) { v=args[i+2];
    if (obj.style) { obj=obj.style; v=(v=='show')?'visible':(v=='hide')?'hidden':v; }
    obj.visibility=v; }
}

function MM_OpenCLoseLayers(){//v1.0
	var args = MM_OpenCLoseLayers.arguments;//读取参数值
	var divar = $(args[2]).getElementsByTagName("div");
	var countNum = 0;
	for(var i = 0;i < divar.length ; i++){
		if(divar[i].id==args[1]){
			if(countNum == args[0]){
				divar[i].style.display= "";
			}else{
				divar[i].style.display= "none";
			}
			countNum ++;
		}
	}
}

/*******************导行管理*********************/				
var tabNone = "<div id=\"{$TABID}\" class=\"add\" style=\"float:left;\">"
			 + "{$TABTITLE}<img src=\"images/nav-curr-line.gif\" align=\"absmiddle\" /></div>";
var tabSelect = "<div id=\"{$TABID}\" class=\"curr\" style=\"float:left;\">"
				+ "<div class=\"curr-left\"><img src=\"images/nav-curr-left.gif\" width=\"3\" height=\"25\" /></div>"
				+ "<div class=\"curr-text\">{$TABTITLE}</div>"
				+ "<div class=\"curr-left\"><img src=\"images/nav-curr-right.gif\" width=\"3\" height=\"25\" /></div></div>";
var tabTitleAr = "|";
var tabUrlAr = "|";
var tabIDAr = "|";
var NowTab;
var ShowTabNum = 6;
function TabPage(){
	var args = TabPage.arguments;//读取参数值
	var tiAR = tabIDAr.split("|");
	var AllN = tiAR.length-2;
	if(AllN>ShowTabNum){
		if(args[0] != undefined){
			if(args[0] == "left"){
				for(var i=1;i<=AllN;i++){
					if($(tiAR[i]).style.display == ""){
						$(tiAR[i-1]).style.display = "";
						$(tiAR[i+ShowTabNum-1]).style.display = "none";
						$("tagNextBtn").style.display= "";
						if(i==2){
							$("tagProtBtn").style.display= "none";
						}
						break;
					}
				}
			}else if(args[0] == "right"){
				for(var i=AllN;i>0;i--){
					if($(tiAR[i]).style.display == ""){
						$(tiAR[i+1]).style.display = "";
						$(tiAR[i-ShowTabNum+1]).style.display = "none";
						$("tagProtBtn").style.display= "";
						if(i==AllN-1){
							$("tagNextBtn").style.display= "none";
						}
					}
				}
			}
		}else{
			for(var i=1;i<=AllN;i++){
				if($(tiAR[i]).style.display == ""){
					$(tiAR[i]).style.display = "none";
					$("tagProtBtn").style.display= "";
					break;
				}
			}
		}
	}else{
		$("tagNextBtn").style.display= "none";
		$("tagProtBtn").style.display= "none";
	}
}

//屏蔽js错误 
function ResumeError() { 
return true; 
} 
window.onerror = ResumeError; 

//实现页面加载效果
function Loading()
{   
    if(CurrPlan < PlanBar)
    {
        var flag =0 ;
        try
        {
            
            if(CurrPlan > 0)
            {
                var objIframeInnerHTML = $(loadingIframeId).contentWindow.document.body.innerHTML;
                if(objIframeInnerHTML.length > 0){
                    clearInterval(intervalID); 
                    if(loadingIframeId == "IFRAME_windowTab_Defent"){
                        TimeUsed = CurrPlan;
                        CurrPlan = 99;
                        flag = 1;                        
                    }
                    else{
                        //完成加载
                        CompletePlanBar();
                    }
                }
            }
        }catch(e){}
        CurrPlan  = CurrPlan*1 + 1;
        if(loadingIframeId == "IFRAME_windowTab_Defent"){
            if(flag == 0)
            {
                try{
                    $("loading_font").innerHTML = CurrPlan + "%";
                    $("currplanbar").style.width = CurrPlan + "%";
                }
                catch(e){}
            }
        }
    }
    if(loadingIframeId == "IFRAME_windowTab_Defent"){
        if(CurrPlan == 100)
        {   
            intervalID2 = setInterval("CompletePlanBar()",5);
        }
    }
}
//完成进度条
function CompletePlanBar()
{
	
    if(loadingIframeId == "IFRAME_windowTab_Defent"){  
        if(TimeUsed < PlanBar)
        {
            try{
                $("loading_font").innerHTML = TimeUsed + "%";
                $("currplanbar").style.width = TimeUsed + "%";
                TimeUsed = TimeUsed*1 + 1;
            }
            catch(e){}
        }
        else{
            try{
                clearInterval(intervalID2);
                loadingFlag = 0;
                RemoveObj("PageLoading");
                RemoveObj("DivMark");
            }
            catch(e)  {}
            CurrPlan = 0;
            TimeUsed = 0;
        }
    }
    else{
       CurrPlan = 0;
       TimeUsed = 0;
       loadingFlag = 0;
     
       RemoveObj("PageLoading");
       RemoveObj("DivMark");
    }
}

 //页面加载点击刷新
 function RefreshPage(id,url){
    $(id).src = url;
    CurrPlan = 0;
    TimeUsed = 0;
    //加载页面         
    intervalID = setInterval("Loading()",1000);
 }
function MM_OpenTabLayers(){//v1.0
	var args = MM_OpenTabLayers.arguments;//读取参数值
	var Title = args[0];
	var Url = args[1];
	var ID = args[2];
	if(ChkObjectIsExists("windowTab_"+ID)){
	    //MM_CloseTabLayers("windowTab_"+ID);
	    SetTabTitleStyle("windowTab_"+ID);
	    $("div_Main_Content").removeChild($("IFRAME_windowTab_" + ID));
	}
	else
	{
	    setSelectToNone();
	    tabTitleAr = tabTitleAr + Title + "|";
	    tabUrlAr = tabUrlAr + Url + "|";
	    tabIDAr = tabIDAr + "windowTab_"+ID + "|";
	    var objnavHtml = $("nav").innerHTML;
	    var Str = tabSelect.replace("{$TABID}","windowTab_"+ID);
	    if(ID == "Defent"){
		    Title = "<a href='#' onclick='SetTabTitleStyle(\"windowTab_"+ID + "\")'>" + Title
				    + "</a>";
	    }else{
		    Title = "<a href='#' onclick='SetTabTitleStyle(\"windowTab_"+ID + "\")'>" + Title
				    + "</a>&nbsp;&nbsp;<img src=\"images/icon-nav-close.gif\" alt=\"关闭窗口\" border=\"0\" onclick=\"MM_CloseTabLayers('windowTab_"+ID+"')\"/>";
	    }
	    Str = Str.replace("{$TABTITLE}",Title);
	    $("nav").innerHTML = objnavHtml + Str;
	    NowTab = "windowTab_"+ID;
	}
	//增加一个Iframe页面
	var id = "IFRAME_" + NowTab;
    var newTab = document.createElement("IFRAME");
    newTab.id= id;
    newTab.frameBorder = 0;
    newTab.scrolling = "yes";
    newTab.className = "inframeStyle";
    newTab.allowTransparency = "true";
    //设置Tab页面的宽度和高度;     
    $("div_Main_Content").appendChild(newTab);  
	newTab.src = Url;
	newTab.height=600;
	newTab.width = $("div_Main").offsetWidth-10;
	TabPage();
	loadingRrl = url;
	loadingIframeId = "IFRAME_windowTab_"+ID;
	if(loadingIframeId != "IFRAME_windowTab_Defent"){
		DivDialog.Loading();
		intervalID = setInterval("Loading()",500);  
	}
	 
//	}else{
//		SetTabTitleStyle("windowTab_"+ID);
//	}
}

function setSelectToNone(){
	if(NowTab != null){
		var Title;
		var ttAr = tabTitleAr.split("|");
		var tiAr = tabIDAr.split("|");
		for(var i = 0 ; i < ttAr.length; i++){
			if(tiAr[i] == NowTab){
				Title = ttAr[i];
			}
		}
		$(NowTab).className = "add";
		if(NowTab == "windowTab_Defent"){
			Title = "<a href='#' onclick='SetTabTitleStyle(\""+NowTab + "\")'>" + Title
					+ "</a>";
			$(NowTab).innerHTML = Title + "&nbsp;&nbsp;<img src=\"images/nav-curr-line.gif\" align=\"absmiddle\" />";
		}else{
			Title = "<a href='#' onclick='SetTabTitleStyle(\""+NowTab + "\")'>" + Title
					+ "</a>&nbsp;&nbsp;<img src=\"images/icon-nav-close.gif\" alt=\"关闭窗口\" border=\"0\" onclick=\"MM_CloseTabLayers('"+NowTab+"')\"/>";
			$(NowTab).innerHTML = Title + "&nbsp;&nbsp;<img src=\"images/nav-curr-line.gif\" align=\"absmiddle\" />";
		}
		//设置窗口 
		var iframeList = document.getElementById("div_Main_Content").getElementsByTagName("iframe");
		for(var i=0;i<iframeList.length;i++){
			iframeList[i].style.display = "none";   
		}
	}
}

function SetTabTitleStyle(TabIDNew){
	if(NowTab != null && NowTab != TabIDNew){
		setSelectToNone();
		var Title;
		var ttAr = tabTitleAr.split("|");
		var tiAr = tabIDAr.split("|");
		for(var i = 0 ; i < ttAr.length; i++){
			if(tiAr[i] == TabIDNew){
				Title = ttAr[i];
			}
		}
		$(TabIDNew).className = "curr";
		if(TabIDNew == "windowTab_Defent"){
			Title ="<div class=\"curr-left\"><img src=\"images/nav-curr-left.gif\" width=\"3\" height=\"25\" /></div>" 
				   + "<div class=\"curr-text\"><a href='#' onclick='SetTabTitleStyle(\""+TabIDNew + "\")'>" + Title
				   + "</a></div><div class=\"curr-left\"><img src=\"images/nav-curr-right.gif\" width=\"3\" height=\"25\" /></div></div>";
			
			$(TabIDNew).innerHTML = Title ;
		}else{
			Title = "<div class=\"curr-left\"><img src=\"images/nav-curr-left.gif\" width=\"3\" height=\"25\" /></div>" 
				    + "<div class=\"curr-text\"><a href='#' onclick='SetTabTitleStyle(\""+TabIDNew + "\")'>" + Title
					+ "</a>&nbsp;&nbsp;<img src=\"images/icon-nav-close.gif\" alt=\"关闭窗口\" border=\"0\" onclick=\"MM_CloseTabLayers('"+TabIDNew + "')\"/></div><div class=\"curr-left\"><img src=\"images/nav-curr-right.gif\" width=\"3\" height=\"25\" /></div></div>";
			$(TabIDNew).innerHTML = Title;
		}
		NowTab = TabIDNew;
	}else if(TabIDNew == "windowTab_Defent"){
		var Title;
		var ttAr = tabTitleAr.split("|");
		Title = ttAr[1];
		$(TabIDNew).className = "curr";
		Title ="<div class=\"curr-left\"><img src=\"images/nav-curr-left.gif\" width=\"3\" height=\"25\" /></div>" 
			   + "<div class=\"curr-text\"><a href='#' onclick='SetTabTitleStyle(\""+TabIDNew + "\")'>" + Title
			   + "</a></div><div class=\"curr-left\"><img src=\"images/nav-curr-right.gif\" width=\"3\" height=\"25\" /></div></div>";
		$(TabIDNew).innerHTML = Title ;
		NowTab = TabIDNew;
	}
	$("IFRAME_" + NowTab).style.display = "";
}
function MM_CloseTabLayers(TablIDNew){
	if(ChkObjectIsExists(TablIDNew)){
		$("nav").removeChild($(TablIDNew));
		$("div_Main_Content").removeChild($("IFRAME_" + TablIDNew));
		CertTab(TablIDNew);
		if(TablIDNew == NowTab){
			var divList = $("nav").getElementsByTagName("DIV");
			NowTab = "windowTab_Defent";
			SetTabTitleStyle(divList[divList.length-1].id);
		}
	}
}
function CertTab(TablIDNew){
	var ttAr = tabTitleAr.split("|");
	var tiAr = tabIDAr.split("|");	
	var tuAr = tabUrlAr.split("|");
	for(var i = 0 ; i < ttAr.length ; i ++){
		if(tiAr[i] == TablIDNew){
			tabTitleAr = tabTitleAr.replace(ttAr[i] + "|","");
			tabUrlAr = tabUrlAr.replace(tuAr[i] + "|","");
			tabIDAr = tabIDAr.replace(tiAr[i] + "|","");
			break;
		}
	}
	if($("tagNextBtn").style.display == ""){
		for(var j=i+1;j<ttAr.length;j++){
			if($(tiAr[j]).style.display == "none"){
				$(tiAr[j]).style.display = "";
				break;
			}		
		}
		if((j+2)==ttAr.length){
			$("tagNextBtn").style.display = "none";
		}
	}else if($("tagProtBtn").style.display == ""){
		for(var j=i-1;j>0;j--){
			if($(tiAr[j]).style.display == "none"){
				$(tiAr[j]).style.display = "";
				break;
			}		
		}
		if(j == 1){
			$("tagProtBtn").style.display = "none";
		}
	}
}
//判断该对象是否存在
function ChkObjectIsExists(id)
{
    try
    {
        var iframeList = document.getElementById(id);
        if(iframeList == null|| iframeList == "undefined")
        {
            return false;
        }
        return true;
    }
    catch(e)
    {
        return false;
    }
}

function  setbg1(temp)
{
	var obj=temp;
	if(obj.className=="Cstyle")
		{obj.className ="Cstyle";}
	else 
		{obj.className ="";}
}
function  setbg2(temp)
{
	var obj=temp;
	if(obj.className=="Cstyle")
		{obj.className ="Cstyle";}
	else 
		{obj.className ="Ovstyle";}
}

		    String.prototype.sub = function(n)
            {
              var r = /[^\x00-\xff]/g;
              if(this.replace(r, "mm").length <= n) return this;
              n = n - 3;
              var m = Math.floor(n/2);
              for(var i=m; i<this.length; i++)
              {
                if(this.substr(0, i).replace(r, "mm").length>=n)
                {
                  return this.substr(0, i) +"...";
                }
              }
              return this;
            };
            
    // 全部选中
    function QuanXuan_Click()
    {
        if (document.form1.ID.length)
        {
            for (var i=0;i<document.form1.ID.length;i++)
            {
                document.form1.ID[i].checked = true;
            }
        }
        else
        {
            document.form1.ID.checked = true;
        }
    }
       
    // 取消选中
    function QuXiao_Click()
    {
        if (document.form1.ID.length)
        {
            for (var i=0;i<document.form1.ID.length;i++)
            {
                document.form1.ID[i].checked = false;
            }
        }
        else
        {
            document.form1.ID.checked = false;
        }
    }
       
    // 反选
    function slcNo_click()
    {
	    for (var i=0;i<document.form1.ID.length;i++)
	    {
		    var e = document.form1.ID[i];
			    if (e.checked==false)
			    {
				    e.checked = true;
			    }
			    else
			    {
				    e.checked = false;
			    }
	    }
    }