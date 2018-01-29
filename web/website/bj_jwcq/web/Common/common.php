<?php
 header("Content-Type:text/html; charset=UTF-8");
function errorlog($msg,$path='./aa.txt')
{
	error_log($msg,3,$path);
}
function setsession($sessionname,$val,$second)//��
{
	session_start();
 	$_SESSION["$sessionname"] = $val;
 	$session_id = session_id();
 	setcookie( session_name(), $session_id, time() + $second );
}

function export_csv($data) 
{
	$filename = date('YmdHis').".csv";//文件名
	header("Content-type:text/csv");
	header("Content-Disposition:attachment;filename=".$filename);
	header('Cache-Control:must-revalidate,post-check=0,pre-check=0');
	header('Expires:0');
	header('Pragma:public');
	echo array_to_string($data);
}

//根据id获取父类Id
function getmain_id($faID)
{
	$main_menu=M("main_menu");
	$contion["Main_ID"]=$faID;
	$datas=$main_menu->where($contion)->find(); 
	
	return $datas["Main_Father"];
}
//根据id获取字段名称
function getmain_names($main_id)
{
	$main_menu=M("main_menu");
	$contion["Main_ID"]=$main_id;
	$datas=$main_menu->where($contion)->find(); 
	//echo($main_menu->_sql());
	return $datas["Main_Name"];
}
//前台调用
function getbyfile($main_id)
{
   
	$main_menu=M("main_menu");
	$contion["Main_ID"]=$main_id;
	$datas=$main_menu->where($contion)->find(); 
	return $datas;
}
//根据id获取子级
function get_soncolnews($id,$tops)
{
	$col_news=M("col_news");
	$contion["Col_MenuID"]=$id;
	$datas=$col_news->where($contion)->limit($tops)->order('Col_Order asc,Col_ID desc')->select(); 
	return $datas;
}
////根据id获取子级
function getlinks($id)
{
	$link=M("link");
	$contion["FType"]=$id;
	$datas=$link->where($contion)->order('FOrder asc,FID desc')->select(); 
	return $datas;
}


//根据父类id获取第一条数据
function get_fristnews($id,$tops)
{
	$col_news=M("col_news");
	$contion["Col_MenuID"]=$id;
	$datas=$col_news->where($contion)->limit($tops)->order('Col_Order asc,Col_ID desc')->find(); 
	return $datas['Col_ID'];
}

//根据 col_proid获取内容信息
function getcolnews($id,$tops,$col_hot)
{
	$col_news=M("col_news");
	$contion["Col_proid"]=$id;
	$contion["Col_State"]=1;
	$datas=$col_news->where($contion)->limit($tops)->order('Col_Order asc,Col_ID desc')->select(); 
	return $datas;
}

//根据 col_proid获取内容信息
function get_news($id,$tops,$col_hot)
{
	$col_news=M("col_news");
	$contion["Col_proid"]=$id;
	$contion["Col_State"]=1;
	$contion["Col_Hot"]=$col_hot;
	$datas=$col_news->where($contion)->limit($tops)->order('Col_Order asc,Col_ID desc')->select(); 
	return $datas;
}
//根据 col_proid获取推荐内容信息
function gethotcolnews($id,$col_hot)
{
	$col_news=M("col_news");
	$contion["Col_proid"]=$id;
	$contion["Col_Hot"]=$col_hot;
	$contion["Col_State"]=1;
	$datas=$col_news->where($contion)->order('Col_Order asc,Col_ID desc')->select(); 
	return $datas;
}
//根据Id获取信息内容
function get_colnews($nid)
{
	$col_news=M("col_news");
	$main_menu=M("main_menu");
	if(!empty($nid))
	{
		$contion['Col_ID']=$nid;
		$datas = $col_news->where($contion)->find();
		$where["Main_ID"]=$datas["Col_MenuID"];
		$where["Main_State"]=1;
		$mainmenu=$main_menu->where($where)->find();
		$col_news->where($contion)->setInc('Col_Click',1);//浏览次数加1
		return array(
	      'datas'=>$datas,
		  'mainmenu'=>$mainmenu
	   );	
    }
}

