<?php

header("Content-Type:text/html; charset=UTF-8");
class MguestAction extends Action 
{

     public function _initialize()
	{
		$admin=$_SESSION["username"];
		if(empty($admin))
		{
			$this->redirect("__APP__/Admin/Sys/login");
		}
	}   
	function guest_list()
	{
	   $ffaID=$this->_request("ffaID");
	   $TheObj =new Model('guestbook');//实例化模型类
		if(!empty($ffaID))
		{
			$map['Gtype']=4;
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
	


}

