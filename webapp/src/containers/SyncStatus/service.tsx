import RpcClient from '../../utils/rpc-client';
import { getTotalBlocks } from '../../utils/utility';
import * as log from '../../utils/electronLogger';
import { ipcRendererFunc } from '../../utils/isElectron';
import { ON_SNAPSHOT_DATA_REQUEST } from '../../../../typings/ipcEvents';
import store from '../../app/rootStore';
import { onSnapshotDataSuccess } from '../../app/snapshot.ipcRenderer';
import { setStats } from '../RpcConfiguration/reducer';

export const getBlockSyncInfo = async () => {
  const rpcClient = new RpcClient();
  const latestSyncedBlock = await rpcClient.getLatestSyncedBlock();
  let latestBlock = 0;
  try {
    const latestBlockInfoArr = await getTotalBlocks();
    latestBlock = latestBlockInfoArr.data.count.blocks;
    store.dispatch(setStats(latestBlockInfoArr.data));
  } catch (e) {
    // Use getpeerinfo rpc call, if not able to get data from stats api
    const latestBlockInfoArr: any = await rpcClient.getPeerInfo();
    latestBlock = latestBlockInfoArr.length
      ? Math.max.apply(
          Math,
          latestBlockInfoArr.map(
            (o: { startingheight: any }) => o.startingheight
          )
        )
      : 0;
    log.error(e, 'getBlockSyncInfo');
  }

  const percentage = (latestSyncedBlock / latestBlock) * 100;

  const syncedPercentage =
    percentage > 100
      ? Math.min(100, percentage).toFixed(2)
      : Math.max(0, percentage).toFixed(2);
  return { latestSyncedBlock, latestBlock, syncedPercentage };
};

export const snapshotDownloadRequest = (): void => {
  const { popover } = store.getState();
  if (popover?.snapshotDownloadData?.remoteSize === 0) {
    const ipcRenderer = ipcRendererFunc();
    ipcRenderer.send(ON_SNAPSHOT_DATA_REQUEST);
  } else {
    onSnapshotDataSuccess(popover?.snapshotDownloadData);
  }
};
