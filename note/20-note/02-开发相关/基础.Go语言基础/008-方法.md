# 方法的一般声明形式

```go
func (src *Server) ListenAndServeTLS(certFile, keyFile String) error {
	//method block
}
```

Go 中方法的声明和函数的声明有很多相似之处，从上面这张图我们可以看到，和由五个部分组成的函数声明不同，Go 方法的声明有六个组成部分，多的一个就是图中的 receiver 部分。在 receiver 部分声明的参数，Go 称之为 receiver 参数，这个 receiver 参数也是方法与类型之间的纽带，也是方法与函数的最大不同。

```ad-note
方法接收器（receiver）参数、函数 / 方法参数，以及返回值变量对应的作用域范围，都是函数 / 方法体对应的显式代码块。
```

这就意味着，receiver 部分的参数名不能与方法参数列表中的形参名，以及具名返回值中的变量名存在冲突，必须在这个方法的作用域中具有唯一性。如果这个不唯一不存在，比如像下面例子中那样，Go 编译器就会报错：

```go
type T struct{}

func (t T) M(t string) { // 编译器报错：duplicate argument t (重复声明参数t)
    ... ...
}
```

不过，如果在方法体中，我们没有用到 receiver 参数，我们也可以省略 receiver 的参数名，就像下面这样：

```go
type T struct{}

func (T) M(t string) { 
    ... ...
}
```

仅当方法体中的实现不需要 receiver 参数参与时，我们才会省略 receiver 参数名。

除了 receiver 参数名字要保证唯一外，Go 语言对 receiver 参数的基类型也有约束，那就是 receiver 参数的基类型本身不能为指针类型或接口类型。

```go
type MyInt *int
func (r MyInt) String() string { // r的基类型为MyInt，编译器报错：invalid receiver type MyInt (MyInt is a pointer type)
    return fmt.Sprintf("%d", *(*int)(r))
}

type MyReader io.Reader
func (r MyReader) Read(p []byte) (int, error) { // r的基类型为MyReader，编译器报错：invalid receiver type MyReader (MyReader is an interface type)
    return r.Read(p)
}
```

Go 对方法声明的位置也是有约束的，Go 要求，方法声明要与 receiver 参数的基类型声明放在同一个包内。基于这个约束，我们还可以得到两个推论。
	* 第一个推论：我们不能为原生类型（诸如 int、float64、map 等）添加方法。
	* 第二个推论：不能跨越 Go 包为其他包的类型声明新方法。

# 方法的本质

```go
type T struct { 
    a int
}

func (t T) Get() int {  
    return t.a 
}

func (t *T) Set(a int) int { 
    t.a = a 
    return t.a 
}
```

C++ 中的对象在调用方法时，编译器会自动传入指向对象自身的 this 指针作为方法的第一个参数。而 Go 方法中的原理也是相似的，只不过我们是将 receiver 参数以第一个参数的身份并入到方法的参数列表中。按照这个原理，我们示例中的类型 T 和 \*T 的方法，就可以分别等价转换为下面的普通函数：

```go
// 类型T的方法Get的等价函数
func Get(t T) int {  
    return t.a 
}

// 类型*T的方法Set的等价函数
func Set(t *T, a int) int { 
    t.a = a 
    return t.a 
}
```

这种等价转换后的函数的类型就是方法的类型。只不过在 Go 语言中，这种等价转换是由 Go 编译器在编译和生成代码时自动完成的。Go 语言规范中还提供了方法表达式（Method Expression）的概念，可以让我们更充分地理解上面的等价转换，我们来看一下。

我们还以上面类型 T 以及它的方法为例，结合前面说过的 Go 方法的调用方式，我们可以得到下面代码：

```go
var t T
t.Get()
(&t).Set(1)
```

我们可以用另一种方式，把上面的方法调用做一个等价替换：

```go
var t T
T.Get(t)
(*T).Set(&t, 1)
```

