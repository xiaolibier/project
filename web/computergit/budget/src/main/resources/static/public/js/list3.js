$(function(){
	var g = {};
	g.login_token = Utils.offLineStore.get("token",false) || "";
	//g.f_id = Utils.getQueryString("f_id") || "";
	g.httpTip = new Utils.httpTip({});
	g.totalPage = 1;//存总页数
	g.nowPage = 0;//存当前页 0 是第一页
	g.showPages = 10;//每页显示多少行
	g.role = 'viewer';//admin 管理员//user 商务部普通用户//viewer 未登录的用户//reviewer 审核员
	g.loadPage = true;//判断页面刚加载一次 定义分页的地方用
	g.search = 1;//判断当前列表处于搜索状态
	/* ----------------------------load------------------------------ */

	$('#srBtn').on('click',function(){g.nowPage = 0;getProjectList(1)});
	$('#srAllBtn').on('click',function(){g.nowPage = 0;getProjectList(2)});
	$('#new_project').on('click',function(){shownewCenterSbox('new')});
	getProjectList();
	getShenBanFang();//获取申办方列表
	setGetSearchInput('#shenbanfangsbox','.choiseDanwei4');//定义可以搜索下拉的
	/* ----------------------------set-------------------------------- */
	
	//获取申办方列表
	function getShenBanFang(){
		var condi = {};
		var url = Base.serverUrl + "getSponsors";
		//g.httpTip.show();
		$.ajax({
			url:url,
			data:condi,
			timeout: 30000, //超时时间设置，单位毫秒
			type:"POST",
			dataType:'json',
			context:this,
			success: function(data){
				var status = data.success || false;
				if(status){
					var data = data.result || [];
					var html = '';
					for(var i=0,len=data.length;i<len;i++){
						var d = data[i] || [];
						var id = d.id || '';
						var name = d.name || '';
						var code = d.code || '';
						html += '<li tip="'+code+'">'+name+'</li>';
					}
					$('.choiseDanwei4').html(html);
				}
				else{
					var msg = data.message || "失败";
					//Utils.alert(msg);
				}
				//g.httpTip.hide();
			},
			error:function(data,status){
				//g.httpTip.hide();
				if(status=='timeout'){
		　　　　　  Utils.alert("超时");
		　　　　}
			}
		});
	}	
	//初始化弹窗
	function reloadSbox(){
		$('.showhide').hide();//隐藏协议编号
		$('.choiseDanwei li').removeClass('active');//清空弹窗的选择项
		$('.xiugaizhongxin input').val('');//清空弹窗
		$('.xiugaizhongxin select').val('');//清空弹窗
		$('#noBtn').html('取消');
		$('#yesBtn').off().show();
	}	
	//显示新建窗口
	function shownewCenterSbox(){
		reloadSbox();//初始化弹窗
		$('.xiugaizhongxin .sbox_h4').html('新增保密协议');
		showSbox('.xiugaizhongxin');//显示弹窗
		$('#yesBtn').off().on('click',function(){centerFunc('new')});
	}
	//新建
	window.centerFunc = function(is,id){
		var is = is || '';
		var id = id || '';
		var shenbanfangsbox = $('#shenbanfangsbox').val() || '';
		var xianmgunamesbox = $('#xianmgunamesbox').val() || '';
		var xieyinumsbox = $('#xieyinumsbox').val() || '';
		if(shenbanfangsbox == ''){Utils.alert('申办方不能为空！');return false;}
		if(xianmgunamesbox == ''){Utils.alert('项目名称不能为空！');return false;}
		$('#yesBtn').off();
		var condi = {};
		condi.page = g.nowPage;//当前页
		condi.number = g.showPages;//每页显示行数
		condi.id  = id;
		condi.sponsor  = shenbanfangsbox;
		condi.code = xieyinumsbox;
		condi.project_name  = xianmgunamesbox;
		var url = Base.serverUrl + "confident/create";
		if(is == 'change'){condi.id = id;url = Base.serverUrl + "confident/update";}
		//g.httpTip.show();
		$.ajax({
			url:url,
			data:condi,
			timeout: 30000, //超时时间设置，单位毫秒
			type:"GET",
			dataType:'json',
			context:this,
			success: function(data){
				var status = data.success || false;
				if(status){
					var tips = '新增成功！';
					if(is == 'change'){tips = '修改成功！';}
					Utils.alert(tips);
					getProjectList(2);//列表
					closeSbox();//关闭弹窗
				}
				else{
					var msg = data.message || "失败";
					Utils.alert(msg);
					$('#yesBtn').off().on('click',function(){centerFunc('new')});
				}
				//g.httpTip.hide();
			},
			error:function(data,status){
				//g.httpTip.hide();
				$('#yesBtn').off().on('click',function(){centerFunc('new')});
				if(status=='timeout'){
		　　　　　  //Utils.alert("超时");
		　　　　}
			}
		});
	}
	
	//导出保密协议
	window.daochu = function(id){
		var id = id || '';
		if(id == ''){Utils.alert('id不能为空！');return false;}
		var url = Base.serverUrl + "confident/word?id="+id;
		window.open(url);
		//location.href = url;
	}
	//修改
	window.change = function(id){
		showOrChange(id,'change');
	}
	//修改
	window.showOrChange = function(id,is){
		var id = id || '';
		var is = is || '';
		if(id == ''){Utils.alert('id不能为空！');return false;}
		var condi = {};
		condi.id = id;
		var url = Base.serverUrl + "confident/edit";
		//g.httpTip.show();
		$.ajax({
			url:url,
			data:condi,
			timeout: 30000, //超时时间设置，单位毫秒
			type:"GET",
			dataType:'json',
			context:this,
			success: function(data){
				var status = data.success || false;
				if(status){
					var d = data.result || {};
					
					reloadSbox();//初始化弹窗
					//赋值
					$('#shenbanfangsbox').val(d.sponsor || '');
					$('#xianmgunamesbox').val(d.project_name || '');
					$('#xieyinumsbox').val(d.code || '');
					$('.showhide').show();
					$('#yesBtn').off().on('click',function(){centerFunc('change',id)});
					$('.xiugaizhongxin .sbox_h4').html('修改保密协议');
					showSbox('.xiugaizhongxin');//显示弹窗
				}
				else{
					var msg = data.message || "失败";
					Utils.alert(msg);
				}
				//g.httpTip.hide();
			},
			error:function(data,status){
				//g.httpTip.hide();
				if(status=='timeout'){
		　　　　　  Utils.alert("超时");
		　　　　}
			}
		});
	}
	//获取所有项目列表
	function getProjectList(is){
		var is = is || '';
		var condi = {};
		condi.page = g.nowPage;//第几页 0 是第一页
		condi.number = g.showPages;//每页显示多少个
		if(is == 1){//搜索
			condi.code = $('#serial').val() || '';
			condi.project_name = $('#name').val() || '';
			condi.sponsor = $('#sponsor').val() || '';
			condi.member = $('#maker').val() || '';
			condi.create_head = $('#start_time').val() || '';
			condi.create_tail = $('#end_time').val() || '';
			g.loadPage = true;//开启分页
		}else if(is == 2){//搜索全部
			$('#serial,#name,#sponsor,#maker,#user,#start_time,#end_time').val('');
			condi.code = '';
			condi.project_name = '';
			condi.member = '';
			condi.sponsor = '';
			condi.create_head = '';
			condi.create_tail = '';
			g.loadPage = true;//开启分页
		}
		var url = Base.serverUrl + "confident/search";
		//g.httpTip.show();
		$.ajax({
			url:url,
			data:condi,
			timeout: 30000, //超时时间设置，单位毫秒
			type:"POST",
			dataType:'json',
			context:this,
			success: function(data){
				var status = data.success || false;
				if(status){
					var ds = data.result || [];
					var data = ds.content || [];
					var totalPages = ds.totalPages || 0;//总页数
					g.totalPage = totalPages;
					var totalElements = ds.totalElements || 0;
					var html = '<table class="table1 tables">'
								+'<tr>'
									+'<th style="min-width:85px;">保密协议编号</th>'
									+'<th style="min-width:70px;">申办方</th>'
									+'<th style="min-width:80px;">项目名称</th>'
									+'<th style="min-width:49px;">创建人</th>'
									+'<th style="min-width:53px;">创建时间</th>'
									+'<th style="min-width:100px;">操作</th>'
								+'</tr>';
					for(var i=0,len=data.length;i<len;i++){
						var ss = i;
						var d = data[i] || [];
						var id = d.id || '';
						var code = d.code || '';
						var sponsor = d.sponsor || '';
						var user_name = d.user_name || '';
						var project_name = d.project_name || '';
						var create_time = getDate(d.create_time || '');
						html +='<tr>'
							+'<td class="snum">'+code+'</td>'
							+'<td class="proName">'+sponsor+'</td>'
							+'<td class="spons">'+project_name+'</td>'
							+'<td>'+user_name+'</td>'
							+'<td>'+create_time+'</td>'
							+'<td class="last">';
							html +='<a href="javascript:;" onclick="change(\''+id+'\')" class="cao_btn cao_btn1">编辑</a>';
							html +='<a href="javascript:;" onclick="daochu(\''+id+'\')" class="cao_btn cao_btn2">导出</a>';
							html +='</td>'
						+'</tr>';
					}
					html +='</table>';
					$('#listTable').html(html);
					//加载分页
					if(g.loadPage){
						setPages();//分页
						if($('#Pagination').html() == ''){//判断是否显示分页跳转等
							$('.pagesShow,.page-go,.gogo').hide();
						}else{
							$('.pagesShow,.page-go,.gogo').show();
						}
						g.loadPage = false;
					}
				}
				else{
					var msg = data.message || "获取失败";
					Utils.alert(msg);
				}
				//g.httpTip.hide();
			},
			error:function(data,status){
				//g.httpTip.hide();
				if(status=='timeout'){
		　　　　　  Utils.alert("超时");
		　　　　}
			}
		});
	}

	//分页
	function setPages(){
		$("#Pagination").pagination(g.totalPage,{
			callback: PageCallback,            
			 prev_text: '上一页',             
			 next_text: '下一页',
			 current_page:g.nowPage
		});
		$('.allPage').html(g.totalPage);
	}
	function PageCallback(index, jq){
		  g.nowPage = index || 0;
		  getProjectList();
	 }
	

	//加载时间控件
	var start = {
	  elem: '#start_time',
	  format: 'YYYY-MM-DD hh:mm:ss',
	  //min: laydate.now(), //设定最小日期为当前日期
	  max: '2099-06-16', //最大日期
	  istime: true,
	  istoday: false,
	  choose: function(datas){
		 //end.min = datas; //开始日选好后，重置结束日的最小日期
		 //end.start = datas //将结束日的初始值设定为开始日
	  }
	};
	var end = {
	  elem: '#end_time',
	  format: 'YYYY-MM-DD hh:mm:ss',
	  //min: laydate.now(),
	  max: '2099-06-16',
	  istime: true,
	  istoday: false,
	  choose: function(datas){
		start.max = datas; //结束日选好后，重置开始日的最大日期
	  }
	};
	laydate(start);
	laydate(end);

	
	
	
	
	
});
