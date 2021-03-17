import { SITE_URL, RPC_V as RPCVersion } from '@defi_types/settings';
import { I18n } from 'react-redux-i18n';

export const TEST = 'test';
export const RPC_V = RPCVersion;
export const DEFAULT_LOG_LEVEL = 'info';
export const DEBUG_LOG_LEVEL = 'trace';
export const SYNC_TIMEOUT = 10000;
export const DIFF = 2000;
export const RETRY_ATTEMPT = 100;
export const SYNC_INFO_RETRY_ATTEMPT = 50;
export const DATE_FORMAT = 'MMM D, hh:mm a';
export const DATE_FORMAT_CSV = 'DD/MM/YYYY / hh:mm a';
export const PAYMENT_REQUEST_DETAIL_DATE_FORMAT = 'MMM D YYYY, hh:mm a';
export const UNPARSED_ADDRESS = 'Unparsed Address';
export const BLOCK_PAGE_SIZE = 10;
export const BLOCK_TXN_PAGE_SIZE = 10;
export const MASTERNODE_LIST_PAGE_SIZE = 10;
export const TOKEN_LIST_PAGE_SIZE = 10;
export const TOKEN_TRANSFERS_LIST_PAGE_SIZE = 10;
export const WALLET_TXN_PAGE_SIZE = 8;
export const WALLET_TXN_PAGE_FETCH_SIZE = 100000;
export const MAX_WALLET_TXN_PAGE_SIZE = 200;
export const PAYMENT_REQ_PAGE_SIZE = 5;
export const PAYMENT_REQ_LIST_SIZE = 10;
export const QUEUE_CONCURRENCY = 5;
export const VERIFY_MNEMONIC_QUIZ_QUESTIONS_LIMIT = 6;
export const VERIFY_MNEMONIC_QUIZ_OPTIONS_PER_QUESTIONS_LIMIT = 3;
export const BALANCE_CRON_DELAY_TIME = 30000;
export const BITCOIN_CLI_REGEX = /bitcoin-cli/g;
export const DEFI_CLI_TEXT = 'defi-cli';
export const DEFAULT_ELECTRON_LOG_FORMAT =
  '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [IPC-RENDERER-{level}] {text}';
export const DEFAULT_ELECTRON_LOG_SIZE = 5; // IN MBs
export const BLOCKCHAIN_START_ERROR = 'Unable to start blockchain';
export const BLOCKCHAIN_START_SUCCESS = 'blockchain started successfully';
export const MAX_MONEY = 21000000;
export const DESTRUCTION_TX =
  '0000000000000000000000000000000000000000000000000000000000000000';
export const GET_NEW_ADDRESS_TYPE = 'legacy';
export const RESIGNED_STATE = 'RESIGNED';
export const CONFIRM_BUTTON_TIMEOUT = 1000;
export const CONFIRM_BUTTON_COUNTER = 5;
export const DAT_TOKEN = 'dat';
export const DCT_TOKEN = 'dct';
export const SWAP = 'swap';
export const POOL = 'pool';
export const DELETE = 'delete';
export const CREATE_DCT = 'dat';
export const MINIMUM_DFI_REQUIRED_FOR_TOKEN_CREATION = 101;
export const DCT_DISTRIBUTION = 'dct';
export const TOKEN_TRANSFERS = 'Transfers';
export const TOKEN_HOLDERS = 'Holders';
export const TOKEN_INFO = 'Info';
export const TOKEN_EXCHANGE = 'Exchange';
export const TOKEN_DEX = 'DEX';
export const TOKEN_READ_CONTRACT = 'Read Contract';
export const TOKEN_WRITE_CONTRACT = 'Write Contract';
export const TOKEN_ANALYSIS = 'Analysis';
export const TOKEN_COMMENTS = 'Comments';
export const UPDATE_MODAL_CLOSE_TIMEOUT = 1000;
export const ENTROPY_BITS = 256;
export const RANDOM_WORD_ENTROPY_BITS = 128;
export const DEFAULT_DFI_FOR_ACCOUNT_TO_ACCOUNT = 0.01;
export const DEFAULT_DFI_FOR_REFRESH_UTXOS = 0.1;
export const MINIMUM_UTXOS_FOR_LIQUIDITY = 0.05;
export const UNDEFINED_STRING = 'undefined';
export const LIST_TOKEN_PAGE_SIZE = 500;
export const LIST_ACCOUNTS_PAGE_SIZE = 100000;

