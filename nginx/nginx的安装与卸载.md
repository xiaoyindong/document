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

每条指令都是以分号结尾的，指令和参数间以空格符号分隔，拿```include mime.types;