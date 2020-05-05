import HelperManage from "./../services/helpers";
import log from "loglevel";
import { MENU_BACKUP_WALLET, MENU_IMPORT_WALLET } from "../constant";

export default class Wallet {
  async load(bw: Electron.BrowserWindow) {
    try {
      const filter = [{ name: "Wallet", extensions: ["dat"] }];
      const helperManage = new HelperManage();
      const paths = await helperManage.getFilePath(filter);
      bw.webContents.send(MENU_IMPORT_WALLET, { paths });
    } catch (err) {
      log.error(err);
    }
  }

  async backup(bw: Electron.BrowserWindow) {
    try {
      const helperManage = new HelperManage();
      const paths = await helperManage.getDirectoryPath();
      if (!paths.length) {
        throw new Error("No valid path available");
      }
      bw.webContents.send(MENU_BACKUP_WALLET, { paths });
    } catch (err) {
      log.error(err);
    }
  }
}
