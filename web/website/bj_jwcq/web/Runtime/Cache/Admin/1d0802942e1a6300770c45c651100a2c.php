<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><link href="__SYSWEB__/images/mainFrom.css" rel="stylesheet" type="text/css"/><link href="__SYSWEB__/images/skinv2.0.css" rel="stylesheet" type="text/css"><style type="text/css"><!--
.STYLE1 {color: #FFFFFF}
--></style><script language="javascript" src="__SYSWEB__/images/35Public.js"></script></head><body><div class="con-ico"><div class="con-fl" style="height:30px;">当前位置：我的站点 &gt; <a href="__APP__/Admin/Product/caselist?ffaID=<?php echo ($ffaID); ?>&faID=<?php echo ($ffaID); ?>&Language=<?php echo ($language); ?>"><?php echo ($datas["Main_Name"]); ?></a> ><a href="__APP__/Admin/Product/caselist?ffaID=<?php echo ($ffaID); ?>&faID=<?php echo ($main_father); ?>&Language=<?php echo ($language); ?>"><?php echo ($main_names); ?></a><a href="__APP__/Admin/Product/caseNewsList?ffaID=<?php echo ($ffaID); ?>&faID=<?php echo ($faID); ?>&Language=<?php echo ($language); ?>"><?php echo ($datas1["Main_Name"]); ?></a></div><form  method="post" onsubmit="return check_search(this)" action="__APP__/Admin/Product/caseNewsList?ffaID=<?php echo ($ffaID); ?>&faID=<?php echo ($faID); ?>&Language=<?php echo ($language); ?>"><input type="text" name="Col_Title" id="Col_Title"  value="<?php echo ($Col_Title); ?>" /><input type="submit" value="搜索" name="sear" class="Botton"></form></div><form action="__APP__/Admin/Product/newscol_delete?faID=<?php echo ($faID); ?>&ffaID=<?php echo ($ffaID); ?>" method="Post" name="Gforms"><table width="781" border="0" cellpadding="0" cellspacing="1" bgcolor="#CDCDCD"><tr><td width="35" align="center" bgcolor="#F4F4F4" class="tdblodthnone"><strong>选中</strong></td><td width="248" height="22" align="center" bgcolor="#F4F4F4" class="tdblodthnone"><strong>信息标题 </strong></td><td width="238" align="center" bgcolor="#F4F4F4" class="tdblodthnone"><strong>栏目</strong></td><td width="54" align="center" bgcolor="#F4F4F4" class="tdblodthnone"><strong>状态</strong></td><td width="108" align="center" bgcolor="#F4F4F4" class="tdblodthnone"><strong>排序</strong></td><td width="91" align="center" bgcolor="#F4F4F4" class="tdblodthnone"><strong>操作</strong></td></tr><?php if(is_array($info_detail)): $i = 0; $__LIST__ = $info_detail;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vo): $mod = ($i % 2 );++$i;?><tr bgcolor="#F4F4F4" onMouseOver="this.style.backgroundColor=&quot;#FFFFFF&quot;" onMouseOut="this.style.backgroundColor=&quot;&quot;"><td align="center"><input name="nCID[]" type="checkbox" id="nCID" value="<?php echo ($vo["Col_ID"]); ?>"></td><td align="left"><a href="" target="_blank"><?php echo ($vo["Col_Title"]); ?></a></td><td align="center"><?php echo ($datas1["Main_Name"]); ?></td><td align="center"><?php if($vo["Col_State"] == '1' ): ?><img src='__SYSWEB__/images/yes.gif'><?php else: ?><img src='__SYSWEB__/images/no.gif'><?php endif; ?></td><td align="center" id="Order_"><?php echo ($vo["Col_Order"]); ?></td><td align="center"><a href="__APP__/Admin/Product/caseColCreate?Save=Edit&ffaID=<?php echo ($ffaID); ?>&faID=<?php echo ($faID); ?>&id=<?php echo ($vo["Col_ID"]); ?>&Language=<?php echo ($language); ?>">编辑</a><!--&nbsp;&nbsp;<a href="<%'=prodRs("col_pic")%>" target="_blank">查看图片</a>--></td></tr><?php endforeach; endif; else: echo "" ;endif; ?><tr bgcolor="#F4F4F4" onMouseOver="this.style.backgroundColor=&quot;#FFFFFF&quot;" onMouseOut="this.style.backgroundColor=&quot;&quot;"><td colspan="7" align="left" bgcolor="#E2EEE1" id="CName_<%=proI%>"><label></label><table width="603" border="0" cellpadding="0" cellspacing="0"><tr><td width="4%"><input type="checkbox" name="chkall" value="on" onclick="CheckAll(this.form)" /></td><td width="19%"> 全部选中(清空)
            <label></label></td><td width="14%"><input name="Submit" type="submit" class="Botton" value="批量删除" onclick="return confirm('您确定要批量删除吗？');" /></td><td width="15%"><select name="State" id="State"><option value="1">True</option><option value="0">False</option></select></td><td width="14%"><input name="Submit" type="submit" class="Botton" id="Submit" onclick="return confirm('您确定要批量更新状态吗？');" value="状态更新" /></td><td width="15%" style="display:none"><select name="hot" id="hot"><option value="1">True</option><option value="0">False</option></select></td><td width="14%" style="display:none"><input name="Submit" type="submit" class="Botton" id="Submit" onclick="return confirm('您确定要批量更新状态吗？');" value="推荐更新" /></td><td width="14%"><input name="Submit32" type="button" class="Botton" value="新建信息" onclick="window.location.href='__APP__/Admin/Product/caseColCreate?Save=Add&ffaID=<?php echo ($ffaID); ?>&faID=<?php echo ($faID); ?>&Language=<?php echo ($language); ?>'" /></td><td width="20%" align="center"><label><input name="button" type="button" class="Botton" id="button" value="返回" onclick="window.location.href='__APP__/Admin/Product/caselist?ffaID=<?php echo ($ffaID); ?>&faID=<?php echo ($ffaID); ?>&Language=<?php echo ($language); ?>'"/></label></td></tr></table></td></tr><tr bgcolor="#F4F4F4"><td height="30" colspan="7" align="center" bgcolor="#E2EEE1"><?php echo ($page); ?></td></tr></table></form></body></html>