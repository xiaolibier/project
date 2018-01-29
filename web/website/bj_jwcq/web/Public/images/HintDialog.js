// JavaScript Document

/**
 * ��ʾ�Ի���
 * ������HTMLԪ���ϵ�title��ʾ��������ʾ�Ի������ͨ��ʵ�����Ի������Ҳ����ͨ����ʾ�Ի���ĸ���
 * ���߽���ע�ᡣ
 * 
 * example:
 * 	  new HintDialog($('text'));������һ��Ĭ����ʾ�Ի�����HTML IDΪtext��HTMLԪ�ذ󶨣�
 * �����ݡ�Ĭ�Ͽ�ȡ�Ĭ�ϴ����¼�(������ʵ����ʱ����ʾ�Ի���)��
 * 	  new HintDialog($('text'), 'This a hint dialog', {width: '300px', showEvent: 'click'});
 * ������һ����ʾ�Ի�����HTML IDΪtext��HTMLԪ�ذ󶨣����Ϊ300px���������ڵ����HTMLԪ�غ���ʾ�Ի���
 *    
 *    HintDialog.register($('text'));ע��һ��Ĭ����ʾ�Ի���
 * 	  HintDialog.register($('text'), 'This a hint dialog', {width: '300px', showEvent: 'click'});
 * ע��һ�������ݡ�����ѡ�����ʾ�Ի���
 * 
 * ��ʾ�Ի������õ�����ʽ��Ĭ�϶�����dialog.css�У�
 * 	  hint-dialog-top-line���Ի��򶥲�������ʽ
 * 	  hint-dialog-arrow���Ի����ͷ��ʽ
 *    hint-dialog-content���Ի������ݲ�����ʽ
 *    hint-dialog-content-text���Ի�������������ʽ
 */
var $ = function(s)
{
	return (typeof s == "object") ? s: document.getElementById(s);
};
 //��ʼ��һ����
var Class = {
  create: function() {
    return function() {
      this.initialize.apply(this, arguments);
    }
  }
}
HintDialog = Class.create();
var url = document.URL.toLowerCase();

/**
 * ��������ʾ�Ի����HTML ID��
 * 
 */
HintDialog.id = "__widget_hint_dialog";
HintDialog.register = function(obj, msg, options){
	if(!obj)
		return;

	new HintDialog(obj, msg, options);
}

