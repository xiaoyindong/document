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
2. 对对象进行描述，其实就是在明确对象中应该具备的属性和功能
3. 通过new的方式就可以创建该事物的具体对象
4. 通过该对象调用它以后的功能

包就是文件夹
new -> package -> 填写包名(国家.域名.名称)
新建cn.feiyang.test的包 -> 新建类 -> 不需要main方法
```
public class Car {
    String color;
    int count;
    public void run() {
        System.out.print("小汽车在跑: " + color);
    }
}

public class CarTest {
    public static void main(String[] args) {
        Car c = new Car();
        c.color = "无色";
    }
}
```

局部变量和成员变量的区别
- 定义的位置不同
成员变量定义在类中
局部变量定义在方法或者{}内
- 在内存中的位置不同
成员变量在堆的中
局部变量存储在栈中
- 生命周期不同
成员变量随着对象的出现而出现在堆中，随着对象的消失而从堆中消失
局部变量随着方法的运行而出现在栈中，随着方法的弹栈而消失
- 初始化不同
成员变量因为在堆内存中，所以默认的初始化值
局部变量没有默认的初始化值，必须手动的给其赋值才可以使用

### 封装
方法就是一个最基本封装体
类其实也是一个封装体
1. 提高了代码的复用性
2. 隐藏了实现细节，还要对外提供可以访问的方式，便于调用者的使用，这是核心之一，也可以理解为就是封装的概念
3. 提高了安全性

### private 关键字
私有，属于成员修饰符，不能修饰局部变量
对私有变量，提供公共的访问方式，通过方法去访问
```
public class Person {
    private age;
    public void setAge(int age) {
        age = age;
    }
    public int getAge() {
        return age;
    }
}
```

### this关键字
区分成员变量和局部变量的重名问题

### 继承
子类继承父类的属性和方法
使用extends关键字
1. 继承的出现提高了代码的复用性，提高软件开发效率
2. 继承的出现让类与类之间产生了关系，提供了多态的前提

java中，类只支持单继承，不允许多继承，也就是一个类只能有一个父类，不能有多个父类
this. 滴啊用自己的本类成员
super. 调用自己的父类成员

子类中，出现了和父类一模一样的方法的时候，子类重写父类的方法，子类中会覆盖父类的方法。
重写父类方法的时候，最好在子类中通过super.方法名调用一下父类方法，保留父类方法功能
重写方法注意，子类方法的权限要大于等于父类方法的权限
public > protected -> default -> private
default权限是默认权限，如果使用改权限，不能写改关键字，写了就会报错
返回值，方法名，参数列表要保证一模一样

### 抽象
父类知道子类包含哪些方法和哪些变量，父类不知道如何实现，父类就要抽象
抽象的方法不允许有主体，也就是不能有大括号
抽象的方法存在于一个抽象的类中 abstract
```
public abstract class Develop {
    // 必须使用abstract关键字修饰
    public abstract void work();
}
```
抽象类不能实例化对象，也就是不能使用new调用
可以使用类，继承抽象类，将抽象方法重写。创建子类对象
抽象关键字不能和private共同使用，private修饰的方法是不能被继承得到的，也就没办法重写
```
public class JavaEE extends Develop {
    public void work() {
        System.out.print("继承类");
    }
}
```

抽象类的特点。
1. 抽象类和抽象方法都需要被abstract修饰，抽象方法一定要定义在抽象类之中
2. 抽象类不可以直接创建对象，原因是抽象方法没有意义
3. 只有覆盖了抽象类中所有的抽象方法后，其子类才可以创建对象，否则改子类还是一个抽象类

自动生成get和set方法
右键 -> source -> generate getters and setters -> select all -> ok;

### 接口
接口是功能的集合，同样可看做是一种数据类型，是比抽象类更抽象的类
接口只描述所应具备的方法，并没有具体实现。
```
public interface Test {
    public abstract void function();
}
```
接口定义
    成员方法，全抽象
    不能定义带有方法体的方法
定义抽象方法: 固定格式
    public abstract 返回值类型 方法名(参数列表);
    修饰符 public 写或者不写，都是public
接口成员变量
    成员变量必须定义为常量，永远不可以改变
    public static final int a = 1;

接口的实现
implements

接口实现可以实现无数个
```
// instanceof 判断对象是否是类的实例
person p = new Person();
p instanceof Person;
```
接口的特点:
1. 定义一个接口用interface关键字
    public interface Inter {}
2. 一个类实现一个接口，实现implements 关键字
    class Demo implements Inter {}
3. 接口不能直接创建对象
    通过多态的方式，由子类来创建对象，接口多态
接口成员的特点
1. 成员变量
    只能是final修饰的常量
    默认修饰符：public static final
    public 权限
    static 可以直接通过类名调用
    final 最终值，固定值
2. 构造方法
3. 成员方法
    只能是抽象方法
    默认修饰符 public abstract
    重写接口中的抽象方法，public权限是必须的
4. 实现类和实现方法
    实现类，实现接口，重写接口全部抽象方法，创建实现类对象
    实现类，重写了一部分抽象方法，实现类，还是一个抽象类

类继承类的同事，可以实现多个接口
```
public class C extends D implements A, B {

}
```
接口中权限只能是public
接口是一种暴露出来的规则

接口和抽象类的区别

犬
    行为
        吼叫
        吃饭
缉毒犬
    行为
        吼叫
        吃饭
        缉毒
通用的东西是出现，额外的东西是接口
继承抽象，实现接口

优先选用接口，尽量少用抽象类
需要定义子类的行为，又要为子类提供共性功能时采选用抽象类

### 多态
多态：理解为同一种特质的多重状态
```
Person p = new Student();
```
多态使用的前提
    1. 有继承或者实现关系
    2. 要方法重写
    3. 父类引用指向子类对象。
成员变量的特点
    编译的时候，参考父类中有没有这个变量，如果有，编译成功，否则编译失败
    运行的时候，运行的是父类中的变量值。
成员的方法特点
    编译的时候，参考父类中有没有这个方法，如果有，编译成功，否则编译失败
    运行的时候，运行的是子类中的方法。
多态的成员访问特点
    方法的运行看右边，其它看左边
多态的好处
    提高了程序的扩展性
多态的弊端
    不能访问子类的特有功能
多态的分类
    类的多态
### 构造方法
自定义的Person类，成员变量，name，age
要求在new，Person的同时，就指定好name，age的值
实现功能，利用方法去实现，构造方法，构造器，Constructor
作用: 在new 的同时，对成员变量赋值，给对象的属性初始化赋值，new Person，对属性name，age赋值

构造方法的定义格式
    权限 方法名(参数列表) {

    }
    方法的名字必须和类名完全一致
    不能有返回值，void也不可以写。
```
public class Person {
    private String name;
    publc Person(String name) {
      