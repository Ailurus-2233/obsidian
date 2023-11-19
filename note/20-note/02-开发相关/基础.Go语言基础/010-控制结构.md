# if 语句

if 语句是 Go 语言中提供的一种分支控制结构，它也是 Go 中最常用、最简单的分支控制结构。它会根据布尔表达式的值，在两个分支中选择一个执行。我们先来看一个最简单的、单分支结构的 if 语句的形式：

```go
if boolean_expression {
    // 新分支
}

// 原分支
```

分支结构是传统结构化程序设计中的基础构件，这个 if 语句中的代码执行流程就等价于下面这幅流程图：

![[Pasted image 20220402091849.png]]

虽然各种编程语言几乎都原生支持了 if 语句，但 Go 的 if 语句依然有着自己的特点：

1. 和 Go 函数一样，if 语句的分支代码块的左大括号与 if 关键字在同一行上，这也是 Go 代码风格的统一要求，gofmt 工具会帮助我们实现这一点；
2. if 语句的布尔表达式整体不需要用括号包裹，一定程度上减少了开发人员敲击键盘的次数。而且，if 关键字后面的条件判断表达式的求值结果必须是布尔类型，即要么是 true，要么是 false

## 逻辑操作符

![[Pasted image 20220402092119.png]]

如果判断的条件比较多，我们可以用多个逻辑操作符连接起多个条件判断表达式

```go
if (runtime.GOOS == "linux") && (runtime.GOARCH == "amd64") &&
    (runtime.Compiler != "gccgo") {
    println("we are using standard go compiler on linux os for amd64")
}
```

Go 语言的操作符是有优先级的。这里你要记住，一元操作符，比如上面的逻辑非操作符，具有最高优先级，其他操作符的优先级如下：
![[Pasted image 20220402092725.png]]

操作符优先级决定了操作数优先参与哪个操作符的求值运算，我们以下面代码中 if 语句的布尔表达式为例：

```go
func main() {
    a, b := false,true
    if a && b != true {
        println("(a && b) != true")
        return
    }
    println("a && (b != true) == false")
}
```

这段代码的关键就在于，if 后面的布尔表达式中的操作数 b 是先参与 && 的求值运算，还是先参与!= 的求值运算。根据前面的操作符优先级表，我们知道，!= 的优先级要高于 &&，因此操作数 b 先参与的是!= 的求值运算，这样 if 后的布尔表达式就等价于 a && (b != true) ，而不是我们最初认为的 (a && b) != true。

从学习和使用 C 语言开始，我自己就记不住这么多操作符的优先级，况且不同编程语言的操作符优先级还可能有所不同，所以我个人倾向在 if 布尔表达式中，使用带有小括号的子布尔表达式来清晰地表达判断条件。

除了上面的最简形式，Go 语言的 if 语句还有其他多种形式，比如二分支结构和多（N）分支结构。

二分支控制结构比较好理解。比如下面这个例子，当 boolean_expression 求值为 true 时，执行分支 1，否则，执行分支 2：

```go
if boolean_expression {
  // 分支1
} else {
  // 分支2
}
```

多分支结构:

```go
if boolean_expression1 {
  // 分支1
} else if boolean_expression2 {
  // 分支2

... ...

} else if boolean_expressionN {
  // 分支N
} else {
  // 分支N+1
}
```


**支持声明 if 语句的自用变量**：无论是单分支、二分支还是多分支结构，我们都可以在 if 后的布尔表达式前，进行一些变量的声明，在 if 布尔表达式前声明的变量，我叫它 if 语句的自用变量。

```go
func main() {
    if a, c := f(), h(); a > 0 {
        println(a)
    } else if b := f(); b > 0 {
        println(a, b)
    } else {
        println(a, b, c)
    }
}
```

在 if 语句中声明自用变量是 Go 语言的一个惯用法，这种使用方式直观上可以让开发者有一种代码行数减少的感觉，提高可读性。

**if 语句的“快乐路径”原则**: 在日常编码中要减少多分支结构，甚至是二分支结构的使用，这会有助于我们编写出优雅、简洁、易读易维护且不易错的代码。


# for 语句

```go
var sum int
for i := 0; i < 10; i++ {
    sum += i
}
println(sum)
```

这种 for 语句的使用形式是 Go 语言中 for 循环语句的经典形式


![[Pasted image 20220402094118.png]]

从图中我们看到，经典 for 循环语句有四个组成部分（分别对应图中的①~④）。我们按顺序拆解一下这张图。

