import * as bip39 from 'bip39';
import randomBinary from 'random-binary';

export default class Mnemonic {
  constructor() {}

  getRandomEntropy = (bits: number) => {
    return randomBinary({ bit: bits });
  };

  createMnemonic = (entropyBits: number) => {
    const entropy = this.getRandomEntropy(entropyBits);
    return bip39.entropyToMnemonic(entropy);
  };

  isValidMnemonic = (mnemonic: string) => {
    return bip39.validateMnemonic(mnemonic);
  };
}
