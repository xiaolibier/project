<?php

header("Content-Type:text/html; charset=UTF-8");

class AboutusAction extends Action 
{
	public function _initialize()
	{
		$admin=$_SESSION["username"];
		if(empty($admin))
		{
			$this->redirect("__APP__/Admin/Sys/login");
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
		if(!empty($ffaID))
		{
			$map['Main_Father']=$faID;
		}
	   $map['Main_Language']=$i_language;
	   self::main_menupage($map);
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
	   if($ffaID<> $faID)
	   {
	   		$this->getfilenames($ftype=3,$faID, $MID="Main_ID");
			$locationstr=">";
	   }
	   else
	   {
	   		$locationstr="";
	   }
	    $this->assign('locationstr',$locationstr);
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
		 $main_name =getmain_names($faID);
		 $fmain_name=getmain_names($ffaID);
		 if($ffaID<>$faID)
		 {
		 	 $ustate=$fmain_name.'>>'.$main_name;
		 }
		 else
		 {
		 	 $ustate=$fmain_name;
		 }
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
			  add_login($ColName,$ustate,$content1,$type="添加");
		      echo "<script>alert('信息添加成功!');window.location.href='/Admin/Aboutus/caselist?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."';</script>";
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
				  add_login($ColName,$ustate,$content1,$type="修改");
				  $Mlist=$main_menu->where($contion)->data($Data)->save();
				  if($Mlist!==false) 
					{ 
						 echo "<script>alert('数据修改成功!');window.location.href='/Admin/Aboutus/caselist?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."';</script>";
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
	   $Col_Title=$this->_request("Col_Title");
	   $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   $this->getfilenames($ftype=3,$faID, $MID="Main_ID");
	   $main_father=getmain_id($faID);
	   if($main_father<> $ffaID)
	   {
	   		$main_names=getmain_names($main_father)." > ";
	   }
		if(!empty($ffaID))
		{
			$map['Col_MenuID']=$faID;
		}
		
		if(!empty($Col_Title))
		{
			 $map['Col_Title']=array('like',"%$Col_Title%");
		}
		$map['Col_Language']=$language;
		self::col_newspage($map,$Col_Title);
	   $this->assign('main_names', $main_names);
	   $this->assign('main_father', $main_father);
	   $this->assign('ffaID', $ffaID);
	   $this->assign('language',$language);
	   $this->assign('faID', $faID);
	   $this->display("caseimgNewsList");
}
function imgnewscolcreat_add()
{
		 $uploads = $this->_upload();
		 $ttedu_pic = $uploads['image']; 
		 $ttedu_fujian = $uploads['fujian']; 
		 $sbutton=$this->_request("Submit");
		 $ffaID=$this->_request("ffaids");
		 $faID=$this->_request("col_menuid");
		  $main_name =getmain_names($faID);
		 $fmain_name= getmain_names($ffaID);
		 if($ffaID<>$faID)
		 {
		 	 $ustate=$fmain_name.'>>'.$main_name;
		 }
		 else
		 {
		 	 $ustate=$fmain_name;
		 }
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
			  add_login($ColTitle,$ustate,$content1,$type="添加");
		      $res=$col_news->add($data);
		      echo "<script>alert('添加成功');window.location.href='/Admin/Aboutus/caseimgNewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."'</script>";
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
						  add_login($ColTitle,$ustate,$content1,$type="修改"); 
						  echo "<script>alert('数据修改成功!');window.location.href='/Admin/Aboutus/caseimgNewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."'</script>";
					}
					else
					{ 
						$this->error('数据更新失败！'); 
					} 
			    }
			   break;
		  } 
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
	   $main_father=getmain_id($faID);
	   if($main_father<> $ffaID)
	   {
	   		$main_names=getmain_names($main_father)." > ";
	   }
	   $this->assign('main_father',$main_father);
	   $this->assign('main_names',$main_names);
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
	   $Col_Title=$this->_request("Col_Title");
	   $this->getfilenames($ftype=2,$ffaID, $MID="Main_ID");
	   $this->getfilenames($ftype=3,$faID, $MID="Main_ID");
	   $main_father=getmain_id($faID);
	   if($main_father<> $ffaID)
	   {
	   		$main_names=getmain_names($main_father).">";
	   }
		if(!empty($ffaID))
		{
			$map['Col_MenuID']=$faID;
		}
		if(!empty($Col_Title))
		{
			 $map['Col_Title']=array('like',"%$Col_Title%");
		}
	   $map['Col_Language']=$language;
	   self::col_newspage($map,$Col_Title);
	   $this->assign('ffaID', $ffaID);
	   $this->assign('main_father',$main_father);
	   $this->assign('main_names', $main_names);
	   $this->assign('Col_Title',$Col_Title);
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
	   $main_father=getmain_id($faID);
	   if($main_father<> $ffaID)
	   { 
	   		$main_names=getmain_names($main_father)." > ";
	   }
	   $nickname = $model->where('main_id="'.$faID.'"')->getField('Main_Name'); 
	   $nicknames=$model->where('main_id="'.$ffaID.'"')->getField('Main_Name'); 
	   $this->assign('nickname',$nickname);
	   $this->assign('main_father',$main_father);
	   $this->assign('language',$language);
	   $this->assign('nicknames',$nicknames);
	   $this->assign('main_names',$main_names);
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
		 $uploads = $this->_upload();
		 $ttedu_pic = $uploads['image']; 
		 $ttedu_fujian = $uploads['fujian']; 
		 $sbutton=$this->_request("Submit");
		 $ffaID=$this->_request("ffaids");
		 $language=$this->_request("Language");
		 $faID=$this->_request("col_menuid");
		 $main_name =getmain_names($faID);
		 $fmain_name= getmain_names($ffaID);
		 $main_father=getmain_id($faID);
		 $smain_name=getmain_names($main_father);
		 $ustate=$fmain_name.'>>'.$main_name;
		 if($main_father<>"27")
		 {
		 	$ustate=$fmain_name.'>>'.$smain_name.'>>'.$main_name;
		 }
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
			   add_login($ColTitle, $ustate,$content1,$type="添加");
		      echo "<script>alert('数据添加成功!');window.location.href='/Admin/Aboutus/caseNewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."'</script>";
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
						  add_login($ColTitle, $ustate,$content1,$type="修改");
						  echo "<script>alert('数据修改成功!');window.location.href='/Admin/Aboutus/caseNewsList?ffaID=".$ffaID."&faID=".$faID."&Language=".$language."';</script>";
					}
					else
					{ 
						$this->error('数据更新失败！'); 
					} 
			    }
			   break;
		  } 
}
function news_delete()
{  
	$Submit=$this->_request("Submit");
	$mainstate=$this->_request("State");
	$fid=$this->_request("fid");
	$id = $_POST['nCID'];
	$Language=$this->_request("Language");
	$faID=$this->_request("faID");
	$main_name =getmain_names($fid);  
	$this->mainmenu_delete($id,$Submit,$mainstate);
}	
function newscol_delete()
{  
	$Submit=$this->_request("Submit");
	$col_state=$this->_request("State");
	$faID=$this->_request("faID");
	$ffaID=$this->_request("ffaID");
	$main_name =getmain_names($faID);
	$fmain_name= getmain_names($ffaID);
	$ustate=$fmain_name.'>>'.$main_name;
	$model = M("col_news");//获取当期模块的操作对象 
	$id = $_POST['nCID']; 
	$this->colnewsdelete($id, $Submit,$col_state,$ustate);
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
///删除col_news数据操作  self::add_login($ColTitle,$content1,$type="添加");
function colnewsdelete($id,$Submit,$col_state,$main_name)
{
        $model = M("col_news");//获取当期模块的操作对象 
	    //判断id是数组还是一个 
		if(is_array($id))
		{ 
			$where = 'Col_ID in('.implode(',',$id).')'; 
			foreach($id as $k=>$v) 
			{	
			   $fname=$fname.'-'.$model->where('Col_ID="'.$v.'"')->getField('Col_Title'); 		
			    if($k==0)
				{
		           $fname=$model->where('Col_ID="'.$v.'"')->getField('Col_Title'); 
				}
			}
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
				    add_login($fname,$main_name,'',$type="批量删除");
					$this->success("成功删除{$list}条！"); 
				}
				else
				{ 
				    add_login($fname,$main_name,'',$type="删除失败"); 
					$this->error('删除失败！'); 
				} 
			    break;
			case '状态更新':
			     $data["Col_State"]=$col_state;
				$list=$model->where($where)->data($data)->save();
				if($list!==false) 
				{ 
				    add_login($fname,$main_name,'',$type="状态更新");
					$this->success("成功更新{$list}条！"); 
				}
				else
				{ 
				    add_login($fname,$main_name,'',$type="状态更新失败");
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
//main_menu 数据分页调用函数	
function main_menupage($map)
{
    $TheObj =new Model('main_menu');//实例化模型类
	import("ORG.Util.Page"); //导入分页类
	$count = $TheObj->where($map)->count();    //计算总数
	$p = new Page ($count,20);
	$p->setConfig('header','条信息'); 
	$p->setConfig('prev',"<"); 
	$p->setConfig('next','>'); 
	$p->setConfig('first','<<'); 
	$p->setConfig('last','>>'); 
	$page = $p->show ();
	$info_detail=$TheObj->where($map)->limit($p->firstRow.','.$p->listRows)->order('main_order asc,Main_ID  desc')->select(); 
	$this->assign('info_detail',$info_detail);//根据模板变量赋值
	$this->assign( "page", $page );
}	
//col_news 数据分页调用函数
function col_newspage($map,$keys)
{
        $TheObj =new Model('col_news');//实例化模型类
	    import("ORG.Util.Page"); //导入分页类
	    $count = $TheObj->where($map)->count();    //计算总数
		$parameter = '&Col_Title='.urlencode($keys);
		$p = new Page ($count,20,$parameter);
		$p->setConfig('header','条信息'); 
		$p->setConfig('prev',"<"); 
		$p->setConfig('next','>'); 
		$p->setConfig('first','<<'); 
		$p->setConfig('last','>>'); 
		$page = $p->show ();
		$this->assign( "page", $page );
		$info_detail=$TheObj->where($map)->limit($p->firstRow.','.$p->listRows)->order('Col_Order asc,Col_Time  desc,Col_ID desc')->select(); //查询
	   $this->assign('info_detail',$info_detail);//根据模板变量赋值
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

