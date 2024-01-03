> [!info] 文章记录于2022.11.16 注意时间差异

# WSL开启方法

[适用于 Linux 的 Windows 子系统文档 ](https://learn.microsoft.com/zh-cn/windows/wsl/)

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

指令开启了windows的linux子系统和虚拟机平台功能，在`控制面板`>`程序`>`启用或关闭Windows功能`里选择对应的也能够开启，开启完重启电脑，即可使用WSL功能

# WSL2内核升级包

[旧版 WSL 的手动安装步骤 | Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/install-manual)
在这里第四步下载升级包，安装即可

```powershell
wsl --set-default-version 2
```

使用指令将默认版本修改为WSL2，就能使用WSL2来管理相关的Linux的系统

# 安装archlinux作为虚拟系统

[GitHub - yuk7/ArchWSL: ArchLinux based WSL Distribution. Supports multiple install.](https://github.com/yuk7/ArchWSL)

这个仓库制作了基于wsldl的arch操作系统的安装包，直接从release中下载最新的版本，解压后在终端执行`arch.exe`即可完成安装

# 一些通用配置

[[500-杂七杂八/590-折腾笔记/Arch 折腾笔记]]可以见这里，如添加用户，配置源等等

# 设置wsl默认的登录用户

在`Arch.exe`所在目录使用终端执行如下指令，即可切换登录用户

```
.\Arch.exe config --default-user user_name
```

