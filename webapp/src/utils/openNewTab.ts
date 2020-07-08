import { isElectron, getElectronProperty } from './isElectron';

const openNewTab = (link) => {
  if (isElectron()) {
    const shell = getElectronProperty('shell');
    shell.openExternal(link);
  } else {
    window.open(link, '_blank');
  }
};

export default openNewTab;
