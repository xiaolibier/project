// JavaScript Document
function CheckAll(form){
	for (var i=0;i<form.elements.length;i++){
		var e = form.elements[i];
		if (e.name != 'chkall' && e.ename!='chfx')
		e.checked = form.chkall.checked;
	}
}

function ShowDialog(url, width, height) {
	window.showModalDialog(url, window, "dialogWidth:" + width + "px;dialogHeight:" + height + "px;help:no;scroll:no;status:no");
	//showModalDialog创建一个显示指定 HTML 文档的模式对话框。
}

function InputNum()
{
	if ( !(((window.event.keyCode >= 48) && (window.event.keyCode <= 57)) || (window.event.keyCode == 13) || (window.event.keyCode == 45)))
	{
	window.event.keyCode = 0 ;
	}
}

function replace(s, t, u) {
   i = s.indexOf(t);
   r = "";
   if (i == -1) return s;
   r += s.substring(0,i) + u;
   if ( i + t.length < s.length)
     r += replace(s.substring(i + t.length, s.length), t, u);
   return r;
}

function IsNum(cstr)
{
	var tempstr = "1234567890"; 
	var k;
				
	for(var i=0;i<cstr.length;i++)
	{
		k = tempstr.indexOf(cstr.charAt(i));
		if  (k == -1)
		{
			return false;
		}
	}	
	return true;	
}

function IsDate(str)
{
	var re=/^(\d{4})-(\d{1,2})-(\d{1,2})$/
	if(!re.test(str))return false;
	var r=str.match(re)
	var d=new Date(r[1],r[2]-1,r[3])
	return d.getFullYear()==r[1] && d.getMonth()==r[2]-1 && d.getDate()==r[3]
}

function IsEmail(str){
  var nLen;
  var nCnt1, nCnt2;
  nCnt1=0;
  nCnt2=0;
  nLen = str.length;
  for(var i=0; i<nLen; i++){
      if(str.charAt(i)==' '){
          return false;}
      if(str.charAt(i)=='\'' || str.charAt(i)=='\"'){
          return false;}
      if(str.charAt(i)=='<' || str.charAt(i)=='>' ){
          return false;}
      if(str.charAt(i)=='@'){
          nCnt1++;}
      if(str.charAt(i)=='.'){
          nCnt2++;}
  }
  if( nCnt1!=1 || nCnt2<1){
      return false;
  }
  else
      return true;
}

function IsChecked(FormObject,FieldName,Str){
	if (typeof(FormObject)=="undefined"){FormObject = document.all;}
	var CheckedCount = 0;
	if (typeof(FormObject[FieldName].length)=="undefined"){
		if (FormObject[FieldName].checked == true){CheckedCount++;}
	}else{
		for (var t=0;t<FormObject[FieldName].length;t++){
			if (FormObject[FieldName][t].checked == true){CheckedCount++;}
		}
	}
	if (typeof(Str)!="undefined" && Str!="" && CheckedCount==0){
		alert(Str);
	}
	return CheckedCount;
}

function IsInput(FormObject,FieldName,Str){
	if (typeof(FormObject)=="undefined"){FormObject = document.all;}
	if (FormObject[FieldName].value==""){
		if (typeof(Str)!="undefined" && Str!=""){
			alert(Str);
			FormObject[FieldName].focus();
		}
		return false;
	}else{
		return true;
	}
}

function selectall(FormName,FieldName,Type){
	if (typeof(Type)=="undefined"){
		for(var i=0;i<document[FormName].elements.length;i++){
			var e=document[FormName].elements[i];
			if((e.name).indexOf(FieldName)!=-1) e.checked = document[FormName].select.checked;
		}
	}else if (Type==1){
		for(var i=0;i<document[FormName].elements.length;i++){
			var e=document[FormName].elements[i];
			if((e.name).indexOf(FieldName)!=-1) e.checked = true;
		}		
	}else if (Type==0){
		for(var i=0;i<document[FormName].elements.length;i++){
			var e=document[FormName].elements[i];
			if((e.name).indexOf(FieldName)!=-1) e.checked = !(e.checked);
		}
	}
}

function sure(FormName,FieldName,sort,str)
{
	var k=document[FormName];
	var z=0;
	for (var i=0;i<k.elements.length;i++)
	{
		var s=k.elements[i];
		if (s.checked && s.name==FieldName)z++;
	}
	if (z==0)
	{
		alert("请先选择要"+str+"的记录!")
		return false;
	}else{	
		if (!window.confirm("确定要"+str+"吗?"))
		{
		return false;
		}
		k.Actions.value = sort;
		k.submit();
	}	
}

function OpenWin(FormName,FieldName,Type,Path)
{
	if (typeof(Path)=="undefined" || Path==""){Path="../../";}
	if (typeof(Type)=="undefined" || Type!=1){
		var features = 'dialogWidth:306px;dialogHeight:198px;dialogLeft:380px;dialogTop:200px;directories:no;localtion:no;menubar:no;status=no;toolbar=no;scrollbars=no;help=no;Resizeable=no';
		returnvalue = window.showModalDialog(Path+"Inc/Win.asp?Text="+document[FormName][FieldName].value,"write",features );
		if (returnvalue!=null){
		document[FormName][FieldName].value=returnvalue;
		}
	}else if (Type==1){
		window.open(Path+"Inc/Intro.asp?"+FormName+"","Intro","width=586px,height=410px,top=150px,left=200px,scrollbars=yes")
	}
}

function SelColors(FiledName,FormName,PicName,Path)
{
	if (typeof(Path)=="undefined" || Path==""){Path="../../";}
	if (typeof(FormName)=="undefined" || FormName==""){FormName="all";}
	var retval;
	retval = window.showModalDialog(Path+"Editor/Dialog/Selcolor.htm","SelColor","dialogWidth:290px;dialogHeight:250px;dialogLeft:372px;dialogTop:210px;directories:no;localtion:no;menubar:no;status:no;toolbar:no;scrollbars:yes;Resizeable:no;help:no");
	if (retval!=null){
		document[FormName][FiledName].value = retval;
		if (typeof(PicName)!="undefined" && PicName != ""){
		document[FormName][PicName].style.backgroundColor = retval;
		}
	}
}
