---
title: docker常用容器安装指令
categroy: 学习
type: 归纳整理
tags: 
    - docker
    - 命令行
    - linux
---

## gitea

```bash
mkdir -p ~/docker/gitea
```

```yml
version: "3"

networks:
  gitea:
    external: false

services:
  server:
    image: gitea/gitea:1.20.5
    container_name: gitea
    environment:
      - USER_UID=1000
      - USER_GID=1000
    restart: always
    networks:
      - gitea
    volumes:
      - ~/docker/gitea:/data
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    ports:
      - "3000:3000"
      - "22:22"
```

```bash
docker-compose up -d
```

## nginx

```bash
mkdir -p ~/docker/nginx/conf
mkdir -p ~/docker/nginx/conf.d
mkdir -p ~/docker/nginx/html
mkdir -p ~/docker/nginx/logs

docker run --name nginx -d nginx

docker cp nginx:/etc/nginx/nginx.conf ~/docker/nginx/conf/nginx.conf
docker cp nginx:/etc/nginx/conf.d/ ~/docker/nginx/conf.d/
docker cp nginx:/usr/share/nginx/html/ ~/docker/nginx/html/

docker stop nginx
docker rm nginx

docker run -p 80:80 --name nginx --restart=always \
-v ~/docker/nginx/conf/nginx.conf:/etc/nginx/nginx.conf \
-v ~/docker/nginx/conf.d:/etc/nginx/conf.d \
-v ~/docker/nginx/html:/etc/share/nginx/html \
-v ~/docker/nginx/logs:/var/log/nginx \
-d nginx
```

## 