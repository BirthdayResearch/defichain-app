mkdir binary -ea 0
cd binary
rm -r -fo win, mac, linux -ErrorAction Ignore
mkdir win
cd ..
mkdir temp -ea 0
cd temp
rm -r -fo win -ErrorAction Ignore
mkdir win
cd win
curl https://github.com/DeFiCh/ain/releases/download/v1.3.17rc3/defichain-1.3.17rc3-x86_64-w64-mingw32.zip -O defichain-1.3.17rc3-x86_64-w64-mingw32.zip
Expand-Archive -LiteralPath .\defichain-1.3.17rc3-x86_64-w64-mingw32.zip -DestinationPath .
Copy-Item .\defichain-1.3.17rc3\bin\defid.exe .
cd ..\..
Copy-Item temp\win\defid.exe binary\win\defid.exe
icacls binary\win\defid.exe /grant everyone:F
