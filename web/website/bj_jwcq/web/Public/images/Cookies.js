//设置COOKIE值
function setCookie(sName,sValue,oExpires,sPath,sDomain,bSecure)
{
	var sCookie = sName + "=" + encodeURIComponent(sValue);

	if(oExpires)
	{
		sCookie += "; expires=" + oExpires.toString();
	}

	if(sPath)
	{
		sCookie += "; path=" + sPath;
	}

	if(sDomain)
	{
		sCookie += "; domain=" + sDomain;
	}

	if(bSecure)
	{
		sCookie += "; secure";
	}

	document.cookie = sCookie;
}

//获取COOKIE值
function getCookie(sName)
{
	var sRE = "(?:; )?" + sName + "=([^;]*);?";
	var oRE = new RegExp(sRE);

	if(oRE.test(document.cookie))
	{
		return decodeURIComponent(RegExp["$1"]);
	}
	else
	{
		return null;
	}
}

//删除COOKIE值
function deleteCookie(sName,sPath,sDomain)
{
	setCookie(sName,"",new Date(0),sPath,sDomain);
}