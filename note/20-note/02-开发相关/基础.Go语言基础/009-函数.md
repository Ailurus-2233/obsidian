# Go 函数与函数声明

函数对应的英文单词是 Function，Function 这个单词原本是功能、职责的意思。编程语言使用 Function 这个单词，表示将一个大问题分解后而形成的、若干具有特定功能或职责的小任务，可以说十分贴切。函数代表的小任务可以在一个程序中被多次使用，甚至可以在不同程序中被使用，因此函数的出现也提升了整个程序界代码复用的水平。

```go
func FuncName(var type, ...) (var type, err error){
	//函数体
}
```

**第一部分是关键字 func**，Go 函数声明必须以关键字 func 开始。

**第二部分是函数名**，函数名是指代函数定义的标识符，函数声明后，我们会通过函数名这个标识符来使用这个函数。在同一个 Go 包中，函数名应该是唯一的，并且它也遵守 Go 标识符的导出规则，也就是我们之前说的，首字母大写的函数名指代的函数是可以在包外使用的，小写的就只在包内可见。

**第三部分是参数列表**，参数列表中声明了我们将要在函数体中使用的各个参数。参数列表紧接在函数名的后面，并用一个括号包裹。它使用逗号作为参数间的分隔符，而且每个参数的参数名在前，参数类型在后，这和变量声明中变量名与类型的排列方式是一致的。

**第四部分是返回值列表**，返回值承载了函数执行后要返回给调用者的结果，返回值列表声明了这些返回值的类型，返回值列表的位置紧接在参数列表后面，两者之间用一个空格隔开。

**放在一对大括号内的是函数体** 函数的具体实现都放在这里。不过，函数声明中的函数体是可选的。如果没有函数体，说明这个函数可能是在 Go 语言之外实现的，比如使用汇编语言实现，然后通过链接器将实现与声明中的函数名链接到一起。

等价的变量声明
```go
var FuncName = func(var type, ...) (var type, err error) {}
```

函数声明中的函数名其实就是变量名，函数声明中的 func 关键字、参数列表和返回值列表共同构成了函数类型。而参数列表与返回值列表的组合也被称为函数签名，它是决定两个函数类型是否相同的决定因素。因此，函数类型也可以看成是由 func 关键字与函数签名组合而成的。

函数签名
```go
func(type, ...) (type, error)
```

这样，如果两个函数类型的函数签名是相同的，即便参数列表中的参数名，以及返回值列表中的返回值变量名都是不同的，那么这两个函数类型也是相同类型，比如下面两个函数类型：

```go
func (a int, b string) (results []string, err error)
func (c int, d string) (sl []string, err error)
```

如果我们把这两个函数类型的参数名与返回值变量名省略，那它们都是func (int, string) ([]string, error)，因此它们是相同的函数类型。

到这里，我们可以得到这样一个结论：每个函数声明所定义的函数，仅仅是对应的函数类型的一个实例，就像var a int = 13这个变量声明语句中 a 是 int 类型的一个实例一样。

**函数字面值（Function Literal）** 函数字面值由函数类型与函数体组成，它特别像一个没有函数名的函数声明，因此我们也叫它匿名函数。

# 函数参数

在函数声明阶段，我们把参数列表中的参数叫做形式参数（Parameter，简称形参），在函数体中，我们使用的都是形参；而在函数实际调用时传入的参数被称为实际参数（Argument，简称实参）。当我们实际调用函数的时候，实参会传递给函数，并和形式参数逐一绑定，编译器会根据各个形参的类型与数量，来检查传入的实参的类型与数量是否匹配。只有匹配，程序才能继续执行函数调用，否则编译器就会报错。

Go 语言中，函数参数传递采用是值传递的方式。所谓“值传递”，就是将实际参数在内存中的表示逐位拷贝（Bitwise Copy）到形式参数中。对于像整型、数组、结构体这类类型，它们的内存表示就是它们自身的数据内容，因此当这些类型作为实参类型时，值传递拷贝的就是它们自身，传递的开销也与它们自身的大小成正比。

但是像 string、切片、map 这些类型就不是了，它们的内存表示对应的是它们数据内容的“描述符”。当这些类型作为实参类型时，值传递拷贝的也是它们数据内容的“描述符”，不包括数据内容本身，所以这些类型传递的开销是固定的，与数据内容大小无关。这种只拷贝“描述符”，不拷贝实际数据内容的拷贝过程，也被称为“浅拷贝”。

不过函数参数的传递也有两个例外，当函数的形参为接口类型，或者形参是变长参数时，简单的值传递就不能满足要求了，这时 Go 编译器会介入：对于类型为接口类型的形参，Go 编译器会把传递的实参赋值给对应的接口类型形参；对于为变长参数的形参，Go 编译器会将零个或多个实参按一定形式转换为对应的变长形参。

