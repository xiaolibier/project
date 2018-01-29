<?php
class IndexAction extends Action 
{
	 function index()
	 {
	    $col_news =new Model('col_news');//实例化模型类
		$colnews=$col_news->where('Col_MenuID=326 and Col_State=1')->order('Col_Time desc,Col_ID  desc')->select();
		$datanews=$col_news->where("col_menuid in(select main_id from main_menu where main_type=4 and main_Father=122 and main_state=1) and col_state=1 and col_hot=1")->limit(3)->select(); 
		$datanews2=$col_news->where("col_menuid=259 and col_state=1 and col_hot=1")->order('Col_Time desc')->limit(3)->select(); 
		
		
		$main_menu=new Model('main_menu');
		//$activeinfo=$main_menu->where('Main_Father=329 and Main_State=1')->order('Main_Order asc,Main_ID desc')->select();
		
		
		$activeinfo1=gethotcolnews(351,1,5);
		$activeinfo=get_news(329,5,1);
		$this->assign('colnews',$colnews);
		$this->assign('activeinfo',$activeinfo);
		$this->assign('activeinfo1',$activeinfo1);
		$this->assign('datanews',$datanews2);
	 	$this->display();
	 }
	 
	 
//人才招聘
   function join()
   {
		$id=$_REQUEST["id"];
		$datas=getf_mainmenu($mainfather="27",$maintype="1",$tops="1",$Main_Language="1",$id); 
		if($datas)
		{
			$this->assign('datas',$datas);
		}
		$this->top();
		$this->leftjoin();
		$this->display();
    }	 
	function leftjoin()
   {
 	   $datasrows=getmain_menu($mainfather="27",$main_state="1",$main_language="1");
	   $this->assign('datasrows',$datasrows);
   } 
//资讯中心数据绑定	 
 function news()
 {
	$col_news =new Model('col_news');//实例化模型类
	$id=$_REQUEST["id"];
	$datas =getf_mainmenu($mainfather="122",$maintype="4",$tops="1",$Main_Language="1",$id); 
	$map['Col_MenuID']=$datas["Main_ID"];
	import("ORG.Util.Page"); //导入分页类
	$count = $col_news->where($map)->count();    //计算总数
	$p = new Page ($count,12);
	$colnews=$col_news->where($map)->limit($p->firstRow.','.$p->listRows)->order('Col_Time desc,Col_ID  desc')->select();
	
	$p->setConfig('header', ' ');   //分页样式可自定义
	$p->setConfig('prev', "上一页"); 
	$p->setConfig('next', '下一页'); 
	$p->setConfig('first', '首页'); 
	$p->setConfig('last', '末页'); 
	$page = $p->show ();
	$this->assign('colnews',$colnews);//根据模板变量赋值
	$this->assign('page',$page);
	$this->assign('datas',$datas);
	$this->leftnews();
	$this->display();
 }
	 
function newsinfo()
{
    $nid=$_REQUEST["nid"];
    $col_news=get_colnews($nid);
	$this->assign('col_news',$col_news['datas']);
	$this->assign('datas',$col_news['mainmenu']);
  	$this->leftnews();
	$this->display();
}

function leftnews()
{	  
   $datasrows=getmain_menu($mainfather="122",$main_state="1",$main_language="1");
   $this->top();
   $this->assign('datasrows',$datasrows);
} 

//资讯中心数据绑定	 
 function zcfg()
 {
	$col_news =new Model('col_news');//实例化模型类
	$id=$_REQUEST["id"];
	$datas =getf_mainmenu($mainfather="351",$maintype="4",$tops="1",$Main_Language="1",$id); 
	$map['Col_MenuID']=$datas["Main_ID"];
	import("ORG.Util.Page"); //导入分页类
	$count = $col_news->where($map)->count();    //计算总数
	$p = new Page ($count,12);
	$colnews=$col_news->where($map)->limit($p->firstRow.','.$p->listRows)->order('Col_Time desc,Col_ID  desc')->select();
	
	$p->setConfig('header', ' ');   //分页样式可自定义
	$p->setConfig('prev', "上一页"); 
	$p->setConfig('next', '下一页'); 
	$p->setConfig('first', '首页'); 
	$p->setConfig('last', '末页'); 
	$page = $p->show ();
	$this->assign('colnews',$colnews);//根据模板变量赋值
	$this->assign('page',$page);
	$this->assign('datas',$datas);
	$this->leftzcfg();
	$this->display();
 }

function zcfginfo()
{
    $nid=$_REQUEST["nid"];
    $col_news=get_colnews($nid);
	$this->assign('col_news',$col_news['datas']);
	$this->assign('datas',$col_news['mainmenu']);
  	$this->leftzcfg();
	$this->display();
}

function leftzcfg()
{	  
   $datasrows=getmain_menu($mainfather="351",$main_state="1",$main_language="1");
   $this->top();
   $this->assign('datasrows',$datasrows);
} 



	
//最新活动数据绑定	 
	 function active()
	 {
		$col_news =new Model('col_news');//实例化模型类
	    $id=$_REQUEST["id"];
		$datas =getf_mainmenu($mainfather="329",$maintype="4",$tops="1",$Main_Language="1",$id); 
		$map['Col_MenuID']=$datas["Main_ID"];
	    import("ORG.Util.Page"); //导入分页类
	    $count = $col_news->where($map)->count();    //计算总数
		$p = new Page ($count,12);
		$colnews=$col_news->where($map)->limit($p->firstRow.','.$p->listRows)->order('Col_Time desc,Col_ID  desc')->select();
		
		$p->setConfig('header', ' ');   //分页样式可自定义
	    $p->setConfig('prev', "上一页"); 
	    $p->setConfig('next', '下一页'); 
	    $p->setConfig('first', '首页'); 
	    $p->setConfig('last', '末页'); 
        $page = $p->show ();
	    $this->assign('colnews',$colnews);//根据模板变量赋值
		$this->assign('page',$page);
		$this->assign('datas',$datas);
		$this->leftactive();
	 	$this->display();
	 }
	 
function activeinfo()
{
    $nid=$_REQUEST["nid"];
    $col_news=get_colnews($nid);
	$this->assign('col_news',$col_news['datas']);
	$this->assign('datas',$col_news['mainmenu']);
  	$this->leftactive();
	$this->display();
}

function leftactive()
{	  
   $datasrows=getmain_menu($mainfather="329",$main_state="1",$main_language="1");
   $this->top();
   $this->assign('datasrows',$datasrows);
} 	
	
	
	
	 
//专业团队
function team()
{
	$id=$_REQUEST["id"];
	$col_news =new Model('col_news');//实例化模型类
	$datas=getf_mainmenu($mainfather="79",$maintype="3",$tops="1",$Main_Language="1",$id); 
	if($datas)
	{
	    $map['Col_MenuID']=$datas["Main_ID"];
		$map['Col_State']=1;
		$colnews=$col_news->where($map)->order('Col_Time desc,Col_ID  desc')->select();
		$this->assign('colnews',$colnews);
		$this->assign('datas',$datas);
	}
	$this->leftteam();
	$this->display();
}	 
function leftteam()
{
   $datasrows=getmain_menu($mainfather="79",$main_state="1",$main_language="1");
   	$this->top();
   $this->assign('datasrows',$datasrows);
} 	 	 
//专业团队结束		 
	 
//关于我们	 
 function about()
 { 
	    $id=$_REQUEST["id"];
	    $col_news =new Model('col_news');//实例化模型类
		$datas=getf_mainmenu($mainfather="113",$maintype="4",$tops="1",$Main_Language="1",$id); 
		if($datas)
		{
			$this->assign('datas',$datas);
			$map['Col_MenuID']=$datas["Main_ID"];
			$map['Col_State']=1;
			$colnews=$col_news->where($map)->order('Col_Time desc,Col_ID  desc')->select();
			$this->assign('colnews',$colnews);
		}
	  
	   $this->leftabout();
	   $this->display();
 } 
 
 
function video()
{
	$id=$_REQUEST["id"];
	$datas=getf_mainmenu($mainfather="113",$maintype="1",$tops="1",$Main_Language="1",$id); 
	if($datas)
	{
		$this->assign('datas',$datas);
	}
	$this->assign('ids',$id);
	$this->leftabout();
	$this->display();
}	
 
 
function honor()
{
    $col_news =new Model('col_news');//实例化模型类
	$id=$_REQUEST["id"];
   $datas=getf_mainmenu($mainfather="113",$maintype="1",$tops="1",$Main_Language="1",$id); 
	if($datas)
	{
		$this->assign('datas',$datas);
	}
	

	$colpic=$col_news->where("Col_MenuID=336 and Col_State=1")->order('Col_Time desc,Col_ID  desc')->select();
    $colhy=$col_news->where("Col_MenuID=337 and Col_State=1")->order('Col_Time desc,Col_ID  desc')->select();
    $colnews=$col_news->where("Col_MenuID=338 and Col_State=1")->order('Col_Time desc,Col_ID  desc')->select();


	$this->assign('colpic',$colpic);
	$this->assign('colhy',$colhy);
	$this->assign('colnews',$colnews);
	$this->leftabout();
	$this->display();
} 
 
 
 
function leftabout()
{	  
   $datasrows=getmain_menu($mainfather="113",$main_state="1",$main_language="1");
   $this->top();
   $this->assign('datasrows',$datasrows);
} 
//关于我们结束 
 
 
//业务范围
 function business()
 { 
	   $id=$_REQUEST["id"];
		$datas=getf_mainmenu($mainfather="261",$maintype="1",$tops="1",$Main_Language="1",$id); 
		if($datas)
		{
			$this->assign('datas',$datas);
		}
	   $this->leftbusiness();
	   $this->display();
 } 
 
