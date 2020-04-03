import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import reducer from "./rootReducer";
import sagaMiddleware, { startSaga } from "./rootSaga";

const isProduction = process.env.NODE_ENV === "production";
const middleware = isProduction ? [sagaMiddleware] : [sagaMiddleware, logger];

const store = configureStore({
  reducer,
  middleware
});
startSaga();

export default store;