HintDialog.prototype = {
	
	/**
	 * ��ʾ��Ϣ
	 * 
	 */
	_msg : "",
	
	_obj : null,
	
	/*------------------ initializer --------------*/
	
	/**
	 * ���캯����
	 * 
	 * @param Object obj ��Ҫ�󶨵ı��ؼ�
 	 * @param String msg ��ʾ��Ϣ
 	 * @param Array options ��ʾ�Ի����ѡ�� 
	 */
	initialize : function(obj, msg, options){
		
		if(!obj)
			return;
	    var tempList = document.getElementsByTagName("DIV");
		
	    for(var i=0;i<tempList.length;i++){
	        if(tempList[i].className=="accurate" || tempList[i].className=="error"){
	           tempList[i].style.display = "none";
	        }
	    }
	    try{
	        SetTabPageHW(top.window.loadingIframeId);
	    }
	    catch(e){}
		this._msg = (msg) ? msg : "";
		this._options = {
			width : "",
			topOffset : 10,
			leftOffset : -10,
			showEvent : null,
			hideEvent : "blur"
		}
		
		this._obj = obj;
		
		if (this._options.showEvent != null){
			Event.observe(this._obj, this._options.showEvent, 
				this._showHint.bindAsEventListener(this), false);
		}else {
			this._showHint();
		}
		
		Event.observe(this._obj, this._options.hideEvent, 
			this._hideHint.bindAsEventListener(this), false);
		
	},
	
	/*----------- private methods ---------------------*/
	
	/**
	 * ��ʾ�Ի���
	 * 
	 */
	_showHint : function(){
	
		if ($(HintDialog.id))
			return;
		
		var objPosition = Utils.getAbsolutePos(this._obj);
		//if(this._obj.id == "txtPassword" && url.indexOf("logon.aspx")>-1){
		    objPosition.y -=  54;
		//}
		var box = document.createElement("DIV");
			box.id = HintDialog.id;
		with(box.style){
			position = "absolute";
			top = (objPosition.y+this._options.topOffset) + "px";
			left = (objPosition.x+this._options.leftOffset) + "px";
			width = this._options.width;
		}
		/*
		 * װ��Ի���ͷ��
		 * 
		 */
		//box.appendChild(this._generateHeader());
		
		/*
		 * װ��Ի�������
		 */
		box.appendChild(this._generateContent());
		
		document.body.appendChild(box);
		
		if (Utils.isIE)
			Utils.hideShowCovered(box);
	},
	
	/**
	 * ���ضԻ���
	 * 
	 */
	_hideHint : function(){
		var obj = $(HintDialog.id);
		if (!obj)
			return;
		
		document.body.removeChild(obj);
		
		if (Utils.isIE)	
			Utils.hideShowCovered(obj);
		
	},
	
	/**
	 * ���ɶԻ���ͷ��������ͷ���֣�������HTMLԪ�ء�
	 * 
	 * @return Div
	 */
	_generateHeader : function(){
		var header = document.createElement("DIV");
			header.className = "hint-dialog-top-line";
			header.style.width = "100%";
			
		var arrow = document.createElement("DIV");
			arrow.className = "hint-dialog-arrow";
			
		header.appendChild(arrow);
		return header;
	},
	
	/**
	 * ���ɶԻ������ݲ��֣�������HTMLԪ�ء�
	 * 
	 * @return Div
	 */
	_generateContent : function(){
		var width = (Utils.getComputedStyle(this._options.width)-2) + "px";
		
		var content = document.createElement("DIV");
			//content.style.width = width;
		
		var contentPadder = document.createElement("DIV");
			//contentPadder.style.width = width;
			
		var msg = document.createElement("DIV");
			//msg.className = "hint-dialog-content-text";	     
//	    if(this._obj.id != "txtPassword"){
//	        this._msg = "<div style=\"margin-top:15px; height:30px;\">"
//	                  + "<div style=\"float:left;\"><img src=\"images/text_content-left.gif\" /></div>"
//	                  + "<div style=\"float:left; height:24px; background:url(images/text_content-bg.gif); line-height:24px; color:#265972;\">"
//	                  + this._msg
//	                  + "</div>"
//	                  + "<div style=\"float:left;\"><img src=\"images/text_content-right.gif\" /></div>"
//	                  + "</div>"
//	                  + "<div style=\"clear:both;\"></div>"
//	                  + "<div style=\"margin-left:40px; width:80px; margin-top:-42px;\"><img src=\"images/top_angle.gif\" /></div>";
//	    }
//	    else if(url.indexOf("logon.aspx")>-1){
			this._msg = "<div style=\"margin-top:15px; height:30px;\">"
			          + "<div style=\"float:left;\"><img src=\"images/text_content-left.gif\" /></div>"
			          + "<div style=\"float:left; height:24px; background:url(images/text_content-bg.gif); line-height:24px; color:#265972;\">"
			          + this._msg
			          + "</div>"
			          + "<div style=\"float:left;\"><img src=\"images/text_content-right.gif\" /></div>"
			          + "</div>"
			          + "<div style=\"clear:both;\"></div>"
			          + "<div style=\"margin-left:40px; width:80px; margin-top:-9px; position:absolute;\"><img src=\"images/buttom_angle.gif\" /></div>";
//		}
	    msg.innerHTML = this._msg;
			
		with(msg.style){
			//width = (Utils.getComputedStyle(this._options.width)-12) + "px";
			overflow = "hidden";
		}
		
		contentPadder.appendChild(msg);
		content.appendChild(contentPadder);
		
		return content;
	}
}