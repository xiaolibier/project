# budget
 * 项目预算系统，提供经纬传奇内部预算项目管理和控制。
## 项目技术架构
Spring-boot
CAS-Shiro 简单的权限管理和用户登录控制。
### 项目状态约定
=======

##项目状态
###项目状态约定
1. 暂存；
2. 审核中；
3. 审核通过；
4. 审核驳回.
-  审核通过可以打印和输

### 项目涉及数据信息表
- 1.费用配置
  * 包括出差补助、餐补、交通补等；
- 2.申办方信息
  * 包括申办方的编号、名称
- 3.用户信息表
   用户的账户配置。
  * name 用户名称
  * account 账户名
  * password 账户密码（MD5存储）
  * email 邮箱
  * contact 联系方式
  * role 
    * admin 超级管理员
    * user 普通预算录入人员
    * reviewer 评审员
    * notify   短信被通知方




#  项目名接口
## 保密协议接口
```
    private Long id;
    private String code;//保密协议编号
    @Transient
    private String originCode;//原始保密协议编号
    private String project_name;//项目名称
    private Long user_id;//用户id
    private String user_name;//用户名称
    private String sponsor;//申办方名称
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date create_time;//创建时间

```
### 1./confident/search
- 说明 搜索接口
- 参数
  *  code    保密协议编号
  *  project_name 项目名称
  *  sponsor 申办方
  *  member 用户列表
  * create_head   1970-01-01创建日期起
  * create_tail   2070-01-01创建日期止
  * page        页码
  * number      一页多少行
  * direction   0或者1 
 -  http://localhost:84/budget/confident/search

### 2./confident/members
- 说明 成员
- 参数
   *  无
-  http://localhost:84/budget/confident/members


### 3./confident/create
- 说明 新建
- 参数
   *  无
-  http://localhost:84/budget/confident/create  

### 4./confident/edit
- 说明 编辑
- 参数
   *  id 
-  http://localhost:84/budget/confident/edit?id=1  

### 5./confident/update
- 说明 修改
- 参数
   *      private String code;//保密协议编号
   *      private String project_name;//项目名称
   *      private String sponsor 申办方名称
-  http://localhost:84/budget/confident/update?id=1  

### 6./confident/delete
- 说明 删除
- 参数
   * id   保密协议的id Long  
-  http://localhost:84/budget/confident/delete?id=1  


### 7./confident/word
- 说明 删除
- 参数
   * id   保密协议的id Long  
-  http://localhost:84/budget/confident/word?id=1  
