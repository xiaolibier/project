<?php
$db_config	= require_once 'db_config.php';
$config=array
(
	'DEFAULT_TIMEZONE'=> 'PRC', // 默认时区
	'URL_MODEL'=>'2',				     //URL访问模式,可选参数0、1、2、3,代表以下四种模式：	
	'URL_CASE_INSENSITIVE'=>false,//URL是否不区分大小写 
	'DEFAULT_FILTER'=>'htmlspecialchars',//变量过滤
	//'TMPL_ENGINE_TYPE'	 =>	'Smarty',
	'TMPL_PARSE_STRING'  =>array(
       	"__SYSWEB__"=>"/web/Public",
		'__PUBLIC__' =>'/web/Tpl/Public',// 站点公共目录
    ),
	'APP_GROUP_LIST'=>'Admin,Home', //项目分成Home和Admin两个组，分删表示前台和后台功能
    'DEFAULT_GROUP'=>'Home',  //默认为Admin组
	'SESSION_AUTO_START' => true, //是否开启session
	'DEFAULT_MODULE'=>'Index', //默认模块
	'DEFAULT_ACTION' => 'index', // 默认操作名称
    'LOAD_EXT_FILE' => 'code_char',
    'USER_AUTH_KEY'=>'authId',
	'USER_PUBLISH'=>'./web/Public/Uploads/',//
	'HTML_FILE_SUFFIX' => '.html',// 默认静态文件后缀
     'URL_HTML_SUFFIX'=>'html',
'SHOW_ERROR_MSG'  => true,  
);
$config_arr = array_merge($db_config,$config);
return $config_arr;