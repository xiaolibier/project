<?php
header("Content-Type:text/html; charset=UTF-8");
class UserAction extends Action 
{

   public function _initialize()
	{
		$admin=$_SESSION["username"];
		if(empty($admin))
		{
			$this->redirect("__APP__/Admin/Sys/login");
		}
	}   
   function osUserList()
	{
	   $TheObj =new Model('member');//实例化模型类
	    import("ORG.Util.Page"); //导入分页类
	    $count = $TheObj->count();    //计算总数
		$p = new Page ($count,20);
		$p->setConfig('header','条信息'); 
		$p->setConfig('prev',"<"); 
		$p->setConfig('next','>'); 
		$p->setConfig('first','<<'); 
		$p->setConfig('last','>>'); 
		$page = $p->show ();
		$this->assign( "page", $page );
		$info_detail=$TheObj->limit($p->firstRow.','.$p->listRows)->order('MTime desc,MID  asc')->select(); //查询
	   $this->assign('info_detail',$info_detail);//根据模板变量赋值
	   $this->display("osUserList");
	}
function osUserCreate()//会员中心
	{
	    $submitact=$this->_request("Save");
		$id=$this->_request("id");
		$Theobj=M("member");
		$Datas['MState']=1;
		$MState=1;
		$usersex="男";
		switch($submitact)
	   {
	   	  case "Add": 
		  		$buttonvalue="保存用户";
				$this->assign('buttonvalue',$buttonvalue);
				$this->assign('MState',$MState);
				$this->assign('usersex',$usersex);
				$this->assign('submitact',$submitact);
		         break;
		 
		  case "Edit": 
		  		$buttonvalue="修改用户";
				$this->assign('buttonvalue',$buttonvalue);
				$this->assign('submitact',$submitact);
				if(!empty($id))
				 { 
				    $this->assign('id',$id);
					$contion["MID"]=$id;
					$madmin=$Theobj->where($contion)->find(); //查询
					$MState=$madmin['MState'];	
					$usersex=$madmin['MSex'];	
					$this->assign('MState',$MState);
					$this->assign('usersex',$usersex);
					$this->assign('madmin',$madmin);
				 }
		         break;
		}
		$this->display("osUserCreate");
	}
function add_user()
	{
		$Submit=$this->_request("action");
		$MUserName=$this->_request("unames");
		$isPass=$this->_request("isPass");
		$MPassWord=md5($this->_request("userpwd"));
		$MName=$this->_request("username");
		$MSex=$this->_request("usersex");
		$MEmail=$this->_request("useremail");
		$mstate=$this->_request("mstate");
		$uaddress=$this->_request("uaddress");
		$MFax=$this->_request("ufax");
		$MTel=$this->_request("usertel");
		$MTime=date("Y-m-d" ,time());
		$Madmin=M("member");
		$where["MUserName"]=$MUserName;
		$where["MPassWord"]=$MPassWord;
		$where["MName"]=$MName;
		$where["MTel"]=$MTel;
		$where["MFax"]=$MFax;
		$where["MSex"]=$MSex;
		$where["MEmail"]=$MEmail;
		$where["MAddress"]=$uaddress;
		$where["MState"]=$mstate;
		$where["MTime"]=$MTime;
		$contion['MUserName']=$MUserName;
		$datarows=$Madmin->where($contion)->limit(1)->select();
		switch($Submit)
		{
			case 'Add':
			 if($datarows)
			   {
				   echo("<script>alert('对不起,该会员已经注册,请重新注册!');</script>");
		          $this->redirect('/Admin/User/osUserCreate?Save=Add');//注册失败以后重新定向
			   } 
			   else
			   {
					  $Madmin->add($where);
					  echo "<script>alert('会员添加成功!');</script>";
		      		  $this->redirect("/Admin/User/osUserList?ffaID=1");
			   }
			   break;
			case "Edit":
			  $id=$this->_request("id");
			  if(!empty($id))
			  {
				  $contion1["MID"]=$id;
				  $Data["MUserName"]= $MUserName;
				  $Data["MEmail"]= $MEmail;
				  $Data["MTel"]= $MTel;
				  $Data["MFax"]= $MFax;
				  $Data["MAddress"]= $uaddress;
				  $Data["MName"]= $MName;
				  $Data["MSex"]= $MSex;
				  $Data["MState"]= $mstate;
				  if($isPass==1)
				  {
				  	$Data["MPassWord"]= $MPassWord;
				  }
				  $Mlist=$Madmin->where($contion1)->data($Data)->save();
				  if($Mlist!==false) 
					{ 
						 echo "<script>alert('数据修改成功!');</script>";
		      			 $this->redirect("/Admin/User/osUserList?ffaID=1");
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
		$data["MState"]=$this->_request("NweState");
		$model = M("member");//获取当期模块的操作对象 
		$id = $_POST['nCID']; 
		//判断id是数组还是一个 
		if(is_array($id))
		{ 
			$where = 'MID in('.implode(',',$id).')'; 
		}
		else{ 
			$where = 'MID='.$id; 
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

}

