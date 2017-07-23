## 1. 基础语法

```PHP```是超文本预处理器，是嵌入```HTML```文件中的服务器端脚本，扩展名为```.php```。

```php
<?php
    // 书写环境
?>
```

```php```中函数和关键字不区分大小写。

```php
// 单行注释
#  单行注释
/**/ 多行注释
```

变量使用```$```开始，如存在则使用，如不存在则赋值。

```php
$name = "feiyang";
```

变量名称不可以数字或者下划线开头

输出内容使用```echo```。

```php
$name = "feiyang";
echo $name;
```

字符串拼接使用```.```符号。

```php
$name = "feiyang";
$print = "我的姓名是".$name;
echo $print;
```

数据类型

1.标量
    整型，浮点型，字符串，布尔。

2.符合数据类型
    数组，对象。

3.特殊数据类型
    资源，```null```。

1.整数: 正整数，负整数和```0```，```-21亿~21亿```。

2.浮点数: 小数，有限和无限 ```-1.7E-308 ~ 1.7E+308```。

3.字符串型: 单引号、双引号、长字符串，单引号转译符号只有```\\```和```\```双引号可以使用所有转译符号，```\\```、````\````、```\$```、```\n```、```\r```、```\t```。

长字符串:

```php
$str = <<< heredoc 字符串字符串字符串字符串字符串字符串字符串
heredoc;
```

```heredoc```可以是任何名称，只要起到标识作用即可，收尾的```heredoc```必须另起一行，变量写在```{}```中，只能读取，不能运算。

在单引号中，输出变量将不会解析，双引号中才会解析出值。

```php
$name = "feiyang";
echo "我是：$name"; // 我是：飞扬
```

资源类型:

对外部数据的引用，如数据库，文件操作，图片验证码。

PHP链接数据库: 

```php
$link = mysql_connect("127.0.0.1", "rootr", "123456");
echo $link // 链接成功返回resource， 失败返回 false
```

```NULL```: 空型，不存在的变量，空型一般认为变量不存在，不区分大小写。

判断类型:

```var_dump()```：打印变量的相关信息，类型和值，返回值诶```void```，可以打印多个变量，用逗号隔开。
```is_*()```：判断是否为相应类型。```is_bool```、```is_int```、```is_float```、```is_numeric```、```is_string```、```is_array```、```is_object```、```is_null```、```is_resource```。

```isset()```：检查变量是否设置，返回布尔值，参数可为多个。判断变量是否是```null```。

获取表单的数据

```$_GET[]```、```$_POST[]```超全局数组，可在任意位置使用。

```php
$username = $_GET['username'];
echo $username;
```

```empty()```：检查变量是否为空，返回布尔值，为空返回```true```，```""```、```0```、```"0"```、```false```、```null```、```array()```、```var $var```以及没有任何属性的对象都将被认为是空的。

强制转换

```php
(bool)$a; 
(int)$a; 
(string)$a;
```

自动转换

```php
echo  10 + "20px"; // 30
```

```0```、```0.0```、```""```、```"0"```、```array()```、```null```都为假，资源类型恒为真。

整型转换

```php
echo(int)"10px"; // 10;
echo(int)10.98; // 10;
echo(int)true; // 1;
echo(int)false; // 0;
```

字符串转换

```php
echo(string)true; // "1";
echo(string)true; // "";
echo(string)null; // "";
```

在```php```中，字符串连接使用```.```。

```php
echo "我是: " . "feiyang"; // "我是: feiyang"
```

比较运算符

```==```、```===```和```js```相同。

```php
10 == "10px"; // true 此处与js不同
```

运算符优先级：特殊```>```算数```>```比较```>```逻辑```>```赋值。

特殊运算符：```[]```、```new```、```()```、```!```。

算术运算符：```++```，```--```，```(int)```、```(float)```、```(string)```、```(bool)```、```(array)```、```*```、```/```、```%```、```+```、```-```、```.```。

比较运算符：```>```、```<```、```>=```、```<=```、```==```、```!=```、```===```、```!==```。

逻辑运算符：```&&```、```||```、```?```。

赋值运算符：```=```、```+=```、```-=```、```*=```、```/=```、```%=```、```.=```。

数组:

```php
$arr = array(1, 2, 3, 4, 5);
```

枚举数组的下标是从```0```开始的正整数，```$arr[0] ===> 1```;

关联数组的下标是字符串。

```php
$arr = array("name"=>"feiyang", "sex" => "男");
echo $arr["name"];
print_r($arr); // 遍历数组
```

混合数组的下标既有整数也有字符串。

```php
$arr = array("name" => "feiyang", "age": 24, 1, 2, 3);
echo $arr[0]; // 1;

$arr = array(0, 1, 2, 5 => 3, 4); // 4的下标为6，下标从最后一个开始递增

```

字面量创建数组。

```php
$arr = array(0, 1, 2, "name" => "feiyang", 3);
```

使用```[]```创建。

```php
$arr["name"] = 1; // 使用键值对创建

$arr[] = 1; // 下标自动分配递增
$arr[] = 2; // 下标自动分配递增
```

数组函数:

```print_r()```打印数组信息，如果参数是字符串，整数，则打印本身，打印数组和对象会打印出一定格式。

```isset()```判断变量是否存在。

```unset()```书暗处变量，删除变量名和引用联系，并不能删除内存空间中的值，内存中留下的数据成为垃圾，由```windows```或```php```引擎本身自动回收。```unset```删除了数组中的值，数组长度不变。

