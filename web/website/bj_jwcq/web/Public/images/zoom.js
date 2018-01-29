window.addEventListener?
  window.addEventListener("load",initZoom,false):
  window.attachEvent("onload",initZoom);

function initZoom(){
  //////////
  //by mozart0, 2007.05.29
  //////////
  var mask=document.body.appendChild(document.createElement("img"));
  var timer=null;
  //////////
  with(mask.style){
    position="absolute";
    backgroundColor="rgb(198,228,255)";
    margin="0px";
    padding="0px";
    zIndex="999";
    }
  mask.onmouseout=function(){
    if(timer){
      clearTimeout(timer);
      timer=null;
      }
    setRect(this,[-100,-100,50,50]);
    };
  mask.onmouseout();
  //////////
  for(var i=0,m=document.images;i<m.length;i++){
    if(!/^zoom/.test(m[i].getAttribute("rel")))
      continue;
    m[i].onmouseover=function(){
      var scale=this.getAttribute("rel").split("#");
      scale=scale.length>1?parseFloat(scale[1]):2;
      zoomMask(this,scale,this.getAttribute("urn"),this.parentNode);
      };
    }
  //////////
  function zoomMask(ele,scale,url,oparent){
  	if(oparent.tagName=="A"){
  		mask.style.cursor="pointer";
  		mask.alt=oparent.href;
  		mask.onclick=function(){
  			location.href=this.alt;
  			}
  		}
  	else{
  		mask.style.cursor="";
  		mask.title="";
  		mask.onclick=null;
  		}
    var ra=getRect(ele),rb=zoomRect(ra,scale);
    var d=(rb[3]/ra[3]-1)/10,p=0;
    mask.src=url||ele.src;
    mask.onmouseout();
    (function(){
      if(++p<10){
        setRect(mask,zoomRect(ra,1+p*d));
        timer=setTimeout(arguments.callee,15);
        }
      else{
        setRect(mask,rb);
        timer=null;
        }
      })();
    }
  function zoomRect(rect,scale){
    var r=rect.slice(0,4);
    r[0]+=r[2]*(1-scale)*0.5;
    r[1]+=r[3]*(1-scale)*0.5;
    r[2]*=scale;
    r[3]*=scale;
    return r;
    }
  //////////
  var _firefox=navigator.userAgent.indexOf("Firefox")>=0;
  var _opera=navigator.userAgent.indexOf("Opera")>=0;
  var _ie=!_firefox&&!_opera;
  //////////
  function getRect(obj){
    var left=0,top=0;
    var width=obj.offsetWidth,height=obj.offsetHeight;
    var op=obj,st;
    var abs=false;
    if(_firefox)
      while((op=op.parentNode).tagName!="HTML"){
        var st=getComputedStyle(op,null);
        if(st.MozBoxSizing!="border-box"){
          left+=parseInt(st.borderLeftWidth);
          top+=parseInt(st.borderTopWidth);
          }
        }
    while(true){
      left+=obj.offsetLeft;
      top+=obj.offsetTop;
      if(!(op=obj.offsetParent))
        break;
      if(_ie){
        left+=op.clientLeft;
        top+=op.clientTop;
        if(!abs&&obj.currentStyle.position=="absolute")
          abs=true;
        }
      obj=op;
      }
    if(_ie){
      if(!document.documentElement.clientWidth){
        var t=document.body.currentStyle;
        var lx=parseInt(t.borderLeftWidth);
        var tx=parseInt(t.borderTopWidth);
        left-=isNaN(lx)?2:lx;
        top-=isNaN(tx)?2:tx;
        }
      else if(abs){
        left-=2;
        top-=2;
        }
      }
    return [left,top,width,height];
    }
  function setRect(obj,rect){
    with(obj.style){
      left=Math.round(rect[0])+"px";
      top=Math.round(rect[1])+"px";
      width=Math.round(rect[2])+"px";
      height=Math.round(rect[3])+"px";
      }
    }
  }