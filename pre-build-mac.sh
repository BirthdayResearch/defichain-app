mkdir -p binary
cd binary && rm -rf win mac linux
mkdir mac
cd ..
mkdir -p temp
cd temp && rm -rf mac
mkdir mac && cd mac
wget https://github.com/DeFiCh/ain/releases/download/v1.0.2/defichain-1.0.2-x86_64-apple-darwin11.tar.gz
tar -xvf defichain-1.0.2-x86_64-apple-darwin11.tar.gz
cp defichain-1.0.2/bin/defid .
cd ../.. && cp temp/mac/defid binary/mac/defid
chmod 777 binary/mac/defid
