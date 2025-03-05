import { configureStore } from '@reduxjs/toolkit';
import captionsReducer from './slices/captionsSlice';

export const store = configureStore({
  reducer: {
    captions: captionsReducer,
  },
});