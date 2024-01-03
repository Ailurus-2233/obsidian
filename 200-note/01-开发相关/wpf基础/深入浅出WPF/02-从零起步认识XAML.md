#WPF学习 #深入浅出WPF 

## WPF 项目构成

1. Properties分支：里面的主要内容是程序要用到的一些资源（如图标、图片、静态的字符串）和配置信息。
2. References分支：标记了当前这个项目需要引用哪些其他的项目，[里面列出来的条目.NET](http://xn--79qpcz12gpa964qhsam81m4lj.NET) Framework类库或其他程序员编写的项目及类库。
3. App.xaml分支：程序的主体。大家知道，在Windows系统里，一个程序就是一个进程。Windows还规定，一个GUI进程需要有一个窗体作为主窗体。App.xaml文件的作用就是声明了程序的进程会是谁，同时指定了程序的主窗体是谁。在这个分支里还有一个文件App.xaml.cs,它是App.xaml的后台代码。
4. MainWindow.xaml分支：程序的主窗体，它也具有自己的后台代码MainWindow.xaml.cs。

## XAML概述

XAML是一种由XML派生而来的语言，所以很多XML中的概念在XAML是通用的。比如， 使用标签声明一个元素（每个元素对应内存中的一个对象）时，需要使用起始标签<Tag>和终止标签</Tag>,夹在起始标签和终止标签中的XAML代码表示是隶属于这个标签的内容。如果没有什么内容隶属于某个标签，则这个标签称为空标签，可以写为<Tag/>。

### Property 与 Attribute

Property属于面向对象理论范畴。在使用面向对象思想编程的时候，常常需要对客观事物进行抽象，再把抽象出来的结果封装成类，类中用来表示事物状态的成员就是Property。

Attribute则是编程语言文法层面的东西。比如有两个同类的语法元素A和B,为了表示A与 B不完全相同或者A与B在用法上有些区别，这时候就要针对A和B加一些Attribute。

因为XAML是用来在UI上绘制控件的，而控件本身就是面向对象抽象的产物，所以XAML标签的Attribute里就有一大部分是与控件对象的Property互相对应的.当然，这还意味着XAML标签还有一些Attribute并不对应控件对象的Property。

## XAML 初步标签详解

```xml
<Window>
	<Grid>
	</Grid>
</Window>
```

XAML是一种"声明”式语言，当你见到一个标签，就意味着声明了一个对象，对象之间的层级关系要么是并列、要么是包含，全都体现在标签的关系上.对于任何一个**WPF窗口**，**总体结构是一个<Window>标签内部包含着一个<Grid>标签**（或者说＜Grid＞标签是＜Window＞标签的内容），代表的含义是一个窗体对象内嵌套着一个Grid对象。

``` xml
x:Class="MyFirstWpfApplication.MainWindow"
xmlns="<http://schemas.microsoft.com/winfx/2006/xaml/presentation>"
xmlns:x="<http://schemas.microsoft.com/winfx/2006/xamr>
Title="Window!" Heighr"300" Width=”300"
```

这些代码就都是<Window>标签的Attribute，其中，Title、Height和Width 一看就知道是与Window对象的Property相对应的。中间两行（即两个`xmlns`）是在声明名称空间，这两个地址定义了一个或一组的类库。最上面一行是在使用名为Class的Attribute，这个Attribute来自于`x:`前缀所对应的名称空间。

``` xml
xmlns[:可选的映射前缀]="名称空间"
```

XML语言有一个功能就是可以在XML文档的标签上使用xmlns特征来定义名称空间（Namespace）, xmlns也就是XML-Namespace的缩写了。定义名称空间的好处就是，当来源不同的类重名时，可以使用名称空间加以区分。xmlns后可以跟一个可选的映射前缀，之间用冒号分隔。如果没有写可选映射前缀，那就意味着所有来自于这个名称空间的标签前都不用加前缀，这个没有映射前缀的名称空间称为"默认名称空间"。默认名称空间只能有一个，而且应该选择其中元素被最频繁使用的名称空间来充当默认名称空间。

## XAML本质

x:Class这个Attribute的作用是当XAML解析器将包含它的标签解析成C#类后，这个类的类名是什么。这里，已经触及到的XAML的本质。前面我们已经看到，示例代码的结构就是使用XAML语言直观地告诉我们，当前被设计的窗体是在一个<Window>里面嵌套了一个<Grid>。xaml文件中声明的类和其对应的cs文件共同编译生成一个类，其中cs文件中的class声明为

```csharp
public partial class MainWindow : Window
```

通过partial关键字，就可以将一个类分为两个部分一起编译，在xaml中，主要定义了类的样式，动画等，而在cs文件中，主要定义了类的逻辑代码等。