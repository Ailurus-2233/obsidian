# 复制文件到quartz目录下，然后执行quartz的build命令，最后提交到github

Copy-Item -Path ./note/90-publish/* -Destination ./quartz/content/ -Recurse -Force
cd quartz
npx quartz build
cd ..
git pull
git add .
$now = Get-Date
git commit -m "Update at $now" 
git push origin main 