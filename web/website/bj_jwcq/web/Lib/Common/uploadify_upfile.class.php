<?php
/*$uploadfoldername="userfiles/otherfiles";
$targetPath= rtrim($_SERVER['DOCUMENT_ROOT'],'/')."/".$uploadfoldername;
$a=new uploadify_upfile($targetPath,$uploadfoldername);
$a->fileUpload();*/
class uploadify_upfile
{
	public $targetFolder;
	public $uploadfoldername;
	public $newImgName;
	public $allowextend=array();
	public $max_width;//最大宽度
	public function __construct($targetFolder="",$uploadfoldername="",$newImgName="") 
	{
		$this->targetFolder = $targetFolder;
		$this->uploadfoldername = $uploadfoldername;
		$this->newImgName = $newImgName;
	}
	public function fileUpload($mkcurrentdatefoder=false,$format="Y-m-d")
	{
		if (!empty($_FILES)) 
		{
			$tempFile = $_FILES['Filedata']['tmp_name'];
			if($this->max_width)//限制图片上传宽度
			{
				$str=getimagesize($tempFile);   
				$mode="/width=\"(.*)\" height=\"(.*)\"/";  
				preg_match($mode,$str[3],$arr);  
				if($arr[1]>$this->max_width)
				{  
					$width=$this->max_width;
					exit ("图片宽度最大允许$width"."px");
				} 
			}
			$newName=$this->getNewName($_FILES['Filedata']['name']);
			$this->newImgName =$newName;
			$targetFile = $this->targetFolder . '/' . $newName;
			if(count($this->allowextend)>0)
				$verifyTypes = $this->allowextend;
			else
				$verifyTypes = array('jpg','gif','png','flv'); //校验类型
			$fileTypes = $this->getExtName($_FILES['Filedata']['name']);// 文件扩展名
			if (in_array($fileTypes,$verifyTypes)) 
			{
				if($mkcurrentdatefoder)
				{
					ini_set('date.timezone','Asia/Shanghai');
					$date = date($format,time());
					$newfoder=$this->targetFolder."/$date/";
					if(!file_exists($newfoder))
						mkdir($newfoder,0777);
					$targetFile=$newfoder.$newName;
				}
				move_uploaded_file($tempFile,$targetFile);
				//输出的字符串由表单页面onUploadSuccess方法的data参数接收，这里输出上传后的文件路径
				//echo 'http://'.$_SERVER['SERVER_ADDR'].$targetFolder.'/'.$newName;
				
				$regexp="/^(\.*\/)/";
				if(preg_match($regexp,$this->targetFolder))
				{
					$targetFolder=preg_replace($regexp,"",$this->targetFolder);
				}
				if($mkcurrentdatefoder)
					echo $targetFolder."/$date/".$newName;
				else
					echo $targetFolder.'/'.$newName;
			} 
			else 
			{
				//输出的字符串由表单页面onUploadError方法的data参数接收
				echo '非法文件类型';
			}
		}
	}
	

	//生成一个无重复的文件名
	function getNewName($filename)
	{
		ini_set('date.timezone','Asia/Shanghai');
		$timeNow = date('YmdHis',time());
		$randKey = '';
		for ($a = 0; $a < 8; $a++) {
			$randKey .= chr(mt_rand(97, 122));
		}
		$extName = ".".$this->getExtName($filename);
		$newName=$timeNow.$randKey.$extName;
		return $newName;
	}
	
	//取得文件扩展名
	function getExtName($filename)
	{
		$fileParts = pathinfo($filename);
		return strtolower($fileParts['extension']);
	}
}