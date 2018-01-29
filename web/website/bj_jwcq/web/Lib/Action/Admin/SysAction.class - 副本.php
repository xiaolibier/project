<?php

 header("Content-Type:text/html; charset=UTF-8");
class SysAction extends Action 
{

   
	function login()
	{
		$flag=$this->_get("flag");
		if($flag=="createimg")
		{
			session_start();
			getCode(4,60,20);
		}
		else
		    $this->display("login");
	} 
	function mlogin()
	{
		$unames=$this->_request("username");
		$upwds=md5($this->_request("password"));
		$verifycode=$this->_request("verifycode");
		$hy=M("Madmin");
		$where["SysU_Username"]=$unames;
		$where["SysU_Password"]=$upwds;
		$datas=$hy->where($where)->select();
		
			//errorlog(session("helloweba_char"));
			if($verifycode<>session("helloweba_char"))
			{
			    echo "<script>alert('验证码输入错误');history.back();</script>";
				//$this->error('验证码输入错误！'); 
			}
			else
			{
				if($datas) 
				{
					$_SESSION["username"]=$unames;
					$_SESSION["userole"]=$datas[0]['SysU_Role'];
					$this->redirect("__APP__/Admin/Sys/index");
				}
				else
				{
				   echo "<script>alert('登陆失败,请重新登陆');</script>";
					$this->redirect("__APP__/Admin/Sys/login");
				}
		}
	}
	
	function index()
	{   
	
	      if(!$_SESSION['username'])
	 		{ 
			  echo "<script>alert('当前用户未登录或登录超时，请重新登录!');top.location.href='/Admin/Sys/login/'; </script>";
             	
        	}
		 $this->display("index");
	}
	
	//绑定左侧菜单栏
	function left()
	{
	   //cho($_SESSION["userole"]);
	    $userole=$_SESSION["userole"];
	    $s_menu=M("s_menu");
	    $contion["MFather"]=0;
		$contion["MState"]=1; 
	    $mrows=$s_menu->where($contion)->select();
		if($mrows)
		{	
		    //它的格式是这样的foreach(数组名 as 下标＝>值)
			 foreach($mrows as $key=>$val)
			 {
			  	$m["MFather"]=$val['MID'];  
				$m['MID']=array('in',$userole);
              	$mrows[$key]['mdatas']=$s_menu->where($m)->select();
				
			}
		}
		$this->assign('list', $mrows);
		$this->display("left");
    }
	
	function about()
	{
	  
	   $language=$_REQUEST["Language"];
	   $ffaID=$_REQUEST["ffaID"];
	   $faID=$this->_request("faID");
	   
	   if(empty($language))
	   {
	   		$i_language=1;
	   }
	   else
	   {
	   		 $i_language=$_REQUEST["Language"];
	   }
	   
	   $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   if($ffaID<> $faID)
	   {
	   		$this->getfilenames($ftype=3,$faID, $MID="Main_ID");
			$locationstr=">";
	   }
	   else
	   {
	   		$locationstr="";
	   }
	   $TheObj =new Model('main_menu');//实例化模型类
		if(!empty($ffaID))
		{
			$map['Main_Father']=$faID;
		}
		$map['Main_Language']=$i_language;
	    import("ORG.Util.Page"); //导入分页类
	    $count = $TheObj->where($map)->count();    //计算总数
		$p = new Page ($count,20);
		$p->setConfig('header','条信息'); 
		$p->setConfig('prev',"<"); 
		$p->setConfig('next','>'); 
		$p->setConfig('first','<<'); 
		$p->setConfig('last','>>'); 
		$page = $p->show ();
		$this->assign( "page", $page );
		$info_detail=$TheObj->where($map)->limit($p->firstRow.','.$p->listRows)->order('main_order asc,Main_ID  desc')->select(); //查询
	   $this->assign('info_detail',$info_detail);//根据模板变量赋值
	   $this->assign('ffaID', $ffaID);
	   $this->assign('fid', $ffaID);
	   $this->assign('faID', $faID);
	   $this->assign('i_language',$i_language);
	   $this->assign('locationstr',$locationstr);
	   $this->display("about");
	}
	
	
	
	function aboutNewsList()
	{
	    
	   $language=$this->_request('Language');
	   $ffaID=$_REQUEST["ffaID"];
	   $faID=$this->_request("faID");
	   $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   $this->getfilenames($ftype=3,$faID, $MID="Main_ID");
	   $TheObj =new Model('col_news');//实例化模型类
		if(!empty($ffaID))
		{
			$map['Col_MenuID']=$faID;
		}
	    import("ORG.Util.Page"); //导入分页类
	    $count = $TheObj->where($map)->count();    //计算总数
		$p = new Page ($count,20);
		$p->setConfig('header','条信息'); 
		$p->setConfig('prev',"<"); 
		$p->setConfig('next','>'); 
		$p->setConfig('first','<<'); 
		$p->setConfig('last','>>'); 
		$page = $p->show ();
		$this->assign( "page", $page );
		$info_detail=$TheObj->where($map)->limit($p->firstRow.','.$p->listRows)->order('Col_Order asc,Col_Time  desc,Col_ID desc')->select(); //查询
	   $this->assign('info_detail',$info_detail);//根据模板变量赋值
	   $this->assign('ffaID', $ffaID);
	   $this->assign('language', $language);
	   $this->assign('faID', $faID);
	   $this->display("aboutNewsList");
	}
	
	function aboutimgnewscolcreat_add()
	{
	     
		 $uploads = $this->_upload();
		 $ttedu_pic = $uploads['image']; 
		 $ttedu_fujian = $uploads['fujian']; 
		 $sbutton=$this->_request("Submit");
		 $ffaID=$this->_request("ffaids");
		 $faID=$this->_request("col_menuid");
		 $ColTitle=$this->_request("ColTitle");
		 $ColEditor=$this->_request("ColEditor");
		 $ColHot=$this->_request("ColHot");
		 $ColState=$this->_request("ColState");
		 $language=$this->_request("Language");
		 $ColClick=$this->_request("ColClick");
		 $ColTime=$this->_request("ColTime");
		 $ColOrder=$this->_request("ColOrder");
		 $content1=$this->_request("content1");
		 
	      
		 $col_news=M("col_news");
		  switch($sbutton)
		  {
		    ///添加信息内容
		  	case "保存":
		 	  $data["Col_Title"]= $ColTitle;
		      $data["Col_Editor"]= $ColEditor;
		      $data["Col_Hot"]= $ColHot;
		      $data["Col_State"]= $ColState;
		      $data["Col_Click"]= $ColClick;
			  $data["Col_Time"]= $ColTime;
			  $data["Col_Order"]= $ColOrder;
		      $data["Col_Content"]=$content1;
			  $data["Col_Pic"]=$ttedu_pic;
			  $data["Col_File"]=$ttedu_fujian;
			  $data["Col_MenuID"]=$faID;
			  $data["Col_proid"]=$ffaID;
			  $data["Col_Language"]=$language;
		      $res=$col_news->add($data);
			  //写入日志
			  self::add_login($ColTitle,$content1,$type="添加");
		      echo "<script>alert('添加成功');window.location.href='/Sys/aboutimgNewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."'</script>";
			  break;
			case "修改":
			  $id=$this->_request("id");
			  if(!empty($id))
			  {
				  $contion["Col_ID"]=$id;
				  $Data["Col_Title"]= $ColTitle;
				  $Data["Col_State"]= $ColState;
				  $Data["Col_Order"]= $ColOrder;
				  $Data["Col_Time"]= $ColTime;
				  $Data["Col_Content"]= $content1;
				   if (!empty($uploads['image']))
					{
						$ttedu_pic = $uploads['image'];
						$Data["Col_Pic"]=$ttedu_pic; 
					}
					if (!empty($uploads['fujian']))
					{
						$ttedu_fujian = $uploads['fujian'];
						$Data["Col_File"]=$ttedu_fujian; 
					}
				  $Data["Col_Click"]= $ColClick;
				  $Data["Col_Hot"]= $ColHot;
				  $Data["Col_Editor"]= $ColEditor;
				  $Mlist=$col_news->where($contion)->data($Data)->save();
				  if($Mlist!==false) 
					{ 
					      //写入日志
						   self::add_login($ColTitle,$content1,$type="修改");
						  echo "<script>alert('数据修改成功!');window.location.href='/Sys/aboutimgNewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."'</script>";
					}
					else
					{ 
						$this->error('数据更新失败！'); 
					} 
			    }
			   break;
		  } 
	}
	//人才招聘数据绑定
	function job_list()
	{
	  
	   $language=$_REQUEST["Language"];
	   $ffaID=$_REQUEST["ffaID"];
	   $faID=$this->_request("faID");
	   
	   if(empty($language))
	   {
	   		$i_language=1;
	   }
	   else
	   {
	   		 $i_language=$_REQUEST["Language"];
	   }
	   
	   $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   if($ffaID<> $faID)
	   {
	   		$this->getfilenames($ftype=3,$faID, $MID="Main_ID");
			$locationstr=">";
	   }
	   else
	   {
	   		$locationstr="";
	   }
	   $TheObj =new Model('main_menu');//实例化模型类
		if(!empty($ffaID))
		{
			$map['Main_Father']=$faID;
		}
		$map['Main_Language']=$i_language;
	    import("ORG.Util.Page"); //导入分页类
	    $count = $TheObj->where($map)->count();    //计算总数
		$p = new Page ($count,20);
		$p->setConfig('header','条信息'); 
		$p->setConfig('prev',"<"); 
		$p->setConfig('next','>'); 
		$p->setConfig('first','<<'); 
		$p->setConfig('last','>>'); 
		$page = $p->show ();
		$this->assign( "page", $page );
		$info_detail=$TheObj->where($map)->limit($p->firstRow.','.$p->listRows)->order('main_order asc,Main_ID  desc')->select(); //查询
	   $this->assign('info_detail',$info_detail);//根据模板变量赋值
	   $this->assign('ffaID', $ffaID);
	   $this->assign('fid', $ffaID);
	   $this->assign('faID', $faID);
	   $this->assign('i_language',$i_language);
	   $this->assign('locationstr',$locationstr);
	   $this->display("job_list");
	}
	
	function about_creat()
	{
	
	   $language=$this->_request('Language');
	   $act=$_REQUEST["Save"];
	   $faID=$this->_request("faID");
	   $ffaID=$this->_request("ffaID");
	  $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   switch($act)
	   {
	   	  case "Add":
	   	      $COrder=1;
			  $Main_State=1;
			  $bvalue="保存";
			  $Main_Type=1;
		      $this->assign('ffaids',$ffaID);
			  $this->assign('Main_State',$Main_State);
			  $this->assign('faID',$faID);
			  $this->assign('Main_Type',$Main_Type);
			  $this->assign('bvalue',$bvalue);
		      $this->assign('COrder',$COrder);
			  $this->assign('language',$language);
			  break;
		  case "Edit":
		  	 $id=$this->_request("id");
			 $this->assign('id',$id);
			 $this->assign('language',$language);
			 $bvalue="修改";
		  	 if(!empty($id))
			 { 
		       $this->assign('ffaids',$ffaID); 
			   $this->assign('faID',$faID); 
				$Theobj=M("main_menu");
				$m=M("main_menu");
				$contion["Main_ID"]=$id;
				$menu_info=$Theobj->where($contion)->find(); //查询
				$menu_data=$m->where("Main_ID='".$id."'")->select(); //查询
				$COrder=$menu_data[0]['Main_Order'];
				$Main_Pic=$menu_data[0]['Main_Pic'];
				$Main_State=$menu_data[0]['Main_State'];
				$Main_Type=$menu_data[0]['Main_Type'];
				$this->assign('Main_Type',$Main_Type);
				$this->assign('Main_Pic',$Main_Pic);
				$this->assign('Main_State',$Main_State);
				$this->assign('COrder',$COrder);
				$this->assign('bvalue',$bvalue);
				$this->assign('menuinfo',$menu_info);
			 }
			 break;
	   }
		$this->display("about_creat");
	}
	
	function about_add()
	{
	     $language=$this->_request("Language");
		 $sbutton=$this->_request("Submit");
		 $ffaID=$this->_request("ffaids");
		 $faID=$this->_request("faID");
		 $ColName=$this->_request("ColName");
		 $COrder=$this->_request("COrder");
		 $CType=$this->_request("CType");
		 $content1=$this->_request("content1");
		 $State=$this->_request("State");
		 $uploads = $this->_upload();
		 $main_pic = $uploads['image']; 
		 $main_menu=M("main_menu");
		  switch($sbutton)
		  {
		    ///添加信息内容
		  	case "保存":
		 	  $data["Main_Name"]= $ColName;
		      $data["Main_State"]= $State;
		      $data["Main_Order"]= $COrder;
			  $data["Main_Pic"]= $main_pic;
		      $data["Main_Type"]= $CType;
		      $data["Main_Content"]= $content1;
		      $data["Main_Father"]=$faID;
			  $data["Main_Language"]=$language;
		      $res=$main_menu->add($data);
			  ///写入操作日志
			  self::add_login($ColName,$content1,$type="添加");
		      echo "<script>alert('信息添加成功!');window.location.href='/Sys/about?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."';</script>";
			  break;
			case "修改":
			  $id=$this->_request("id");
			  if(!empty($id))
			  {
				  $contion["Main_ID"]=$id;
				  $Data["Main_Name"]= $ColName;
				  $Data["Main_State"]= $State;
				  $Data["Main_Order"]= $COrder;
				  $Data["Main_Type"]= $CType;
				  if (!empty($uploads['image']))
				  {
					$main_pic = $uploads['image']; 
					$Data["Main_Pic"]= $main_pic;
				   }
				  $Data["Main_Content"]= $content1;
	              //写入日志
				   self::add_login($ColName,$content1,$type="修改");
				  $Mlist=$main_menu->where($contion)->data($Data)->save();
				  if($Mlist!==false) 
					{ 
						 echo "<script>alert('数据修改成功!');window.location.href='/Sys/about?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."';</script>";
					}
					else
					{ 
						$this->error('数据更新失败！'); 
					} 
			    }
			   break;
		  } 
	}
	
	
	function aboutColCreate()
	{
	   $act=$_REQUEST["Save"];
	   $language=$this->_request("Language");
	   $Theobj=M("col_news");
	   $m=M("col_news");
	   $model=M("main_menu");
	   $faID=$this->_request("faID");
	   $ffaID=$this->_request("ffaID");
	   $nickname = $model->where('main_id="'.$faID.'"')->getField('Main_Name'); 
	   $nicknames=$model->where('main_id="'.$ffaID.'"')->getField('Main_Name'); 
	   $this->assign('nickname',$nickname);
	   $this->assign('language',$language);
	   $this->assign('nicknames',$nicknames);
	   switch($act)
	   {
	   	  case "Add": 
	   	      $Col_Order=1;
			  $bvalue="保存";
			  $ColClick=9999;
		      $ffaID=$this->_request("ffaID");
			  $col_time=date("Y-m-d" ,time());
			  $faID=$this->_request("faID");
		      $this->assign('ffaids',$ffaID);
			  $this->assign('col_time',$col_time);
			  $this->assign('ColClick',$ColClick);
			  $this->assign('col_menuid',$faID);
			  $this->assign('bvalue',$bvalue);
		      $this->assign('Col_Order',$Col_Order);
			  break;
		  case "Edit":
		  	 $id=$this->_request("id");
			 $this->assign('id',$id);
			 $bvalue="修改";
		  	 if(!empty($id))
			 { 
			    $ffaID=$this->_request("ffaID");
				$colmenuid=$this->_request("faID");
		        $this->assign('ffaids',$ffaID);
				$this->assign('col_menuid',$colmenuid);
				$contion["Col_ID"]=$id;
				$col_newsinfo=$Theobj->where($contion)->find(); //查询
				$menu_data=$m->where("Col_ID='".$id."'")->select(); //查询
				$Col_Order=$menu_data[0]['Col_Order'];
				$Col_State=$menu_data[0]['Col_State'];
				$ColClick=$menu_data[0]['Col_Click'];
				$col_time=$menu_data[0]['Col_Time'];
				$Col_Hot=$menu_data[0]['Col_Hot'];
				$Col_Pic=$menu_data[0]["Col_Pic"];
			 	$Col_File=$menu_data[0]["Col_File"];
				$this->assign('Col_Pic',$Col_Pic);
				$this->assign('Col_File',$Col_File);
				$this->assign('Col_State',$Col_State);
				$this->assign('col_time',$col_time);
				$this->assign('Col_Hot',$Col_Hot);
				$this->assign('Col_Order',$Col_Order);
				$this->assign('ColClick',$ColClick);
				$this->assign('bvalue',$bvalue);
				$this->assign('col_newsinfo',$col_newsinfo);
			 }
			 break;
	   }
		 $this->display("aboutColCreate");
	}
	
	function aboutcolcreat_add()
	{
	     
		 $uploads = $this->_upload();
		 $ttedu_pic = $uploads['image']; 
		 $ttedu_fujian = $uploads['fujian']; 
		 $sbutton=$this->_request("Submit");
		 $ffaID=$this->_request("ffaids");
		 $language=$this->_request("Language");
		 $faID=$this->_request("col_menuid");
		 $ColTitle=$this->_request("ColTitle");
		 $ColEditor=$this->_request("ColEditor");
		 $ColHot=$this->_request("ColHot");
		 $ColState=$this->_request("ColState");
		 $ColClick=$this->_request("ColClick");
		 $ColTime=$this->_request("ColTime");
		 $ColOrder=$this->_request("ColOrder");
		 $content1=$this->_request("content1");
		 $col_news=M("col_news");
		  switch($sbutton)
		  {
		    ///添加信息内容
		  	case "保存":
		 	  $data["Col_Title"]= $ColTitle;
		      $data["Col_Editor"]= $ColEditor;
		      $data["Col_Hot"]= $ColHot;
		      $data["Col_State"]= $ColState;
		      $data["Col_Click"]= $ColClick;
			  $data["Col_Time"]= $ColTime;
			  $data["Col_Order"]= $ColOrder;
		      $data["Col_Content"]=$content1;
			  $data["Col_Pic"]=$ttedu_pic; 
			  $data["Col_File"]=$ttedu_fujian; 
			  $data["Col_MenuID"]=$faID;
			  $data["Col_proid"]=$ffaID;
			  $data["Col_Language"]=$language;
		      $res=$col_news->add($data);
			  //写入日志
			   self::add_login($ColTitle,$content1,$type="添加");
		      echo "<script>alert('数据添加成功!');window.location.href='/Sys/aboutNewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."'</script>";
			  break;
			case "修改":
			  $id=$this->_request("id");
			  if(!empty($id))
			  {
				  $contion["Col_ID"]=$id;
				  $Data["Col_Title"]= $ColTitle;
				  $Data["Col_State"]= $ColState;
				  $Data["Col_Order"]= $ColOrder;
				  $Data["Col_Time"]= $ColTime;
				  $Data["Col_Content"]= $content1;
				   if (!empty($uploads['image']))
					{
						$ttedu_pic = $uploads['image'];
						$Data["Col_Pic"]=$ttedu_pic; 
					}
					if (!empty($uploads['fujian']))
					{
						$ttedu_fujian = $uploads['fujian'];
						$Data["Col_File"]=$ttedu_fujian; 
					}
				  
				  $Data["Col_Click"]= $ColClick;
				  $Data["Col_Hot"]= $ColHot;
				  $Data["Col_Editor"]= $ColEditor;
				  $Mlist=$col_news->where($contion)->data($Data)->save();
				  if($Mlist!==false) 
					{ 
					      //写入日志
						   self::add_login($ColTitle,$content1,$type="修改");
						  echo "<script>alert('数据修改成功!');window.location.href='/Sys/aboutNewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."';</script>";
					}
					else
					{ 
						$this->error('数据更新失败！'); 
					} 
			    }
			   break;
		  } 
	}
	
	
	function aboutimgNewsList()
	{
	   $language=$this->_request("Language");
	   $ffaID=$_REQUEST["ffaID"];
	   $faID=$this->_request("faID");
	   $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   $this->getfilenames($ftype=3,$faID, $MID="Main_ID");
	   $TheObj =new Model('col_news');//实例化模型类
		if(!empty($ffaID))
		{
			$map['Col_MenuID']=$faID;
		}
	    import("ORG.Util.Page"); //导入分页类
	    $count = $TheObj->where($map)->count();    //计算总数
		$p = new Page ($count,20);
		$p->setConfig('header','条信息'); 
		$p->setConfig('prev',"<"); 
		$p->setConfig('next','>'); 
		$p->setConfig('first','<<'); 
		$p->setConfig('last','>>'); 
		$page = $p->show ();
		$this->assign( "page", $page );
		$info_detail=$TheObj->where($map)->limit($p->firstRow.','.$p->listRows)->order('Col_Order asc,Col_Time  desc,Col_ID desc')->select(); //查询
	   $this->assign('info_detail',$info_detail);//根据模板变量赋值
	   $this->assign('ffaID', $ffaID);
	   $this->assign('language',$language);
	   $this->assign('faID', $faID);
	   $this->display("aboutimgNewsList");
	}
	
	function aboutimgColCreate()
	{
	   $act=$_REQUEST["Save"];
	   
	   $Theobj=M("col_news");
	   $m=M("col_news");
	   $model=M("main_menu");
	   $faID=$this->_request("faID");
	   $ffaID=$this->_request("ffaID");
	   $language=$this->_request("Language");
	   $nickname = $model->where('main_id="'.$faID.'"')->getField('Main_Name'); 
	   $nicknames=$model->where('main_id="'.$ffaID.'"')->getField('Main_Name'); 
	   $this->assign('nickname',$nickname);
	   $this->assign('language',$language);
	   $this->assign('nicknames',$nicknames);
	   switch($act)
	   {
	   	  case "Add": 
	   	      $Col_Order=1;
			  $bvalue="保存";
			  $ColClick=9999;
		      $ffaID=$this->_request("ffaID");
			  $col_time=date("Y-m-d" ,time());
			  $faID=$this->_request("faID");
		      $this->assign('ffaids',$ffaID);
			  $this->assign('col_time',$col_time);
			  $this->assign('ColClick',$ColClick);
			  $this->assign('col_menuid',$faID);
			  $this->assign('bvalue',$bvalue);
		      $this->assign('Col_Order',$Col_Order);
			  break;
		  case "Edit":
		  	 $id=$this->_request("id");
			 $this->assign('id',$id);
			 $bvalue="修改";
		  	 if(!empty($id))
			 { 
			    $ffaID=$this->_request("ffaID");
				$colmenuid=$this->_request("faID");
		        $this->assign('ffaids',$ffaID);
				$this->assign('col_menuid',$colmenuid);
				$contion["Col_ID"]=$id;
				$col_newsinfo=$Theobj->where($contion)->find(); //查询
				$menu_data=$m->where("Col_ID='".$id."'")->select(); //查询
				$Col_Order=$menu_data[0]['Col_Order'];
				$Col_State=$menu_data[0]['Col_State'];
				$ColClick=$menu_data[0]['Col_Click'];
				$col_time=$menu_data[0]['Col_Time'];
				$Col_Hot=$menu_data[0]['Col_Hot'];
				$Col_Pic=$menu_data[0]["Col_Pic"];
			 	$Col_File=$menu_data[0]["Col_File"];
				$this->assign('Col_Pic',$Col_Pic);
				$this->assign('Col_File',$Col_File);
				$this->assign('Col_State',$Col_State);
				$this->assign('col_time',$col_time);
				$this->assign('Col_Hot',$Col_Hot);
				$this->assign('Col_Order',$Col_Order);
				$this->assign('ColClick',$ColClick);
				$this->assign('bvalue',$bvalue);
				$this->assign('col_newsinfo',$col_newsinfo);
			 }
			 break;
	   }
		 $this->display("aboutimgColCreate");
	}

