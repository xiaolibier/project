// JavaScript Document
    //创建和初始化地图函数：
    function initMap(p){
        createMap(p);//创建地图
        setMapEvent();//设置地图事件
        addMapControl();//向地图添加控件
        addMarker(p);//向地图中添加marker
    }
    var mapp = [[116.358871,39.946925],[104.083039,30.629063],[114.275361,30.586279],[121.609443,31.202575]];
    var adds = [['北京经纬传奇医药科技有限公司（北京）','北京市西城区西直门西环广场T1座20层'],
	['北京经纬传奇医药科技有限公司（成都分公司）','成都市武侯区科华北路62号力宝大厦北楼701室'],
	['北京经纬传奇医药科技有限公司（武汉分公司）','武汉市江汉区解放大道686号世贸大厦2903-2904室'],
	['北京经纬传奇医药科技有限公司（上海分公司）','上海市张江高科技园区哈雷路898弄1号楼305室']];
    //创建地图函数：
    function createMap(p){
        var p = p || 0;
		var map = new BMap.Map("dituContent");//在百度地图容器中创建一个地图
        var point = new BMap.Point(mapp[p][0],mapp[p][1]);//定义一个中心点坐标
        map.centerAndZoom(point,18);//设定地图的中心点和坐标并将地图显示在地图容器中
        window.map = map;//将map变量存储在全局
    }
    
    //地图事件设置函数：
    function setMapEvent(){
        map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
        map.enableScrollWheelZoom();//启用地图滚轮放大缩小
        map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
        map.enableKeyboard();//启用键盘上下左右键移动地图
    }
    
    //地图控件添加函数：
    function addMapControl(){
        //向地图中添加缩放控件
	var ctrl_nav = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:BMAP_NAVIGATION_CONTROL_LARGE});
	map.addControl(ctrl_nav);
        //向地图中添加缩略图控件
	var ctrl_ove = new BMap.OverviewMapControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT,isOpen:1});
	map.addControl(ctrl_ove);
        //向地图中添加比例尺控件
	var ctrl_sca = new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT});
	map.addControl(ctrl_sca);
    }
    
    //标注点数组
    //创建marker
    function addMarker(p){
		var p = p || 0;
		var markerArr = [{title:adds[p][0],content:adds[p][1],point:"116.427696|39.955105",isOpen:1,icon:{w:21,h:21,l:0,t:0,x:6,lb:5}}];
        for(var i=0;i<markerArr.length;i++){
            var json = markerArr[i];
            var p0 = mapp[p][0];//json.point.split("|")[0];
            var p1 = mapp[p][1];//json.point.split("|")[1];
            var point = new BMap.Point(p0,p1);
			var iconImg = createIcon(json.icon);
            var marker = new BMap.Marker(point,{icon:iconImg});
			var iw = createInfoWindow(i,p);
			var label = new BMap.Label(json.title,{"offset":new BMap.Size(json.icon.lb-json.icon.x+10,-20)});
			marker.setLabel(label);
            map.addOverlay(marker);
            label.setStyle({
                        borderColor:"#808080",
                        color:"#333",
                        cursor:"pointer"
            });
			
			(function(){
				var index = i;
				var _iw = createInfoWindow(i,p);
				var _marker = marker;
				_marker.addEventListener("click",function(){
				    this.openInfoWindow(_iw);
			    });
			    _iw.addEventListener("open",function(){
				    _marker.getLabel().hide();
			    })
			    _iw.addEventListener("close",function(){
				    _marker.getLabel().show();
			    })
				label.addEventListener("click",function(){
				    _marker.openInfoWindow(_iw);
			    })
				if(!!json.isOpen){
					label.hide();
					_marker.openInfoWindow(_iw);
				}
			})()
        }
    }
    //创建InfoWindow
    function createInfoWindow(i,p){
		var markerArr = [{title:adds[p][0],content:adds[p][1],point:"116.427696|39.955105",isOpen:1,icon:{w:21,h:21,l:0,t:0,x:6,lb:5}}];
        var json = markerArr[i];
        var iw = new BMap.InfoWindow("<b class='iw_poi_title' title='" + json.title + "'>" + json.title + "</b><div class='iw_poi_content'>"+json.content+"</div>");
        return iw;
    }
    //创建一个Icon
    function createIcon(json){
        var icon = new BMap.Icon("http://app.baidu.com/map/images/us_mk_icon.png", new BMap.Size(json.w,json.h),{imageOffset: new BMap.Size(-json.l,-json.t),infoWindowOffset:new BMap.Size(json.lb+5,1),offset:new BMap.Size(json.x,json.h)})
        return icon;
    }
    
    initMap(0);//创建和初始化地图
