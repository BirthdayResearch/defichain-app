import packageInfo from '../../../package.json';
import { shouldForceUpdate } from '../update.ipcRenderer';

describe('Semantic Versioning', () => {
  it('Major should force update', () => {
    const [major, minor, patch] = packageInfo.version.split('.');
    expect(shouldForceUpdate(`v${major + 1}.${minor}.${patch}`)).toBe(true);
  });

  it('Minor should force update', () => {
    const [major, minor, patch] = packageInfo.version.split('.');
    expect(shouldForceUpdate(`v${major}.${minor + 1}.${patch}`)).toBe(true);
  });

  it('Patch should not force update', () => {
    const [major, minor, patch] = packageInfo.version.split('.');
    expect(shouldForceUpdate(`v${major}.${minor}.${patch + 1}`)).toBe(false);
  });
});
