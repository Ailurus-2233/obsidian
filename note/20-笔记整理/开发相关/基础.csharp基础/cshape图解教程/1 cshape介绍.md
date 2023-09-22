#csharp图解编程 #csharp学习 #学习笔记

# 1 什么是.Net框架？它的特点是什么？它有什么优势？

.Net框架由三部分组成：编程工具，基类库（BCL），公共语言运行库（CLR）

.Net的特点：多平台，行业标准，安全性

.Net的优势：面向对象的开发环境，自动垃圾收集，互操作性，不需要COM，简化的部署，类型安全性，基类库

# 2 .Net程序编译过程是什么？

.Net兼容语言的源代码文件->.Net兼容编译器->程序集（公共中间语言CIL，类型信息，安全信息，程序中使用的类型的元数据，对其他程序集引用的元数据）-> JIL编译器 -> 本机代码 -> 操作系统服务。

# 3 什么是CLR？它有什么功能？

CLR是.NET框架的核心组件，他在操作系统的顶层，负责管理程序的执行，除此之外他还提供：1.内存管理和垃圾收集；2.代码安全验证；3.通过访问BCL得到广泛的编程功能。

按点来说：1.类加载器；2.代码执行；3.线程管理；4.异常处理；5.反射服务；6.内存管理；7.垃圾收集；8.安全服务；9.JIT编译器；10.BCL支持的编程功能。

# 4 CLI的组成有什么？

CLI Common Language Infrastructure 公共语言基础结构

1. 公共语言运行库 CLR
2. 公共语言规范 CLS
3. 基类库 BCL
4. 元数据定义及语义
5. 公共类型系统 CTS
6. 公共中间语言CIL指令组

# 5 基础程序中的每一行指令的意义是什么？

```csharp
using System;

namespace Simple
{
    class Program
    {
        static void Main()
        {
            Console.WriteLine("Hi there!");
        }
    }
}
```

- 使用命名空间 System中的类型，这样接下来的程序中可以调用System中的一些方法，如Console类中的WriteLine()方法
- 声明一个新的命名空间 Simple 其中 4-12行 中声明的任何类型都是该命名空间的成员
- 声明一个类 Hello 其中6-11行中声明的成员都是属于该类的成员
- 声明一个方法 Main 作为类Hello 的成员 注：Main是特殊的方法，编译器将他作为程序的起点
- 一条简单的语句，用来构成Main方法的方法体，这条语句的功能是，使用Console类中的WriteLine方法，将"Hello, World" 输出到屏幕 注：Console类是命名空间System中的成员

# 6 标识符书写规则

C# 的命名规则

1. 字母和下滑线可以放在任何位置
2. 数字不能放在首位
3. @只能放在首位。（允许但不推荐）

# 7 关键字列表

关键字是预定义的保留标识符，对编译器有特殊意义。 除非前面有 `@` 前缀，否则不能在程序中用作标识符。 例如，`@if` 是有效标识符，而 `if` 则不是，因为 `if` 是关键字。

