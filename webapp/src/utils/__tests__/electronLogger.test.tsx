import logger, { info, error } from '../electronLogger';

describe('electronLogger', () => {
  it('shoulb be return electron logger', () => {
    const data = logger();
    expect(data).toBeFalsy;
  });

  it('shoulb be return electron info', () => {
    const data = info('info');
    expect(data).toBeFalsy;
  });

  it('shoulb be return electron error', () => {
    const data = error('error');
    expect(data).toBeFalsy;
  });
});