```go
func myAppend(sl []int, elems ...int) []int {
    fmt.Printf("%T\n", elems) // []int
    if len(elems) == 0 {
        println("no elems to append")
        return sl
    }

    sl = append(sl, elems...)
    return sl
}

func main() {
    sl := []int{1, 2, 3}
    sl = myAppend(sl) // no elems to append
    fmt.Println(sl) // [1 2 3]
    sl = myAppend(sl, 4, 5, 6)
    fmt.Println(sl) // [1 2 3 4 5 6]
}
```

我们重点看一下代码中的 myAppend 函数，这个函数基于 append，实现了向一个整型切片追加数据的功能。它支持变长参数，它的第二个形参 elems 就是一个变长参数。myAppend 函数通过 Printf 输出了变长参数的类型。执行这段代码，我们将看到变长参数 elems 的类型为[]int。这也就说明，在 Go 中，变长参数实际上是通过切片来实现的。所以，我们在函数体中，就可以使用切片支持的所有操作来操作变长参数，这会大大简化了变长参数的使用复杂度。比如 myAppend 中，我们使用 len 函数就可以获取到传给变长参数的实参个数。

# 函数支持多返回值

```go
func foo()                       // 无返回值
func foo() error                 // 仅有一个返回值
func foo() (int, string, error)  // 有2或2个以上返回值
```

如果一个函数没有显式返回值，那么我们可以像第一种情况那样，在函数声明中省略返回值列表。而且，如果一个函数仅有一个返回值，那么通常我们在函数声明中，就不需要将返回值用括号括起来，如果是 2 个或 2 个以上的返回值，那我们还是需要用括号括起来的

在函数声明的返回值列表中，我们通常会像上面例子那样，仅列举返回值的类型，但我们也可以像 fmt.Fprintf 函数的返回值列表那样，为每个返回值声明变量名，这种带有名字的返回值被称为具名返回值（Named Return Value）。这种具名返回值变量可以像函数体中声明的局部变量一样在函数体内使用。

当函数的返回值个数较多时，每次显式使用 return 语句时都会接一长串返回值，这时，我们用具名返回值可以让函数实现的可读性更好一些，比如下面 Go 标准库 time 包中的 parseNanoseconds 函数就是这样：

```go
// $GOROOT/src/time/format.go
func parseNanoseconds(value string, nbytes int) (ns int, rangeErrString string, err error) {
    if !commaOrPeriod(value[0]) {
        err = errBad
        return
    }
    if ns, err = atoi(value[1:nbytes]); err != nil {
        return
    }
    if ns < 0 || 1e9 <= ns {
        rangeErrString = "fractional second"
        return
    }

    scaleDigits := 10 - nbytes
    for i := 0; i < scaleDigits; i++ {
        ns *= 10
    }
    return
}
```

# 函数是“一等公民”

函数在 Go 语言中属于“一等公民（First-Class Citizen）”

```
如果一门编程语言对某种语言元素的创建和使用没有限制，我们可以像对待值（value）一样对待这种语法元素，那么我们就称这种语法元素是这门编程语言的“一等公民”。拥有“一等公民”待遇的语法元素可以存储在变量中，可以作为参数传递给函数，可以在函数内部创建并可以作为返回值从函数返回。
```

**特征一：Go 函数可以存储在变量中**

```go
var (
    myFprintf = func(w io.Writer, format string, a ...interface{}) (int, error) {
        return fmt.Fprintf(w, format, a...)
    }
)

func main() {
    fmt.Printf("%T\n", myFprintf) // func(io.Writer, string, ...interface {}) (int, error)
    myFprintf(os.Stdout, "%s\n", "Hello, Go") // 输出Hello，Go
}
```

在这个例子中，我们把新创建的一个匿名函数赋值给了一个名为 myFprintf 的变量，通过这个变量，我们便可以调用刚刚定义的匿名函数。然后我们再通过 Printf 输出 myFprintf 变量的类型，也会发现结果与我们预期的函数类型是相符的。

**特征二：支持在函数内创建并通过返回值返回**

```go
func setup(task string) func() {
    println("do some setup stuff for", task)
    return func() {
        println("do some teardown stuff for", task)
    }
}

func main() {
    teardown := setup("demo")
    defer teardown()
    println("do some bussiness stuff")
}
```

这个例子，模拟了执行一些重要逻辑之前的上下文建立（setup），以及之后的上下文拆除（teardown）。在一些单元测试的代码中，我们也经常会在执行某些用例之前，建立此次执行的上下文（setup），并在这些用例执行后拆除上下文（teardown），避免这次执行对后续用例执行的干扰。我们在 setup 函数中创建了这次执行的上下文拆除函数，并通过返回值的形式，将这个拆除函数返回给了 setup 函数的调用者。setup 函数的调用者，在执行完对应这次执行上下文的重要逻辑后，再调用 setup 函数返回的拆除函数，就可以完成对上下文的拆除了。

