/**
 * 封装ztree由其他dom拖拽到tree上的方法
 * 定义： 1.在页面初始化方法中调用DomDragToZtree.bindDom()方法，初始化鼠标点击对象事件
 * 		2.必须在拖拽的对象加入class='ztree-draggable'
 * 		3.在自定义js的setting的callback中自定义onMouseUp事件来执行ztree的addNodes方法
 */
var DomDragToZtree = function(){
	return {
		/** 拖动的源html对象 */
		sourceTarget: null, 
		
		/** 拖动中跟着鼠标移动的<span> */
		sourceTmpTarget: null,
		
		drag_target	: ".ztree-draggable",
		/**
		 * 给dom绑定mousedown事件
		 */
		bindDom: function() {
			//$(document).bind("mousedown", DomDragToZtree.bindMouseDown);
			//delegate() 方法为指定的元素（属于被选元素的子元素）添加一个或多个事件处理程序，并规定当这些事件发生时运行的函数。
			$(document).delegate(DomDragToZtree.drag_target, "mousedown", DomDragToZtree.bindMouseDown);
		},
		/**
		 * mousedown事件执行的方法
		 */
		bindMouseDown: function(e) {
			var target = e.target;
			//if (target!=null&&$(target).hasClass('ztree-draggable')) {
				var doc = $(document), target = $(target),
				docScrollTop = doc.scrollTop(),
				docScrollLeft = doc.scrollLeft();
				
				if (DomDragToZtree.sourceTmpTarget) DomDragToZtree.sourceTmpTarget.remove();
				
				var curDom = $("<span class='drag_ztree_div_tmp drag_ztree_div'>" + target.text() + "</span>");
				curDom.appendTo("body");

				curDom.css({
					"top": (e.clientY + docScrollTop + 3) + "px",
					"left": (e.clientX + docScrollLeft + 3) + "px"
				});
				DomDragToZtree.sourceTarget = target;
				DomDragToZtree.sourceTmpTarget = curDom;

				doc.bind("mousemove", DomDragToZtree.bindMouseMove);
				doc.bind("mouseup", DomDragToZtree.bindMouseUp);
			//}
			if(e.preventDefault) {
				e.preventDefault();
			}
		},
		/**
		 * mousemove 鼠标移动事件的方法
		 */
		bindMouseMove: function(e) {
			var doc = $(document), 
			docScrollTop = doc.scrollTop(),
			docScrollLeft = doc.scrollLeft(),
			tmpTarget = DomDragToZtree.sourceTmpTarget;
			if (tmpTarget) {
				tmpTarget.css({
					"top": (e.clientY + docScrollTop + 3) + "px",
					"left": (e.clientX + docScrollLeft + 3) + "px"
				});
			}
			return false;
		},
		/**
		 * mouseup 鼠标结束的方法
		 */
		bindMouseUp: function(e,node) {
			var doc = $(document);
			doc.unbind("mousemove", DomDragToZtree.bindMouseMove);
			doc.unbind("mouseup", DomDragToZtree.bindMouseUp);
			var target = DomDragToZtree.sourceTarget, tmpTarget = DomDragToZtree.sourceTmpTarget;
			if (tmpTarget) tmpTarget.remove();
			DomDragToZtree.sourceTarget = null;
			DomDragToZtree.sourceTmpTarget = null;
		},
		/**
		 * 根据id检查在父级中是否唯一
		 * 参数：treeid 树的id
		 * 		key: 需要精确匹配的属性名称
		 * 		value :需要精确匹配的属性值，可以是任何类型，只要保证与 key 指定的属性值保持一致即可
		 * 		parentNode 可以指定在某个父节点下的子节点中搜索.忽略此参数，表示在全部节点中搜索
		 */
		check_unique:function(treeId,key,value,parentNode){
			var searchNodes = $.fn.zTree.getZTreeObj(treeId).getNodesByParam(key,value,parentNode);
			var flag = false; //true说明在该parentNode中存在这个节点
			if(searchNodes.length==0){
				flag = false;
			}else{
				for(var i = 0;i<searchNodes.length;i++){
					if(searchNodes[i].parentTId == parentNode.tId){
						flag = true;
					}
				}
			}
			return flag;
		},
		empty: null
	}
}();


