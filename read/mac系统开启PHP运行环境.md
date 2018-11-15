## 1. 开启Apache

```Mac```自带了```Apache```环境，我们要做的只是稍微配置一下。

在终端输入```sudo apachectl start```提示输入密码，密码不可见，输入完按回车即可。

在浏览器中访问```http://127.0.0.1```可以发现页面已经可以访问了。

```apache```默认网站根目录```/Library/WebServer/Documents```，可以在这个路径下添加一下文件。

```s
# 开启
sudo apachectl start
# 关闭
sudo apachectl stop
# 重启
sudo apachectl restart
```

## 2. 开启php支持

首先需要修改```/etc/apache2/httpd.conf```文件

```s
# 进入文件目录
cd /etc/apache2
# 打开文件目录
open ./
```

修改```httpd.conf```文件，找到```#LoadModule php5_module libexec/apache2/libphp5.so```去掉前面的```#```。

```s
# 重启
sudo apachectl restart 
```

在```/Library/WebServer/Documents```目录中创建```index.php```。

在```index.php```中编写```php```代码

```php
<?php
    echo "hello mac apache"
?>
```

刷新浏览器，可以发现，浏览器输出了```hello mac apache```。

至此，```PHP```开发环境已经开启完毕。

## 3. 设置网站跟目录

默认开启```的apache```站点根目录是```/Library/WebServer/Documen