# 接口文档

#### 采用CAS+SHIRO进行简单的用户登录和权限控制

## 1.数据库

>- budget_summary
 > 包括id,预算编号、版本号、版本名称、预算项目名称、中心数、预算总数、申办方、申办方代码、创建时间、备注
>- price
>- sponsor
 > 目前包括id，名称，代号
>- user
 > 用户数据库，包括 id、名称、密码（MD5）、邮箱、电话和角色。


## 2.接口和使用
- getUserInfo
   - 
   - 用户信息
   - 获取用户信息包括 用户名，邮箱，角色
   - http://118.190.132.68:84/budget/getUserInfo
   - 返回值 
       > {"message":"用户信息","result":{"id":0,"name":"未登录测试","password":null,"email":"未登录@未登录.com","contact":null,"role":"admin"},"success":1}
- getSponsors
  -
  - 获取申办方列表
  - 申办方目前只有申办方名称和代码
  - http://118.190.132.68:84/budget/getSponsors
  - 返回值
       > {"message":"申办方列表获取成功","result":[{"id":1,"name":"申办方1","code":"H212"},{"id":2,"name":"申办方2","code":"H213"},{"id":3,"name":"申办方3","code":"H214"},{"id":4,"name":"申办方4","code":"H215"}],"success":1}
- saveSponsor 
  -
  - 新建申办方
  - http://118.190.132.68:84/budget/saveSponsor?name=测试&code=ceshi
  - 返回值
       > {"message":"申办方添加成功","success":1}
- projectListPage
  -
  - 获取项目列表
  - 参数包括页数page（从0开始计算）和number（一页几条）
  - http://118.190.132.68:84/budget/projectListPage?page=0&number=20
  - 返回值
       > {"message":"succeed","result":{"content":[{"id":61,"serial_number":"1212","version_num":1,"version":"V1.1","pversion":null,"name":"\"name\"","center_number":"13","type":null,"budget_price":"0","sponsor":"''","sponsor_code":" ","remarks":"","create_time":1496889392000,"json1":null,"json2":null,"json3":"1","json4":null,"json5":null,"state":"暂存","user":"李四","is_delete":1}],"last":false,"totalElements":15,"totalPages":15,"size":1,"number":4,"sort":null,"numberOfElements":1,"first":false},"success":1}
       
- searchPage 
    -
    - 搜索项目列表
    - 参数  
       > - serial 项目编号
       > - name 项目名称
       > - sponsor 申办方名称或者代码
       > - user 用户名称
       > - state 项目状态
       > - start 时间段搜索 起始时间
       > - end 时间段搜索   结束时间
       > - page 分页字段   页数，从0开始
       > - number 分页字段  行数数，从1开始

    - http://118.190.132.68:84/budget/searchPage?XXX&XXX&XX

- edit 
   -
   - 编辑项目
   - 参数   id
   - http://118.190.132.68:84/budget/edit?id=58

- updateRemark
  - 
  - 更新备注
  - 参数
     - id 项目id
     - remark 项目备注
  - http://118.190.132.68:84/budget/updateRemark?id=58&remark=%E6%B5%8B%E8%AF%95
  - 返回值 
    >{"message":"备注更新成功","success":1}

- save
  -
  - 复制、保存和新建
  - id=0时，新建；id<0时，复制；id>0时，保存；
  - 参数列表
        
        > - id
        > - serial_number
        > - version
        > - name
        > - center_number
        > - budget_price
        > - sponsor
        > - type
        > - json1
        > - json2
        > - json3
        > - json4
        > - json5