export const MIN_WORD_INDEX = 1;
export const MAX_WORD_INDEX = 4;
export const TOTAL_WORD_LENGTH = 24;
export const RANDOM_WORD_LENGTH = 18;
export const MAIN = 'main';
export const ADD = 'add';
export const REMOVE = 'remove';

export const POOL_PAIR_PAGE_SIZE = 500;
export const SHARE_POOL_PAGE_SIZE = 100000;
export const IS_WALLET_LOCKED_MAIN = 'isWalletLockedMain';
export const IS_WALLET_LOCKED_TEST = 'isWalletLockedTest';
export const MASTERNODE_PARAMS_INCLUDE_FROM_START = true;
export const MASTERNODE_PARAMS_MASTERNODE_LIMIT = 1000;

export const LP_DAILY_DFI_REWARD = 'LP_DAILY_DFI_REWARD';
export const LP_SPLITS = 'LP_SPLITS';
export const VS_CURRENCY = 'usd';
export const BTC = 'BTC';

export const DFI_SYMBOL = '0';
export const BTC_SYMBOL = '1';
export const ETH_SYMBOL = '2';
export const USDT_SYMBOL = '5';
export const LTC_SYMBOL = '9';
export const DOGE_SYMBOL = '7';
export const BCH_SYMBOL = '11';
export const MAINNET_ETH_SYMBOL = '1';
export const MAINNET_BTC_SYMBOL = '2';
export const MAINNET_USDT_SYMBOL = '3';
export const MAINNET_LTC_SYMBOL = '9';
export const MAINNET_DOGE_SYMBOL = '7';
export const MAINNET_BCH_SYMBOL = '11';

export const COINGECKO_DFI_ID = 'defichain';
export const COINGECKO_BTC_ID = 'bitcoin';
export const COINGECKO_ETH_ID = 'ethereum';
export const COINGECKO_USDT_ID = 'tether';
export const COINGECKO_LTC_ID = 'litecoin';
export const COINGECKO_DOGE_ID = 'dogecoin';
export const COINGECKO_BCH_ID = 'bitcoin-cash';

export const API_REQUEST_TIMEOUT = 5000;
export const STATS_API_BASE_URL = 'https://api.defichain.io/v1/';
export const STATS_API_BLOCK_URL = `${STATS_API_BASE_URL}getblockcount`;
export const COINGECKO_API_BASE_URL = 'https://api.coingecko.com/api/v3';
export const TELEGRAM_GERMAN_HELP_LINK = 'https://t.me/defiblockchain_DE';
export const TELEGRAM_ENGLISH_HELP_LINK = 'https://t.me/defiblockchain';
export const GITHUB_ISSUE_HELP_LINK =
  'https://github.com/DeFiCh/app/wiki/How-to-submit-issues-for-Defi-App';
export const DEFICHAIN_OFFICIAL_HELP_LINK = SITE_URL;
export const DEFICHAIN_FAQ_HELP_LINK = `${DEFICHAIN_OFFICIAL_HELP_LINK}learn/#faq`;
export const REDDIT_HELP_LINK = 'https://www.reddit.com/r/defiblockchain/';
export const COMMUNITY_WIKI_LINK = 'https://defichain-wiki.com/';
export const LEARN_MORE_ABOUT_BITCOIN_LINK =
  'https://en.bitcoin.it/wiki/Seed_phrase#:~:text=A%20seed%20phrase%2C%20seed%20recovery,write%20it%20down%20on%20paper';