[abstract](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/abstract) [as](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/operators/type-testing-and-cast#as-operator) [base](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/base) [bool](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/bool) [break](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/statements/jump-statements#the-break-statement) [byte](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/integral-numeric-types) [case](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/statements/selection-statements#the-switch-statement) [catch](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/try-catch) [char](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/char) [checked](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/checked) 

[class](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/class) [const](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/const) [continue](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/statements/jump-statements#the-continue-statement) [decimal](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/floating-point-numeric-types) [default](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/default) [delegate](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/reference-types) [do](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/statements/iteration-statements#the-do-statement) [double](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/floating-point-numeric-types) [else](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/statements/selection-statements#the-if-statement) 

[enum](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/enum)[event](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/event)[explicit](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/operators/user-defined-conversion-operators)[extern](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/extern)[false](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/bool)[finally](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/try-finally)[fixed](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/fixed-statement)[float](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/floating-point-numeric-types)[for](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/statements/iteration-statements#the-for-statement)[foreach](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/statements/iteration-statements#the-foreach-statement)

[goto](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/statements/jump-statements#the-goto-statement)[if](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/statements/selection-statements#the-if-statement)[implicit](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/operators/user-defined-conversion-operators)[in](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/in)[int](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/integral-numeric-types)[interface](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/interface)[internal](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/internal)[is](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/operators/is)[lock](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/statements/lock)[long](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/integral-numeric-types)[namespace](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/namespace)

[new](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/operators/new-operator)[null](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/null)[object](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/reference-types)[operator](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/operators/operator-overloading)[out](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/out)[override](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/override)[params](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/params)[private](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/private)[protected](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/protected)

[public](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/public)[readonly](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/readonly)[ref](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/ref)[return](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/statements/jump-statements#the-return-statement)[sbyte](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/integral-numeric-types)[sealed](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/sealed)[short](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/integral-numeric-types)[sizeof](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/operators/sizeof)[stackalloc](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/operators/stackalloc)

[static](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/static)[string](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/reference-types)[struct](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/struct)[switch](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/operators/switch-expression)[this](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/this)[throw](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/throw)[true](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/bool)[try](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/try-catch)[typeof](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/operators/type-testing-and-cast#typeof-operator)[uintulong](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/integral-numeric-types)

[unchecked](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/unchecked)[unsafe](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/unsafe)[ushort](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/integral-numeric-types)[using](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/using)[virtual](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/virtual)[void](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/void)[volatile](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/volatile)[while](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/statements/iteration-statements#the-while-statement)

上下文关键字用于在代码中提供特定含义，但它不是 C# 中的保留字。 一些上下文关键字（如 `partial` 和 `where`）在两个或多个上下文中有特殊含义。

[add](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/add)[and](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/operators/patterns#logical-patterns)[alias](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/extern-alias)[ascending](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/ascending)[args](https://learn.microsoft.com/zh-cn/dotnet/csharp/fundamentals/program-structure/top-level-statements#args)[async](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/async)[await](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/operators/await)[by](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/by)[descending](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/descending)[dynamic](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/reference-types)

[equals](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/equals)[from](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/from-clause)[get](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/get)[global](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/operators/namespace-alias-qualifier)[group](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/group-clause)[init](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/init)[into](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/into)[join](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/join-clause)[let](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/let-clause)[nameof](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/operators/nameof)[nint](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/integral-numeric-types)[not](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/operators/patterns#logical-patterns)

[notnull](https://learn.microsoft.com/zh-cn/dotnet/csharp/programming-guide/generics/constraints-on-type-parameters#notnull-constraint)[nuint](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/integral-numeric-types)[on](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/on)[or](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/operators/patterns#logical-patterns)[orderby](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/orderby-clause)[partial（类型）](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/partial-type)[partial（方法）](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/partial-method)[record](https://learn.microsoft.com/zh-cn/dotnet/csharp/fundamentals/types/records)

[remove](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/remove)[select](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/select-clause)[set](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/set)[unmanaged（泛型类型约束）](https://learn.microsoft.com/zh-cn/dotnet/csharp/programming-guide/generics/constraints-on-type-parameters#unmanaged-constraint)[value](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/value)[var](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/var)[when（筛选）](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/when)
[where（泛型类型约束）](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/where-generic-type-constraint)[where（查询子句）](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/where-clause)[with](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/operators/with-expression)[yield](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/yield)

# 8 如何打印输出文字到控制台？

控制台窗口是一种简单的命令提示窗口，允许程序显示文本并从键盘接受输入。BCL提供一个名称为Consolel的类（在System命名空间中），该类包含了输入和输出数据到控制台窗口的方法。

打印的方式有两种，`Write()`和`WriteLine()`。 区别在于后者在输出完字符串后自动添加了换行符。

# 9 格式字符串的组成

```
"{index, alignment:formatString}"
```

其中alignment的规则是：

1. 整数表示字段使用字符的最少数量
2. 符号表示右对齐或者左对齐，正数表示右对齐，负数表示左对齐

formatString有哪些

| 格式符           | 属性           | 说明                                                                                                                            |
| ---------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| B 或 b           | 二进制         | 结果：二进制字符串。受以下类型支持：仅整型 (.NET 8+)。精度说明符：结果字符串中的位数。                                          |
| “C”或“c”         | 货币           | 结果:货币值。受以下类型支持：所有数值类型。精度说明符：十进制小数位数。                                                         |
| “D”或“d”         | 十进制         | 结果:整型数字，负号可选。受以下类型支持：仅限整型类型。精度说明符：数字位数下限。默认值精度说明符：所需数字位数下限。           |
| “E”或“e”         | 指数（科学型） | 结果:指数表示法。受以下类型支持：所有数值类型。精度说明符：十进制小数位数。默认值精度说明符：6.                                 |
| “F”或“f”         | 定点           | 结果:整数和十进制小数，负号可选。受以下类型支持：所有数值类型。精度说明符：十进制小数位数。                                     |
| “G”或“g”         | 常规           | 结果:更紧凑的定点表示法或科学记数法。受以下类型支持：所有数值类型。精度说明符：有效位数。默认值精度说明符：具体取决于数值类型。 |
| “N”或“n”         | 数字           | 结果:整数和十进制小数、组分隔符和十进制小数分隔符，负号可选。受以下类型支持：所有数值类型。精度说明符：所需的小数位数。         |
| “P”或“p”         | 百分比         | 结果:数字乘以 100 并以百分比符号显示。受以下类型支持：所有数值类型。精度说明符：所需的小数位数。                                |
| “R”或“r”         | 往返过程       | 结果:可以往返至相同数字的字符串。                                                                                               |
| “X”或“x”         | 十六进制       | 结果:十六进制字符串。受以下类型支持：仅限整型类型。精度说明符：结果字符串中的位数。                                             |
| 任何其他单个字符 | 未知说明符     | 结果:在运行时引发system.formatexception                                                                                         |