	function job_creat()
	{
	
	   $language=$this->_request('Language');
	   $act=$_REQUEST["Save"];
	   $faID=$this->_request("faID");
	   $ffaID=$this->_request("ffaID");
	  $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   switch($act)
	   {
	   	  case "Add":
	   	      $COrder=1;
			  $Main_State=1;
			  $bvalue="保存";
			  $Main_Type=1;
		      $this->assign('ffaids',$ffaID);
			  $this->assign('Main_State',$Main_State);
			  $this->assign('faID',$faID);
			  $this->assign('Main_Type',$Main_Type);
			  $this->assign('bvalue',$bvalue);
		      $this->assign('COrder',$COrder);
			  $this->assign('language',$language);
			  break;
		  case "Edit":
		  	 $id=$this->_request("id");
			 $this->assign('id',$id);
			 $this->assign('language',$language);
			 $bvalue="修改";
		  	 if(!empty($id))
			 { 
		       $this->assign('ffaids',$ffaID); 
			   $this->assign('faID',$faID); 
				$Theobj=M("main_menu");
				$m=M("main_menu");
				$contion["Main_ID"]=$id;
				$menu_info=$Theobj->where($contion)->find(); //查询
				$menu_data=$m->where("Main_ID='".$id."'")->select(); //查询
				$COrder=$menu_data[0]['Main_Order'];
				$Main_Pic=$menu_data[0]['Main_Pic'];
				$Main_State=$menu_data[0]['Main_State'];
				$Main_Type=$menu_data[0]['Main_Type'];
				$this->assign('Main_Type',$Main_Type);
				$this->assign('Main_Pic',$Main_Pic);
				$this->assign('Main_State',$Main_State);
				$this->assign('COrder',$COrder);
				$this->assign('bvalue',$bvalue);
				$this->assign('menuinfo',$menu_info);
			 }
			 break;
	   }
		$this->display("job_creat");
	}
	function job_add()
	{
	     $language=$this->_request("Language");
		 $sbutton=$this->_request("Submit");
		 $ffaID=$this->_request("ffaids");
		 $faID=$this->_request("faID");
		 $ColName=$this->_request("ColName");
		 $COrder=$this->_request("COrder");
		 $CType=$this->_request("CType");
		 $content1=$this->_request("content1");
		 $State=$this->_request("State"); 
		 $uploads = $this->_upload();
		 $main_pic = $uploads['image']; 
		 $main_menu=M("main_menu");
		  switch($sbutton)
		  {
		    ///添加信息内容
		  	case "保存":
		 	  $data["Main_Name"]= $ColName;
		      $data["Main_State"]= $State;
		      $data["Main_Order"]= $COrder;
			  $data["Main_Pic"]= $main_pic;
		      $data["Main_Type"]= $CType;
		      $data["Main_Content"]= $content1;
		      $data["Main_Father"]=$faID;
			  $data["Main_Language"]=$language;
		      $res=$main_menu->add($data);
			  ///写入操作日志
			  self::add_login($ColName,$content1,$type="添加");
		      echo "<script>alert('信息添加成功!');window.location.href='/Sys/job_list?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."';</script>";
			  break;
			case "修改":
			  $id=$this->_request("id");
			  if(!empty($id))
			  {
				  $contion["Main_ID"]=$id;
				  $Data["Main_Name"]= $ColName;
				  $Data["Main_State"]= $State;
				  $Data["Main_Order"]= $COrder;
				  $Data["Main_Type"]= $CType;
				   if (!empty($uploads['image']))
					{
						$main_pic = $uploads['image']; 
						$Data["Main_Pic"]= $main_pic;
					}
				  $Data["Main_Content"]= $content1;
	              //写入日志
				  self::add_login($ColName,$content1,$type="修改");
				  $Mlist=$main_menu->where($contion)->data($Data)->save();
				  if($Mlist!==false) 
					{ 
						 echo "<script>alert('数据修改成功!');window.location.href='/Sys/job_list?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."';</script>";
					}
					else
					{ 
						$this->error('数据更新失败！'); 
					} 
			    }
			   break;
		  } 
	}
	function jobimgNewsList()
	{
	
	    $language=$this->_request("Language");
	   $ffaID=$_REQUEST["ffaID"];
	   $faID=$this->_request("faID");
	   $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   $this->getfilenames($ftype=3,$faID, $MID="Main_ID");
	   $TheObj =new Model('col_news');//实例化模型类
		if(!empty($ffaID))
		{
			$map['Col_MenuID']=$faID;
		}
	    import("ORG.Util.Page"); //导入分页类
	    $count = $TheObj->where($map)->count();    //计算总数
		$p = new Page ($count,20);
		$p->setConfig('header','条信息'); 
		$p->setConfig('prev',"<"); 
		$p->setConfig('next','>'); 
		$p->setConfig('first','<<'); 
		$p->setConfig('last','>>'); 
		$page = $p->show ();
		$this->assign( "page", $page );
		$info_detail=$TheObj->where($map)->limit($p->firstRow.','.$p->listRows)->order('Col_Order asc,Col_Time  desc,Col_ID desc')->select(); //查询
	   $this->assign('info_detail',$info_detail);//根据模板变量赋值
	   $this->assign('ffaID', $ffaID);
	   $this->assign('language',$language);
	   $this->assign('faID', $faID);
	   $this->display("jobimgNewsList");
	}
	
	function jobimgColCreate()
	{
	   $act=$_REQUEST["Save"];
	   
	   $Theobj=M("col_news");
	   $m=M("col_news");
	   $model=M("main_menu");
	   $faID=$this->_request("faID");
	   $ffaID=$this->_request("ffaID");
	   $language=$this->_request("Language");
	   $nickname = $model->where('main_id="'.$faID.'"')->getField('Main_Name'); 
	   $nicknames=$model->where('main_id="'.$ffaID.'"')->getField('Main_Name'); 
	   $this->assign('nickname',$nickname);
	   $this->assign('language',$language);
	   $this->assign('nicknames',$nicknames);
	   switch($act)
	   {
	   	  case "Add": 
	   	      $Col_Order=1;
			  $bvalue="保存";
			  $ColClick=9999;
		      $ffaID=$this->_request("ffaID");
			  $col_time=date("Y-m-d" ,time());
			  $faID=$this->_request("faID");
		      $this->assign('ffaids',$ffaID);
			  $this->assign('col_time',$col_time);
			  $this->assign('ColClick',$ColClick);
			  $this->assign('col_menuid',$faID);
			  $this->assign('bvalue',$bvalue);
		      $this->assign('Col_Order',$Col_Order);
			  break;
		  case "Edit":
		  	 $id=$this->_request("id");
			 $this->assign('id',$id);
			 $bvalue="修改";
		  	 if(!empty($id))
			 { 
			    $ffaID=$this->_request("ffaID");
				$colmenuid=$this->_request("faID");
		        $this->assign('ffaids',$ffaID);
				$this->assign('col_menuid',$colmenuid);
				$contion["Col_ID"]=$id;
				$col_newsinfo=$Theobj->where($contion)->find(); //查询
				$menu_data=$m->where("Col_ID='".$id."'")->select(); //查询
				$Col_Order=$menu_data[0]['Col_Order'];
				$Col_State=$menu_data[0]['Col_State'];
				$ColClick=$menu_data[0]['Col_Click'];
				$col_time=$menu_data[0]['Col_Time'];
				$Col_Hot=$menu_data[0]['Col_Hot'];
				$Col_Pic=$menu_data[0]["Col_Pic"];
			 	$Col_File=$menu_data[0]["Col_File"];
				$this->assign('Col_Pic',$Col_Pic);
				$this->assign('Col_File',$Col_File);
				$this->assign('Col_State',$Col_State);
				$this->assign('col_time',$col_time);
				$this->assign('Col_Hot',$Col_Hot);
				$this->assign('Col_Order',$Col_Order);
				$this->assign('ColClick',$ColClick);
				$this->assign('bvalue',$bvalue);
				$this->assign('col_newsinfo',$col_newsinfo);
			 }
			 break;
	   }
		 $this->display("jobimgColCreate");
	}
	function jobimgnewscolcreat_add()
	{
		 $uploads = $this->_upload();
		 $ttedu_pic = $uploads['image']; 
		 $ttedu_fujian = $uploads['fujian']; 
		 $sbutton=$this->_request("Submit");
		 $ffaID=$this->_request("ffaids");
		 $faID=$this->_request("col_menuid");
		 $ColTitle=$this->_request("ColTitle");
		 $ColEditor=$this->_request("ColEditor");
		 $ColHot=$this->_request("ColHot");
		 $ColState=$this->_request("ColState");
		 $language=$this->_request("Language");
		 $ColClick=$this->_request("ColClick");
		 $ColTime=$this->_request("ColTime");
		 $ColOrder=$this->_request("ColOrder");
		 $content1=$this->_request("content1");
		 
	      
		 $col_news=M("col_news");
		  switch($sbutton)
		  {
		    ///添加信息内容
		  	case "保存":
		 	  $data["Col_Title"]= $ColTitle;
		      $data["Col_Editor"]= $ColEditor;
		      $data["Col_Hot"]= $ColHot;
		      $data["Col_State"]= $ColState;
		      $data["Col_Click"]= $ColClick;
			  $data["Col_Time"]= $ColTime;
			  $data["Col_Order"]= $ColOrder;
		      $data["Col_Content"]=$content1;
			  $data["Col_Pic"]=$ttedu_pic;
			  $data["Col_File"]=$ttedu_fujian;
			  $data["Col_MenuID"]=$faID;
			  $data["Col_proid"]=$ffaID;
			  $data["Col_Language"]=$language;
		      $res=$col_news->add($data);
			  //写入日志
			   self::add_login($ColTitle,$content1,$type="添加");
		      echo "<script>alert('添加成功');window.location.href='/Sys/jobimgNewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."'</script>";
			  break;
			case "修改":
			  $id=$this->_request("id");
			  if(!empty($id))
			  {
				  $contion["Col_ID"]=$id;
				  $Data["Col_Title"]= $ColTitle;
				  $Data["Col_State"]= $ColState;
				  $Data["Col_Order"]= $ColOrder;
				  $Data["Col_Time"]= $ColTime;
				  $Data["Col_Content"]= $content1;
				    if (!empty($uploads['image']))
					{
						$ttedu_pic = $uploads['image'];
						$Data["Col_Pic"]=$ttedu_pic; 
					}
					if (!empty($uploads['fujian']))
					{
						$ttedu_fujian = $uploads['fujian'];
						$Data["Col_File"]=$ttedu_fujian; 
					}
				  $Data["Col_Click"]= $ColClick;
				  $Data["Col_Hot"]= $ColHot;
				  $Data["Col_Editor"]= $ColEditor;
				  $Mlist=$col_news->where($contion)->data($Data)->save();
				  if($Mlist!==false) 
					{ 
					      //写入日志
						   self::add_login($ColTitle,$content1,$type="修改");
						  echo "<script>alert('数据修改成功!');window.location.href='/Sys/jobimgNewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."'</script>";
					}
					else
					{ 
						$this->error('数据更新失败！'); 
					} 
			    }
			   break;
		  } 
	}
	
	
	function jobNewsList()
	{ 
	   $language=$this->_request('Language');
	   $ffaID=$_REQUEST["ffaID"];
	   $faID=$this->_request("faID");
	   $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   $this->getfilenames($ftype=3,$faID, $MID="Main_ID");
	   $TheObj =new Model('col_news');//实例化模型类
		if(!empty($ffaID))
		{
			$map['Col_MenuID']=$faID;
		}
	    import("ORG.Util.Page"); //导入分页类
	    $count = $TheObj->where($map)->count();    //计算总数
		$p = new Page ($count,20);
		$p->setConfig('header','条信息'); 
		$p->setConfig('prev',"<"); 
		$p->setConfig('next','>'); 
		$p->setConfig('first','<<'); 
		$p->setConfig('last','>>'); 
		$page = $p->show ();
		$this->assign( "page", $page );
		$info_detail=$TheObj->where($map)->limit($p->firstRow.','.$p->listRows)->order('Col_Order asc,Col_Time  desc,Col_ID desc')->select(); //查询
	   $this->assign('info_detail',$info_detail);//根据模板变量赋值
	   $this->assign('ffaID', $ffaID);
	   $this->assign('language', $language);
	   $this->assign('faID', $faID);
	   $this->display("jobNewsList");
	}
	
	function jobColCreate()
	{
	   $act=$_REQUEST["Save"];
	   $language=$this->_request("Language");
	   $Theobj=M("col_news");
	   $m=M("col_news");
	   $model=M("main_menu");
	   $faID=$this->_request("faID");
	   $ffaID=$this->_request("ffaID");
	   $nickname = $model->where('main_id="'.$faID.'"')->getField('Main_Name'); 
	   $nicknames=$model->where('main_id="'.$ffaID.'"')->getField('Main_Name'); 
	   $this->assign('nickname',$nickname);
	   $this->assign('language',$language);
	   $this->assign('nicknames',$nicknames);
	   switch($act)
	   {
	   	  case "Add": 
	   	      $Col_Order=1;
			  $bvalue="保存";
			  $ColClick=9999;
		      $ffaID=$this->_request("ffaID");
			  $col_time=date("Y-m-d" ,time());
			  $faID=$this->_request("faID");
		      $this->assign('ffaids',$ffaID);
			  $this->assign('col_time',$col_time);
			  $this->assign('ColClick',$ColClick);
			  $this->assign('col_menuid',$faID);
			  $this->assign('bvalue',$bvalue);
		      $this->assign('Col_Order',$Col_Order);
			  break;
		  case "Edit":
		  	 $id=$this->_request("id");
			 $this->assign('id',$id);
			 $bvalue="修改";
		  	 if(!empty($id))
			 { 
			    $ffaID=$this->_request("ffaID");
				$colmenuid=$this->_request("faID");
		        $this->assign('ffaids',$ffaID);
				$this->assign('col_menuid',$colmenuid);
				$contion["Col_ID"]=$id;
				$col_newsinfo=$Theobj->where($contion)->find(); //查询
				$menu_data=$m->where("Col_ID='".$id."'")->select(); //查询
				$Col_Order=$menu_data[0]['Col_Order'];
				$Col_State=$menu_data[0]['Col_State'];
				$ColClick=$menu_data[0]['Col_Click'];
				$col_time=$menu_data[0]['Col_Time'];
				$Col_Hot=$menu_data[0]['Col_Hot'];
				$Col_Pic=$menu_data[0]["Col_Pic"];
			 	$Col_File=$menu_data[0]["Col_File"];
				$this->assign('Col_Pic',$Col_Pic);
				$this->assign('Col_File',$Col_File);
				$this->assign('Col_State',$Col_State);
				$this->assign('col_time',$col_time);
				$this->assign('Col_Hot',$Col_Hot);
				$this->assign('Col_Order',$Col_Order);
				$this->assign('ColClick',$ColClick);
				$this->assign('bvalue',$bvalue);
				$this->assign('col_newsinfo',$col_newsinfo);
			 }
			 break;
	   }
		 $this->display("jobColCreate");
	}
	function jobcolcreat_add()
	{
		 $uploads = $this->_upload();
		 $ttedu_pic = $uploads['image']; 
		 $ttedu_fujian = $uploads['fujian']; 
		 $sbutton=$this->_request("Submit");
		 $ffaID=$this->_request("ffaids");
		 $language=$this->_request("Language");
		 $faID=$this->_request("col_menuid");
		 $ColTitle=$this->_request("ColTitle");
		 $ColEditor=$this->_request("ColEditor");
		 $ColSource=$this->_request("ColSource");
		 $Colxh=$this->_request("Colxh");
		 $ColHot=$this->_request("ColHot");
		 $ColState=$this->_request("ColState");
		 $ColClick=$this->_request("ColClick");
		 $ColTime=$this->_request("ColTime");
		 $ColOrder=$this->_request("ColOrder");
		 $content1=$this->_request("content1");
		 $Col_jszb=$this->_request("Col_jszb");
	     $Col_gnjj=$this->_request("Col_gnjj");
		 $col_news=M("col_news");
		  switch($sbutton)
		  {
		    ///添加信息内容
		  	case "保存":
		 	  $data["Col_Title"]= $ColTitle;
		      $data["Col_Editor"]= $ColEditor;
		      $data["Col_Hot"]= $ColHot;
		      $data["Col_State"]= $ColState;
		      $data["Col_Click"]= $ColClick;
			  $data["Col_Time"]= $ColTime;
			  $data["Col_Order"]= $ColOrder;
			  $data["Col_Source"]= $ColSource;
			  $data["Col_xh"]= $Colxh;
		      $data["Col_Content"]=$content1;
			  $data["Col_Pic"]=$ttedu_pic;
			  $data["Col_gnjj"]=$Col_gnjj;
			  $data["Col_File"]=$ttedu_fujian;
			  $data["Col_MenuID"]=$faID;
			  $data["Col_proid"]=$ffaID;
			  $data["Col_Language"]=$language;
			  $data["Col_jszb"]=$Col_jszb;
		      $res=$col_news->add($data);
			  //写入日志
			  self::add_login($ColTitle,$content1,$type="添加");
		      echo "<script>alert('信息添加成功');window.location.href='/Sys/jobNewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."'</script>";
			  break;
			case "修改":
			  $id=$this->_request("id");
			  if(!empty($id))
			  {
				  $contion["Col_ID"]=$id;
				  $Data["Col_Title"]= $ColTitle;
				  $Data["Col_State"]= $ColState;
				  $Data["Col_Order"]= $ColOrder;
				  $Data["Col_Source"]= $ColSource;
				  $Data["Col_xh"]= $Colxh;
				  $Data["Col_jszb"]=$Col_jszb;
				  $Data["Col_gnjj"]=$Col_gnjj;
				  $Data["Col_Time"]= $ColTime;
				  $Data["Col_Content"]= $content1;
				  if (!empty($uploads['image']))
					{
						$ttedu_pic = $uploads['image'];
						$Data["Col_Pic"]=$ttedu_pic; 
					}
					if (!empty($uploads['fujian']))
					{
						$ttedu_fujian = $uploads['fujian'];
						$Data["Col_File"]=$ttedu_fujian; 
					}
				  $Data["Col_Click"]= $ColClick;
				  $Data["Col_Hot"]= $ColHot;
				  $Data["Col_Editor"]= $ColEditor;
				  $Mlist=$col_news->where($contion)->data($Data)->save();
				  if($Mlist!==false) 
					{ 
					      //写入日志
						   self::add_login($ColTitle,$content1,$type="修改");
						  echo "<script>alert('数据信息修改成功!');window.location.href='/Sys/jobNewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."';</script>";
					}
					else
					{ 
						$this->error('数据更新失败！'); 
					} 
			    }
			   break;
		  } 
	}
	
	
	function job()
	{
	  
	   $language=$_REQUEST["Language"];
	   $ffaID=$_REQUEST["ffaID"];
	   $faID=$this->_request("faID");
	   
	   if(empty($language))
	   {
	   		$i_language=1;
	   }
	   else
	   {
	   		 $i_language=$_REQUEST["Language"];
	   }
	   
	   $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   if($ffaID<> $faID)
	   {
	   		$this->getfilenames($ftype=3,$faID, $MID="Main_ID");
			$locationstr=">";
	   }
	   else
	   {
	   		$locationstr="";
	   }
	   $TheObj =new Model('main_menu');//实例化模型类
		if(!empty($ffaID))
		{
			$map['Main_Father']=$faID;
		}
		$map['Main_Language']=$i_language;
	    import("ORG.Util.Page"); //导入分页类
	    $count = $TheObj->where($map)->count();    //计算总数
		$p = new Page ($count,20);
		$p->setConfig('header','条信息'); 
		$p->setConfig('prev',"<"); 
		$p->setConfig('next','>'); 
		$p->setConfig('first','<<'); 
		$p->setConfig('last','>>'); 
		$page = $p->show ();
		$this->assign( "page", $page );
		$info_detail=$TheObj->where($map)->limit($p->firstRow.','.$p->listRows)->order('main_order asc,Main_ID  desc')->select(); //查询
	   $this->assign('info_detail',$info_detail);//根据模板变量赋值
	   $this->assign('ffaID', $ffaID);
	   $this->assign('fid', $ffaID);
	   $this->assign('faID', $faID);
	   $this->assign('i_language',$i_language);
	   $this->assign('locationstr',$locationstr);
	   $this->display("job");
	}
	
	function jobcreat()
	{
	
	   $language=$this->_request('Language');
	   $act=$_REQUEST["Save"];
	   $faID=$this->_request("faID");
	   $ffaID=$this->_request("ffaID");
	  $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   switch($act)
	   {
	   	  case "Add":
	   	      $COrder=1;
			  $Main_State=1;
			  $bvalue="保存";
			  $Main_Type=1;
		      $this->assign('ffaids',$ffaID);
			  $this->assign('Main_State',$Main_State);
			  $this->assign('faID',$faID);
			  $this->assign('Main_Type',$Main_Type);
			  $this->assign('bvalue',$bvalue);
		      $this->assign('COrder',$COrder);
			  $this->assign('language',$language);
			  break;
		  case "Edit":
		  	 $id=$this->_request("id");
			 $this->assign('id',$id);
			 $this->assign('language',$language);
			 $bvalue="修改";
		  	 if(!empty($id))
			 { 
		       $this->assign('ffaids',$ffaID); 
			   $this->assign('faID',$faID); 
				$Theobj=M("main_menu");
				$m=M("main_menu");
				$contion["Main_ID"]=$id;
				$menu_info=$Theobj->where($contion)->find(); //查询
				$menu_data=$m->where("Main_ID='".$id."'")->select(); //查询
				$COrder=$menu_data[0]['Main_Order'];
				$Main_Pic=$menu_data[0]['Main_Pic'];
				$Main_State=$menu_data[0]['Main_State'];
				$Main_Type=$menu_data[0]['Main_Type'];
				$this->assign('Main_Type',$Main_Type);
				$this->assign('Main_Pic',$Main_Pic);
				$this->assign('Main_State',$Main_State);
				$this->assign('COrder',$COrder);
				$this->assign('bvalue',$bvalue);
				$this->assign('menuinfo',$menu_info);
			 }
			 break;
	   }
		$this->display("jobcreat");
	}
	
	function jobadd()
	{
	     $language=$this->_request("Language");
		 $sbutton=$this->_request("Submit");
		 $ffaID=$this->_request("ffaids");
		 $faID=$this->_request("faID");
		 $ColName=$this->_request("ColName");
		 $COrder=$this->_request("COrder");
		 $CType=$this->_request("CType");
		 $content1=$this->_request("content1");
		 $State=$this->_request("State");
		 if (!empty($_FILES)) 
		  { 
		  	$uploads = $this->_upload();
			if (!empty($uploads['image'])){
				$main_pic = $uploads['image']; 
			}
			
		  }
		 $main_menu=M("main_menu");
		  switch($sbutton)
		  {
		    ///添加信息内容
		  	case "保存":
		 	  $data["Main_Name"]= $ColName;
		      $data["Main_State"]= $State;
		      $data["Main_Order"]= $COrder;
			  $data["Main_Pic"]= $main_pic;
		      $data["Main_Type"]= $CType;
		      $data["Main_Content"]= $content1;
		      $data["Main_Father"]=$faID;
			  $data["Main_Language"]=$language;
		      $res=$main_menu->add($data);
			  ///写入操作日志
			  self::add_login($ColName,$content1,$type="添加");
		      echo "<script>alert('信息添加成功!');window.location.href='/Sys/job?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."';</script>";
			  break;
			case "修改":
			  $id=$this->_request("id");
			  if(!empty($id))
			  {
				  $contion["Main_ID"]=$id;
				  $Data["Main_Name"]= $ColName;
				  $Data["Main_State"]= $State;
				  $Data["Main_Order"]= $COrder;
				  $Data["Main_Type"]= $CType;
				   $Data["Main_Pic"]= $main_pic;
				  $Data["Main_Content"]= $content1;
	              //写入日志
				  self::add_login($ColName,$content1,$type="修改");
				  $Mlist=$main_menu->where($contion)->data($Data)->save();
				  if($Mlist!==false) 
					{ 
						 echo "<script>alert('数据修改成功!');window.location.href='/Sys/job?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."';</script>";
					}
					else
					{ 
						$this->error('数据更新失败！'); 
					} 
			    }
			   break;
		  } 
	}
	function job_NewsList()
	{ 
	   $language=$this->_request('Language');
	   $ffaID=$_REQUEST["ffaID"];
	   $faID=$this->_request("faID");
	   $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   $this->getfilenames($ftype=3,$faID, $MID="Main_ID");
	   $TheObj =new Model('col_news');//实例化模型类
		if(!empty($ffaID))
		{
			$map['Col_MenuID']=$faID;
		}
	    import("ORG.Util.Page"); //导入分页类
	    $count = $TheObj->where($map)->count();    //计算总数
		$p = new Page ($count,20);
		$p->setConfig('header','条信息'); 
		$p->setConfig('prev',"<"); 
		$p->setConfig('next','>'); 
		$p->setConfig('first','<<'); 
		$p->setConfig('last','>>'); 
		$page = $p->show ();
		$this->assign( "page", $page );
		$info_detail=$TheObj->where($map)->limit($p->firstRow.','.$p->listRows)->order('Col_Order asc,Col_Time  desc,Col_ID desc')->select(); //查询
	   $this->assign('info_detail',$info_detail);//根据模板变量赋值
	   $this->assign('ffaID', $ffaID);
	   $this->assign('language', $language);
	   $this->assign('faID', $faID);
	   $this->display("job_NewsList");
	}
	
