## 添加aur源

编辑文件`/etc/pacman.conf`

```xml
[archlinuxcn]  
Server = https://repo.archlinuxcn.org/$arch
```

## 更新&安装密钥

```bash
sudo pacman -Syyu
sudo pacman -S archlinuxcn-keyring
```

## 选择其他aur源

```bash
sudo pacman -S archlinuxcn-mirrorlist-git
```

然后替换` /etc/pacman.conf `为如下内容

```bash
[archlinuxcn]
Include = /etc/pacman.d/archlinuxcn-mirrorlist
```

保存，并编辑 `/etc/pacman.d/archlinuxcn-mirrorlist `，取消镜像地址的注释。

## archlinuxcn-keyring 安装失败问题

[Arch Linux](https://www.archlinuxcn.org/gnupg-2-1-and-the-pacman-keyring/)

请以 root 权限运行，下面指令后重新安装archlinuxcn-keyring

```bash
pacman -Syu haveged
systemctl start haveged
systemctl enable haveged

rm -fr /etc/pacman.d/gnupg
pacman-key --init
pacman-key --populate archlinux
pacman-key --populate archlinuxcn
```

## 安装aur工具

```bash
sudo pacman -S paru
```

[GitHub - Morganamilo/paru: Feature packed AUR helper](https://github.com/morganamilo/paru)