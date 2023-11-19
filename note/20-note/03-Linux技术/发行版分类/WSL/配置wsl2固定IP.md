## Linux端

### 配置IP
需要执行指令来手动配置IP

``` bash
ip addr del $(ip addr show eth0 | grep 'inet\b'| awk '{print $2}' | head -n 1) dev eth0
ip addr add 192.168.100.100/24 broadcast 192.168.100.255 dev eth0
ip route add 0.0.0.0/0 via 192.168.100.1 dev eth0
```

其中 `192.168.100.100` 是手动配置的IP地址，`192.168.100.255` 是广播地址，`192.168.100.1` 是windows地址

### 配置DNS
修改`/etc/wsl.conf`，用来禁止自动生成`resolv.conf`文件和启动`systemctl`
```sh
[network]
generateResolvConf = false

[boot]
systemd=true
```

修改`/etc/resolv.conf` 来配置DNS
```sh
nameserver 114.114.114.114
nameserver 180.76.76.76
```

## Windows端

需要执行指令给wsl的虚拟网卡分配新的ip
```bash
netsh.exe interface ip add address "vEthernet (WSL)" address=192.168.100.1/24
```

## 自动化配置

在linux中编写脚本，保存到`/usr/local/etc/init_vnet.sh`
```sh
#! /bin/sh
/mnt/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe -c 'sudo netsh.exe interface ip add address "vEthernet (WSL)" address=192.168.100.1/24'

ip addr del $(ip addr show eth0 | grep 'inet\b'| awk '{print $2}' | head -n 1) dev eth0
ip addr add 192.168.100.100/24 broadcast 192.168.100.255 dev eth0
ip route add 0.0.0.0/0 via 192.168.100.1 dev eth0
```

编辑`systemctl`的Unit，`/etc/systemd/system/init_vnet.service`
```sh
[Unit]
Description=init vnet
After=default.target

[Service]
Type=simple
ExecStart=/usr/local/etc/init_vnet.sh

[Install]
WantedBy=default.target
```

使用systemctl来使它开机执行

```sh
sudo systemctl enable init_vnet
sudo systemctl start init_vnet
```

> [!info] 注
> 1. systemd 只能在win11中开启
> 2. 脚本中，先调用了powershell执行了添加ip指令，这个指令前有一个sudo，是scoop安装的一个脚本，可以使powershell像linux一样直接使用sudo来使用管理员权限
> 3. 也可以在wsl.conf中的boot里，添加属性command = /path/to/init_vnet.sh 来实现自动启动


## 参考文档
1. [Windows11中wsl2为虚拟Linux子系统设置固定IP的方法 - 简书](https://www.jianshu.com/p/b7a978ed1e77)
2. [WSL 中的高级设置配置 | Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/wsl-config)
3. [Window11 WSL2 添加静态IP - 白日醒梦 - 博客园](https://www.cnblogs.com/Likfees/p/16750300.html)
