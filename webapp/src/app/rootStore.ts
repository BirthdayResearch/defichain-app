import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import log from 'loglevel';
import reducer from './rootReducer';
import sagaMiddleware, { startSaga } from './rootSaga';
import { setupI18n } from '../translations/i18n';
import { DEFAULT_LOG_LEVEL, DEBUG_LOG_LEVEL } from '../constants';

const isProduction = process.env.NODE_ENV === 'production';
const middleware = [
  ...getDefaultMiddleware({
    serializableCheck: false,
  }),
  sagaMiddleware,
];

if (!isProduction) {
  middleware.push(logger);
  log.setDefaultLevel(DEBUG_LOG_LEVEL);
} else {
  log.setDefaultLevel(DEFAULT_LOG_LEVEL);
}

const store = configureStore({
  reducer,
  middleware,
});

startSaga();
setupI18n(store);

export default store;
