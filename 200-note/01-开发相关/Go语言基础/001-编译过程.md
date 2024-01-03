理解Go程序的实现编译执行过程

# Hello World

创建一个`main.go`文件

```go
package main

import "fmt"

func main() {
    fmt.Println("hello, world")
}
```
注：Go 源文件总是用全小写字母形式的短小单词命名，并且以.go 扩展名结尾。如果要在源文件的名字中使用多个单词，我们通常直接是将多个单词连接起来作为源文件名，而不是使用其他分隔符，比如下划线。也就是说，我们通常使用 `helloworld.go` 作为文件名而不是 `hello_world.go`。

在控制台中执行指令

```cmd
> go build main.go
> ./main.exe
hello, world
```
这样我们就得到了简单的`hello world`程序

# 程序结构

## 定义包
```go
package main
```

这一行代码定义了 Go 中的一个包 package。包是 Go 语言的基本组成单元，通常使用单个的小写单词命名，一个 Go 程序本质上就是一组包的集合。所有 Go 代码都有自己隶属的包，在这里我们的“hello，world”示例的所有代码都在一个名为 main 的包中。main 包在 Go 中是一个特殊的包，整个 Go 程序中仅允许存在一个名为 main 的包。

## main 函数
```go
func main() {
    fmt.Println("hello, world")
}
```

这里的 main 函数会比较特殊：当你运行一个可执行的 Go 程序的时候，所有的代码都会从这个入口函数开始运行。这段代码的第一行声明了一个名为 main 的、没有任何参数和返回值的函数。如果某天你需要给函数声明参数的话，那么就必须把它们放置在圆括号 () 中。那对花括号{}被用来标记函数体，Go 要求所有的函数体都要被花括号包裹起来。按照惯例，我们推荐把左花括号与函数声明置于同一行并以空格分隔。

## 函数主体
```go
fmt.Println("hello, world")
```

这一行代码已经完成了整个示例程序的所有工作了：将字符串输出到终端的标准输出（stdout）上。

注意点：

1. 标准 Go 代码风格使用 Tab 而不是空格来实现缩进的，当然这个代码风格的格式化工作也可以交由 gofmt 完成。
2. 我们调用了一个名为 Println 的函数，这个函数位于 Go 标准库的 fmt 包中。为了在我们的示例程序中使用 fmt 包定义的 Println 函数，我们其实做了两步操作。

第一步是在源文件的开始处通过 import 声明导入 fmt 包的包路径：

``` go
import "fmt"
```

第二步则是在 main 函数体中，通过 fmt 这个限定标识符（Qualified Identifier）调用 Println 函数。虽然两处都使用了“fmt”这个字面值，但在这两处“fmt”字面值所代表的含义却是不一样的:

* import “fmt” 一行中“fmt”代表的是包的导入路径（Import），它表示的是标准库下的 fmt 目录，整个 import 声明语句的含义是导入标准库 fmt 目录下的包；
* fmt.Println 函数调用一行中的“fmt”代表的则是包名。

main 函数体中之所以可以调用 fmt 包的 Println 函数，还有最后一个原因，那就是 Println 函数名的首字母是大写的。在 Go 语言中，只有首字母为大写的标识符才是导出的（Exported），才能对包外的代码可见；如果首字母是小写的，那么就说明这个标识符仅限于在声明它的包内可见。

另外，在 Go 语言中，main 包是不可以像标准库 fmt 包那样被导入（Import）的，如果导入 main 包，在代码编译阶段你会收到一个 Go 编译器错误：import “xx/main” is a program, not an importable package。

3. 我们还是回到 main 函数体实现上，把关注点放在传入到 Println 函数的字符串“hello, world”上面。你会发现，我们传入的字符串也就是我们执行程序后在终端的标准输出上看到的字符串。

这种“所见即所得”得益于 Go 源码文件本身采用的是 Unicode 字符集，而且用的是 UTF-8 标准的字符编码方式，这与编译后的程序所运行的环境所使用的字符集和字符编码方式是一致的。

# 编译过程

```cmd
> go build main.go
```

与c/c++类似，编译成功后，会得到二进制文件；所以，Go 是一种编译型语言，这意味着只有你编译完 Go 程序之后，才可以将生成的可执行文件交付于其他人，并运行在没有安装 Go 的环境中。

## 复杂项目编译

在新项目中，创建main.go并输入
```go
package main

import (
  "github.com/valyala/fasthttp"
  "go.uber.org/zap"
)

var logger *zap.Logger

func init() {
  logger, _ = zap.NewProduction()
}

func fastHTTPHandler(ctx *fasthttp.RequestCtx) {
  logger.Info("hello, go module", zap.ByteString("uri", ctx.RequestURI()))
}

func main() {
  fasthttp.ListenAndServe(":8081", fastHTTPHandler)
}
```

这个示例创建了一个在 8081 端口监听的 http 服务，当我们向它发起请求后，这个服务会在终端标准输出上输出一段访问日志。

现在如果直接执行`go build`是会编译失败的，这是需要使用Go 1.11 之后引入的go module机制

执行指令
``` bash
> go mod init github.com/bigwhite/hellomodule
go: creating new go.mod: module github.com/bigwhite/hellomodule
go: to add module requirements and sums:
  go mod tidy
```

