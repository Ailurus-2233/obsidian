# 自定义一个新类型

**类型定义（Type Definition）**

这也是我们最常用的类型定义方法。在这种方法中，我们会使用关键字type 来定义一个新类型 T，具体形式是这样的：

```go
type T S // 定义一个新类型T
```

在这里，S 可以是任何一个已定义的类型，包括 Go 原生类型，或者是其他已定义的自定义类型，我们来演示一下这两种情况：
```go
type T1 int 
type T2 T1  
```

这段代码中，新类型 T1 是基于 Go 原生类型 int 定义的新自定义类型，而新类型 T2 则是基于刚刚定义的类型 T1，定义的新类型。

这里我们引入一个新概念，底层类型。如果一个新类型是基于某个 Go 原生类型定义的，那么我们就叫 Go 原生类型为新类型的底层类型（Underlying Type)。比如这个例子中，类型 int 就是类型 T1 的底层类型。底层类型在 Go 语言中有重要作用，它被用来判断两个类型本质上是否相同（Identical）。

本质上相同的两个类型，它们的变量可以通过显式转型进行相互赋值，相反，如果本质上是不同的两个类型，它们的变量间连显式转型都不可能，更不要说相互赋值了。

```go
type T1 int
type T2 T1
type T3 string

func main() {
    var n1 T1
    var n2 T2 = 5
    n1 = T1(n2)  // ok
    
    var s T3 = "hello"
    n1 = T1(s) // 错误：cannot convert s (type T3) to type T1
}
```

除了基于已有类型定义新类型之外，我们还可以基于类型字面值来定义新类型，这种方式多用于自定义一个新的复合类型，比如：

```go
type M map[int]string
type S []string
```

和变量声明支持使用 var 块的方式类似，类型定义也支持通过 type 块的方式进行，比如我们可以把上面代码中的 T1、T2 和 T3 的定义放在同一个 type 块中：

```go
type (
   T1 int
   T2 T1
   T3 string
)
```

**类型别名（Type Alias）**

```go
type T = S // type alias
```

我们看到，与前面的第一种类型定义相比，类型别名的形式只是多了一个等号，但正是这个等号让新类型 T 与原类型 S 完全等价。完全等价的意思就是，类型别名并没有定义出新类型，T 与 S 实际上就是同一种类型，它们只是一种类型的两个名字罢了

# 结构体

```go
type T struct {
    Field1 T1
    Field2 T2
    ... ...
    FieldN Tn
}
```

根据这个定义，我们会得到一个名为 T 的结构体类型，定义中 struct 关键字后面的大括号包裹的内容就是一个类型字面值。我们看到这个类型字面值由若干个字段（field）聚合而成，每个字段有自己的名字与类型，并且在一个结构体中，每个字段的名字应该都是唯一的。

我们前面提到过对现实世界的书进行抽象的情况，其实用结构体类型就可以实现，比如这里，我就用前面的典型方法定义了一个结构体：

```go
package book

type Book struct {
     Title string              // 书名
     Pages int                 // 书的页数
     Indexes map[string]int    // 书的索引
}
```

这样，只要其他包导入了包 book，我们就可以在这些包中直接引用类型名 Book，也可以通过 Book 类型变量引用 `Name`、`Pages` 等字段，就像下面代码中这样：

```go
import ".../book"

var b book.Book
b.Title = "The Go Programming Language"
b.Pages = 800
```

如果结构体类型只在它定义的包内使用，那么我们可以将类型名的首字母小写；如果你不想将结构体类型中的某个字段暴露给其他包，那么我们同样可以把这个字段名字的首字母小写。

除了通过类型字面值来定义结构体这种典型操作外，我们还有另外几种特殊的情况。

**定义一个空结构体**

我们可以定义一个空结构体，也就是没有包含任何字段的结构体类型，就像下面示例代码这样：

```go
type Empty struct{} // Empty是一个不包含任何字段的空结构体类型
```

空结构体类型有什么用呢？我们继续看下面代码：

```go
var s Empty
println(unsafe.Sizeof(s)) // 0
```

我们看到，输出的空结构体类型变量的大小为 0，也就是说，空结构体类型变量的内存占用为 0。基于空结构体类型内存零开销这样的特性，我们在日常 Go 开发中会经常使用空结构体类型元素，作为一种“事件”信息进行 Goroutine 之间的通信，就像下面示例代码这样：

```go
var c = make(chan Empty) // 声明一个元素类型为Empty的channel
c<-Empty{}               // 向channel写入一个“事件”
```