	function job_ColCreate()
	{
	   $act=$_REQUEST["Save"];
	   $language=$this->_request("Language");
	   $Theobj=M("col_news");
	   $m=M("col_news");
	   $model=M("main_menu");
	   $faID=$this->_request("faID");
	   $ffaID=$this->_request("ffaID");
	   $nickname = $model->where('main_id="'.$faID.'"')->getField('Main_Name'); 
	   $nicknames=$model->where('main_id="'.$ffaID.'"')->getField('Main_Name'); 
	   $this->assign('nickname',$nickname);
	   $this->assign('language',$language);
	   $this->assign('nicknames',$nicknames);
	   switch($act)
	   {
	   	  case "Add": 
	   	      $Col_Order=1;
			  $bvalue="保存";
			  $ColClick=9999;
		      $ffaID=$this->_request("ffaID");
			  $col_time=date("Y-m-d" ,time());
			  $faID=$this->_request("faID");
		      $this->assign('ffaids',$ffaID);
			  $this->assign('col_time',$col_time);
			  $this->assign('ColClick',$ColClick);
			  $this->assign('col_menuid',$faID);
			  $this->assign('bvalue',$bvalue);
		      $this->assign('Col_Order',$Col_Order);
			  break;
		  case "Edit":
		  	 $id=$this->_request("id");
			 $this->assign('id',$id);
			 $bvalue="修改";
		  	 if(!empty($id))
			 { 
			    $ffaID=$this->_request("ffaID");
				$colmenuid=$this->_request("faID");
		        $this->assign('ffaids',$ffaID);
				$this->assign('col_menuid',$colmenuid);
				$contion["Col_ID"]=$id;
				$col_newsinfo=$Theobj->where($contion)->find(); //查询
				$menu_data=$m->where("Col_ID='".$id."'")->select(); //查询
				$Col_Order=$menu_data[0]['Col_Order'];
				$Col_State=$menu_data[0]['Col_State'];
				$ColClick=$menu_data[0]['Col_Click'];
				$col_time=$menu_data[0]['Col_Time'];
				$Col_Hot=$menu_data[0]['Col_Hot'];
				$Col_Pic=$menu_data[0]["Col_Pic"];
			 	$Col_File=$menu_data[0]["Col_File"];
				$this->assign('Col_Pic',$Col_Pic);
				$this->assign('Col_File',$Col_File);
				$this->assign('Col_State',$Col_State);
				$this->assign('col_time',$col_time);
				$this->assign('Col_Hot',$Col_Hot);
				$this->assign('Col_Order',$Col_Order);
				$this->assign('ColClick',$ColClick);
				$this->assign('bvalue',$bvalue);
				$this->assign('col_newsinfo',$col_newsinfo);
			 }
			 break;
	   }
		 $this->display("job_ColCreate");
	}
	
	
	function job_colcreat_add()
	{
	     if (!empty($_FILES)) 
		  { 
		  	$uploads = $this->_upload();
			if (!empty($uploads['image'])){
				$ttedu_pic = $uploads['image']; 
			}
			if (!empty($uploads['fujian'])){
				$ttedu_fujian = $uploads['fujian']; 
			}
		  }
		 $sbutton=$this->_request("Submit");
		 $ffaID=$this->_request("ffaids");
		 $language=$this->_request("Language");
		 $faID=$this->_request("col_menuid");
		 $ColTitle=$this->_request("ColTitle");
		 $ColEditor=$this->_request("ColEditor");
		 $ColSource=$this->_request("ColSource");
		 $Colxh=$this->_request("Colxh");
		 $ColHot=$this->_request("ColHot");
		 $ColState=$this->_request("ColState");
		 $ColClick=$this->_request("ColClick");
		 $ColTime=$this->_request("ColTime");
		 $ColOrder=$this->_request("ColOrder");
		 $content1=$this->_request("content1");
		 $Col_jszb=$this->_request("Col_jszb");
	     $Col_gnjj=$this->_request("Col_gnjj");
		 $col_news=M("col_news");
		  switch($sbutton)
		  {
		    ///添加信息内容
		  	case "保存":
		 	  $data["Col_Title"]= $ColTitle;
		      $data["Col_Editor"]= $ColEditor;
		      $data["Col_Hot"]= $ColHot;
		      $data["Col_State"]= $ColState;
		      $data["Col_Click"]= $ColClick;
			  $data["Col_Time"]= $ColTime;
			  $data["Col_Order"]= $ColOrder;
			  $data["Col_Source"]= $ColSource;
			  $data["Col_xh"]= $Colxh;
		      $data["Col_Content"]=$content1;
			  $data["Col_Pic"]=$ttedu_pic;
			  $data["Col_gnjj"]=$Col_gnjj;
			  $data["Col_File"]=$ttedu_fujian;
			  $data["Col_MenuID"]=$faID;
			  $data["Col_proid"]=$ffaID;
			  $data["Col_Language"]=$language;
			  $data["Col_jszb"]=$Col_jszb;
		      $res=$col_news->add($data);
			  //写入日志  
			  self::add_login($ColTitle,$content1,$type="添加");
		      echo "<script>alert('信息添加成功');window.location.href='/Sys/job_NewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."'</script>";
			  break;
			case "修改":
			  $id=$this->_request("id");
			  if(!empty($id))
			  {
				  $contion["Col_ID"]=$id;
				  $Data["Col_Title"]= $ColTitle;
				  $Data["Col_State"]= $ColState;
				  $Data["Col_Order"]= $ColOrder;
				  $Data["Col_Source"]= $ColSource;
				  $Data["Col_xh"]= $Colxh;
				  $Data["Col_jszb"]=$Col_jszb;
				  $Data["Col_gnjj"]=$Col_gnjj;
				  $Data["Col_Time"]= $ColTime;
				  $Data["Col_Content"]= $content1;
				  $Data["Col_Pic"]=$ttedu_pic;
			      $Data["Col_File"]=$ttedu_fujian;
				  $Data["Col_Click"]= $ColClick;
				  $Data["Col_Hot"]= $ColHot;
				  $Data["Col_Editor"]= $ColEditor;
				  $Mlist=$col_news->where($contion)->data($Data)->save();
				  if($Mlist!==false) 
					{ 
					      //写入日志
						  self::add_login($ColTitle,$content1,$type="修改");
						  echo "<script>alert('数据信息修改成功!');window.location.href='/Sys/job_NewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."';</script>";
					}
					else
					{ 
						$this->error('数据更新失败！'); 
					} 
			    }
			   break;
		  } 
	}
	
	function job_imgNewsList()
	{
	
	    $language=$this->_request("Language");
	   $ffaID=$_REQUEST["ffaID"];
	   $faID=$this->_request("faID");
	   $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   $this->getfilenames($ftype=3,$faID, $MID="Main_ID");
	   $TheObj =new Model('col_news');//实例化模型类
		if(!empty($ffaID))
		{
			$map['Col_MenuID']=$faID;
		}
	    import("ORG.Util.Page"); //导入分页类
	    $count = $TheObj->where($map)->count();    //计算总数
		$p = new Page ($count,20);
		$p->setConfig('header','条信息'); 
		$p->setConfig('prev',"<"); 
		$p->setConfig('next','>'); 
		$p->setConfig('first','<<'); 
		$p->setConfig('last','>>'); 
		$page = $p->show ();
		$this->assign( "page", $page );
		$info_detail=$TheObj->where($map)->limit($p->firstRow.','.$p->listRows)->order('Col_Order asc,Col_Time  desc,Col_ID desc')->select(); //查询
	   $this->assign('info_detail',$info_detail);//根据模板变量赋值
	   $this->assign('ffaID', $ffaID);
	   $this->assign('language',$language);
	   $this->assign('faID', $faID);
	   $this->display("job_imgNewsList");
	}
	
	function job_imgColCreate()
	{
	   $act=$_REQUEST["Save"];
	   
	   $Theobj=M("col_news");
	   $m=M("col_news");
	   $model=M("main_menu");
	   $faID=$this->_request("faID");
	   $ffaID=$this->_request("ffaID");
	   $language=$this->_request("Language");
	   $nickname = $model->where('main_id="'.$faID.'"')->getField('Main_Name'); 
	   $nicknames=$model->where('main_id="'.$ffaID.'"')->getField('Main_Name'); 
	   $this->assign('nickname',$nickname);
	   $this->assign('language',$language);
	   $this->assign('nicknames',$nicknames);
	   switch($act)
	   {
	   	  case "Add": 
	   	      $Col_Order=1;
			  $bvalue="保存";
			  $ColClick=9999;
		      $ffaID=$this->_request("ffaID");
			  $col_time=date("Y-m-d" ,time());
			  $faID=$this->_request("faID");
		      $this->assign('ffaids',$ffaID);
			  $this->assign('col_time',$col_time);
			  $this->assign('ColClick',$ColClick);
			  $this->assign('col_menuid',$faID);
			  $this->assign('bvalue',$bvalue);
		      $this->assign('Col_Order',$Col_Order);
			  break;
		  case "Edit":
		  	 $id=$this->_request("id");
			 $this->assign('id',$id);
			 $bvalue="修改";
		  	 if(!empty($id))
			 { 
			    $ffaID=$this->_request("ffaID");
				$colmenuid=$this->_request("faID");
		        $this->assign('ffaids',$ffaID);
				$this->assign('col_menuid',$colmenuid);
				$contion["Col_ID"]=$id;
				$col_newsinfo=$Theobj->where($contion)->find(); //查询
				$menu_data=$m->where("Col_ID='".$id."'")->select(); //查询
				$Col_Order=$menu_data[0]['Col_Order'];
				$Col_State=$menu_data[0]['Col_State'];
				$ColClick=$menu_data[0]['Col_Click'];
				$col_time=$menu_data[0]['Col_Time'];
				$Col_Hot=$menu_data[0]['Col_Hot'];
				$Col_Pic=$menu_data[0]["Col_Pic"];
			 	$Col_File=$menu_data[0]["Col_File"];
				$this->assign('Col_Pic',$Col_Pic);
				$this->assign('Col_File',$Col_File);
				$this->assign('Col_State',$Col_State);
				$this->assign('col_time',$col_time);
				$this->assign('Col_Hot',$Col_Hot);
				$this->assign('Col_Order',$Col_Order);
				$this->assign('ColClick',$ColClick);
				$this->assign('bvalue',$bvalue);
				$this->assign('col_newsinfo',$col_newsinfo);
			 }
			 break;
	   }
		 $this->display("job_imgColCreate");
	}
	
	
	function job_imgnewscolcreat_add()
	{
	     if (!empty($_FILES)) 
		  { 
		  	$uploads = $this->_upload();
			if (!empty($uploads['image'])){
				$ttedu_pic = $uploads['image']; 
			}
			if (!empty($uploads['fujian'])){
				$ttedu_fujian = $uploads['fujian']; 
			}
		  }
		 $sbutton=$this->_request("Submit");
		 $ffaID=$this->_request("ffaids");
		 $faID=$this->_request("col_menuid");
		 $ColTitle=$this->_request("ColTitle");
		 $ColEditor=$this->_request("ColEditor");
		 $ColHot=$this->_request("ColHot");
		 $ColState=$this->_request("ColState");
		 $language=$this->_request("Language");
		 $ColClick=$this->_request("ColClick");
		 $ColTime=$this->_request("ColTime");
		 $ColOrder=$this->_request("ColOrder");
		 $content1=$this->_request("content1");
		 $col_news=M("col_news");
		  switch($sbutton)
		  {
		    ///添加信息内容
		  	case "保存":
		 	  $data["Col_Title"]= $ColTitle;
		      $data["Col_Editor"]= $ColEditor;
		      $data["Col_Hot"]= $ColHot;
		      $data["Col_State"]= $ColState;
		      $data["Col_Click"]= $ColClick;
			  $data["Col_Time"]= $ColTime;
			  $data["Col_Order"]= $ColOrder;
		      $data["Col_Content"]=$content1;
			  $data["Col_Pic"]=$ttedu_pic;
			  $data["Col_File"]=$ttedu_fujian;
			  $data["Col_MenuID"]=$faID;
			  $data["Col_proid"]=$ffaID;
			  $data["Col_Language"]=$language;
		      $res=$col_news->add($data);
			  //写入日志
			  self::add_login($ColTitle,$content1,$type="添加");
		      echo "<script>alert('添加成功');window.location.href='/Sys/job_imgNewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."'</script>";
			  break;
			case "修改":
			  $id=$this->_request("id");
			  if(!empty($id))
			  {
				  $contion["Col_ID"]=$id;
				  $Data["Col_Title"]= $ColTitle;
				  $Data["Col_State"]= $ColState;
				  $Data["Col_Order"]= $ColOrder;
				  $Data["Col_Time"]= $ColTime;
				  $Data["Col_Content"]= $content1;
				  $Data["Col_Pic"]=$ttedu_pic;
			      $Data["Col_File"]=$ttedu_fujian;
				  $Data["Col_Click"]= $ColClick;
				  $Data["Col_Hot"]= $ColHot;
				  $Data["Col_Editor"]= $ColEditor;
				  $Mlist=$col_news->where($contion)->data($Data)->save();
				  if($Mlist!==false) 
					{ 
					      //写入日志
						  self::add_login($ColTitle,$content1,$type="修改");
						  echo "<script>alert('数据修改成功!');window.location.href='/Sys/job_imgNewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."'</script>";
					}
					else
					{ 
						$this->error('数据更新失败！'); 
					} 
			    }
			   break;
		  } 
	}
	
	
	//新闻管理数据绑定
	function news_list()
	{
	   $language=$_REQUEST["Language"];
	   $ffaID=$_REQUEST["ffaID"];
	   $faID=$this->_request("faID");
	   if(empty($language))
	   {
	   		$i_language=1;
	   }
	   else
	   {
	   		 $i_language=$_REQUEST["Language"];
	   }
	   
	   $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   if($ffaID<> $faID)
	   {
	   		$this->getfilenames($ftype=3,$faID, $MID="Main_ID");
			$locationstr=">";
	   }
	   else
	   {
	   		$locationstr="";
	   }
	   $TheObj =new Model('main_menu');//实例化模型类
		if(!empty($ffaID))
		{
			$map['Main_Father']=$faID;
		}
		$map['Main_Language']=$i_language;
	    import("ORG.Util.Page"); //导入分页类
	    $count = $TheObj->where($map)->count();    //计算总数
		$p = new Page ($count,20);
		$p->setConfig('header','条信息'); 
		$p->setConfig('prev',"<"); 
		$p->setConfig('next','>'); 
		$p->setConfig('first','<<'); 
		$p->setConfig('last','>>'); 
		$page = $p->show ();
		$this->assign( "page", $page );
		$info_detail=$TheObj->where($map)->limit($p->firstRow.','.$p->listRows)->order('main_order asc,Main_ID  desc')->select(); //查询
	   $this->assign('info_detail',$info_detail);//根据模板变量赋值
	   $this->assign('ffaID', $ffaID);
	   $this->assign('fid', $ffaID);
	   $this->assign('faID', $faID);
	   $this->assign('i_language',$i_language);
	   $this->assign('locationstr',$locationstr);
	   $this->display("news_list");
	}
	
	function help()
	{
	   $language=$_REQUEST["Language"];
	   $ffaID=$_REQUEST["ffaID"];
	   $faID=$this->_request("faID");
	   if(empty($language))
	   {
	   		$i_language=1;
	   }
	   else
	   {
	   		 $i_language=$_REQUEST["Language"];
	   }
	   
	   $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   if($ffaID<> $faID)
	   {
	   		$this->getfilenames($ftype=3,$faID, $MID="Main_ID");
			$locationstr=">";
	   }
	   else
	   {
	   		$locationstr="";
	   }
	   $TheObj =new Model('main_menu');//实例化模型类
		if(!empty($ffaID))
		{
			$map['Main_Father']=$faID;
		}
		$map['Main_Language']=$i_language;
	    import("ORG.Util.Page"); //导入分页类
	    $count = $TheObj->where($map)->count();    //计算总数
		$p = new Page ($count,20);
		$p->setConfig('header','条信息'); 
		$p->setConfig('prev',"<"); 
		$p->setConfig('next','>'); 
		$p->setConfig('first','<<'); 
		$p->setConfig('last','>>'); 
		$page = $p->show ();
		$this->assign( "page", $page );
		$info_detail=$TheObj->where($map)->limit($p->firstRow.','.$p->listRows)->order('main_order asc,Main_ID  desc')->select(); //查询
	   $this->assign('info_detail',$info_detail);//根据模板变量赋值
	   $this->assign('ffaID', $ffaID);
	   $this->assign('fid', $ffaID);
	   $this->assign('faID', $faID);
	   $this->assign('i_language',$i_language);
	   $this->assign('locationstr',$locationstr);
	   $this->display("help");
	}
	
	
	function help_add()
	{
	     $language=$this->_request("Language");
		 $sbutton=$this->_request("Submit");
		 $ffaID=$this->_request("ffaids");
		 $faID=$this->_request("faID");
		 $ColName=$this->_request("ColName");
		 $COrder=$this->_request("COrder");
		 $CType=$this->_request("CType");
		 $content1=$this->_request("content1");
		 $State=$this->_request("State");
		 if (!empty($_FILES)) 
		  { 
		  	$uploads = $this->_upload();
			if (!empty($uploads['image'])){
				$main_pic = $uploads['image']; 
			}
			
		  }
		 $main_menu=M("main_menu");
		  switch($sbutton)
		  {
		    ///添加信息内容
		  	case "保存":
		 	  $data["Main_Name"]= $ColName;
		      $data["Main_State"]= $State;
		      $data["Main_Order"]= $COrder;
			  $data["Main_Pic"]= $main_pic;
		      $data["Main_Type"]= $CType;
		      $data["Main_Content"]= $content1;
		      $data["Main_Father"]=$faID;
			  $data["Main_Language"]=$language;
		      $res=$main_menu->add($data);
			  ///写入操作日志
			  self::add_login($ColName,$content1,$type="添加");
		      echo "<script>alert('信息添加成功!');window.location.href='/Sys/help?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."';</script>";
			  break;
			case "修改":
			  $id=$this->_request("id");
			  if(!empty($id))
			  {
				  $contion["Main_ID"]=$id;
				  $Data["Main_Name"]= $ColName;
				  $Data["Main_State"]= $State;
				  $Data["Main_Order"]= $COrder;
				  $Data["Main_Type"]= $CType;
				   $Data["Main_Pic"]= $main_pic;
				  $Data["Main_Content"]= $content1;
	              //写入日志
				   self::add_login($ColName,$content1,$type="修改");
				  $Mlist=$main_menu->where($contion)->data($Data)->save();
				  if($Mlist!==false) 
					{ 
						 echo "<script>alert('数据修改成功!');window.location.href='/Sys/help?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."';</script>";
					}
					else
					{ 
						$this->error('数据更新失败！'); 
					} 
			    }
			   break;
		  } 
	}
	
	function helpNewsList()
	{
	    
	   $language=$this->_request('Language');
	   $ffaID=$_REQUEST["ffaID"];
	   $faID=$this->_request("faID");
	   $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   $this->getfilenames($ftype=3,$faID, $MID="Main_ID");
	   $TheObj =new Model('col_news');//实例化模型类
		if(!empty($ffaID))
		{
			$map['Col_MenuID']=$faID;
		}
	    import("ORG.Util.Page"); //导入分页类
	    $count = $TheObj->where($map)->count();    //计算总数
		$p = new Page ($count,20);
		$p->setConfig('header','条信息'); 
		$p->setConfig('prev',"<"); 
		$p->setConfig('next','>'); 
		$p->setConfig('first','<<'); 
		$p->setConfig('last','>>'); 
		$page = $p->show ();
		$this->assign( "page", $page );
		$info_detail=$TheObj->where($map)->limit($p->firstRow.','.$p->listRows)->order('Col_Order asc,Col_Time  desc,Col_ID desc')->select(); //查询
	   $this->assign('info_detail',$info_detail);//根据模板变量赋值
	   $this->assign('ffaID', $ffaID);
	   $this->assign('language', $language);
	   $this->assign('faID', $faID);
	   $this->display("helpNewsList");
	}
	
	
	
	function helpColCreate()
	{
	   $act=$_REQUEST["Save"];
	   $language=$this->_request("Language");
	   $Theobj=M("col_news");
	   $m=M("col_news");
	   $model=M("main_menu");
	   $faID=$this->_request("faID");
	   $ffaID=$this->_request("ffaID");
	   $nickname = $model->where('main_id="'.$faID.'"')->getField('Main_Name'); 
	   $nicknames=$model->where('main_id="'.$ffaID.'"')->getField('Main_Name'); 
	   $this->assign('nickname',$nickname);
	   $this->assign('language',$language);
	   $this->assign('nicknames',$nicknames);
	   switch($act)
	   {
	   	  case "Add": 
	   	      $Col_Order=1;
			  $bvalue="保存";
			  $ColClick=9999;
		      $ffaID=$this->_request("ffaID");
			  $col_time=date("Y-m-d" ,time());
			  $faID=$this->_request("faID");
		      $this->assign('ffaids',$ffaID);
			  $this->assign('col_time',$col_time);
			  $this->assign('ColClick',$ColClick);
			  $this->assign('col_menuid',$faID);
			  $this->assign('bvalue',$bvalue);
		      $this->assign('Col_Order',$Col_Order);
			  break;
		  case "Edit":
		  	 $id=$this->_request("id");
			 $this->assign('id',$id);
			 $bvalue="修改";
		  	 if(!empty($id))
			 { 
			    $ffaID=$this->_request("ffaID");
				$colmenuid=$this->_request("faID");
		        $this->assign('ffaids',$ffaID);
				$this->assign('col_menuid',$colmenuid);
				$contion["Col_ID"]=$id;
				$col_newsinfo=$Theobj->where($contion)->find(); //查询
				$menu_data=$m->where("Col_ID='".$id."'")->select(); //查询
				$Col_Order=$menu_data[0]['Col_Order'];
				$Col_State=$menu_data[0]['Col_State'];
				$ColClick=$menu_data[0]['Col_Click'];
				$col_time=$menu_data[0]['Col_Time'];
				$Col_Hot=$menu_data[0]['Col_Hot'];
				$Col_Pic=$menu_data[0]["Col_Pic"];
			 	$Col_File=$menu_data[0]["Col_File"];
				$this->assign('Col_Pic',$Col_Pic);
				$this->assign('Col_File',$Col_File);
				$this->assign('Col_State',$Col_State);
				$this->assign('col_time',$col_time);
				$this->assign('Col_Hot',$Col_Hot);
				$this->assign('Col_Order',$Col_Order);
				$this->assign('ColClick',$ColClick);
				$this->assign('bvalue',$bvalue);
				$this->assign('col_newsinfo',$col_newsinfo);
			 }
			 break;
	   }
		 $this->display("helpColCreate");
	}
	
	function helpcolcreat_add()
	{
	     if (!empty($_FILES)) 
		  { 
		  	$uploads = $this->_upload();
			if (!empty($uploads['image'])){
				$ttedu_pic = $uploads['image']; 
			}
			if (!empty($uploads['fujian'])){
				$ttedu_fujian = $uploads['fujian']; 
			}
		  }
		 $sbutton=$this->_request("Submit");
		 $ffaID=$this->_request("ffaids");
		 $language=$this->_request("Language");
		 $faID=$this->_request("col_menuid");
		 $ColTitle=$this->_request("ColTitle");
		 $ColEditor=$this->_request("ColEditor");
		 $ColHot=$this->_request("ColHot");
		 $ColState=$this->_request("ColState");
		 $ColClick=$this->_request("ColClick");
		 $ColTime=$this->_request("ColTime");
		 $ColOrder=$this->_request("ColOrder");
		 $content1=$this->_request("content1");
		 $col_news=M("col_news");
		  switch($sbutton)
		  {
		    ///添加信息内容
		  	case "保存":
		 	  $data["Col_Title"]= $ColTitle;
		      $data["Col_Editor"]= $ColEditor;
		      $data["Col_Hot"]= $ColHot;
		      $data["Col_State"]= $ColState;
		      $data["Col_Click"]= $ColClick;
			  $data["Col_Time"]= $ColTime;
			  $data["Col_Order"]= $ColOrder;
		      $data["Col_Content"]=$content1;
			  $data["Col_Pic"]=$ttedu_pic;
			  $data["Col_File"]=$ttedu_fujian;
			  $data["Col_MenuID"]=$faID;
			  $data["Col_proid"]=$ffaID;
			  $data["Col_Language"]=$language;
		      $res=$col_news->add($data);
			  //写入日志
			   self::add_login($ColTitle,$content1,$type="添加");
		      echo "<script>alert('数据添加成功!');window.location.href='/Sys/helpNewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."'</script>";
			  break;
			case "修改":
			  $id=$this->_request("id");
			  if(!empty($id))
			  {
				  $contion["Col_ID"]=$id;
				  $Data["Col_Title"]= $ColTitle;
				  $Data["Col_State"]= $ColState;
				  $Data["Col_Order"]= $ColOrder;
				  $Data["Col_Time"]= $ColTime;
				  $Data["Col_Content"]= $content1;
				  $Data["Col_Pic"]=$ttedu_pic;
			      $Data["Col_File"]=$ttedu_fujian;
				  $Data["Col_Click"]= $ColClick;
				  $Data["Col_Hot"]= $ColHot;
				  $Data["Col_Editor"]= $ColEditor;
				  $Mlist=$col_news->where($contion)->data($Data)->save();
				  if($Mlist!==false) 
					{ 
					      //写入日志
						   self::add_login($ColTitle,$content1,$type="修改");
						  echo "<script>alert('数据修改成功!');window.location.href='/Sys/helpNewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."';</script>";
					}
					else
					{ 
						$this->error('数据更新失败！'); 
					} 
			    }
			   break;
		  } 
	}
	
	
	function helpimgNewsList()
	{
	   $language=$this->_request("Language");
	   $ffaID=$_REQUEST["ffaID"];
	   $faID=$this->_request("faID");
	   $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   $this->getfilenames($ftype=3,$faID, $MID="Main_ID");
	   $TheObj =new Model('col_news');//实例化模型类
		if(!empty($ffaID))
		{
			$map['Col_MenuID']=$faID;
		}
	    import("ORG.Util.Page"); //导入分页类
	    $count = $TheObj->where($map)->count();    //计算总数
		$p = new Page ($count,20);
		$p->setConfig('header','条信息'); 
		$p->setConfig('prev',"<"); 
		$p->setConfig('next','>'); 
		$p->setConfig('first','<<'); 
		$p->setConfig('last','>>'); 
		$page = $p->show ();
		$this->assign( "page", $page );
		$info_detail=$TheObj->where($map)->limit($p->firstRow.','.$p->listRows)->order('Col_Order asc,Col_Time  desc,Col_ID desc')->select(); //查询
	   $this->assign('info_detail',$info_detail);//根据模板变量赋值
	   $this->assign('ffaID', $ffaID);
	   $this->assign('language',$language);
	   $this->assign('faID', $faID);
	   $this->display("helpimgNewsList");
	}
	
	
	function helpimgColCreate()
	{
	   $act=$_REQUEST["Save"];
	   
	   $Theobj=M("col_news");
	   $m=M("col_news");
	   $model=M("main_menu");
	   $faID=$this->_request("faID");
	   $ffaID=$this->_request("ffaID");
	   $language=$this->_request("Language");
	   $nickname = $model->where('main_id="'.$faID.'"')->getField('Main_Name'); 
	   $nicknames=$model->where('main_id="'.$ffaID.'"')->getField('Main_Name'); 
	   $this->assign('nickname',$nickname);
	   $this->assign('language',$language);
	   $this->assign('nicknames',$nicknames);
	   switch($act)
	   {
	   	  case "Add": 
	   	      $Col_Order=1;
			  $bvalue="保存";
			  $ColClick=9999;
		      $ffaID=$this->_request("ffaID");
			  $col_time=date("Y-m-d" ,time());
			  $faID=$this->_request("faID");
		      $this->assign('ffaids',$ffaID);
			  $this->assign('col_time',$col_time);
			  $this->assign('ColClick',$ColClick);
			  $this->assign('col_menuid',$faID);
			  $this->assign('bvalue',$bvalue);
		      $this->assign('Col_Order',$Col_Order);
			  break;
		  case "Edit":
		  	 $id=$this->_request("id");
			 $this->assign('id',$id);
			 $bvalue="修改";
		  	 if(!empty($id))
			 { 
			    $ffaID=$this->_request("ffaID");
				$colmenuid=$this->_request("faID");
		        $this->assign('ffaids',$ffaID);
				$this->assign('col_menuid',$colmenuid);
				$contion["Col_ID"]=$id;
				$col_newsinfo=$Theobj->where($contion)->find(); //查询
				$menu_data=$m->where("Col_ID='".$id."'")->select(); //查询
				$Col_Order=$menu_data[0]['Col_Order'];
				$Col_State=$menu_data[0]['Col_State'];
				$ColClick=$menu_data[0]['Col_Click'];
				$col_time=$menu_data[0]['Col_Time'];
				$Col_Hot=$menu_data[0]['Col_Hot'];
				$Col_Pic=$menu_data[0]["Col_Pic"];
			 	$Col_File=$menu_data[0]["Col_File"];
				$this->assign('Col_Pic',$Col_Pic);
				$this->assign('Col_File',$Col_File);
				$this->assign('Col_State',$Col_State);
				$this->assign('col_time',$col_time);
				$this->assign('Col_Hot',$Col_Hot);
				$this->assign('Col_Order',$Col_Order);
				$this->assign('ColClick',$ColClick);
				$this->assign('bvalue',$bvalue);
				$this->assign('col_newsinfo',$col_newsinfo);
			 }
			 break;
	   }
		 $this->display("helpimgColCreate");
	}


function helpimgnewscolcreat_add()
	{
	     if (!empty($_FILES)) 
		  { 
		  	$uploads = $this->_upload();
			if (!empty($uploads['image'])){
				$ttedu_pic = $uploads['image']; 
			}
			if (!empty($uploads['fujian'])){
				$ttedu_fujian = $uploads['fujian']; 
			}
		  }
		 $sbutton=$this->_request("Submit");
		 $ffaID=$this->_request("ffaids");
		 $faID=$this->_request("col_menuid");
		 $ColTitle=$this->_request("ColTitle");
		 $ColEditor=$this->_request("ColEditor");
		 $ColHot=$this->_request("ColHot");
		 $ColState=$this->_request("ColState");
		 $language=$this->_request("Language");
		 $ColClick=$this->_request("ColClick");
		 $ColTime=$this->_request("ColTime");
		 $ColOrder=$this->_request("ColOrder");
		 $content1=$this->_request("content1");
		 $col_news=M("col_news");
		  switch($sbutton)
		  {
		    ///添加信息内容
		  	case "保存":
		 	  $data["Col_Title"]= $ColTitle;
		      $data["Col_Editor"]= $ColEditor;
		      $data["Col_Hot"]= $ColHot;
		      $data["Col_State"]= $ColState;
		      $data["Col_Click"]= $ColClick;
			  $data["Col_Time"]= $ColTime;
			  $data["Col_Order"]= $ColOrder;
		      $data["Col_Content"]=$content1;
			  $data["Col_Pic"]=$ttedu_pic;
			  $data["Col_File"]=$ttedu_fujian;
			  $data["Col_MenuID"]=$faID;
			  $data["Col_proid"]=$ffaID;
			  $data["Col_Language"]=$language;
		      $res=$col_news->add($data);
			  //写入日志
			  self::add_login($ColTitle,$content1,$type="添加");
		      echo "<script>alert('添加成功');window.location.href='/Sys/helpimgNewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."'</script>";
			  break;
			case "修改":
			  $id=$this->_request("id");
			  if(!empty($id))
			  {
				  $contion["Col_ID"]=$id;
				  $Data["Col_Title"]= $ColTitle;
				  $Data["Col_State"]= $ColState;
				  $Data["Col_Order"]= $ColOrder;
				  $Data["Col_Time"]= $ColTime;
				  $Data["Col_Content"]= $content1;
				  $Data["Col_Pic"]=$ttedu_pic;
			      $Data["Col_File"]=$ttedu_fujian;
				  $Data["Col_Click"]= $ColClick;
				  $Data["Col_Hot"]= $ColHot;
				  $Data["Col_Editor"]= $ColEditor;
				  $Mlist=$col_news->where($contion)->data($Data)->save();
				  if($Mlist!==false) 
					{ 
					      //写入日志
						   self::add_login($ColTitle,$content1,$type="修改");
						  echo "<script>alert('数据修改成功!');window.location.href='/Sys/helpimgNewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."'</script>";
					}
					else
					{ 
						$this->error('数据更新失败！'); 
					} 
			    }
			   break;
		  } 
	}
	
	
	function service()
	{
	   $language=$_REQUEST["Language"];
	   $ffaID=$_REQUEST["ffaID"];
	   $faID=$this->_request("faID");
	   if(empty($language))
	   {
	   		$i_language=1;
	   }
	   else
	   {
	   		 $i_language=$_REQUEST["Language"];
	   }
	   
	   $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   if($ffaID<> $faID)
	   {
	   		$this->getfilenames($ftype=3,$faID, $MID="Main_ID");
			$locationstr=">";
	   }
	   else
	   {
	   		$locationstr="";
	   }
	   $TheObj =new Model('main_menu');//实例化模型类
		if(!empty($ffaID))
		{
			$map['Main_Father']=$faID;
		}
		$map['Main_Language']=$i_language;
	    import("ORG.Util.Page"); //导入分页类
	    $count = $TheObj->where($map)->count();    //计算总数
		$p = new Page ($count,20);
		$p->setConfig('header','条信息'); 
		$p->setConfig('prev',"<"); 
		$p->setConfig('next','>'); 
		$p->setConfig('first','<<'); 
		$p->setConfig('last','>>'); 
		$page = $p->show ();
		$this->assign( "page", $page );
		$info_detail=$TheObj->where($map)->limit($p->firstRow.','.$p->listRows)->order('main_order asc,Main_ID  desc')->select(); //查询
	   $this->assign('info_detail',$info_detail);//根据模板变量赋值
	   $this->assign('ffaID', $ffaID);
	   $this->assign('fid', $ffaID);
	   $this->assign('faID', $faID);
	   $this->assign('i_language',$i_language);
	   $this->assign('locationstr',$locationstr);
	   $this->display("service");
	}
	
	
	
