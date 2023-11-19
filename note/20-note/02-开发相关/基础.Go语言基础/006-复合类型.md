# 数组类型

Go 语言的数组是一个长度固定的、由同构类型元素组成的连续序列。通过这个定义，我们可以识别出 Go 的数组类型包含两个重要属性：元素的类型和数组长度（元素的个数）。这两个属性也直接构成了 Go 语言中数组类型变量的声明：

```go
var arr [N]T
```

如果两个数组类型的元素类型 T 与数组长度 N 都是一样的，那么这两个数组类型是等价的，如果有一个属性不同，它们就是两个不同的数组类型。

```go
func foo(arr [5]int) {}
func main() {
    var arr1 [5]int
    var arr2 [6]int
    var arr3 [5]string

    foo(arr1) // ok
    foo(arr2) // 错误：[6]int与函数foo参数的类型[5]int不是同一数组类型
    foo(arr3) // 错误：[5]string与函数foo参数的类型[5]int不是同一数组类型
}  
```

数组类型不仅是逻辑上的连续序列，而且在实际内存分配时也占据着一整块内存。Go 编译器在为数组类型的变量实际分配内存时，会为 Go 数组分配一整块、可以容纳它所有元素的连续内存，如下图所示：

![[Pasted image 20220331083953.png]]

从这个数组类型的内存表示中可以看出来，这块内存全部空间都被用来表示数组元素，所以说这块内存的大小，就等于各个数组元素的大小之和。如果两个数组所分配的内存大小不同，那么它们肯定是不同的数组类型。Go 提供了预定义函数 `len` 可以用于获取一个数组类型变量的长度，通过 `unsafe` 包提供的 `Sizeof` 函数，我们可以获得一个数组变量的总大小，如下面代码：

```go
var arr = [6]int{1, 2, 3, 4, 5, 6}
fmt.Println("数组长度：", len(arr))           // 6
fmt.Println("数组大小：", unsafe.Sizeof(arr)) // 6 * 8 = 48
```

和基本数据类型一样，我们声明一个数组类型变量的同时，也可以显式地对它进行初始化。我们需要在右值中显式放置数组类型，并通过大括号的方式给各个元素赋值（如下面代码中的 arr2）。如果不进行显式初始化，那么数组中的元素值就是它类型的零值。我们也可以忽略掉右值初始化表达式中数组类型的长度，用“…”替代，Go 编译器会根据数组元素的个数，自动计算出数组长度。

```go
var arr1 [6]int // [0 0 0 0 0 0]

var arr2 = [6]int {
    11, 12, 13, 14, 15, 16,
} // [11 12 13 14 15 16]

var arr3 = [...]int { 
    21, 22, 23,
} // [21 22 23]

fmt.Printf("%T\n", arr3) // [3]int

var arr4 = [...]int{
    99: 39, // 将第100个元素(下标值为99)的值赋值为39，其余元素值均为0
}
fmt.Printf("%T\n", arr4) // [100]int
```


# 多维数组

```go
var mArr [2][3][4]int
```

多维数组也不难理解，我们以上面示例中的多维数组类型为例，我们从左向右逐维地去看，这样我们就可以将一个多维数组分层拆解成这样：

![[Pasted image 20220331085252.png]]

虽然数组类型是 Go 语言中最基础的复合数据类型，但是在使用中它也会有一些问题。数组类型变量是一个整体，这就意味着一个数组变量表示的是整个数组。这点与 C 语言完全不同，在 C 语言中，数组变量可视为指向数组第一个元素的指针。这样一来，无论是参与迭代，还是作为实际参数传给一个函数 / 方法，Go 传递数组的方式都是纯粹的值拷贝，这会带来较大的内存拷贝开销。虽然可以使用指针的方式，来向函数传递数组，但这样做的确可以避免性能损耗，但这更像是 C 语言的惯用法。其实，Go 语言为我们提供了一种更为灵活、更为地道的方式 ，切片，来解决这个问题。它的优秀特性让它成为了 Go  语言中最常用的同构复合类型。

# 切片

初始化切片

```go
var nums = []int{1, 2, 3, 4, 5, 6}
```

与数组声明相比，切片声明仅仅是少了一个“长度”属性。去掉“长度”这一束缚后，切片展现出更为灵活的特性，这些特性我们后面再分析。