```php
$a = 123;
unset($a);
if (isset($a)) {
    echo "存在";
} else {
    echo "不存在";
}
```

```count()```数组的有效元素个数，返回值```int```。

```round(value, tofixed)```四舍五入，保留小数位数。

```foreach```遍历数组。

```php
foreach( $arr as [$key =>] value) {
    var_dump($key, $value);
}
```

## 2. 函数

```php
function getMax($a, $b) {
    return $a >= $b ? $a : $b;
}
```

```php```函数和```js```中的相同，函数名称不需要添加```$```。

变量作用域:

在```php```中，全局变量，不能直接在函数内部使用。

全局变量在函数外部定义的变量，网页执行完毕消失。

局部变量在函数内部定义的变量，函数执行完毕胡消失。

使用```global```生命全局变量

```global```关键字只能在函数内部使用;

```global```生命和赋值要分离

```php
global $name;
$name = "feiyang";
```

```global```的真正含义是， "引用传地址";

日期时间函数```date()```。

```php
date("Y-m-d H:i:s"); 年月日 时分秒
```

```time()```时间戳，秒数。

```php
time();
```

## 3. 链接数据库

```mysql_connect```链接函数，返回资源，```php```可以链接多重数据库。

```php
resource $link = mysql_connect("localhost", "root", "123456");
var_dump($link);
```

使用```@```符号，屏蔽错误

```php
$link = @mysql_connect("localhost", "root", "123456");
```

```mysql_error```返回上一次```mysql```执行失败时的文本错误信息。

```php
echo mysql_error();
```

```exit()```结束程序，输出提示信息。

```php
exit(["信息"]);
```

```mysql_select_db()```选择当前要操作的数据库，返回布尔值。

参数1: 数据库名称

参数2: [资源，默认上一次的资源]

```php
if (mysql_select_db($db_name, $link));
```

操作数据库
```mysql_query()```。

参1:```sql```语句

参2: [资源链接]

操作成功时，返回结果集，失败返回```false```。

```mysql_fetch_row()```返回值，```array```， 从结果集获取一行。

```mysql_fetch_array```取出一行，作为混合数组返回， 参数```2```: 返回数组的类型。

```mysql_fetch_assoc()```取出一行，已关联数组返回。

```mysql_num_rows()```获取结果集的长度。

```mysql_query("set names utf8")```在选择数据库之前设置方才有效。

```mysql_fetch_array```参数```2```如下，不需要加引号，是常量。

```MYSQL_BOTH```两种下标都存在。

```MYSQL_ASSOC```字符型下标。

```MYSQL_NUM```数字型下标，相当于```mysql_fetch_row()```的功能。

```PHP```内置函数

```incluse()```包含文件， 如果文件不存在，报错，但不阻塞后面程序执行。

```php
include $filename;
include($filename);
```

```require()```包含文件，如果文件不存在，报错并且阻塞代码运行。

```php
require $filename;
require($filename);
```

```header()```文件头信息，自定义的```http```报文。

```php
header("Content-type", "text/html;charset=utf-8"); // 设置一个返回的字符集
header("location", "http://www.baidu.com"); // 网页跳转
```

```date(format, Time)```参```1```，格式化时间格式，参```2```，时间戳```/```秒。

```urldecode()```编码。

```urlencode()```解码。

```md5()```加密成```md5```值；以```32```个字符十六进制数字形式返回散列值。

```define()```定义全局变量， 参```1```: 变量名，大写， 参数```2```: 变量的值。

```ucfirst()```首字母大写。

```strtolower()```将字符串转为小写。

```strtoupper()```将字符串转为大写。

```addslashes()```转译特殊字符。

```htmlspecialchars()```，```标签转译。

```htmlentities()```，```html```标签转译。

```array_map(function, arr)```遍历数组。

```json_encode```将对象转为```json```。

```json_decode```将```json```转为对象。

```get_object_vars()```将```obj```转为数组。

全局对象

```$_SERVER```: 获取服务之星环境信息，以及客户端信息。

```$_SERVER["ROMOTE_ADDR"]```: 客户端的```IP```地址。

```$_SERVER["SERVER_ADDR"]```: 服务器的```IP```地址。

```$_SESSION```:```session```容器。

## 4. 项目结构

```s
application
    config 配置文件目录
    controllers 控制器目录
        admin 后台管理
            方法类1
            方法类2
            方法类3
        web 前端管理
    models 数据库模型
    views 视图目录
framework
    core 核心
        Controller.class.php: 抽象类
        Framework.class.php 启动类
        Upload.class.php 上传文件类
    databases 数据库驱动
        Mysql.class.php
    helps 辅助函数
    libraries 类库目录
public
    css
    images
    js
    uploads
```

入口文件```index.php```。

```index.php
<?php
    include "framework/core/Framework.class.php";
    $app = new Framework();
    $app -> run();
?>
```

配置文件```config.php```。
```php
<?php
    return array(
        'host' => '127.0.0.1',
        'user' => 'root',
        'password' => 123456,
        'dbname' => 'yingview',
        'charset' => 'utf8',
        'port' => 3306,
        'prefix' => 'ying'
    );
?>
```

控制器文件```controllers```->```web```->```UserController```。

```php
<?php
    class UserController extends Controller {
        // 用户退出
        public static function logoutAction(){
            if (isset($_SESSION['userInfo'])) {
                unset($_SESSION['userInfo']);
            }
        }
    }
?>