从这段代码中我们也可以看到，setup 函数中创建的拆除函数也是一个匿名函数，但和前面我们看到的匿名函数有一个不同，这个不同就在于这个匿名函数使用了定义它的函数 setup 的局部变量 task，这样的匿名函数在 Go 中也被称为闭包（Closure）。

**特征三：作为参数传入函数**

既然函数可以存储在变量中，也可以作为返回值返回，那我们可以理所当然地想到，把函数作为参数传入函数也是可行的。比如我们在日常编码时经常使用、标准库 time 包的 AfterFunc 函数，就是一个接受函数类型参数的典型例子。你可以看看下面这行代码，这里通过 AfterFunc 函数设置了一个 2 秒的定时器，并传入了时间到了后要执行的函数。这里传入的就是一个匿名函数：

```go
time.AfterFunc(time.Second*2, func() { println("timer fired") })
```

**特征四：拥有自己的类型**

每个函数都和整型值、字符串值等一等公民一样，拥有自己的类型，也就是我们讲过的函数类型。我们甚至可以基于函数类型来自定义类型，就像基于整型、字符串类型等类型来自定义类型一样。下面代码中的 HandlerFunc、visitFunc 就是 Go 标准库中，基于函数类型进行自定义的类型：

```go
// $GOROOT/src/net/http/server.go
type HandlerFunc func(ResponseWriter, *Request)

// $GOROOT/src/sort/genzfunc.go
type visitFunc func(ast.Node) ast.Visitor
```

# 函数“一等公民”特性的高效运用

**应用一：函数类型的妙用**

Go 函数是“一等公民”，也就是说，它拥有自己的类型。而且，整型、字符串型等所有类型都可以进行的操作，比如显式转型，也同样可以用在函数类型上面，也就是说，函数也可以被显式转型。并且，这样的转型在特定的领域具有奇妙的作用，一个最为典型的示例就是标准库 http 包中的 HandlerFunc 这个类型。我们来看一个使用了这个类型的例子：

```go
func greeting(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Welcome, Gopher!\n")
}                    

func main() {
    http.ListenAndServe(":8080", http.HandlerFunc(greeting))
}
```

可以进行这让转换的前提是，两个函数的函数签名是一致的，这类似与底层类型一直的类之间的相互转换

**应用二：利用闭包简化函数调用**

```go
func times(x, y int) int {
	return x * y
}


times(2, 5) // 计算2 x 5
times(3, 5) // 计算3 x 5
times(4, 5) // 计算4 x 5
```

这是一个简单乘法运算，不过，有些场景存在一些高频使用的乘数，这个时候我们就没必要每次都传入这样的高频乘数了。那我们怎样能省去高频乘数的传入呢? 我们看看下面这个新函数 partialTimes：

```go
func partialTimes(x int) func(int) int {
	return func(y int) int {
		return times(x, y)
	}
}
```

这里，partialTimes 的返回值是一个接受单一参数的函数，这个由 partialTimes 函数生成的匿名函数，使用了 partialTimes 函数的参数 x。按照前面的定义，这个匿名函数就是一个闭包。partialTimes 实质上就是用来生成以 x 为固定乘数的、接受另外一个乘数作为参数的、闭包函数的函数。当程序调用 partialTimes(2) 时，partialTimes 实际上返回了一个调用 times(2,y) 的函数，这个过程的逻辑类似于下面代码：

```go
timesTwo = func(y int) int {
    return times(2, y)
}
```

这个时候，我们再看看如何使用 partialTimes，分别生成以 2、3、4 为固定高频乘数的乘法函数，以及这些生成的乘法函数的使用方法：

```go
func main() {
  timesTwo := partialTimes(2)   // 以高频乘数2为固定乘数的乘法函数
  timesThree := partialTimes(3) // 以高频乘数3为固定乘数的乘法函数
  timesFour := partialTimes(4)  // 以高频乘数4为固定乘数的乘法函数
  fmt.Println(timesTwo(5))   // 10，等价于times(2, 5)
  fmt.Println(timesTwo(6))   // 12，等价于times(2, 6)
  fmt.Println(timesThree(5)) // 15，等价于times(3, 5)
  fmt.Println(timesThree(6)) // 18，等价于times(3, 6)
  fmt.Println(timesFour(5))  // 20，等价于times(4, 5)
  fmt.Println(timesFour(6))  // 24，等价于times(4, 6)
}
```

# 错误处理

Go 函数增加了多返回值机制，来支持错误状态与返回信息的分离，并建议开发者把要返回给调用者的信息和错误状态标识，分别放在不同的返回值中。

Go 标准库中有一个fmt.Fprintf的函数，这个函数就是使用一个独立的表示错误状态的返回值（如下面代码中的 err），解决了 fprintf 函数中错误状态值与返回信息耦合在一起的问题：

```go
// fmt包
func Fprintf(w io.Writer, format string, a ...interface{}) (n int, err error)
```