```go
fmt.Println(len(nums)) // 6

nums = append(nums, 7) // 切片变为[1 2 3 4 5 6 7]
fmt.Println(len(nums)) // 7
```

上面代码，表示的是通过len获取切片长度，通过append追加7到切片后面，长度也会对应变化。

## 切片的底层实现

```go
type slice struct {
    array unsafe.Pointer
    len   int
    cap   int
}
```

每个切片包含三个字段：

* array: 是指向底层数组的指针；
* len: 是切片的长度，即切片中当前元素的个数；
* cap: 是底层数组的长度，也是切片的最大容量，cap 值永远大于等于 len 值。

如果我们用这个三元组结构表示切片类型变量 nums，会是这样：

![[Pasted image 20220331085948.png]]

我们看到，Go 编译器会自动为每个新创建的切片，建立一个底层数组，默认底层数组的长度与切片初始元素个数相同。我们还可以用以下几种方法创建切片，并指定它底层数组的长度。

**方法一：通过 make 函数来创建切片，并指定底层数组的长度。**

```go
sl := make([]byte, 6, 10) // 其中10为cap值，即底层数组长度，6为切片的初始长度
```

如果没有在 make 中指定 cap 参数，那么底层数组长度 cap 就等于 len

**方法二：采用 array[low : high : max]语法基于一个已存在的数组创建切片。这种方式被称为数组的切片化**

```go
arr := [10]int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
sl := arr[3:7:9]
```

我们基于数组 arr 创建了一个切片 sl，这个切片 sl 在运行时中的表示是这样：

![[Pasted image 20220331090321.png]]

我们看到，基于数组创建的切片，它的起始元素从 low 所标识的下标值开始，切片的长度（len）是 high - low，它的容量是 max - low。而且，由于切片 sl 的底层数组就是数组 arr，对切片 sl 中元素的修改将直接影响数组 arr 变量。比如，如果我们将切片的第一个元素加 10，那么数组 arr 的第四个元素将变为 14。

切片好比打开了一个访问与修改数组的“窗口”，通过这个窗口，我们可以直接操作底层数组中的部分元素。这有些类似于我们操作文件之前打开的“文件描述符”（Windows 上称为句柄），通过文件描述符我们可以对底层的真实文件进行相关操作。可以说，切片之于数组就像是文件描述符之于文件。

针对一个已存在的数组，我们还可以建立多个操作数组的切片，这些切片共享同一底层数组，切片对底层数组的操作也同样会反映到其他切片中。下面是为数组 arr 建立的两个切片的内存表示：

![[Pasted image 20220331090734.png]]

我们看到，上图中的两个切片 sl1 和 sl2 是数组 arr 的“描述符”，这样的情况下，无论我们通过哪个切片对数组进行的修改操作，都会反映到另一个切片中。比如，将 sl2[2]置为 14，那么 sl1[0]也会变成 14，因为 sl2[2]直接操作的是底层数组 arr 的第四个元素 arr[3]。

**方法三：基于切片创建切片**

这种切片的运行时表示原理与上面的是一样的

## 切片的动态扩容

“动态扩容”指的就是，当我们通过 append 操作向切片追加数据的时候，如果这时切片的 len 值和 cap 值是相等的，也就是说切片底层数组已经没有空闲空间再来存储追加的值了，Go 运行时就会对这个切片做扩容操作，来保证切片始终能存储下追加的新值。前面的切片变量 nums 之所以可以存储下新追加的值，就是因为 Go 对其进行了动态扩容，也就是重新分配了其底层数组，从一个长度为 6 的数组变成了一个长为 12 的数组。

```go
var s []int
s = append(s, 11) 
fmt.Println(len(s), cap(s)) //1 1
s = append(s, 12) 
fmt.Println(len(s), cap(s)) //2 2
s = append(s, 13) 
fmt.Println(len(s), cap(s)) //3 4
s = append(s, 14) 
fmt.Println(len(s), cap(s)) //4 4
s = append(s, 15) 
fmt.Println(len(s), cap(s)) //5 8
```

 append 操作的这种自动扩容行为，有些时候会给我们开发者带来一些困惑，比如基于一个已有数组建立的切片，一旦追加的数据操作触碰到切片的容量上限（实质上也是数组容量的上界)，切片就会和原数组解除“绑定”，后续对切片的任何修改都不会反映到原数组中了。

