安装类似CentOS，不想配置的话，直接使用默认安装即可，桌面环境默认使用Gnome 

## 包管理工具

因为是redhat的制作的发行版，所以可以使用rpm来进行软件安装，除此之外，它还内置了dnf包管理工具，类似arch的滚动更新

像如下指令就可以用来更新/安装/卸载

```bash
sudo dnf update/install/remove package_name
```

特别的，可以使用如下指令自动删除一些不需要的依赖

```bash
sudo dnf autoremove
```

`update` 后不添加任何参数可以全局更新

```bash
sudo dnf update
```

Fedora 内核更新快，但是每次更新内核，旧的内核不会自动删除，占用硬盘空间。以前的教程删除旧内核都是先搜索，再移除要删除的版本，输入版本号也非常麻烦。使用以下命令即可一条命令删除旧内核：

```bash
sudo dnf remove --oldinstallonly
```

## 启用 RPM Fusion 软件源

安装 Fedora 时会提示你是否启用其他第三方软件源。但是自动启用的软件源，只有英伟达驱动程序、谷歌 Chrome 和 Steam 等软件源，全套的 RPM Fusion 软件源并没有自动启用，因此还有诸如 VLC 和 MPV 等软件也不可用。

```bash
sudo yum install --nogpgcheck https://mirrors.tuna.tsinghua.edu.cn/rpmfusion/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm https://mirrors.tuna.tsinghua.edu.cn/rpmfusion/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm
```

安装成功后，修改 `/etc/yum.repos.d/` 目录下以 `rpmfusion` 开头，以 `.repo` 结尾的文件。具体而言，需要将文件中的 `baseurl=` 开头的行等号后面链接中的 `http://download1.rpmfusion.org/` 替换为 `https://mirrors.tuna.tsinghua.edu.cn/rpmfusion/`，也可以参考清华源的说明。

## 配置 DNF 以更快地下载包

Fedora 可以通过多种方法增强下载包的速度。比如选择最快的镜像，可以提高包下载速度。此外，如果你的互联网连接速度足够快，则可以更改并行下载的数量以获得更快的下载。只需编辑位于 `/etc/dnf/dnf.conf` 的 DNF 配置文件。

```
fastestmirror=true
deltarpm=true
max_parellel_downloads=10
```

- `fastestmirror `为选择最快软件源，如果你手动修改了仓库里面的信息则不需要启动这个。
- `deltarpm` 相当于增量下载，把软件增加的部分下载下来，和原软件包合成新软件包，类似于现在的 Android 软件更新。
- `max_parellel_downloads` 设置最大并行下载数量。

## 安装 GNOME 优化和扩展应用程序

```
sudo dnf install gnome-tweaks gnome-extensions-app
```

## 参考资料

[技术|安装 Fedora 36 后一些适合中国用户的简单设置](https://linux.cn/article-14728-1.html)

[fedora | 镜像站使用帮助 | 清华大学开源软件镜像站 | Tsinghua Open Source Mirror](https://mirrors.tuna.tsinghua.edu.cn/help/fedora/)

[rpmfusion | 镜像站使用帮助 | 清华大学开源软件镜像站 | Tsinghua Open Source Mirror](https://mirrors.tuna.tsinghua.edu.cn/help/rpmfusion/)
