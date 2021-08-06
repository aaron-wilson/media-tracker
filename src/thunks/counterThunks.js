import { createAsyncThunk } from '@reduxjs/toolkit';
import selectCount from '../selectors/counterSelectors';
import fetchCount from '../utils/counterApi';
import { incrementByAmount } from '../actions/counterActions';

export const incrementAsync = createAsyncThunk(
  'counter/fetchCount',
  async (amount) => {
    const response = await fetchCount(amount);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  },
);

export const incrementIfOdd = (amount) => (dispatch, getState) => {
  const currentValue = selectCount(getState());
  if (currentValue % 2 === 1) {
    dispatch(incrementByAmount(amount));
  }
};
