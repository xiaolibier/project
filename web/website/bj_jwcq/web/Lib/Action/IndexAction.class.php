
<?php
// 本类由系统自动生成，仅供测试用途
class IndexAction extends Action 
{



    function leftabout()
	{
	    echo("aa");
	    $main_menu=M("main_menu");
		$contion["Main_Father"]=27;
		$contion["Main_Type"]=array('in','1,3');
		$contion["Main_State"]=1;
		$data=$main_menu->where($contion)->order('Main_Order asc')->select();
		$this->assign('data',$data);
		$this->display();
	}
    public function index()
	{
       //$aa=M("news");
	  // $data=$aa->select();
	   //var_dump($data);
    } 
	function plogin()
	{
		$this->display();
	}
	
	
	function login()
	{
	 
		$this->display();
	}
	
	
	function about()
	{
	 
     // $this->assign('content',"11111");
	  
	  $cate=M("cate");
	  $c["pid"]=342;
	  
	  $mrows=$cate->where($c)->select();
	  if($mrows)
	  {
	  	$this->assign('list',$mrows);
	  }
		$this->display();
		
	}
	
	function logindeal()
	{
	   header("Content-Type:text/html; charset=UTF-8");
		$username=$this->_request("username");
		$upw=md5($_POST["userpwd"]);
		$useremail=$_POST["useremail"];
		$utel=$_POST["utel"];
		$uaddress=$_POST["uaddress"];
		$dao=M("hy");
		$data["mname"]=$username;
		$data["mpwd"]=$upw;
		$data["muemail"]=$useremail;
		$data["mtel"]=$utel;
		$data["maddress"]=$uaddress;
		$res1=$dao->field("mid")->limit(1)->select();
		if(!$res1)
		{
			$res=$dao->add($data);
			echo "<script>alert('恭喜您会员注册成功');</script>";
			$this->redirect("/index.php/Index/plogin");
		}
		else
		{
			echo "<script>alert('该会员已经注册');</script>";
			$this->redirect("/index.php/Index/plogin");
		}
	}
	
	
	function dealogin()
	{
	
	//$User = M("User"); // 实例化User对象

//$map['name'] = 'thinkphp';

//$map['status'] = 1;

// 把查询条件传入查询方法

//$User->where($map)->select(); 


	
	
		$unames=$this->_request("unames");
		$upwds=md5($this->_request("upwds"));
		$member=M("hy");
		
		$m["mname"]=$unames;
		$m["mpwd"]=$upwds;
		
		$rows=$member->where($m)->select();
		if($rows)
		{
		   $_SESSION["username"]=$unames;
			echo "<script>alert('恭喜您登陆成功');</script>";
			$this->redirect("/index.php/Index/plogin");
		}
		else
	    {
		   echo "<script>alert('登陆失败,请重新登陆');</script>";
			$this->redirect("/index.php/Index/login");
		}
	}
}
?>