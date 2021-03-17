# DeFi Wallet

Use DeFi Wallet to interact with DeFiChain. It is a wallet for \$DFI, wrapped BTC, ETH, USDT. Liquidity mine, use the DEX, create masternodes, and more.
![Image](https://defichain.com/img/app/liquidity@2x.png)

# Documentation

- [Getting started](#getting-started)
- [Development](#development)
- [About Us](https://defichain.com/)

# Getting Started

[Download the desktop app](https://defichain.com/downloads/) or [check releases](https://github.com/DeFiCh/app/releases) for latest downloadable installers for Windows, Mac and Linux.

# Development

## Initial Setup

##### Install all dependencies for both Electron and WebApp

```bash
npm run init
```

##### Setup the required binary

To connect to the node, you need to setup the binary. Run the command below that matches your Operating System.

| Operating System | Command                   |
| ---------------- | ------------------------- |
| Windows          | `npm run pre:build:win`   |
| Mac              | `npm run pre:build:mac`   |
| Linux            | `npm run pre:build:linux` |

## Running Apps (Electron and WebApp)

##### To run both apps in Dev Mode

```bash
npm run start:dev
```

##### To run WebApp only

```bash
npm run start:react
```

##### To run Electron only

Note: This is used to test a compiled build (Dev or Prod) of React app. You need to have a compiled React app for this command to work.

```bash
npm run start:electron
```

## Building Apps

##### To build the app using native platform

```bash
npm run build
```

##### To build the app for all platforms

```bash
npm run build:all
```

## Licenses

The DeFi Wallet is released under the terms of the MIT license. For more information see https://opensource.org/licenses/MIT.

QR scanner shutter audio `webapp/src/assets/audio/shutter.mp3` is licensed by [Soundsnap](https://www.soundsnap.com).
Commercial redistribution of the audio is prohibited. For full Soundsnap license, visit [https://www.soundsnap.com/licence](https://www.soundsnap.com/licence).