	function serviceimgNewsList()
	{
	   $language=$this->_request("Language");
	   $ffaID=$_REQUEST["ffaID"];
	   $faID=$this->_request("faID");
	   $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   $this->getfilenames($ftype=3,$faID, $MID="Main_ID");
	   $TheObj =new Model('col_news');//实例化模型类
		if(!empty($ffaID))
		{
			$map['Col_MenuID']=$faID;
		}
	    import("ORG.Util.Page"); //导入分页类
	    $count = $TheObj->where($map)->count();    //计算总数
		$p = new Page ($count,20);
		$p->setConfig('header','条信息'); 
		$p->setConfig('prev',"<"); 
		$p->setConfig('next','>'); 
		$p->setConfig('first','<<'); 
		$p->setConfig('last','>>'); 
		$page = $p->show ();
		$this->assign( "page", $page );
		$info_detail=$TheObj->where($map)->limit($p->firstRow.','.$p->listRows)->order('Col_Order asc,Col_Time  desc,Col_ID desc')->select(); //查询
	   $this->assign('info_detail',$info_detail);//根据模板变量赋值
	   $this->assign('ffaID', $ffaID);
	   $this->assign('language',$language);
	   $this->assign('faID', $faID);
	   $this->display("serviceimgNewsList");
	}
	
	
	function serviceimgColCreate()
	{
	   $act=$_REQUEST["Save"];
	   
	   $Theobj=M("col_news");
	   $m=M("col_news");
	   $model=M("main_menu");
	   $faID=$this->_request("faID");
	   $ffaID=$this->_request("ffaID");
	   $language=$this->_request("Language");
	   $nickname = $model->where('main_id="'.$faID.'"')->getField('Main_Name'); 
	   $nicknames=$model->where('main_id="'.$ffaID.'"')->getField('Main_Name'); 
	   $this->assign('nickname',$nickname);
	   $this->assign('language',$language);
	   $this->assign('nicknames',$nicknames);
	   switch($act)
	   {
	   	  case "Add": 
	   	      $Col_Order=1;
			  $bvalue="保存";
			  $ColClick=9999;
		      $ffaID=$this->_request("ffaID");
			  $col_time=date("Y-m-d" ,time());
			  $faID=$this->_request("faID");
		      $this->assign('ffaids',$ffaID);
			  $this->assign('col_time',$col_time);
			  $this->assign('ColClick',$ColClick);
			  $this->assign('col_menuid',$faID);
			  $this->assign('bvalue',$bvalue);
		      $this->assign('Col_Order',$Col_Order);
			  break;
		  case "Edit":
		  	 $id=$this->_request("id");
			 $this->assign('id',$id);
			 $bvalue="修改";
		  	 if(!empty($id))
			 { 
			    $ffaID=$this->_request("ffaID");
				$colmenuid=$this->_request("faID");
		        $this->assign('ffaids',$ffaID);
				$this->assign('col_menuid',$colmenuid);
				$contion["Col_ID"]=$id;
				$col_newsinfo=$Theobj->where($contion)->find(); //查询
				$menu_data=$m->where("Col_ID='".$id."'")->select(); //查询
				$Col_Order=$menu_data[0]['Col_Order'];
				$Col_State=$menu_data[0]['Col_State'];
				$ColClick=$menu_data[0]['Col_Click'];
				$col_time=$menu_data[0]['Col_Time'];
				$Col_Hot=$menu_data[0]['Col_Hot'];
				$Col_Pic=$menu_data[0]["Col_Pic"];
			 	$Col_File=$menu_data[0]["Col_File"];
				$this->assign('Col_Pic',$Col_Pic);
				$this->assign('Col_File',$Col_File);
				$this->assign('Col_State',$Col_State);
				$this->assign('col_time',$col_time);
				$this->assign('Col_Hot',$Col_Hot);
				$this->assign('Col_Order',$Col_Order);
				$this->assign('ColClick',$ColClick);
				$this->assign('bvalue',$bvalue);
				$this->assign('col_newsinfo',$col_newsinfo);
			 }
			 break;
	   }
		 $this->display("serviceimgColCreate");
	}

	
	
	function serviceimgnewscolcreat_add()
	{
	     if (!empty($_FILES)) 
		  { 
		  	$uploads = $this->_upload();
			if (!empty($uploads['image'])){
				$ttedu_pic = $uploads['image']; 
			}
			if (!empty($uploads['fujian'])){
				$ttedu_fujian = $uploads['fujian']; 
			}
		  }
		 $sbutton=$this->_request("Submit");
		 $ffaID=$this->_request("ffaids");
		 $faID=$this->_request("col_menuid");
		 $ColTitle=$this->_request("ColTitle");
		 $ColEditor=$this->_request("ColEditor");
		 $ColHot=$this->_request("ColHot");
		 $ColState=$this->_request("ColState");
		 $language=$this->_request("Language");
		 $ColClick=$this->_request("ColClick");
		 $ColTime=$this->_request("ColTime");
		 $ColOrder=$this->_request("ColOrder");
		 $content1=$this->_request("content1");
		 
	      
		 $col_news=M("col_news");
		  switch($sbutton)
		  {
		    ///添加信息内容
		  	case "保存":
		 	  $data["Col_Title"]= $ColTitle;
		      $data["Col_Editor"]= $ColEditor;
		      $data["Col_Hot"]= $ColHot;
		      $data["Col_State"]= $ColState;
		      $data["Col_Click"]= $ColClick;
			  $data["Col_Time"]= $ColTime;
			  $data["Col_Order"]= $ColOrder;
		      $data["Col_Content"]=$content1;
			  $data["Col_Pic"]=$ttedu_pic;
			  $data["Col_File"]=$ttedu_fujian;
			  $data["Col_MenuID"]=$faID;
			  $data["Col_proid"]=$ffaID;
			  $data["Col_Language"]=$language;
		      $res=$col_news->add($data);
			  //写入日志
			   self::add_login($ColTitle,$content1,$type="添加");
		      echo "<script>alert('添加成功');window.location.href='/Sys/serviceimgNewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."'</script>";
			  break;
			case "修改":
			  $id=$this->_request("id");
			  if(!empty($id))
			  {
				  $contion["Col_ID"]=$id;
				  $Data["Col_Title"]= $ColTitle;
				  $Data["Col_State"]= $ColState;
				  $Data["Col_Order"]= $ColOrder;
				  $Data["Col_Time"]= $ColTime;
				  $Data["Col_Content"]= $content1;
				  $Data["Col_Pic"]=$ttedu_pic;
			      $Data["Col_File"]=$ttedu_fujian;
				  $Data["Col_Click"]= $ColClick;
				  $Data["Col_Hot"]= $ColHot;
				  $Data["Col_Editor"]= $ColEditor;
				  $Mlist=$col_news->where($contion)->data($Data)->save();
				  if($Mlist!==false) 
					{ 
					      //写入日志
						   self::add_login($ColTitle,$content1,$type="修改");
						  echo "<script>alert('数据修改成功!');window.location.href='/Sys/serviceimgNewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."'</script>";
					}
					else
					{ 
						$this->error('数据更新失败！'); 
					} 
			    }
			   break;
		  } 
	}
	
	
	function serviceNewsList()
	{
	    
	   $language=$this->_request('Language');
	   $ffaID=$_REQUEST["ffaID"];
	   $faID=$this->_request("faID");
	   $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   $this->getfilenames($ftype=3,$faID, $MID="Main_ID");
	   $TheObj =new Model('col_news');//实例化模型类
		if(!empty($ffaID))
		{
			$map['Col_MenuID']=$faID;
		}
	    import("ORG.Util.Page"); //导入分页类
	    $count = $TheObj->where($map)->count();    //计算总数
		$p = new Page ($count,20);
		$p->setConfig('header','条信息'); 
		$p->setConfig('prev',"<"); 
		$p->setConfig('next','>'); 
		$p->setConfig('first','<<'); 
		$p->setConfig('last','>>'); 
		$page = $p->show ();
		$this->assign( "page", $page );
		$info_detail=$TheObj->where($map)->limit($p->firstRow.','.$p->listRows)->order('Col_Order asc,Col_Time  desc,Col_ID desc')->select(); //查询
	   $this->assign('info_detail',$info_detail);//根据模板变量赋值
	   $this->assign('ffaID', $ffaID);
	   $this->assign('language', $language);
	   $this->assign('faID', $faID);
	   $this->display("serviceNewsList");
	}
	
	
	function serviceColCreate()
	{
	   $act=$_REQUEST["Save"];
	   $language=$this->_request("Language");
	   $Theobj=M("col_news");
	   $m=M("col_news");
	   $model=M("main_menu");
	   $faID=$this->_request("faID");
	   $ffaID=$this->_request("ffaID");
	   $nickname = $model->where('main_id="'.$faID.'"')->getField('Main_Name'); 
	   $nicknames=$model->where('main_id="'.$ffaID.'"')->getField('Main_Name'); 
	   $this->assign('nickname',$nickname);
	   $this->assign('language',$language);
	   $this->assign('nicknames',$nicknames);
	   switch($act)
	   {
	   	  case "Add": 
	   	      $Col_Order=1;
			  $bvalue="保存";
			  $ColClick=9999;
		      $ffaID=$this->_request("ffaID");
			  $col_time=date("Y-m-d" ,time());
			  $faID=$this->_request("faID");
		      $this->assign('ffaids',$ffaID);
			  $this->assign('col_time',$col_time);
			  $this->assign('ColClick',$ColClick);
			  $this->assign('col_menuid',$faID);
			  $this->assign('bvalue',$bvalue);
		      $this->assign('Col_Order',$Col_Order);
			  break;
		  case "Edit":
		  	 $id=$this->_request("id");
			 $this->assign('id',$id);
			 $bvalue="修改";
		  	 if(!empty($id))
			 { 
			    $ffaID=$this->_request("ffaID");
				$colmenuid=$this->_request("faID");
		        $this->assign('ffaids',$ffaID);
				$this->assign('col_menuid',$colmenuid);
				$contion["Col_ID"]=$id;
				$col_newsinfo=$Theobj->where($contion)->find(); //查询
				$menu_data=$m->where("Col_ID='".$id."'")->select(); //查询
				$Col_Order=$menu_data[0]['Col_Order'];
				$Col_State=$menu_data[0]['Col_State'];
				$ColClick=$menu_data[0]['Col_Click'];
				$col_time=$menu_data[0]['Col_Time'];
				$Col_Hot=$menu_data[0]['Col_Hot'];
				$Col_Pic=$menu_data[0]["Col_Pic"];
			 	$Col_File=$menu_data[0]["Col_File"];
				$this->assign('Col_Pic',$Col_Pic);
				$this->assign('Col_File',$Col_File);
				$this->assign('Col_State',$Col_State);
				$this->assign('col_time',$col_time);
				$this->assign('Col_Hot',$Col_Hot);
				$this->assign('Col_Order',$Col_Order);
				$this->assign('ColClick',$ColClick);
				$this->assign('bvalue',$bvalue);
				$this->assign('col_newsinfo',$col_newsinfo);
			 }
			 break;
	   }
		 $this->display("serviceColCreate");
	}
	
	function servicecolcreat_add()
	{
	     if (!empty($_FILES)) 
		  { 
		  	$uploads = $this->_upload();
			if (!empty($uploads['image'])){
				$ttedu_pic = $uploads['image']; 
			}
			if (!empty($uploads['fujian'])){
				$ttedu_fujian = $uploads['fujian']; 
			}
		  }
		 $sbutton=$this->_request("Submit");
		 $ffaID=$this->_request("ffaids");
		 $language=$this->_request("Language");
		 $faID=$this->_request("col_menuid");
		 $ColTitle=$this->_request("ColTitle");
		 $ColEditor=$this->_request("ColEditor");
		 $ColHot=$this->_request("ColHot");
		 $ColState=$this->_request("ColState");
		 $ColClick=$this->_request("ColClick");
		 $ColTime=$this->_request("ColTime");
		 $ColOrder=$this->_request("ColOrder");
		 $content1=$this->_request("content1");
		 $col_news=M("col_news");
		  switch($sbutton)
		  {
		    ///添加信息内容
		  	case "保存":
		 	  $data["Col_Title"]= $ColTitle;
		      $data["Col_Editor"]= $ColEditor;
		      $data["Col_Hot"]= $ColHot;
		      $data["Col_State"]= $ColState;
		      $data["Col_Click"]= $ColClick;
			  $data["Col_Time"]= $ColTime;
			  $data["Col_Order"]= $ColOrder;
		      $data["Col_Content"]=$content1;
			  $data["Col_Pic"]=$ttedu_pic;
			  $data["Col_File"]=$ttedu_fujian;
			  $data["Col_MenuID"]=$faID;
			  $data["Col_proid"]=$ffaID;
			  $data["Col_Language"]=$language;
		      $res=$col_news->add($data);
			  //写入日志
			   self::add_login($ColTitle,$content1,$type="添加");
			  
		      echo "<script>alert('数据添加成功!');window.location.href='/Sys/serviceNewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."'</script>";
			  break;
			case "修改":
			  $id=$this->_request("id");
			  if(!empty($id))
			  {
				  $contion["Col_ID"]=$id;
				  $Data["Col_Title"]= $ColTitle;
				  $Data["Col_State"]= $ColState;
				  $Data["Col_Order"]= $ColOrder;
				  $Data["Col_Time"]= $ColTime;
				  $Data["Col_Content"]= $content1;
				  $Data["Col_Pic"]=$ttedu_pic;
			      $Data["Col_File"]=$ttedu_fujian;
				  $Data["Col_Click"]= $ColClick;
				  $Data["Col_Hot"]= $ColHot;
				  $Data["Col_Editor"]= $ColEditor;
				  $Mlist=$col_news->where($contion)->data($Data)->save();
				  if($Mlist!==false) 
					{ 
					      //写入日志
						  self::add_login($ColTitle,$content1,$type="修改");
						  echo "<script>alert('数据修改成功!');window.location.href='/Sys/serviceNewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."';</script>";
					}
					else
					{ 
						$this->error('数据更新失败！'); 
					} 
			    }
			   break;
		  } 
	}

	
	function caselist()
	{
	   $language=$_REQUEST["Language"];
	   $ffaID=$_REQUEST["ffaID"];
	   $faID=$this->_request("faID");
	   if(empty($language))
	   {
	   		$i_language=1;
	   }
	   else
	   {
	   		 $i_language=$_REQUEST["Language"];
	   }
	   
	   $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   if($ffaID<> $faID)
	   {
	   		$this->getfilenames($ftype=3,$faID, $MID="Main_ID");
			$locationstr=">";
	   }
	   else
	   {
	   		$locationstr="";
	   }
	   $TheObj =new Model('main_menu');//实例化模型类
		if(!empty($ffaID))
		{
			$map['Main_Father']=$faID;
		}
		$map['Main_Language']=$i_language;
	    import("ORG.Util.Page"); //导入分页类
	    $count = $TheObj->where($map)->count();    //计算总数
		$p = new Page ($count,20);
		$p->setConfig('header','条信息'); 
		$p->setConfig('prev',"<"); 
		$p->setConfig('next','>'); 
		$p->setConfig('first','<<'); 
		$p->setConfig('last','>>'); 
		$page = $p->show ();
		$this->assign( "page", $page );
		$info_detail=$TheObj->where($map)->limit($p->firstRow.','.$p->listRows)->order('main_order asc,Main_ID  desc')->select(); //查询
	   $this->assign('info_detail',$info_detail);//根据模板变量赋值
	   $this->assign('ffaID', $ffaID);
	   $this->assign('fid', $ffaID);
	   $this->assign('faID', $faID);
	   $this->assign('i_language',$i_language);
	   $this->assign('locationstr',$locationstr);
	   $this->display("caselist");
	}
	
	function case_creat()
	{
	
	   $language=$this->_request('Language');
	   $act=$_REQUEST["Save"];
	   $faID=$this->_request("faID");
	   $ffaID=$this->_request("ffaID");
	  $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   switch($act)
	   {
	   	  case "Add":
	   	      $COrder=1;
			  $Main_State=1;
			  $bvalue="保存";
			  $Main_Type=1;
		      $this->assign('ffaids',$ffaID);
			  $this->assign('Main_State',$Main_State);
			  $this->assign('faID',$faID);
			  $this->assign('Main_Type',$Main_Type);
			  $this->assign('bvalue',$bvalue);
		      $this->assign('COrder',$COrder);
			  $this->assign('language',$language);
			  break;
		  case "Edit":
		  	 $id=$this->_request("id");
			 $this->assign('id',$id);
			 $this->assign('language',$language);
			 $bvalue="修改";
		  	 if(!empty($id))
			 { 
		       $this->assign('ffaids',$ffaID); 
			   $this->assign('faID',$faID); 
				$Theobj=M("main_menu");
				$m=M("main_menu");
				$contion["Main_ID"]=$id;
				$menu_info=$Theobj->where($contion)->find(); //查询
				$menu_data=$m->where("Main_ID='".$id."'")->select(); //查询
				$COrder=$menu_data[0]['Main_Order'];
				$Main_Pic=$menu_data[0]['Main_Pic'];
				$Main_State=$menu_data[0]['Main_State'];
				$Main_Type=$menu_data[0]['Main_Type'];
				$this->assign('Main_Type',$Main_Type);
				$this->assign('Main_Pic',$Main_Pic);
				$this->assign('Main_State',$Main_State);
				$this->assign('COrder',$COrder);
				$this->assign('bvalue',$bvalue);
				$this->assign('menuinfo',$menu_info);
			 }
			 break;
	   }
		$this->display("case_creat");
	}
	function case_add()
	{
	     $language=$this->_request("Language");
		 $sbutton=$this->_request("Submit");
		 $ffaID=$this->_request("ffaids");
		 $faID=$this->_request("faID");
		 $ColName=$this->_request("ColName");
		 $COrder=$this->_request("COrder");
		 $CType=$this->_request("CType");
		 $content1=$this->_request("content1");
		 $State=$this->_request("State");
		 if (!empty($_FILES)) 
		  { 
		  	$uploads = $this->_upload();
			if (!empty($uploads['image'])){
				$main_pic = $uploads['image']; 
			}
			
		  }
		 $main_menu=M("main_menu");
		  switch($sbutton)
		  {
		    ///添加信息内容
		  	case "保存":
		 	  $data["Main_Name"]= $ColName;
		      $data["Main_State"]= $State;
		      $data["Main_Order"]= $COrder;
			  $data["Main_Pic"]= $main_pic;
		      $data["Main_Type"]= $CType;
		      $data["Main_Content"]= $content1;
		      $data["Main_Father"]=$faID;
			  $data["Main_Language"]=$language;
		      $res=$main_menu->add($data);
			  ///写入操作日志
			  self::add_login($ColName,$content1,$type="添加");
		      echo "<script>alert('信息添加成功!');window.location.href='/Sys/caselist?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."';</script>";
			  break;
			case "修改":
			  $id=$this->_request("id");
			  if(!empty($id))
			  {
				  $contion["Main_ID"]=$id;
				  $Data["Main_Name"]= $ColName;
				  $Data["Main_State"]= $State;
				  $Data["Main_Order"]= $COrder;
				  $Data["Main_Type"]= $CType;
				   $Data["Main_Pic"]= $main_pic;
				  $Data["Main_Content"]= $content1;
	              //写入日志
				  self::add_login($ColName,$content1,$type="修改");
				  $Mlist=$main_menu->where($contion)->data($Data)->save();
				  if($Mlist!==false) 
					{ 
						 echo "<script>alert('数据修改成功!');window.location.href='/Sys/caselist?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."';</script>";
					}
					else
					{ 
						$this->error('数据更新失败！'); 
					} 
			    }
			   break;
		  } 
	}
	
	function caseimgNewsList()
	{
	   $language=$this->_request("Language");
	   $ffaID=$_REQUEST["ffaID"];
	   $faID=$this->_request("faID");
	   $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   $this->getfilenames($ftype=3,$faID, $MID="Main_ID");
	   $TheObj =new Model('col_news');//实例化模型类
		if(!empty($ffaID))
		{
			$map['Col_MenuID']=$faID;
		}
	    import("ORG.Util.Page"); //导入分页类
	    $count = $TheObj->where($map)->count();    //计算总数
		$p = new Page ($count,20);
		$p->setConfig('header','条信息'); 
		$p->setConfig('prev',"<"); 
		$p->setConfig('next','>'); 
		$p->setConfig('first','<<'); 
		$p->setConfig('last','>>'); 
		$page = $p->show ();
		$this->assign( "page", $page );
		$info_detail=$TheObj->where($map)->limit($p->firstRow.','.$p->listRows)->order('Col_Order asc,Col_Time  desc,Col_ID desc')->select(); //查询
	   $this->assign('info_detail',$info_detail);//根据模板变量赋值
	   $this->assign('ffaID', $ffaID);
	   $this->assign('language',$language);
	   $this->assign('faID', $faID);
	   $this->display("caseimgNewsList");
	}
	