这种以空结构体为元素类建立的 channel，是目前能实现的、内存占用最小的 Goroutine 间通信方式。

**使用其他结构体作为自定义结构体中字段的类型。**

我们看这段代码，这里结构体类型 Book 的字段 Author 的类型，就是另外一个结构体类型 Person：

```go
type Person struct {
    Name string
    Phone string
    Addr string
}

type Book struct {
    Title string
    Author Person
    ... ...
}
```

如果我们要访问 Book 结构体字段 Author 中的 Phone 字段，我们可以这样操作：

```go
var book Book 
println(book.Author.Phone)
```

不过，对于包含结构体类型字段的结构体类型来说，Go 还提供了一种更为简便的定义方法，那就是我们可以无需提供字段的名字，只需要使用其类型就可以了，以上面的 Book 结构体定义为例，我们可以用下面的方式提供一个等价的定义：

```go
type Book struct {
    Title string
    Person
    ... ...
}
```

以这种方式定义的结构体字段，我们叫做嵌入字段（Embedded Field）。我们也可以将这种字段称为匿名字段，或者把类型名看作是这个字段的名字。如果我们要访问 Person 中的 Phone 字段，我们可以通过下面两种方式进行：

```go
var book Book 
println(book.Person.Phone) // 将类型名当作嵌入字段的名字
println(book.Phone)        // 支持直接访问嵌入字段所属类型中字段
```

第一种方式显然是通过把类型名当作嵌入字段的名字来进行操作的，而第二种方式更像是一种“语法糖”，我们可以“绕过”Person 类型这一层，直接访问 Person 中的字段。

```ad-note
Go 语言不支持这种在结构体类型定义中，递归地放入其自身类型字段的定义方式。面对上面的示例代码，编译器就会给出“invalid recursive type T”的错误信息。
```

同样，下面这两个结构体类型 T1 与 T2 的定义也存在递归的情况，所以这也是不合法的。

```go
type T1 struct {
  t2 T2
}

type T2 struct {
  t1 T1
}
```

虽然我们不能在结构体类型 T 定义中，拥有以自身类型 T 定义的字段，但我们却可以拥有自身类型的指针类型、以自身类型为元素类型的切片类型，以及以自身类型作为 value 类型的 map 类型的字段，比如这样：

```go
type T struct {
    t  *T           // ok
    st []T          // ok
    m  map[string]T // ok
}     
```

一个类型，它所占用的大小是固定的，因此一个结构体定义好的时候，其大小是固定的。 但是，如果结构体里面套结构体，那么在计算该结构体占用大小的时候，就会成死循环。但如果是指针、切片、map等类型，其本质都是一个int大小(指针，4字节或者8字节，与操作系统有关)，因此该结构体的大小是固定的，记得老师前几节课讲类型的时候说过，类型就能决定内存占用的大小。 因此，结构体是可以接口自身类型的指针类型、以自身类型为元素类型的切片类型，以及以自身类型作为 value 类型的 map 类型的字段，而自己本身不行。


## 结构体变量的声明与初始化

和其他所有变量的声明一样，我们也可以使用标准变量声明语句，或者是短变量声明语句声明一个结构体类型的变量：

```go
type Book struct {
    ...
}

var book Book
var book = Book{}
book := Book{}
```

不过，这里要注意，我们在前面说过，结构体类型通常是对真实世界复杂事物的抽象，这和简单的数值、字符串、数组 / 切片等类型有所不同，结构体类型的变量通常都要被赋予适当的初始值后，才会有合理的意义。

**零值初始化**

零值初始化说的是使用结构体的零值作为它的初始值。对于 Go 原生类型来说，这个默认值也称为零值。Go 结构体类型由若干个字段组成，当这个结构体类型变量的各个字段的值都是零值时，我们就说这个结构体类型变量处于零值状态。

前面提到过，结构体类型的零值变量，通常不具有或者很难具有合理的意义，比如通过下面代码得到的零值 book 变量就是这样：

```go
var book Book // book为零值结构体变量
```

如果一种类型采用零值初始化得到的零值变量，是有意义的，而且是直接可用的，称这种类型为“零值可用”类型。可以说，定义零值可用类型是简化代码、改善开发者使用体验的一种重要的手段。

**使用复合字面值**

最简单的对结构体变量进行显式初始化的方式，就是按顺序依次给每个结构体字段进行赋值，比如下面的代码：

```go
type Book struct {
    Title string              // 书名
    Pages int                 // 书的页数
    Indexes map[string]int    // 书的索引
}

var book = Book{"The Go Programming Language", 700, make(map[string]int)}
```