这种直接以类型名 T 调用方法的表达方式，被称为 Method Expression。通过 Method Expression 这种形式，类型 T 只能调用 T 的方法集合（Method Set）中的方法，同理类型 \*T 也只能调用 \*T 的方法集合中的方法。这种通过 Method Expression 对方法进行调用的方式，与我们之前所做的方法到函数的等价转换是如出一辙的。所以，Go 语言中的方法的本质就是，一个以方法的 receiver 参数作为第一个参数的普通函数。

# receiver 参数类型对 Go 方法的影响

```go
func (t T) M1() <=> F1(t T)
func (t *T) M2() <=> F2(t *T)
```

这个例子中有方法 M1 和 M2。M1 方法是 receiver 参数类型为 T 的一类方法的代表，而 M2 方法则代表了 receiver 参数类型为 \*T 的另一类。下面我们分别来看看不同的 receiver 参数类型对 M1 和 M2 的影响。

* 首先，当 receiver 参数的类型为 T 时：
	当我们选择以 T 作为 receiver 参数类型时，M1 方法等价转换为F1(t T)。我们知道，Go 函数的参数采用的是值拷贝传递，也就是说，F1 函数体中的 t 是 T 类型实例的一个副本。这样，我们在 F1 函数的实现中对参数 t 做任何修改，都只会影响副本，而不会影响到原 T 类型实例。

据此我们可以得出结论：当我们的方法 M1 采用类型为 T 的 receiver 参数时，代表 T 类型实例的 receiver 参数以值传递方式传递到 M1 方法体中的，实际上是 T 类型实例的副本，M1 方法体中对副本的任何修改操作，都不会影响到原 T 类型实例。

* 第二，当 receiver 参数的类型为 \*T 时：
	当我们选择以 \*T 作为 receiver 参数类型时，M2 方法等价转换为F2(t \*T)。同上面分析，我们传递给 F2 函数的 t 是 T 类型实例的地址，这样 F2 函数体中对参数 t 做的任何修改，都会反映到原 T 类型实例上。

据此我们也可以得出结论：当我们的方法 M2 采用类型为 \*T 的 receiver 参数时，代表 \*T 类型实例的 receiver 参数以值传递方式传递到 M2 方法体中的，实际上是 T 类型实例的地址，M2 方法体通过该地址可以对原 T 类型实例进行任何修改操作。

## 选择 receiver 参数类型的第一个原则

基于上面的影响分析，我们可以得到选择 receiver 参数类型的第一个原则：如果 Go 方法要把对 receiver 参数代表的类型实例的修改，反映到原类型实例上，那么我们应该选择 \*T 作为 receiver 参数的类型。

存在问题：如果我们选择了 \*T 作为 Go 方法 receiver 参数的类型，那么我们是不是只能通过 \*T 类型变量调用该方法，而不能通过 T 类型变量调用了呢？

```go
  type T struct {
      a int
  }
  
  func (t T) M1() {
      t.a = 10
  }
 
 func (t *T) M2() {
     t.a = 11
 }
 
 func main() {
     var t1 T
     println(t1.a) // 0
     t1.M1()
     println(t1.a) // 0
     t1.M2()
     println(t1.a) // 11
 
     var t2 = &T{}
     println(t2.a) // 0
     t2.M1()
     println(t2.a) // 0
     t2.M2()
     println(t2.a) // 11
 }
 ```

通过这个实例，我们知道了这样一个结论：无论是 T 类型实例，还是 \*T 类型实例，都既可以调用 receiver 为 T 类型的方法，也可以调用 receiver 为 \*T 类型的方法。这样，我们在为方法选择 receiver 参数的类型的时候，就不需要担心这个方法不能被与 receiver 参数类型不一致的类型实例调用了。

## 选择 receiver 参数类型的第二个原则

考虑到 Go 方法调用时，receiver 参数是以值拷贝的形式传入方法中的。那么，如果 receiver 参数类型的 size 较大，以值拷贝形式传入就会导致较大的性能开销，这时我们选择 \*T 作为 receiver 类型可能更好些。

### 方法集合

```go
type Interface interface {
    M1()
    M2()
}

type T struct{}

func (t T) M1()  {}
func (t *T) M2() {}

func main() {
    var t T
    var pt *T
    var i Interface

    i = pt
    i = t // cannot use t (type T) as type Interface in assignment: T does not implement Interface (M2 method has pointer receiver)
}
```