在 Go 语言中，我们依然可以像传统的 C 语言那样，用一个整型值来表示错误状态，但 Go 语言惯用法，是使用 error 这个接口类型表示错误，并且按惯例，我们通常将 error 类型返回值放在返回值列表的末尾，就像 fmt.Fprintf 函数声明中那样。

## error 类型与错误值构造

error 接口是 Go 原生内置的类型，它的定义如下：

```go
// $GOROOT/src/builtin/builtin.go
type interface error {
    Error() string
}
```

任何实现了 error 的 Error 方法的类型的实例，都可以作为错误值赋值给 error 接口变量。那这里。error接口的错误值构造：

```go
err := errors.New("your first demo error")
errWithCtx = fmt.Errorf("index %d is out of bounds", i)
```

这两种方法实际上返回的是同一个实现了 error 接口的类型的实例，这个未导出的类型就是errors.errorString，它的定义是这样的：

```go
// $GOROOT/src/errors/errors.go

type errorString struct {
    s string
}

func (e *errorString) Error() string {
    return e.s
}
```

大多数情况下，使用这两种方法构建的错误值就可以满足我们的需求了。但我们也要看到，虽然这两种构建错误值的方法很方便，但它们给错误处理者提供的错误上下文（Error Context）只限于以字符串形式呈现的信息，也就是 Error 方法返回的信息。

但在一些场景下，错误处理者需要从错误值中提取出更多信息，帮助他选择错误处理路径，显然这两种方法就不能满足了。这个时候，我们可以自定义错误类型来满足这一需求。比如：标准库中的 net 包就定义了一种携带额外错误上下文的错误类型：

```go
// $GOROOT/src/net/net.go
type OpError struct {
    Op string
    Net string
    Source Addr
    Addr Addr
    Err error
}
```

这样，错误处理者就可以根据这个类型的错误值提供的额外上下文信息，比如 Op、Net、Source 等，做出错误处理路径的选择，比如下面标准库中的代码：

```go
// $GOROOT/src/net/http/server.go
func isCommonNetReadError(err error) bool {
    if err == io.EOF {
        return true
    }
    if neterr, ok := err.(net.Error); ok && neterr.Timeout() {
        return true
    }
    if oe, ok := err.(*net.OpError); ok && oe.Op == "read" {
        return true
    }
    return false
}
```

## error 类型的好处

**第一点：统一了错误类型**

如果不同开发者的代码、不同项目中的代码，甚至标准库中的代码，都统一以 error 接口变量的形式呈现错误类型，就能在提升代码可读性的同时，还更容易形成统一的错误处理策略。

**第二点：错误是值**

我们构造的错误都是值，也就是说，即便赋值给 error 这个接口类型变量，我们也可以像整型值那样对错误做“==”和“!=”的逻辑比较，函数调用者检视错误时的体验保持不变。

**第三点：易扩展，支持自定义错误上下文。**

虽然错误以 error 接口变量的形式统一呈现，但我们很容易通过自定义错误类型来扩展我们的错误上下文，就像前面的 Go 标准库的 OpError 类型那样。error 接口是错误值的提供者与错误值的检视者之间的契约。error 接口的实现者负责提供错误上下文，供负责错误处理的代码使用。这种错误具体上下文与作为错误值类型的 error 接口类型的解耦，也体现了 Go 组合设计哲学中“正交”的理念。


## error 设计策略

**策略一：透明错误处理策略**

简单来说，Go 语言中的错误处理，就是根据函数 / 方法返回的 error 类型变量中携带的错误值信息做决策，并选择后续代码执行路径的过程。这样，最简单的错误策略莫过于完全不关心返回错误值携带的具体上下文信息，只要发生错误就进入唯一的错误处理执行路径，比如下面这段代码：

```go
err := doSomething()
if err != nil {
    // 不关心err变量底层错误值所携带的具体上下文信息
    // 执行简单错误处理逻辑并返回
    ... ...
    return err
}
```

这也是 Go 语言中最常见的错误处理策略，80% 以上的 Go 错误处理情形都可以归类到这种策略下。在这种策略下，由于错误处理方并不关心错误值的上下文，所以错误值的构造方（如上面的函数doSomething）可以直接使用 Go 标准库提供的两个基本错误值构造方法errors.New和fmt.Errorf来构造错误值，就像下面这样：

```go
func doSomething(...) error {
    ... ...
    return errors.New("some error occurred")
}
```

这样构造出的错误值代表的上下文信息，对错误处理方是透明的，因此这种策略称为“透明错误处理策略”。在错误处理方不关心错误值上下文的前提下，透明错误处理策略能最大程度地减少错误处理方与错误值构造方之间的耦合关系。

**策略二：“哨兵”错误处理策略**

当错误处理方不能只根据“透明的错误值”就做出错误处理路径选取的情况下，错误处理方会尝试对返回的错误值进行检视，于是就有可能出现下面代码中的反模式：

```go
data, err := b.Peek(1)
if err != nil {
    switch err.Error() {
    case "bufio: negative count":
        // ... ...
        return
    case "bufio: buffer full":
        // ... ...
        return
    case "bufio: invalid use of UnreadByte":
        // ... ...
        return
    default:
        // ... ...
        return
    }
}
```

