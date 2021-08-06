import { createReducer } from '@reduxjs/toolkit';
import {
  increment,
  decrement,
  incrementByAmount,
} from '../actions/counterActions';
import { incrementAsync } from '../thunks/counterThunks';

const initialState = {
  value: 0,
  status: 'idle',
};

const counterReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(increment, (state, action) => {
      state.value++;
    })
    .addCase(decrement, (state, action) => {
      state.value--;
    })
    .addCase(incrementByAmount, (state, action) => {
      state.value += action.payload;
    })
    .addCase(incrementAsync.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(incrementAsync.fulfilled, (state, action) => {
      state.status = 'idle';
      state.value += action.payload;
    });
});

export default counterReducer;
