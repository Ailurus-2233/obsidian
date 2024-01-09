1. 需要软件 openssh，nmap，tsu，其中tsu是提供sudo命令 `apt install openssh nmap tsu`
2. 使用 `ifconfig` 查看本机ip地址
3. 使用 `sshd` 启动ssh服务
4. 使用 `nmap ip` 广播端口
5. 使用 `passwd` 配置用户密码
6. 使用 `whoami` 查看用户名
7. 在其他机器上使用 `ssh name@ip -p 8022` 默认端口是8022，即可链接到termux