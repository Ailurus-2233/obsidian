---
title: tar 压缩命令
category: 学习
type: 归纳整理
tags:
    - linux
    - 命令行
    - 常用指令
---

## 帮助指令

```bash
tar --help
```

通过这个指令可以显示详细的使用说明，这里记录一些常用的参数

| 指令           | 缩写 | 说明                     |
| -------------- | ---- | ------------------------ |
| --create       | -c   | 创建一个压缩文件         |
| --file=ARCHIVE | -f   | 指定一个压缩文件的名称   |
| --verbose      | -v   | 显示执行进程中的文件列表 |
| --extract      | -x   | 从一个压缩文件解压出来   |
| --directory    | -C   | 指定输出目录             | 

| 压缩参数                    | 缩写 | 说明                               |
| --------------------------- | ---- | ---------------------------------- |
| --auto-compress             | -a   | 使用压缩文件后缀来确定压缩程序     |
| --no-auto-compress          |      | 不要使用压缩文件后缀来确定压缩程序 |
| --use-compress-program=PROG | -I   |                                    |
| --bzip2                     | -j   | 使用bzip2压缩程序                  |
| --xz                        | -J   | 使用xz                             |
| --lzip                      |      | 使用lzip                           |
| --lzma                      |      | 使用lzma                           |
| --lzop                      |      | 使用lzop                           |
| --zstd                      |      | 使用zstd                           |
| --gzip, --gunzip, --ungzip  | -z   | 使用gzip                           |
| --compress, --uncompress    | -Z   |                                    |

## 压缩文件

指令示例

```bash
tar -cf archive.tar file_1.txt file_2.txt # 使用tar压缩两个文件
tar -czf archive.tar.gz ./folder_name/ # 使用gzip压缩一个文件夹
tar -cf --gzip archive.tar.gz ./folder_name/ # 同上
```

## 解压缩

指令示例

```bash
tar -xf archive.tar # 解压一个tar到当前目录
tar -xzf archive.tar.gz # 解压一个gzip到本地
tar -xzf archive.tar.gz -C ./temp # 解压到temp
```
