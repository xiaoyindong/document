## 1. 概述

```java```诞生于```1995```年，由```sun```公司发明。分为```javaSE``` 标准版 和```javaEE``` 企业版。

## 2. 开发环境搭建

```jdk```是```java development kit```到```oracle```官网下载```jdk```，默认安装，完成。在命令行输入 ```javac``` 验证是否成功，如为成功可考虑环境变量或安装失败。

```jdk```是```java```开发和运行环境，```jre``` 是```java```运行时程序，```jdk```中包含```jre```。所以开发的时候安装```jdk```即可。

## 3. hello world

编写文件  ```.java```，然后编译文件  ```.class```。最后运行文件  ```字节码```。

```helloworld.java```。

```java
public class HelloWorld {
  public static void main(String [] args) {
    System.
  }
}
```

基本数据类型分为四类八种。

1.整型

byte -128 ~ 127

short -32768 ~ 32767

int -2147483648 ~ 2147483648

long -2^65 ~ 2^65 -1

2.浮点型

float

double

3.字符型

char

4.布尔型

boolean

注意：字符串是引用数据类型，不是基本数据类型
变量定义后，不赋值，不能使用。输出时报错，编译不会报错。
变量的作用范围在一对大括号内。
变量不允许重复定义

数据类型自动转换

数据类型从小到大依次
byte -> short -> int -> long -> float -> double
取值范围小的类型可以直接转为取值范围大的。
取值范围大的类型不能直接转为取值范围大的。

```java
public class DataConvert {
    public static void main(String[] args) {
        int i = 100;
        double d = i;
        System.out.printIn(d);
    }
}
```

强制类型转换
被转后的数据类型 变量名 = (被转后的类型)被转换的数据;
int i = (int)3.14;
```java
public class DataConvert {
    public static void main(String[] args) {
        double d = 3.14;
        int i = (int)d;
        System.out.printIn(i);
    }
}
```

```java
public class DataConvert {
    public static void main(String[] args) {
        byte b = (byte)200;
        System.out.printIn(b); // -56
    }
}
```
强制类型转换，没有要求的时候，不要做，会丢失精度。
任何类型，只要和字符串想加，都会变成字符串。

逻辑运算符
& 只要一边是false，运算结果就是false
| 只要一边是true，运算结果就是true
^ 抑或 两边相同为false，不同为true
! 取反
&& 短路与，一边是false，另一边不运行
|| 短路或，一边是true，另一边不运行

Scanner 类
在命令行中，接收命令行的输入
```
import java.util.scanner;
public class Test {
    public static void main(String [] args) {
        Scanner s = new Scanner(System.in);
        // nextInt(); 接收整数类型
        int si = s.nextInt();
        // next(); 接收字符串数据
        String ss = s.next();
        System.out.print(s);
    }
}
```

Random 类
产生随机数的类.
nextInt(整数)，随机出来的随机数范围。0 ~ 整数-1
nextDouble(); 固定范围， 0 ~ 1;
```
import java.util.random;
public class Test {
    public static void main(String [] args) {
        Random ran = new Random();
        System.out.print(ran.nextInt(10));
    }
}
```

switch 与就中的表达式的数据类型
JDK1.0 - 1.4 数据类型接受: byte short int char
JDK1.5 数据类型接受 byte short int char enum
JDK1.7 数据类型接受 byte short int char enum string

### 数组
```
public class Test {
    public static void main(String[] args) {
        int[] arr = new int[3]; // 创建一个3个长度的数组
        System.out.print(arr.length);
        System.out.print(arr[0]);
    }
}
```
arr 是数组的一个引用地址，真正的数据在堆区
JVM的内存划分
系统分配给jvm一块内存区域，jvm对自己的内存进行划分，划分成5块区域
寄存器: 内存和CPU之间
本地方法栈: JVM 调用了系统中的功能
方法和数据共享区: 运行时期class文件，进入的地方
方法栈: 所有的方法运行的时候，进入的内存
堆: 存储的是容器和对象

