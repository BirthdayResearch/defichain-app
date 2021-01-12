ainVersion=$1
url="https://github.com/DeFiCh/ain/releases/download/v${ainVersion}/defichain-${ainVersion}-x86_64-apple-darwin11.tar.gz"
outfile="defichain-${ainVersion}-x86_64-apple-darwin11.tar.gz";
mkdir -p binary/mac
cd binary && rm -rf win mac linux
mkdir mac
cd ..
mkdir -p temp
cd temp && rm -rf mac
mkdir mac && cd mac
wget "${url}"
tar -xvf "${outfile}"
cp "defichain-${ainVersion}/bin/defid" .
cd ../.. && cp temp/mac/defid binary/mac/defid
rm -rf temp/
chmod 777 binary/mac/defid
