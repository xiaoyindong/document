## 1. 启动

```s
service mysql start | stop | restart | status
```

## 2. 登录

用户名为```root```时
```s
mysql -uroot -p
```

输入密码完成登录。

## 3. 创建数据库

创建名字为```test_db```的数据库

```s
CREATE DATABASE test_db;
```

1.判断是否已经存在。如不存在则创建

```s
CREATE DATABASE IF NOT EXISTS test_db;
```

2.指定其默认字符集为 utf8，默认校对规则为 utf8_chinese_ci

```s
CREATE DATABASE IF NOT EXISTS test_db DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_chinese_ci;
```
3.查看数据库创建信息

```s
SHOW CREATE DATABASE test_db;
```

4.查看所有数据库

```s
SHOW DATABASES;
```

## 4. 修改数据库

数据库中只能对数据库使用的字符集和校对规则进行修改，数据库的这些特性都储存在 ```db.opt``` 文件中。可以使用 ```ALTER``` ```DATABASE``` 来修改已经被创建或者存在的数据库的相关参数。

```s
ALTER DATABASE test_db DEFAULT CHARACTER SET gb2312 DEFAULT COLLATE gb2312_chinese_ci;
```

```ALTER``` ```DATABASE``` 用于更改数据库的全局特性。使用 ```ALTER``` ```DATABASE``` 需要获得数据库 ```ALTER``` 权限。```CHARACTER``` ```SET``` 子句用于更改默认的数据库字符集。

## 5. 删除数据库

```s
DROP DATABASE test_db;
# or
DROP DATABASE IF EXISTS test_db;
```

## 6. 选择数据库

```s
USE test_db;
```

## 7. 数据类型

数据库中的每个列都应该有适当的数据类型，用于限制或允许该列中存储的数据。如果使用错误的数据类型可能会严重影响应用程序的功能和性能，所以在设计表时，应该特别重视数据列所用的数据类型。更改包含数据的列不是一件小事，这样做可能会导致数据丢失。因此，在创建表时必须为每个列设置正确的数据类型和长度。

MySQL 的数据类型有大概可以分为 5 种，分别是整数类型、浮点数类型和定点数类型、日期和时间类型、字符串类型、二进制类型等。

1.数值类型

整数：```TINYINT```、```SMALLINT```、```MEDIUMINT```、```INT```、```BIGINT```。

| 类型名称 | 说明 | 存储需求 |
| --- | --- | --- |
| TINYINT | 很小的整数 | 1个字节 |
| SMALLINT | 小的整数 | 2个宇节 |
| MEDIUMINT | 中等大小的整数 | 3个字节 |
| INT (INTEGHR) | 普通大小的整数 | 4个字节 |
| BIGINT | 大整数 | 8个字节 |

| 类型名称 | 说明 | 存储需求 |
| --- | --- | --- |
| TINYINT | -128〜127 | 0 〜255 |
| SMALLINT | -32768〜32767 | 0〜65535 |
| MEDIUMINT | -8388608〜8388607 | 0〜16777215 |
| INT (INTEGER) | -2147483648〜2147483647 | 0〜4294967295 |
| BIGINT | -9223372036854775808〜9223372036854775807 | 0〜18446744073709551615 |

浮点数：```FLOAT```和 ```DOUBLE```，定点数类型为 ```DECIMAL```。

| 类型名称 | 说明 | 存储需求 |
| -- | -- | -- |
| FLOAT | 单精度浮点数 | 4 个字节 |
| DOUBLE | 双精度浮点数 | 8 个字节 |
| DECIMAL (M, D)，DEC | 压缩的“严格”定点数 | M+2 个字节 |

2.日期/时间类型

```YEAR```、```TIME```、```DATE```、```DATETIME``` 和``` TIMESTAMP```。

| 类型名称 | 说明 | 存储需求 |
| -- | -- | -- |
| YEAR | YYYY | 1901 ~ 2155 | 1 个字节 |
| TIME | HH:MM:SS | -838:59:59 ~ 838:59:59 | 3 个字节 |
| DATE | YYYY-MM-DD | 1000-01-01 ~ 9999-12-3 | 3 个字节 |
| DATETIME | YYYY-MM-DD HH:MM:SS | 1000-01-01 00:00:00 ~ 9999-12-31 23:59:59 | 8 个字节 |
| TIMESTAMP | YYYY-MM-DD HH:MM:SS | 1980-01-01 00:00:01 UTC ~ 2040-01-19 03:14:07 UTC | 4 个字节 |

3.字符串类型

```CHAR```、```VARCHAR```、```BINARY```、```VARBINARY```、```BLOB```、```TEXT```、```ENUM``` 和 ```SET``` 等。

| 类型名称 | 说明 | 存储需求 |
| -- | -- | -- |
| CHAR(M) | 固定长度非二进制字符串 | M 字节，1<=M<=255 |
| VARCHAR(M) | 变长非二进制字符串 | L+1字节，在此，L< = M和 1<=M<=255 |
| TINYTEXT | 非常小的非二进制字符串 | L+1字节，在此，L<2^8 |
| TEXT | 小的非二进制字符串 | L+2字节，在此，L<2^16 |
| MEDIUMTEXT | 中等大小的非二进制字符串 | L+3字节，在此，L<2^24 |
| LONGTEXT | 大的非二进制字符串 | L+4字节，在此，L<2^32 |
| ENUM | 枚举类型，只能有一个枚举字符串值 | 1或2个字节，取决于枚举值的数目 (最大值为