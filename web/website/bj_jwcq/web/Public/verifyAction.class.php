
<?php
// 本类由系统自动生成，仅供测试用途
class verifyAction extends Action 
{

   Public function verify()
   {
	// 导入Image类库
	import("ORG.Util.Image");
	Image::buildImageVerify();
	}
	
}
?>