# DeFi app

![Image](https://i.imgur.com/F7tpKU5.png)

# Documentation

- [Getting started](#getting-started)
- [Development](#development)
- [About Us](https://defichain.com/)

# Getting Started

For direct downloads, check the [Releases](https://github.com/DeFiCh/app/releases) for latest downloadable binaries for Windows, Mac and Linux.

# Development

## Initial Setup

##### 1. Run the `npm run init` to install all dependencies for both Electron and WebApp

##### 2. Setup the required binary

- To connect to the node, you need to setup the binary.
- Run the command below that matches your Operating System
  Operating System | NPM Command
  ------------- | -------------
  Windows | `npm run pre:build:win`
  Mac | `npm run pre:build:mac`
  Linux | `npm run pre:build:linux`

## Running Apps

##### - To run both apps in Dev Mode

```bash
npm run start:dev
```

##### - To run WebApp only

```bash
npm run start:react
```

##### - To run Electron only

```bash
npm run start:electron
```

## Building Apps

##### - To build the app using native platform

```bash
npm run build
```

##### - To build the app for all platforms

```bash
npm run build:all
```

## Electron Configuration

##### - Electron configuration is in [electron-app/index.ts](electron-app/index.ts)

## License

The DeFi Blockchain App is released under the terms of the MIT license. For more information see https://opensource.org/licenses/MIT.

QR scanner shutter audio `webapp/src/assets/audio/shutter.mp3` is licensed by [Soundsnap](https://www.soundsnap.com).
Commercial redistribution of the audio is prohibited. For full Soundsnap license, visit [https://www.soundsnap.com/licence](https://www.soundsnap.com/licence).