在这个例子中，我们定义了一个接口类型 Interface 以及一个自定义类型 T。Interface 接口类型包含了两个方法 M1 和 M2，代码中还定义了基类型为 T 的两个方法 M1 和 M2，但它们的 receiver 参数类型不同，一个为 T，另一个为 \*T。在 main 函数中，我们分别将 T 类型实例 t 和 \*T 类型实例 pt 赋值给 Interface 类型变量 i。运行一下这个示例程序，我们在i = t这一行会得到 Go 编译器的错误提示，Go 编译器提示我们：T 没有实现 Interface 类型方法列表中的 M2，因此类型 T 的实例 t 不能赋值给 Interface 变量。有些事情并不是表面看起来这个样子的。了解方法集合后，这个问题就迎刃而解了。同时，方法集合也是用来判断一个类型是否实现了某接口类型的唯一手段，可以说，“方法集合决定了接口实现”。

所谓的方法集合决定接口实现的含义就是：如果某类型 T 的方法集合与某接口类型的方法集合相同，或者类型 T 的方法集合是接口类型 I 方法集合的超集，那么我们就说这个类型 T 实现了接口 I。或者说，方法集合这个概念在 Go 语言中的主要用途，就是用来判断某个类型是否实现了某个接口。

### 选择 receiver 参数类型的第三个原则

这个原则的选择依据就是 T 类型是否需要实现某个接口，也就是是否存在将 T 类型的变量赋值给某接口类型变量的情况。如果 T 类型需要实现某个接口，那我们就要使用 T 作为 receiver 参数的类型，来满足接口类型方法集合中的所有方法。如果 T 不需要实现某一接口，但 \*T 需要实现该接口，那么根据方法集合概念，\*T 的方法集合是包含 T 的方法集合的，这样我们在确定 Go 方法的 receiver 的类型时，参考原则一和原则二就可以了。


## receiver 总结

receiver 参数选型的三个经验原则，在实际进行 Go 方法设计时，我们首先应该考虑的是原则三，即 T 类型是否要实现某一接口。如果 T 类型需要实现某一接口的全部方法，那么我们就需要使用 T 作为 receiver 参数的类型来满足接口类型方法集合中的所有方法。如果 T 类型不需要实现某一接口，那么我们就可以参考原则一和原则二来为 receiver 参数选择类型了。也就是，如果 Go 方法要把对 receiver 参数所代表的类型实例的修改反映到原类型实例上，那么我们应该选择 \*T 作为 receiver 参数的类型。否则通常我们会为 receiver 参数选择 T 类型，这样可以减少外部修改类型实例内部状态的“渠道”。除非 receiver 参数类型的 size 较大，考虑到传值的较大性能开销，选择 \*T 作为 receiver 类型可能更适合。

方法集合。它在 Go 语言中的主要用途就是判断某个类型是否实现了某个接口。方法集合像“胶水”一样，将自定义类型与接口隐式地“粘结”在一起，我们后面理解带有类型嵌入的类型时还会借助这个概念。

# “继承” 类型嵌入

类型嵌入指的就是在一个类型的定义中嵌入了其他类型。Go 语言支持两种类型嵌入，分别是接口类型的类型嵌入和结构体类型的类型嵌入。

## 接口类型的类型嵌入

我们先用一个案例，直观地了解一下什么是接口类型的类型嵌入。虽然我们现在还没有系统学习接口类型，但在前面的讲解中，我们已经多次接触了接口类型。我们知道，接口类型声明了由一个方法集合代表的接口，比如下面接口类型 E：

```go
type E interface {
    M1()
    M2()
}
```

这个接口类型 E 的方法集合，包含两个方法，分别是 M1 和 M2，它们组成了 E 这个接口类型所代表的接口。如果某个类型实现了方法 M1 和 M2，我们就说这个类型实现了 E 所代表的接口。此时，我们再定义另外一个接口类型 I，它的方法集合中包含了三个方法 M1、M2 和 M3，如下面代码：

```go
type I interface {
    M1()
    M2()
    M3()
}
```

