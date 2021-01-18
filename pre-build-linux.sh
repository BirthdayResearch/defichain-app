#!/bin/sh
#!/usr/bin/env fish
ainVersion=$1
url="https://github.com/DeFiCh/ain/releases/download/v${ainVersion}/defichain-${ainVersion}-x86_64-pc-linux-gnu.tar.gz"
outfile="defichain-${ainVersion}-x86_64-pc-linux-gnu.tar.gz";
mkdir -p binary
cd binary && rm -rf win mac linux
mkdir linux
cd ..
mkdir -p temp
cd temp && rm -rf linux
mkdir linux && cd linux
wget "${url}"
tar -xvf "${outfile}"
cp "defichain-${ainVersion}/bin/defid" .
cd ../.. && cp temp/linux/defid binary/linux/defid
rm -rf temp/
chmod 777 binary/linux/defid