简单来说，反模式就是，错误处理方以透明错误值所能提供的唯一上下文信息（描述错误的字符串），作为错误处理路径选择的依据。但这种“反模式”会造成严重的隐式耦合。这也就意味着，错误值构造方不经意间的一次错误描述字符串的改动，都会造成错误处理方处理行为的变化，并且这种通过字符串比较的方式，对错误值进行检视的性能也很差。

那这有什么办法吗？Go 标准库采用了定义导出的（Exported）“哨兵”错误值的方式，来辅助错误处理方检视（inspect）错误值并做出错误处理分支的决策，比如下面的 bufio 包中定义的“哨兵错误”：

```go
// $GOROOT/src/bufio/bufio.go
var (
    ErrInvalidUnreadByte = errors.New("bufio: invalid use of UnreadByte")
    ErrInvalidUnreadRune = errors.New("bufio: invalid use of UnreadRune")
    ErrBufferFull        = errors.New("bufio: buffer full")
    ErrNegativeCount     = errors.New("bufio: negative count")
)
```

下面的代码片段利用了上面的哨兵错误，进行错误处理分支的决策：

```go
data, err := b.Peek(1)
if err != nil {
    switch err {
    case bufio.ErrNegativeCount:
        // ... ...
        return
    case bufio.ErrBufferFull:
        // ... ...
        return
    case bufio.ErrInvalidUnreadByte:
        // ... ...
        return
    default:
        // ... ...
        return
    }
}
```

可以看到，一般“哨兵”错误值变量以 ErrXXX 格式命名。和透明错误策略相比，“哨兵”策略让错误处理方在有检视错误值的需求时候，可以“有的放矢”。不过，对于 API 的开发者而言，暴露“哨兵”错误值也意味着这些错误值和包的公共函数 / 方法一起成为了 API 的一部分。一旦发布出去，开发者就要对它进行很好的维护。而“哨兵”错误值也让使用这些值的错误处理方对它产生了依赖。

从 Go 1.13 版本开始，标准库 errors 包提供了 Is 函数用于错误处理方对错误值的检视。Is 函数类似于把一个 error 类型变量与“哨兵”错误值进行比较，比如下面代码：

```go
// 类似 if err == ErrOutOfBounds{ … }
if errors.Is(err, ErrOutOfBounds) {
    // 越界的错误处理
}
```

不同的是，如果 error 类型变量的底层错误值是一个包装错误（Wrapped Error），errors.Is 方法会沿着该包装错误所在错误链（Error Chain)，与链上所有被包装的错误（Wrapped Error）进行比较，直至找到一个匹配的错误为止。下面是 Is 函数应用的一个例子：

```go
var ErrSentinel = errors.New("the underlying sentinel error")

func main() {
	err1 := fmt.Errorf("wrap sentinel: %w", ErrSentinel)
	err2 := fmt.Errorf("wrap err1: %w", err1)
	println(err2 == ErrSentinel) //false
	if errors.Is(err2, ErrSentinel) {
	    println("err2 is ErrSentinel")
	    return
	}
	 println("err2 is not ErrSentinel")
}
```

如果你使用的是 Go 1.13 及后续版本，建议尽量使用errors.Is方法去检视某个错误值是否就是某个预期错误值，或者包装了某个特定的“哨兵”错误值。

**策略三：错误值类型检视策略**

基于 Go 标准库提供的错误值构造方法构造的“哨兵”错误值，除了让错误处理方可以“有的放矢”的进行值比较之外，并没有提供其他有效的错误上下文信息。那如果遇到错误处理方需要错误值提供更多的“错误上下文”的情况，上面这些错误处理策略和错误值构造方式都无法满足。这种情况下，我们需要通过自定义错误类型的构造错误值的方式，来提供更多的“错误上下文”信息。并且，由于错误值都通过 error 接口变量统一呈现，要得到底层错误类型携带的错误上下文信息，错误处理方需要使用 Go 提供的类型断言机制（Type Assertion）或类型选择机制（Type Switch），这种错误处理方式，我称之为错误值类型检视策略。

```go
// $GOROOT/src/encoding/json/decode.go
type UnmarshalTypeError struct {
    Value  string       
    Type   reflect.Type 
    Offset int64        
    Struct string       
    Field  string      
}
```

错误处理方可以通过错误类型检视策略，获得更多错误值的错误上下文信息，下面就是利用这一策略的 json 包的一个方法的实现：

```go
// $GOROOT/src/encoding/json/decode.go
func (d *decodeState) addErrorContext(err error) error {
    if d.errorContext.Struct != nil || len(d.errorContext.FieldStack) > 0 {
        switch err := err.(type) {
        case *UnmarshalTypeError:
            err.Struct = d.errorContext.Struct.Name()
            err.Field = strings.Join(d.errorContext.FieldStack, ".")
            return err
        }
    }
    return err
}
```