```go
u := [...]int{11, 12, 13, 14, 15}
fmt.Println("array:", u) // [11, 12, 13, 14, 15]
s := u[1:3]
fmt.Printf("slice(len=%d, cap=%d): %v\n", len(s), cap(s), s) // [12, 13]
s = append(s, 24)
fmt.Println("after append 24, array:", u)
fmt.Printf("after append 24, slice(len=%d, cap=%d): %v\n", len(s), cap(s), s)
s = append(s, 25)
fmt.Println("after append 25, array:", u)
fmt.Printf("after append 25, slice(len=%d, cap=%d): %v\n", len(s), cap(s), s)
s = append(s, 26)
fmt.Println("after append 26, array:", u)
fmt.Printf("after append 26, slice(len=%d, cap=%d): %v\n", len(s), cap(s), s)

s[0] = 22
fmt.Println("after reassign 1st elem of slice, array:", u)
fmt.Printf("after reassign 1st elem of slice, slice(len=%d, cap=%d): %v\n", len(s), cap(s), s)
```

运行这段代码，我们得到这样的结果

```
array: [11 12 13 14 15]
slice(len=2, cap=4): [12 13]
after append 24, array: [11 12 13 24 15]
after append 24, slice(len=3, cap=4): [12 13 24]
after append 25, array: [11 12 13 24 25]
after append 25, slice(len=4, cap=4): [12 13 24 25]
after append 26, array: [11 12 13 24 25]
after append 26, slice(len=5, cap=8): [12 13 24 25 26]
after reassign 1st elem of slice, array: [11 12 13 24 25]
after reassign 1st elem of slice, slice(len=5, cap=8): [22 13 24 25 26]
```

这里，在 append 25 之后，切片的元素已经触碰到了底层数组 u 的边界了。然后我们再 append 26 之后，append 发现底层数组已经无法满足 append 的要求，于是新创建了一个底层数组（数组长度为 cap(s) 的 2 倍，即 8），并将 slice 的元素拷贝到新数组中了。

在这之后，我们即便再修改切片的第一个元素值，原数组 u 的元素也不会发生改变了，因为这个时候切片 s 与数组 u 已经解除了“绑定关系”，s 已经不再是数组 u 的“描述符”了。这种因切片的自动扩容而导致的“绑定关系”解除，有时候会成为实践道路上的一个小陷阱，一定要注意这一点。

# Map 类型

map 是 Go 语言提供的一种抽象数据类型，它表示一组无序的键值对。在后面的讲解中，我们会直接使用 key 和 value 分别代表 map 的键和值。而且，map 集合中每个 key 都是唯一的：

![[Pasted image 20220331091810.png]]

和切片类似，作为复合类型的 map，它在 Go 中的类型表示也是由 key 类型与 value 类型组成的，就像下面代码：

```go
map[key_type]value_type
```

这里，我们要注意，map 类型对 value 的类型没有限制，但是对 key 的类型却有严格要求，因为 map 类型要保证 key 的唯一性。Go 语言中要求，key 的类型必须支持`==`和`!=`两种比较操作符。

在 Go 语言中，函数类型、map 类型自身，以及切片只支持与 nil 的比较，而不支持同类型两个变量的比较。如果像下面代码这样，进行这些类型的比较，Go 编译器将会报错：

```go
s1 := make([]int, 1)
s2 := make([]int, 2)
f1 := func() {}
f2 := func() {}
m1 := make(map[int]string)
m2 := make(map[int]string)
println(s1 == s2) // 错误：invalid operation: s1 == s2 (slice can only be compared to nil)
println(f1 == f2) // 错误：invalid operation: f1 == f2 (func can only be compared to nil)
println(m1 == m2) // 错误：invalid operation: m1 == m2 (map can only be compared to nil)
```

因此在这里，你一定要注意：函数类型、map 类型自身，以及切片类型是不能作为 map 的 key 类型的。

## map 变量的声明和初始化

```go
var m map[string]int // 一个map[string]int类型的变量
```

和切片类型变量一样，如果我们没有显式地赋予 map 变量初值，map 类型变量的默认值为 nil。不过切片变量和 map 变量在这里也有些不同。初值为零值 nil 的切片类型变量，可以借助内置的 append 的函数进行操作，这种在 Go 语言中被称为“零值可用”。但 map 类型，因为它内部实现的复杂性，无法“零值可用”。所以，如果我们对处于零值状态的 map 变量直接进行操作，就会导致运行时异常（panic），从而导致程序进程异常退出：

