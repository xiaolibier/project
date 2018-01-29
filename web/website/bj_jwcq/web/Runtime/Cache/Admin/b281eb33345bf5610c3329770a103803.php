<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><link href="__SYSWEB__/images/skinv2.0.css" rel="stylesheet" type="text/css"><link href="__SYSWEB__/images/mainFrom.css" rel="stylesheet" type="text/css"/><script language="javascript" src="__SYSWEB__/images/common.js" type="text/javascript"></script><script language="javascript" type="text/javascript" src="__SYSWEB__/My97DatePicker/WdatePicker.js"></script><script charset="utf-8" src="__SYSWEB__/js/jquery_alixixi.js"></script><style type="text/css"><!--
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
--></style><link rel="stylesheet" href="__SYSWEB__/images/themes/default/default.css" /><link rel="stylesheet" href="__SYSWEB__/images/plugins/code/prettify.css" /><script charset="utf-8" src="__SYSWEB__/images/kindeditor.js"></script><script charset="utf-8" src="__SYSWEB__/images/lang/zh_CN.js"></script><script charset="utf-8" src="__SYSWEB__/images/plugins/code/prettify.js"></script><script>		KindEditor.ready(function(K) {
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
	</script></head><body><div class="con-ico"><div class="con-fl" style="height:30px;">当前位置：我的站点 ><a href="__APP__/Admin/Contact/caselist?ffaID=<?php echo ($ffaids); ?>&faID=<?php echo ($ffaids); ?>&Language=<?php echo ($language); ?>"><?php echo ($nicknames); ?></a> ><a href="__APP__/Admin/Contact/caselist?ffaID=<?php echo ($ffaids); ?>&faID=<?php echo ($main_father); ?>&Language=<?php echo ($language); ?>"><?php echo ($main_names); ?></a><a href="__APP__/Admin/Contact/caseNewsList?ffaID=<?php echo ($ffaids); ?>&faID=<?php echo ($col_menuid); ?>&Language=<?php echo ($language); ?>"><?php echo ($nickname); ?></a> > 信息编辑</div></div><table width="855" border="0" cellpadding="0" cellspacing="0" style="WIDTH: 850px; HEIGHT: 380px"><tr><td width="855" colspan="2" align="left" valign="top" style="HEIGHT: 381px"><form name="Gforms" method="post" action="__APP__/Admin/Contact/casecolcreat_add?id=<?php echo ($id); ?>&Language=<?php echo ($language); ?>" enctype="multipart/form-data"><table width="96%" border="0" cellpadding="0" cellspacing="0"  class="content-table"><tr class="content-table"><th align="right" class="tdblodthnone"> 属性项 </th><th class="tdblodthnone"> 属性值        </tr><tr><td align="right" bgcolor="#F4F4F4" height="20">信息归属：</td><td bgcolor="#F4F4F4"><label><?php echo ($nickname); ?></label></td></tr><tr><td width="149" align="right" bgcolor="#F4F4F4">信息标题：</td><td width="619" bgcolor="#F4F4F4"><label><input name="ColTitle" type="text" class="input_3" id="ColTitle" size="80" value="<?php echo ($col_newsinfo["Col_Title"]); ?>"></label></td></tr><tr><td width="149" align="right" bgcolor="#F4F4F4">信息描述：</td><td width="619" bgcolor="#F4F4F4"><label><input name="ColSource" type="text" class="input_3" id="ColSource" size="80" value="<?php echo ($col_newsinfo["Col_Source"]); ?>"></label></td></tr><!-- <tr style="display:none"><td height="20" align="right" bgcolor="#F4F4F4">信息签名：</td><td bgcolor="#F4F4F4"><input name="ColSource" type="text" class="input_3" id="ColSource" size="50" value="" /></td></tr> --><tr style="" bgcolor="#F4F4F4"><td height="20" align="right">作者：</td><td bgcolor="#F4F4F4"><input name="ColEditor" type="text" class="input_3" id="ColEditor" size="50" value="<?php echo ($col_newsinfo["Col_Editor"]); ?>" /></td></tr><tr style=""><td height="20" align="right" bgcolor="#F4F4F4">信息图片：</td><td bgcolor="#F4F4F4"><label><input name="image" id="image" type="file" class="file huge" /></label><?php if($Col_Pic != '' ): ?><a href="#" class="tip">查看图片</a><?php else: endif; ?>				大小：200*130</td><div id="sunflowamedia0" class="tooltip"><p><img src="__SYSWEB__/Uploads/<?php echo ($Col_Pic); ?>" /></p></div></tr><tr style="display:none"><td height="20" align="right" bgcolor="#F4F4F4">信息文件：</td><td bgcolor="#F4F4F4"><label><input name="fujian" id="fujian" type="file" class="file huge" /></label><?php if($Col_File != '' ): ?><a href="__SYSWEB__/Uploads/<?php echo ($Col_File); ?>" target="_blank">下载文件</a><?php else: endif; ?></td></tr><tr style="display:none"><td align="right">是否链接到其它地址：</td><td><span><label><input id="ColHref" type="radio" checked="checked" value="0" name="ColHref" />              否    </label><label><input id="ColHref" type="radio" value="1" name="ColHref"/>              是</label></span></td></tr><tr style="display:none"><td align="right" bgcolor="#F4F4F4">其它地址： </td><td bgcolor="#F4F4F4"><input name="ColUrl" class="input_3" id="ColUrl" size="50" value="" /></td></tr><tr style="" bgcolor="#F4F4F4"><td align="right">是否推荐：</td><td><input name="ColHot" type="checkbox" id="ColHot" value="1"   <?php if($Col_Hot == '1' ): ?>checked="checked"  <?php else: endif; ?> />推荐</td></tr><tr bgcolor="#F4F4F4"><td align="right" bgcolor="#F4F4F4">是否显示：</td><td bgcolor="#F4F4F4"><label><input name="ColState" type="checkbox" id="ColState" value="1" checked="checked"  <?php if($Col_State == '0' ): else: endif; ?>>            显示</label></td></tr><tr style="" bgcolor="#F4F4F4"><td align="right">浏览次数：</td><td><input name="ColClick" type="text" class="input_3" id="ColClick" value="<?php echo ($ColClick); ?>" size="6" onkeypress="InputNum()" /></td></tr><tr bgcolor="#F4F4F4"><td align="right" bgcolor="#F4F4F4">发布日期：</td><td bgcolor="#F4F4F4"><input name="ColTime" type="text" class="input_3" id="ColTime" value="<?php echo ($col_time); ?>" size="10" onClick="WdatePicker()" /></td></tr><tr bgcolor="#F4F4F4"><td align="right">信息排序：</td><td><input name="ColOrder" type="text" class="input_3" id="ColOrder" value="<?php echo ($Col_Order); ?>" size="6" onKeyPress="InputNum()"><input name="ID" type="hidden" id="ID" value=""><input name="ffaids" type="hidden" value="<?php echo ($ffaids); ?>" /><input name="col_menuid" type="hidden" value="<?php echo ($col_menuid); ?>" /><input name="Save" type="hidden" id="Save" value=""></td></tr><tr style="display:none"><td align="right">技术指标：</td><td><textarea name="Coljszb" style="display:none;" id="Coljszb"></textarea></td></tr><tr style="display:none"><td height="186" align="right" bgcolor="#F4F4F4">功能简介：</td><td bgcolor="#F4F4F4"><iframe id="eWebEditor1" src="../eWebEditor/ewebeditor.asp?id=Colgnjj&style=light1" frameborder="0" scrolling="no" width="100%" height="350"></iframe><textarea name="Colgnjj" style="display:none;" id="Colgnjj"></textarea></td></tr><tr id="Col_1"><td height="186" align="right" bgcolor="#F4F4F4">信息内容：</td><td bgcolor="#F4F4F4"><textarea name="content1" style="width:700px;height:200px;visibility:hidden;"><?php echo ($col_newsinfo["Col_Content"]); ?></textarea></td></tr><tr><td height="40" align="center" bgcolor="#E2EEE1"><label></label><label></label></td><td height="40" align="left" bgcolor="#E2EEE1"><label><input name="Submit" type="submit" class="Botton" id="Submit" value="<?php echo ($bvalue); ?>" />&nbsp; </label><label><input name="Submit3" type="reset" class="Botton" value="重置" /></label></td></tr></table></form></td></tr></table></body></html>