因为需要网络穿透将内网的电脑穿透到公网上使用，所以使用了frp这个开源的内网穿透工具，但是使用过程中发现，一旦重启了之后就没办法穿透了，所以就想让frpc开机自启，开机启动的方法有很多，我选择了使用注册服务的方式来实现，这里简单记录一下。

## 简单服务文件

在目录`/etc/systemd/system` 创建一个 `frpc.service` 文件，写入一下内容即注册了一个简单的服务

``` bash
[Unit]
Description=frpc
After=network.target

[Service]
Type=simple
Restart=always
ExecStart=/usr/local/bin/frpc -c /etc/frpc/frpc.ini

[Install]
WantedBy=multi-user.target
```

通过指令 `sudo systemctl enable frpc` 即可实现开机自启。

> [!info] 注
> 这只是实现了一个简单服务注册，service文件能够包含的内容有很多，之后找时间再补充。