我们看到接口类型 I 方法集合中的 M1 和 M2，与接口类型 E 的方法集合中的方法完全相同。在这种情况下，我们可以用接口类型 E 替代上面接口类型 I 定义中 M1 和 M2，如下面代码：

```go
type I interface {
    E
    M3()
}
```

像这种在一个接口类型（I）定义中，嵌入另外一个接口类型（E）的方式，就是我们说的接口类型的类型嵌入。而且，这个带有类型嵌入的接口类型 I 的定义与上面那个包含 M1、M2 和 M3 的接口类型 I 的定义，是等价的。因此，我们可以得到一个结论，这种接口类型嵌入的语义就是新接口类型（如接口类型 I）将嵌入的接口类型（如接口类型 E）的方法集合，并入到自己的方法集合中。

这也是 Go 组合设计哲学的一种体现

```go
// $GOROOT/src/io/io.go

type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

type Closer interface {
    Close() error
}

type ReadWriter interface {
    Reader
    Writer
}

type ReadCloser interface {
    Reader
    Closer
}

type WriteCloser interface {
    Writer
    Closer
}

type ReadWriteCloser interface {
    Reader
    Writer
    Closer
}
```

不过，这种通过嵌入其他接口类型来创建新接口类型的方式，在 Go 1.14 版本之前是有约束的：如果新接口类型嵌入了多个接口类型，这些嵌入的接口类型的方法集合不能有交集，同时嵌入的接口类型的方法集合中的方法名字，也不能与新接口中的其他方法同名。

## 结构体类型的类型嵌入

```go
type S struct {
    A int
    b string
    c T
    p *P
    _ [10]int8
    F func()
}
```

结构体类型 S 中的每个字段（field）都有唯一的名字与对应的类型，即便是使用空标识符占位的字段，它的类型也是明确的，但这还不是 Go 结构体类型的“完全体”。Go 结构体类型定义还有另外一种形式，那就是带有嵌入字段（Embedded Field）的结构体定义。我们看下面这个例子：

```go
type T1 int
type t2 struct{
    n int
    m int
}

type I interface {
    M1()
}

type S1 struct {
    T1
    *t2
    I            
    a int
    b string
}
```

我们看到，结构体 S1 定义中有三个“非常规形式”的标识符，分别是 T1、t2 和 I，这三个标识符究竟代表的是什么呢？是字段名还是字段的类型呢？它们既代表字段的名字，也代表字段的类型。我们分别以这三个标识符为例，说明一下它们的具体含义：
	* 标识符 T1 表示字段名为 T1，它的类型为自定义类型 T1；
	* 标识符 t2 表示字段名为 t2，它的类型为自定义结构体类型 t2 的指针类型；
	* 标识符 I 表示字段名为 I，它的类型为接口类型 I。

这种以某个类型名、类型的指针类型名或接口类型名，直接作为结构体字段的方式就叫做结构体的类型嵌入，这些字段也被叫做嵌入字段（Embedded Field）。

```go
type MyInt int

func (n *MyInt) Add(m int) {
    *n = *n + MyInt(m)
}

type t struct {
    a int
    b int
}

type S struct {
    *MyInt
    t
    io.Reader
    s string
    n int
}

func main() {
    m := MyInt(17)
    r := strings.NewReader("hello, go")
    s := S{
        MyInt: &m,
        t: t{
            a: 1,
            b: 2,
        },
        Reader: r,
        s:      "demo",
    }

    var sl = make([]byte, len("hello, go"))
    s.Reader.Read(sl)
    fmt.Println(string(sl)) // hello, go
    s.MyInt.Add(5)
    fmt.Println(*(s.MyInt)) // 22
}
```

首先，这个例子中的结构体类型 S 使用了类型嵌入方式进行定义，它有三个嵌入字段 MyInt、t 和 Reader。为什么第三个嵌入字段的名字为 Reader 而不是 io.Reader？这是因为，Go 语言规定如果结构体使用从其他包导入的类型作为嵌入字段，比如 pkg.T，那么这个嵌入字段的字段名就是 T，代表的类型为 pkg.T。

