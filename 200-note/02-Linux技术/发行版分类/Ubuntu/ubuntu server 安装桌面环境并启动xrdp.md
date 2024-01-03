**环境说明：** ubuntu server 20.04.5

**安装桌面：** xfce4 

**安装指令：**

```bash
// 安装软件
sudo apt-get install xorg xfce4 xrdp -y
// 在需要远程登陆的用户下
echo xfce4-session >~/.xsession
// 启动xrdp
sudo systemctl start xrdp
// xrdp开机启动
sudo systemctl enable xrdp
```

配置文件路径`etc/xrdp/xrdp.ini`

直接使用win的远程登陆即可

**使用mobaxterm的xserver使用桌面**

先点击右上开启xerver，并记录`ip:0`，在ubuntu server中输入以下指令

```
exprot DISPLAY=ip:0
xfce4-session
```

即可启动xfce4桌面