1. 安装wsl2
2. 获取使用的发行版镜像，这里使用archcraft
3. 安装ubuntu发行版，这个只是临时使用的
```
wsl --install -d ubuntu
```
4. 配置完成ubuntu后，将镜像文件放入ubuntu的用户目录下面
5. 安装7zip
```
sudo apt-get update
sudo apt-get install p7zip-full
```
6. 解压镜像文件
```
7z x archcraft.iso
```
7. 进入解压后的文件，找到squashfs文件，一般是`.sfs`的文件
```
unsquashfs squashfs.sfs
```
8. 这样就的到live系统的全部文件了，然后再通过tar打包即可
```
tar -cvf distro.tar *
```
9. 最后将打包好的tar文件移动到主机上，使用指令完成导入即可
```
wsl --import distro_name distro_location 
```

**参考文档：**

1. [Instructions on how to install a custom distro in WSL2 (Windows SubSystem for Linux 2) · GitHub](https://gist.github.com/artman41/858450e2c29b239d8692213b684ada25)
2. [导入要与 WSL 一起使用的任何 Linux 发行版 | Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/use-custom-distro)
