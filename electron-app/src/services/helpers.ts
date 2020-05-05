import { dialog } from "electron";

export default class HelperManage {
  async getDirectoryPath() {
    const res = await dialog.showOpenDialog(null, {
      properties: ["openDirectory"],
    });
    if (res.canceled || !res.filePaths.length) {
      throw new Error("Folder not selected");
    }
    return res.filePaths;
  }

  async getFilePath(filters?: { name: string; extensions: string[] }[]) {
    const res = await dialog.showOpenDialog(null, {
      properties: ["openFile", "openDirectory"],
      filters,
    });
    if (res.canceled || !res.filePaths.length) {
      throw new Error("File not selected");
    }
    return res.filePaths;
  }
}
