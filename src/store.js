import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './reducers/counterReducer';

// rootReducer
const reducer = {
  counter: counterReducer,
};

const store = configureStore({
  reducer,
});

export default store;