```
public class Test {
    public static void main(String[] args) {
        int[] arr = new int[]{1,2,3,4,5,6,7}; // new后面的中括号中不允许写任何内容
        int[] arr2 = {0, 1, 2, 3, 4, 5}; // 推荐这样创建数组
    }
}
```

数组赋值
```
public class Test {
    public static void main(String[] args) {
        int[] arr = new int[3]; // new后面的中括号中不允许写任何内容
        arr[1] = 123;
    }
}
```

数组异常
- 数组索引越界异常
- 空指针异常

二维数组
int[][] arr = new int[3][4];
```
public class Test {
    public static void main(String[] args) {
        int[][] arr = new int[3][4];
        int[][] arr2 = { {1,2}, {3, 4}, {5, 6}};
    }
}
```

方法定义:
修饰符 返回值类型 方法的名字(参数列表...) { 方法的功能主体 };
```
public class Test {
    public static void main(String[] args) {
        int area = getArea(5, 6);
        System.out.print(area);
    }
    public statc int getArea(int w, int h) {
        return w * h;
    }
}
```
方法注意事项
1. 方法不能定义在另一个方法的里面
2. 写错方法的名字
3. 写错了参数列表
4. 方法返回值是void，方法中可以省略return。 return下面不能有代码
5. 方法返回值类型，和return后面数据类型必须匹配
6. 方法重复定义的问题
7. 调用方法的时候，返回值是void，不能写在输出语句中

方法的重载特性 overload
在同一个类中，允许出现同名的方法，只要方法的参数列表不同即可，这样的方法就是重载。
```
public class Test {
    public static void main(String[] args) {
    }
    public statc int getNum(int w, int h) {
        return w + h;
    }
    public statc int getNum(int w, int h, int z) {
        return w + h + z;
    }
    public statc Double getNum(Double w, Double h, Double z) {
        return w + h + z;
    }
}
```
重载的注意事项
1. 参数列表必须不同
2. 重载和参数变量名无关
3. 重载和返回值类型无关
4. 重载和修饰符无关
技巧: 重载方法名和参数列表

自定义类
```java
public class Phone {
    // 属性定义
        // 修饰符 数据类型 变量名 = 值
    String color;
    // 方法定义
        // 修饰符 返回值类型 方法名(参数列表) {}
}

public class Test {
    public static void main(String[] args) {
        Phone p = new Phone();
    }
}
```

### ArrayList集合
数据类型<数据类型> 变量名 = new 数据类型<数据类型>();

集合不存储基本类型，集合只存取引用类型，基本类型要转成引用类型
int --> Integer;
char --> Character;
byte --> Byte;
...

add(参数); 存数据
get(int 索引); 取出集合中的元素
size(); 返回集合的长度，集合存储元素的个数
```java
public class Test {
    public static void main(String[] args) {
        ArrayList<Integer> arrlist = new ArrayList<Integer>;
        arrlist.add(1);
        arrlist.add(2);
        arrlist.add(3);
        System.out.print(arrlist.get(1)); // 2;
    }
}

```
集合补充方法
add(索引, 存储的元素): 将元素添加到指定的索引上，指定的位置如果有元素，则向后移动
set(索引, 修改后的元素): 指定索引的元素进行修改
remove(索引): 删除索引上的元素
clear(): 清空集合

### eclipse 使用
- 新建工程
file -> new -> Project -> java Project --> 填写名字 -> 选择java版本，默认即可 -> finish
- 新建类
src -> 右键 -> new -> class -> package删掉 -> 填写类名 -> 勾选main方法 -> finish
- 运行
右键 -> run as -> java application
- 删除默认注释
window - preferences -> java -> code style -> code templates -> code -> method body，constructor， -> edit -> 删除
- 快捷键
alt + /: 自动补全
ctrl + shift + f: 代码格式化
ctrl + / : 单行注释
ctrl + shift + /: 添加多行注释
ctrl + shift + \: 取消多行注释
ctrl + shift + o: 自动导入用到的包
alt + 上下箭头 移动当前代码行
ctrl + alt + 上下箭头 复制当前代码行
ctrl + d: 删除当前代码行
ctrl + 1: 意见提示功能

1. 先按照名词提炼问题领域中的对象
2. 对对象进行描述，其实就是在明确对象