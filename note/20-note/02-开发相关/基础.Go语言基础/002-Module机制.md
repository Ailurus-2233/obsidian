Go Module 的使用

# 包引用演化历史

Go 程序由 Go 包组合而成的，Go 程序的构建过程就是确定包版本、编译包以及将编译后得到的目标文件链接在一起的过程。Go 语言的构建模式历经了三个迭代和演化过程，分别是最初期的 GOPATH、1.5 版本的 Vendor 机制，以及现在的 Go Module。这里我们就先来介绍一下前面这两个。

## GOPATH

那么在 GOPATH 构建模式下，Go 编译器在编译 Go 程序时，会从系统PATH下的`$GOPATH$`中寻找第三方依赖包是否存在，如果缺失的话，那么会出现编译异常
```
> go build main.go
main.go:3:8: cannot find package "github.com/sirupsen/logrus" in any of:
  /Users/xxx/.bin/go1.10.8/src/github.com/sirupsen/logrus (from $GOROOT)
  /Users/xxx/Go/src/github.com/sirupsen/logrus (from $GOPATH)
```

这个时候就需要`go get`指令，来讲对应的依赖包下载到`$GOPATH$`目录下面
```
> go get github.com/sirupsen/logrus
```

这里的 go get 命令，不仅能将 logrus 包下载到 GOPATH 环境变量配置的目录下，它还会检查 logrus 的依赖包在本地是否存在，如果不存在，go get 也会一并将它们下载到本地。不过，go get 下载的包只是那个时刻各个依赖包的最新主线版本，这样会给后续 Go 程序的构建带来一些问题。

存在问题：
1. 依赖包持续演进，可能会导致不同开发者在不同时间获取和编译同一个 Go 包时，得到不同的结果，也就是不能保证可重现的构建（Reproduceable Build）。
2. 如果依赖包引入了不兼容代码，程序将无法通过编译。
3. 如果依赖包因引入新代码而无法正常通过编译，并且该依赖包的作者又没用及时修复这个问题，这种错误也会传导到你的程序，导致你的程序无法通过编译。

也就是说，在 GOPATH 构建模式下，Go 编译器实质上并没有关注 Go 项目所依赖的第三方包的版本。但 Go 开发者希望自己的 Go 项目所依赖的第三方包版本能受到自己的控制，而不是随意变化。于是 Go 核心开发团队引入了 Vendor 机制试图解决上面的问题。

## Vendor 机制

Go 在 1.5 版本中引入 vendor 机制。vendor 机制本质上就是在 Go 项目的某个特定目录下，将项目的所有依赖包缓存起来，这个特定目录名就是 vendor。

Go 编译器会优先感知和使用 vendor 目录下缓存的第三方包版本，而不是 GOPATH 环境变量所配置的路径下的第三方包版本。这样，无论第三方依赖包自己如何变化，无论 GOPATH 环境变量所配置的路径下的第三方包是否存在、版本是什么，都不会影响到 Go 程序的构建。

如果你将 vendor 目录和项目源码一样提交到代码仓库，那么其他开发者下载你的项目后，就可以实现可重现的构建。因此，如果使用 vendor 机制管理第三方依赖包，最佳实践就是将 vendor 一并提交到代码仓库中。

要想开启 vendor 机制，你的 Go 项目必须位于 GOPATH 环境变量配置的某个路径的 src 目录下面。如果不满足这一路径要求，那么 Go 编译器是不会理会 Go 项目目录下的 vendor 目录的。

不过 vendor 机制虽然一定程度解决了 Go 程序可重现构建的问题，但对开发者来说，它的体验却不那么好。一方面，Go 项目必须放在 GOPATH 环境变量配置的路径下，庞大的 vendor 目录需要提交到代码仓库，不仅占用代码仓库空间，减慢仓库下载和更新的速度，而且还会干扰代码评审，对实施代码统计等开发者效能工具也有比较大影响。

另外，你还需要手工管理 vendor 下面的 Go 依赖包，包括项目依赖包的分析、版本的记录、依赖包获取和存放，等等，最让开发者头疼的就是这一点。

## Go Module

一个 Go Module 是一个 Go 包的集合。module 是有版本的，所以 module 下的包也就有了版本属性。这个 module 与这些包会组成一个独立的版本单元，它们一起打版本、发布和分发。

在 Go Module 模式下，通常一个代码仓库对应一个 Go Module。一个 Go Module 的顶层目录下会放置一个 go.mod 文件，每个 go.mod 文件会定义唯一一个 module，也就是说 Go Module 与 go.mod 是一一对应的。

go.mod 文件所在的顶层目录也被称为 module 的根目录，module 根目录以及它子目录下的所有 Go 包均归属于这个 Go Module，这个 module 也被称为 main module。

# 使用Go Module 创建项目

将基于当前项目创建一个 Go Module，通常有如下几个步骤：
1. 通过 go mod init 创建 go.mod 文件，将当前项目变为一个 Go Module；
2. 通过 go mod tidy 命令自动更新当前 module 的依赖信息；
3. 执行 go build，执行新 module 的构建。