接下来，我们再来看结构体类型 S 的变量的初始化。我们使用 field:value 方式对 S 类型的变量 s 的各个字段进行初始化。和普通的字段一样，初始化嵌入字段时，我们可以直接用嵌入字段名作为 field。

而且，通过变量 s 使用这些嵌入字段时，我们也可以像普通字段那样直接用变量s+字段选择符.+嵌入字段的名字，比如 s.Reader。我们还可以通过这种方式调用嵌入字段的方法，比如 s.Reader.Read 和 s.MyInt.Add。

## “实现继承”的原理

我们将上面例子代码做一下细微改动，我这里只列了变化部分的代码
```go
var sl = make([]byte, len("hello, go"))
s.Read(sl) 
fmt.Println(string(sl))
s.Add(5) 
fmt.Println(*(s.MyInt))
```

这段代码似乎在告诉我们：Read 方法与 Add 方法就是类型 S 方法集合中的方法。但是，这里类型 S 明明没有显式实现这两个方法呀，它是从哪里得到这两个方法的实现的呢？

其实，这两个方法就来自结构体类型 S 的两个嵌入字段 Reader 和 MyInt。结构体类型 S“继承”了 Reader 字段的方法 Read 的实现，也“继承”了 \*MyInt 的 Add 方法的实现。注意，我这里的“继承”用了引号，说明这并不是真正的继承，它只是 Go 语言的一种“障眼法”。

这种“障眼法”的工作机制是这样的，当我们通过结构体类型 S 的变量 s 调用 Read 方法时，Go 发现结构体类型 S 自身并没有定义 Read 方法，于是 Go 会查看 S 的嵌入字段对应的类型是否定义了 Read 方法。这个时候，Reader 字段就被找了出来，之后 s.Read 的调用就被转换为 s.Reader.Read 调用。这样一来，嵌入字段 Reader 的 Read 方法就被提升为 S 的方法，放入了类型 S 的方法集合。同理 \*MyInt 的 Add 方法也被提升为 S 的方法而放入 S 的方法集合。从外部来看，这种嵌入字段的方法的提升就给了我们一种结构体类型 S“继承”了 io.Reader 类型 Read 方法的实现，以及 \*MyInt 类型 Add 方法的实现的错觉。到这里，我们就清楚了，嵌入字段的使用的确可以帮我们在 Go 中实现方法的“继承”

![[Pasted image 20220405120810.png]]

## 类型嵌入与方法集合

在前面讲解接口类型的类型嵌入时，我们提到过接口类型的类型嵌入的本质，就是嵌入类型的方法集合并入到新接口类型的方法集合中，并且，接口类型只能嵌入接口类型。而结构体类型对嵌入类型的要求就比较宽泛了，可以是任意自定义类型或接口类型。

### 结构体类型中嵌入接口类型

在结构体类型中嵌入接口类型后，结构体类型的方法集合会发生什么变化呢？我们通过下面这个例子来看一下：

```go
type I interface {
    M1()
    M2()
}

type T struct {
    I
}

func (T) M3() {}

func main() {
    var t T
    var p *T
    dumpMethodSet(t)
    dumpMethodSet(p)
}
```

运行这个示例，我们会得到以下结果：

```go
main.T's method set:
- M1
- M2
- M3

*main.T's method set:
- M1
- M2
- M3
```

我们可以看到，原本结构体类型 T 只带有一个方法 M3，但在嵌入接口类型 I 后，结构体类型 T 的方法集合中又并入了接口类型 I 的方法集合。并且，由于 \*T 类型方法集合包括 T 类型的方法集合，因此无论是类型 T 还是类型 \*T，它们的方法集合都包含 M1、M2 和 M3。于是我们可以得出一个结论：结构体类型的方法集合，包含嵌入的接口类型的方法集合。

如果实现了，Go 就会优先使用结构体自己实现的方法。如果没有实现，那么 Go 就会查找结构体中的嵌入字段的方法集合中，是否包含了这个方法。如果多个嵌入字段的方法集合中都包含这个方法，那么我们就说方法集合存在交集。这个时候，Go 编译器就会因无法确定究竟使用哪个方法而报错。那怎么解决这个问题呢？其实有两种解决方案。一是，我们可以消除 E1 和 E2 方法集合存在交集的情况。二是为 T 增加 M1 和 M2 方法的实现，这样的话，编译器便会直接选择 T 自己实现的 M1 和 M2，不会陷入两难境地。

