#csharp图解编程  #csharp学习 #学习笔记 
 
# 1 什么是匿名类型
创建匿名类型的变量使用相同的形式，但是没有类名和构造函数。如下的代码行演示了匿名类型的对象创建表达式：

```csharp
没有类名
   ↓
new {FieldProp=InitExpr,FieldProp=InitExpr,...}
              ↑
        成员初始化语句
```


需要了解的有关匿名类型的重要事项如下
- 匿名类型只能和局部变量配合使用，不能用于类成员
- 由于匿名类型没有名字，我们必须使用var关键字作为变量类型
- 不能设置匿名类型对象的属性。编译器为匿名类型创建的属性是只读的

当编译器遇到匿名类型的对象初始化语句时，它创建一个有名字的新类类型。低于每个成员初始化语句，它推断其类型并创建一个只读属性来访问它的值。属性和成员初始化语句具有相同名字。匿名类型被构造后，编译器创建了这个类型的对象。

# 2 方法语法和查询语法

- 方法语法（method syntax）使用标准的方法调用。这些方法是一组标准查询运算符的方法
- 查询语法（query syntax）看上去和SQL语句相似
- 在一个查询中可以组合两种形式

方法语法是命令式（imperative）的，它指明了查询方法调用的顺序。  
查询语法是声明式（declarative）的，即查询描述的是你想返回的东西，但并么有指明如何执行这个查询。

```csharp
class Program
{
    static void Main()
    {
        int[] numbers={2,5,28,31,17,16,42};
        var numsQuery=from n in numbers         //查询语法
                      where n<20
                      select n;
        var numsMethod=numbers.Where(x=>x<20);  //方法语法
        int numsCount=(from n in numbers        //两种形式组合
                       where n<20
                       select n).Count();
        foreach(var x in numsQuery)
        {
            Console.Write("{0}, ",x);
        }
        Console.WriteLine();
        foreach(var x in numsMethod)
        {
            Console.Write("{0}, ",x);
        }
        Console.WriteLine();
        Console.WriteLine(numsCount);
    }
}
```

```ad-note
- 如果查询表达式返回枚举，查询直到处理枚举时才会执行
- 如果枚举被处理多次，查询就会执行多次
- 如果在进行遍历后，查询执行之前数据有改动，则查询会使用新的数据
- 如果查询表达式返回标量，查询立即执行，并且把结果保存在查询变量中
```

# 3 查询表达式的结构

