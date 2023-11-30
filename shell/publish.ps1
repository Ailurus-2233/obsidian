Remove-Item -Path ./quartz/content/* -Recurse -Force
Copy-Item -Path ./note/90-publish/* -Destination ./quartz/content/ -Recurse -Force
cd quartz
npx quartz build
cd ..
git pull
git add .
$now = Get-Date
git commit -m "Update at $now" 
git push origin main
git push self main