我们看到，这段代码通过类型 switch 语句得到了 err 变量代表的动态类型和值，然后在匹配的 case 分支中利用错误上下文信息进行处理。这里，一般自定义导出的错误类型以XXXError的形式命名。和“哨兵”错误处理策略一样，错误值类型检视策略，由于暴露了自定义的错误类型给错误处理方，因此这些错误类型也和包的公共函数 / 方法一起，成为了 API 的一部分。一旦发布出去，开发者就要对它们进行很好的维护。而它们也让使用这些类型进行检视的错误处理方对其产生了依赖

从 Go 1.13 版本开始，标准库 errors 包提供了As函数给错误处理方检视错误值。As函数类似于通过类型断言判断一个 error 类型变量是否为特定的自定义错误类型，如下面代码所示：

```go
// 类似 if e, ok := err.(*MyError); ok { … }
var e *MyError
if errors.As(err, &e) {
    // 如果err类型为*MyError，变量e将被设置为对应的错误值
}
```

```go
type MyError struct {
    e string
}

func (e *MyError) Error() string {
    return e.e
}

func main() {
    var err = &MyError{"MyError error demo"}
    err1 := fmt.Errorf("wrap err: %w", err)
    err2 := fmt.Errorf("wrap err1: %w", err1)
    var e *MyError
    if errors.As(err2, &e) {
        println("MyError is on the chain of err2")
        println(e == err)                  
        return                             
    }                                      
    println("MyError is not on the chain of err2")
} 
```

errors.As函数会沿着该包装错误所在错误链，与链上所有被包装的错误的类型进行比较，直至找到一个匹配的错误类型，就像 errors.Is 函数那样。

errors.As函数沿着 err2 所在错误链向下找到了被包装到最深处的错误值，并将 err2 与其类型 * MyError成功匹配。匹配成功后，errors.As 会将匹配到的错误值存储到 As 函数的第二个参数中，这也是为什么println(e == err)输出 true 的原因。

如果你使用的是 Go 1.13 及后续版本，请尽量使用errors.As方法去检视某个错误值是否是某自定义错误类型的实例

**策略四：错误行为特征检视策略**

在 Go 标准库中，我们发现了这样一种错误处理方式：将某个包中的错误类型归类，统一提取出一些公共的错误行为特征，并将这些错误行为特征放入一个公开的接口类型中。这种方式也被叫做错误行为特征检视策略。

以标准库中的net包为例，它将包内的所有错误类型的公共行为特征抽象并放入net.Error这个接口中，如下面代码：

```go
// $GOROOT/src/net/net.go
type Error interface {
    error
    Timeout() bool  
    Temporary() bool
}
```

我们看到，net.Error 接口包含两个用于判断错误行为特征的方法：Timeout 用来判断是否是超时（Timeout）错误，Temporary 用于判断是否是临时（Temporary）错误。而错误处理方只需要依赖这个公共接口，就可以检视具体错误值的错误行为特征信息，并根据这些信息做出后续错误处理分支选择的决策。

```go
// $GOROOT/src/net/http/server.go
func (srv *Server) Serve(l net.Listener) error {
    ... ...
    for {
        rw, e := l.Accept()
        if e != nil {
            select {
            case <-srv.getDoneChan():
                return ErrServerClosed
            default:
            }
            if ne, ok := e.(net.Error); ok && ne.Temporary() {
                // 注：这里对临时性(temporary)错误进行处理
                ... ...
                time.Sleep(tempDelay)
                continue
            }
            return e
        }
        ...
    }
    ... ...
}
```

在上面代码中，Accept 方法实际上返回的错误类型为`*OpError`，它是 net 包中的一个自定义错误类型，它实现了错误公共特征接口net.Error，如下代码所示：

```go
// $GOROOT/src/net/net.go
type OpError struct {
    ... ...
    // Err is the error that occurred during the operation.
    Err error
}

type temporary interface {
    Temporary() bool
}

func (e *OpError) Temporary() bool {
  if ne, ok := e.Err.(*os.SyscallError); ok {
      t, ok := ne.Err.(temporary)
      return ok && t.Temporary()
  }
  t, ok := e.Err.(temporary)
  return ok && t.Temporary()
}
```

因此，OpError 实例可以被错误处理方通过net.Error接口的方法，判断它的行为是否满足 Temporary 或 Timeout 特征。

在错误处理策略选择上：
* 请尽量使用“透明错误”处理策略，降低错误处理方与错误值构造方之间的耦合；
* 如果可以通过错误值类型的特征进行错误检视，那么请尽量使用“错误行为特征检视策略”;
* 在上述两种策略无法实施的情况下，再使用“哨兵”策略和“错误值类型检视”策略；
* Go 1.13 及后续版本中，尽量用errors.Is和errors.As函数替换原先的错误检视比较语句。

# Go 语言中的异常

## 函数健壮性设计原则