![Pasted image 20230719181558](https://cdn.jsdelivr.net/gh/Ailurus-2233/PicGo-ImageRepo@main/work-Image/202308281115487.png)

## 3.1 from 子句
from子句指定了要作为数据源使用的数据集合。它还引入了迭代变量。有关from子句的要点如下：

- 迭代变量逐个表示数据源的每个元素
- from子句的语法如下
    - Type是集合中元素的类型。这是可选的，因为编译器可以从集合来推断类型
    - Item是迭代变量的名字
    - Items是要查询的集合的名字。集合必须是可枚举的，见第18章

```csharp
from Type Item in Items
```

```ad-note
尽管LINQ的from子句和foreach语句非常相似，但主要不同点如下：
- foreach语句命令式地指定了从第一个到最后一个按顺序地访问集合中的项。而from子句则声明式地规定集合中的每个项都要被访问，但并没有假定以什么样的顺序
- foreach语句在遇到代码时就执行其主体，而from子句什么也不执行。只有在程序的控制流遇到访问查询变量的语句时，才会执行查询
```


## 3.2 join 子句

- 使用联结来结合两个多多个集合中的数据
- 联结操作接受两个集合然后创建一个临时的对象集合，每个对象包含原始集合对象中的所有字段

```csharp
关键字        关键字         关键字      关键字
 ↓             ↓             ↓          ↓
join Identifier in Collection2 on Field1 equals Field1
                       ↑
              指定另外的集合和ID引用它
var query=from s in students
          join c in studentsInCourses on s.StID equals c.StID
```

## 3.3 from…let…where 用法
```csharp
class Program
{
    static void Main()
    {
        var groupA = new[]{3,4,5,6};
        var groupB = new[]{6,7,8,9};
        var someInts = from a in groupA
                     from b in groupB
                     let sum = a+b
                     let time = a * b     
                     where sum >= 11
                     where a == 4
                     select new{a,b,sum};
        foreach(var a in someInts)
        {
            Console.WriteLine(a);
        }
    }
}
```

## 3.4 orderby 子句
orderby子句根据表达式按顺序返回结果项。  可选的ascending和descending关键字设置了排序方向。

```csharp
orderby Field [ascending|descending]
```

## 3.5 group子句
select…group子句的功能如下所示。

- select子句指定所选对象的哪部分应该被select。它可以指定下面的任意一项
	- 整个数据项
	- 数据项的一个字段
	- 数据项的几个字段组成的新对象（或类似其他值）
- group…by子句是可选的，用来指定选择的项如何分组
	- 如果项包含在查询的结果中，它们就可以根据某个字段的值进行分组。作为分组依据的属性叫做_键_（key）
	- group子句返回的不是原始数据源中项的枚举，而是返回可以枚举已经形成的项的分组的可枚举类型
	- 分组本身是可枚举类型，它们可以枚举实际的项

```csharp
using System;
using System.Linq;
class Program
{
    static void Main()
    {
        var students=new[]
        {
            new{LName="Jones",FName="Mary",Age=19,Major="History"},
            new{LName="Smith",FName="Bob",Age=20,Major="CompSci"},
            new{LName="Fleming",FName="Carol",Age=21,Major="History"},
        };
        var query=from s in students
                  group s by s.Major;
        foreach(var s in query)
        {
            Console.WriteLine("{0}",s.Key);
            foreach(var t in s)
            {
                Console.WriteLine("      {0},{1}",t.LName,t.FName);
            }
        }
    }
}
```
![Pasted image 20230719182652](https://cdn.jsdelivr.net/gh/Ailurus-2233/PicGo-ImageRepo@main/work-Image/202308281115488.png)

## 3.6 into子句

查询延续子句可以接受查询的一部分结果并赋予一个名字，从而可以在查询的另一部分中使用。

```csharp
class Program
{
    static void Main()
    {
        var groupA=new[]{3,4,5,6};
        var groupA=new[]{6,7,8,9};
        var someInts=from a in groupA
                     join b in groupB on a equals b
                     into groupAandB
                     from c in groupAandB
                     select c;
        foreach(var a in someInts)
        {
            Console.WriteLine(a);
        }
    }
}
```

# 4 标准查询运算符

## 4.1 基本的查询方法

标准查询运算符由一系列API方法组成，它能让我们查询任何.NET数组或集合。  
标准查询运算符的重要特性如下：

- 被查询的集合对象叫做序列，它必须实现`IEnumerable<T>`接口，T是类型
- 标准查询运算符使用方法语法
- 一些运算符返回IEnumerable对象（或其他序列），而其他的一些运算符返回标量。返回标量的运算符立即执行，并返回一个值
- 很多操作都以一个谓词作为参数。谓词是一个方法，它以对象为参数，根据对象是否满足某条件而返回true或false

![Pasted image 20230719182842](https://cdn.jsdelivr.net/gh/Ailurus-2233/PicGo-ImageRepo@main/work-Image/202308281115489.png)

```csharp
using System.Linq;
...
static void Main()
{
    int[] intArray=new int[]{3,4,5,6,7,9};
    //方法语法
    var count1=Enumerable.Count(intArray);
    var firstNum1=Enumerable.First(intArray)
    //扩展语法
    var count2=intArray.Count();
    var firstNum2=intArrya.First();
    Console.WriteLine("Count: {0},FirstNumber: {1}",count1,firstNum1);
    Console.WriteLine("Count: {0},FirstNumber: {1}",count2,firstNum2);
}
```
## 4.2 将委托作为参数

它有一个泛型委托作为参数。调用时，我们提供一个接受单个T类型的输入参数并返回布尔值的委托对象。

```csharp
public static int Count<T>(this IEnumerable<T> source,Func<T,bool> predicate);
```
而对于Func的定义如下

```csharp
public delegate TR Func<out TR>();
public delegate TR Func<in T1, out TR>(T1 a1);
public delegate TR Func<in T1,in T2,out TR>(T1 a1,T2 a2);
public delegate TR Func<in T1,in T2, in T3, out TR>(T1 a1,T2 a2, T3 a3);
                ↑               ↑                         ↑
              返回类型         类型参数                  方法参数
```
注意返回类型参数有out关键字，使之可以协变，即可以接受声明的类型或从这个类型派生的类型。输入参数有in关键字，使之可以逆变，即你可以接受声明的类型或从这个类型派生的类型。

**使用lambda表达式：**
```csharp
class Program
{
    static void Main()
    {
        int[] intArray=new int[] {3,4,5,6,7,9};
        var countOdd=intArray.Count(n=>n%2!=0);//Lambda表达式
        Console.WriteLine("Count of odd numbers: {0}",countOdd);
    }
}
```

# 5 XML

## 5.1 XML基础
XML文档中的数据包含了一个XML树，它主要由嵌套元素组成。元素是XML树的基本要素。每个元素都有名字且包含数据，一些元素还包含其他被嵌套元素。元素由开始和关闭标签进行划分。任何元素包含的数据都必须介于开始和关闭标签之间。

- 开始标签 `<ElementName>`
- 结束标签 `</ElementName>`
- 无内容的单个标签 `<ElementName/>`

有关XML的重要事项：

- XML文档必须有一个根元素包含所有其他元素
- XML标签必须合理嵌套
- 与HTML标签不同，XML标签是区分大小写的
- XML特性是名字/值的配对，它包含了元素的额外元数据。特性的值部分必须包含在引号内，单引号双引号皆可
- XML文档中的空格是有效的。这与把空格作为当个空格输出的HTML不同

## 5.2 XML类

- 可作为XDocument节点的直接子节点
	- 大多数情况下，下面每个节点类型各有一个：XDeclaration节点、XDocumentType节点以及XElement节点
	- 任何数量的XProcessingInstruction节点
- 如果在XDocument中有最高级别的XElement节点，那么它就是XML树中其他元素的根
- 根元素可以包含任意数量的XElement、XComment或XProcessingInstruction节点，在任何级别上嵌套

除了XAttribute类，大多数用于创建XML树的类都从一个叫做XNode的类继承，一般在书中也叫做“XNodes”。


## 5.3 创建、保存、加载和显式XML文档
```csharp
using System;
using System.Xml.Linq;
class Program
{
    static void Main()
    {
        XDocument employees1=
            new XDocument(                    //创建XML文档
                new XElement("Employees",
                    new XElement("Name","Bob Smith"),
                    new XElement("Name","Sally Jones")
                )
            );
        employees1.Save("EmployeesFile.xml"); //保存到文件
        XDocument employees2=XDocument.Load("EmployeesFile.xml");
                                       ↑
                                   静态方法
        Console.WriteLine(employees2);         //显式文件
    }
}
```

**使用XML树的值:**
![Pasted image 20230802162218](https://cdn.jsdelivr.net/gh/Ailurus-2233/PicGo-ImageRepo@main/work-Image/202308281115490.png)

关于上表，需要注意的一些事项如下：

- Nodes 
	- Nodes方法返回`IEnumerable<object>`类型的对象，因为返回的节点可能是不同的类型，比如XElement、XComment等。我们可以使用以类型作为参数的方法`OfType(type)`来指定返回某类型的节点。例如，如下代码只能获取XComment节点
	- `IEnumerable<XComment> comments=xd.Nodes().OfType<XComment>()`
- Elements 
	- 由于获取XElement是非常普遍的需求，就出现了`Nodes.OfType(XElement)()`表达式的简短形式Elements方法
	- 无参数的Elements方法返回所有子XElements
	- 单个name参数的Elements方法返回具有这个名字的子XElements。例如，如下代码返回具有名字PhoneNumber的子XElement节点
	- `IEnumerable<XElement> empPhones=emp.Elements("PhoneNumber");`
- Element 这个方法只获取当前节点的第一个子XElement。如果无参数，获取第一个XElement节点，如果带一个参数，获取第一个具有此名字的子XElement
- Descendants和Ancestors 这些方法和Elements以及Parent方法差不多，只不过它们不返回直接的子元素和父元素，而是忽略嵌套级别，包括所有之下或者之上的节点

**增加节点以及操作XML**

![Pasted image 20230802162422](https://cdn.jsdelivr.net/gh/Ailurus-2233/PicGo-ImageRepo@main/work-Image/202308281115491.png)

**使用XML特性**

特性提供了有关XElement节点的额外信息，它放在XML元素的开始标签中。我们以函数方法构造XML树时，只需在XElement的构造函数中包含XAttribute构造函数来增加特性。XAttribute构造函数有两种形式一种是接受name和value，另一种是接受现有XAttribute的引用。

```csharp
XDocument xd=new XDocument(
    new XElement("root",
            new XAttribute("color","red"), // 初始化特性
            new XAttribute("size","large"),
        new XElement("first"),
        new XElement("second")
    )
);
```

```csharp
XElement rt=xd.Element("root");
XAttribute color=rt.Attribute("color"); // 获取属性
XAttribute size=rt.Attribute("size");
Console.WriteLine("color is {0}",color.Value); // 调用属性的值
Console.WriteLine("size is {0}",size.Value);
```

```csharp
rt.Attribute("color").Remove();//移除color特性
```

```csharp
rt.SetAttributeValue("size","midium");  // 添加或修改属性的值
```

## 5.4 节点的其他类型


**XComment**

XML注释由`<!--`和`-->`记号间的文本组成。记号间的文本会被XML解析器忽略。我们可以使用XComment类向一个XML文档插入文本。代码：`new XComment("This is a comment")  `。这段代码产生如下XML文档：`<!--This is a comment--> `

**XDeclaration**

XML文档从包含XML使用的版本号、字符编码类型以及文档是否依赖外部引用的一行开始。这是有关XML的信息，因此它其实是有关数据的元数据。这叫做XML声明，可以使用XDeclaration类来插入，如下代码给出了XDeclaration的示例：`new XDeclaration("1.0","uff-8","yes") `这段代码产生如下XML文档：`<?xml version="1.0" encoding="utf-8 " standalone="yes"?> `

**XProecssingInstruction**

XML处理指令用于提供XML文档如何被使用和翻译的额外数据，最常见的就是把处理指令用于关联XML文档和一个样式表。我们可以使用XProecssingInstruction构造函数来包含处理指令。它接受两个字符串参数：目标和数据串。如歌处理指令接受多个数据参数，这些参数必须包含在XProecssingInstruction构造函数的第二个字符串参数中，如下的构造函数代码所示。 `new XProecssingInstruction("xml-stylesheet",@"href=""stories"",type=""text/css""") `这段代码产生如下XML文档：`<?xml-stylesheet href="stories.css" type="text/css"?> `

## 5.5 使用LINQ to XML的LINQ 查询

csharp
class Program
{
    static void Main()
    {
        XDocument xd=XDocument.Load("SimpleSample.xml");
        XElement rt=xd.Element("MyElements");
        var xyz=from e in rt.Elements()
                where e.Name.ToString().Length==5
                select e;
        foreach(XElement x in xyz)
        {
            Console.WriteLine(x.Name.ToString());
        }
        Console.WriteLine();
        foreach(XElement x in xyz)
        {
            Console.WriteLine("Name: {0}, color: {1}, size: {2}",
                              x.Name,
                              x.Attribute("color").Value,
                              x.Attribute("size").Value);
        }
    }
}
```