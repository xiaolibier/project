<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><title>无标题文档</title><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><script language="javascript" src="__SYSWEB__/images/common.js" type="text/javascript"></script><link href="__SYSWEB__/images/skinv2.0.css" rel="stylesheet" type="text/css"><link href="__SYSWEB__/images/mainFrom.css" rel="stylesheet" type="text/css"/><script type="text/javascript" src="__SYSWEB__/js/jquery-1.4.2.min.js"></script><script type="text/javascript" src="__SYSWEB__/js/jquery.upload.min.js"></script><script charset="utf-8" src="__SYSWEB__/js/jquery_alixixi.js"></script><style type="text/css"><!--
.STYLE1 {color: #FFFFFF}
.STYLE3 {color: #FFFFFF; font-weight: bold; }

.tooltip {
position: absolute;
z-index: 999;
left: -9999px;
background-color: #dedede;
padding: 5px;
border: 1px solid #fff;
}
.tooltip p {
color: #fff;
background-color: #222;
padding: 7px 7px;
margin: 0;
}
--></style><link rel="stylesheet" href="__SYSWEB__/images/themes/default/default.css" /><link rel="stylesheet" href="__SYSWEB__/images/plugins/code/prettify.css" /><script charset="utf-8" src="__SYSWEB__/images/kindeditor.js"></script><script charset="utf-8" src="__SYSWEB__/images/lang/zh_CN.js"></script><script charset="utf-8" src="__SYSWEB__/images/35Public.js"></script><script charset="utf-8" src="__SYSWEB__/images/plugins/code/prettify.js"></script><script>		KindEditor.ready(function(K) {
			var editor1 = K.create('textarea[name="content1"]', {
				cssPath : '__SYSWEB__/images/plugins/code/prettify.css',
				uploadJson : '__SYSWEB__/images/upload_json.php',
				fileManagerJson : '__SYSWEB__/images/file_manager_json.php',
				allowFileManager : true,
				afterCreate : function() {
					var self = this;
					K.ctrl(document, 13, function() {
						self.sync();
						K('form[name=example]')[0].submit();
					});
					K.ctrl(self.edit.doc, 13, function() {
						self.sync();
						K('form[name=example]')[0].submit();
					});
				}
			});
			
			var editor2 = K.create('textarea[name="Main_bm"]', {
				cssPath : '__SYSWEB__/images/plugins/code/prettify.css',
				uploadJson : '__SYSWEB__/images/upload_json.php',
				fileManagerJson : '__SYSWEB__/images/file_manager_json.php',
				allowFileManager : true,
				afterCreate : function() {
					var self = this;
					K.ctrl(document, 13, function() {
						self.sync();
						K('form[name=example]')[0].submit();
					});
					K.ctrl(self.edit.doc, 13, function() {
						self.sync();
						K('form[name=example]')[0].submit();
					});
				}
			});
			
			prettyPrint();
		});
		
function simple_tooltip(target_items, name){
 $(target_items).each(function(i){
		$("body").append("<div class='"+name+"' id='"+name+i+"'><p>"+$(this).attr('title')+"</p></div>");
		var my_tooltip = $("#"+name+i);

		$(this).removeAttr("title").mouseover(function(){
				my_tooltip.css({opacity:0.8, display:"none"}).fadeIn(400);
		}).mousemove(function(kmouse){
				my_tooltip.css({left:kmouse.pageX+15, top:kmouse.pageY+15});
		}).mouseout(function(){
				my_tooltip.fadeOut(400);
		});
	});
}
$(document).ready(function(){
	 simple_tooltip("a.tip","sunflowamedia");
});

	</script></head><body><div class="con-ico"><div class="con-fl" style="height:30px;">当前位置：我的站点 &gt; <a href="__APP__/Admin/Caselist/caselist?ffaID=<?php echo ($ffaids); ?>&faID=<?php echo ($ffaids); ?>&Language=<?php echo ($language); ?>"><?php echo ($datas["Main_Name"]); ?></a><?php echo ($locationstr); ?><a href="__APP__/Admin/Caselist/caselist?ffaID=<?php echo ($ffaids); ?>&faID=<?php echo ($faID); ?>&Language=<?php echo ($language); ?>"><?php echo ($datas1["Main_Name"]); ?></a></div></div><table border="0" cellpadding="0" cellspacing="0" style="WIDTH: 800px; HEIGHT: 380px"><tr><td style="HEIGHT: 381px" valign="top" align="left" colspan="2"><form name="Gforms" method="post" action="__APP__/Admin/Caselist/case_add?id=<?php echo ($id); ?>&Language=<?php echo ($language); ?>" onsubmit="return check_add()" enctype="multipart/form-data"><table width="101%" border="0" cellpadding="0" cellspacing="0"  class="content-table"><tr class="content-table"><th align="right" class="tdblodthnone"> 属性项 </th><th class="tdblodthnone"> 属性值        </tr><tr><td width="114" align="center" bgcolor="#F4F4F4">栏目名称：</td><td width="686" bgcolor="#F4F4F4"><label><input name="ColName" type="text" class="input_3" id="ColName" size="50" value="<?php echo ($menuinfo["Main_Name"]); ?>"></label></td></tr><tr style="display:none;"><td width="114" align="center" bgcolor="#F4F4F4">栏目信息：</td><td width="686" bgcolor="#F4F4F4"><label><input name="ColEnglish" type="text" class="input_3" id="Main_English" size="50" value=""></label></td></tr><tr style="display:none"><td align="center" height="20" bgcolor="#F4F4F4">栏目图片：</td><td bgcolor="#F4F4F4"><input name="image" id="image" type="file" class="file huge" /><?php if($Main_Pic != '' ): ?><a href="#" class="tip">查看图片</a><?php else: endif; ?><div id="sunflowamedia0" class="tooltip"><p><img src="__SYSWEB__/Uploads/<?php echo ($Main_Pic); ?>" /></p></div></td></tr><tr style="display:none"><td align="center" bgcolor="#F4F4F4" height="20">栏目归属：</td><td bgcolor="#F4F4F4"><label><select name="Main_Father"><option value="" >顶级类别</option></select></label></td></tr><tr style="display:none"><td align="center">语言版本：</td><td><select name="Mian_Language"><% call funLanguage(Main_Language) %></select></td></tr><tr><td align="center" bgcolor="#F4F4F4">是否显示：</td><td bgcolor="#F4F4F4"><label><input name="State" type="checkbox" id="State" value="1"   <?php if($Main_State == '1' ): ?>checked  <?php else: endif; ?>>            显示</label></td></tr><tr><td align="center" bgcolor="#F4F4F4">栏目排序：</td><td bgcolor="#F4F4F4"><input name="COrder" type="text" class="input_3" id="COrder" value="<?php echo ($COrder); ?>" size="10" onKeyPress="InputNum()"></tr><tr style=""><td align="center" bgcolor="#F4F4F4">栏目类型：</td><td bgcolor="#F4F4F4"><label style=""><input name="CType" type="radio" onClick="Cols(1)" <?php if($Main_Type == '1' ): ?>checked  <?php else: endif; ?>  value="1" >            文章形式</label>            &nbsp;
            <label style=""><input type="radio" name="CType" value="2" onClick="Cols(2)"  <?php if($Main_Type == '2' ): ?>checked  <?php else: endif; ?>  value="1"/>              栏目</label><label style=""><input type="radio" name="CType"   value="3"  onClick="Cols(3)"  <?php if($Main_Type == '3' ): ?>checked  <?php else: endif; ?>/>              图片列表 </label><label style="display:none"><input type="radio" name="CType"   value="4" onClick="Cols(4)" <?php if($Main_Type == '4' ): ?>checked  <?php else: endif; ?> />信息列表</label><label style="display:none"><input type="radio" name="CType"  value="5" onClick="Cols(5)" <?php if($Main_Type == '5' ): ?>checked  <?php else: endif; ?>/>企业文化</label><label style="display:none"><input type="radio" name="CType"  value="6" onClick="Cols(6)" <?php if($Main_Type == '6' ): ?>checked  <?php else: endif; ?>/>高管信息</label></td></tr><tr  bgcolor="#F4F4F4" style=""><td height="186" align="center">栏目内容：</td><td><textarea name="Main_bm" style="width:700px;height:200px;visibility:hidden;"><?php echo ($menuinfo["Main_bm"]); ?></textarea></td></tr><tr id="Col_1" bgcolor="#F4F4F4" style="display:none"><td height="186" align="center">栏目内容：</td><td><textarea name="content1" style="width:700px;height:200px;visibility:hidden;"><?php echo ($menuinfo["Main_Content"]); ?></textarea><input type="hidden" name="ffaids"  value="<?php echo ($ffaids); ?>"/><input type="hidden" name="faID"  value="<?php echo ($faID); ?>"/></td></tr><tr><td height="40" align="center" bgcolor="#E2EEE1"><label></label><label></label></td><td height="40" align="left" bgcolor="#E2EEE1"><label><input name="Submit" type="submit" class="Botton" id="Submit" value="<?php echo ($bvalue); ?>" />&nbsp; </label><label><input name="Submit3" type="reset" class="Botton" value="重置" /></label></td></tr></table></form></td></tr></table><script language="javascript" type="text/javascript"><!--
function check_add()
{
	if(document.Gforms.ColName.value=="")
	{
		alert("请输入栏目名称!");
		document.Gforms.ColName.focus();
		return false;
	}
}



--></script><script language="javascript"><!--
function Cols(id)
{
	a=id
	switch(a){
	case 1:
			eval("Col_1.style.display=\"\";");
			eval("Col_2.style.display=\"none\";");
			break;
	case 2:
			eval("Col_1.style.display=\"\";");
			eval("Col_2.style.display=\"none\";");
			break;
	case 3:
			eval("Col_1.style.display=\"none\";");
			eval("Col_2.style.display=\"\";");
			break;
	case 4:
			eval("Col_1.style.display=\"none\";");
			eval("Col_2.style.display=\"\";");
			break;
	}

}
--></script></body></html>