	function caseimgColCreate()
	{
	   $act=$_REQUEST["Save"];
	   
	   $Theobj=M("col_news");
	   $m=M("col_news");
	   $model=M("main_menu");
	   $faID=$this->_request("faID");
	   $ffaID=$this->_request("ffaID");
	   $language=$this->_request("Language");
	   $nickname = $model->where('main_id="'.$faID.'"')->getField('Main_Name'); 
	   $nicknames=$model->where('main_id="'.$ffaID.'"')->getField('Main_Name'); 
	   $this->assign('nickname',$nickname);
	   $this->assign('language',$language);
	   $this->assign('nicknames',$nicknames);
	   switch($act)
	   {
	   	  case "Add": 
	   	      $Col_Order=1;
			  $bvalue="保存";
			  $ColClick=9999;
		      $ffaID=$this->_request("ffaID");
			  $col_time=date("Y-m-d" ,time());
			  $faID=$this->_request("faID");
		      $this->assign('ffaids',$ffaID);
			  $this->assign('col_time',$col_time);
			  $this->assign('ColClick',$ColClick);
			  $this->assign('col_menuid',$faID);
			  $this->assign('bvalue',$bvalue);
		      $this->assign('Col_Order',$Col_Order);
			  break;
		  case "Edit":
		  	 $id=$this->_request("id");
			 $this->assign('id',$id);
			 $bvalue="修改";
		  	 if(!empty($id))
			 { 
			    $ffaID=$this->_request("ffaID");
				$colmenuid=$this->_request("faID");
		        $this->assign('ffaids',$ffaID);
				$this->assign('col_menuid',$colmenuid);
				$contion["Col_ID"]=$id;
				$col_newsinfo=$Theobj->where($contion)->find(); //查询
				$menu_data=$m->where("Col_ID='".$id."'")->select(); //查询
				$Col_Order=$menu_data[0]['Col_Order'];
				$Col_State=$menu_data[0]['Col_State'];
				$ColClick=$menu_data[0]['Col_Click'];
				$col_time=$menu_data[0]['Col_Time'];
				$Col_Hot=$menu_data[0]['Col_Hot'];
				$Col_Pic=$menu_data[0]["Col_Pic"];
			 	$Col_File=$menu_data[0]["Col_File"];
				$this->assign('Col_Pic',$Col_Pic);
				$this->assign('Col_File',$Col_File);
				$this->assign('Col_State',$Col_State);
				$this->assign('col_time',$col_time);
				$this->assign('Col_Hot',$Col_Hot);
				$this->assign('Col_Order',$Col_Order);
				$this->assign('ColClick',$ColClick);
				$this->assign('bvalue',$bvalue);
				$this->assign('col_newsinfo',$col_newsinfo);
			 }
			 break;
	   }
		 $this->display("caseimgColCreate");
	}
	
	
	function caseNewsList()
	{
	    
	   $language=$this->_request('Language');
	   $ffaID=$_REQUEST["ffaID"];
	   $faID=$this->_request("faID");
	   $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   $this->getfilenames($ftype=3,$faID, $MID="Main_ID");
	   $TheObj =new Model('col_news');//实例化模型类
		if(!empty($ffaID))
		{
			$map['Col_MenuID']=$faID;
		}
	    import("ORG.Util.Page"); //导入分页类
	    $count = $TheObj->where($map)->count();    //计算总数
		$p = new Page ($count,20);
		$p->setConfig('header','条信息'); 
		$p->setConfig('prev',"<"); 
		$p->setConfig('next','>'); 
		$p->setConfig('first','<<'); 
		$p->setConfig('last','>>'); 
		$page = $p->show ();
		$this->assign( "page", $page );
		$info_detail=$TheObj->where($map)->limit($p->firstRow.','.$p->listRows)->order('Col_Order asc,Col_Time  desc,Col_ID desc')->select(); //查询
	   $this->assign('info_detail',$info_detail);//根据模板变量赋值
	   $this->assign('ffaID', $ffaID);
	   $this->assign('language', $language);
	   $this->assign('faID', $faID);
	   $this->display("caseNewsList");
	}
	
	function caseColCreate()
	{
	   $act=$_REQUEST["Save"];
	   $language=$this->_request("Language");
	   $Theobj=M("col_news");
	   $m=M("col_news");
	   $model=M("main_menu");
	   $faID=$this->_request("faID");
	   $ffaID=$this->_request("ffaID");
	   $nickname = $model->where('main_id="'.$faID.'"')->getField('Main_Name'); 
	   $nicknames=$model->where('main_id="'.$ffaID.'"')->getField('Main_Name'); 
	   $this->assign('nickname',$nickname);
	   $this->assign('language',$language);
	   $this->assign('nicknames',$nicknames);
	   switch($act)
	   {
	   	  case "Add": 
	   	      $Col_Order=1;
			  $bvalue="保存";
			  $ColClick=9999;
		      $ffaID=$this->_request("ffaID");
			  $col_time=date("Y-m-d" ,time());
			  $faID=$this->_request("faID");
		      $this->assign('ffaids',$ffaID);
			  $this->assign('col_time',$col_time);
			  $this->assign('ColClick',$ColClick);
			  $this->assign('col_menuid',$faID);
			  $this->assign('bvalue',$bvalue);
		      $this->assign('Col_Order',$Col_Order);
			  break;
		  case "Edit":
		  	 $id=$this->_request("id");
			 $this->assign('id',$id);
			 $bvalue="修改";
		  	 if(!empty($id))
			 { 
			    $ffaID=$this->_request("ffaID");
				$colmenuid=$this->_request("faID");
		        $this->assign('ffaids',$ffaID);
				$this->assign('col_menuid',$colmenuid);
				$contion["Col_ID"]=$id;
				$col_newsinfo=$Theobj->where($contion)->find(); //查询
				$menu_data=$m->where("Col_ID='".$id."'")->select(); //查询
				$Col_Order=$menu_data[0]['Col_Order'];
				$Col_State=$menu_data[0]['Col_State'];
				$ColClick=$menu_data[0]['Col_Click'];
				$col_time=$menu_data[0]['Col_Time'];
				$Col_Hot=$menu_data[0]['Col_Hot'];
				$Col_Pic=$menu_data[0]["Col_Pic"];
			 	$Col_File=$menu_data[0]["Col_File"];
				$this->assign('Col_Pic',$Col_Pic);
				$this->assign('Col_File',$Col_File);
				$this->assign('Col_State',$Col_State);
				$this->assign('col_time',$col_time);
				$this->assign('Col_Hot',$Col_Hot);
				$this->assign('Col_Order',$Col_Order);
				$this->assign('ColClick',$ColClick);
				$this->assign('bvalue',$bvalue);
				$this->assign('col_newsinfo',$col_newsinfo);
			 }
			 break;
	   }
		 $this->display("caseColCreate");
	}
	
	
	
	function casecolcreat_add()
	{
	     if (!empty($_FILES)) 
		  { 
		  	$uploads = $this->_upload();
			if (!empty($uploads['image'])){
				$ttedu_pic = $uploads['image']; 
			}
			if (!empty($uploads['fujian'])){
				$ttedu_fujian = $uploads['fujian']; 
			}
		  }
		 $sbutton=$this->_request("Submit");
		 $ffaID=$this->_request("ffaids");
		 $language=$this->_request("Language");
		 $faID=$this->_request("col_menuid");
		 $ColTitle=$this->_request("ColTitle");
		 $ColEditor=$this->_request("ColEditor");
		 $ColHot=$this->_request("ColHot");
		 $ColState=$this->_request("ColState");
		 $ColClick=$this->_request("ColClick");
		 $ColTime=$this->_request("ColTime");
		 $ColOrder=$this->_request("ColOrder");
		 $content1=$this->_request("content1");
		 $col_news=M("col_news");
		  switch($sbutton)
		  {
		    ///添加信息内容
		  	case "保存":
		 	  $data["Col_Title"]= $ColTitle;
		      $data["Col_Editor"]= $ColEditor;
		      $data["Col_Hot"]= $ColHot;
		      $data["Col_State"]= $ColState;
		      $data["Col_Click"]= $ColClick;
			  $data["Col_Time"]= $ColTime;
			  $data["Col_Order"]= $ColOrder;
		      $data["Col_Content"]=$content1;
			  $data["Col_Pic"]=$ttedu_pic;
			  $data["Col_File"]=$ttedu_fujian;
			  $data["Col_MenuID"]=$faID;
			  $data["Col_proid"]=$ffaID;
			  $data["Col_Language"]=$language;
		      $res=$col_news->add($data);
			  //写入日志
			   self::add_login($ColTitle,$content1,$type="添加");
		      echo "<script>alert('数据添加成功!');window.location.href='/Sys/caseNewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."'</script>";
			  break;
			case "修改":
			  $id=$this->_request("id");
			  if(!empty($id))
			  {
				  $contion["Col_ID"]=$id;
				  $Data["Col_Title"]= $ColTitle;
				  $Data["Col_State"]= $ColState;
				  $Data["Col_Order"]= $ColOrder;
				  $Data["Col_Time"]= $ColTime;
				  $Data["Col_Content"]= $content1;
				  $Data["Col_Pic"]=$ttedu_pic;
			      $Data["Col_File"]=$ttedu_fujian;
				  $Data["Col_Click"]= $ColClick;
				  $Data["Col_Hot"]= $ColHot;
				  $Data["Col_Editor"]= $ColEditor;
				  $Mlist=$col_news->where($contion)->data($Data)->save();
				  if($Mlist!==false) 
					{ 
					      //写入日志
						  self::add_login($ColTitle,$content1,$type="修改");
						  echo "<script>alert('数据修改成功!');window.location.href='/Sys/caseNewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."';</script>";
					}
					else
					{ 
						$this->error('数据更新失败！'); 
					} 
			    }
			   break;
		  } 
	}
	
	
	///
	function productlist()
	{
	   $language=$_REQUEST["Language"];
	   $ffaID=$_REQUEST["ffaID"];
	   $faID=$this->_request("faID");
	   if(empty($language))
	   {
	   		$i_language=1;
	   }
	   else
	   {
	   		 $i_language=$_REQUEST["Language"];
	   }
	   
	   $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   if($ffaID<> $faID)
	   {
	   		$this->getfilenames($ftype=3,$faID, $MID="Main_ID");
			$locationstr=">";
	   }
	   else
	   {
	   		$locationstr="";
	   }
	   $TheObj =new Model('main_menu');//实例化模型类
		if(!empty($ffaID))
		{
			$map['Main_Father']=$faID;
		}
		$map['Main_Language']=$i_language;
	    import("ORG.Util.Page"); //导入分页类
	    $count = $TheObj->where($map)->count();    //计算总数
		$p = new Page ($count,20);
		$p->setConfig('header','条信息'); 
		$p->setConfig('prev',"<"); 
		$p->setConfig('next','>'); 
		$p->setConfig('first','<<'); 
		$p->setConfig('last','>>'); 
		$page = $p->show ();
		$this->assign( "page", $page );
		$info_detail=$TheObj->where($map)->limit($p->firstRow.','.$p->listRows)->order('main_order asc,Main_ID  desc')->select(); //查询
	   $this->assign('info_detail',$info_detail);//根据模板变量赋值
	   $this->assign('ffaID', $ffaID);
	   $this->assign('fid', $ffaID);
	   $this->assign('faID', $faID);
	   $this->assign('i_language',$i_language);
	   $this->assign('locationstr',$locationstr);
	   $this->display("productlist");
	}
	
	function product_creat()
	{
	
	   $language=$this->_request('Language');
	   $act=$_REQUEST["Save"];
	   $faID=$this->_request("faID");
	   $ffaID=$this->_request("ffaID");
	  $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   switch($act)
	   {
	   	  case "Add":
	   	      $COrder=1;
			  $Main_State=1;
			  $bvalue="保存";
			  $Main_Type=1;
		      $this->assign('ffaids',$ffaID);
			  $this->assign('Main_State',$Main_State);
			  $this->assign('faID',$faID);
			  $this->assign('Main_Type',$Main_Type);
			  $this->assign('bvalue',$bvalue);
		      $this->assign('COrder',$COrder);
			  $this->assign('language',$language);
			  break;
		  case "Edit":
		  	 $id=$this->_request("id");
			 $this->assign('id',$id);
			 $this->assign('language',$language);
			 $bvalue="修改";
		  	 if(!empty($id))
			 { 
		       $this->assign('ffaids',$ffaID); 
			   $this->assign('faID',$faID); 
				$Theobj=M("main_menu");
				$m=M("main_menu");
				$contion["Main_ID"]=$id;
				$menu_info=$Theobj->where($contion)->find(); //查询
				$menu_data=$m->where("Main_ID='".$id."'")->select(); //查询
				$COrder=$menu_data[0]['Main_Order'];
				$Main_Pic=$menu_data[0]['Main_Pic'];
				$Main_State=$menu_data[0]['Main_State'];
				$Main_Type=$menu_data[0]['Main_Type'];
				$this->assign('Main_Type',$Main_Type);
				$this->assign('Main_Pic',$Main_Pic);
				$this->assign('Main_State',$Main_State);
				$this->assign('COrder',$COrder);
				$this->assign('bvalue',$bvalue);
				$this->assign('menuinfo',$menu_info);
			 }
			 break;
	   }
		$this->display("product_creat");
	}
	
	
	function product_add()
	{
	     $language=$this->_request("Language");
		 $sbutton=$this->_request("Submit");
		 $ffaID=$this->_request("ffaids");
		 $faID=$this->_request("faID");
		 $ColName=$this->_request("ColName");
		 $COrder=$this->_request("COrder");
		 $CType=$this->_request("CType");
		 $content1=$this->_request("content1");
		 $State=$this->_request("State");
		 if (!empty($_FILES)) 
		  { 
		  	$uploads = $this->_upload();
			if (!empty($uploads['image'])){
				$main_pic = $uploads['image']; 
			}
			
		  }
		 $main_menu=M("main_menu");
		  switch($sbutton)
		  {
		    ///添加信息内容
		  	case "保存":
		 	  $data["Main_Name"]= $ColName;
		      $data["Main_State"]= $State;
		      $data["Main_Order"]= $COrder;
			  $data["Main_Pic"]= $main_pic;
		      $data["Main_Type"]= $CType;
		      $data["Main_Content"]= $content1;
		      $data["Main_Father"]=$faID;
			  $data["Main_Language"]=$language;
		      $res=$main_menu->add($data);
			  ///写入操作日志
			  self::add_login($ColName,$content1,$type="添加");
		      echo "<script>alert('信息添加成功!');window.location.href='/Sys/productlist?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."';</script>";
			  break;
			case "修改":
			  $id=$this->_request("id");
			  if(!empty($id))
			  {
				  $contion["Main_ID"]=$id;
				  $Data["Main_Name"]= $ColName;
				  $Data["Main_State"]= $State;
				  $Data["Main_Order"]= $COrder;
				  $Data["Main_Type"]= $CType;
				   $Data["Main_Pic"]= $main_pic;
				  $Data["Main_Content"]= $content1;
	              //写入日志
				   self::add_login($ColName,$content1,$type="修改");
				  $Mlist=$main_menu->where($contion)->data($Data)->save();
				  if($Mlist!==false) 
					{ 
						 echo "<script>alert('数据修改成功!');window.location.href='/Sys/productlist?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."';</script>";
					}
					else
					{ 
						$this->error('数据更新失败！'); 
					} 
			    }
			   break;
		  } 
	}
	
	function proNewsList()
	{
	    
	   $language=$this->_request('Language');
	   $ffaID=$_REQUEST["ffaID"];
	   $faID=$this->_request("faID");
	   $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   $this->getfilenames($ftype=3,$faID, $MID="Main_ID");
	   $TheObj =new Model('col_news');//实例化模型类
		if(!empty($ffaID))
		{
			$map['Col_MenuID']=$faID;
		}
	    import("ORG.Util.Page"); //导入分页类
	    $count = $TheObj->where($map)->count();    //计算总数
		$p = new Page ($count,20);
		$p->setConfig('header','条信息'); 
		$p->setConfig('prev',"<"); 
		$p->setConfig('next','>'); 
		$p->setConfig('first','<<'); 
		$p->setConfig('last','>>'); 
		$page = $p->show ();
		$this->assign( "page", $page );
		$info_detail=$TheObj->where($map)->limit($p->firstRow.','.$p->listRows)->order('Col_Order asc,Col_Time  desc,Col_ID desc')->select(); //查询
	   $this->assign('info_detail',$info_detail);//根据模板变量赋值
	   $this->assign('ffaID', $ffaID);
	   $this->assign('language', $language);
	   $this->assign('faID', $faID);
	   $this->display("proNewsList");
	}
	
	
	function proColCreate()
	{
	   $act=$_REQUEST["Save"];
	   $language=$this->_request("Language");
	   $Theobj=M("col_news");
	   $m=M("col_news");
	   $model=M("main_menu");
	   $faID=$this->_request("faID");
	   $ffaID=$this->_request("ffaID");
	   $nickname = $model->where('main_id="'.$faID.'"')->getField('Main_Name'); 
	   $nicknames=$model->where('main_id="'.$ffaID.'"')->getField('Main_Name'); 
	   $this->assign('nickname',$nickname);
	   $this->assign('language',$language);
	   $this->assign('nicknames',$nicknames);
	   switch($act)
	   {
	   	  case "Add": 
	   	      $Col_Order=1;
			  $bvalue="保存";
			  $ColClick=9999;
		      $ffaID=$this->_request("ffaID");
			  $col_time=date("Y-m-d" ,time());
			  $faID=$this->_request("faID");
		      $this->assign('ffaids',$ffaID);
			  $this->assign('col_time',$col_time);
			  $this->assign('ColClick',$ColClick);
			  $this->assign('col_menuid',$faID);
			  $this->assign('bvalue',$bvalue);
		      $this->assign('Col_Order',$Col_Order);
			  break;
		  case "Edit":
		  	 $id=$this->_request("id");
			 $this->assign('id',$id);
			 $bvalue="修改";
		  	 if(!empty($id))
			 { 
			    $ffaID=$this->_request("ffaID");
				$colmenuid=$this->_request("faID");
		        $this->assign('ffaids',$ffaID);
				$this->assign('col_menuid',$colmenuid);
				$contion["Col_ID"]=$id;
				$col_newsinfo=$Theobj->where($contion)->find(); //查询
				$menu_data=$m->where("Col_ID='".$id."'")->select(); //查询
				$Col_Order=$menu_data[0]['Col_Order'];
				$Col_State=$menu_data[0]['Col_State'];
				$ColClick=$menu_data[0]['Col_Click'];
				$col_time=$menu_data[0]['Col_Time'];
				$Col_Hot=$menu_data[0]['Col_Hot'];
				$Col_Pic=$menu_data[0]["Col_Pic"];
			 	$Col_File=$menu_data[0]["Col_File"];
				$this->assign('Col_Pic',$Col_Pic);
				$this->assign('Col_File',$Col_File);
				$this->assign('Col_State',$Col_State);
				$this->assign('col_time',$col_time);
				$this->assign('Col_Hot',$Col_Hot);
				$this->assign('Col_Order',$Col_Order);
				$this->assign('ColClick',$ColClick);
				$this->assign('bvalue',$bvalue);
				$this->assign('col_newsinfo',$col_newsinfo);
			 }
			 break;
	   }
		 $this->display("proColCreate");
	}
	
	function procolcreat_add()
	{
	     if (!empty($_FILES)) 
		  { 
		  	$uploads = $this->_upload();
			if (!empty($uploads['image'])){
				$ttedu_pic = $uploads['image']; 
			}
			if (!empty($uploads['fujian'])){
				$ttedu_fujian = $uploads['fujian']; 
			}
		  }
		 $sbutton=$this->_request("Submit");
		 $ffaID=$this->_request("ffaids");
		 $language=$this->_request("Language");
		 $faID=$this->_request("col_menuid");
		 $ColTitle=$this->_request("ColTitle");
		 $ColEditor=$this->_request("ColEditor");
		 $ColHot=$this->_request("ColHot");
		 $ColState=$this->_request("ColState");
		 $ColClick=$this->_request("ColClick");
		 $ColTime=$this->_request("ColTime");
		 $ColOrder=$this->_request("ColOrder");
		 $content1=$this->_request("content1");
		 $col_news=M("col_news");
		  switch($sbutton)
		  {
		    ///添加信息内容
		  	case "保存":
		 	  $data["Col_Title"]= $ColTitle;
		      $data["Col_Editor"]= $ColEditor;
		      $data["Col_Hot"]= $ColHot;
		      $data["Col_State"]= $ColState;
		      $data["Col_Click"]= $ColClick;
			  $data["Col_Time"]= $ColTime;
			  $data["Col_Order"]= $ColOrder;
		      $data["Col_Content"]=$content1;
			  $data["Col_Pic"]=$ttedu_pic;
			  $data["Col_File"]=$ttedu_fujian;
			  $data["Col_MenuID"]=$faID;
			  $data["Col_proid"]=$ffaID;
			  $data["Col_Language"]=$language;
		      $res=$col_news->add($data);
			  //写入日志
			   self::add_login($ColTitle,$content1,$type="添加");
		      echo "<script>alert('数据添加成功!');window.location.href='/Sys/proNewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."'</script>";
			  break;
			case "修改":
			  $id=$this->_request("id");
			  if(!empty($id))
			  {
				  $contion["Col_ID"]=$id;
				  $Data["Col_Title"]= $ColTitle;
				  $Data["Col_State"]= $ColState;
				  $Data["Col_Order"]= $ColOrder;
				  $Data["Col_Time"]= $ColTime;
				  $Data["Col_Content"]= $content1;
				  $Data["Col_Pic"]=$ttedu_pic;
			      $Data["Col_File"]=$ttedu_fujian;
				  $Data["Col_Click"]= $ColClick;
				  $Data["Col_Hot"]= $ColHot;
				  $Data["Col_Editor"]= $ColEditor;
				  $Mlist=$col_news->where($contion)->data($Data)->save();
				  if($Mlist!==false) 
					{ 
					      //写入日志
						   self::add_login($ColTitle,$content1,$type="修改");
						  echo "<script>alert('数据修改成功!');window.location.href='/Sys/proNewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."';</script>";
					}
					else
					{ 
						$this->error('数据更新失败！'); 
					} 
			    }
			   break;
		  } 
	}
	
	function proimgNewsList()
	{
	   $language=$this->_request("Language");
	   $ffaID=$_REQUEST["ffaID"];
	   $faID=$this->_request("faID");
	   $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   $this->getfilenames($ftype=3,$faID, $MID="Main_ID");
	   $TheObj =new Model('col_news');//实例化模型类
		if(!empty($ffaID))
		{
			$map['Col_MenuID']=$faID;
		}
	    import("ORG.Util.Page"); //导入分页类
	    $count = $TheObj->where($map)->count();    //计算总数
		$p = new Page ($count,20);
		$p->setConfig('header','条信息'); 
		$p->setConfig('prev',"<"); 
		$p->setConfig('next','>'); 
		$p->setConfig('first','<<'); 
		$p->setConfig('last','>>'); 
		$page = $p->show ();
		$this->assign( "page", $page );
		$info_detail=$TheObj->where($map)->limit($p->firstRow.','.$p->listRows)->order('Col_Order asc,Col_Time  desc,Col_ID desc')->select(); //查询
	   $this->assign('info_detail',$info_detail);//根据模板变量赋值
	   $this->assign('ffaID', $ffaID);
	   $this->assign('language',$language);
	   $this->assign('faID', $faID);
	   $this->display("proimgNewsList");
	}
	
	
	function proimgColCreate()
	{
	   $act=$_REQUEST["Save"];
	   
	   $Theobj=M("col_news");
	   $m=M("col_news");
	   $model=M("main_menu");
	   $faID=$this->_request("faID");
	   $ffaID=$this->_request("ffaID");
	   $language=$this->_request("Language");
	   $nickname = $model->where('main_id="'.$faID.'"')->getField('Main_Name'); 
	   $nicknames=$model->where('main_id="'.$ffaID.'"')->getField('Main_Name'); 
	   $this->assign('nickname',$nickname);
	   $this->assign('language',$language);
	   $this->assign('nicknames',$nicknames);
	   switch($act)
	   {
	   	  case "Add": 
	   	      $Col_Order=1;
			  $bvalue="保存";
			  $ColClick=9999;
		      $ffaID=$this->_request("ffaID");
			  $col_time=date("Y-m-d" ,time());
			  $faID=$this->_request("faID");
		      $this->assign('ffaids',$ffaID);
			  $this->assign('col_time',$col_time);
			  $this->assign('ColClick',$ColClick);
			  $this->assign('col_menuid',$faID);
			  $this->assign('bvalue',$bvalue);
		      $this->assign('Col_Order',$Col_Order);
			  break;
		  case "Edit":
		  	 $id=$this->_request("id");
			 $this->assign('id',$id);
			 $bvalue="修改";
		  	 if(!empty($id))
			 { 
			    $ffaID=$this->_request("ffaID");
				$colmenuid=$this->_request("faID");
		        $this->assign('ffaids',$ffaID);
				$this->assign('col_menuid',$colmenuid);
				$contion["Col_ID"]=$id;
				$col_newsinfo=$Theobj->where($contion)->find(); //查询
				$menu_data=$m->where("Col_ID='".$id."'")->select(); //查询
				$Col_Order=$menu_data[0]['Col_Order'];
				$Col_State=$menu_data[0]['Col_State'];
				$ColClick=$menu_data[0]['Col_Click'];
				$col_time=$menu_data[0]['Col_Time'];
				$Col_Hot=$menu_data[0]['Col_Hot'];
				$Col_Pic=$menu_data[0]["Col_Pic"];
			 	$Col_File=$menu_data[0]["Col_File"];
				$this->assign('Col_Pic',$Col_Pic);
				$this->assign('Col_File',$Col_File);
				$this->assign('Col_State',$Col_State);
				$this->assign('col_time',$col_time);
				$this->assign('Col_Hot',$Col_Hot);
				$this->assign('Col_Order',$Col_Order);
				$this->assign('ColClick',$ColClick);
				$this->assign('bvalue',$bvalue);
				$this->assign('col_newsinfo',$col_newsinfo);
			 }
			 break;
	   }
		 $this->display("proimgColCreate");
	}