具体流程见`note-1`，这里重新说明一下通过go module生成的`go.mod`以及`go.sum`

## go.mod

```
module github.com/bigwhite/module-mode

go 1.16

require github.com/sirupsen/logrus v1.8.1
```

它记录了该项目所在路径，go的版本，以及该项目依赖的第三方依赖库，及其版本信息

## go.sum

```
github.com/davecgh/go-spew v1.1.1 h1:vj9j/u1bqnvCEfJOwUhtlOARqs3+rkHYY13jYWTU97c=
github.com/davecgh/go-spew v1.1.1/go.mod h1:J7Y8YcW2NihsgmVo/mv3lAwl/skON4iLHjSsI+c5H38=
github.com/pmezard/go-difflib v1.0.0 h1:4DBwDE0NGyQoBHbLQYPwSUPoCMWR5BEzIk/f1lZbAQM=
github.com/pmezard/go-difflib v1.0.0/go.mod h1:iKH77koFhYxTK1pcRnkKkqfTogsbg7gZNVY4sRDYZ/4=
github.com/sirupsen/logrus v1.8.1 h1:dJKuHgqk1NNQlqoA6BTlM1Wf9DOH3NBjQyu0h9+AZZE=
github.com/sirupsen/logrus v1.8.1/go.mod h1:yWOB1SBYBC5VeMP7gHvWumXLIWorT60ONWic61uBYv0=
github.com/stretchr/testify v1.2.2 h1:bSDNvY7ZPG5RlJ8otE/7V6gMiyenm9RtJ7IUVIAoJ1w=
github.com/stretchr/testify v1.2.2/go.mod h1:a8OnRcib4nhh0OaRAV+Yts87kKdq0PP7pXfy6kDkUVs=
golang.org/x/sys v0.0.0-20191026070338-33540a1f6037 h1:YyJpGZS1sBuBCzLAR1VEpK193GlqGZbnPFnPV/5Rsb4=
golang.org/x/sys v0.0.0-20191026070338-33540a1f6037/go.mod h1:h1NjWce9XRLGQEsW7wpKNCjG9DtNlClVuFLEZdDNbEs=
```

这同样是由 go mod 相关命令维护的一个文件，它存放了特定版本 module 内容的哈希值。

这是 Go Module 的一个安全措施。当将来这里的某个 module 的特定版本被再次下载的时候，go 命令会使用 go.sum 文件中对应的哈希值，和新下载的内容的哈希值进行比对，只有哈希值比对一致才是合法的，这样可以确保你的项目所依赖的 module 内容，不会被恶意或意外篡改。因此，我推荐你把 go.mod 和 go.sum 两个文件与源码，一并提交到代码版本控制服务器上。

# 深入 Go Module 构建模式

## 语义导入版本机制

在上面的例子中，我们看到 go.mod 的 require 段中依赖的版本号，都符合 vX.Y.Z 的格式。在 Go Module 构建模式下，一个符合 Go Module 要求的版本号，由前缀 v 和一个满足语义版本规范的版本号组成。

语义版本规范:
* 版本格式：主版本号.次版本号.修订号，版本号递增规则如下：
* major 主版本号：当你做了不兼容的 API 修改，
* minor 次版本号：当你做了向下兼容的功能性新增，
* patch 修订号：当你做了向下兼容的问题修正。
* 先行版本号及版本编译信息可以加到“主版本号.次版本号.修订号”的后面，作为延伸。

Go 命令和 go.mod 文件都使用上面这种符合语义版本规范的版本号，作为描述 Go Module 版本的标准形式。借助于语义版本规范，Go 命令可以确定同一 module 的两个版本发布的先后次序，而且可以确定它们是否兼容。

对于不同主版本号的导入，Go Module 创新性地给出了一个方法：将包主版本号引入到包导入路径中，我们可以像下面这样导入 logrus v2.0.0 版本依赖包

```go
import "github.com/sirupsen/logrus/v2"
```

我们甚至可以依赖两个不兼容的版本

```go
import (
    "github.com/sirupsen/logrus"
    logv2 "github.com/sirupsen/logrus/v2"
)
```

## 最小版本选择原则

对于以下情况

![版本依赖](minversion.png)

及 Go Module 出现之前的很多 Go 包依赖管理工具都会选择依赖项的“最新最大 (Latest Greatest) 版本”，对应到图中的例子，这个版本就是 v1.7.0。但是Go 设计者另辟蹊径，在诸多兼容性版本间，他们不光要考虑最新最大的稳定与安全，还要尊重各个 module 的述求：A 明明说只要求 C v1.1.0，B 明明说只要求 C v1.3.0。所以 Go 会在该项目依赖项的所有版本中，选出符合项目整体要求的“最小版本”，即v 1.3.0。


## Go 各版本构建模式机制和切换

我们前面说了，在 Go 1.11 版本中，Go 开发团队引入 Go Modules 构建模式。这个时候，GOPATH 构建模式与 Go Modules 构建模式各自独立工作，我们可以通过设置环境变量 GO111MODULE 的值在两种构建模式间切换。