图中①对应的组成部分执行于循环体（③ ）之前，并且在整个 for 循环语句中仅会被执行一次，它也被称为循环前置语句。我们通常会在这个部分声明一些循环体（③ ）或循环控制条件（② ）会用到的自用变量，也称循环变量或迭代变量，比如这里声明的整型变量 i。与 if 语句中的自用变量一样，for 循环变量也采用短变量声明的形式，循环变量的作用域仅限于 for 语句隐式代码块范围内。

图中②对应的组成部分，是用来决定循环是否要继续进行下去的条件判断表达式。和 if 语句的一样，这个用于条件判断的表达式必须为布尔表达式，如果有多个判断条件，我们一样可以由逻辑操作符进行连接。当表达式的求值结果为 true 时，代码将进入循环体（③）继续执行，相反则循环直接结束，循环体（③）与组成部分④都不会被执行。

前面也多次提到了，图中③对应的组成部分是 for 循环语句的循环体。如果相关的判断条件表达式求值结构为 true 时，循环体就会被执行一次，这样的一次执行也被称为一次迭代（Iteration）。在上面例子中，循环体执行的动作是将这次迭代中变量 i 的值累加到变量 sum 中。

图中④对应的组成部分会在每次循环体迭代之后执行，也被称为循环后置语句。这个部分通常用于更新 for 循环语句组成部分①中声明的循环变量，比如在这个例子中，我们在这个组成部分对循环变量 i 进行加 1 操作。

Go 语言的 for 循环支持声明多循环变量，并且可以应用在循环体以及判断条件中，比如下面就是一个使用多循环变量的、稍复杂的例子：

```go
for i, j, k := 0, 1, 2; (i < 20) && (j < 10) && (k < 30); i, j, k = i+1, j+1, k+5 {
    sum += (i + j + k)
    println(sum)
}
```

我们继续按四个组成部分分析这段代码。其实，除了循环体部分（③）之外，其余的三个部分都是可选的。

```go
for i := 0; i < 10; {
    i++
}

i := 0
for ; i < 10; i++{
    println(i)
}  


i := 0
for ; i < 10; {
    println(i)
    i++
}
```

虽然我们对前置语句或后置语句进行了省略，但经典 for 循环形式中的分号依然被保留着，你要注意这一点，这是 Go 语法的要求。不过有一个例外，那就是当循环前置与后置语句都省略掉，仅保留循环判断条件表达式时，我们可以省略经典 for 循环形式中的分号。也就是说，我们可以将上面的例子写出如下形式：

```go
i := 0
for i < 10 {
    println(i)
    i++
}
```

这种形式也是我们在日常 Go 编码中经常使用的 for 循环语句的第二种形式，也就是除了循环体之外，我们仅保留循环判断条件表达式。特殊的，当 for 循环语句的循环判断条件表达式的求值结果始终为 true 时，我们就可以将它省略掉了：

```go
for { 
   // 循环体代码
}
```

**for range 循环**

先来看一个例子。如果我们要使用 for 经典形式遍历一个切片中的元素，我们可以这样做：

```go
var sl = []int{1, 2, 3, 4, 5}
for i := 0; i < len(sl); i++ {
    fmt.Printf("sl[%d] = %d\n", i, sl[i])
}
```

Go 语言提供了一个更方便的“语法糖”形式：for range。现在我们就来写一个等价于上面代码的 for range 循环：

```go
for i, v := range sl {
    fmt.Printf("sl[%d] = %d\n", i, v)
}
```

for range 语句也有几个常见变种

```go
//不关心值时
for i := range sl {
  // ... 
}

//只关心值

for _, v := range sl {
  // ... 
}

//都不关心
for _, _ = range sl {
  // ... 
}
//or
for _, _ = range sl {
  // ... 
}
```

针对不同数据类型，for range 分析

**string**

```go
var s = "中国人"
for i, v := range s {
    fmt.Printf("%d %s 0x%x\n", i, string(v), v)
}
// 输出
// 0 中 0x4e2d
// 3 国 0x56fd
// 6 人 0x4eba
```

for range 对于 string 类型来说，每次循环得到的 v 值是一个 Unicode 字符码点，也就是 rune 类型值，而不是一个字节，返回的第一个值 i 为该 Unicode 字符码点的内存编码（UTF-8）的第一个字节在字符串内存序列中的位置。

**map**

但在 Go 语言中，我们要对 map 进行循环操作，for range 是唯一的方法

