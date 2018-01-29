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

function right()
{
	$info = array(
	 '操作系统'=>PHP_OS,
	 '运行环境'=>$_SERVER["SERVER_SOFTWARE"],
	 'PHP运行方式'=>php_sapi_name(),
	 'ThinkPHP版本'=>THINK_VERSION,
	 '上传附件限制'=>ini_get('upload_max_filesize'),
	 '执行时间限制'=>ini_get('max_execution_time').'秒',
	 '服务器时间'=>date("Y年n月j日 H:i:s"),
	 '北京时间'=>gmdate("Y年n月j日 H:i:s",time()+8*3600),
	 '服务器域名/IP'=>$_SERVER['SERVER_NAME'].' [ '.gethostbyname($_SERVER['SERVER_NAME']).' ]',
	 '剩余空间'=>round((disk_free_space(".")/(1024*1024)),2).'M',
	 );
	 
	 
	$this->assign('info',$info);
	$this->display();
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
				$m["MState"]=1;
              	$mrows[$key]['mdatas']=$s_menu->where($m)->order('MOrder asc,MID desc')->select();
				
			}
		}
		$this->assign('list', $mrows);
		$this->display("left");
    }
	//生成静态页方法
	function createhtml()
	{
		 if($this->_post('add')=="ok")
		{
		    $homeindex=A("Home/Index");
			$homeindex->top();
			$main_menu=M("main_menu");
			$id=$_REQUEST["id"];
			if(empty($id))
			{
			  $id =$homeindex->getfiles($mainfather="110",$maintype="1",$tops="1");
			}
			$where["Main_ID"]=$id;
			$datas=$main_menu->where($where)->find();
			if($datas)
			{
			   $this->assign('datas',$datas);
			}
			$contion["Main_Father"]=110;
			$contion["Main_Type"]=1;
			$contion["Main_State"]=1;
			$data=$main_menu->where($contion)->order('Main_Order asc')->select();
			$this->assign('data',$data);
			$this->buildHtml("service",HTML_PATH,'../Home/Index:service','utf8');//注意：这里的utf8不能写成utf-8
			if($data)
			{
				foreach($data as $key=>$val)
				{    ///Sys/aboutimgNewsList 
					 $this->assign('datas',$val);
					 $this->buildHtml($val["Main_ID"],HTML_PATH,'../Home/Index:service','utf8');//注意：这里的utf8不能写成utf-8	
				}
			}
		}
		$this->display();
	}
	
	

	
	
	
	
	
	
	
	
	

	



	
	
	
	
	
	
	
	
	
	//注销用户登录
	function logout()
	{
	  unset($_SESSION["username"]);
	  unset($_SESSION["userole"]);
	  $this->redirect("__APP__/Admin/Sys/login");
	}
	
	
	
	function admin_top()
	{     
	   $this->assign('admin', $_SESSION["username"]);
	   $this->display(); 
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

