import * as isElectron from '../isElectron';

describe('isElectron', () => {
  it(' shoulb be check  isElectron ', () => {
    const result = isElectron.isElectron();
    expect(result).toBeFalsy();
  });
});