 function leftbusiness()
{	  
   $datasrows=getmain_menu($mainfather="261",$main_state="1",$main_language="1");
   $this->top();
   $this->assign('datasrows',$datasrows);
} 
 
//最新活动
 function zxhd()
 { 
	   $id=$_REQUEST["id"];
		$datas=getf_mainmenu($mainfather="329",$maintype="1",$tops="1",$Main_Language="1",$id); 
		if($datas)
		{
			$this->assign('datas',$datas);
		}
	   $this->leftzxhd();
	   $this->display();
 } 
 
 function leftzxhd()
{	  
   $datasrows=getmain_menu($mainfather="329",$main_state="1",$main_language="1");
   $this->top();
   $this->assign('datasrows',$datasrows);
}  
 
 
 
//联系我们 
function contact()
{
	$id=$_REQUEST["id"];
	$datas=getf_mainmenu($mainfather="265",$maintype="1",$tops="1",$Main_Language="1",$id); 
	if($datas)
	{
		$this->assign('datas',$datas);
	}
	$this->top();
	$this->leftcont();
	$this->display();
}

function states()
{
	$id=$_REQUEST["id"];
	$datas=getf_mainmenu($mainfather="265",$maintype="5",$tops="1",$Main_Language="1",$id); 
	if($datas)
	{
		$this->assign('datas',$datas);
	}
	$this->top();
	$this->leftcont();
	$this->display();
}

	 
function leftcont()
{
   $datasrows=getmain_menu($mainfather="265",$main_state="1",$main_language="1");
   $this->assign('datasrows',$datasrows);
}  

