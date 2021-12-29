[![GitHub release](https://img.shields.io/github/v/release/DeFiCh/app)](https://github.com/DeFiCh/app/releases)
<a href="https://github.com/DeFiCh/app/releases">
<img alt="GitHub release (latest by date)" src="https://img.shields.io/github/downloads/DeFiCh/app/latest/total">
</a>
<a href="https://github.com/DeFiCh/app/graphs/contributors">
<img alt="GitHub contributors" src="https://img.shields.io/github/contributors/DeFiCh/app">
</a>
[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/DeFiCh/app/blob/main/LICENSE)
<a href="https://twitter.com/defichain">
<img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/defichain?style=social">
</a>
<a href="https://www.reddit.com/r/defiblockchain/">
<img alt="Subreddit subscribers" src="https://img.shields.io/reddit/subreddit-subscribers/defiblockchain?style=social">
</a>

# DeFi Desktop Wallet

Use DeFi Desktop Wallet to interact with DeFiChain. It is a wallet for \$DFI, wrapped BTC, ETH, USDT. Liquidity mine, use the DEX, create masternodes, and more.
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

##### Setup the required node

To connect to the node, you need to setup the node. Run the command below that matches your Operating System.

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

## Licenses & Disclaimer

By using `DeFi Desktop App` (this repo), you (the user) agree to be bound by [the terms of this license](LICENSE).

QR scanner shutter audio `webapp/src/assets/audio/shutter.mp3` is licensed by [Soundsnap](https://www.soundsnap.com).
Commercial redistribution of the audio is prohibited. For full Soundsnap license, visit [https://www.soundsnap.com/licence](https://www.soundsnap.com/licence).