	function proimgnewscolcreat_add()
	{
	     if (!empty($_FILES)) 
		  { 
		  	$uploads = $this->_upload();
			if (!empty($uploads['image'])){
				$ttedu_pic = $uploads['image']; 
			}
			if (!empty($uploads['fujian'])){
				$ttedu_fujian = $uploads['fujian']; 
			}
		  }
		 $sbutton=$this->_request("Submit");
		 $ffaID=$this->_request("ffaids");
		 $faID=$this->_request("col_menuid");
		 $ColTitle=$this->_request("ColTitle");
		 $ColEditor=$this->_request("ColEditor");
		 $ColHot=$this->_request("ColHot");
		 $ColState=$this->_request("ColState");
		 $language=$this->_request("Language");
		 $ColClick=$this->_request("ColClick");
		 $ColTime=$this->_request("ColTime");
		 $ColOrder=$this->_request("ColOrder");
		 $content1=$this->_request("content1");
		 
	      
		 $col_news=M("col_news");
		  switch($sbutton)
		  {
		    ///添加信息内容
		  	case "保存":
		 	  $data["Col_Title"]= $ColTitle;
		      $data["Col_Editor"]= $ColEditor;
		      $data["Col_Hot"]= $ColHot;
		      $data["Col_State"]= $ColState;
		      $data["Col_Click"]= $ColClick;
			  $data["Col_Time"]= $ColTime;
			  $data["Col_Order"]= $ColOrder;
		      $data["Col_Content"]=$content1;
			  $data["Col_Pic"]=$ttedu_pic;
			  $data["Col_File"]=$ttedu_fujian;
			  $data["Col_MenuID"]=$faID;
			  $data["Col_proid"]=$ffaID;
			  $data["Col_Language"]=$language;
		      $res=$col_news->add($data);
			  //写入日志
			   self::add_login($ColTitle,$content1,$type="添加");
		      echo "<script>alert('添加成功');window.location.href='/Sys/proimgNewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."'</script>";
			  break;
			case "修改":
			  $id=$this->_request("id");
			  if(!empty($id))
			  {
				  $contion["Col_ID"]=$id;
				  $Data["Col_Title"]= $ColTitle;
				  $Data["Col_State"]= $ColState;
				  $Data["Col_Order"]= $ColOrder;
				  $Data["Col_Time"]= $ColTime;
				  $Data["Col_Content"]= $content1;
				  $Data["Col_Pic"]=$ttedu_pic;
			      $Data["Col_File"]=$ttedu_fujian;
				  $Data["Col_Click"]= $ColClick;
				  $Data["Col_Hot"]= $ColHot;
				  $Data["Col_Editor"]= $ColEditor;
				  $Mlist=$col_news->where($contion)->data($Data)->save();
				  if($Mlist!==false) 
					{ 
					      //写入日志
						  self::add_login($ColTitle,$content1,$type="修改");
						  echo "<script>alert('数据修改成功!');window.location.href='/Sys/proimgNewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."'</script>";
					}
					else
					{ 
						$this->error('数据更新失败！'); 
					} 
			    }
			   break;
		  } 
	}
	
	function service_creat()
	{
	
	   $language=$this->_request('Language');
	   $act=$_REQUEST["Save"];
	   $faID=$this->_request("faID");
	   $ffaID=$this->_request("ffaID");
	  $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   switch($act)
	   {
	   	  case "Add":
	   	      $COrder=1;
			  $Main_State=1;
			  $bvalue="保存";
			  $Main_Type=1;
		      $this->assign('ffaids',$ffaID);
			  $this->assign('Main_State',$Main_State);
			  $this->assign('faID',$faID);
			  $this->assign('Main_Type',$Main_Type);
			  $this->assign('bvalue',$bvalue);
		      $this->assign('COrder',$COrder);
			  $this->assign('language',$language);
			  break;
		  case "Edit":
		  	 $id=$this->_request("id");
			 $this->assign('id',$id);
			 $this->assign('language',$language);
			 $bvalue="修改";
		  	 if(!empty($id))
			 { 
		       $this->assign('ffaids',$ffaID); 
			   $this->assign('faID',$faID); 
				$Theobj=M("main_menu");
				$m=M("main_menu");
				$contion["Main_ID"]=$id;
				$menu_info=$Theobj->where($contion)->find(); //查询
				$menu_data=$m->where("Main_ID='".$id."'")->select(); //查询
				$COrder=$menu_data[0]['Main_Order'];
				$Main_Pic=$menu_data[0]['Main_Pic'];
				$Main_State=$menu_data[0]['Main_State'];
				$Main_Type=$menu_data[0]['Main_Type'];
				$this->assign('Main_Type',$Main_Type);
				$this->assign('Main_Pic',$Main_Pic);
				$this->assign('Main_State',$Main_State);
				$this->assign('COrder',$COrder);
				$this->assign('bvalue',$bvalue);
				$this->assign('menuinfo',$menu_info);
			 }
			 break;
	   }
		$this->display("service_creat");
	}
	
	
	//数据绑定
	function Alist()
	{
	   $language=$_REQUEST["Language"];
	   $ffaID=$_REQUEST["ffaID"];
	   $faID=$this->_request("faID");
	   if(empty($language))
	   {
	   		$i_language=1;
	   }
	   else
	   {
	   		 $i_language=$_REQUEST["Language"];
	   }
	   
	   $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   if($ffaID<> $faID)
	   {
	   		$this->getfilenames($ftype=3,$faID, $MID="Main_ID");
			$locationstr=">";
	   }
	   else
	   {
	   		$locationstr="";
	   }
	   $TheObj =new Model('main_menu');//实例化模型类
		if(!empty($ffaID))
		{
			$map['Main_Father']=$faID;
		}
		$map['Main_Language']=$i_language;
	    import("ORG.Util.Page"); //导入分页类
	    $count = $TheObj->where($map)->count();    //计算总数
		$p = new Page ($count,20);
		$p->setConfig('header','条信息'); 
		$p->setConfig('prev',"<"); 
		$p->setConfig('next','>'); 
		$p->setConfig('first','<<'); 
		$p->setConfig('last','>>'); 
		$page = $p->show ();
		$this->assign( "page", $page );
		$info_detail=$TheObj->where($map)->limit($p->firstRow.','.$p->listRows)->order('main_order asc,Main_ID  desc')->select(); //查询
	   $this->assign('info_detail',$info_detail);//根据模板变量赋值
	   $this->assign('ffaID', $ffaID);
	   $this->assign('fid', $ffaID);
	   $this->assign('faID', $faID);
	   $this->assign('i_language',$i_language);
	   $this->assign('locationstr',$locationstr);
	   $this->display("Alist");
	}
	
	function Acreat()
	{
	
	   $language=$this->_request('Language');
	   $act=$_REQUEST["Save"];
	   $faID=$this->_request("faID");
	   $ffaID=$this->_request("ffaID");
	  $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   switch($act)
	   {
	   	  case "Add":
	   	      $COrder=1;
			  $Main_State=1;
			  $bvalue="保存";
			  $Main_Type=1;
		      $this->assign('ffaids',$ffaID);
			  $this->assign('Main_State',$Main_State);
			  $this->assign('faID',$faID);
			  $this->assign('Main_Type',$Main_Type);
			  $this->assign('bvalue',$bvalue);
		      $this->assign('COrder',$COrder);
			  $this->assign('language',$language);
			  break;
		  case "Edit":
		  	 $id=$this->_request("id");
			 $this->assign('id',$id);
			 $this->assign('language',$language);
			 $bvalue="修改";
		  	 if(!empty($id))
			 { 
		       $this->assign('ffaids',$ffaID); 
			   $this->assign('faID',$faID); 
				$Theobj=M("main_menu");
				$m=M("main_menu");
				$contion["Main_ID"]=$id;
				$menu_info=$Theobj->where($contion)->find(); //查询
				$menu_data=$m->where("Main_ID='".$id."'")->select(); //查询
				$COrder=$menu_data[0]['Main_Order'];
				$Main_Pic=$menu_data[0]['Main_Pic'];
				$Main_State=$menu_data[0]['Main_State'];
				$Main_Type=$menu_data[0]['Main_Type'];
				$this->assign('Main_Type',$Main_Type);
				$this->assign('Main_Pic',$Main_Pic);
				$this->assign('Main_State',$Main_State);
				$this->assign('COrder',$COrder);
				$this->assign('bvalue',$bvalue);
				$this->assign('menuinfo',$menu_info);
			 }
			 break;
	   }
		$this->display("Acreat");
	}
	
	function AColCreate()
	{
	   $act=$_REQUEST["Save"];
	   $language=$this->_request("Language");
	   $Theobj=M("col_news");
	   $m=M("col_news");
	   $model=M("main_menu");
	   $faID=$this->_request("faID");
	   $ffaID=$this->_request("ffaID");
	   $nickname = $model->where('main_id="'.$faID.'"')->getField('Main_Name'); 
	   $nicknames=$model->where('main_id="'.$ffaID.'"')->getField('Main_Name'); 
	   $this->assign('nickname',$nickname);
	   $this->assign('language',$language);
	   $this->assign('nicknames',$nicknames);
	   switch($act)
	   {
	   	  case "Add": 
	   	      $Col_Order=1;
			  $bvalue="保存";
			  $ColClick=9999;
		      $ffaID=$this->_request("ffaID");
			  $col_time=date("Y-m-d" ,time());
			  $faID=$this->_request("faID");
		      $this->assign('ffaids',$ffaID);
			  $this->assign('col_time',$col_time);
			  $this->assign('ColClick',$ColClick);
			  $this->assign('col_menuid',$faID);
			  $this->assign('bvalue',$bvalue);
		      $this->assign('Col_Order',$Col_Order);
			  break;
		  case "Edit":
		  	 $id=$this->_request("id");
			 $this->assign('id',$id);
			 $bvalue="修改";
		  	 if(!empty($id))
			 { 
			    $ffaID=$this->_request("ffaID");
				$colmenuid=$this->_request("faID");
		        $this->assign('ffaids',$ffaID);
				$this->assign('col_menuid',$colmenuid);
				$contion["Col_ID"]=$id;
				$col_newsinfo=$Theobj->where($contion)->find(); //查询
				$menu_data=$m->where("Col_ID='".$id."'")->select(); //查询
				$Col_Order=$menu_data[0]['Col_Order'];
				$Col_State=$menu_data[0]['Col_State'];
				$ColClick=$menu_data[0]['Col_Click'];
				$col_time=$menu_data[0]['Col_Time'];
				$Col_Hot=$menu_data[0]['Col_Hot'];
				$Col_Pic=$menu_data[0]["Col_Pic"];
			 	$Col_File=$menu_data[0]["Col_File"];
				$this->assign('Col_Pic',$Col_Pic);
				$this->assign('Col_File',$Col_File);
				$this->assign('Col_State',$Col_State);
				$this->assign('col_time',$col_time);
				$this->assign('Col_Hot',$Col_Hot);
				$this->assign('Col_Order',$Col_Order);
				$this->assign('ColClick',$ColClick);
				$this->assign('bvalue',$bvalue);
				$this->assign('col_newsinfo',$col_newsinfo);
			 }
			 break;
	   }
		 $this->display("AColCreate");
	}
	
	function Anewscolcreat_add()
	{
	     if (!empty($_FILES)) 
		  { 
		  	$uploads = $this->_upload();
			if (!empty($uploads['image'])){
				$ttedu_pic = $uploads['image']; 
			}
			if (!empty($uploads['fujian'])){
				$ttedu_fujian = $uploads['fujian']; 
			}
		  }
		 $sbutton=$this->_request("Submit");
		 $ffaID=$this->_request("ffaids");
		 $language=$this->_request("Language");
		 $faID=$this->_request("col_menuid");
		 $ColTitle=$this->_request("ColTitle");
		 $ColEditor=$this->_request("ColEditor");
		 $ColHot=$this->_request("ColHot");
		 $ColState=$this->_request("ColState");
		 $ColClick=$this->_request("ColClick");
		 $ColTime=$this->_request("ColTime");
		 $ColOrder=$this->_request("ColOrder");
		 $content1=$this->_request("content1");
		 $col_news=M("col_news");
		  switch($sbutton)
		  {
		    ///添加信息内容
		  	case "保存":
		 	  $data["Col_Title"]= $ColTitle;
		      $data["Col_Editor"]= $ColEditor;
		      $data["Col_Hot"]= $ColHot;
		      $data["Col_State"]= $ColState;
		      $data["Col_Click"]= $ColClick;
			  $data["Col_Time"]= $ColTime;
			  $data["Col_Order"]= $ColOrder;
		      $data["Col_Content"]=$content1;
			  $data["Col_Pic"]=$ttedu_pic;
			  $data["Col_File"]=$ttedu_fujian;
			  $data["Col_MenuID"]=$faID;
			  $data["Col_proid"]=$ffaID;
			  $data["Col_Language"]=$language;
		      $res=$col_news->add($data);
			  self::add_login($ColTitle,$content1,$type="添加");
			  
		      echo "<script>alert('数据添加成功!');window.location.href='/Sys/ANewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."'</script>";
			  break;
			case "修改":
			  $id=$this->_request("id");
			  if(!empty($id))
			  {
				  $contion["Col_ID"]=$id;
				  $Data["Col_Title"]= $ColTitle;
				  $Data["Col_State"]= $ColState;
				  $Data["Col_Order"]= $ColOrder;
				  $Data["Col_Time"]= $ColTime;
				  $Data["Col_Content"]= $content1;
				  $Data["Col_Pic"]=$ttedu_pic;
			      $Data["Col_File"]=$ttedu_fujian;
				  $Data["Col_Click"]= $ColClick;
				  $Data["Col_Hot"]= $ColHot;
				  $Data["Col_Editor"]= $ColEditor;
				  $Mlist=$col_news->where($contion)->data($Data)->save();
				  if($Mlist!==false) 
					{ 
						    self::add_login($ColTitle,$content1,$type="修改");
						  echo "<script>alert('数据修改成功!');window.location.href='/Sys/ANewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."';</script>";
					}
					else
					{ 
						$this->error('数据更新失败！'); 
					} 
			    }
			   break;
		  } 
	}
	
	
	
	function Aadd()
	{
	     $language=$this->_request("Language");
		 $sbutton=$this->_request("Submit");
		 $ffaID=$this->_request("ffaids");
		 $faID=$this->_request("faID");
		 $ColName=$this->_request("ColName");
		 $COrder=$this->_request("COrder");
		 $CType=$this->_request("CType");
		 $content1=$this->_request("content1");
		 $State=$this->_request("State");
		 if (!empty($_FILES)) 
		  { 
		  	$uploads = $this->_upload();
			if (!empty($uploads['image'])){
				$main_pic = $uploads['image']; 
			}
			
		  }
		 $main_menu=M("main_menu");
		  switch($sbutton)
		  {
		    ///添加信息内容
		  	case "保存":
		 	  $data["Main_Name"]= $ColName;
		      $data["Main_State"]= $State;
		      $data["Main_Order"]= $COrder;
			  $data["Main_Pic"]= $main_pic;
		      $data["Main_Type"]= $CType;
		      $data["Main_Content"]= $content1;
		      $data["Main_Father"]=$faID;
			  $data["Main_Language"]=$language;
		      $res=$main_menu->add($data);
			  self::add_login($ColName,$content1,$type="添加");
		      echo "<script>alert('信息添加成功!');window.location.href='/Sys/Alist?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."';</script>";
			  break;
			case "修改":
			  $id=$this->_request("id");
			  if(!empty($id))
			  {
				  $contion["Main_ID"]=$id;
				  $Data["Main_Name"]= $ColName;
				  $Data["Main_State"]= $State;
				  $Data["Main_Order"]= $COrder;
				  $Data["Main_Type"]= $CType;
				   $Data["Main_Pic"]= $main_pic;
				  $Data["Main_Content"]= $content1;
	           
			      self::add_login($ColName,$content1,$type="修改");
				  $Mlist=$main_menu->where($contion)->data($Data)->save();
				  if($Mlist!==false) 
					{ 
						 echo "<script>alert('数据修改成功!');window.location.href='/Sys/Alist?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."';</script>";
					}
					else
					{ 
						$this->error('数据更新失败！'); 
					} 
			    }
			   break;
		  } 
	}
	
	function ANewsList()
	{
	    
	   $language=$this->_request('Language');
	   $ffaID=$_REQUEST["ffaID"];
	   $faID=$this->_request("faID");
	   $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   $this->getfilenames($ftype=3,$faID, $MID="Main_ID");
	   $TheObj =new Model('col_news');//实例化模型类
		if(!empty($ffaID))
		{
			$map['Col_MenuID']=$faID;
		}
	    import("ORG.Util.Page"); //导入分页类
	    $count = $TheObj->where($map)->count();    //计算总数
		$p = new Page ($count,20);
		$p->setConfig('header','条信息'); 
		$p->setConfig('prev',"<"); 
		$p->setConfig('next','>'); 
		$p->setConfig('first','<<'); 
		$p->setConfig('last','>>'); 
		$page = $p->show ();
		$this->assign( "page", $page );
		$info_detail=$TheObj->where($map)->limit($p->firstRow.','.$p->listRows)->order('Col_Order asc,Col_Time  desc,Col_ID desc')->select(); //查询
	   $this->assign('info_detail',$info_detail);//根据模板变量赋值
	   $this->assign('ffaID', $ffaID);
	   $this->assign('language', $language);
	   $this->assign('faID', $faID);
	   $this->display("ANewsList");
	}
	///
	function news_creat()
	{
	
	   $language=$this->_request('Language');
	   $act=$_REQUEST["Save"];
	   $faID=$this->_request("faID");
	   $ffaID=$this->_request("ffaID");
	  $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   switch($act)
	   {
	   	  case "Add":
	   	      $COrder=1;
			  $Main_State=1;
			  $bvalue="保存";
			  $Main_Type=1;
		      $this->assign('ffaids',$ffaID);
			  $this->assign('Main_State',$Main_State);
			  $this->assign('faID',$faID);
			  $this->assign('Main_Type',$Main_Type);
			  $this->assign('bvalue',$bvalue);
		      $this->assign('COrder',$COrder);
			  $this->assign('language',$language);
			  break;
		  case "Edit":
		  	 $id=$this->_request("id");
			 $this->assign('id',$id);
			 $this->assign('language',$language);
			 $bvalue="修改";
		  	 if(!empty($id))
			 { 
		       $this->assign('ffaids',$ffaID); 
			   $this->assign('faID',$faID); 
				$Theobj=M("main_menu");
				$m=M("main_menu");
				$contion["Main_ID"]=$id;
				$menu_info=$Theobj->where($contion)->find(); //查询
				$menu_data=$m->where($contion)->select(); //查询
				$COrder=$menu_data[0]['Main_Order'];
				$Main_State=$menu_data[0]['Main_State'];
				$Main_Type=$menu_data[0]['Main_Type'];
				$this->assign('Main_Type',$Main_Type);
				$this->assign('Main_State',$Main_State);
				$this->assign('COrder',$COrder);
				$this->assign('bvalue',$bvalue);
				$this->assign('menuinfo',$menu_info);
			 }
			 break;
	   }
		$this->display("news_creat");
	}
	
	
	
	function help_creat()
	{
	
	   $language=$this->_request('Language');
	   $act=$_REQUEST["Save"];
	   $faID=$this->_request("faID");
	   $ffaID=$this->_request("ffaID");
	  $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   switch($act)
	   {
	   	  case "Add":
	   	      $COrder=1;
			  $Main_State=1;
			  $bvalue="保存";
			  $Main_Type=1;
		      $this->assign('ffaids',$ffaID);
			  $this->assign('Main_State',$Main_State);
			  $this->assign('faID',$faID);
			  $this->assign('Main_Type',$Main_Type);
			  $this->assign('bvalue',$bvalue);
		      $this->assign('COrder',$COrder);
			  $this->assign('language',$language);
			  break;
		  case "Edit":
		  	 $id=$this->_request("id");
			 $this->assign('id',$id);
			 $this->assign('language',$language);
			 $bvalue="修改";
		  	 if(!empty($id))
			 { 
		       $this->assign('ffaids',$ffaID); 
			   $this->assign('faID',$faID); 
				$Theobj=M("main_menu");
				$m=M("main_menu");
				$contion["Main_ID"]=$id;
				$menu_info=$Theobj->where($contion)->find(); //查询
				$menu_data=$m->where("Main_ID='".$id."'")->select(); //查询
				$COrder=$menu_data[0]['Main_Order'];
				$Main_Pic=$menu_data[0]['Main_Pic'];
				$Main_State=$menu_data[0]['Main_State'];
				$Main_Type=$menu_data[0]['Main_Type'];
				$this->assign('Main_Type',$Main_Type);
				$this->assign('Main_Pic',$Main_Pic);
				$this->assign('Main_State',$Main_State);
				$this->assign('COrder',$COrder);
				$this->assign('bvalue',$bvalue);
				$this->assign('menuinfo',$menu_info);
			 }
			 break;
	   }
		$this->display("help_creat");
	}
	
	
	
	function service_add()
	{
	     $language=$this->_request("Language");
		 $sbutton=$this->_request("Submit");
		 $ffaID=$this->_request("ffaids");
		 $faID=$this->_request("faID");
		 $ColName=$this->_request("ColName");
		 $COrder=$this->_request("COrder");
		 $CType=$this->_request("CType");
		 $content1=$this->_request("content1");
		 $State=$this->_request("State");
		 if (!empty($_FILES)) 
		  { 
		  	$uploads = $this->_upload();
			if (!empty($uploads['image'])){
				$main_pic = $uploads['image']; 
			}
			
		  }
		 $main_menu=M("main_menu");
		  switch($sbutton)
		  {
		    ///添加信息内容
		  	case "保存":
		 	  $data["Main_Name"]= $ColName;
		      $data["Main_State"]= $State;
		      $data["Main_Order"]= $COrder;
			  $data["Main_Pic"]= $main_pic;
		      $data["Main_Type"]= $CType;
		      $data["Main_Content"]= $content1;
		      $data["Main_Father"]=$faID;
			  $data["Main_Language"]=$language;
		      $res=$main_menu->add($data);
			  self::add_login($ColName,$content1,$type="添加");
		      echo "<script>alert('信息添加成功!');window.location.href='/Sys/service?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."';</script>";
			  break;
			case "修改":
			  $id=$this->_request("id");
			  if(!empty($id))
			  {
				  $contion["Main_ID"]=$id;
				  $Data["Main_Name"]= $ColName;
				  $Data["Main_State"]= $State;
				  $Data["Main_Order"]= $COrder;
				  $Data["Main_Type"]= $CType;
				   $Data["Main_Pic"]= $main_pic;
				  $Data["Main_Content"]= $content1;
				  self::add_login($ColName,$content1,$type="修改");
				  $Mlist=$main_menu->where($contion)->data($Data)->save();
				  if($Mlist!==false) 
					{ 
						 echo "<script>alert('数据修改成功!');window.location.href='/Sys/service?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."';</script>";
					}
					else
					{ 
						$this->error('数据更新失败！'); 
					} 
			    }
			   break;
		  } 
	}
	
	
	
	function news_add()
	{
	     $language=$this->_request("Language");
		 $sbutton=$this->_request("Submit");
		 $ffaID=$this->_request("ffaids");
		 $faID=$this->_request("faID");
		 $ColName=$this->_request("ColName");
		 $COrder=$this->_request("COrder");
		 $CType=$this->_request("CType");
		 $content1=$this->_request("content1");
		 $State=$this->_request("State");
		
		$uploads = $this->_upload();
		$main_pic = $uploads['image']; 
		 $main_menu=M("main_menu");
		  switch($sbutton)
		  {
		    ///添加信息内容
		  	case "保存":
		 	  $data["Main_Name"]= $ColName;
		      $data["Main_State"]= $State;
		      $data["Main_Order"]= $COrder;
			  $data["Main_Pic"]= $main_pic;
		      $data["Main_Type"]= $CType;
		      $data["Main_Content"]= $content1;
		      $data["Main_Father"]=$faID;
			  $data["Main_Language"]=$language;
		      $res=$main_menu->add($data);
              self::add_login($ColName,$content1,$type="添加");
		      echo "<script>alert('信息添加成功!');window.location.href='/Sys/news_list?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."';</script>";
			  break;
			case "修改":
			  $id=$this->_request("id");
			  if(!empty($id))
			  {
				  $contion["Main_ID"]=$id;
				  $Data["Main_Name"]= $ColName;
				  $Data["Main_State"]= $State;
				  $Data["Main_Order"]= $COrder;
				  $Data["Main_Type"]= $CType;
				  if(!empty($uploads['image']))
				  {
				     $main_pic = $uploads['image']; 
				     $Data["Main_Pic"]= $main_pic;
				  }
				  $Data["Main_Content"]= $content1;
	              self::add_login($ColName,$content1,$type="修改");
				  $Mlist=$main_menu->where($contion)->data($Data)->save();
				  if($Mlist!==false) 
					{ 
						 echo "<script>alert('数据修改成功!');window.location.href='/Sys/news_list?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."';</script>";
					}
					else
					{ 
						$this->error('数据更新失败！'); 
					} 
			    }
			   break;
		  } 
	}
	//注销用户登录
	function logout()
	{
	  unset($_SESSION["username"]);
	  unset($_SESSION["userole"]);
	  $this->redirect("__APP__/Admin/Sys/login");
	}
	
	
	function Adelete()
	{  
	    $id = $_POST['nCID'];
	    $Submit=$this->_request("Submit");
		$Main_State=$this->_request("State");
		$this->mainmenu_delete($id,$Submit,$Main_State);
		
	}