 function globe()
{
	/* $id=$_REQUEST["id"];
	$datas=getf_mainmenu($mainfather="272",$maintype="1",$tops="1",$Main_Language="1",$id); 
	if($datas)
	{
		$this->assign('datas',$datas);
	}
	$this->top();
	$this->leftglobe();
	$this->display(); */
	$col_news =new Model('col_news');//实例化模型类
	$id=$_REQUEST["id"];
	$datas =getf_mainmenu($mainfather="272",$maintype="4",$tops="1",$Main_Language="1",$id); 
	$map['Col_MenuID']=$datas["Main_ID"];
	import("ORG.Util.Page"); //导入分页类
	$count = $col_news->where($map)->count();    //计算总数
	$p = new Page ($count,12);
	$colnews=$col_news->where($map)->limit($p->firstRow.','.$p->listRows)->order('Col_Time desc,Col_ID  desc')->select();
	
	$p->setConfig('header', ' ');   //分页样式可自定义
	$p->setConfig('prev', "上一页"); 
	$p->setConfig('next', '下一页'); 
	$p->setConfig('first', '首页'); 
	$p->setConfig('last', '末页'); 
	$page = $p->show ();
	$this->assign('colnews',$colnews);//根据模板变量赋值
	$this->assign('page',$page);
	$this->assign('datas',$datas);
	$this->leftnews();
	$this->top();
	$this->leftglobe();
	$this->display();
	
	
}

function leftglobe()
{
   $datasrows=getmain_menu($mainfather="272",$main_state="1",$main_language="1");
   $this->assign('datasrows',$datasrows);
}  

//搜索中心
 function searchlist()
{
    
    $keysword=$_REQUEST["ukey"];
	$col_news=D("col_news");
     $contion="col_menuid in (select main_id from main_menu where main_type=4 and main_father=122 and main_language=1 and main_state=1 ) And Col_Title like '%".$keysword."%'";
	 import("ORG.Util.Page"); //导入分页类
	 $count = $col_news->where($contion)->count();    //计算总数
	 $p = new Page ($count,5);
	 $colnews=$col_news->where($contion)->limit($p->firstRow.','.$p->listRows)->order('Col_Time desc,Col_ID  desc')->select();
	 $p->setConfig('header', ' ');   //分页样式可自定义
	 $p->setConfig('prev', "上一页"); 
	 $p->setConfig('next', '下一页'); 
	 $p->setConfig('first', '首页'); 
	 $p->setConfig('last', '末页'); 
	 $page = $p->show ();
	 $this->assign('colnews',$colnews);//根据模板变量赋值
	 $this->assign('page',$page);
	 $this->top();
	 $this->display();
	
}
 



 
 
 

  function top()
  {
	$this->footer();
  }
 
	function footer()
	{
	}
	 
}