```go
var m map[string]int // m = nil
m["key"] = 1         // 发生运行时异常：panic: assignment to entry in nil map
```

为 map 类型变量显式赋值有两种方式：一种是使用复合字面值；另外一种是使用 make 这个预声明的内置函数。

**方法一：使用复合字面值初始化 map 类型变量。**

```go
m := map[int]string{}
```

这里，我们显式初始化了 map 类型变量 m。不过，你要注意，虽然此时 map 类型变量 m 中没有任何键值对，但变量 m 也不等同于初值为 nil 的 map 变量。这个时候，我们对 m 进行键值对的插入操作，不会引发运行时异常。

```go
m1 := map[int][]string{
    1: []string{"val1_1", "val1_2"},
    3: []string{"val3_1", "val3_2", "val3_3"},
    7: []string{"val7_1"},
}

type Position struct { 
    x float64 
    y float64
}

m2 := map[Position]string{
    Position{29.935523, 52.568915}: "school",
    Position{25.352594, 113.304361}: "shopping-mall",
    Position{73.224455, 111.804306}: "hospital",
}
```

Go 还提供了“语法糖”。这种情况下，Go 允许省略字面值中的元素类型。因为 map 类型表示中包含了 key 和 value 的元素类型，Go 编译器已经有足够的信息，来推导出字面值中各个值的类型了。

```go
m2 := map[Position]string{
    {29.935523, 52.568915}: "school",
    {25.352594, 113.304361}: "shopping-mall",
    {73.224455, 111.804306}: "hospital",
}
```

**方法二：使用 make 为 map 类型变量进行显式初始化。**

和切片通过 make 进行初始化一样，通过 make 的初始化方式，我们可以为 map 类型变量指定键值对的初始容量，但无法进行具体的键值对赋值，就像下面代码这样：

```go
m1 := make(map[int]string) // 未指定初始容量
m2 := make(map[int]string, 8) // 指定初始容量为8
```

map 类型的容量不会受限于它的初始容量值，当其中的键值对数量超过初始容量后，Go 运行时会自动增加 map 类型的容量，保证后续键值对的正常插入。

## Map 基本操作

**操作一：插入新键值对。**

面对一个非 nil 的 map 类型变量，我们可以在其中插入符合 map 类型定义的任意新键值对。插入新键值对的方式很简单，我们只需要把 value 赋值给 map 中对应的 key 就可以了：

```go
m := make(map[int]string)
m[1] = "value1"
m[2] = "value2"
m[3] = "value3"
```

不过，如果我们插入新键值对的时候，某个 key 已经存在于 map 中了，那我们的插入操作就会用新值覆盖旧值：

```go
m := map[string]int {
  "key1" : 1,
  "key2" : 2,
}

m["key1"] = 11 // 11会覆盖掉"key1"对应的旧值1
m["key3"] = 3  // 此时m为map[key1:11 key2:2 key3:3]
```

**操作二：获取键值对数量。**

和切片一样，map 类型也可以通过内置函数 len，获取当前变量已经存储的键值对数量:

```go
m := map[string]int {
  "key1" : 1,
  "key2" : 2,
}

fmt.Println(len(m)) // 2
m["key3"] = 3  
fmt.Println(len(m)) // 3
```

这里要注意的是我们不能对 map 类型变量调用 cap，来获取当前容量，这是 map 类型与切片类型的一个不同点。

**操作三：查找和数据读取**

和写入相比，map 类型更多用在查找和数据读取场合。所谓查找，就是判断某个 key 是否存在于某个 map 中。有了前面向 map 插入键值对的基础，我们可能自然而然地想到，可以用下面代码去查找一个键并获得该键对应的值：

```go
m := make(map[string]int)
v := m["key1"]
```

乍一看，第二行代码在语法上好像并没有什么不当之处，但其实通过这行语句，我们还是无法确定键 key1 是否真实存在于 map 中。这是因为，当我们尝试去获取一个键对应的值的时候，如果这个键在 map 中并不存在，我们也会得到一个值，这个值是 value 元素类型的零值。

那么在 map 中查找 key 的正确姿势是什么呢？Go 语言的 map 类型支持通过用一种名为“comma ok”的惯用法，进行对某个 key 的查询。接下来我们就用“comma ok”惯用法改造一下上面的代码：

