## Arch

1. 安装docker `sudo pacman -S docker`
2. 启动docker `sudo systemctl start docker.service`
3. 开机自动启动 `sudo systemctl enable docker.service`
4. 将用户添加到docker组 `sudo gpasswd -a $USER docker`
5. 修改镜像位置 `/etc/docker/daemon.json`
```
{
	"registry-mirrors": ["https://docker.mirrors.ustc.edu.cn"]
}
```
6. 重新启动 `reboot`
7. 测试安装完成 `docker info`