我们依然可以用这种方法给结构体的每一个字段依次赋值，但这种方法也有很多问题：
* 首先，当结构体类型定义中的字段顺序发生变化，或者字段出现增删操作时，我们就需要手动调整该结构体类型变量的显式初始化代码，让赋值顺序与调整后的字段顺序一致。
* 其次，当一个结构体的字段较多时，这种逐一字段赋值的方式实施起来就会比较困难，而且容易出错，开发人员需要来回对照结构体类型中字段的类型与顺序，谨慎编写字面值表达式。
* 最后，一旦结构体中包含非导出字段，那么这种逐一字段赋值的方式就不再被支持了，编译器会报错：

```go
type T struct {
    F1 int
    F2 string
    f3 int
    F4 int
    F5 int
}

var t = T{11, "hello", 13} // 错误：implicit assignment of unexported field 'f3' in T literal
或
var t = T{11, "hello", 13, 14, 15} // 错误：implicit assignment of unexported field 'f3' in T literal
```

Go 语言并不推荐我们按字段顺序对一个结构体类型变量进行显式初始化，甚至 Go 官方还在提供的 go vet 工具中专门内置了一条检查规则：“composites”，用来静态检查代码中结构体变量初始化是否使用了这种方法，一旦发现，就会给出警告。

Go 推荐我们用“field:value”形式的复合字面值，对结构体类型变量进行显式初始化，这种方式可以降低结构体类型使用者和结构体类型设计者之间的耦合，这也是 Go 语言的惯用法。这里，我们用“field:value”形式复合字面值，对上面的类型 T 的变量进行初始化看看：

```go
var t = T{
    F2: "hello",
    F1: 11,
    F4: 14,
}
```

使用这种“field:value”形式的复合字面值对结构体类型变量进行初始化，非常灵活。和之前的顺序复合字面值形式相比，“field:value”形式字面值中的字段可以以任意次序出现。未显式出现在字面值中的结构体字段（比如上面例子中的 F5）将采用它对应类型的零值。

复合字面值作为结构体类型变量初值被广泛使用，即便结构体采用类型零值时，我们也会使用复合字面值的形式，较少使用 new 这一个 Go 预定义的函数来创建结构体变量实例。

```go
t := T{}
tp := new(T)
```

```ad-note
这里值得我们注意的是，我们不能用从其他包导入的结构体中的未导出字段，来作为复合字面值中的 field。这会导致编译错误，因为未导出字段是不可见的。
```

**构造函数**

使用特定的构造函数创建并初始化结构体变量的例子，并不罕见。在 Go 标准库中就有很多，其中 time.Timer 这个结构体就是一个典型的例子，它的定义如下：

```go
// $GOROOT/src/time/sleep.go
type runtimeTimer struct {
    pp       uintptr
    when     int64
    period   int64
    f        func(interface{}, uintptr) 
    arg      interface{}
    seq      uintptr
    nextwhen int64
    status   uint32
}

type Timer struct {
    C <-chan Time
    r runtimeTimer
}
```

Timer 结构体中包含了一个非导出字段 r，r 的类型为另外一个结构体类型 runtimeTimer。这个结构体更为复杂，而且我们一眼就可以看出来，这个 runtimeTimer 结构体不是零值可用的，那我们在创建一个 Timer 类型变量时就没法使用显式复合字面值的方式了。这个时候，Go 标准库提供了一个 Timer 结构体专用的构造函数 NewTimer，它的实现如下：

```go

// $GOROOT/src/time/sleep.go
func NewTimer(d Duration) *Timer {
    c := make(chan Time, 1)
    t := &Timer{
        C: c,
        r: runtimeTimer{
            when: when(d),
            f:    sendTime,
            arg:  c,
        },
    }
    startTimer(&t.r)
    return t
}
```

我们看到，NewTimer 这个函数只接受一个表示定时时间的参数 d，在经过一个复杂的初始化过程后，它返回了一个处于可用状态的 Timer 类型指针实例。像这类通过专用构造函数进行结构体类型变量创建、初始化的例子还有很多，我们可以总结一下，它们的专用构造函数大多都符合这种模式：

```go
func NewT(field1, field2, ...) *T {
    ... ...
}
```

这里，NewT 是结构体类型 T 的专用构造函数，它的参数列表中的参数通常与 T 定义中的导出字段相对应，返回值则是一个 T 指针类型的变量。T 的非导出字段在 NewT 内部进行初始化，一些需要复杂初始化逻辑的字段也会在 NewT 内部完成初始化。这样，我们只要调用 NewT 函数就可以得到一个可用的 T 指针类型变量了。
