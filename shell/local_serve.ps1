Copy-Item -Path ./note/90-publish/* -Destination ./quartz/content/ -Recurse -Force
cd quartz
npx quartz build --serve
cd ..