```go
var m = map[string]int {
  "Rob" : 67,
    "Russ" : 39,
    "John" : 29,
}

for k, v := range m {
    println(k, v)
}

// John 29
// Rob 67
// Russ 39
```

每次循环，循环变量 k 和 v 分别会被赋值为 map 键值对集合中一个元素的 key 值和 value 值。而且，map 类型中没有下标的概念，通过 key 和 value 来循环操作 map 类型变量也就十分自然了。

**channel**

channel 是 Go 语言提供的并发设计的原语，它用于多个 Goroutine 之间的通信，在for range 中的用法是下面这样的:

```go
var c = make(chan int)
for v := range c {
   // ... 
}
```

在这个例子中，for range 每次从 channel 中读取一个元素后，会把它赋值给循环变量 v，并进入循环体。当 channel 中没有数据可读的时候，for range 循环会阻塞在对 channel 的读操作上。直到 channel 关闭时，for range 循环才会结束，这也是 for range 循环与 channel 配合时隐含的循环判断条件。

## 带 label 的 continue 语句

```go
var sum int
var sl = []int{1, 2, 3, 4, 5, 6}
for i := 0; i < len(sl); i++ {
    if sl[i]%2 == 0 {
        // 忽略切片中值为偶数的元素
        continue
    }
    sum += sl[i]
}
println(sum) // 9
```

与C语法上的continue并没有很大区别，但是Go 语言中的 continue 在 C 语言 continue 语义的基础上又增加了对 label 的支持。

label 语句的作用，是标记跳转的目标。我们可以把上面的代码改造为使用 label 的等价形式：

```go
func main() {
    var sum int
    var sl = []int{1, 2, 3, 4, 5, 6}

loop:
    for i := 0; i < len(sl); i++ {
        if sl[i]%2 == 0 {
            // 忽略切片中值为偶数的元素
            continue loop
        }
        sum += sl[i]
    }
    println(sum) // 9
}
```

而带 label 的 continue 语句，通常出现于嵌套循环语句中，被用于跳转到外层循环并继续执行外层循环语句的下一个迭代，比如下面这段代码：

```go
func main() {
    var sl = [][]int{
        {1, 34, 26, 35, 78},
        {3, 45, 13, 24, 99},
        {101, 13, 38, 7, 127},
        {54, 27, 40, 83, 81},
    }

outerloop:
    for i := 0; i < len(sl); i++ {
        for j := 0; j < len(sl[i]); j++ {
            if sl[i][j] == 13 {
                fmt.Printf("found 13 at [%d, %d]\n", i, j)
                continue outerloop
            }
        }
    }
}
```

**与goto的区别**：使用goto不管是内层循环还是外层循环都会被终结，代码将会从 outerloop 这个 label 处，开始重新执行我们的嵌套循环语句，这与带 label 的 continue 的跳转语义是完全不同的。

## break 语句的使用

```go
func main() {
    var sl = []int{5, 19, 6, 3, 8, 12}
    var firstEven int = -1

    // 找出整型切片sl中的第一个偶数
    for i := 0; i < len(sl); i++ {
        if sl[i]%2 == 0 {
            firstEven = sl[i]
            break
        }
    }

    println(firstEven) // 6
}
```

一旦找到就不需要继续执行后续迭代了，这个时候我们就通过 break 语句跳出了这个循环。

和 continue 语句一样，Go 也 break 语句增加了对 label 的支持。而且，和前面 continue 语句一样，如果遇到嵌套循环，break 要想跳出外层循环，用不带 label 的 break 是不够，因为不带 label 的 break 仅能跳出其所在的最内层循环。要想实现外层循环的跳出，我们还需给 break 加上 label。我们来看一个具体的例子：

```go
var gold = 38

func main() {
    var sl = [][]int{
        {1, 34, 26, 35, 78},
        {3, 45, 13, 24, 99},
        {101, 13, 38, 7, 127},
        {54, 27, 40, 83, 81},
    }

outerloop:
    for i := 0; i < len(sl); i++ {
        for j := 0; j < len(sl[i]); j++ {
            if sl[i][j] == gold {
                fmt.Printf("found gold at [%d, %d]\n", i, j)
                break outerloop
            }
        }
    }
}
```

我们通过带有 label 的 break 语句，就可以直接终结外层循环，从而从复杂多层次的嵌套循环中直接跳出，避免不必要的算力资源的浪费。

