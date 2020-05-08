import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import reducer from './rootReducer';
import sagaMiddleware, { startSaga } from './rootSaga';
import { setupI18n } from '../translations/i18n';

const isProduction = process.env.NODE_ENV === 'production';
const middleware = [...getDefaultMiddleware(), sagaMiddleware];

if (!isProduction) {
  middleware.push(logger);
}

const store = configureStore({
  reducer,
  middleware,
});

startSaga();
setupI18n(store);

export default store;
