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

默认开启```的apache```站点根目录是```/Library/WebServer/Documents/```。修改```/etc/apache2/httpd.conf```文件

```s
sudo vim /etc/apache2/httpd.conf
```

去掉下列代码下面代码最前面的```#```。

```s
#LoadModule authn_core_module libexec/apache2/mod_authn_core.so
#LoadModule authz_host_module libexec/apache2/mod_authz_host.so
#LoadModule authz_core_module libexec/apache2/mod_authz_core.so
#LoadModule dir_module libexec/apache2/mod_dir.so
#LoadModule userdir_module libexec/apache2/mod_userdir.so
#LoadModule alias_module libexec/apache2/mod_alias.so
```

找到如下代码：

```s
DocumentRoot "/Library/WebServer/Documents"
...
<Directory "/Library/WebServer/Documents">
```
其中```/Library/WebServer/Documents```即为网站的跟目录，修改为你喜欢的目录，注意使用绝对路径。修改前需要确定修改的目录是存在的。。

被指定的文件夹需设置为共享文件夹。

下面三行去掉前面的```＃```

```s
#Include /private/etc/apache2/extra/httpd-userdir.conf
#Include /private/etc/apache2/extra/httpd-vhosts.conf

...

#Include /private/etc/apache2/other/*.conf
```
修改后：
```s
Include /private/etc/apache2/extra/httpd-userdir.conf
Include /private/etc/apache2/extra/httpd-vhosts.conf

...

Include /private/etc/apache2/other/*.conf
```

修改后保存文件，继续修改```/etc/apache2/extra/httpd-vhosts.conf```文件

```s
sudo vim /etc/apache2/extra/httpd-vhosts.conf
```

去掉```#Include /private/etc/apache2/users/*.conf```前面的#号```Include /private/etc/apache2/users/