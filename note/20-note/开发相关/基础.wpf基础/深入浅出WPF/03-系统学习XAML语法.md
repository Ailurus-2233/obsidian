#WPF学习 #深入浅出WPF

## XAML中为对象属性赋值的语法

XAML中为对象属姓赋值共有两种语法：

- 使用字符串进行简单赋值
- 使用属性元素(Property Element)进行复杂赋值

### 使用字符串赋值

`Attribute=Value` 实例如下：

```csharp
<Rectangle x:Name="rectangle" Width="200" Height="120" Fill="Blue"/>
```

这个XAML标签就声明了一个`Ractangle`对象，其中的属性`Width`、`Height`、`File` 都直接通过字符串声明。即一个长宽为$200\times 120$ 被蓝色填充的一个长方形。

从对象的层面来说，`Rectangle.Fill` 的类型是Brush，Brush是一个抽象类，所以以下的对象都可以作为属性的值：

- `SolidColorBrush`：单色画刷
- `LinearGradientBrush`：线性渐变画刷
- `RadialGradientBrush`：径向渐变画刷
- `ImageBrush`：位图画刷
- `DrawingBrush`：矢量图画刷
- `VisualBrush`：可视元素画刷

### 属性元素

在XAML中，非空标签均具有自己的内容（Content）。标签的内容指的就是夹在起始标签和结束标签之间的一些子级标签，每个子级标签都是父级标签内容的一个元素（Element）,简称为父级标签的一个元素。如下所示，这样，在这个标签的内部就可以使用对象（而不再局限于简单的字符串）进行赋值了。

```xml
<ClassName>
	<ClassName.PropertyName>
		<!--以对象形式为属性赋值-->
	</ClassName.PropertyName>
</ClassName>
```

实例：

```xml
<Rectangle x:Name="rectanglcH Width-"200" Height="120">
	<Rectanglc.Fill>
		<SolidColorBrush Color="Blue"/>
	</Rectangle.Fill>
</Rectangle>
```

注：

- 能使用Attribute=Value形式赋值的就不使用属性元素.
- 充分利用默认值，去除冗余：`StartPoint="0,0"EndPoint="1,1"`是默认值，可以省略。
- 充分利用XAML的简写方式

### 标记扩展

```ad-note
所谓标记扩展，实际上是一种特殊的Attribute=Value语法，其特殊的地方在于Value字符串是由一对花括号及其括起来的内容姐成，XAML编译器会对这样的内容做出解析，生成相应的对象。
```

```xml
<TextBox Text=" {Binding ElementName=sliderl, Path=Value, Mode=OneWay}" Margin="5"/>
```
例如这段代码：
* 当编译器看到这句代码时就会把花括号里的内容解析成相应的对象
* 对象的数据类型名是紧邻左花括号的字符串
* 对象的属性由一串以逗号连接的子字符串负责初始化（注意，属性值不再加引号）

```ad-note
最后，使用标记扩展时还需要注意以下几点：
* 标记扩展是可以嵌套的，例如 `Text="{Binding Source={StaticResource myDataSource}, Path=PersonName}"`是正确的语法
* 标记扩展具有一些简写语法，例如`{Binding Value,…}`与`{Binding Path=Value,…}`是等价的，`{StaticResource myString, ...}` `{StaticResource ResourceKey=myString,…}`是等价的。两种写法中，前者称为固定位置参数,后者称为具名参数)。固定位置参数实际上就标记扩展类构造器的参数，其位置由构造器参数列表决定。
* 标记扩展类的类名均以单词Extension为后缀，在XAML使用它们的时候Extension后缀可以省略不写,比如写`Text="{x:Stalic …}"`与写`Text="{x:StaticExtension …}"`是等价的.
```

## 事件处理器与代码后置

在`.NET`事件处理机制中，可以为对象的某个事件指定一个能与该事件匹配的成员函数，当这个事件发生时，.NET运行时会去调用这个函数，即表示对这个事件的响应和处理。

```xml
<ClassName EventName="EventHandlerName" />
```

而翻译C#代码的话，例如：
```csharp
Button button1 = new Button();
button1.Click += new RoutedEventHandler(buttonl_Click);
```

这种将逻辑代码与UI代码分离、隐藏在UI代码后面的形式就叫作"代码后置"。

```ad-note
之所以能实现代码后置功能，是因为.NET支持partial类并能将解析XAML所生成的代码与`x:Class`所指定的类进行合并，有两点需要注意的是：
* 不只是事件处理器，一切用于实现程序逻辑的代码都要放在后置的C#文件中
* 默认情况下，VS为每个XAML文件生成的后置代码文件名为"XAML文件全名.cs"，比如XAML文件名为`MyWindow.xaml`，那么它的后置代码文件名为`MyWindow.xaml.cs`。这样做是为了方便包文件，但并不是必须的， 只要XAML解析器能找到`x:Class`所指定的类，无论你的文件叫什么名字都可以。
```

### 引用其他类库

语法：
```xml
xmlns:映射名="clr-namespace:类库中namespace的名字;assembly=类库文件名"
```

* xmlns是用于在XAML中声明名称空间的Attribute，它从XML语言继承而来，是XML Namespace 的缩写
* 冒号后的映射名是可选的，但由于可以不加映射名的默认名称空间已经被WPF的主要名称空间占用，所以所引用的名称空间都需要加上这个映射名。
* 引号中的字符串值确定了你要引用的是哪个类库以及类库中的哪个名称空间。

类的引用：
```xml
<映射名:类名>…</映射名:类名>
```

### XAML的注释

```xml
<!-- 注释内容 -->
```