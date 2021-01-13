$ainVersion = $args[0]
$url = "https://github.com/DeFiCh/ain/releases/download/v${ainVersion}/defichain-${ainVersion}-x86_64-w64-mingw32.zip"
$outfile = "defichain-${ainVersion}-x86_64-w64-mingw32.zip";
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
curl $url -O $outfile
Expand-Archive -LiteralPath ".\${outfile}" -DestinationPath .
Copy-Item ".\defichain-${ainVersion}\bin\defid.exe" .
cd ..\..
Copy-Item temp\win\defid.exe binary\win\defid.exe
icacls binary\win\defid.exe /grant everyone:F
