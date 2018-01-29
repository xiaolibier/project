<?php

header("Content-Type:text/html; charset=UTF-8");
class LogAction extends Action 
{

     public function _initialize()
	{
		$admin=$_SESSION["username"];
		if(empty($admin))
		{
			$this->redirect("__APP__/Admin/Sys/login");
		}
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



}