//日志写入数据公共方法
function add_login($ColTitle,$col_name,$content1,$type)
{
     //写入日志
	  $loglogin=M("loglogin");
	  $logdata['Ltitle']=$ColTitle;
	  $logdata['Lfname']=$col_name;
	  $logdata['Lcon']=$content1;
	  $logdata['LName']=$_SESSION["username"];
	  $logdata['LIP']=get_client_ip();
	  $logdata['LTime']=date("Y-m-d h:i:s" ,time());
	  $logdata['Ltype']=$type;
	  $loglogin->add($logdata);
}
//根据父类id，获取子级名称
function getByfiles($mainfather,$maintype,$mainstate,$main_language,$nid,$tops)
{
	$main_menu=M("main_menu");
	$contion["Main_Father"]=$mainfather;
	$contion["Main_Type"]=$maintype;
	$contion["Main_State"]=$mainstate;
	$contion["Main_Language"]=$main_language;
	if(empty($nid))
	{
	  $datas=$main_menu->where($contion)->limit($tops)->order('Main_Order asc,Main_ID desc')->select();
	}
	else
	{
	    $where["Main_ID"]=$nid;
		$where["Main_State"]=1;
		$datas=$main_menu->where($where)->select();
	}
	
	return $datas;
}

function getmain_menu($mainfather,$main_state,$main_language)
{
	$main_menu=M("main_menu");
	$contion["Main_Father"]=$mainfather;
	$contion["Main_Language"]=$main_language;
	$contion["Main_State"]=$main_state;
	$datas=$main_menu->where($contion)->order('Main_Order asc,Main_ID desc')->select(); 
	return $datas;
}
//根据id获取内容
function getf_mainmenu($mainfather,$maintype,$tops,$Main_Language,$id)
{
		$main_menu=M("main_menu");
		$contion["Main_Father"]=$mainfather;
		$contion["Main_Type"]=$maintype;
		$contion["Main_Language"]=$Main_Language;
		$contion["Main_State"]=1;
		if(empty($id))
		{
		  $datas=$main_menu->where($contion)->limit($tops)->order('Main_Order asc,Main_ID desc')->find(); 
		}
		else
		{
			$where["Main_ID"]=$id;
		    $where["Main_State"]=1;
		    $datas=$main_menu->where($where)->find();
		}
		return $datas;
}


