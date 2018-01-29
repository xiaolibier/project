# budget
 * 项目预算系统，提供经纬传奇内部预算项目管理和控制。
## 项目技术架构



## 对外公开的计算器接口
- 需要存储用户的基本信息
### 1. 添加
- 说明
  * 添加项目
- /open/calculator/add
- 参数列表
  * String type;        // '预算类型',可选
  * String name;        // '项目简称',可选
  * String audit_num;   // '稽查次数',可选
  * String patient_num; //'稽查病例数',可选
  * String center_num;  //'稽查中心数',可选
  * String audit_time;  //'稽查服务时间',可选
  * String travell_cost;// '差旅费',可选
  * String tech_serve_cost;//'技术服务费',可选
  * String average_cost;//平均费用
  * String tax;         //'税费',可选
  * String total_cost;  //'总费用',可选
  * phone 登录的时候返回的数值  //必填

- http://118.190.132.68:84/budget/open/calculator/add

### 2. 查找
- 说明
  * 查找项目
- /budget/open/calculator/search
- 参数列表
  *   phone 返回的数值

- http://118.190.132.68:84/budget/open/calculator/search

### 3. 删除
- 说明
  * 查找项目
- /budget/open/calculator/delete
- 参数列表
  * id 要删除的id
  * phone 返回的数值
- http://118.190.132.68:84/budget/open/calculator/delete?id=1


### 4. 登录
- 说明
  * 用户登录
- /budget/open/calculator/login
- 参数列表
  * username  用户名
  * password  密码
- http://118.190.132.68:84/budget/open/calculator/login?username=1212&password=13212
