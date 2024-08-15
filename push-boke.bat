@echo off  
setlocal  
  
:: 获取当前分支名称  
for /f "tokens=*" %%a in ('git rev-parse --abbrev-ref HEAD') do set BRANCH_NAME=%%a  
  
:: 遍历所有远程仓库  
for /f "tokens=1" %%r in ('git remote') do (  
    echo Pushing to %%r/%BRANCH_NAME%...  
    git push %%r %BRANCH_NAME%  
    if %errorlevel% neq 0 (  
        echo Failed to push to %%r/%BRANCH_NAME%  
    )  
)  
  
echo Push to all remotes completed.  
endlocal