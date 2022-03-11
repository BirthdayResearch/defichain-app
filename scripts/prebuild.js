const path = require('path');
const fs = require('fs/promises');
const decompress = require('decompress');
const nodePackageJson = require('../package.json');
const Downloader = require('nodejs-file-downloader');

async function main() {
  // parent dir - dirname cuts out the leaf
  const rootDir = path.dirname(__dirname);
  const distDir = path.join(rootDir, 'dist');
  const tempDir = path.join(distDir, 'temp');
  const platforms = ['linux', 'mac', 'win'];

  const binDirs = new Map();
  platforms.forEach((platform) =>
    binDirs.set(platform, path.join('bin', platform))
  );

  const platform = processPlatformArg(process.argv[2]);

  console.log('root dir: ' + rootDir);
  await Promise.all(
    [tempDir, ...binDirs.values()].map((x) => fs.mkdir(x, { recursive: true }))
  );

  const pkgConf = nodePackageJson.config;
  const ainVersion = pkgConf.ainVersion;
  if (ainVersion.length === 0) throw new Error('invalid version');

  // Note: TODO (Add support for dev-builds and hotfixes directly with url)
  // artifactWin, artifactLinux and artifactMac expected on pkgConf.
  const artifacts = new Map();
  platforms.forEach((x) =>
    artifacts.set(x, pkgConf['artifact' + x[0].toUpperCase() + x.substring(1)])
  );

  console.log('artifacts: ', artifacts);

  const platformRunners = new Map();
  platforms.forEach((platform) =>
    platformRunners.set(platform, () =>
      downloadExtractAndCopy(
        platform,
        ainVersion,
        artifacts.get(platform),
        binDirs.get(platform),
        tempDir
      )
    )
  );

  if (platform) {
    await platformRunners.get(platform)();
    return;
  }

  await Promise.all([...platformRunners.values()].map((x) => x()));
}

async function downloadExtractAndCopy(
  platform,
  version,
  artifact,
  binDir,
  tempDir
) {
  const packageUrl = getUrl(platform, version, artifact);
  const fileName = path.basename(packageUrl);
  const filePath = `${tempDir}/${fileName}`;
  const binFileName = 'defid' + (platform == 'win' ? '.exe' : '');
  const binFilePath = `${binDir}/${binFileName}`;

  console.log(`plaform: ${platform}`);
  console.log(`package url: ${packageUrl}`);
  console.log(`bin dir: ${binDir}`);
  console.log(`temp dir: ${tempDir}`);

  console.log(`> delete: ${filePath}`);
  await fs.rm(filePath, { force: true });
  console.log(`> delete: ${binFilePath}`);
  await fs.rm(binFilePath, { force: true });

  const downloader = new Downloader({
    url: packageUrl,
    directory: tempDir,
    cloneFiles: false,
    maxAttempts: 3,
    onProgress: function (percentage, chunk, remainingSize) {
      //Gets called with each chunk.
      process.stdout.write(`${percentage} % / ${remainingSize} \r`);
    },
  });

  console.log(`> download: ${packageUrl}`);
  await downloader.download();
  process.stdout.write(`\r100 % ${' '.repeat(40)}\n`);

  console.log(`> decompress ${filePath} => ${binFilePath}`);
  await decompress(filePath, binDir, {
    filter: (file) => path.basename(file.path) == binFileName,
    strip: 2,
  });

  console.log(`> set chmod 0777 => ${binFilePath}`);
  await fs.chmod(binFilePath, 0777);
}

function getUrl(platform, version, artifact) {
  if (artifact) return artifact;
  const githubReleaseUrlBase = `https://github.com/DeFiCh/ain/releases/download/v${version}`;
  const platformSuffix = getPlatformUrlSuffix(platform);
  const fileName = `defichain-${version}-${platformSuffix}`;
  return `${githubReleaseUrlBase}/${fileName}`;
}

function getPlatformUrlSuffix(platform) {
  switch (platform) {
    case 'linux':
      return 'x86_64-pc-linux-gnu.tar.gz';
    case 'mac':
      return 'x86_64-apple-darwin18.tar.gz';
    case 'win':
      return 'x86_64-w64-mingw32.zip';
    default:
      throw new Error('invalid platform');
  }
}

function processPlatformArg(arg) {
  if (!arg) return '';
  switch (arg) {
    case 'linux':
      return 'linux';
    case 'win':
    case 'win32':
      return 'win';
    case 'mac':
    case 'darwin':
      return 'mac';
    default:
      throw new Error('invalid platform arg');
  }
}

main()
  .then(() => {
    console.log('> done');
  })
  .catch((err) => console.error(err));