```go
m := make(map[string]int)
v, ok := m["key1"]
if !ok {
    // "key1"不在map中
}

// "key1"在map中，v将被赋予"key1"键对应的value
```

如果我们并不关心某个键对应的 value，而只关心某个键是否在于 map 中，我们可以使用空标识符替代变量 v，忽略可能返回的 value：

```go
m := make(map[string]int)
_, ok := m["key1"]
... ...
```

因此，一定要记住：在 Go 语言中，请使用“comma ok”惯用法对 map 进行键查找和键值读取操作。

**操作四：删除数据。**

在 Go 中，我们需要借助内置函数 delete 来从 map 中删除数据。使用 delete 函数的情况下，传入的第一个参数是我们的 map 类型变量，第二个参数就是我们想要删除的键。

```go
m := map[string]int {
  "key1" : 1,
  "key2" : 2,
}

fmt.Println(m) // map[key1:1 key2:2]
delete(m, "key2") // 删除"key2"
fmt.Println(m) // map[key1:1]
```

这里要注意的是，delete 函数是从 map 中删除键的唯一方法。即便传给 delete 的键在 map 中并不存在，delete 函数的执行也不会失败，更不会抛出运行时的异常。

**操作五：遍历 map 中的键值数据**

遍历 map 的键值对只有一种方法，那就是像对待切片那样通过 for range 语句对 map 数据进行遍历。

```go
package main
  
import "fmt"

func main() {
    m := map[int]int{
        1: 11,
        2: 12,
        3: 13,
    }

    fmt.Printf("{ ")
    for k, v := range m {
        fmt.Printf("[%d, %d] ", k, v)
    }
    fmt.Printf("}\n")
}
```

如果我们只关心每次迭代的键，我们可以使用下面的方式对 map 进行遍历：

```go
for k, _ := range m { 
  // 使用k
}
```

或者

```go
for k := range m {
  // 使用k
}
```

如果我们只关心每次迭代返回的键所对应的 value，我们同样可以通过空标识符替代变量 k，就像下面这样：

```go
for _, v := range m {
  // 使用v
}
```

```ad-note
我们可以看到，对同一 map 做多次遍历的时候，每次遍历元素的次序都不相同。这是 Go 语言 map 类型的一个重要特点，也是很容易让 Go 初学者掉入坑中的一个地方。所以这里你一定要记住：程序逻辑千万不要依赖遍历 map 所得到的的元素次序。
```

## map 变量的传递开销

和切片类型一样，map 也是引用类型。这就意味着 map 类型变量作为参数被传递给函数或方法的时候，实质上传递的只是一个“描述符”

## map 的内部实现

和切片相比，map 类型的内部实现要更加复杂。Go 运行时使用一张哈希表来实现抽象的 map 类型。运行时实现了 map 类型操作的所有功能，包括查找、插入、删除等。在编译阶段，Go 编译器会将 Go 语法层面的 map 操作，重写成运行时对应的函数调用。大致的对应关系是这样的：

```go
// 创建map类型变量实例
m := make(map[keyType]valType, capacityhint) → m := runtime.makemap(maptype, capacityhint, m)

// 插入新键值对或给键重新赋值
m["key"] = "value" → v := runtime.mapassign(maptype, m, "key") v是用于后续存储value的空间的地址

// 获取某键的值 
v := m["key"]      → v := runtime.mapaccess1(maptype, m, "key")
v, ok := m["key"]  → v, ok := runtime.mapaccess2(maptype, m, "key")

// 删除某键
delete(m, "key")   → runtime.mapdelete(maptype, m, “key”)
```

![[Pasted image 20220331095822.png]]

我们可以看到，和切片的运行时表示图相比，map 的实现示意图显然要复杂得多。接下来，我们结合这张图来简要描述一下 map 在运行时层的实现原理。我们重点讲解一下一个 map 变量在初始状态、进行键值对操作后，以及在并发场景下的 Go 运行时层的实现原理。

### 初始状态

从图中我们可以看到，与语法层面 map 类型变量（m）一一对应的是 `*runtime.hmap` 的实例，即 `runtime.hmap` 类型的指针，也就是我们前面在讲解 `map` 类型变量传递开销时提到的 `map` 类型的描述符。hmap 类型是 map 类型的头部结构（header），它存储了后续 map 类型操作所需的所有信息，包括：

