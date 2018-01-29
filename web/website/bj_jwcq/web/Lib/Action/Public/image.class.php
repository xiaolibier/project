<?php

date_default_timezone_set('UTC'); 
header("Content-Type:text/html; charset=UTF-8");
class image{
  private $info;
  private $image;
  /*打开一张图片压缩到内存中*/
  public function __construct($src)
  {
  		$info=getimagesize($src);
		$this->info=array(
		  'width'=>$info[0],
		  'height'=>$info[1],
		  'type'=>image_type_to_extension($info[2],false),
		  'mime'=>$info['mime']
		);
		$fun="imagecreatefrom{$this->info['type']}";
		$this->image=$fun($src);
  }
  /*操作图片压缩*/
  public function thumb($width,$height)
  {
  		$image_thumb=imagecreatetruecolor($width,$height);
		imagecopyresampled($image_thumb,$this->image,0,0,0,0,$width,$height,$this->info['width'],$this->info['height']); 
		imagedestroy($this->image);
		$this->image=$image_thumb;
  }
  /*操作图片（添加文字水印）*/
  public function fontMark($content,$font_url,$size,$color,$local,$angle)
  {
  		$col=imagecolorallocatealpha($this->image,$color[0],$color[1],$color[2],$color[3]);
		imagettftext($this->image,$size,$angle,$local['x'],$local['y'],$col,$font_url,$content);
  }
  /*操作图片（添加图片水印）*/
  public function imageMark($source,$local,$alpha)
  {
  		$info2=getimagesize($source);
		$type2=image_type_to_extension($info2[2],false);
		$fun2="imagecreatefrom{$type2}";
		$water=$fun2($source);
		imagecopymerge($this->image,$water,$local['x'],$local['y'],0,0,$info2[0],$info2[1],$alpha);
		imagedestroy($water);
  }
  
  /*浏览器中输出图片*/
  public function show()
  {
  	header("Content-type:".$this->info['mime']);
	$funs="image{$this->info['type']}";
	$funs($this->image);
  }
  
  /*把图片保存在硬盘里*/
  public function save($newname)
  {
  	  $funs="image{$this->info['type']}";
	  $funs($this->image,$newname.'.'.$this->info['type']);
  
  }
  
  /*销毁图片*/
  public function __destruct()
  {
  	imagedestroy($this->image);
  }
  
}

?>