export const DEFICHAIN_DEX_YOUTUBE_LINK = 'https://youtu.be/JLu16bdlYrM';
export const LIQUIDITY_MINING_YOUTUBE_LINK = 'https://youtu.be/G3PT0fU__mM';
export const DEFICHAIN_IMPERMANENT_YOUTUBE_LINK =
  'https://youtu.be/s-3kUdErY5M';

export const DEFICHAIN_MAINNET_LINK = 'https://mainnet.defichain.io/';
export const DEFICHAIN_TESTNET_LINK = 'https://testnet.defichain.io/';

export const DEX_EXPLORER_BASE_LINK = 'https://dex.defichain.com/';

export const IS_DEX_INTRO_SEEN = 'isDexIntroSeen';

export const RESET_WALLET_CONFIRMATION_TEXT = 'RESET';

export const TX_TYPES = {
  CreateMasternode: 'CreateMasternode',
  ResignMasternode: 'ResignMasternode',
  CreateToken: 'CreateToken',
  UpdateToken: 'UpdateToken',
  UpdateTokenAny: 'UpdateTokenAny',
  MintToken: 'MintToken',
  CreatePoolPair: 'CreatePoolPair',
  UpdatePoolPair: 'UpdatePoolPair',
  PoolSwap: 'PoolSwap',
  AddPoolLiquidity: 'AddPoolLiquidity',
  RemovePoolLiquidity: 'RemovePoolLiquidity',
  UtxosToAccount: 'UtxosToAccount',
  AccountToUtxos: 'AccountToUtxos',
  AccountToAccount: 'AccountToAccount',
  SetGovVariable: 'SetGovVariable',
  NonTxRewards: 'Rewards',
};
export const RECIEVE_CATEGORY_LABEL = 'Receive';
export const RECIEVEE_CATEGORY_LABEL = 'receive';
export const SENT_CATEGORY_LABEL = 'sent';
export const TRANSFER_CATEGORY_LABEL = 'Transfer';
export const ACCOUNT_TO_UTXOS_LABEL = 'AccountToUtxos';
export const ACCOUNT_TO_ACCOUNT_LABEL = 'AccountToAccount';
export const ANY_ACCOUNT_TO_ACCOUNT_LABEL = 'AnyAccountsToAccounts';
export const REWARD_CATEGORY_LABEL = 'Reward';
export const COMMISSION_CATEGORY_LABEL = 'Commission';
export const SWAP_CATEGORY_LABEL = 'Swap';
export const REWARDS_CATEGORY_LABEL = TX_TYPES.NonTxRewards;
export const POOL_SWAP_CATEGORY_LABEL = TX_TYPES.PoolSwap;
export const ADD_POOL_LIQUIDITY_LABEL = TX_TYPES.AddPoolLiquidity;
export const REMOVE_LIQUIDITY_LABEL = TX_TYPES.RemovePoolLiquidity;
export const UTXOS_TO_ACCOUNT_LABEL = TX_TYPES.UtxosToAccount;

// NOTE: APY calculation to use 37 second block time
export const APY_MULTIPLICATION_FACTOR = 100 * (30 / 37);
export const REFRESH_TESTPOOLSWAP_COUNTER = 1000;
export const PRICE_IMPACT_WARNING_FACTOR = 0.2;

export const TXN_CSV_HEADERS = [
  { label: 'Block Height', key: 'blockHeight' },
  { label: 'Block Hash', key: 'blockHash' },
  { label: 'Date(DD/MM/YYYY)/Time', key: 'blockTime' },
  { label: 'Address', key: 'owner' },
  { label: 'Type', key: 'type' },
  { label: 'Pool ID', key: 'poolID' },
  { label: 'Amount', key: 'amounts' },
];

export const DEFAULT_TOKEN_VALUE = 0;
export const MINE = 'mine';
export const ALL = 'all';
export const SAME_AS_OWNER_ADDRESS = 'Same as owner address';