然后，随着 Go 语言的逐步演进，从 Go 1.11 到 Go 1.16 版本，不同的 Go 版本在 GO111MODULE 为不同值的情况下，开启的构建模式几经变化，直到 Go 1.16 版本，Go Module 构建模式成为了默认模式。

所以，要分析 Go 各版本的具体构建模式的机制和切换，我们只需要找到这几个代表性的版本就好了。

我这里将 Go 1.13 版本之前、Go 1.13 版本以及 Go 1.16 版本，在 GO111MODULE 为不同值的情况下的行为做了一下对比，这样我们可以更好地理解不同版本下、不同构建模式下的行为特性，下面我们就来用表格形式做一下比对：

![go-module](go-module.png)

了解了这些，你就能在工作中游刃有余的在各个 Go 版本间切换了，不用再担心切换后模式变化，导致构建失败了。

当然，现在的Go 核心团队已经考虑在后续版本中彻底移除 GOPATH 构建模式，Go Module 构建模式将成为 Go 语言唯一的标准构建模式。



# Go Module的6类常规操作

## 为当前 module 添加一个依赖

更新源码后（添加了新的依赖），在项目目录下执行 `go mod tidy`，这样就会自动更新`go.mod`和`go.sum`文件，并下载新的依赖到`$GOPATH$`

## 升级 / 降级依赖的版本

查看依赖包的所有版本
```bash
>go list -m -versions github.com/sirupsen/logrus
github.com/sirupsen/logrus v0.1.0 v0.1.1 v0.2.0 v0.3.0 v0.4.0 v0.4.1 v0.5.0 v0.5.1 v0.6.0 v0.6.1 v0.6.2 v0.6.3 v0.6.4 v0.6.5 v0.6.6 v0.7.0 v0.7.1 v0.7.2 v0.7.3 v0.8.0 v0.8.1 v0.8.2 v0.8.3 v0.8.4 v0.8.5 v0.8.6 v0.8.7 v0.9.0 v0.10.0 v0.11.0 v0.11.1 v0.11.2 v0.11.3 v0.11.4 v0.11.5 v1.0.0 v1.0.1 v1.0.3 v1.0.4 v1.0.5 v1.0.6 v1.1.0 v1.1.1 v1.2.0 v1.3.0 v1.4.0 v1.4.1 v1.4.2 v1.5.0 v1.6.0 v1.7.0 v1.7.1 v1.8.0 v1.8.1
```

通过指令
``` bash
go mod edit -require=github.com/sirupsen/logrus@v1.7.0
go mod tidy
```

## 添加一个主版本号大于 1 的依赖

语义导入版本机制有一个原则：如果新旧版本的包使用相同的导入路径，那么新包与旧包是兼容的。也就是说，如果新旧两个包不兼容，那么我们就应该采用不同的导入路径。即在声明它的导入路径的基础上，加上版本号信息

```
import github.com/user/repo/v2/xxx
```

然后执行
```
go mod tidy
```

## 升级依赖版本到一个不兼容版本

按照语义导入版本的原则，不同主版本的包的导入路径是不同的。所以，同样地，我们这里也需要先将代码中包导入路径中的版本号改为大版本，接下来，我们再通`go mod tidy`过来获取对应版本的依赖包。

## 移除一个依赖

更改源码后，执行`go mod tidy`来修改`go.mod`，再通过`go list -m all`就会发现，依赖已经删除了。

## 特殊情况：使用 vendor

通过 `go mod vendor` 会在项目路径下生成一个vendor目录，创建了一份这个项目的依赖包的副本，并且通过 vendor/modules.txt 记录了 vendor 下的 module 以及版本。

如果我们要基于 vendor 构建，而不是基于本地缓存的 Go Module 构建，我们需要在 go build 后面加上 -mod=vendor 参数。

在 Go 1.14 及以后版本中，如果 Go 项目的顶层目录下存在 vendor 目录，那么 go build 默认也会优先基于 vendor 构建，除非你给 go build 传入 -mod=mod 的参数。

# 总结

在通过 go mod init 为当前 Go 项目创建一个新的 module 后，随着项目的演进，我们在日常开发过程中，会遇到多种常见的维护 Go Module 的场景。其中最常见的就是为项目添加一个依赖包，我们可以通过 go get 命令手工获取该依赖包的特定版本，更好的方法是通过 go mod tidy 命令让 Go 命令自动去分析新依赖并决定使用新依赖的哪个版本。

另外，还有几个场景需要你记住：
* 通过 go get 我们可以升级或降级某依赖的版本，如果升级或降级前后的版本不兼容，这里千万注意别忘了变化包导入路径中的版本号，这是 Go 语义导入版本机制的要求；
* 通过 go mod tidy，我们可以自动分析 Go 源码的依赖变更，包括依赖的新增、版本变更以及删除，并更新 go.mod 中的依赖信息；
* 通过 go mod vendor，我们依旧可以支持 vendor 机制，并且可以对 vendor 目录下缓存的依赖包进行自动管理。