//删除main_menu公共函数方法
function deletemain_menu($id,$Submit,$Main_State,$main_name,$faID,$type,$fid,$Language)
{
		 if($type=="about")
		 {
		 	$url="'/Admin/About/caselist?ffaID=".$fid."&faID=".$faID."&Language=".$Language."'";
		 } 
		$model = M("main_menu");//获取当期模块的操作对象
		if(is_array($id))	//判断id是数组还是一个
		{ 
			$where = 'Main_ID in('.implode(',',$id).')'; 
			foreach($id as $k=>$v) 
			{	
			   $fname=$fname.'-'.$model->where('main_id="'.$v.'"')->getField('Main_Name'); 		
			    if($k==0)
				{
		           $fname=$model->where('main_id="'.$v.'"')->getField('Main_Name'); 
				}
			}
		}
		else
		{ 
			$where = 'Main_ID='.$id; 
			 $fname=$model->where('main_id="'.$id.'"')->getField('Main_Name'); 
		} 
		switch ($Submit)
		{
			case '批量删除': 
				$list=$model->where($where)->delete(); 
				if($list!==false) 
				{ 
				
				  add_login($fname,$main_name,'',$type="批量删除");
				  echo "<script>alert('成功删除{$list}条');window.location.href=".$url.";</script>";
				}
				else
				{ 
				    add_login($fname,$main_name,'',$type="删除失败");
					$this->error('删除失败！'); 
				} 
			break;
			case '状态更新':
			    $data["Main_State"]=$Main_State;
				$list=$model->where($where)->data($data)->save();
				if($list!==false) 
				{ 
				    //写入日志
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
//删除col_news数据公共方法
function deletecol_news()
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

function cutstr_html($string, $sublen)
{
  $string = strip_tags($string);
  $string = preg_replace ('/\n/is', '', $string);
  $string = preg_replace ('/ |　/is', '', $string);
  $string = preg_replace ('/&nbsp;/is', '', $string);
  preg_match_all("/[\x01-\x7f]|[\xc2-\xdf][\x80-\xbf]|\xe0[\xa0-\xbf][\x80-\xbf]|[\xe1-\xef][\x80-\xbf][\x80-\xbf]|\xf0[\x90-\xbf][\x80-\xbf][\x80-\xbf]|[\xf1-\xf7][\x80-\xbf][\x80-\xbf][\x80-\xbf]/", $string, $t_string);   
  if(count($t_string[0]) - 0 > $sublen) $string = join('', array_slice($t_string[0], 0, $sublen))."…";   
  else $string = join('', array_slice($t_string[0], 0, $sublen));
  return $string;
}	
function ezk_substr($string, $start = 0, $sublen, $code = 'utf-8'){
 //$string 要截取的字符串   $start  截取时的开始位置   $sublen 截取的长度   $code 截取的字符格式
    if($code == 'utf-8') {
        $pa = "/[\x01-\x7f]|[\xc2-\xdf][\x80-\xbf]|\xe0[\xa0-\xbf][\x80-\xbf]|[\xe1-\xef][\x80-\xbf][\x80-\xbf]|\xf0[\x90-\xbf][\x80-\xbf][\x80-\xbf]|[\xf1-\xf7][\x80-\xbf][\x80-\xbf][\x80-\xbf]/";
        preg_match_all($pa, $string, $t_string);

        if(count($t_string[0]) - $start > $sublen) return join('', array_slice($t_string[0], $start, $sublen))."...";
        return join('', array_slice($t_string[0], $start, $sublen));
    }else {
        $start = $start*2;
        $sublen = $sublen*2;
        $strlen = strlen($string);
        $tmpstr = '';

        for($i=0; $i< $strlen; $i++) {
            if($i>=$start && $i< ($start+$sublen)) {
                if(ord(substr($string, $i, 1))>129) {
                    $tmpstr.= substr($string, $i, 2);
                }else {
                    $tmpstr.= substr($string, $i, 1);
                }
            }
            if(ord(substr($string, $i, 1))>129) $i++;
        }
        if(strlen($tmpstr)< $strlen ) $tmpstr.= "...";
        return $tmpstr;
    }
}

//去除html标签、css样式、js、空格等格式的功能(格式化html文本)
function ezk_cutstr_html($string){
 $string = strip_tags($string);
 $string = preg_replace ('/\n/is', '', $string);
 $string = preg_replace ('/ |　/is', '', $string);
 $string = preg_replace ('/&nbsp;/is', '', $string);
 
 preg_match_all("/[\x01-\x7f]|[\xc2-\xdf][\x80-\xbf]|\xe0[\xa0-\xbf][\x80-\xbf]|[\xe1-\xef][\x80-\xbf][\x80-\xbf]|\xf0[\x90-\xbf][\x80-\xbf][\x80-\xbf]|[\xf1-\xf7][\x80-\xbf][\x80-\xbf][\x80-\xbf]/", $string, $t_string);  
 
   return $string;
}
function msubstr($str, $start=0, $length, $charset="utf-8", $suffix=true)  
 {  
  if(function_exists("mb_substr")){  
              if($suffix)  
              return mb_substr($str, $start, $length, $charset);  
              else
                   return mb_substr($str, $start, $length, $charset);  
         }  
         elseif(function_exists('iconv_substr')) {  
             if($suffix)  
                  return iconv_substr($str,$start,$length,$charset);  
             else
                  return iconv_substr($str,$start,$length,$charset);  
         }  
         $re['utf-8']   = "/[x01-x7f]|[xc2-xdf][x80-xbf]|[xe0-xef]
                  [x80-xbf]{2}|[xf0-xff][x80-xbf]{3}/";  
         $re['gb2312'] = "/[x01-x7f]|[xb0-xf7][xa0-xfe]/";  
         $re['gbk']    = "/[x01-x7f]|[x81-xfe][x40-xfe]/";  
         $re['big5']   = "/[x01-x7f]|[x81-xfe]([x40-x7e]|xa1-xfe])/";  
         preg_match_all($re[$charset], $str, $match);  
         $slice = join("",array_slice($match[0], $start, $length));  
         if($suffix) return $slice;  
         return $slice;
    }


function array_to_string($result) 
{
	if(empty($result)) 
	{
		return i("没有符合您要求的数据！^_^");
	}
	$data = '姓名,标题,内容,类型,时间,IP'."\n"; //栏目名称
	$data=i($data);
	$size_result = sizeof($result);
	
	for($i = 0 ; $i < $size_result ; $i++) 
	{
		$data .= i($result[$i]['LName']).','.i($result[$i]['Ltitle']).','.i($result[$i]['Lcon']).','.i($result[$i]['Ltype']).','.i($result[$i]['LTime']).','.i($result[$i]['LIP'])."\n";
	}
	exit($data);
	return $data;
}

function i($strInput) 
{
	return iconv('utf-8','gb2312',$strInput);//页面编码为utf-8时使用，否则导出的中文为乱码
}
//文章内容分页
function getcontent($id)
{
		 $main_menu=M("main_menu");
		 $where["Main_ID"]=$id;
		 if (isset ( $_GET ['p'] ) && $_GET ['p'] != '')
	    {
		   $p = intval ( $_GET ['p'] );
	    }
		 $result =$main_menu->where($where)->find();
		$CONTENT_POS = strpos ( $result ['Main_Content'], '[page]' );//判断是否存在分页
		if ($CONTENT_POS !== false) 
		{
			$p = $p == NULL ? 1 : $p;
			$contents = array_filter ( explode ( '[page]', $result ['Main_Content'] ) ); //按分页标记分段
			$pagenumber = count ( $contents ); //分页数
			$page = setPage ( $pagenumber, 1, ' ', '' );			
			$result ['Main_Content'] = $contents [$p - 1];//将整个文章内容替换为分页内容
			$pages=$page->show ();
		}
		return array(
	    'result'=>$result,
		'pages'=>$pages
	);
}

function setPage($sum, $listrow = '', $pageStr = '', $word = '') 
{
	import ( 'ORG.Util.Page' );
	$page = new Page ( $sum, $listrow );
	$page->setConfig ( 'header', $word . $pageStr );
	$page->setConfig ( 'prev', '上一页' );
	$page->setConfig ( 'next', '下一页' );
	$page->setConfig ( 'first', '首页' );
	$page->setConfig ( 'last', '尾页' );
	return $page;
}


//	//图片上传
function _upload() 
{
        import('rbac');
        //导入上传类
        $upload = new UploadFile();
        //设置上传文件大小 
        $upload->maxSize = 3292200; 
        //设置上传文件类型 
        $upload->allowExts = explode(',', 'jpg,gif,png,jpeg'); 
        //设置附件上传目录 
        $upload->savePath = './web/Public/Uploads/'; 
        //设置需要生成缩略图，仅对图像文件有效 
        $upload->thumb = false;  //是否需要对图片文件进行缩略图处理，默认为false
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
             $uploads['image'] = $uploadList[0]['savename']; 
        } 
		
		return $uploads; 
 } 

?>
