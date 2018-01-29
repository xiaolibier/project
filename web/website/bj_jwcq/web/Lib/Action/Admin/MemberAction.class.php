<?php

header("Content-Type:text/html; charset=UTF-8");
class MemberAction extends Action 
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
		          $this->redirect('/Admin/Member/osUserCreate?Save=Add');//注册失败以后重新定向
			   } 
			   else
			   {
					  $Madmin->add($where);
					  echo "<script>alert('会员添加成功!');</script>";
		      		  $this->redirect("/Admin/Member/osUserList?ffaID=1");
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
		      			 $this->redirect("/Admin/Member/osUserList?ffaID=1");
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