## for 语句的常见“坑”
**问题一：循环变量的重用**
**问题二：参与循环的是 range 表达式的副本** 
```go
for i, v := range a' { //a'是a的一个值拷贝
    if i == 0 {
        a[1] = 12
        a[2] = 13
    }
    r[i] = v
}
```

r中记录的还是原来的a，而不是修改后的

解决方案：使用切片

```go
for i, v := range a[:] {
    if i == 0 {
        a[1] = 12
        a[2] = 13
    }
    r[i] = v
}
```

当进行 range 表达式复制时，我们实际上复制的是一个切片，也就是表示切片的结构体。表示切片副本的结构体中的 array，依旧指向原切片对应的底层数组，所以我们对切片副本的修改也都会反映到底层数组 a 上去。而 v 再从切片副本结构体中 array 指向的底层数组中，获取数组元素，也就得到了被修改后的元素值。

**遍历 map 中元素的随机性**

如果我们在循环的过程中，对 map 进行了修改，那么这样修改的结果是否会影响后续迭代呢？这个结果和我们遍历 map 一样，具有随机性。

```go
var m = map[string]int{
    "tony": 21,
    "tom":  22,
    "jim":  23,
}

counter := 0
for k, v := range m {
    if counter == 0 {
        delete(m, "tony")
    }
    counter++
    fmt.Println(k, v)
}
fmt.Println("counter is ", counter)
```

如果我们反复运行这个例子多次，会得到两个不同的结果。当 k="tony"作为第一个迭代的元素时，我们将得到如下结果：

```go
tony 21
tom 22
jim 23
counter is  3

//or

tom 22
jim 23
counter is  2
```

考虑到上述这种随机性，我们日常编码遇到遍历 map 的同时，还需要对 map 进行修改的场景的时候，要格外小心。

# switch 语句

```go
switch initStmt; expr {
    case expr1:
        // 执行分支1
    case expr2:
        // 执行分支2
    case expr3_1, expr3_2, expr3_3:
        // 执行分支3
    case expr4:
        // 执行分支4
    ... ...
    case exprN:
        // 执行分支N
    default: 
        // 执行默认分支
}
```

在有多个 case 执行分支的 switch 语句中，Go 是按什么次序对各个 case 表达式进行求值，并且与 switch 表达式（expr）进行比较的？

顺序执行，一旦匹配到对应case下面，后面的expr语句变不会执行；

还有一点，无论 default 分支出现在什么位置，它都只会在所有 case 都没有匹配上的情况下才会被执行的。

## switch 语句的灵活性

**switch 语句各表达式的求值结果可以为各种类型值，只要它的类型支持比较操作就可以了**

**switch 语句支持声明临时变量**

**case 语句支持表达式列表**

**取消了默认执行下一个 case 代码逻辑的语义**

如果在少数场景下，你需要执行下一个 case 的代码逻辑，你可以显式使用 Go 提供的关键字 fallthrough 来实现，这也是 Go“显式”设计哲学的一个体现。

```go
func main() {
    switch switchexpr() {
    case case1():
        println("exec case1")
        fallthrough
    case case2():
        println("exec case2")
        fallthrough
    default:
        println("exec default")
    }
}
```

## type switch

```go
func main() {
    var x interface{} = 13
    switch x.(type) {
    case nil:
        println("x is nil")
    case int:
        println("the type of x is int")
    case string:
        println("the type of x is string")
    case bool:
        println("the type of x is string")
    default:
        println("don't support the type")
    }
}
```

switch 关键字后面跟着的表达式为x.(type)，这种表达式形式是 switch 语句专有的，而且也只能在 switch 语句中使用。这个表达式中的 x 必须是一个接口类型变量，表达式的求值结果是这个接口类型变量对应的动态类型。

```go
func main() {
    var x interface{} = 13
    switch v := x.(type) {
    case nil:
        println("v is nil")
    case int:
        println("the type of v is int, v =", v)
    case string:
        println("the type of v is string, v =", v)
    case bool:
        println("the type of v is bool, v =", v)
    default:
        println("don't support the type")
    }
}
```

这里我们将 switch 后面的表达式由x.(type)换成了v := x.(type)。对于后者，你千万不要认为变量 v 存储的是类型信息，其实 v 存储的是变量 x 的动态类型对应的值信息，这样我们在接下来的 case 执行路径中就可以使用变量 v 中的值信息了。

## 跳不出循环的 break

Go 语言规范中明确规定，不带 label 的 break 语句中断执行并跳出的，是同一函数内 break 语句所在的最内层的 for、switch 或 select。所以switch中的break只是跳出了switch而非外层的for循环。
