## WSL 端解决
1. 编辑`/etc/wsl.conf`
```bash
[automount]
ldconfig = false
```
2. 创建链接并使用它
```bash
sudo mkdir /usr/lib/wsl/lib2
sudo ln -s /usr/lib/wsl/lib/* /usr/lib/wsl/lib2
echo /usr/lib/wsl/lib2 | sudo tee /etc/ld.so.conf.d/ld.wsl.conf
```