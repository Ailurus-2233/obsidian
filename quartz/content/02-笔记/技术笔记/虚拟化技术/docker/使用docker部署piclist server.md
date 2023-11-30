---
title: docker部署piclist server
---


## 新建 node 容器

### 编辑文件 docker-compose.yml

``` yml
services:
  caddy:
    image: node:16.20.1
    container_name: piclist
    restart: always
    networks:
      caddy:
    stdin_open: true
    tty: true

networks:
  caddy:
    external: true
```

### 启动 node 容器

``` bash
docker compose up -d
```
## 安装PicList

### 进入 node 容器

```bash
docker exec -it piclist bash
```

### 修改国内安装源

```bash
npm config set sharp_binary_host "https://npm.taobao.org/mirrors/sharp"
npm config set sharp_libvips_binary_host "https://npm.taobao.org/mirrors/sharp-libvips"
npm config set registry http://registry.npm.taobao.org/
yarn config set registry http://registry.npm.taobao.org/
```

### 执行安装
```bash
npm install sharp
yarn global add piclist
```

### 修改picgo的换行格式

```bash
sed -i 's#http://deb.debian.org#https://mirrors.163.com#g' /etc/apt/sources.list # 换源
apt update
apt install dos2unix
dos2unix /usr/local/share/.config/yarn/global/node_modules/piclist/bin/picgo
dos2unix /usr/local/share/.config/yarn/global/node_modules/piclist/bin/picgo-server
```

### 配置上传信息

```bash
picgo set uploader
```

### 启动picgo-server

```bash
picgo-server
```

如果正常启动则可以进行后续操作
## 修改镜像

### 打包当前镜像

``` bash
docker commit piclist piclist:v1
```

### 停止 piclist 容器

``` bash
docker compose down
```

### 修改 docker-compose.yml

``` yaml
services:
  caddy:
    image: piclist:v1
    container_name: piclist
    restart: always
    networks:
      caddy:
    command: picgo-server
    stdin_open: true
    tty: true

networks:
  caddy:
    external: true
```

其中修改了 image 的内容，增加了启动时执行的命令

### 启动新的镜像

``` bash
dokcer compose up -d
```


## 其他步骤

到这里已经完成piclist服务端的docker部署了，但是现在仍然有一些问题，一些有docker部署经验的人已经发现了，我并没有开放任何端口到宿主机，所以其实外部并不能访问到这个服务，这个时候需要进行一定的修改，例如在`docker-compose.yml`中添加port字段，来将容器内部的36677映射到宿主机中的任何一个端口，通过ip:端口也能访问到，也可参考我另一个笔记，使用caddy来统一管理容器对外开放的地址。

