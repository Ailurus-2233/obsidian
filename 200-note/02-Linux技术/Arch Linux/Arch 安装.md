## 系统安装

### 连接网络

如果是网线他是默认连接的，如果使用的wifi的话，则需要使用`iwctl`来连接无线网络

```bash
iwctl
iwd>device list //查询无线设备
iwd>station nc_name scan //扫描WiFi
iwd>station nc_name get-networks
iwd>station nc_name connect wifi_name //链接WiFi
```

设备可能被锁上，所以需要`rfkill`来解锁

```bash
rfkill unblock wifi
```

### 检测uefi启动

```bash
ls /sys/firmware/efi/efivars/
```

如果出来一堆文件，则说明是uefi启动，否则是传统bios启动

### 同步时间

```bash
timedatectl set-ntp true
```

pacman的验证机制，时间不同步无法安装软件

### 磁盘分区

首先要清理磁盘，指令`lsblk` 查询硬盘设备，然后使用`gdisk`清理磁盘。输入指令`gdisk /dev/sda` 然后`x`进入专家模式，`z`清理磁盘，确定即可。

这里`sda`是硬盘的具体名称，要根据`lsblk`的结果来写

然后进行磁盘分区，输入指令`cgdisk /dev/sda` ，操作简单有图形界面。分配完成后，选择`write` 

推荐分区大小 256Gb硬盘的话，按照下表来分，root和home分开是为了保证以后换操作系统的时候用户数据可以保留

| 分区名称 | 分区大小 | hex code |
| -------- | -------- | -------- |
| boot     | 300Mib   | ef00     |
| swap     | 8Gib     | 8200     |
| root     | 80Gib    | 8300     |
| home     | 剩余空间 | 8300     |

### 挂载分区

格式化分区，并且创建文件系统

```bash
#boot分区
mkfs.fat -F32 /dev/sda1
#swap分区
mkswap /dev/sda2
swapon /dev/sda2
#root和home分区
mkfs.ext4 /dev/sda3
mkfs.ext4 /dev/sda4
```

挂载分区

```bash
mount /dev/sda3 /mnt
mkdir /mnt/boot
mount /dev/sda1 /mnt/boot
mkdir /mnt/home
mount /dev/sda4 /mnt/home/
```

### 安装基本系统
```bash
#安装软件
pacstrap -i /mnt linux linux-headers linux-firmware base base-devel nano amd-ucode intel-ucode//虚拟机应该可以不用安装微码
#生成文件系统标识
genfstab -U -p /mnt >> /mnt/etc/fstab
```

这一步完成一个基本的arch linux就完成，然后需要进入系统完成一些简单配置，如网络，本地化，启动器，用户之类的方便启动后直接使用。

## 进入系统

```bash
arch-chroot /mnt
```

### 设置时区

```bash
ln -s /usr/share/zoneinfo/Asia/Shanghai > /etc/localtime
hwclock --systohc
```

### 本地化

```bash
nano /etc/locale.gen
# 删除en_US zh_CN UTF-8前面的# 保存
locale-gen
echo LANG=en_US.UTF-8 > /etc/locale.conf
export LANG=en_US.UTF-8
```

### 网络配置

```bash
nano /etc/hostname
#计算机名称
nano /etc/hosts
#
127.0.0.1 localhost
::1       localhost
127.0.1.1 name.localdomain name
```

### 用户设置

```bash
#设置root密码
passwd
#添加用户
useradd -m -g users -G wheel,storage,power -s /bin/bash wzy
passwd wzy
#权限设置
EDITOR=nano visudo
#找到这一行，去掉#
%wheel ALL=(ALL) ALL
#最后一行添加
Defaults rootpw
```

### systemd启动器

初始化

```bash
bootctl install
```

编辑启动项

```bash
nano /boot/loader/entries/arch.conf
```

添加下面内容

```bash
title My Arch Linux
linux /vmlinuz-linux
initrd /amd-ucode.img
initrd /initramfs-linux.img
```

然后执行

```bash
echo "options root=PARTUUID=$(blkid -s PARTUUID -o value /dev/sda2) rw" >> /boot/loader/entries/arch.conf
```

### 可选

**固态硬盘优化**

```bash
#SSD 相关的
systemctl enable fstrim.timer
```

**32位应用支持**

编辑`/etc/pacman.conf` 将`multilib`的注释取消

至此已经安装完成，`exit`退出系统，`umount -R /mnt` 取消挂载，重启电脑。

当然这个系统啥都没有，图形界面没有，网络管理还是最基础的，需要进一步配置。