原则一：不要相信任何外部输入的参数。

原则二：不要忽略任何一个错误。

原则三：不要假定异常不会发生。

## 认识 Go 语言中的异常：panic

panic 指的是 Go 程序在运行时出现的一个异常情况。如果异常出现了，但没有被捕获并恢复，Go 程序的执行就会被终止，即便出现异常的位置不在主 Goroutine 中也会这样。

在 Go 中，panic 主要有两类来源，一类是来自 Go 运行时，另一类则是 Go 开发人员通过 panic 函数主动触发的。无论是哪种，一旦 panic 被触发，后续 Go 程序的执行过程都是一样的，这个过程被 Go 语言称为 panicking。

Go 官方文档以手工调用 panic 函数触发 panic 为例，对 panicking 这个过程进行了诠释：当函数 F 调用 panic 函数时，函数 F 的执行将停止。不过，函数 F 中已进行求值的 deferred 函数都会得到正常执行，执行完这些 deferred 函数后，函数 F 才会把控制权返还给其调用者。

```go
func foo() {
    println("call foo")
    bar()
    println("exit foo")
}

func bar() {
    println("call bar")
    panic("panic occurs in bar")
    zoo()
    println("exit bar")
}

func zoo() {
    println("call zoo")
    println("exit zoo")
}

func main() {
    println("call main")
    foo()
    println("exit main")
}
```

上面这个例子中，从 Go 应用入口开始，函数的调用次序依次为main -> foo -> bar -> zoo。在 bar 函数中，我们调用 panic 函数手动触发了 panic。

```
call main
call foo
call bar
panic: panic occurs in bar
```

从 main 函数的视角来看，这就好比将它对 foo 函数的调用，换成了对 panic 函数的调用一样。结果就是，main 函数的执行也被终止了，于是整个程序异常退出，日志"exit main"也没有得到输出的机会。不过，Go 也提供了捕捉 panic 并恢复程序正常执行秩序的方法，我们可以通过 recover 函数来实现这一点。

```go
func bar() {
    defer func() {
        if e := recover(); e != nil {
            fmt.Println("recover the panic:", e)
        }
    }()

    println("call bar")
    panic("panic occurs in bar")
    zoo()
    println("exit bar")
}
```

recover 是 Go 内置的专门用于恢复 panic 的函数，它必须被放在一个 defer 函数中才能生效。如果 recover 捕捉到 panic，它就会返回以 panic 的具体内容为错误上下文信息的错误值。如果没有 panic 发生，那么 recover 将返回 nil。而且，如果 panic 被 recover 捕捉到，panic 引发的 panicking 过程就会停止。

## 如何应对 panic？

* 第一点：评估程序对 panic 的忍受度，不同应用对异常引起的程序崩溃退出的忍受度是不一样的。比如，一个单次运行于控制台窗口中的命令行交互类程序（CLI），和一个常驻内存的后端 HTTP 服务器程序，对异常崩溃的忍受度就是不同的。前者即便因异常崩溃，对用户来说也仅仅是再重新运行一次而已。但后者一旦崩溃，就很可能导致整个网站停止服务。所以，针对各种应用对 panic 忍受度的差异，我们采取的应对 panic 的策略也应该有不同。
* 第二点：提示潜在 bug。C 语言中有个很好用的辅助函数，断言（assert 宏）。在使用 C 编写代码时，我们经常在一些代码执行路径上，使用断言来表达这段执行路径上某种条件一定为真的信心。断言为真，则程序处于正确运行状态，断言为否就是出现了意料之外的问题，而这个问题很可能就是一个潜在的 bug，这时我们可以借助断言信息快速定位到问题所在。

```go

// $GOROOT/src/encoding/json/encode.go
func (w *reflectWithString) resolve() error {
    ... ...
    switch w.k.Kind() {
    case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
        w.ks = strconv.FormatInt(w.k.Int(), 10)
        return nil
    case reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64, reflect.Uintptr:
        w.ks = strconv.FormatUint(w.k.Uint(), 10)
        return nil
    }
    panic("unexpected map key type")
}
```

我们也看到，去掉这行代码并不会对resolve方法的逻辑造成任何影响，但真正出现问题时，开发人员就缺少了“断言”潜在 bug 提醒的辅助支持了。在 Go 标准库中，大多数 panic 的使用都是充当类似断言的作用的。

* 第三点：不要混淆异常与错误。在日常编码中，我经常会看到一些 Go 语言初学者，尤其是一些有过 Java 语言编程经验的程序员，会因为习惯了 Java 那种基于try-catch-finally的错误处理思维，而将 Go panic 当成 Java 的“checked exception”去用，这显然是混淆了 Go 中的异常与错误，这是 Go 错误处理的一种反模式。在 Go 中，作为 API 函数的作者，你一定不要将 panic 当作错误返回给 API 调用者。

## 使用 defer 简化函数实现

