<?php

header("Content-Type:text/html; charset=UTF-8");
class LinksAction extends Action 
{

     public function _initialize()
	{
		$admin=$_SESSION["username"];
		if(empty($admin))
		{
			$this->redirect("__APP__/Admin/Sys/login");
		}
	}   
	//友情链接管理
	function links_list()
	{
	   $ffaID=$this->_request("ffaID");
	   $faID=$this->_request("faID");
	   $fid=$this->_request("fid");
	   $language=$_REQUEST["Language"];
	    if(empty($language))
	   {
	   		$i_language=1;
	   }
	   else
	   {
	   		 $i_language=$_REQUEST["Language"];
	   }
	   $col_news=M("col_news");
	   $main_menu=M("main_menu");
	  $Col_menuid =$col_news->where('Col_ID='.$faID.'')->getField('Col_menuid');
	  $mainname =$main_menu->where('Main_ID='.$Col_menuid.'')->getField('Main_Name');
	   $TheObj =new Model('link');//实例化模型类
		if(!empty($faID))
		{
			$map['FType']=$faID;
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
		$info_detail=$TheObj->where($map)->limit($p->firstRow.','.$p->listRows)->order('Forder asc,FID  desc')->select(); //查询
	   $this->assign('info_detail',$info_detail);//根据模板变量赋值
	   $this->assign('i_language',$i_language);
	    $this->assign('ffaID',$ffaID);
	   $this->assign('faID',$faID);
	   $this->assign('fid',$fid);
	   $this->assign('mainname',$mainname);
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
		$faID=$this->_request("faID");
		$fid=$this->_request("fid");
		 $col_news=M("col_news");
	   $main_menu=M("main_menu");
	  $Col_menuid =$col_news->where('Col_ID='.$faID.'')->getField('Col_menuid');
	  $mainname =$main_menu->where('Main_ID='.$Col_menuid.'')->getField('Main_Name');
		
		$Language=$this->_request("Language");
	    $this->assign('faID',$faID);
		$this->assign('Language',$Language);
		$this->assign('fid',$fid);
		$m=M("link");
		$s_menu=M("link");
		$Theobj=M("link");
		$FState=1;
		$smenudata=M("s_menu");
		$MID="MID";
	    $ftype=1;
	   $this->getfilenames($ftype,$faID,$MID);
		$Datacheck=$s_menu->where($Datas)->select();
		$this->assign('Datacheck',$Datacheck);
		$this->assign('mainname',$mainname);
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
	
//友情链接添加
function linkadd()
{
		 $sbutton=$this->_request("action");
		 $Name=$this->_request("Name");
		 $Url=$this->_request("Url");
		 $IsShow=$this->_request("IsShow");
		 $POrder=$this->_request("POrder");
		 $faID=$this->_request("faID");
		  $fid=$this->_request("fid");
		 $Language=$this->_request("Language");
		 $uploads = $this->_upload();
         $fpic = $uploads['image']; 
		 $link=M("link");
		  switch($sbutton)
		  {
		    ///添加信息内容
		  	case "Add":
		 	  $data["FName"]= $Name;
		      $data["FState"]= $IsShow;
			  $data["FType"]= $faID;
		      $data["Furl"]= $Url;
			   $data["Ftid"]= $fid;
			  $data["FPic"]= $fpic;
		      $data["FOrder"]= $POrder;
			  $data["FLanguage"]=$Language;
		      $res=$link->add($data);
			   self::add_login($Name,$Url,$type="添加");
		      echo "<script>alert('数据添加成功');window.location.href='/Admin/Links/links_list?faID=".$faID."&fid=".$fid."'</script>";
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
						echo "<script>alert('数据修改成功!');window.location.href='/Admin/Links/links_list?faID=".$faID."'</script>";
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