![[Pasted image 20220331100424.png]]

真正用来存储键值对数据的是桶，也就是 `bucket`，每个 `bucket` 中存储的是 Hash 值低 bit 位数值相同的元素，默认的元素个数为 BUCKETSIZE（值为 8，Go 1.17 版本中在 `$GOROOT/src/cmd/compile/internal/reflectdata/reflect.go` 中定义，与 `runtime/map.go` 中常量 `bucketCnt` 保持一致）。

当某个 `bucket`（比如 `buckets[0]`) 的 8 个空槽 slot）都填满了，且 `map` 尚未达到扩容的条件的情况下，运行时会建立 `overflow bucket`，并将这个 `overflow bucket` 挂在上面` bucket`（如 `buckets[0]`）末尾的 `overflow` 指针上，这样两个` buckets` 形成了一个链表结构，直到下一次 map 扩容之前，这个结构都会一直存在。从图中我们可以看到，每个 `bucket` 由三部分组成，从上到下分别是 `tophash` 区域、key 存储区域和 value 存储区域。

### tophash 区域

当我们向 map 插入一条数据，或者是从 map 按 key 查询数据的时候，运行时都会使用哈希函数对 key 做哈希运算，并获得一个哈希值（hashcode）。这个 hashcode 非常关键，运行时会把 hashcode“一分为二”来看待，其中低位区的值用于选定 bucket，高位区的值用于在某个 bucket 中确定 key 的位置。我把这一过程整理成了下面这张示意图，你理解起来可以更直观：

![[Pasted image 20220331100747.png]]

因此，每个 bucket 的 tophash 区域其实是用来快速定位 key 位置的，这样就避免了逐个 key 进行比较这种代价较大的操作。尤其是当 key 是 size 较大的字符串类型时，好处就更突出了。这是一种以空间换时间的思路。

### key 存储区域

我们看 tophash 区域下面是一块连续的内存区域，存储的是这个 bucket 承载的所有 key 数据。运行时在分配 bucket 的时候需要知道 key 的 Size。

当我们声明一个 map 类型变量，比如 `var m map[string]int` 时，Go 运行时就会为这个变量对应的特定 map 类型，生成一个` runtime.maptype` 实例。如果这个实例已经存在，就会直接复用。maptype 实例的结构是这样的：

```go
type maptype struct {
    typ        _type
    key        *_type
    elem       *_type
    bucket     *_type // internal type representing a hash bucket
    keysize    uint8  // size of key slot
    elemsize   uint8  // size of elem slot
    bucketsize uint16 // size of bucket
    flags      uint32
} 
```

我们可以看到，这个实例包含了我们需要的 map 类型中的所有"元信息"。我们前面提到过，编译器会把语法层面的 map 操作重写成运行时对应的函数调用，这些运行时函数都有一个共同的特点，那就是第一个参数都是 maptype 指针类型的参数。

Go 运行时就是利用 maptype 参数中的信息确定 key 的类型和大小的。map 所用的 hash 函数也存放在 maptype.key.alg.hash(key, hmap.hash0) 中。同时 maptype 的存在也让 Go 中所有 map 类型都共享一套运行时 map 操作函数，而不是像 C++ 那样为每种 map 类型创建一套 map 操作函数，这样就节省了对最终二进制文件空间的占用。

### value 存储区域

key 存储区域下方的另外一块连续的内存区域，这个区域存储的是 key 对应的 value。和 key 一样，这个区域的创建也是得到了 `maptype` 中信息的帮助。Go 运行时采用了把 key 和 value 分开存储的方式，而不是采用一个 kv 接着一个 kv 的 kv 紧邻方式存储，这带来的其实是算法上的复杂性，但却减少了因内存对齐带来的内存浪费。

`map[int8]int64` 为例，看看下面的存储空间利用率对比图

![[Pasted image 20220331101348.png]]

当前 Go 运行时使用的方案内存利用效率很高，而 kv 紧邻存储的方案在` map[int8]int64` 这样的例子中内存浪费十分严重，它的内存利用率是 `72/128=56.25%`，有近一半的空间都浪费掉了。另外，还有一点要强调一下，如果 key 或 value 的数据长度大于一定数值，那么运行时不会在 bucket 中直接存储数据，而是会存储 key 或 value 数据的指针。目前 Go 运行时定义的最大 key 和 value 的长度是这样的：

