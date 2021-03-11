import openNewTab from '../openNewTab';

describe('shoulb be check openNewTab', () => {
  it('shoulb be open new tab', () => {
    const result = openNewTab('link');
    expect(result).toBeUndefined();
  });
});
