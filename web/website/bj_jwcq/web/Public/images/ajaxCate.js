// JScript 文件
            var Language = "CN";
	        function ExpandSubCategory(iCategoryID,FahterID)
		    {

			    var li_father = document.getElementById("li_" + iCategoryID);
			    if (li_father.getElementsByTagName("li").length > 0) //如果已经加载了下级节点则直接展开，不必在去读取数据
			    {
				    ChangeStatus(iCategoryID);
				    return;
			    }
    			
			    li_father.className = "Opened";
			    //打开时显示稍等
			    switchNote(iCategoryID, true);
			    //AJAX回调函数，加载节点
			    
			    Dcms.BLL.Dcms_CategoryBLL.GetSubCategory(iCategoryID,Language, GetSubCategory_callback);				
		    }
            function ExpandSubCategoryAgain(iCategoryID,FahterID)
		    {

			    var li_father = document.getElementById("li_" + iCategoryID);
			    li_father.className = "Opened";
			    //打开时显示稍等
			    switchNote(iCategoryID, true);
			    //AJAX回调函数，加载节点
			    
			    Dcms.BLL.Dcms_CategoryBLL.GetSubCategory(iCategoryID,Language, GetSubCategory_callback);				
		    }
		    function GetSubCategory_callback(response)
		    {
			    var dt = response.value.Tables[0];
			    if (dt.Rows.length > 0)
			    {
				    var iCategoryID = dt.Rows[0].Cate_ParentID;
			    }
			    var li_father = document.getElementById("li_" + iCategoryID);
			    var ul_sub = document.getElementById("ulTree_" + iCategoryID); 
			    if(ul_sub != null){
			        li_father.removeChild(ul_sub)
			    }
			    var ul = document.createElement("ul");
			    ul.id = "ulTree_"+ iCategoryID
			    for (var i = 0;i < dt.Rows.length;i++)
			    {
				    if (dt.Rows[i].Cate_IsChild == 1) //如果已没有下一级节点
				    {
					    var li = document.createElement("li");
					    li.className = "Child";
					    li.id = "li_" + dt.Rows[i].Cate_ID;
    					
					    var img = document.createElement("img");
					    img.id = dt.Rows[i].Cate_ID;
					    img.className = "s";
					    img.src = "../../css/s.gif";
    					
					    var a = document.createElement("a");
					    var id = dt.Rows[i].Cate_ID;
    					
					    a.href = "javascript:OpenDocument('" + dt.Rows[i].Cate_ID + "','" + dt.Rows[i].Cate_Name + "');";
					    a.innerHTML = dt.Rows[i].Cate_Name.sub(14);
					    a.title = dt.Rows[i].Cate_Name;
				    }
				    else    //如果还有下级节点
				    {
					    var li = document.createElement("li");
					    li.className = "Closed";
					    li.id = "li_" + dt.Rows[i].Cate_ID;
    					
					    var img = document.createElement("img");
					    img.id = dt.Rows[i].Cate_ID;
					    img.className = "s";
					    img.src = "../../css/s.gif";
					    img.onclick = function () {
						    ExpandSubCategory(this.id);
					    };
					    img.alt = "展开/折叠";
    					
					    var a = document.createElement("a");
					    a.href = "javascript:ExpandSubCategory(" + dt.Rows[i].Cate_ID + ",'editCate');";
					    a.innerHTML = dt.Rows[i].Cate_Name.sub(14);
					    a.title = dt.Rows[i].Cate_Name;
				    }
				    li.appendChild(img);
				    li.appendChild(a);
				    ul.appendChild(li);	
			    }
			    li_father.appendChild(ul);
			    //先显示稍等。。。
			    switchNote(iCategoryID, false);
		    }
    		
		    // 叶子节点的单击响应函数
		    function OpenDocument(iCategoryID,Action)
		    {
			    inputName.value = Action;
			    inputID.value = iCategoryID;
		    }
		    function ChangeStatus(iCategoryID)
		    {
			    var li_father = document.getElementById("li_" + iCategoryID);
			    if (li_father.className == "Closed")
			    {
				    li_father.className = "Opened";
			    }
			    else
			    {
				    li_father.className = "Closed";
			    }				
		    }

		    function switchNote(iCategoryID, show)
		    {
			    var li_father = document.getElementById("li_" + iCategoryID);
			    if (show)
			    {
				    var ul = document.createElement("ul");
				    ul.id = "ul_note_" + iCategoryID;
    				
				    var note = document.createElement("li");
				    note.className = "Child";
    				
				    var img = document.createElement("img");
				    img.className = "s";
				    img.src = "../../css/s.gif";
    				
				    var a = document.createElement("a");
				    a.href = "javascript:void(0);";
				    a.innerHTML = "请稍候...";
    				
				    note.appendChild(img);
				    note.appendChild(a);
				    //ul.appendChild(note);
				    li_father.appendChild(ul);
			    }
			    else
			    {
				    var ul = document.getElementById("ul_note_" + iCategoryID);
				    if (ul)
				    {
					    li_father.removeChild(ul);
				    }				
			    }
		    }
            var inputID,inputName
            function InitTree(obj,idObj,FatherID,Lang)
            {
		        // 加载根节点
		       // writeDiv();
		       Language = Lang;
		       inputName = obj;
		       inputID = idObj;
		        var pos = getPosition(inputName);
		        var tree = document.getElementById("cateDivTree");
		        var root = document.createElement("li");
		        var objshow = document.getElementById("opencateDiv");
		        objshow.style.top = pos[1]+pos[3] + "px";
                objshow.style.left = pos[0]+"px";
	            objshow.style.display = "block";
	            tree.style.display = "block";
		        root.id = "li_"+FatherID;
		        tree.appendChild(root);
        		
		        // 加载页面时显示第一级分类
		        ExpandSubCategory(FatherID);
		    }
		    writeDiv();
		    function writeDiv(){
		        document.write("<div id='opencateDiv' style='position:absolute;display:none;z-index:1000;width:200px;height:250px;'>");
		        document.write("<div class='divClose'>请选择分类 <a href=\"#\" title=\"关闭\" onclick=\"shut()\">×</a>&nbsp;&nbsp;</div>");
                document.write("<div id='cateDivTree' class='TreeMenu' style='display:block;height:250px;'>");
                document.write("</div></div>");
                
		    }
		    function getPosition(obj){
                if(obj){
                var w=obj.offsetWidth;
                var h=obj.offsetHeight;
                if(obj.offsetParent){
                for(var posX=0,posY=0;obj.offsetParent;obj=obj.offsetParent){
                posX+=obj.offsetLeft;
                posY+=obj.offsetTop;}
                return[posX,posY,w,h];}else{
                return[obj.x,obj.y,w,h];}}else{
                return[0,0,0,0];}
                }
                function shut(){
                   close11();
                }
                function close11(){
                   var objshow = document.getElementById("opencateDiv");
                   objshow.style.display = "none"
                   objshow.style.top = 0;
                   objshow.style.left = 0;
}
String.prototype.sub = function(n)
{
  var r = /[^\x00-\xff]/g;
  if(this.replace(r, "mm").length <= n) return this;
  n = n - 3;
  var m = Math.floor(n/2);
  for(var i=m; i<this.length; i++)
  {
    if(this.substr(0, i).replace(r, "mm").length>=n)
    {
      return this.substr(0, i) +"...";
    }
  }
  return this;
};