它先会生成一个`go.mod`文件，然后推荐执行 `go mod tidy`指令，它会将未在`$GOPATH$`中的包给下载下来，执行完之后`go.mod`文件会变成这个样子

```
module github.com/bigwhite/hellomodule

go 1.16

require (
  github.com/valyala/fasthttp v1.28.0
  go.uber.org/zap v1.18.1
)
```

不仅如此，hellomodule 目录下还多了一个名为 go.sum 的文件，这个文件记录了 hellomodule 的直接依赖和间接依赖包的相关版本的 hash 值，用来校验本地包的真实性。在构建的时候，如果本地依赖包的 hash 值与 go.sum 文件中记录的不一致，就会被拒绝构建。

# Go 项目的经典结构布局

## Go 可执行程序项目布局

可执行程序项目是以构建可执行程序为目的的项目，Go 社区针对这类 Go 项目所形成的典型结构布局是这样的：

```
> tree -F exe-layout 
exe-layout
├── cmd/
│   ├── app1/
│   │   └── main.go
│   └── app2/
│       └── main.go
├── go.mod
├── go.sum
├── internal/
│   ├── pkga/
│   │   └── pkg_a.go
│   └── pkgb/
│       └── pkg_b.go
├── pkg1/
│   └── pkg1.go
├── pkg2/
│   └── pkg2.go
└── vendor/
```

### cmd目录

cmd 目录就是存放项目要编译构建的可执行文件对应的 main 包的源文件。如果你的项目中有多个可执行文件需要构建，每个可执行文件的 main 包单独放在一个子目录中，比如图中的 app1、app2，cmd 目录下的各 app 的 main 包将整个项目的依赖连接在一起。

而且通常来说，main 包应该很简洁。我们在 main 包中会做一些命令行参数解析、资源初始化、日志设施初始化、数据库连接初始化等工作，之后就会将程序的执行权限交给更高级的执行控制对象。另外，也有一些 Go 项目将 cmd 这个名字改为 app 或其他名字，但它的功能其实并没有变。

### internal 目录

根据 internal 机制的定义，一个 Go 项目里的 internal 目录下的 Go 包，只可以被本项目内部的包导入。项目外部是无法导入这个 internal 目录下面的包的。可以说，internal 目录的引入，让一个 Go 项目中 Go 包的分类与用途变得更加清晰。

### pkgN 目录

这是一个存放项目自身要使用、同样也是可执行文件对应 main 包所要依赖的库文件，同时这些目录下的包还可以被外部项目引用。

### go.mod 和 go.sum

它们是 Go 语言包依赖管理使用的配置文件。我们前面说过，Go 1.11 版本引入了 Go Module 构建机制，这里我建议你所有新项目都基于 Go Module 来进行包依赖管理，因为这是目前 Go 官方推荐的标准构建模式。

### vendor 目录

vendor 是 Go 1.5 版本引入的用于在项目本地缓存特定版本依赖包的机制，在 Go Modules 机制引入前，基于 vendor 可以实现可重现构建，保证基于同一源码构建出的可执行程序是等价的。

不过呢，我们这里将 vendor 目录视为一个可选目录。原因在于，Go Module 本身就支持可再现构建，而无需使用 vendor。 当然 Go Module 机制也保留了 vendor 目录（通过 go mod vendor 可以生成 vendor 下的依赖包，通过 `go build -mod=vendor` 可以实现基于 vendor 的构建）。一般我们仅保留项目根目录下的 vendor 目录，否则会造成不必要的依赖选择的复杂性。

### 简化布局
如果 Go 可执行程序项目有一个且只有一个可执行程序要构建，那就比较好办了，我们可以将上面项目布局进行简化：
```
$tree -F -L 1 single-exe-layout
single-exe-layout
├── go.mod
├── internal/
├── main.go
├── pkg1/
├── pkg2/
└── vendor/
```
你可以看到，我们删除了 cmd 目录，将唯一的可执行程序的 main 包就放置在项目根目录下，而其他布局元素的功用不变。


# 总结
* Go 包是 Go 语言的基本组成单元。一个 Go 程序就是一组包的集合，所有 Go 代码都位于包中；
* Go 源码可以导入其他 Go 包，并使用其中的导出语法元素，包括类型、变量、函数、方法等，而且，main 函数是整个 Go 应用的入口函数；
* Go 源码需要先编译，再分发和运行。如果是单 Go 源文件的情况，我们可以直接使用 go build 命令 +Go 源文件名的方式编译。不过，对于复杂的 Go 项目，我们需要在 Go Module 的帮助下完成项目的构建。
* 对于Go 项目结构：
  * 放在项目顶层的 Go Module 相关文件，包括 go.mod 和 go.sum；
  * cmd 目录：存放项目要编译构建的可执行文件所对应的 main 包的源码文件；
  * 项目包目录：每个项目下的非 main 包都“平铺”在项目的根目录下，每个目录对应一个 Go 包；
  * internal 目录：存放仅项目内部引用的 Go 包，这些包无法被项目之外引用；
  * vendor 目录：这是一个可选目录，为了兼容 Go 1.5 引入的 vendor 构建模式而存在的。这个目录下的内容均由 Go 命令自动维护，不需要开发者手工干预。