	function Anewscoldelete()
	{
		$Submit=$this->_request("Submit");
		$col_state=$this->_request("State");
		$Language=$this->_request("Language");
		$ffaID=$this->_request("ffaID");
		$faID=$this->_request("faID");
		$id = $_POST['nCID']; 
		$this->colnewsdelete($id,$Submit,$col_state);
	}
	
	function news_delete()
	{  
	    $Submit=$this->_request("Submit");
		$mainstate=$this->_request("State");
		$fid=$this->_request("fid");
		$id = $_POST['nCID']; 
		$this->mainmenu_delete($id,$Submit,$mainstate);
	}
	
	function admin_top()
	{     
	
	       
		  $this->assign('admin', $_SESSION["username"]);
		  $this->display(); 
	}
	
	function NewsList()
	{
	    
	   $language=$this->_request('Language');
	   $ffaID=$_REQUEST["ffaID"];
	   $faID=$this->_request("faID");
	   $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   $this->getfilenames($ftype=3,$faID, $MID="Main_ID");
	   $TheObj =new Model('col_news');//实例化模型类
		if(!empty($ffaID))
		{
			$map['Col_MenuID']=$faID;
		}
	    import("ORG.Util.Page"); //导入分页类
	    $count = $TheObj->where($map)->count();    //计算总数
		$p = new Page ($count,20);
		$p->setConfig('header','条信息'); 
		$p->setConfig('prev',"<"); 
		$p->setConfig('next','>'); 
		$p->setConfig('first','<<'); 
		$p->setConfig('last','>>'); 
		$page = $p->show ();
		$this->assign( "page", $page );
		$info_detail=$TheObj->where($map)->limit($p->firstRow.','.$p->listRows)->order('Col_Order asc,Col_Time  desc,Col_ID desc')->select(); //查询
	   $this->assign('info_detail',$info_detail);//根据模板变量赋值
	   $this->assign('ffaID', $ffaID);
	   $this->assign('language', $language);
	   $this->assign('faID', $faID);
	   $this->display("NewsList");
	}
	
	
	function imgNewsList()
	{
	   $language=$this->_request("Language");
	   $ffaID=$_REQUEST["ffaID"];
	   $faID=$this->_request("faID");
	   $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   $this->getfilenames($ftype=3,$faID, $MID="Main_ID");
	   $TheObj =new Model('col_news');//实例化模型类
		if(!empty($ffaID))
		{
			$map['Col_MenuID']=$faID;
		}
	    import("ORG.Util.Page"); //导入分页类
	    $count = $TheObj->where($map)->count();    //计算总数
		$p = new Page ($count,20);
		$p->setConfig('header','条信息'); 
		$p->setConfig('prev',"<"); 
		$p->setConfig('next','>'); 
		$p->setConfig('first','<<'); 
		$p->setConfig('last','>>'); 
		$page = $p->show ();
		$this->assign( "page", $page );
		$info_detail=$TheObj->where($map)->limit($p->firstRow.','.$p->listRows)->order('Col_Order asc,Col_Time  desc,Col_ID desc')->select(); //查询
	   $this->assign('info_detail',$info_detail);//根据模板变量赋值
	   $this->assign('ffaID', $ffaID);
	   $this->assign('language',$language);
	   $this->assign('faID', $faID);
	   $this->display("imgNewsList");
	}
	
	
	function ColCreate()
	{
	   $act=$_REQUEST["Save"];
	   $language=$this->_request("Language");
	   $Theobj=M("col_news");
	   $m=M("col_news");
	   $model=M("main_menu");
	   $faID=$this->_request("faID");
	   $ffaID=$this->_request("ffaID");
	   $nickname = $model->where('main_id="'.$faID.'"')->getField('Main_Name'); 
	   $nicknames=$model->where('main_id="'.$ffaID.'"')->getField('Main_Name'); 
	   $this->assign('nickname',$nickname);
	   $this->assign('language',$language);
	   $this->assign('nicknames',$nicknames);
	   switch($act)
	   {
	   	  case "Add": 
	   	      $Col_Order=1;
			  $bvalue="保存";
			  $ColClick=9999;
		      $ffaID=$this->_request("ffaID");
			  $col_time=date("Y-m-d" ,time());
			  $faID=$this->_request("faID");
		      $this->assign('ffaids',$ffaID);
			  $this->assign('col_time',$col_time);
			  $this->assign('ColClick',$ColClick);
			  $this->assign('col_menuid',$faID);
			  $this->assign('bvalue',$bvalue);
		      $this->assign('Col_Order',$Col_Order);
			  break;
		  case "Edit":
		  	 $id=$this->_request("id");
			 $this->assign('id',$id);
			 $bvalue="修改";
		  	 if(!empty($id))
			 { 
			    $ffaID=$this->_request("ffaID");
				$colmenuid=$this->_request("faID");
		        $this->assign('ffaids',$ffaID);
				$this->assign('col_menuid',$colmenuid);
				$contion["Col_ID"]=$id;
				$col_newsinfo=$Theobj->where($contion)->find(); //查询
				$menu_data=$m->where("Col_ID='".$id."'")->select(); //查询
				$Col_Order=$menu_data[0]['Col_Order'];
				$Col_State=$menu_data[0]['Col_State'];
				$ColClick=$menu_data[0]['Col_Click'];
				$col_time=$menu_data[0]['Col_Time'];
				$Col_Hot=$menu_data[0]['Col_Hot'];
				$Col_Pic=$menu_data[0]["Col_Pic"];
			 	$Col_File=$menu_data[0]["Col_File"];
				$this->assign('Col_Pic',$Col_Pic);
				$this->assign('Col_File',$Col_File);
				$this->assign('Col_State',$Col_State);
				$this->assign('col_time',$col_time);
				$this->assign('Col_Hot',$Col_Hot);
				$this->assign('Col_Order',$Col_Order);
				$this->assign('ColClick',$ColClick);
				$this->assign('bvalue',$bvalue);
				$this->assign('col_newsinfo',$col_newsinfo);
			 }
			 break;
	   }
		 $this->display("ColCreate");
	}
	
	function imgColCreate()
	{
	   $act=$_REQUEST["Save"];
	   
	   $Theobj=M("col_news");
	   $m=M("col_news");
	   $model=M("main_menu");
	   $faID=$this->_request("faID");
	   $ffaID=$this->_request("ffaID");
	   $language=$this->_request("Language");
	   $nickname = $model->where('main_id="'.$faID.'"')->getField('Main_Name'); 
	   $nicknames=$model->where('main_id="'.$ffaID.'"')->getField('Main_Name'); 
	   $this->assign('nickname',$nickname);
	   $this->assign('language',$language);
	   $this->assign('nicknames',$nicknames);
	   switch($act)
	   {
	   	  case "Add": 
	   	      $Col_Order=1;
			  $bvalue="保存";
			  $ColClick=9999;
		      $ffaID=$this->_request("ffaID");
			  $col_time=date("Y-m-d" ,time());
			  $faID=$this->_request("faID");
		      $this->assign('ffaids',$ffaID);
			  $this->assign('col_time',$col_time);
			  $this->assign('ColClick',$ColClick);
			  $this->assign('col_menuid',$faID);
			  $this->assign('bvalue',$bvalue);
		      $this->assign('Col_Order',$Col_Order);
			  break;
		  case "Edit":
		  	 $id=$this->_request("id");
			 $this->assign('id',$id);
			 $bvalue="修改";
		  	 if(!empty($id))
			 { 
			    $ffaID=$this->_request("ffaID");
				$colmenuid=$this->_request("faID");
		        $this->assign('ffaids',$ffaID);
				$this->assign('col_menuid',$colmenuid);
				$contion["Col_ID"]=$id;
				$col_newsinfo=$Theobj->where($contion)->find(); //查询
				$menu_data=$m->where("Col_ID='".$id."'")->select(); //查询
				$Col_Order=$menu_data[0]['Col_Order'];
				$Col_State=$menu_data[0]['Col_State'];
				$ColClick=$menu_data[0]['Col_Click'];
				$col_time=$menu_data[0]['Col_Time'];
				$Col_Hot=$menu_data[0]['Col_Hot'];
				$Col_Pic=$menu_data[0]["Col_Pic"];
			 	$Col_File=$menu_data[0]["Col_File"];
				$this->assign('Col_Pic',$Col_Pic);
				$this->assign('Col_File',$Col_File);
				$this->assign('Col_State',$Col_State);
				$this->assign('col_time',$col_time);
				$this->assign('Col_Hot',$Col_Hot);
				$this->assign('Col_Order',$Col_Order);
				$this->assign('ColClick',$ColClick);
				$this->assign('bvalue',$bvalue);
				$this->assign('col_newsinfo',$col_newsinfo);
			 }
			 break;
	   }
		 $this->display("imgColCreate");
	}


function AimgColCreate()
	{
	   $act=$_REQUEST["Save"];
	   
	   $Theobj=M("col_news");
	   $m=M("col_news");
	   $model=M("main_menu");
	   $faID=$this->_request("faID");
	   $ffaID=$this->_request("ffaID");
	   $language=$this->_request("Language");
	   $nickname = $model->where('main_id="'.$faID.'"')->getField('Main_Name'); 
	   $nicknames=$model->where('main_id="'.$ffaID.'"')->getField('Main_Name'); 
	   $this->assign('nickname',$nickname);
	   $this->assign('language',$language);
	   $this->assign('nicknames',$nicknames);
	   switch($act)
	   {
	   	  case "Add": 
	   	      $Col_Order=1;
			  $bvalue="保存";
			  $ColClick=9999;
		      $ffaID=$this->_request("ffaID");
			  $col_time=date("Y-m-d" ,time());
			  $faID=$this->_request("faID");
		      $this->assign('ffaids',$ffaID);
			  $this->assign('col_time',$col_time);
			  $this->assign('ColClick',$ColClick);
			  $this->assign('col_menuid',$faID);
			  $this->assign('bvalue',$bvalue);
		      $this->assign('Col_Order',$Col_Order);
			  break;
		  case "Edit":
		  	 $id=$this->_request("id");
			 $this->assign('id',$id);
			 $bvalue="修改";
		  	 if(!empty($id))
			 { 
			    $ffaID=$this->_request("ffaID");
				$colmenuid=$this->_request("faID");
		        $this->assign('ffaids',$ffaID);
				$this->assign('col_menuid',$colmenuid);
				$contion["Col_ID"]=$id;
				$col_newsinfo=$Theobj->where($contion)->find(); //查询
				$menu_data=$m->where("Col_ID='".$id."'")->select(); //查询
				$Col_Order=$menu_data[0]['Col_Order'];
				$Col_State=$menu_data[0]['Col_State'];
				$ColClick=$menu_data[0]['Col_Click'];
				$col_time=$menu_data[0]['Col_Time'];
				$Col_Hot=$menu_data[0]['Col_Hot'];
				$Col_Pic=$menu_data[0]["Col_Pic"];
			 	$Col_File=$menu_data[0]["Col_File"];
				$this->assign('Col_Pic',$Col_Pic);
				$this->assign('Col_File',$Col_File);
				$this->assign('Col_State',$Col_State);
				$this->assign('col_time',$col_time);
				$this->assign('Col_Hot',$Col_Hot);
				$this->assign('Col_Order',$Col_Order);
				$this->assign('ColClick',$ColClick);
				$this->assign('bvalue',$bvalue);
				$this->assign('col_newsinfo',$col_newsinfo);
			 }
			 break;
	   }
		 $this->display("AimgColCreate");
	}


	function newscolcreat_add()
	{
	     if (!empty($_FILES)) 
		  { 
		  	$uploads = $this->_upload();
			if (!empty($uploads['image'])){
				$ttedu_pic = $uploads['image']; 
			}
			if (!empty($uploads['fujian'])){
				$ttedu_fujian = $uploads['fujian']; 
			}
		  }
		 $sbutton=$this->_request("Submit");
		 $ffaID=$this->_request("ffaids");
		 $language=$this->_request("Language");
		 $faID=$this->_request("col_menuid");
		 $ColTitle=$this->_request("ColTitle");
		 $ColEditor=$this->_request("ColEditor");
		 $ColHot=$this->_request("ColHot");
		 $ColState=$this->_request("ColState");
		 $ColClick=$this->_request("ColClick");
		 $ColTime=$this->_request("ColTime");
		 $ColOrder=$this->_request("ColOrder");
		 $content1=$this->_request("content1");
		 $col_news=M("col_news");
		  switch($sbutton)
		  {
		    ///添加信息内容
		  	case "保存":
		 	  $data["Col_Title"]= $ColTitle;
		      $data["Col_Editor"]= $ColEditor;
		      $data["Col_Hot"]= $ColHot;
		      $data["Col_State"]= $ColState;
		      $data["Col_Click"]= $ColClick;
			  $data["Col_Time"]= $ColTime;
			  $data["Col_Order"]= $ColOrder;
		      $data["Col_Content"]=$content1;
			  $data["Col_Pic"]=$ttedu_pic;
			  $data["Col_File"]=$ttedu_fujian;
			  $data["Col_MenuID"]=$faID;
			  $data["Col_proid"]=$ffaID;
			  $data["Col_Language"]=$language;
		      $res=$col_news->add($data);
			 
			   self::add_login($ColTitle,$content1,$type="添加");
		      echo "<script>alert('数据添加成功!');window.location.href='/Sys/NewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."'</script>";
			  break;
			case "修改":
			  $id=$this->_request("id");
			  if(!empty($id))
			  {
				  $contion["Col_ID"]=$id;
				  $Data["Col_Title"]= $ColTitle;
				  $Data["Col_State"]= $ColState;
				  $Data["Col_Order"]= $ColOrder;
				  $Data["Col_Time"]= $ColTime;
				  $Data["Col_Content"]= $content1;
				  $Data["Col_Pic"]=$ttedu_pic;
			      $Data["Col_File"]=$ttedu_fujian;
				  $Data["Col_Click"]= $ColClick;
				  $Data["Col_Hot"]= $ColHot;
				  $Data["Col_Editor"]= $ColEditor;
				  $Mlist=$col_news->where($contion)->data($Data)->save();
				  if($Mlist!==false) 
					{ 
						   self::add_login($ColTitle,$content1,$type="修改");
						  echo "<script>alert('数据修改成功!');window.location.href='/Sys/NewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."';</script>";
					}
					else
					{ 
						$this->error('数据更新失败！'); 
					} 
			    }
			   break;
		  } 
	}

function AimgNewsList()
	{
	   $language=$this->_request("Language");
	   $ffaID=$_REQUEST["ffaID"];
	   $faID=$this->_request("faID");
	   $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   $this->getfilenames($ftype=3,$faID, $MID="Main_ID");
	   $TheObj =new Model('col_news');//实例化模型类
		if(!empty($ffaID))
		{
			$map['Col_MenuID']=$faID;
		}
	    import("ORG.Util.Page"); //导入分页类
	    $count = $TheObj->where($map)->count();    //计算总数
		$p = new Page ($count,20);
		$p->setConfig('header','条信息'); 
		$p->setConfig('prev',"<"); 
		$p->setConfig('next','>'); 
		$p->setConfig('first','<<'); 
		$p->setConfig('last','>>'); 
		$page = $p->show ();
		$this->assign( "page", $page );
		$info_detail=$TheObj->where($map)->limit($p->firstRow.','.$p->listRows)->order('Col_Order asc,Col_Time  desc,Col_ID desc')->select(); //查询
	   $this->assign('info_detail',$info_detail);//根据模板变量赋值
	   $this->assign('ffaID', $ffaID);
	   $this->assign('language',$language);
	   $this->assign('faID', $faID);
	   $this->display("AimgNewsList");
	}	
	
	
	function jobnews_delete()
	{  
	    $Submit=$this->_request("Submit");
		$data["Col_State"]=$this->_request("State");
		$Language=$this->_request("Language");
		$ffaID=$this->_request("ffaID");
		$faID=$this->_request("faID");
		$model = M("col_news");//获取当期模块的操作对象 
		$id = $_POST['nCID']; 
		//判断id是数组还是一个 
		if(is_array($id))
		{ 
			$where = 'Col_ID in('.implode(',',$id).') and Col_Language='.$Language.''; 
		}
		else{ 
			$where = 'Col_ID='.$id.' and Col_Language='.$Language.''; 
		} 
		switch ($Submit)
		{
			case '批量删除':
				$list=$model->where($where)->delete(); 
				if($list!==false) 
				{ 
					 echo "<script>alert('成功删除".$list."数据!');window.location.href='/Sys/jobNewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$Language."';</script>";
				}
				else{ 
					$this->error('删除失败！'); 
				} 
			break;
			case '状态更新':
				$list=$model->where($where)->data($data)->save();
				if($list!==false) 
				{ 
				echo "<script>alert('成功更新".$list."数据!');window.location.href='/Sys/jobNewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$Language."';</script>";

				}
				else
				{ 
					$this->error('数据更新失败！'); 
				} 
			   break;
		}
	}
	function imgnewscolcreat_add()
	{
	     if (!empty($_FILES)) 
		  { 
		  	$uploads = $this->_upload();
			if (!empty($uploads['image'])){
				$ttedu_pic = $uploads['image']; 
			}
			if (!empty($uploads['fujian'])){
				$ttedu_fujian = $uploads['fujian']; 
			}
		  }
		 $sbutton=$this->_request("Submit");
		 $ffaID=$this->_request("ffaids");
		 $faID=$this->_request("col_menuid");
		 $ColTitle=$this->_request("ColTitle");
		 $ColEditor=$this->_request("ColEditor");
		 $ColHot=$this->_request("ColHot");
		 $ColState=$this->_request("ColState");
		 $language=$this->_request("Language");
		 $ColClick=$this->_request("ColClick");
		 $ColTime=$this->_request("ColTime");
		 $ColOrder=$this->_request("ColOrder");
		 $content1=$this->_request("content1");
		 $col_news=M("col_news");
		  switch($sbutton)
		  {
		    ///添加信息内容
		  	case "保存":
		 	  $data["Col_Title"]= $ColTitle;
		      $data["Col_Editor"]= $ColEditor;
		      $data["Col_Hot"]= $ColHot;
		      $data["Col_State"]= $ColState;
		      $data["Col_Click"]= $ColClick;
			  $data["Col_Time"]= $ColTime;
			  $data["Col_Order"]= $ColOrder;
		      $data["Col_Content"]=$content1;
			  $data["Col_Pic"]=$ttedu_pic;
			  $data["Col_File"]=$ttedu_fujian;
			  $data["Col_MenuID"]=$faID;
			  $data["Col_proid"]=$ffaID;
			  $data["Col_Language"]=$language;
			  
			  self::add_login($ColTitle,$content1,$type="添加");
		      $res=$col_news->add($data);
		      echo "<script>alert('添加成功');window.location.href='/Sys/imgNewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."'</script>";
			  break;
			case "修改":
			  $id=$this->_request("id");
			  if(!empty($id))
			  {
				  $contion["Col_ID"]=$id;
				  $Data["Col_Title"]= $ColTitle;
				  $Data["Col_State"]= $ColState;
				  $Data["Col_Order"]= $ColOrder;
				  $Data["Col_Time"]= $ColTime;
				  $Data["Col_Content"]= $content1;
				  $Data["Col_Pic"]=$ttedu_pic;
			      $Data["Col_File"]=$ttedu_fujian;
				  $Data["Col_Click"]= $ColClick;
				  $Data["Col_Hot"]= $ColHot;
				  $Data["Col_Editor"]= $ColEditor;
				  $Mlist=$col_news->where($contion)->data($Data)->save();
				  if($Mlist!==false) 
					{ 
						  self::add_login($ColTitle,$content1,$type="修改"); 
						  echo "<script>alert('数据修改成功!');window.location.href='/Sys/imgNewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."'</script>";
					}
					else
					{ 
						$this->error('数据更新失败！'); 
					} 
			    }
			   break;
		  } 
	}
	
	
	function Aimgnewscolcreat_add()
	{
	     if (!empty($_FILES)) 
		  { 
		  	$uploads = $this->_upload();
			if (!empty($uploads['image'])){
				$ttedu_pic = $uploads['image']; 
			}
			if (!empty($uploads['fujian'])){
				$ttedu_fujian = $uploads['fujian']; 
			}
		  }
		 $sbutton=$this->_request("Submit");
		 $ffaID=$this->_request("ffaids");
		 $faID=$this->_request("col_menuid");
		 $ColTitle=$this->_request("ColTitle");
		 $ColEditor=$this->_request("ColEditor");
		 $ColHot=$this->_request("ColHot");
		 $ColState=$this->_request("ColState");
		 $language=$this->_request("Language");
		 $ColClick=$this->_request("ColClick");
		 $ColTime=$this->_request("ColTime");
		 $ColOrder=$this->_request("ColOrder");
		 $content1=$this->_request("content1");
		 $col_news=M("col_news");
		  switch($sbutton)
		  {
		    ///添加信息内容
		  	case "保存":
		 	  $data["Col_Title"]= $ColTitle;
		      $data["Col_Editor"]= $ColEditor;
		      $data["Col_Hot"]= $ColHot;
		      $data["Col_State"]= $ColState;
		      $data["Col_Click"]= $ColClick;
			  $data["Col_Time"]= $ColTime;
			  $data["Col_Order"]= $ColOrder;
		      $data["Col_Content"]=$content1;
			  $data["Col_Pic"]=$ttedu_pic;
			  $data["Col_File"]=$ttedu_fujian;
			  $data["Col_MenuID"]=$faID;
			  $data["Col_proid"]=$ffaID;
			  $data["Col_Language"]=$language;
		      $res=$col_news->add($data);
			   self::add_login($ColTitle,$content1,$type="添加");
		      echo "<script>alert('添加成功');window.location.href='/Sys/AimgNewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."'</script>";
			  break;
			case "修改":
			  $id=$this->_request("id");
			  if(!empty($id))
			  {
				  $contion["Col_ID"]=$id;
				  $Data["Col_Title"]= $ColTitle;
				  $Data["Col_State"]= $ColState;
				  $Data["Col_Order"]= $ColOrder;
				  $Data["Col_Time"]= $ColTime;
				  $Data["Col_Content"]= $content1;
				  $Data["Col_Pic"]=$ttedu_pic;
			      $Data["Col_File"]=$ttedu_fujian;
				  $Data["Col_Click"]= $ColClick;
				  $Data["Col_Hot"]= $ColHot;
				  $Data["Col_Editor"]= $ColEditor;
				  $Mlist=$col_news->where($contion)->data($Data)->save();
				  if($Mlist!==false) 
					{ 
						   self::add_login($ColTitle,$content1,$type="修改");  
						  echo "<script>alert('数据修改成功!');window.location.href='/Sys/AimgNewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."'</script>";
					}
					else
					{ 
						$this->error('数据更新失败！'); 
					} 
			    }
			   break;
		  } 
	}
	
	function newscol_delete()
	{  
	    $Submit=$this->_request("Submit");
		$col_state=$this->_request("State");
		$model = M("col_news");//获取当期模块的操作对象 
		$id = $_POST['nCID']; 
		$this->colnewsdelete($id, $Submit,$col_state);
	}
	function imgnewscol_delete()
	{  
	    $Submit=$this->_request("Submit");
		$colstate=$this->_request("State");
		$model = M("col_news");//获取当期模块的操作对象 
		$id = $_POST['nCID']; 
        $this->colnewsdelete($id,$Submit,$colstate);
	}
	function osUserList()
	{
	   $ffaID=$_REQUEST["ffaID"];
	   $faID=1;
	   $TheObj =new Model('madmin');//实例化模型类
		if(!empty($ffaID))
		{
			$map['SysU_flag']=$faID;
		}
	    import("ORG.Util.Page"); //导入分页类
	    $count = $TheObj->where($map)->count();    //计算总数
		$p = new Page ($count,20);
		$p->setConfig('header','条信息'); 
		$p->setConfig('prev',"<"); 
		$p->setConfig('next','>'); 
		$p->setConfig('first','<<'); 
		$p->setConfig('last','>>'); 
		$page = $p->show ();
		$this->assign( "page", $page );
		$info_detail=$TheObj->where($map)->limit($p->firstRow.','.$p->listRows)->order('SysU_CearTime desc,SysU_ID  asc')->select(); //查询
	   $this->assign('info_detail',$info_detail);//根据模板变量赋值
	   $this->display("osUserList");
	}
	
	
	function osUserCreate()//会员中心
	{
	
	    $submitact=$this->_request("Save");
		$id=$this->_request("id");
		$m=M("madmin");
		$s_menu=M("s_menu");
		$Theobj=M("madmin");
		$Datas['MState']=1;
		$Datas['Mrole']=1;		
		$SysU_State=1;
		$Datacheck=$s_menu->where($Datas)->select();
		$this->assign('Datacheck',$Datacheck);
		switch($submitact)
	   {
	   	  case "Add": 
		  		$buttonvalue="保存用户";
				$this->assign('buttonvalue',$buttonvalue);
				$this->assign('SysU_State',$SysU_State);
				$this->assign('submitact',$submitact);
		         break;
		 
		  case "Edit": 
		  		$buttonvalue="修改用户";
				$this->assign('buttonvalue',$buttonvalue);
				$this->assign('submitact',$submitact);
				if(!empty($id))
				 { 
				    $this->assign('id',$id);
					$contion["SysU_ID"]=$id;
					$madmin=$Theobj->where($contion)->find(); //查询
					$menu_data=$m->where($contion)->select(); //查询
					$SysU_State=$menu_data[0]['SysU_State'];	
					$SysU_Role=$menu_data[0]['SysU_Role'];	
					$this->assign('SysU_Role',$SysU_Role);
					$this->assign('SysU_State',$SysU_State);
					$this->assign('madmin',$madmin);
				 }

		         break;
		}
		
		$this->display("osUserCreate");
	}
	
