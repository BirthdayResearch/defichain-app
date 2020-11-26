import {
  createTransportReplayer,
  RecordStore,
} from '@ledgerhq/hw-transport-mocker';

const store = RecordStore.fromString(`
    => e016000000
    <= 000000050107426974636f696e034254439000
  `);
const Transport = createTransportReplayer(store);

export default Transport;