对函数设计来说，如何实现简洁的目标是一个大话题。你可以从通用的设计原则去谈，比如函数要遵守单一职责，职责单一的函数肯定要比担负多种职责的函数更简单。你也可以从函数实现的规模去谈，比如函数体的规模要小，尽量控制在 80 行代码之内等。但我们这个是 Go 语言的课程，所以我们的角度更侧重于 Go 中是否有现成的语法元素，可以帮助我们简化 Go 函数的设计和实现。我也把答案剧透给你，有的，它就是 defer。

```go
func doSomething() error {
    var mu sync.Mutex
    mu.Lock()

    r1, err := OpenResource1()
    if err != nil {
        mu.Unlock()
        return err
    }

    r2, err := OpenResource2()
    if err != nil {
        r1.Close()
        mu.Unlock()
        return err
    }

    r3, err := OpenResource3()
    if err != nil {
        r2.Close()
        r1.Close()
        mu.Unlock()
        return err
    }

    // 使用r1，r2, r3
    err = doWithResources() 
    if err != nil {
        r3.Close()
        r2.Close()
        r1.Close()
        mu.Unlock()
        return err
    }

    r3.Close()
    r2.Close()
    r1.Close()
    mu.Unlock()
    return nil
}
```

我们看到，这类代码的特点就是在函数中会申请一些资源，并在函数退出前释放或关闭这些资源，比如这里的互斥锁 mu 以及资源 r1~r3 就是这样。

函数的实现需要确保，无论函数的执行流是按预期顺利进行，还是出现错误，这些资源在函数退出时都要被及时、正确地释放。为此，我们需要尤为关注函数中的错误处理，在错误处理时不能遗漏对资源的释放。

但这样的要求，就导致我们在进行资源释放，尤其是有多个资源需要释放的时候，比如上面示例那样，会大大增加开发人员的心智负担。同时当待释放的资源个数较多时，整个代码逻辑就会变得十分复杂，程序可读性、健壮性也会随之下降。但即便如此，如果函数实现中的某段代码逻辑抛出 panic，传统的错误处理机制依然没有办法捕获它并尝试从 panic 恢复。

defer 是 Go 语言提供的一种延迟调用机制，defer 的运作离不开函数。怎么理解呢？这句话至少有以下两点含义：
	* 在 Go 中，只有在函数（和方法）内部才能使用 defer；
	* defer 关键字后面只能接函数（或方法），这些函数被称为 deferred 函数。defer 将它们注册到其所在 Goroutine 中，用于存放 deferred 函数的栈数据结构中，这些 deferred 函数将在执行 defer 的函数退出前，按后进先出（LIFO）的顺序被程序调度执行（如下图所示）。
	![[Pasted image 20220405105106.png]]

而且，无论是执行到函数体尾部返回，还是在某个错误处理分支显式 return，又或是出现 panic，已经存储到 deferred 函数栈中的函数，都会被调度执行。所以说，deferred 函数是一个可以在任何情况下为函数进行收尾工作的好“伙伴”。

刚才那个例子可以改成

```go

func doSomething() error {
    var mu sync.Mutex
    mu.Lock()
    defer mu.Unlock()

    r1, err := OpenResource1()
    if err != nil {
        return err
    }
    defer r1.Close()

    r2, err := OpenResource2()
    if err != nil {
        return err
    }
    defer r2.Close()

    r3, err := OpenResource3()
    if err != nil {
        return err
    }
    defer r3.Close()

    // 使用r1，r2, r3
    return doWithResources() 
}
```

我们看到，使用 defer 后对函数实现逻辑的简化是显而易见的。而且，这里资源释放函数的 defer 注册动作，紧邻着资源申请成功的动作，这样成对出现的惯例就极大降低了遗漏资源释放的可能性，我们开发人员也不用再小心翼翼地在每个错误处理分支中检查是否遗漏了某个资源的释放动作。同时，代码的简化也意味代码可读性的提高，以及代码健壮度的增强。

### defer 使用的几个注意事项

* 第一点：明确哪些函数可以作为 deferred 函数。对于自定义的函数或方法，defer 可以给与无条件的支持，但是对于有返回值的自定义函数或方法，返回值会在 deferred 函数被调度执行的时候被自动丢弃。append、cap、len、make、new、imag 等内置函数都是不能直接作为 deferred 函数的，而 close、copy、delete、print、recover 等内置函数则可以直接被 defer 设置为 deferred 函数。
* 第二点：注意 defer 关键字后面表达式的求值时机。defer 关键字后面的表达式，是在将 deferred 函数注册到 deferred 函数栈的时候进行求值的。
* 第三点：知晓 defer 带来的性能损耗。在 Go 1.13 前的版本中，defer 带来的开销还是很大的。使用 defer 的函数的执行时间是没有使用 defer 函数的 8 倍左右。但从 Go 1.13 版本开始，Go 核心团队对 defer 性能进行了多次优化，到现在的 Go 1.17 版本，defer 的开销已经足够小了。