	function add_user()
	{
		$Submit=$this->_request("action");
		$OSName=$this->_request("OSName");
		$OSPass=md5($this->_request("OSPass"));
		$OSEmail=$this->_request("OSEmail");
		$OSTel=$this->_request("OSTel");
		$OSState=$this->_request("OSState");
		$sys_role=implode(",",$_POST["sys_role"]);
		$isPass=$this->_request("isPass");
		$Odatetime=date("Y-m-d" ,time());
		$contion["SysU_Username"]=$OSName;
		$hy=M("Madmin");
		$Madmin=M("Madmin");
		$where["SysU_Username"]=$OSName;
		$where["SysU_Password"]=$OSPass;
		$where["SysU_Role"]=$sys_role;
		$where["SysU_Email"]=$OSEmail;
		$where["SysU_tel"]=$OSTel;
		$where["SysU_State"]=$OSState;
		$where["SysU_CearTime"]=$Odatetime;
		$datarows=$hy->where($contion)->limit(1)->select();
		switch($Submit)
		{
			case 'Add':
			 if($datarows)
			   {
				   echo("<script>alert('对不起,该会员已经注册,请重新注册!');</script>");
		          $this->redirect('TeachInfo/zhuce_teh');//注册失败以后重新定向
			   } 
			   else
			   {
					  $Madmin->add($where);
					  echo "<script>alert('会员添加成功!');</script>";
		      		  $this->redirect("/Sys/osUserList?ffaID=1");
			   }
			   break;
			case "Edit":
			  $id=$this->_request("id");
			  if(!empty($id))
			  {
				  $contion["SysU_ID"]=$id;
				  $Data["SysU_Username"]= $OSName;
				  $Data["SysU_Email"]= $OSEmail;
				  $Data["Col_Order"]= $ColOrder;
				  $Data["SysU_tel"]= $OSTel;
				  $Data["SysU_Role"]= $sys_role;
				  $Data["SysU_State"]= $OSState;
				  
				  if($isPass==1)
				  {
				  	$Data["SysU_Password"]= $OSPass;
				  }
				  $Mlist=$hy->where($contion)->data($Data)->save();
				  if($Mlist!==false) 
					{ 
						 echo "<script>alert('数据修改成功!');</script>";
		      			 $this->redirect("/Sys/osUserList?ffaID=1");
					}
					else
					{ 
						$this->error('数据更新失败！'); 
					} 
			    }
			   break;
		}
	}
	
	function user_delete()
	{  
	    $Submit=$this->_request("Submit");
		$data["SysU_State"]=$this->_request("NweState");
		$model = M("madmin");//获取当期模块的操作对象 
		$id = $_POST['nCID']; 
		//判断id是数组还是一个 
		if(is_array($id))
		{ 
			$where = 'SysU_ID in('.implode(',',$id).')'; 
		}
		else{ 
			$where = 'SysU_ID='.$id; 
		} 
		switch ($Submit)
		{
			case '批量删除':
				
				
				$list=$model->where($where)->delete(); 
				if($list!==false) 
				{ 
					$this->success("成功删除{$list}条！"); 
				}
				else{ 
					$this->error('删除失败！'); 
				} 
			break;
			case '状态更改':
				$list=$model->where($where)->data($data)->save();
				if($list!==false) 
				{ 
					$this->success("成功更新{$list}条！"); 
				}
				else
				{ 
					$this->error('数据更新失败！'); 
				} 
			   break;
		}
	}
	
	function guest_list()
	{
	   $ffaID=$this->_request("ffaID");
	   $TheObj =new Model('guestbook');//实例化模型类
		if(!empty($ffaID))
		{
			$map['Gtype']=$ffaID;
		}
	    import("ORG.Util.Page"); //导入分页类
	    $count = $TheObj->where($map)->count();    //计算总数
		$p = new Page ($count,20);
		$p->setConfig('header','条信息'); 
		$p->setConfig('prev',"<"); 
		$p->setConfig('next','>'); 
		$p->setConfig('first','<<'); 
		$p->setConfig('last','>>'); 
		$page = $p->show ();
		$this->assign( "page", $page );
		$info_detail=$TheObj->where($map)->limit($p->firstRow.','.$p->listRows)->order('GTime desc')->select(); //查询
	   $this->assign('info_detail',$info_detail);//根据模板变量赋值
	   $this->display("guest_list");
	}
	
	
	function guest_delete()
	{  
	    $Submit=$this->_request("Submit");
		$data["GState"]=$this->_request("State");
		$model = M("guestbook");//获取当期模块的操作对象 
		$id = $_POST['nCID']; 
		//判断id是数组还是一个 
		if(is_array($id))
		{ 
			$where = 'GID in('.implode(',',$id).')'; 
		}
		else{ 
			$where = 'GID='.$id; 
		} 
		switch ($Submit)
		{
			case '批量删除':
				
				
				$list=$model->where($where)->delete(); 
				if($list!==false) 
				{ 
					$this->success("成功删除{$list}条！"); 
				}
				else{ 
					$this->error('删除失败！'); 
				} 
			break;
			case '状态更新':
				$list=$model->where($where)->data($data)->save();
				if($list!==false) 
				{ 
					$this->success("成功更新{$list}条！"); 
				}
				else
				{ 
					$this->error('数据更新失败！'); 
				} 
			   break;
		}
	}
	
	function guest_show()
	{
		$id=$this->_request("id");
		$Theobj=M("guestbook");
		$contion["GID"]=$id;
		$menu_info=$Theobj->where($contion)->find(); //查询
	    $this->assign('menu_info',$menu_info);
		$this->display("guest_show");
	}
	
	////广告管理
	function ad_list()
	{
	   $ffaID=$this->_request("ffaID");
	   $this->assign('ffaID',$ffaID);
	   $s_menu=M('s_menu');
	   $contion['MID']=$ffaID;
	   $smenu=$s_menu->where($contion)->find(); //查询
	   if($smenu)
	     {
	    	$this->assign('smenu',$smenu);
	     }
	   $TheObj =new Model('link');//实例化模型类
		if(!empty($ffaID))
		{
			$map['FType']=$ffaID;
		}
	    import("ORG.Util.Page"); //导入分页类
	    $count = $TheObj->where($map)->count();    //计算总数
		$p = new Page ($count,20);
		$p->setConfig('header','条信息'); 
		$p->setConfig('prev',"<"); 
		$p->setConfig('next','>'); 
		$p->setConfig('first','<<'); 
		$p->setConfig('last','>>'); 
		$page = $p->show ();
		$this->assign( "page", $page );
		$info_detail=$TheObj->where($map)->limit($p->firstRow.','.$p->listRows)->order('FID  desc')->select(); //查询
	   $this->assign('info_detail',$info_detail);//根据模板变量赋值
	   $this->display("ad_list");
	}
	
	function ad_create()
	{	
		$submitact=$this->_request("Save");
		$id=$this->_request("id");
		$ffaID=$this->_request("ffaID");
	    $this->assign('ffaID',$ffaID);
		$m=M("link");
		$s_menu=M("link");
		$Theobj=M("link");
		$FState=1;
		$smenudata=M("s_menu");
		$MID="MID";
	    $ftype=1;
	   $this->getfilenames($ftype,$ffaID,$MID);
		$Datacheck=$s_menu->where($Datas)->select();
		
		$this->assign('Datacheck',$Datacheck);
		switch($submitact)
	   {
	   	  case "Add": 
		  		$buttonvalue="保存";
				$this->assign('buttonvalue',$buttonvalue);
				$this->assign('FState',$FState);
				$this->assign('submitact',$submitact);
		         break;
		  case "Edit": 
		  		$buttonvalue="修改";
				$this->assign('buttonvalue',$buttonvalue);
				$this->assign('submitact',$submitact);
				if(!empty($id))
				 { 
				    $this->assign('id',$id);
					$contion["FID"]=$id;
					$madmin=$Theobj->where($contion)->find(); //查询
					$menu_data=$m->where($contion)->select(); //查询
					$FState=$menu_data[0]['FState'];	
					$FOrder=$menu_data[0]['FOrder'];	
					$this->assign('FState',$FState);
					$this->assign('FOrder',$FOrder);
					$this->assign('madmin',$madmin);
				 }
		         break;
		}
	  $this->display();
	}
	function ad_delete()
	{
		$Submit=$this->_request("Submit");
		$data["FState"]=$this->_request("State");
		$model = M("link");//获取当期模块的操作对象 
		$id = $_POST['nCID']; 
		//判断id是数组还是一个 
		if(is_array($id))
		{ 
			$where = 'FID  in('.implode(',',$id).')'; 
		}
		else{ 
			$where = 'FID='.$id; 
		} 
		switch ($Submit)
		{
			case '批量删除':
				
				
				$list=$model->where($where)->delete(); 
				if($list!==false) 
				{ 
					$this->success("成功删除{$list}条！"); 
				}
				else{ 
					$this->error('删除失败！'); 
				} 
			break;
			case '状态更新':
				$list=$model->where($where)->data($data)->save();
				if($list!==false) 
				{ 
					$this->success("成功更新{$list}条！"); 
				}
				else
				{ 
					$this->error('数据更新失败！'); 
				} 
			   break;
		}
	}
	//友情链接管理
	function links_list()
	{
	   $ffaID=$this->_request("ffaID");
	   $this->assign('ffaID',$ffaID);
	   $language=$_REQUEST["Language"];
	    if(empty($language))
	   {
	   		$i_language=1;
	   }
	   else
	   {
	   		 $i_language=$_REQUEST["Language"];
	   }
	   $s_menu=M('s_menu');
	   $contion['MID']=$ffaID;
	   $smenu=$s_menu->where($contion)->find(); //查询
	   if($smenu)
	     {
	    	$this->assign('smenu',$smenu);
	     }
	   $TheObj =new Model('link');//实例化模型类
		if(!empty($ffaID))
		{
			$map['FType']=$ffaID;
		}
	    import("ORG.Util.Page"); //导入分页类
	    $count = $TheObj->where($map)->count();    //计算总数
		$p = new Page ($count,20);
		$p->setConfig('header','条信息'); 
		$p->setConfig('prev',"<"); 
		$p->setConfig('next','>'); 
		$p->setConfig('first','<<'); 
		$p->setConfig('last','>>'); 
		$page = $p->show ();
		$this->assign( "page", $page );
		$info_detail=$TheObj->where($map)->limit($p->firstRow.','.$p->listRows)->order('FID  desc')->select(); //查询
	   $this->assign('info_detail',$info_detail);//根据模板变量赋值
	   $this->assign('i_language',$i_language);
	   $this->display("links_list");
	}
	//友情链接删除
	function links_delete()
	{
		$Submit=$this->_request("Submit");
		$data["FState"]=$this->_request("State");
		$model = M("link");//获取当期模块的操作对象 
		$id = $_POST['nCID']; 
		//判断id是数组还是一个 
		if(is_array($id))
		{ 
			$where = 'FID  in('.implode(',',$id).')'; 
		}
		else{ 
			$where = 'FID='.$id; 
		} 
		switch ($Submit)
		{
			case '批量删除':
				
				
				$list=$model->where($where)->delete(); 
				if($list!==false) 
				{ 
					$this->success("成功删除{$list}条！"); 
				}
				else{ 
					$this->error('删除失败！'); 
				} 
			break;
			case '状态更新':
				$list=$model->where($where)->data($data)->save();
				if($list!==false) 
				{ 
					$this->success("成功更新{$list}条！"); 
				}
				else
				{ 
					$this->error('数据更新失败！'); 
				} 
			   break;
		}
	}
	
	//友情链接修改
	
	function links_create()
	{	
		$submitact=$this->_request("Save");
		$id=$this->_request("id");
		$ffaID=$this->_request("ffaID");
		$Language=$this->_request("Language");
	    $this->assign('ffaID',$ffaID);
		$this->assign('Language',$Language);
		$m=M("link");
		$s_menu=M("link");
		$Theobj=M("link");
		$FState=1;
		$smenudata=M("s_menu");
		$MID="MID";
	    $ftype=1;
	   $this->getfilenames($ftype,$ffaID,$MID);
		$Datacheck=$s_menu->where($Datas)->select();
		$this->assign('Datacheck',$Datacheck);
		switch($submitact)
	   {
	   	  case "Add": 
		  		$buttonvalue="保存";
				$this->assign('buttonvalue',$buttonvalue);
				$this->assign('FState',$FState);
				$this->assign('submitact',$submitact);
		         break;
		  case "Edit": 
		  		$buttonvalue="修改";
				$this->assign('buttonvalue',$buttonvalue);
				$this->assign('submitact',$submitact);
				if(!empty($id))
				 { 
				    $this->assign('id',$id);
					$contion["FID"]=$id;
					$madmin=$Theobj->where($contion)->find(); //查询
					$menu_data=$m->where($contion)->select(); //查询
					$FState=$menu_data[0]['FState'];
					$FPic=$menu_data[0]['FPic'];	
					$FOrder=$menu_data[0]['FOrder'];	
					$this->assign('FState',$FState);
					$this->assign('FPic',$FPic);
					$this->assign('FOrder',$FOrder);
					$this->assign('madmin',$madmin);
				 }
		         break;
		}
	  $this->display();
	}
	
//日志管理	
function log_list()
{
   $TheObj =new Model('loglogin');//实例化模型类
	import("ORG.Util.Page"); //导入分页类
	$count = $TheObj->count();    //计算总数
	$p = new Page ($count,20);
	$p->setConfig('header','条信息'); 
	$p->setConfig('prev',"<"); 
	$p->setConfig('next','>'); 
	$p->setConfig('first','<<'); 
	$p->setConfig('last','>>'); 
	$page = $p->show ();
	$this->assign("page", $page );
	$info_detail=$TheObj->limit($p->firstRow.','.$p->listRows)->order('LID   desc')->select(); //查询
   $this->assign('info_detail',$info_detail);//根据模板变量赋值
   $this->display("log_list");
}
function log_delete()
{

	$Submit=$this->_request("Submit");
	$data["FState"]=$this->_request("State");
	$model = M("loglogin");//获取当期模块的操作对象 
	$id = $_POST['nCID']; 
	
	//判断id是数组还是一个 
	if(is_array($id))
	{ 
		$where = 'LID  in('.implode(',',$id).')'; 
	}
	else{ 
		$where = 'LID='.$id; 
	} 
	switch ($Submit)
	{
		case '批量删除':
			
			
			$list=$model->where($where)->delete(); 
		
			if($list!==false) 
			{ 
				$this->success("成功删除{$list}条！"); 
			}
			else{ 
				$this->error('删除失败！'); 
			} 
		break;
	}
}
	public function imgupload()//uploadify 上传
	{
		$className="uploadify_upfile";
		import('@.Common.'.$className);
		if(class_exists($className, false))
		{
			$savepath=C("USER_PUBLISH");
			$targetPath=$savepath;
			$a=new uploadify_upfile($targetPath,'');
			$a->allowextend= array('jpg','png','gif'); 
	        //$a->max_width=600;//最大宽度 600px
			$a->fileUpload();
		}
	}
	
	
	function ad_add()
	{
	   
		 $sbutton=$this->_request("action");
		 $Name=$this->_request("Name");
		 $Url=$this->_request("Url");
		 $IsShow=$this->_request("IsShow");
		 $POrder=$this->_request("POrder");
		 $ffaIDs=$this->_request("ffaIDs");
		 $link=M("link");
		  switch($sbutton)
		  {
		    ///添加信息内容
		  	case "Add":
		 	  $data["FName"]= $Name;
		      $data["FState"]= $IsShow;
			  $data["FType"]= $ffaIDs;
		      $data["Furl"]= $Url;
		      $data["FOrder"]= $POrder;
		      $res=$link->add($data);
			   self::add_login($Name,$Url,$type="添加");
		      echo "<script>alert('添加成功');window.location.href='/Sys/ad_list?ffaID=".$ffaIDs."'</script>";
			  break;
			case "Edit":
			  $id=$this->_request("id");
			  if(!empty($id))
			  {
				  $contion["FID"]=$id;
				  $Data["FName"]= $Name;
				  $Data["FState"]= $IsShow;
				  $Data["Furl"]= $Url;
				  $Data["FOrder"]= $POrder;
				  $Mlist=$link->where($contion)->data($Data)->save();
				  if($Mlist!==false) 
					{  
					      self::add_login($Name,$Url,$type="修改");
						 echo "<script>alert('数据修改成功!');window.location.href='/Sys/ad_list?ffaID=".$ffaIDs."'</script>";
					}
					else
					{ 
						$this->error('数据更新失败！'); 
					} 
			    }
			   break;
		  } 
	}
//	
function link_add()
	{
	   
		 $sbutton=$this->_request("action");
		 $Name=$this->_request("Name");
		 $Url=$this->_request("Url");
		 $IsShow=$this->_request("IsShow");
		 $POrder=$this->_request("POrder");
		 $ffaIDs=$this->_request("ffaIDs");
		 $link=M("link");
		  switch($sbutton)
		  {
		    ///添加信息内容
		  	case "Add":
		 	  $data["FName"]= $Name;
		      $data["FState"]= $IsShow;
			  $data["FType"]= $ffaIDs;
		      $data["Furl"]= $Url;
		      $data["FOrder"]= $POrder;
		      $res=$link->add($data);
			   self::add_login($Name,$Url,$type="添加");
		      echo "<script>alert('添加成功');window.location.href='/Sys/ad_list?ffaID=".$ffaIDs."'</script>";
			  break;
			case "Edit":
			  $id=$this->_request("id");
			  if(!empty($id))
			  {
				  $contion["FID"]=$id;
				  $Data["FName"]= $Name;
				  $Data["FState"]= $IsShow;
				  $Data["Furl"]= $Url;
				  $Data["FOrder"]= $POrder;
				  $Mlist=$link->where($contion)->data($Data)->save();
				  if($Mlist!==false) 
					{ 
					      self::add_login($Name,$Url,$type="修改");
						 echo "<script>alert('数据修改成功!');window.location.href='/Sys/ad_list?ffaID=".$ffaIDs."'</script>";
					}
					else
					{ 
						$this->error('数据更新失败！'); 
					} 
			    }
			   break;
		  } 
	}	
//友情链接添加
function linkadd()
	{
	   
		 $sbutton=$this->_request("action");
		 $Name=$this->_request("Name");
		 $Url=$this->_request("Url");
		 $IsShow=$this->_request("IsShow");
		 $POrder=$this->_request("POrder");
		 $ffaIDs=$this->_request("ffaIDs");
		 $Language=$this->_request("Language");
		  if (!empty($_FILES)) 
		  { 
		  	$uploads = $this->_upload();
			if (!empty($uploads['image'])){
				$fpic = $uploads['image']; 
			}
		  }
		 
		 $link=M("link");
		  switch($sbutton)
		  {
		    ///添加信息内容
		  	case "Add":
		 	  $data["FName"]= $Name;
		      $data["FState"]= $IsShow;
			  $data["FType"]= $ffaIDs;
		      $data["Furl"]= $Url;
			  $data["FPic"]= $fpic;
		      $data["FOrder"]= $POrder;
			  $data["FLanguage"]=$Language;
		      $res=$link->add($data);
			   self::add_login($Name,$Url,$type="添加");
		      echo "<script>alert('数据添加成功');window.location.href='/Sys/links_list?ffaID=".$ffaIDs."'</script>";
			  break;
			case "Edit":
			  $id=$this->_request("id");
			  if(!empty($id))
			  {
				  $contion["FID"]=$id;
				  $Data["FName"]= $Name;
				  $Data["FState"]= $IsShow;
				  $Data["Furl"]= $Url;
				  if(!empty($fpic))
				  {
				  	$Data["FPic"]= $fpic;
				  }
				  $Data["FOrder"]= $POrder;
				  $Mlist=$link->where($contion)->data($Data)->save();
				  if($Mlist!==false) 
					{ 
					      self::add_login($Name,$Url,$type="修改");
						 echo "<script>alert('数据修改成功!');window.location.href='/Sys/links_list?ffaID=".$ffaIDs."'</script>";
					}
					else
					{ 
						$this->error('数据更新失败！'); 
					} 
			    }
			   break;
		  } 
	}		
//$table 是数据库的表名,$tableid是传递参数id $tableids数据库字段对应id
function getfilenames($ftype,$tableid,$tableids)
{
   switch($ftype)
   {
        case "1":
			$smenudata=M("s_menu");
			$contion[$tableids]=$tableid;
			$datas=$smenudata->where($contion)->find(); 
		 	//dump($datas);
			$this->assign('datas',$datas);
		 break;
		  case "2":
			$smenudata=M("main_menu");
			$contion[$tableids]=$tableid;
			$datas=$smenudata->where($contion)->find(); 
			$this->assign('datas',$datas);
		 break;
		  case "3":
			$smenudata=M("main_menu");
			$contion[$tableids]=$tableid;
			$datas1=$smenudata->where($contion)->find(); 
			$this->assign('datas1',$datas1);
		 break;
	}
}

//日志写入数据公共方法
function add_login($ColTitle,$content1,$type)
{
	
     //写入日志
	  $loglogin=M("loglogin");
	  $logdata['Ltitle']=$ColTitle;
	  $logdata['Lcon']=$content1;
	  $logdata['LName']=$_SESSION["username"];
	  $logdata['LIP']=get_client_ip();
	  $logdata['LTime']=date("Y-m-d h:i:s" ,time());
	  $logdata['Ltype']=$type;
	  $loglogin->add($logdata);

}


//删除main_menu数据公共方法
function mainmenu_delete($id,$Submit,$Main_State)
{ 
       $model = M("main_menu");//获取当期模块的操作对象 
		if(is_array($id))	//判断id是数组还是一个
		{ 
			$where = 'Main_ID in('.implode(',',$id).')'; 
		}
		else{ 
			$where = 'Main_ID='.$id; 
		} 
		switch ($Submit)
		{
			case '批量删除': 
				$list=$model->where($where)->delete(); 
				if($list!==false) 
				{ 
				  $this->success("成功删除{$list}条！"); 
				}
				else
				{ 
					$this->error('删除失败！'); 
				} 
			break;
			case '状态更新':
			    $data["Main_State"]=$Main_State;
				$list=$model->where($where)->data($data)->save();
				if($list!==false) 
				{ 
				    //写入日志
					$this->success("成功更新{$list}条！"); 
				}
				else
				{ 
					$this->error('数据更新失败！'); 
				} 
			   break;
		}
}
	
///删除col_news数据操作
function colnewsdelete($id,$Submit,$col_state)
{
        $model = M("col_news");//获取当期模块的操作对象 
	    //判断id是数组还是一个 
		if(is_array($id))
		{ 
			$where = 'Col_ID in('.implode(',',$id).')'; 
		}
		else{ 
			$where = 'Col_ID='.$id; 
		} 
		switch ($Submit)
		{
			case '批量删除':
				$list=$model->where($where)->delete(); 
				if($list!==false) 
				{ 
					$this->success("成功删除{$list}条！"); 
				}
				else{ 
					$this->error('删除失败！'); 
				} 
			    break;
			case '状态更新':
			     $data["Col_State"]=$col_state;
				$list=$model->where($where)->data($data)->save();
				if($list!==false) 
				{ 
					$this->success("成功更新{$list}条！"); 
				}
				else
				{ 
					$this->error('数据更新失败！'); 
				} 
			   break;
		}
}

//	//图片上传
	protected function _upload() 
	{ 
	  
        import('rbac');
        //导入上传类
        $upload = new UploadFile();
		
        //设置上传文件大小 
        $upload->maxSize = 3292200; 
        //设置上传文件类型 
        $upload->allowExts = explode(',', 'jpg,gif,png,jpeg,rar,zip,txt,swf,flv,avi'); 
        //设置附件上传目录 
        $upload->savePath = './web/Public/Uploads/'; 
        //设置需要生成缩略图，仅对图像文件有效 
        $upload->thumb = false;  //是否需要对图片文件进行缩略图处理，默认为false

        // 设置引用图片类库包路径 ORG.Util.UploadFile
        //$upload->imageClassPath = 'ORG.Util.Image'; 
        //设置需要生成缩略图的文件后缀 
      //  $upload->thumbPrefix = 'm_,s_';  //生产2张缩略图 
        //设置缩略图最大宽度 
       // $upload->thumbMaxWidth = '400,100'; //缩略图的最大宽度，多个使用逗号分隔

        //设置缩略图最大高度 
       // $upload->thumbMaxHeight = '400,1000'; //缩略图的最大高度，多个使用逗号分隔

        //设置上传文件规则 
        $upload->saveRule = uniqid; 
        //删除原图 
        $upload->thumbRemoveOrigin = true; 
		
		
        if (!$upload->upload())
		 { 
            //捕获上传异常 
            $this->error($upload->getErrorMsg()); 
        }
		 else 
		{ 
            //取得成功上传的文件信息 
            $uploadList = $upload->getUploadFileInfo(); 
            import("@.ORG.Image"); 
            //给m_缩略图添加水印, Image::water('原文件名','水印图片地址') 
             //Image::water($uploadList[0]['savepath'].'m_'.$uploadList[0]['savename'], 'Public/Images/logo2.png'); 
             $uploads['image'] = $uploadList[0]['savename']; 
			$uploads['fujian'] = $uploadList[1]['savename'];
        } 
        
		return $uploads; 
		
    } 	
	
//导出数据到excel
	function export_excel()
	{
		$data= M('loglogin')->select();   //查出数据
		export_csv($data);
		//var_dump($data);
	}
//excel数据导入到数据库
function join_excel()
{
	require_once './web/Lib/Action/Excel/reader.php';    
	$data = new Spreadsheet_Excel_Reader();   
	$data->setOutputEncoding('utf-8');  
	$conn= mysql_connect('localhost','root','manage_data') or die("Can not connect to database.");    
	mysql_query("set names 'utf-8'");//设置编码输出  
	mysql_select_db('manage_data'); //选择数据库  
		if($_POST['Submit'])  
		{  
			$data->read($_POST['file']);  
			for ($i = 1; $i <= $data->sheets[0]['numRows']; $i++) 
			{  
			  $sql = "INSERT INTO loglogin VALUES(null,'".$data->sheets[0]['cells'][$i][1]."')";   
			  $query=mysql_query($sql);  
				if($query)  
				{  
					echo "<script type='text/javascript'>alert('数据导入成功');</script>";  
				 }
				 else
				 {  
					 echo "<script type='text/javascript'>alert('数据导入失败');</script>";  
				 }  
			}  
		}  
	}
}