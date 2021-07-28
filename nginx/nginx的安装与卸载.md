## 1. 安装依赖工具

1. 安装编译工具及库文件

```s
yum -y install make zlib zlib-devel gcc-c++ libtool  openssl openssl-devel
```

2. 首先要安装 PCRE

```PCRE``` 作用是让 ```Nginx``` 支持 ```Rewrite``` 功能。

下载 ```PCRE``` 安装包，下载地址： ```http://downloads.sourceforge.net/project/pcre/pcre/8.42/pcre-8.42.tar.gz```

```s
[root@bogon src]# cd /usr/local/src/
[root@bogon src]# wget http://downloads.sourceforge.net/project/pcre/pcre/8.42/pcre-8.42.tar.gz
```
解压安装包:

```s
[root@bogon src]# tar zxvf pcre-8.42.tar.gz
```

进入安装包目录

```s
[root@bogon src]# cd pcre-8.42
```

编译安装 

```s
[root@bogon pcre-8.42]# ./configure
[root@bogon pcre-8.42]# make && make install
```

查看```pcre```版本

```s
[root@bogon pcre-8.42]# pcre-config --version
```

## 2. 安装 Nginx

下载 ```Nginx```，下载地址：```http://nginx.org/download/nginx-1.16.1.tar.gz```

```s
cd /usr/local/src/
wget http://nginx.org/download/nginx-1.16.1.tar.gz
tar zxvf nginx-1.16.1.tar.gz
```

进入安装包目录

```s
cd nginx-1.16.1
```
编译安装

```s
./configure --prefix=/usr/local/nginx --with-http_stub_status_module --with-http_ssl_module --with-pcre=/usr/local/src/pcre-8.42 --with-stream --with-stream_ssl_module --with-http_ssl_module --with-http_v2_module --with-threads

make

make install
```

查看```nginx```版本

```
/usr/local/nginx/sbin/nginx -v
```

配置软连接

```s
ln -s /usr/local/nginx/sbin/nginx /usr/local/bin/nginx
```

## 3. 配置语法

在```nginx```的执行文件中，已经指定了他包含了哪些模块，但每一个模块都会提供独一无二的配置语法。这些所有的配置语法，会遵循同样的语法规则。

```nginx```的配置文件是一个```ascii```文本文件，主要有两部分组成，一个叫做指令一个叫做指令快。

```s
http {
    include mime.types;
    upstream thwp {
        server 127.0.0.1:8000;
    }

    server {
        listen 443 http2;
        # nginx配置语法
        limit_req_zone $binary_remote_addr zone=one:10 rate=1r/s;
        location ~* \.(gif|jpg|jpeg)$ {
            proxy_cache my_cache;
            expires 3m;
        }
    }
}
```

像上面```http```就是一个指令快，```include mime.types```是一条指令。

每条指令都是以分号结尾的，指令和参数间以空格符号分隔，拿```include mime.types;```来看，```include```是一个指令名，他的中间可以用一个或者多个空格来分隔，那么后面的```mime.types```就是他的参数，也可以具备多个参数，比如```limit_req_zone $binary_remote_addr zone=one:10 rate=1r/s;```他有三个参数。

两条指令间是以分号作为分隔符的，两条指令放在一行中写也是没有问题的。只不过这样可读性会变得很差。

第三个指令块是以 ```{} ```组成的，他会将多条指令组织到一起，比如```upstream```，他把一条指令```server```放在了```thwp```这个指令块下面。

像```server```他也放置了```listen```，```limit_req_zone```这些指令，他还可以包含其他的指令块，比如说```location```。

有些指令块可以有名字，比如说像```upstream```，后面有个```thwp```，有些指令块是没有名字的，比如说```server```和``http``。


演示一下配置，首先创建 ```Nginx``` 运行使用的用户 ```www```：

```s
/usr/sbin/groupadd www 
/usr/sbin/useradd -g www www
```

配置```nginx.conf``` ，将```/usr/local/nginx/conf/nginx.conf```替换为以下内容

```s

cat /usr/local/nginx/conf/nginx.conf
```

```s
user www www;
worker_processes 2; #设置值和CPU核心数一致
error_log /usr/local/nginx/logs/nginx_error.log crit; #日志位置和日志级别
pid /usr/local/nginx/nginx.pid;
#Specifies the value for maximum file descriptors that can be opened by this process.
worker_rlimit_nofile 65535;
events
{
  use epoll;
  worker_connections 65535;
}
http
{
  include mime.types;
  default_type application/octet-stream;
  log_format main  '$remote_addr - $remote_user [$time_local] "$request" '
               '$status $body_bytes_sent "$http_referer" '
               '"$http_user_agent" $http_x_forwarded_for';
  
#charset gb2312;
     
  server_names_hash_bucket_size 128;
  client_header_buffer_size 32k;
  large_client_header_buffers 4 32k;
  client_max_body_size 8m;
     
  sendfile on;
  tcp_nopush on;
  keepalive_timeout 60;
  tcp_nodelay on;
  fastcgi_connect_timeout 300;
  fastcgi_send_timeout 300;
  fastcgi_read_timeout 300;
  fastcgi_buffer_size 64k;
  fastcgi_buffers 4 64k;
  fastcgi_busy_buffers_size 128k;
  fastcgi_temp_file_write_size 128k;
  gzip on; 
  gzip_min_length 1k;
  gzip_buffers 4 16k;
  gzip_http_version 1.0;
  gzip_comp_level 2;
  gzip_types text/plain application/x-javascript text/css application/xml;
  gzip_vary on;
 
  