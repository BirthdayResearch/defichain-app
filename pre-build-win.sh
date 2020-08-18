# mkdir -p binary
# cd binary && rm -rf win mac linux
# mkdir win
# cd ..
# mkdir -p temp
# cd temp && rm -rf win
# mkdir win && cd win
# curl https://github.com/DeFiCh/ain/releases/download/v1.0.0-rc1/defichain-1.0.0-rc1-x86_64-w64-mingw32.zip -O defichain-1.0.0-rc1-x86_64-w64-mingw32.zip
# unzip defichain-1.0.0-rc1-x86_64-w64-mingw32.zip
# cp defichain-1.0.0-rc1/bin/defid.exe .
# cd ../.. && cp temp/win/defid.exe binary/win/defid.exe
# chmod 777 binary/win/defid.exe
echo "configured in workflow"