```go
// $GOROOT/src/runtime/map.go
const (
    maxKeySize  = 128
    maxElemSize = 128
)
```

### map 扩容

我们前面提到过，map 会对底层使用的内存进行自动管理。因此，在使用过程中，当插入元素个数超出一定数值后，map 一定会存在自动扩容的问题，也就是怎么扩充 bucket 的数量，并重新在 bucket 间均衡分配数据的问题。那么 map 在什么情况下会进行扩容呢？Go 运行时的 map 实现中引入了一个 LoadFactor（负载因子），当 count > LoadFactor * 2^B 或 overflow bucket 过多时，运行时会自动对 map 进行扩容。目前 Go 最新 1.17 版本 LoadFactor 设置为 6.5（loadFactorNum/loadFactorDen）。这里是 Go 中与 map 扩容相关的部分源码：

```go
// $GOROOT/src/runtime/map.go
const (
  ... ...

  loadFactorNum = 13
  loadFactorDen = 2
  ... ...
)

func mapassign(t *maptype, h *hmap, key unsafe.Pointer) unsafe.Pointer {
  ... ...
  if !h.growing() && (overLoadFactor(h.count+1, h.B) || tooManyOverflowBuckets(h.noverflow, h.B)) {
    hashGrow(t, h)
    goto again // Growing the table invalidates everything, so try again
  }
  ... ...
}
```

这两方面原因导致的扩容，在运行时的操作其实是不一样的。如果是因为 overflow bucket 过多导致的“扩容”，实际上运行时会新建一个和现有规模一样的 bucket 数组，然后在 assign 和 delete 时做排空和迁移。如果是因为当前数据数量超出 LoadFactor 指定水位而进行的扩容，那么运行时会建立一个两倍于现有规模的 bucket 数组，但真正的排空和迁移工作也是在 assign 和 delete 时逐步进行的。原 bucket 数组会挂在 hmap 的 oldbuckets 指针下面，直到原 buckets 数组中所有数据都迁移到新数组后，原 buckets 数组才会被释放。你可以结合下面的 map 扩容示意图来理解这个过程，这会让你理解得更深刻一些：

![[Pasted image 20220331101715.png]]

### map 与并发

接着我们来看一下 map 和并发。从上面的实现原理来看，充当 map 描述符角色的 hmap 实例自身是有状态的（hmap.flags），而且对状态的读写是没有并发保护的。所以说 map 实例不是并发写安全的，也不支持并发读写。如果我们对 map 实例进行并发读写，程序运行时就会抛出异常。看看下面这个并发读写 map 的例子：

```go
package main

import (
    "fmt"
    "time"
)

func doIteration(m map[int]int) {
    for k, v := range m {
        _ = fmt.Sprintf("[%d, %d] ", k, v)
    }
}

func doWrite(m map[int]int) {
    for k, v := range m {
        m[k] = v + 1
    }
}

func main() {
    m := map[int]int{
        1: 11,
        2: 12,
        3: 13,
    }

    go func() {
        for i := 0; i < 1000; i++ {
            doIteration(m)
        }
    }()

    go func() {
        for i := 0; i < 1000; i++ {
            doWrite(m)
        }
    }()

    time.Sleep(5 * time.Second)
}
```

运行这个示例程序，我们会得到下面的执行错误结果：
```go
fatal error: concurrent map iteration and map write
```

不过，如果我们仅仅是进行并发读，map 是没有问题的。而且，Go 1.9 版本中引入了支持并发写安全的 sync.Map 类型，可以用来在并发读写的场景下替换掉 map，如果你有这方面的需求，可以查看一下sync.Map 的手册。另外，考虑到 map 可以自动扩容，map 中数据元素的 value 位置可能在这一过程中发生变化，所以 Go 不允许获取 map 中 value 的地址，这个约束是在编译期间就生效的。下面这段代码就展示了 Go 编译器识别出获取 map 中 value 地址的语句后，给出的编译错误：
```go
p := &m[key]  // cannot take the address of m[key]
fmt.Println(p)
```

```ad-danger
* 不要依赖 map 的元素遍历顺序；
* map 不是线程安全的，不支持并发读写；
* 不要尝试获取 map 中元素（value）的地址。
```
