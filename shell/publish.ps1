cd quartz
npx quartz build
cd ..
git add .
$now = Get-Date
git commit -m "Update at $now" 
git push origin main 