### 结构体类型中嵌入结构体类型

```go
type T1 struct{}

func (T1) T1M1()   { println("T1's M1") }
func (*T1) PT1M2() { println("PT1's M2") }

type T2 struct{}

func (T2) T2M1()   { println("T2's M1") }
func (*T2) PT2M2() { println("PT2's M2") }

type T struct {
    T1
    *T2
}

func main() {
    t := T{
        T1: T1{},
        T2: &T2{},
    }

    dumpMethodSet(t)
    dumpMethodSet(&t)
}
```

在这个例子中，结构体类型 T 有两个嵌入字段，分别是 T1 和 \*T2，我们知道 T1 与 \*T1、T2 与 \*T2 的方法集合是不同的：
	T1 的方法集合包含：T1M1；
	\*T1 的方法集合包含：T1M1、PT1M2；
	T2 的方法集合包含：T2M1；
	\*T2 的方法集合包含：T2M1、PT2M2。

它们作为嵌入字段嵌入到 T 中后，对 T 和 \*T 的方法集合的影响也是不同的。我们运行一下这个示例，看一下输出结果：

```go
main.T's method set:
- PT2M2
- T1M1
- T2M1

*main.T's method set:
- PT1M2
- PT2M2
- T1M1
- T2M1
```

通过输出结果，我们看到了 T 和 \*T 类型的方法集合果然有差别的：
	类型 T 的方法集合 = T1 的方法集合 + \*T2 的方法集合类型 
	\*T 的方法集合 = \*T1 的方法集合 + \*T2 的方法集合


## defined 类型与 alias 类型的方法集合

Go 语言中，凡通过类型声明语法声明的类型都被称为 defined 类型，下面是一些 defined 类型的声明的例子：

```go
type I interface {
    M1()
    M2()
}
type T int
type NT T // 基于已存在的类型T创建新的defined类型NT
type NI I // 基于已存在的接口类型I创建新defined接口类型NI
```

对于那些基于接口类型创建的 defined 的接口类型，它们的方法集合与原接口类型的方法集合是一致的。但对于基于非接口类型的 defined 类型创建的非接口类型，我们通过下面例子来看一下：

```go
package main

type T struct{}

func (T) M1()  {}
func (*T) M2() {}

type T1 T

func main() {
  var t T
  var pt *T
  var t1 T1
  var pt1 *T1

  dumpMethodSet(t)
  dumpMethodSet(t1)

  dumpMethodSet(pt)
  dumpMethodSet(pt1)
}
```

在这个例子中，我们基于一个 defined 的非接口类型 T 创建了新 defined 类型 T1，并且分别输出 T1 和 \*T1 的方法集合来确认它们是否“继承”了 T 的方法集合。

```go
main.T's method set:
- M1

main.T1's method set is empty!

*main.T's method set:
- M1
- M2

*main.T1's method set is empty!
```

从输出结果上看，新类型 T1 并没有“继承”原 defined 类型 T 的任何一个方法。从逻辑上来说，这也符合 T1 与 T 是两个不同类型的语义。

```go
type T struct{}

func (T) M1()  {}
func (*T) M2() {}

type T1 = T

func main() {
    var t T
    var pt *T
    var t1 T1
    var pt1 *T1

    dumpMethodSet(t)
    dumpMethodSet(t1)

    dumpMethodSet(pt)
    dumpMethodSet(pt1)
}
```

```go
main.T's method set:
- M1

main.T's method set:
- M1

*main.T's method set:
- M1
- M2

*main.T's method set:
- M1
- M2
```

通过这个输出结果，我们看到，我们的 dumpMethodSet 函数甚至都无法识别出“类型别名”，无论类型别名还是原类型，输出的都是原类型的方法集合。由此我们可以得到一个结论：无论原类型是接口类型还是非接口类型，类型别名都与原类型拥有完全相同的方法集合。
