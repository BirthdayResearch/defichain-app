import * as bip39 from 'bip39';
import randomBinary from 'random-binary';

export default class Mnemonic {
  constructor() {}

  getRandomEntropy = (bits: number) => {
    return randomBinary({ bit: bits });
  };

  createMnemonic = (entropyBits: number) => {
    return bip39.generateMnemonic(entropyBits);
  };

  isValidMnemonic = (mnemonic: string) => {
    return bip39.validateMnemonic(mnemonic);
  };
}
