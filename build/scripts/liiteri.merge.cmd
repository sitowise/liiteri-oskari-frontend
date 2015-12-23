@echo off

setlocal enabledelayedexpansion

if exist "%2" (
	del "%2"
)
for /F "tokens=*" %%A in (%3) do (
	REM echo %%A
	set "fileName=%%A"
	set "fileName=!fileName:/=\!"
	REM echo !fileName!	
	if exist "%1\!fileName!" (
		type "%1\!fileName!" >> "%2"
	) else (
		echo "File %1\!fileName! doesn't exist"
		exit /b 1
	)	
)