@echo off

echo Cleaning...
if exist dist del dist\*.* /s /q
echo Done.

echo Building...
node node_modules\typescript\bin\tsc
echo Done.
echo BUILD COMPLETE!